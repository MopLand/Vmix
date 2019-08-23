<template>
    <Modal v-model="option.show" :title="form.title" :mask-closable="false" class="spread" :loading="loading"
           @on-ok="onSubmit" width="800">
        <Form :model="form" :label-width="80">
            <FormItem label="产品地址">
                <Input type="text" :value="itemUrl" readonly/>
            </FormItem>
            <FormItem label="短标题">
                <Input type="text" v-model="form.subTitle" placeholder="短标题"/>
            </FormItem>
            <FormItem label="推广长图">
                <div class="upload-list" v-for="upload in uploads" :key="upload.uid">
                    <template v-if="upload.status === 'finished'">
                        <img :src="'/uploads/' + upload.url">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="visible=true"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="upload.showProgress" :percent="upload.percentage" hide-info/>
                    </template>
                </div>
                <Upload action="/upload"
                        :show-upload-list="false"
                        :before-upload="handleBeforeUpload"
                        :on-format-error="handleFormatError"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        type="drag" ref="upload"
                        style="display: inline-block; width: 58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="ios-camera" size="20"></Icon>
                    </div>
                </Upload>
            </FormItem>
            <FormItem label="白底主图">
                <div class="pic" v-for="i in images" :key="i" :class="{sel: i===form.pic}">
                    <input type="radio" name="pic" :value="i" v-model="form.pic">
                    <img :src="i + '_90x90'"/>
                    <div class="zoom">
                        <img :src="i + '_400x400'"/>
                    </div>
                </div>
            </FormItem>
            <FormItem label="短视频">
                <Input type="text" :value="videoUrl" placeholder="短视频" readonly/>
                <video class="video" controls :src="form.video" v-if="form.video"/>
            </FormItem>
            <FormItem label="优惠券">
                <Select v-model="couponUrl" @on-change="checkCoupon">
                    <Option v-if="form.mmCouponUrl" :value="form.mmCouponUrl">报名券</Option>
                    <Option v-if="form.couponUrl" :value="form.couponUrl">单品券</Option>
                </Select>
                <Input type="text" v-model="couponUrl" style="margin-top: 5px;" @on-blur="checkCoupon(couponUrl)"/>
                <Card style="margin-top: 5px;" v-if="coupon">
                    <ul>
                        <li>
                            <a :href="couponUrl" target="_blank">优惠券连接</a>
                            -
                            <a :href="coupon.item.shareUrl" target="_blank">二合一链接</a>
                        </li>
                        <li>有效期：{{ coupon.effectiveStartTime }} - {{ coupon.effectiveEndTime }}</li>
                        <li>优惠券：¥{{ Number(coupon.amount).toFixed(2) }} 满{{ Number(coupon.startFee).toFixed(2) }}可用</li>
                        <li>原价：¥{{ Number(coupon.item.discountPrice).toFixed(2) }}</li>
                        <li>券后价：¥{{ (coupon.item.discountPrice - coupon.amount).toFixed(2) }}</li>
                        <li v-show="coupon.item.postFree == 1">包邮：是</li>
                    </ul>
                </Card>
            </FormItem>
            <FormItem label="推广文案">
                <Input type="textarea" placeholder="商品推荐语 文案" v-model="form.itemDesc" :rows="3"/>
            </FormItem>
        </Form>
        <Modal v-model="visible" footer-hide>
            <img :src="'/uploads/' + uploads[0].url" v-if="visible" style="width: 100%">
        </Modal>
    </Modal>
</template>

<script>
    import {Modal, Form, FormItem, Input, Select, Option, Card, Upload, Icon, Progress} from 'iview'

    export default {
        components: {
            Modal, Form, FormItem, Input, Select, Option, Card, Upload, Icon, Progress
        },
        name: "Spread",
        props: {
            option: {
                type: Object,
                default: function _default() {
                    return {show: false, data: {}}
                }
            }
        },
        computed: {
            itemUrl() {
                return (/^https?:\/\//.test(this.form.auctionUrl) ? '' : 'https:') + this.form.auctionUrl;
            },
            videoUrl() {
                let video = this.form.video;
                if (!video || video === '' || video === null || video === undefined) return video;
                return 'https:' + video
            },
            price() {
                return this.coupon ? this.coupon.item.discountPrice : null
            },
            activityId() {
                return this.coupon ? this.coupon.activityId : null
            },
            postFree() {
                return this.coupon ? this.coupon.item.postFree : null
            }
        },
        watch: {
            'option.show'(val) {
                if (val) {
                    this.loadData()
                } else {
                    this.couponUrl = null;
                    this.coupon = null;
                    this.images = [];
                    this.form = {
                        auctionUrl: null,
                        pic: null,
                        video: null,
                    };
                    this.handleRemove()
                }
            }
        },
        data() {
            return {
                couponUrl: null,
                coupon: null,
                images: [],
                form: {
                    auctionUrl: null,
                    pic: null,
                    video: null,
                },
                loading: true,

                uploads: [],
                visible: false,
            }
        },
        methods: {
            async loadData() {
                Object.assign(this.form, this.option.data);

                let result = await this.$jsonp('https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/', {
                    ttid: '2017@taobao_h5_6.6.0',
                    data: JSON.stringify({itemNumId: this.form.itemId.toString()})
                });

                try {
                    if (result.ret[0] === 'SUCCESS::调用成功') {
                        const data = result.data;
                        this.images = data.item.images;
                        this.form.pic = this.form.pic || this.images[0];
                        this.form.subTitle = data.item.subtitle;

                        try {
                            const json = JSON.parse(data.apiStack[0]['value']);
                            const url = json.item['videos'][0].url;
                            this.form.video = url.replace('https:', '').replace('http:', '');
                        } catch (e) {
                            this.form.video = ''
                        }
                    } else {
                        throw new Error(result.ret[0]);
                    }
                } catch (e) {
                    this.$message('加载商品信息异常：' + e.message)
                }
            },
            async checkCoupon(url) {
                this.coupon = null;
                if (!url) return false;
                try {
                    const rs = await this.$http('/coupon.parse', {
                        params: {
                            itemId: this.form.itemId,
                            couponUrl: url
                        }
                    });
                    this.coupon = rs.data
                } catch (e) {
                    return false;
                }

            },
            async onSubmit() {
                const data = this.form;
                if (!this.activityId && this.loading) {
                    this.$message.error('请选择或输入一张有效优惠券！');
                    this.loading = false;
                }
                if (!data.subTitle && this.loading) {
                    this.$message.error('请输入产品短标题！');
                    this.loading = false;
                }
                if (!data.pic && this.loading) {
                    this.$message.error('请选择一张主图！');
                    this.loading = false;
                }
                if (!data.itemDesc && this.loading) {
                    this.$message.error('请编写产品推广文案！');
                    this.loading = false;
                }
                if (this.uploads.length < 1 && this.loading) {
                    this.$message.error('请上传一张推广长图！');
                    this.loading = false;
                }

                if (!this.loading) {
                    this.$nextTick(() => {
                        this.loading = true;
                    });
                    return;
                }

                data['longPic'] = this.uploads[0].url;
                data['activityId'] = this.activityId;
                data['price'] = this.price;
                data['postFree'] = this.postFree;

                await this.$http.post('/goods', data);
                this.option.data.status = 1;
                this.option.show = false
            },
            handleFormatError(file) {
                this.$notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleBeforeUpload() {
                this.handleRemove();
                return this.uploads.length < 1;
            },
            handleSuccess(res, file) {
                file.url = res.path;
                file.name = res.name;
            },
            handleRemove() {
                this.uploads.splice(0)
            }
        },
        mounted() {
            this.uploads = this.$refs.upload.fileList
        }
    }
</script>

<style scoped>
    .upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .upload-list img {
        width: 100%;
        height: 100%;
    }

    .upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .upload-list:hover .upload-list-cover {
        display: block;
    }

    .upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .spread .pic {
        width: 92px;
        height: 92px;
        padding: 2px;
        margin: 0 10px 10px 0;
        border: 1px dashed #e2e2e2;
        vertical-align: middle;
        display: inline-block;
        position: relative;
    }

    .spread .pic:hover {
        border: 1px dashed green;
    }

    .spread .pic:hover .zoom {
        display: block;
    }

    .spread .pic.sel {
        border: 2px dashed green;
    }

    .spread .pic > .zoom > *,
    .spread .pic > * {
        width: 100%;
        height: 100%;
    }

    .spread .pic > input {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
    }

    .spread .pic > .zoom {
        position: absolute;
        left: 0;
        top: 92px;
        width: 400px;
        height: 400px;
        z-index: 999;
        display: none;
    }

    .spread .video {
        background-color: black;
        margin: 5px 0 0 0;
        width: 400px;
        height: 300px;
    }

    .spread ul {
        font-size: 12px;
    }

    .spread ul li {
        line-height: 16px;
        list-style-type: none;
    }
</style>
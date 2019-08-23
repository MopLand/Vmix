<template>
    <Dialog title="商品佣金信息" :visible.sync="option.visible" width="1000px">
        <Card style="margin-top: -15px;">
            <div>
                <Form :model="query" @submit.native.prevent="onSubmit">
                    <FormItem>
                        <el-input v-model="query.itemUrl" placeholder="商品链接">
                            <Button slot="append" type="primary" native-type="submit">查询</Button>
                        </el-input>
                    </FormItem>
                </Form>
            </div>
            <Row :gutter="10" v-if="Object.keys(privilege).length > 0">
                <el-col :md="12" :sm="24">
                    <div>
                        <template v-if="privilege.message">
                            <h2>{{ privilege.message }}</h2>
                        </template>
                        <template v-else>
                            <div>最高佣金：{{ privilege.max_commission_rate }}%</div>
                            <div class="url">
                                推广链接：<a target="_blank" :href="privilege.coupon_click_url">点击查看</a>
                                <span @click.stop="generate">生成报名和效果信息</span>
                            </div>
                            <template v-if="privilege.coupon_type">
                                <div>优惠券：{{ privilege.coupon_info }}</div>
                                <div>券类型：{{ privilege.coupon_type ===1 ? '公开券' : privilege.coupon_type === 2 ? '私有券' : privilege.coupon_type ===3 ? '妈妈券' : '未知' }}</div>
                                <div>券数量：总({{ privilege.coupon_total_count }}) 剩({{ privilege.coupon_remain_count }})</div>
                                <div>有效期：{{ privilege.coupon_start_time }} - {{ privilege.coupon_end_time }}</div>
                            </template>
                        </template>
                    </div>
                </el-col>
                <el-col :md="12" :sm="24">
                    <div>历史单价：</div>
                    <div v-for="price in prices" :key="price.time">
                        {{ price.time }}：¥{{ price.price.toFixed(2) }}
                    </div>
                </el-col>
            </Row>
        </Card>

        <Card style="margin-top: 20px;" v-if="Object.keys(uland).length > 0" id="generate" body-style="padding: 10px 5px;">
            <table style="margin-bottom: 20px;">
                <thead>
                <tr>
                    <th>商品信息</th>
                    <th>状态</th>
                    <th>排期</th>
                    <th>佣金比例</th>
                    <th>服务费率</th>
                    <th>优惠券</th>
                    <th>店铺类型</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="good-info">
                        <a :href="uland.item.clickUrl" target="_blank">
                            <img :src="uland.item.picUrl + '_100x100_.webp'"/>
                        </a>
                        <ul>
                            <li>
                                <a :href="uland.item.clickUrl" target="_blank">{{ uland.item.title }}</a>
                            </li>
                            <li class="price">
                                <span class="left">
                                    ￥<b style="font-size: 16px;">{{ Number(uland.item.discountPrice).toFixed(2).split('.', 1)[0] }}</b><b>.{{ Number(uland.item.discountPrice).toFixed(2).split('.', 2)[1] }}</b>
                                </span>
                                <span class="right">
                                    券后价：￥{{ (Number(uland.item.discountPrice) - (uland.amount || 0)).toFixed(2) }}
                                </span>
                            </li>
                            <li>销量：{{ uland.item.biz30Day }}</li>
                            <li class="shop">
                                <a :href="'https://pub.alimama.com/myunion.htm?#!/promo/self/shop_detail?userNumberId=' + uland.sellerId" target="_blank">
                                    <span class="pubfont icon-dianpu"></span> {{ uland.shopName }}
                                </a>
                                <a class="ui-ww ui-ww-online" target="_blank" v-if="uland.shopName"
                                   :href="'https://www.taobao.com/webww/ww.php?ver=3&siteid=cntaobao&status=1&charset=utf-8&touid=' + uland.shopName">
                                </a>
                            </li>
                        </ul>
                    </td>
                    <td class="audit-status">
                        <p>待招商团长审核</p>
                    </td>
                    <td class="good-time">
                        <p>起：{{ today | dateformat('YYYY-MM-DD') }}</p>
                        <p>止：{{ today | dateformat('YYYY-MM-DD') }}</p>
                    </td>
                    <td class="good-rate">
                        <b style="font-size: 16px;">
                            {{ Number(privilege.max_commission_rate).toFixed(2).split('.', 1)[0] }}
                        </b>
                        <b>.{{ Number(privilege.max_commission_rate).toFixed(2).split('.', 2)[1] }}%</b>
                    </td>
                    <td class="good-service">
                        <b style="font-size: 16px;">
                            {{ serviceRate.toFixed(2).split('.', 1)[0] }}
                        </b>
                        <b>.{{ serviceRate.toFixed(2).split('.', 2)[1] }}%</b>
                    </td>
                    <td class="good-coupon">
                        <template v-if="privilege.coupon_type">
                            <p>阿里妈妈推广</p>
                            <p>{{ privilege.coupon_info }}</p>
                            <p>（{{ privilege.coupon_remain_count }}/{{ privilege.coupon_total_count }}）</p>
                            <p><i class="ml5 pubfont icon-shuoming" style="font-size: 14px; margin-left: 5px"></i></p>
                        </template>
                        <span v-else>无</span>
                    </td>
                    <td class="good-user-type">
                        {{ uland.item.tmall === '1' ? '天猫' : '淘宝' }}
                    </td>
                </tr>
                </tbody>
            </table>
            <hr style="height:1px;border:none;border-top:1px dashed #0066CC;">
            <table>
                <thead>
                <tr>
                    <th>商品信息</th>
                    <th>引流UV</th>
                    <th>券使用量</th>
                    <th>付款笔数</th>
                    <th>付款金额</th>
                    <th>服务费率</th>
                    <th>店铺类型</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td class="good-info">
                        <a :href="uland.item.clickUrl" target="_blank">
                            <img :src="uland.item.picUrl + '_100x100_.webp'"/>
                        </a>
                        <ul>
                            <li>
                                <a :href="uland.item.clickUrl" target="_blank">{{ uland.item.title }}</a>
                            </li>
                            <li class="price">
                                ￥<b style="font-size: 16px;">{{ Number(uland.item.discountPrice).toFixed(2).split('.', 1)[0] }}</b><b>.{{
                                Number(uland.item.discountPrice).toFixed(2).split('.', 2)[1] }}</b>
                            </li>
                            <li style="color: #999;">
                                券后价：￥{{ (Number(uland.item.discountPrice) - (uland.amount || 0)).toFixed(2) }}
                                &nbsp;&nbsp; 排期：{{ scheduleTime }}
                            </li>
                        </ul>
                    </td>
                    <td>{{ Math.floor(uland.item.biz30Day * (Math.random() * 10 + 1)) }}</td>
                    <td>{{ privilege.coupon_type ? privilege.coupon_total_count - privilege.coupon_remain_count : 0 }}</td>
                    <td>{{ uland.item.biz30Day }}</td>
                    <td>￥{{ ((Number(uland.item.discountPrice) - (uland.amount || 0)) * uland.item.biz30Day).toFixed(2) }}</td>
                    <td>{{ (Math.random() * 8 + 1).toFixed(2) }}%</td>
                    <td class="good-user-type">
                        {{ uland.item.tmall === '1' ? '天猫' : '淘宝' }}
                    </td>
                </tr>
                </tbody>
            </table>
        </Card>
    </Dialog>
</template>

<script>
    import {Dialog, Card, Form, FormItem, Button, Row} from 'element-ui'

    export default {
        name: "ToolsBox",
        computed: {
            serviceRate() {
                return Math.floor(Math.random() * 5 + 1);
            },
            scheduleTime() {
                return Math.floor(Math.random() * 30 + 4)
            }
        },
        props: {
            option: {
                type: Object,
                default: function _default() {
                    return {}
                }
            }
        },
        data() {
            return {
                privilege: {},
                prices: [],
                query: {},
                uland: {},
                today: new Date()
            }
        },
        methods: {
            onSubmit() {
                if (!this.query.itemUrl) {
                    this.$alert('请输入商品链接！');
                    return;
                }
                let m = (this.query.itemUrl || '').match(/id=(\d+)&?/);
                if (!m || m.length < 2) {
                    this.$alert('请输入正确的商品链接！');
                    return;
                }

                let itemId = m[1];
                this.$axios.get('/top/tbk.privilege.get/' + itemId).then(resp => {
                    this.privilege = resp.data
                }).catch(error => {
                    this.privilege = error.response.data
                });
                this.$axios.get('/top/historical.unit.price/' + itemId).then(resp => {
                    const prices = resp.data;
                    prices.sort((a, b) => {
                        return new Date(b.time) - new Date(a.time)
                    });
                    this.prices = prices.slice(0, 6)
                })
            },
            generate() {
                this.$http.get('/top/uland.parse', {
                    params: {ulandUrl: this.privilege.coupon_click_url}
                }).then(resp => {
                    this.uland = resp.data
                })
            }
        },
        watch: {
            'option.visible'(val) {
                if (val === false) {
                    this.privilege = {};
                    this.prices = [];
                    this.uland = {};
                    this.query = {};
                }
            }
        },
        components: {
            Dialog, Card, Form, FormItem, Button, Row
        }
    }
</script>

<style scoped>
    @import 'https://at.alicdn.com/t/font_55467_e40971og7k87iudi.css';

    .url > span {
        margin-left: 10px;
        cursor: pointer;
        color: crimson;
    }

    #generate table {
        width: 100%;
        font-size: 12px;
    }

    #generate table th {
        text-align: left;
        padding: 0 5px;
    }

    #generate table td {
        padding: 0 5px;
    }

    #generate table td > p {
        margin: 0;
    }

    #generate table td > b {
        display: inline-block;
    }

    #generate table td:not(.good-info) > * {
        line-height: 24px;
    }

    .ui-ww {
        background-position: -15px 0;
        width: 16px;
        background-image: url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png);
        background-image: -webkit-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -moz-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -ms-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -o-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-repeat: no-repeat;
        zoom: 1;
        height: 15px;
    }

    .good-info li {
        list-style: none;
        line-height: 24px;
    }

    .good-info a {
        color: #666;
        text-decoration: none;
    }

    .good-info > *,
    .good-info .shop > a {
        display: inline-block;
        vertical-align: middle;
    }

    .good-info {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        box-sizing: border-box;
        width: 300px;
    }

    .good-info > a {
        width: 100px;
        height: 100px;
        text-align: center;
        position: relative;
        background: #e8e8ed;
    }

    .good-info .price {
        overflow: hidden;
        color: #000;
    }

    .good-info > ul {
        margin: 0 0 0 12px;
        padding: 0;
        width: 230px;
    }

    .audit-status {
        color: #49B6E0;
        width: 88px;
    }

    .good-time {
        width: 92px;
    }

    .good-rate,
    .good-service {
        text-align: right;
        color: #f50;
        width: 56px;
    }

    .good-coupon {
        width: 108px;
    }

    .good-user-type {
        width: 64px;
    }
</style>
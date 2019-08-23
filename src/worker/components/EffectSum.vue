<template>
    <Dialog title="推广效果汇总" :visible.sync="option.visible" width="1032px">
        <Card style="margin-top: -15px;">
            <div class="effect-sum">
                <h3>
                    <span class="status">● 推广中</span>
                    <span class="title">{{ option.data.title }}</span>
                    <a class="copy">
                        <span class="pubfont icon-fuzhi1"></span>复制商家报名链接
                    </a>
                </h3>
                <div style="overflow: hidden">
                    <div class="fl info-bar">
                        <span class="time-item">
                            <span class="color-l">报名时间</span><br/>
                            <span>
                                <span>{{ startTime }}</span>
                                <span class="z-z">至</span>
                                <span>{{ endTime }}</span>
                            </span>
                        </span>
                        <span class="time-item">
                            <span class="color-l">活动时间</span><br/>
                            <span>
                                <span>{{ startTime }}</span>
                                <span class="z-z">至</span>
                                <span>{{ endTime }}</span>
                            </span>
                        </span>
                        <span class="time-item">
                            <span class="color-l">
                                最晚审核时间<span class="pubfont icon-shuoming"></span>
                            </span><br>
                            <span>--</span>
                        </span>
                    </div>
                    <div class="fr ">
                        <div class="btns">
                            <div class="fl export-btn">导出商品</div>
                            <div class="fl">员工审核</div>
                        </div>
                    </div>
                </div>
                <div class="summary-panel">
                    <h5>效果数据汇总<span class="color-l">{{ summaryDay }}</span></h5>
                    <div class="summary-detail">
                        <dl>
                            <dt><span>推广商品数</span><span class="pubfont icon-shuoming"></span></dt>
                            <dd><span>{{ thatDay ? '--' : option.data.itemNum }}</span></dd>
                        </dl>
                        <dl>
                            <dt><span>引流UV</span><span class="pubfont icon-shuoming"></span></dt>
                            <dd><span>{{ thatDay ? '--' : option.data.clickUv }}</span></dd>
                        </dl>
                        <dl>
                            <dt><span>付款金额</span><span class="pubfont icon-shuoming"></span></dt>
                            <dd>
                                <span v-if="thatDay">--</span>
                                <span v-else>{{ number(option.data.alipayAmt)[0] }}.<i>{{ number(option.data.alipayAmt)[1] }}元</i></span>
                            </dd>
                        </dl>
                        <dl>
                            <dt><span>付款笔数</span><span class="pubfont icon-shuoming"></span></dt>
                            <dd><span>{{ thatDay ? '--' : option.data.alipayNum }}</span></dd>
                        </dl>
                        <dl>
                            <dt><span>预估付款服务费</span><span class="pubfont icon-shuoming"></span></dt>
                            <dd>
                                <span v-if="thatDay">--</span>
                                <span v-else>{{ number(option.data.preServiceFee)[0] }}.<i>{{ number(option.data.preServiceFee)[1] }}元</i></span>
                            </dd>
                        </dl>
                        <dl>
                            <dt><span>结算金额</span><span class="pubfont icon-shuoming"></span></dt>
                            <dd>
                                <span v-if="thatDay">--</span>
                                <span v-else>{{ number(option.data.settleAmt)[0] }}.<i>{{ number(option.data.settleAmt)[1] }}元</i></span>
                            </dd>
                        </dl>
                        <dl>
                            <dt><span>结算笔数</span><span class="pubfont icon-shuoming"></span></dt>
                            <dd><span>{{ thatDay ? '--' : option.data.settleNum }}</span></dd>
                        </dl>
                        <dl>
                            <dt><span>预估结算服务费</span><span class="pubfont icon-shuoming"></span></dt>
                            <dd>
                                <span v-if="thatDay">--</span>
                                <span v-else>{{ number(option.data.cmServiceFee)[0] }}.<i>{{ number(option.data.cmServiceFee)[1] }}元</i></span>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="summary-detail">
                <dl>
                    <dt><span>推广商品数</span><span class="pubfont icon-shuoming"></span></dt>
                    <dd><Input size="small" v-model="option.data.itemNum"/></dd>
                </dl>
                <dl>
                    <dt><span>引流UV</span><span class="pubfont icon-shuoming"></span></dt>
                    <dd><Input size="small" v-model="option.data.clickUv"/></dd>
                </dl>
                <dl>
                    <dt><span>付款金额</span><span class="pubfont icon-shuoming"></span></dt>
                    <dd><Input size="small" v-model="option.data.alipayAmt"/></dd>
                </dl>
                <dl>
                    <dt><span>付款笔数</span><span class="pubfont icon-shuoming"></span></dt>
                    <dd><Input size="small" v-model="option.data.alipayNum"/></dd>
                </dl>
                <dl>
                    <dt><span>预估付款服务费</span><span class="pubfont icon-shuoming"></span></dt>
                    <dd><Input size="small" v-model="option.data.preServiceFee"/></dd>
                </dl>
                <dl>
                    <dt><span>结算金额</span><span class="pubfont icon-shuoming"></span></dt>
                    <dd><Input size="small" v-model="option.data.settleAmt"/></dd>
                </dl>
                <dl>
                    <dt><span>结算笔数</span><span class="pubfont icon-shuoming"></span></dt>
                    <dd><Input size="small" v-model="option.data.settleNum"/></dd>
                </dl>
                <dl>
                    <dt><span>预估结算服务费</span><span class="pubfont icon-shuoming"></span></dt>
                    <dd><Input size="small" v-model="option.data.cmServiceFee"/></dd>
                </dl>
            </div>
        </Card>
    </Dialog>
</template>

<script>
    import {Dialog, Card, Input} from 'element-ui'
    import moment from 'moment'

    export default {
        name: "EffectSum",
        computed: {
            startTime() {
                return moment(this.option.data.startTime).format('YYYY-MM-DD');
            },
            endTime() {
                return moment(this.option.data.endTime).format('YYYY-MM-DD');
            },
            thatDay() {
                return moment().format('YYYY-MM-DD') === this.startTime
            },
            summaryDay() {
                if (this.thatDay) return '汇总数据可隔日查看'
                let day = moment().subtract(1, "days").format('YYYY-MM-DD')
                return '截止时间：' + day
            }
        },
        watch: {
            'option.visible'(val) {
                if (val) {
                    this.syncData()
                }
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
        methods: {
            async syncData() {
                await this.$http.get('/event/sync_effect_sum', {params: {eventId: this.option.data.eventId}})
            },
            number(val) {
                val = Number(val)
                let rs = (val.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
                return rs.split('.')
            }
        },
        components: {
            Dialog, Card, Input
        }
    }
</script>

<style scoped>
    @import "https://at.alicdn.com/t/font_55467_ga2qip718co.css";

    .summary-panel {
        margin-top: 20px;
    }

    .summary-panel h5 {
        font-size: 16px;
        font-weight: normal;
        padding: 0;
        margin: 0;
    }

    .summary-panel h5 > .color-l {
        font-size: 12px;
        margin-left: 20px;
    }

    .summary-detail {
        padding: 20px 0;
        font-size: 12px;
    }

    .summary-detail dl {
        display: inline-block;
        width: 20%;
        margin: 10px 0 0 0;
        padding: 0;
    }

    .summary-detail dl dt {
        color: #999;
        margin: 10px 0;
    }

    .summary-detail dl dd {
        margin: 0;
        padding: 0;
    }

    .summary-detail dl dd > span {
        font-family: tahoma;
        margin-right: 5px;
        font-size: 18px;
        font-weight: 700;
    }

    .summary-detail dl dd > span > i {
        font-style: normal;
        font-size: 12px;
    }

    dd > .el-input {
        width: 80%;
    }

    .effect-sum {
        font-size: 12px;
        color: #333;
        line-height: 1.42857143;
        font-family: "Microsoft YaHei", "å¾®è½¯é›…é»‘", STXihei, Georgia, "Times New Roman", Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow: auto;
    }

    .effect-sum h3 {
        font-weight: normal;
        margin: 10px 0;
        padding: 0;
        font-size: 22px;
    }

    .status {
        font-size: 12px;
        margin-right: 10px;
        color: green;
    }

    .effect-sum .title {
        display: inline-block;
        vertical-align: middle;
        width: 500px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .copy {
        color: #f50;
        font-size: 12px;
        margin-top: 10px;
        float: right;
        display: inline;
    }

    h3 a {
        outline: 0;
        text-decoration: none;
    }

    .icon-fuzhi1 {
        vertical-align: -3px;
        font-size: 18px;
    }

    .fl, .fr {
        display: inline;
    }

    .fl {
        float: left;
    }

    .fr {
        float: right;
    }

    .color-l {
        color: #999;
    }

    .info-bar {
        padding: 10px 0;
    }

    .info-bar .time-item {
        display: inline-block;
        padding-right: 30px;
        margin-right: 30px;
        border-right: 1px solid #e2e2e9;
    }

    .info-bar .z-z {
        margin: 0 5px;
        color: #999;
    }

    .info-bar .time-item:last-of-type {
        border: none;
    }

    .icon-shuoming {
        vertical-align: -1px;
        margin-left: 5px;
        font-size: 14px;
    }

    .btns {
        padding-top: 10px;
        overflow: hidden;
    }

    .btns > * {
        width: 120px;
        height: 40px;
        line-height: 38px;
        font-size: 14px;
        text-align: center;
        color: #333;
        background: rgba(32, 32, 64, .08);
        position: relative;
    }

    .export-btn {
        background-color: #f50;
        color: #fff;
    }

    .export-btn:after {
        position: absolute;
        right: 10px;
        font-family: pubfont;
        content: '\e60e';
    }
</style>
<template>
    <Row :gutter="10">
        <el-col :md="6" :sm="12">
            <Card>
                <div slot="header" class="clearfix">
                    <span>今日业绩</span>
                </div>
                <div>
                    成交数：{{ today.goods_num || 0 }}<br>
                    成交金额：{{ Number(today.attr_amount || 0).toFixed(2) }}<br>
                    预估服务费：{{ Number(today.service_charge || 0).toFixed(2) }}
                </div>
            </Card>
        </el-col>
        <el-col :md="6" :sm="12">
            <Card>
                <div slot="header" class="clearfix">
                    <span>昨日业绩</span>
                </div>
                <div>
                    成交数：{{ yesterday.goods_num || 0 }}<br>
                    成交金额：{{ Number(yesterday.attr_amount || 0).toFixed(2) }}<br>
                    预估服务费：{{ Number(yesterday.service_charge || 0).toFixed(2) }}
                </div>
            </Card>
        </el-col>
        <el-col :md="6" :sm="12">
            <Card>
                <div slot="header" class="clearfix">
                    <span>本月业绩</span>
                </div>
                <div>
                    成交数：{{ month.goods_num }}<br>
                    成交金额：{{ Number(month.attr_amount || 0).toFixed(2) }}<br>
                    预估服务费：{{ Number(month.service_charge || 0).toFixed(2) }}
                </div>
            </Card>
        </el-col>
        <el-col :md="6" :sm="12">
            <Card>
                <div slot="header" class="clearfix">
                    <span>上月业绩</span>
                </div>
                <div>
                    成交数：{{ y_month.goods_num }}<br>
                    成交金额：{{ Number(y_month.attr_amount || 0).toFixed(2) }}<br>
                    预估服务费：{{ Number(y_month.service_charge || 0).toFixed(2) }}
                </div>
            </Card>
        </el-col>
    </Row>
</template>

<script>
    import moment from 'moment'
    import {Card, Row} from 'element-ui'

    export default {
        name: "Home",
        data() {
            return {
                today: {},
                yesterday: {},
                month: {},
                y_month: {},
            }
        },
        mounted() {
            const today = new Date();
            this.$http.get('/bridge/index', {
                params: {
                    start: moment(today).format('YYYYMMDD'),
                    end: moment(today).format('YYYYMMDD')
                },
                loading: false
            }).then(resp => {
                this.today = resp.result
            });

            this.$http.get('/bridge/index', {
                params: {
                    start: moment(today).add(-1, 'days').format('YYYYMMDD'),
                    end: moment(today).add(-1, 'days').format('YYYYMMDD')
                },
                loading: false
            }).then(resp => {
                this.yesterday = resp.result
            });

            const m_start = new Date().setDate(1);
            this.$http.get('/bridge/index', {
                params: {
                    start: moment(m_start).format('YYYYMMDD'),
                    end: moment(today).format('YYYYMMDD')
                },
                loading: false
            }).then(resp => {
                this.month = resp.result
            });

            const month_first = new Date().setDate(1);
            this.$http.get('/bridge/index', {
                params: {
                    start: moment(month_first).add(-1, 'months').format('YYYYMMDD'),
                    end: moment(month_first).add(-1, 'days').format('YYYYMMDD')
                },
                loading: false
            }).then(resp => {
                this.y_month = resp.result
            });
        },
        components: {
            Card, Row
        }
    }
</script>

<style scoped>
    .el-card {
        margin-bottom: 20px;
    }
</style>
<template>
    <div>
        <Row :gutter="16" type="flex" align="top">
            <Col span="16" :xs="24" :sm="12" :md="8">
                <Card>
                    <p slot="title">
                        <Icon type="ios-stats"></Icon>
                        集团自定义排行
                        <Tooltip content="导出当前数据" placement="right">
                            <a href="#" @click.prevent="exportTable('rangeDay')">
                                <Icon type="md-cloud-download"/>
                            </a>
                        </Tooltip>
                    </p>
                    <div slot="extra">
                        <DatePicker size="small" format="yyyy-MM-dd" type="daterange" placeholder="请选择日期" @on-change="change"
                                    :options="disabledDate"/>
                    </div>
                    <Table stripe border :columns="columns" :data="rangeDay" :loading="r_loading" :height="660"
                           ref="rangeDay" size="small" style="margin: -17px;">
                        <div slot="footer" class="total">
                            服务费合计：{{ rangeDayTotal }}
                        </div>
                    </Table>
                </Card>
            </Col>
            <Col span="16" :xs="24" :sm="12" :md="8">
                <Card>
                    <p slot="title">
                        <Icon type="ios-stats"></Icon>
                        近7天精准流量
                        <Tooltip content="导出当前数据" placement="right">
                            <a href="#" @click.prevent="exportTable('rangeDay')">
                                <Icon type="md-cloud-download"/>
                            </a>
                        </Tooltip>
                    </p>
                    <Table stripe border :columns="columns_flow" :data="flow" :loading="f_loading" :height="660"
                           ref="flow" size="small" style="margin: -17px;"/>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import {Card, Row, Col, Icon, DatePicker, Table, Tooltip} from 'iview'
    import moment from 'moment'

    export default {
        name: "Main",
        computed: {
            rangeDayTotal() {
                let total = 0;
                for (let i in this.rangeDay) {
                    if (this.rangeDay[i].payServiceFee) total += this.rangeDay[i].payServiceFee
                }
                return total.toFixed(2);
            },
        },
        data() {
            return {
                r_loading: false,
                rangeDay: [],
                columns: [
                    {type: 'index', width: 60, align: 'center', fixed: 'left'},
                    {title: '用户', key: 'nickname', width: 90, fixed: 'left'},
                    {title: '服务费', key: 'payServiceFee', width: 92, align: 'right', fixed: 'left'},
                    {title: '公司', key: 'company', width: 90},
                    {
                        title: '入职日期', key: 'create_time', minWidth: 112, align: 'center', render: (h, params) => {
                            return h('span', moment(params.row.create_time * 1000).format('YYYY-MM-DD'))
                        }
                    }
                ],
                disabledDate: {
                    disabledDate(date) {
                        return date && moment(date).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD')
                    }
                },
                f_loading: false,
                flow: [],
                columns_flow: [
                    {title: '日期', key: 'day', width: 110, fixed: 'left', align: 'center'},
                    {title: '商家数', key: 's_count', minWidth: 60, align: 'right'},
                    {title: '产品数', key: 'i_count', minWidth: 60, align: 'right'}
                ]
            }
        },
        methods: {
            exportTable(tableName) {
                this.$refs[tableName].exportCsv({});
            },
            change(f) {
                if (f.length !== 2 || !f[0] || !f[1]) return;
                this.r_loading = true;
                this.$http.get('/performance', {
                    params: {rangeDate: f}
                }).then(resp => {
                    this.rangeDay = resp.data;
                    this.r_loading = false;
                });
            },
        },
        mounted() {
            this.f_loading = true;
            this.$http.get('/flow').then(resp => {
                this.flow = resp.data;
                this.f_loading = false;
            })
        },
        components: {Card, Row, Col, Icon, DatePicker, Table, Tooltip}
    }
</script>

<style scoped>
    .ivu-card {
        margin: 10px;
    }

    .ivu-card .ivu-icon {
        font-size: 18px;
    }

    .ivu-card-extra .ivu-date-picker {
        width: 178px;
        /*position: absolute;*/
        /*right: 0;*/
        /*top: -5px;*/
    }

    .total {
        text-align: right;
        margin-right: 20px;
    }
</style>
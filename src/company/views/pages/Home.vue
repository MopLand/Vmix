<template>
    <div>
        <Head></Head>
        <div class="content" >  
            <Row :gutter="16" type="flex" align="top">
                <Col span="16" :xs="24" :sm="12" :md="8">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            公司今日排行（总榜）
                            <Tooltip content="导出当前数据" placement="right">
                                <a href="#" @click.prevent="exportTable('companyToday')">
                                    <Icon type="md-cloud-download"/>
                                </a>
                            </Tooltip>
                        </p>
                        <a href="#" slot="extra" @click.prevent="getTodayData(1)">
                            <Tooltip content="刷新" placement="left">
                                <Icon type="md-refresh"/>
                            </Tooltip>
                        </a>
                        <Table stripe border :columns="columns" :data="companyToday" :loading="ct_loading" :height="400"
                            ref="companyToday" size="small" style="margin: -17px;">
                            <div slot="footer" class="total">
                                服务费合计：{{ companyTodayTotal }}
                            </div>
                        </Table>
                    </Card>
                </Col>
                <Col span="16" :xs="24" :sm="12" :md="8">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            公司昨日排行（总榜）
                            <Tooltip content="导出当前数据" placement="right">
                                <a href="#" @click.prevent="exportTable('companyYesterday')">
                                    <Icon type="md-cloud-download"/>
                                </a>
                            </Tooltip>
                        </p>
                        <Table stripe border :columns="columns" :data="companyYesterday" :loading="cy_loading" :height="400"
                            ref="companyYesterday" size="small" style="margin: -17px;">
                            <div slot="footer" class="total">
                                服务费合计：{{ companyYesterdayTotal }}
                            </div>
                        </Table>
                    </Card>
                </Col>
                <Col span="16" :xs="24" :sm="12" :md="8">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            公司自定义排行（总榜）
                            <Tooltip content="导出当前数据" placement="right">
                                <a href="#" @click.prevent="exportTable('companyRangeDay')">
                                    <Icon type="md-cloud-download"/>
                                </a>
                            </Tooltip>
                        </p>
                        <div slot="extra">
                            <DatePicker size="small" format="yyyy-MM-dd" type="daterange" placeholder="请选择日期" @on-change="changeCompany"/>
                        </div>
                        <Table stripe border :columns="columns" :data="companyRangeDay" :loading="cr_loading" :height="400"
                            ref="companyRangeDay" size="small" style="margin: -17px;">
                            <div slot="footer" class="total">
                                服务费合计：{{ companyRangeDayTotal }}
                            </div>
                        </Table>
                    </Card>
                </Col>
            </Row>
            <!--<Row :gutter="16" type="flex" align="top">
                <Col span="16" :xs="24" :sm="12" :md="8">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            集团今日排行
                            <Tooltip content="导出当前数据" placement="right">
                                <a href="#" @click.prevent="exportTable('today')">
                                    <Icon type="md-cloud-download"/>
                                </a>
                            </Tooltip>
                        </p>
                        <a href="#" slot="extra" @click.prevent="getTodayData(0)">
                            <Tooltip content="刷新" placement="left">
                                <Icon type="md-refresh"/>
                            </Tooltip>
                        </a>
                        <Table stripe border :columns="columns" :data="today" :loading="t_loading" :height="400"
                            ref="today" size="small" style="margin: -17px;">
                            <div slot="footer" class="total">
                                服务费合计：{{ todayTotal }}
                            </div>
                        </Table>
                    </Card>
                </Col>
                <Col span="16" :xs="24" :sm="12" :md="8">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            集团昨日排行
                            <Tooltip content="导出当前数据" placement="right">
                                <a href="#" @click.prevent="exportTable('yesterday')">
                                    <Icon type="md-cloud-download"/>
                                </a>
                            </Tooltip>
                        </p>
                        <Table stripe border :columns="columns" :data="yesterday" :loading="y_loading" :height="400"
                            ref="yesterday" size="small" style="margin: -17px;">
                            <div slot="footer" class="total">
                                服务费合计：{{ yesterdayTotal }}
                            </div>
                        </Table>
                    </Card>
                </Col>
                <Col span="16" :xs="24" :sm="12" :md="8">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-film-outline"></Icon>
                            集团自定义排行
                            <Tooltip content="导出当前数据" placement="right">
                                <a href="#" @click.prevent="exportTable('rangeDay')">
                                    <Icon type="md-cloud-download"/>
                                </a>
                            </Tooltip>
                        </p>
                        <div slot="extra">
                            <DatePicker size="small" format="yyyy-MM-dd" type="daterange" placeholder="请选择日期" @on-change="change"/>
                        </div>
                        <Table stripe border :columns="columns" :data="rangeDay" :loading="r_loading" :height="400"
                            ref="rangeDay" size="small" style="margin: -17px;">
                            <div slot="footer" class="total">
                                服务费合计：{{ rangeDayTotal }}
                            </div>
                        </Table>
                    </Card>
                </Col>
            </Row>-->
        </div>
    </div>
</template>

<script>
    import {Card, Row, Col, Icon, DatePicker, Table, Tooltip,} from 'iview'
    import moment from 'moment'
    import Head from "../../components/Head"
    // import Menu from "../../components/Menu"
    export default {
        name: "Home",
        mounted() {
            this.getTodayData(2);
            this.getYesterdayData();
        },
        computed: {
            // todayTotal() {
            //     let total = 0;
            //     for (let i in this.today) {
            //         if (this.today[i].service_charge) total += this.today[i].service_charge
            //     }
            //     return Number(total).toFixed(2);
            // },
            // yesterdayTotal() {
            //     let total = 0;
            //     for (let i in this.yesterday) {
            //         if (this.yesterday[i].service_charge) total += this.yesterday[i].service_charge
            //     }
            //     return Number(total).toFixed(2);
            // },
            // rangeDayTotal() {
            //     let total = 0;
            //     for (let i in this.rangeDay) {
            //         if (this.rangeDay[i].service_charge) total += this.rangeDay[i].service_charge
            //     }
            //     return Number(total).toFixed(2);
            // },
            companyTodayTotal() {
                let total = 0;
                for (let i in this.companyToday) {
                    if (this.companyToday[i].service_charge)
                     total += Number(this.companyToday[i].service_charge)
                    
                }
                // console.log(total)
                return Number(total).toFixed(2);
            },
            companyYesterdayTotal() {
                let total = 0;
                for (let i in this.companyYesterday) {
                    if (this.companyYesterday[i].service_charge) 
                    total += Number(this.companyYesterday[i].service_charge)
                }
                return Number(total).toFixed(2);
            },
            companyRangeDayTotal() {
                let total = 0;
                for (let i in this.companyRangeDay) {
                    if (this.companyRangeDay[i].service_charge) 
                    total += Number(this.companyRangeDay[i].service_charge)
                }
                return  Number(total).toFixed(2);
            }
        },
        data() {
            return {
                t_loading: false,
                y_loading: false,
                r_loading: false,
                ct_loading: false,
                cy_loading: false,
                cr_loading: false,
                today: [],
                yesterday: [],
                rangeDay: [],
                companyToday: [],
                companyYesterday: [],
                companyRangeDay: [],
                columns: [
                    {type: 'index', width:60, align: 'center', fixed: 'left'},
                    {title: '用户', key: 'staff_name',align: 'center', width:80, fixed: 'left'},
                    {title: '订单金额', key: 'attr_amount',align: 'center',width:95, fixed: 'left',
                                render: (h, params) => {
                                    if(params.row.attr_amount==null){
                                            return h('span', 0)
                                    }else{
                                        // console.log(params)
                                        return h('span', params.row.attr_amount)
                                    }
                                }
                                            
                    },
                    // {title: '订单数', key: 'goods_num', width: 70, fixed: 'left',
                    //             render: (h, params) => {
                    //                 if(params.row.goods_num==null){
                    //                         return h('span', 0)
                    //                 }else{
                    //                     return h('span', params.row.goods_num)
                    //                 }
                    //             }
                    // },
                    {title: '服务费', key: 'service_charge',  align: 'center', fixed: 'left', 
                                render: (h, params) => {
                                    if(params.row.service_charge==null){
                                            return h('span', 0)
                                    }else{
                                        return h('span', params.row.service_charge)
                                    }
                                }
                    },
                    {title: '入职日期', key: 'created_time',  align: 'left',minwidth:120,fixed: 'left',
                            render: (h, params) => {
                                return h('span', moment(params.row.created_time * 1000).format('YYYY-MM-DD'))
                           }
                    }
                ]
            }
        },
        methods: {
            exportTable(tableName) {
                this.$refs[tableName].exportCsv({});
            },
            getTodayData() {
                let today = moment(new Date()).format('YYYYMMDD');
                // console.log(company)
                    this.t_loading = true;
                    this.$http.get('/backend/statis/rank', {
                        params: {startDate:today,endDate:today}
                    }).then(resp => {
                        // console.log(resp)
                        this.companyToday = resp.data.result;
                        this.t_loading = false;
                    });
               
            },
             collapsedSider() {
                this.$refs.sider.toggleCollapse();
            },
            getYesterdayData() {
                let yesterday = moment(new Date()).add(-1, 'days').format('YYYYMMDD');

                this.y_loading = true;
                this.$http.get('/backend/statis/rank', {
                    params: {startDate:yesterday,endDate:yesterday}
                }).then(resp => {
                    this.companyYesterday = resp.data.result;
                    this.y_loading = false;
                });

            },
            // change(f) {
            //     if (f.length !== 2 || !f[0] || !f[1]) return;
            //     this.r_loading = true;
            //     console.log(f)
            //     this.$http.get('/backend/statis/rank', {
            //         params: {startData:f[0],endData:f[1]}
            //     }).then(resp => {
            //         this.rangeDay = resp.data.result;
            //         this.r_loading = false;
            //     });
            // },
            changeCompany(f) {
                if (f.length !== 2 || !f[0] || !f[1]) return;
                //  console.log(f)
                 let f0=moment(f[0]).format('YYYYMMDD')
                 let f1=moment(f[1]).format('YYYYMMDD')
                this.cr_loading = true;
                this.$http.get('/backend/statis/rank', {
                    params: {
                        startDate:f0,
                        endDate:f1,
                    }
                }).then(resp => {
                    this.companyRangeDay = resp.data.result;
                    this.cr_loading = false;
                })
            }
        },
        components: {Card, Row, Col, Icon, DatePicker, Table, Tooltip,Head,}
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
    }

    .total {
        text-align: right;
        margin-right: 20px;
    }
   .content{
       margin:70px 10px 10px 220px;
    }
    @media screen and (max-width: 500px) {
       .content {
            margin-left:10px;
        }
    }
</style>
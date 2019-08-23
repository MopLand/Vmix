<template>
    <div>
        <Form inline :model="query" @submit.native.prevent="onSubmit">
            <FormItem>
                <DatePicker type="date" placeholder="选择日期" @on-change="dayChange" format="yyyy-MM-dd" :options="disabledDate"/>

            </FormItem>
            <FormItem>
                <Button type="primary" html-type="submit">搜索</Button>
            </FormItem>
        </Form>
        <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.items"/>
        <Page :total="pagination.total" :page-size="pagination.per_page" :current.sync="pagination.page"
              show-total show-elevator @on-change="toPage"/>
    </div>
</template>

<script>
    import {Table, Page, Form, FormItem, DatePicker} from 'iview'
    import moment from 'moment'

    export default {
        name: "Stats",
        data() {
            return {
                pagination: {},
                tableHight: null,
                query: {},
                loading: false,
                columns: [
                    {title: '用户ID', key: 'id', width: 80},
                    {title: '员工', key: 'nickname', width: 140, tooltip: true},
                    {
                        title: '最后登陆时间', width: 160, align: 'center', key: 'last_login_time',
                        render: (h, params) => {
                            let val = null;
                            if (params.row.last_login_time) {
                                val = moment(params.row.last_login_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span', val)
                        }
                    },
                    {
                        title: '最后在线时间', width: 160, align: 'center', key: 'last_heartbeat',
                        render: (h, params) => {
                            let val = null;
                            if (params.row.last_heartbeat) {
                                val = moment(params.row.last_heartbeat * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span', val)
                        }
                    },
                    {
                        title: '最后审产品时间', width: 160, align: 'center', key: 'last_v_time',
                        render: (h, params) => {
                            let val = null;
                            if (params.row.last_v_time) {
                                val = moment(params.row.last_v_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span', val)
                        }
                    },
                    {title: '审核数', width: 80, align: 'right', key: 'v_count'},
                    {title: '最后登陆IP', key: 'last_login_ip'}
                ],
                disabledDate: {
                    disabledDate(date) {
                        return date && moment(date).format('YYYY-MM-DD') >= moment(new Date()).format('YYYY-MM-DD')
                    }
                }
            }
        },
        methods: {
            loadData(query) {
                if (!query.day) {
                    this.$message.warning('请选择需要查询的日期！');
                    return
                }
                query.per_page = query.per_page || 40;

                this.query = Object.assign({}, query);
                this.loading = true;
                this.$http.get('/user/stats', {params: query}).then(resp => {
                    this.pagination = resp.data;
                    this.loading = false;
                })
            },
            toPage(page) {
                this.loadData(Object.assign({}, this.query, {page: page}))
            },
            onSubmit() {
                this.loadData(Object.assign({}, this.query, {page: undefined}))
            },
            dayChange(f) {
                this.query.day = f
            }
        },
        mounted() {
            window.onresize = () => {
                this.tableHight = window.innerHeight - 209;
            }
        },
        components: {
            Table, Page, Form, FormItem, DatePicker
        }
    }
</script>

<style scoped>
    .ivu-page {
        margin: 15px 10px 10px 10px;
    }

    .ivu-form-inline {
        margin: 10px 10px 15px 10px;
    }

    .ivu-form-inline > .ivu-form-item {
        margin-bottom: 0;
    }
</style>
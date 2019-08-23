<template>
    <div>
       <Head></Head>
        <div class="content">
            <Form inline :model="query" @submit.native.prevent="onSubmit">
                <FormItem>
                    <DatePicker type="month" placeholder="选择月份" @on-change="monthChange" :options="disabledDate"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" html-type="submit">搜索</Button>
                </FormItem>
                <FormItem>
                    <InputNumber :max="1" :min="0.01" :step="0.01" v-model="query.scale" placeholder="结算比例"/>
                </FormItem>
            </Form>
            <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.items"/>
            <Page :total="pagination.total" :page-size="pagination.per_page" :current.sync="pagination.page"
                show-total show-elevator @on-change="toPage"/>
        </div>
    </div>
</template>

<script>
    import {Table, Page, Form, FormItem, DatePicker, InputNumber} from 'iview'
    import BaseTable from '../../components/BaseTable'
    import Head from "../../components/Head"
    import moment from 'moment'

    export default {
        name: "Commission",
        extends: BaseTable,
        data() {
            return {
                apiUrl: null,
                pagination: {},
                query: {
                    scale: 0.9
                },
                loading: false,
                columns: [
                    {title: '用户ID', key: 'userId', width: 80},
                    {title: '员工', key: 'nickname', width: 140, tooltip: true},
                    {title: '公司', key: 'company', width: 140},
                    {title: '联盟账号', key: 'account', width: 160, tooltip: true},
                    {
                        title: '结算日期范围', width: 180, align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.start + ' - ' + params.row.end)
                        }
                    },
                    {
                        title: '预估结算服务费', width: 130, align: 'right',
                        render: (h, params) => {
                            let val = null;
                            if (params.row.preRealServiceFee) {
                                val = params.row.preRealServiceFee.toFixed(2)
                            }
                            return h('span', val)
                        }
                    },
                    {
                        title: '实结服务费', width: 120, align: 'right',
                        render: (h, params) => {
                            let val = null;
                            if (params.row.preRealServiceFee) {
                                val = (params.row.preRealServiceFee * (this.query.scale || 1)).toFixed(2)
                            }
                            return h('span', val)
                        }
                    }
                ],
                disabledDate: {
                    disabledDate(date) {
                        return date && moment(date).format('YYYY-MM') >= moment(new Date()).format('YYYY-MM')
                    }
                }
            }
        },
        methods: {
            monthChange(f) {
                this.query.month = f + '-01'
            }
        },
        components: {
            Table, Form, FormItem, DatePicker, InputNumber, Page,Head
        },
        mounted() {
            this.apiUrl = '/settle/commission'
        }
    }
</script>
<style>
  .content{
       margin:70px 20px 20px 220px;
    }
</style>
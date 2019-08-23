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
                <FormItem label="结算比例" :label-width="80">
                    <Input v-model="settle_rate" placeholder="结算比例"/>
                </FormItem>
            </Form>
            <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.result"/>
            <Page :total="pagination.rowscount" :page-size="pagination.pagesize" :current.sync="pagination.pagenum"
                  show-total show-elevator @on-change="toPage"/>
        </div>
    </div>
</template>

<script>
    import {Table, Page, Form, FormItem, DatePicker, Input} from 'iview'
    import BaseTable from '../../components/BaseTable'
    import moment from 'moment'
    import Head from "../../components/Head"

    export default {
        name: "Settle",
        extends: BaseTable,
        data() {
            return {
                settle_rate: 0.88,
                apiUrl: null,
                columns: [
                    {title: '员工ID', key: 'staff_id', width: 100},
                    {title: '员工', key: 'staff_name', width: 120},
                    {title: '联盟账号', key: 'taobao_nick', width: 160},
                    {
                        title: '结算月份', align: 'center', width: 120,
                        render: (h) => {
                            return h('span', this.query.date)
                        }
                    },
                    {
                        title: '预估结算服务费', align: 'right', width: 140,
                        render: (h, params) => {
                            let val = '0';
                            if (params.row.settle_charge) {
                                val = params.row.settle_charge
                            }
                            return h('span', '¥' + Number(val).toFixed(2))
                        }
                    },
                    {
                        title: '实结服务费', align: 'right', width: 140,
                        render: (h, params) => {
                            return h('span', '¥' + (Number(params.row.settle_charge || '0') * this.settle_rate).toFixed(2))
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
            async loadData(query) {
                if (!query.date) {
                    this.$message.warning('请选择需要查询的月份！');
                    return
                }
                query.size = query.size || 40;
                this.query = Object.assign({}, query);
                this.loading = true;
                try {
                    await this.$http.get('/backend/statis/charge', {params: query}).then(resp => {
                        this.pagination = resp.data;
                    })
                } catch (e) {
                    console.debug(e)
                }
                this.loading = false;
            },
            monthChange(f) {
                this.query.date = f.replace('-', '')
            }
        },
        components: {
            Table, Form, FormItem, DatePicker, Head, Page, Input
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

    .content {
        margin: 70px 10px 10px 220px;
    }

    @media screen and (max-width: 500px) {
        .content {
            margin-left: 20px;
        }
    }
</style>
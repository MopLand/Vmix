<template>
    <div>
        <Head></Head>
        <div class="content">
            <Form inline :model="query" @submit.native.prevent="onSubmit">
                <FormItem>
                    <Input placeholder="订单编号" v-model="query.search"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" html-type="submit" @click="search">搜索</Button>
                </FormItem>
                <!--<FormItem>
                    <Button type="success" @click.stop="onAdd">添加</Button>
                </FormItem>-->
            </Form>
            <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.result"/>
            <Page :total="pagination.rowscount" :page-size="pagination.pagesize" :current.sync="pagination.pagenum"
                  show-total show-elevator @on-change="toPage"/>
        </div>
    </div>
</template>

<script>
    import Head from '../../../components/Head'
    import BaseTable from '../../../components/BaseTable'
    import {Form, FormItem, Input, Table, Page} from 'iview'
    import qs from 'qs'

    export default {
        name: "Agent",
        extends: BaseTable,
        components: {
            Head, Form, FormItem, Input, Table, Page
        },
        methods: {
            async onDelete(row) {
                await this.$http.post('/backend/subject/delete', qs.stringify({subject_id: row.subject_id}))
                this.$message.success('删除成功');
                this.loadData(this.query)
            },
            onAdd() {
                this.$modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.title,
                                autofocus: true,
                                placeholder: '请输入标题内容！'
                            },
                            on: {
                                input: (val) => {
                                    this.title = val;
                                }
                            }
                        })
                    },
                    onOk: async () => {
                        try {
                            await this.$http.post('/backend/subject/add', qs.stringify({subject: this.title}));
                            this.title = ''
                            this.loadData(this.query)
                        } catch (e) {
                            console.debug(e)
                        }
                    },
                    onCancel: () => {
                        this.title = ''
                    }
                })
            },
            search(){
                      console.log(this.query.search)
                     
                 this.$http.get('/backend/subject/list',qs.stringify(this.query.search)).then(res=>{  
                        console.log(res)
                        this.loadData(this.query);
                    }).catch(function (error) {
                     console.log(error);
                })
            },
        },
        data() {
            return {
                apiUrl: '/backend/subject/list',
                columns: [
                    {title: '订单编号', align: 'center', key: 'subject_id', },
                    {title: '购买人', align: 'center', key: 'subject1'},
                    {title: '销售金额', align: 'center', key: 'subject2'},
                    {title: '销售工位数', align: 'center', key: 'subject3'},
                    {title: '提成比例', align: 'center', key: 'subject4'},
                    {title: '销售提成', align: 'center', key: 'subject5'},
                    {
                        title: '提现',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.onDelete(params.row)
                                    }
                                }
                            }, '申请提现')
                        }
                    }
                ],
                title: ''
            }
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
        margin: 70px 20px 20px 220px;
    }
</style>
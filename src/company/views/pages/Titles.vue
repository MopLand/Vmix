<template>
    <div>
        <Head></Head>
        <div class="content">
            <Form inline :model="query" @submit.native.prevent="onSubmit">
                <FormItem>
                    <Input placeholder="标题ID/标题内容" v-model="query.search"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" html-type="submit" @click="search">搜索</Button>
                </FormItem>
                <FormItem>
                    <Button type="success" @click.stop="onAdd">添加</Button>
                </FormItem>
            </Form>
            <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.result"/>
            <Page :total="pagination.rowscount" :page-size="pagination.pagesize" :current.sync="pagination.pagenum"
                  show-total show-elevator @on-change="toPage"/>
        </div>
    </div>
</template>

<script>
    import Head from '../../components/Head'
    import BaseTable from '../../components/BaseTable'
    import {Form, FormItem, Input, Table, Page} from 'iview'
    import qs from 'qs'

    export default {
        name: "Titles",
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
                    {title: 'Id', type: 'index', align: 'center', width: 80},
                    {title: '标题', align: 'center', key: 'subject'},
                    {
                        title: '操作',
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
                            }, '删除')
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
     .content{
       margin:70px 10px 10px 220px;
    }
    @media screen and (max-width: 500px) {
    .content {
        margin-left: 20px;
    }
}
   
  
</style>
<template>
   <div>
        <Head></Head>
    <div class="content">
        <Form inline :model="query" @submit.native.prevent="onSubmit">
            <FormItem>
                <Input placeholder="账号/ID" v-model="query.args"/>
            </FormItem>
            <FormItem>
                <Select v-model="query.integration" placeholder="员工号">
                    <Option value="">全部</Option>
                    <Option value="1">是</Option>
                    <Option value="0">否</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Select v-model="query.status" placeholder="状态">
                    <Option value="0">正常</Option>
                    <Option value="-1">停用</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" html-type="submit">搜索</Button>
            </FormItem>
            <FormItem>
                <Button type="success" @click.stop="onEdit(null)">添加</Button>
            </FormItem>
        </Form>
        <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.items"/>
        <Page :total="pagination.total" :page-size="pagination.per_page" :current.sync="pagination.page"
              show-total show-elevator @on-change="toPage"/>
        <Modal v-model="modalShow" :title="modalTitle">
            <Form ref="form" :model="account" :rules="rule" :label-width="80" @submit.native.prevent="saveAccount('form')">
                <FormItem label="联盟ID" prop="member_id">
                    <Input v-model="account.member_id" number :disabled="modalTitle!=='新增账号'"/>
                </FormItem>
                <FormItem label="联盟账号" prop="username">
                    <Input v-model="account.username"/>
                </FormItem>
                <FormItem label="联盟密码" prop="password">
                    <Input v-model="account.password"/>
                </FormItem>
                <FormItem label="员工号" prop="integration">
                    <Checkbox v-model="account.integration" :true-value="1" :false-value="0">员工号</Checkbox>
                </FormItem>
                <FormItem label="状态" prop="status">
                    <Select v-model="account.status">
                        <Option :value="0">正常</Option>
                        <Option :value="-1">停用</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="modalShow = false">取消</Button>
                <Button type="primary" size="large" @click="saveAccount('form')">确定</Button>
            </div>
        </Modal>
    </div>
  </div>
</template>

<script>
    import BaseTable from '../../components/BaseTable'
    import {Table, Page, Form, FormItem, Input, Select, Checkbox, Option, Modal} from 'iview'
    import moment from 'moment'
    import Head from "../../components/Head"
    export default {
        name: "Account",
        extends: BaseTable,
        data() {
            return {
                apiUrl: '/system/account',
                query: {status: '0'},
                columns: [
                    {title: '联盟ID', key: 'member_id'},
                    {title: '联盟账号', key: 'username', tooltip: true},
                    {title: '密码', key: 'password', tooltip: true},
                    {
                        title: '员工号', key: 'integration', width: 80, align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.integration ? '是' : '')
                        }
                    },
                    {
                        title: '状态', key: 'status', width: 80, align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.status === -1 ? '停用' : '')
                        }
                    },
                    {
                        title: '最后在线时间', key: 'heartbeat', align: 'center', width: 156,
                        render: (h, params) => {
                            let rs = null;
                            if (params.row.heartbeat) {
                                rs = moment(params.row.heartbeat * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span', rs)
                        }
                    },
                    {
                        title: '最后登陆时间', key: 'last_login_time', align: 'center', width: 156,
                        render: (h, params) => {
                            let rs = null;
                            if (params.row.last_login_time) {
                                rs = moment(params.row.last_login_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span', rs)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.onEdit(params.row)
                                    }
                                }
                            }, '编辑')
                        }
                    }
                ],
                modalShow: false,
                modalTitle: '新增账号',
                account: {integration: 0},
                rule: {
                    member_id: [
                        {required: true, type: 'number', message: '请输入淘宝联盟ID', trigger: 'blur'},
                    ],
                    username: [
                        {required: true, message: '请输入淘宝联盟账号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入淘宝联盟密码', trigger: 'blur'}
                    ],
                    integration: [
                        {required: true, type: 'number', message: '请选择是否员工号', trigger: 'change'}
                    ],
                    status: [
                        {required: true, type: 'number', message: '请选择用户状态', trigger: 'change'}
                    ]
                }
            }
        },
        watch: {
            'modalShow'(val) {
                if (!val) {
                    this.$refs['form'].resetFields();
                    this.modalTitle = '新增账号';
                    this.account = {integration: 0};
                }
            }
        },
        methods: {
            onEdit(row) {
                if (row) {
                    this.account = Object.assign({}, row);
                    this.modalTitle = '编辑：' + row.username
                }
                this.modalShow = true;
            },
            saveAccount(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/system/account', this.account).then(() => {
                            this.loadData(this.query);
                            this.modalShow = false
                        })
                    }
                })
            }
        },
        components: {Table, Page, Form, FormItem, Input, Select, Checkbox, Option, Modal,Head}
    }
</script>
<style>
  .content{
       margin:70px 20px 20px 220px;
    }
</style>

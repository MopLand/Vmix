<template>
    <div>
        <Form inline :model="query" @submit.native.prevent="onSubmit">
            <FormItem>
                <Input placeholder="用户名、手机号、ID" v-model="query.args"/>
            </FormItem>
            <FormItem>
                <Select v-model="query.status" placeholder="状态">
                    <Option value="">全部</Option>
                    <Option value="0">正常</Option>
                    <Option value="-1">禁止登陆</Option>
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
            <Form ref="form" :model="user" :rules="rule" :label-width="60" @submit.native.prevent="saveUser('form')">
                <input type="hidden" v-model="user.id"/>
                <FormItem label="昵称" prop="nickname">
                    <Input v-model="user.nickname"/>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Row>
                        <Col span="16">
                            <Input type="password" v-model="user.password"/>
                        </Col>
                        <Col span="8">不修改密码留空即可</Col>
                    </Row>
                </FormItem>
                <FormItem label="状态" prop="status">
                    <Select v-model="user.status">
                        <Option :value="0">正常</Option>
                        <Option :value="-1">禁止登陆</Option>
                    </Select>
                </FormItem>
                <FormItem label="手机号" prop="phone">
                    <Input v-model="user.phone"/>
                </FormItem>
                <FormItem label="角色" prop="role_id">
                    <Select v-model="user.role_id" number>
                        <Option :value="role.id" v-for="role in roles" :key="role.id">{{ role.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="分公司" prop="company_id" v-if="isCompany">
                    <Select v-model="user.company_id">
                        <Option :value="c.id" v-for="c in companys" :key="c.id">{{ c.name }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="modalShow = false">取消</Button>
                <Button type="primary" size="large" @click="saveUser('form')">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import BaseTable from '../../components/BaseTable'
    import {Table, Page, Form, FormItem, Input, Select, Option, Modal, Row, Col} from 'iview'
    import moment from 'moment'

    export default {
        name: "User",
        extends: BaseTable,
        computed: {
            isCompany() {
                return this.user.role_id === 98
            }
        },
        data() {
            const validatePass = (rule, value, callback) => {
                if (!this.user.id && !value) {
                    callback(new Error('新增用户密码不能为空！'));
                } else {
                    callback();
                }
            };
            const validataCompany = (rule, value, callback) => {
                if (this.user.role_id === 98 && !value) {
                    callback(new Error('角色为分公司管理员时，必须选择所属分公司！'));
                } else {
                    callback();
                }
            };
            return {
                apiUrl: '/system/user',
                columns: [
                    {title: '用户ID', key: 'id', width: 80},
                    {title: '昵称', key: 'nickname', width: 100, tooltip: true},
                    {title: '手机号', key: 'phone', width: 120, tooltip: true},
                    {title: '权限', key: 'role_name', width: 100, tooltip: true},
                    {title: '公司', key: 'company_name', width: 100, tooltip: true},
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 100,
                        tooltip: true,
                        align: 'center',
                        render: (h, params) => {
                            return h('span', moment(params.row.create_time * 1000).format('YYYY-MM-DD'))
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 90,
                        tooltip: true,
                        render: (h, params) => {
                            let status = params.row.status;
                            switch (params.row.status) {
                                case -1:
                                    status = '禁止登陆';
                                    break;
                                case 0:
                                    status = '正常';
                                    break;
                            }
                            return h('span', status)
                        }
                    },
                    {title: '最后登陆IP', key: 'last_login_ip', minWidth: 160, tooltip: true},
                    {
                        title: '最后登陆时间',
                        key: 'last_login_time',
                        width: 156,
                        align: 'center',
                        render: (h, params) => {
                            let last_login_time = null;
                            if (params.row.last_login_time) {
                                last_login_time = moment(params.row.last_login_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span', last_login_time)
                        }
                    },
                    {
                        title: '最后心跳时间',
                        key: 'heartbeat',
                        width: 156,
                        align: 'center',
                        render: (h, params) => {
                            let heartbeat = null;
                            if (params.row.heartbeat) {
                                heartbeat = moment(params.row.heartbeat * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span', heartbeat)
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
                modalTitle: '新增员工',
                user: {status: 0, role_id: 98},
                companys: [],
                roles: [],
                rule: {
                    nickname: [
                        {required: true, message: '请输入用户昵称', trigger: 'blur'},
                    ],
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    status: [
                        {required: true, type: 'number', message: '请选择用户状态', trigger: 'change'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                    role_id: [
                        {required: true, type: 'number', message: '请选择角色权限', trigger: 'blur'}
                    ],
                    company_id: [
                        {type: 'number', message: '分公司id必须为整数', trigger: 'blur'},
                        {validator: validataCompany, trigger: 'blur'}
                    ]
                }
            }
        },
        watch: {
            'modalShow'(val) {
                if (!val) {
                    this.$refs['form'].resetFields();
                    this.modalTitle = '新增员工';
                    this.user = {status: 0, role_id: 98};
                }
            },
            'user.role_id'(val) {
                if (val !== 98) {
                    this.user.company_id = null
                }
            }
        },
        methods: {
            onEdit(row) {
                if (row) {
                    this.user = Object.assign({}, row);
                    this.modalTitle = '编辑：' + row.nickname
                }
                this.modalShow = true;
            },
            saveUser(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/system/user', this.user).then(() => {
                            this.loadData(this.query);
                            this.modalShow = false
                        })
                    }
                })
            }
        },
        mounted() {
            this.$http.get('/system/companys').then(resp => {
                this.companys = resp.data
            })
            this.$http.get('/system/roles').then(resp => {
                this.roles = resp.data
            })
        },
        components: {
            Table, Page, Form, FormItem, Input, Select, Option, Modal, Row, Col
        }
    }
</script>
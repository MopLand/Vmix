<template>
    <div>
        <Head></Head>
        <div class="content" >
            <Form inline :model="query" @submit.native.prevent="onSubmit">
                <FormItem>
                    <Input placeholder="员工" v-model="query.search"/>
                </FormItem>
                <FormItem>
                    <Select v-model="query.status" placeholder="状态">
                        <Option value="">全部</Option>
                        <Option value="1">正常</Option>
                        <Option value="0">禁止</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="query.taobao_uid" placeholder="联盟账号">
                        <Option value="">全部</Option>
                        <Option :value="a.taobao_uid" v-for="a in accounts" :key="a.taobao_uid">{{a.taobao_nick}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" html-type="submit" @click="search()">搜索</Button>
                </FormItem>
                <FormItem>
                    <Button type="success" @click.stop="onEdit2()">添加</Button>
                </FormItem>
                <!--<FormItem>
                    <Button type="error" @click.stop="onmember()">员工端登录请点击</Button>
                </FormItem>-->
            </Form>
            
            <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.result"/>
            <Page :total="pagination.rowscount" :page-size="pagination.pagesize" :current.sync="pagination.pagenum"
                  show-total show-elevator @on-change="toPage"/>
            <Modal v-model="modalShow" :title="modalTitle">
                <Form ref="form" :model="user" :rules="rule" :label-width="80" @submit.native.prevent="saveUser('form')">
                    <input type="hidden" v-model="user.staff_id"/>
                    <FormItem label="员工名称" prop="staff_name">
                        <Input v-model="user.staff_name" :disabled="user.staff_id !==null && user.staff_id !== undefined"/>
                    </FormItem>
                    <FormItem label="状态" prop="status">
                        <Select v-model="user.status">
                            <Option value="1">正常</Option>
                            <Option value="0">禁止</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="手机号" prop="phone">
                        <Input v-model="user.phone"/>
                    </FormItem>
                    <FormItem label="旺旺" prop="wangwang">
                        <Input v-model="user.wangwang"/>
                    </FormItem>
                    <FormItem label="联盟账号" prop="taobao_uid">
                        <Select v-model="user.taobao_uid">
                            <Option :value="a.taobao_uid" v-for="a in accounts" :key="a.taobao_uid">{{a.taobao_nick}}</Option>
                        </Select>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" size="large" @click="modalShow = false">取消</Button>
                    <Button type="primary" size="large" @click="saveUser('form')">确定</Button>
                </div>
            </Modal>
             <Modal v-model="modalShow1" :title="modalTitle1">
                <Form ref="form" :label-width="80"  @submit.native.prevent="saveUser1('form')">
                    <input type="hidden" :rules="rule" v-model="form.staff_id"/>
                    <FormItem label="活动ID"  prop="id" >
                       <Input v-model="form.event_id" placeholder="请输入活动ID"/>
                    </FormItem>
                  
                </Form>
                <div slot="footer">
                    <Button type="text" size="large" @click="modalShow1 = false">取消</Button>
                    <Button type="primary" size="large" @click="saveUser1('form')">确定</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
    import BaseTable from '../../../components/BaseTable'
    import {Table, Page, Form, FormItem, Input, Select, Option, Modal} from 'iview'
    import Head from "../../../components/Head"
    import moment from 'moment'
    import qs from 'qs'
    
    export default {
        name: "User",
        extends: BaseTable,
        
        data() {
            return {
                apiUrl: '/backend/staff/list',
                columns: [
                   {title: '员工序号', type: 'index', width: 80},
                    {title: '员工名称', key: 'staff_name', width: 100, tooltip: true},
                    {title: '手机号', key: 'phone', width: 120, tooltip: true},
                    {title: '活动旺旺', key: 'wangwang', width: 100, tooltip: true},
                    {title: '联盟账号', key: 'taobao_nick',  tooltip: true},
                    {
                        title: '创建日期',
                        width: 100,
                        tooltip: true,
                        align: 'center',
                        render: (h, params) => {
                            return h('span', moment(params.row.created_date).format('YYYY-MM-DD'))
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 90,
                        tooltip: true,
                        render: (h, params) => {
                            let status = '';
                            let className = '';
                            switch (params.row.status) {
                                case '1':
                                    status = '启用';
                                    className='code';
                                    break;
                                case '0':
                                    status = '禁止';
                                    className='code1';
                                    break;
                            }
                            return h('span',{ class:[className] }, status)
                        }
                    },
                    {title: '最后登陆IP', key: 'location', width: 160, tooltip: true},
                    {
                        title: '最后登陆时间',
                        //  width: 156,
                        align: 'center',
                        render: (h, params) => {
                            let last_login_time = null;
                            if (params.row.lasttime) {
                                last_login_time = moment(params.row.lasttime * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span', last_login_time)
                        }
                    },
                    {
                        title: '最后创建活动日期',
                        //  width: 156,
                        align: 'center',
                        render: (h, params) => {
                            let last_v_time = null;
                            if (params.row.activate) {
                                last_v_time = moment(params.row.activate).format('YYYY-MM-DD')
                            }
                            return h('span', last_v_time)
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
                    },
                     {
                        title: '活动入库',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.status==1){
                                  return h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                        },
                                        on: {
                                            click: () => {
                                                this.onEdit1(params.row)
                                            }
                                        }
                                    }, '入库')
                            }else{
                                return h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    disabled:true,
                                },
                                on: {
                                    click: () => {
                                        this.onEdit1(params.row)
                                    }
                                }
                            }, '请启用员工')
                            }
                            
                        }
                    },
                ],
                modalShow: false,
                modalTitle: '新增员工',
                modalShow1: false,
                modalTitle1: '活动入库',
                value: '',
                user: {status: '1'},
                accounts: [],
                form: { },
                rule: {
                    staff_name: [
                        {required: true, message: '请输入员工名称', trigger: 'blur'},
                    ],
                    status: [
                        {required: true, message: '请选择用户状态', trigger: 'change'}
                    ],
                    taobao_uid: [
                        {required: true, message: '请选择一个联盟账号', trigger: 'change'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                    wangwang: [
                        {required: true, message: '请输入旺旺号', trigger: 'blur'},
                    ],
                     id : [
                        {required: true, message: '请输入ID号', trigger: 'blur'},
                    ],
                }
            }
        },
        watch: {
            // 'modalShow'(val) {
            //     if (!val) {
            //         this.$refs['form'].resetFields();
            //         this.modalTitle = '新增员工';
            //         this.user = {status: '1'};
            //     }
            // }
        },
        methods: {
            onEdit(row) {
                if (row) {
                    this.user = Object.assign({}, row);
                    this.modalTitle = '编辑：' + row.staff_name
                }
                this.modalShow = true;
            },
            saveUser(formName) {
                this.$refs[formName].validate(async (valid) => {
                    console.log(valid)
                    if (valid) {
                        if (this.user.staff_id) {
                            await this.$http.post('/backend/staff/edit', qs.stringify(this.user))
                        } else {
                            await this.$http.post('/backend/staff/add', qs.stringify(this.user))
                        }

                        this.loadData(this.query);
                        this.modalShow = false
                    }
                })
            },
             onEdit2() {
                    this.user = Object.assign({});
                    this.modalTitle = '新增员工'
                    this.modalShow = true;
            },
             onEdit1(row) {
                 if (row) {
                    this.form.staff_id=Number(row.staff_id)
                }
                this.modalShow1 = true;
                //   this.$modal.confirm({
                //         render: (h) => {
                //             return h('Input', {
                //                 props: {
                //                     title: 绑定活动,
                //                     value: this.value,
                //                     autofocus: true,
                //                     placeholder: '请输入活动地址'
                //                 },
                //                 on: {
                //                     input: (val) => {
                //                         this.value = val;
                //                     }
                //                 }
                //             })
                //          },
                //             onOk: async () => {
                //             console.log(this.row)
                //             var eventid=this.value.split("&",2)
                //             var snid=eventid[1].split("=",2)
                //             console.log(snid[1])
                //             let params={
                //                 // staff_id:this.row.staff_id,
                //                 // event_id:snid[1],.
                //             }
                //             try {
                //                 await this.$http.post('/backend/subject/saveEvent', qs.stringify(params));
                //             } catch (e) {
                //                 console.debug(e)
                //             }
                //         },
                //         onCancel: () => {
                //         this.value = ''
                //     },
                // })
               
            },
            saveUser1(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        // var eventid=this.form.event_id.split("&",2)
                        //     var snid=eventid[1].split("=",2)
                            // console.log(snid[1])
                        let params={
                                staff_id:this.form.staff_id,
                                event_id:this.form.event_id
                            }
                       this.$http.post('/backend/subject/saveEvent', qs.stringify(params)).then((res) => {
                           if(res.data.status==0){
                                this.$message.success('入库成功')
                            }
                             this.modalShow1 = false
                             this.form.event_id = ''
                        })
                        this.loadData(this.query);
                        this.modalShow1 = false
                    }
                })
            },
            onmember(){
                window.open("http://oa.822845.com/")
            },
            search(){
                    //   console.log(this.query.search)
                     
                 this.$http.get('/backend/staff/list',qs.stringify(this.query.search)).then(res=>{  
                        console.log(res)
                        this.loadData(this.query);
                    }).catch(function (error) {
                     console.log(error);
                })
            },
        },
        mounted() {
            this.$http.get('/backend/account/list').then(resp => {
                this.accounts = resp.data.result;
            })
        },
        components: {
            Table, Page, Form, FormItem, Input, Select, Option, Modal, Head
        }
    }
</script>
<style>
    .code{

        color: #2db7f5;;
    }
    .code1{

        color: #ff6600;;
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

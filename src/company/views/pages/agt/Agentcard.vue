<template>
 <div>
    <Head></Head>
      <div class="content">
          <Form inline :model="query" @submit.native.prevent="onSubmit">
                <FormItem>
                    <Input placeholder="卡密/使用人" v-model="query.search"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" html-type="submit" @click="search">搜索</Button>
                </FormItem>
                <FormItem>
                    <Button type="success"  @click.prevent="onEdit()">购买卡密</Button>
                </FormItem>
                 <FormItem>
                    <Button type="error"  @click.prevent="onEdit1()">使用卡密生成工位</Button>
                </FormItem>
            </Form>
            
            <Modal v-model="modalShow" :title="modalTitle">
                <div class="paycon" >
                    <h3 class="ih33">请按流程购买</h3>
                    <p class="ip">付款步骤(一个卡密对应5个工位)：</p>
                    <p class="ip">1.转账至行者(唐孝然)账户;</br>2.对应套餐中输入订单号验证(订单号为付款账单订单编号);</p>
                            <div class="pay2">
                                <img class="wx" src="../../../assets/wx.jpg">
                                <h3  class="wxh">微信号：tangyang002(唐孝然)</h3>
                            </div>
                            <div class="pay3">
                                <img class="wx" src="../../../assets/zfb.png">
                                <h3 class="wxh">支付宝:397980523@qq.com(唐孝然)</h3>
                            </div>
                </div>
                <Form ref="form" :label-width="80"  @submit.native.prevent="saveUser('form')">
                    <!--<input  v-model="form.machine_id" type="hidden" />-->
                    <FormItem label="单价：" v-model="form.price" >
                        <p >{{price}}元</p>
                    </FormItem>
                    <FormItem label="时长：">
                        <!--<Select  v-model="form.overtime">
                            <Option :value="1">1个月</Option>
                            <Option :value="3">3个月</Option>
                            <Option :value="6">6个月</Option>
                        </Select>-->
                         <p >1个月</p>
                    </FormItem>
                    <FormItem label="数量：" >
                         <Input v-model.number="form.quantity" placeholder="一个卡密对应5个工位"/>
                    </FormItem>
                    <FormItem label="总计：">
                        <p>{{totalprice}}元</p>
                    </FormItem>
                     <FormItem label="验证：">
                       <Input v-model="form.trade" placeholder="请输入已付款订单编号" clearable />
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" size="large" @click="modalShow = false">取消</Button>
                    <Button type="primary" size="large" @click="saveUser('form')">购买卡密</Button>
                </div>
            </Modal>
             <Modal v-model="modalShow1" :title="modalTitle1">
            <Form ref="form" :label-width="80"  @submit.native.prevent="saveUser1('form')">
                <input v-model="form.station_id" type="hidden" />
                <FormItem  label="验证卡密">
                    <Input placeholder="请输入卡密" size="large" icon="md-lock" v-model="form.code"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="modalShow1 = false">取消</Button>
                <Button type="primary" size="large" @click="saveUser1('form')">确定</Button>
            </div>
        </Modal>
            <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.result"/>
            <Page :total="pagination.rowscount" :page-size="pagination.pagesize" :current.sync="pagination.pagenum"
                  show-total show-elevator @on-change="toPage"/>
      </div>
</div>
</template>
<script>
    import {FormItem,Form, Table, Input,Page,} from 'iview'
    import Head from "../../../components/Head"
    import qs from	'qs'
     import moment from 'moment'
    import BaseTable from '../../../components/BaseTable'
    export default {
        name: "Agentcard",
        extends: BaseTable,
         inject: ['reload'],
        components: {
           Head,FormItem,Form, Table, Input,Page,
        },
        data( ){
            return{
                form: {
                    overtime:1,
                    quantity:''
                },
                price:'1000',
                modalShow: false,
                modalTitle: '购买卡密',
                modalShow1: false,
                modalTitle1: '验证卡密',
                 apiUrl:'/backend/agent/cdkey',
                columns: [
                     {title: 'Id', type: 'index', align: 'center', width: 80},
                    {title: '卡密', key: 'code', align: 'center'},
                    {title: '使用人', align: 'center', key: 'company_name',
                        render: (h, params) => {
                                if (params.row.company_name==null) {
                                     return h('span','未使用')
                                }else{
                                      return h('span',params.row.company_name)
                                }
                            }   
                       },
                    {title: '创建时间', align: 'center', key: 'created_time',
                            render: (h, params) => {
                            let lasttime = null;
                            if (params.row.created_time) {
                               lasttime = moment(params.row.created_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span',lasttime)
                        }    
                    },
                    {title: '使用时间', align: 'center', key: 'usaged_time',
                               render: (h, params) => {
                            let last_login_time = null;
                            if (params.row.usaged_time!=null) {
                               last_login_time = moment(params.row.usaged_time * 1000).format('YYYY-MM-DD HH:mm:ss')
                                return h('span',last_login_time)
                            }else{
                                return h('span','未使用')
                            }
                           
                        }    
                     },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.onEdit1(params.row)
                                    }
                                }
                            }, '使用卡密生成工位')
                        }
                    }
                ],
            }
         
        },
        mounted() {
               this.$http.post('/backend/agent/cdkey').then(res=>{  
                //   console.log(res)
                    this.accounts = res.data.result;
                    }).catch(function (error) {
                     console.log(error);
             })
        },
        methods: {
               onEdit() {
                    this.modalTitle ='购买卡密'
                    this.modalShow = true;
               },
               onEdit1() {
                    this.modalTitle1 ='卡密充值'
                    this.modalShow1= true;
                },
                onAdd() {
                   
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
               saveUser() {
                        let params={
                            quantity:Number(this.form.quantity),
                            overtime:Number(this.form.overtime),
                            trade:this.form.trade,
                        }
                        this.$http.post('/backend/buying/preCdkey', qs.stringify(params)).then((res) => {
                           if(res.data.status==0){
                                //  this.$router.push({name: 'paysuccess'})
                                this.$message.success({content:'购买卡密成功，请联系管理员进行审核',duration:10, closable: true})
                                  this.reload()  
                            }
                                      
                        })
                            //  this.loadData(this.query);
                             this.modalShow = false
               },
               saveUser1() {
                        let params={
                            code:this.form.code,
                        }
                        this.$http.post('/backend/buying/code', qs.stringify(params)).then((res) => {
                           if(res.data.status==0){
                                //  this.$router.push({name: 'paysuccess'})
                                this.$message.success('卡密验证成功，请查看是否生成工位')
                                  this.reload()  
                            }
                                      
                        })
                            //  this.loadData(this.query);
                             this.modalShow = false
               },
        },
         watch: {
            'modalShow'(val) {
                if (val) {
                    this.modalTitle = '购买卡密';
                }
            },
            'modalShow1'(val) {
                if (val) {
                    this.modalTitle = '验证卡密';
                }
            }
        },
        computed: {
              totalprice( ) {
                return Number(this.price)*Number(this.form.overtime)*Number(this.form.quantity)
             }
        }, 
      
    }
</script>
<style>
   .content{
       margin:70px 20px 20px 210px;
       /*background:#eee;
       height:500px;*/
    }
    .wx{
        width: 160px;
        height: 240px;
        margin: 5px 20px 5px 20px;
   }
   .wxh{
        color:#146dd5;
        font-size:10px; 
   }
   .pay2{
       display: inline-block;
       margin-left:5%; 
       text-align:center;
       padding:auto;
   }
   .pay3{
       display: inline-block;
       margin-left:5%;
       text-align:center;
       padding:auto;

   }
   .paycon{
       margin-bottom: 20px;
   }
   .ip{
       color:red;
       display:block; 
       margin-left:10px; 
       font-size: 10px;
   }
     @media screen and (max-width: 500px) {
       .content {
            margin-left:20px;
        }
    }
</style>
<template>
    <div>
     <Head></Head>
        <div class="content" >
            <h3 class="i-h3">工位总数：{{pagecount}}个，已绑定{{usaged}}位员工，空余工位;{{pagecount-usaged}}个<b style="color:red">绑定后请在工位添加密码，员工登录账号：工位名称，密码：工位密码(需先添加密码)</b>员工端登录地址：http://oa.822845.com</h3>
             <!--<h3 style="color:red;"></h3>-->
            <Form inline  @submit.native.prevent="onSubmit">
                <FormItem>
                    <Input placeholder="搜索员工"   v-model="form.text"/>
                   
                </FormItem>
                <FormItem>
                    <Select v-model="form.status" placeholder="工位状态">
                        <Option value="1">已绑定</Option>
                        <Option value="0">未绑定</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary"  @click="search()">搜索</Button>
                </FormItem>
                 
            </Form>
            <template v-for="(item,i) in stationlist" >
                <Col class="i-col2" span="2" :md="4"  v-bind:key="i"  >
                    <Card  class="i-card2" shadow     v-bind:key="item.staff_name"   >
                        <div @click.prevent>
                            <img class="i-img"   v-if="item.staff_id!=='0'"  src="../../assets/online.jpg"/>
                            <img class="i-img"   v-if="item.staff_id=='0'" src="../../assets/offline.jpg"/>
                            <p class="i-p2">工位名称:{{item.station_name}}</p>
                             <p class="i-p1" v-if="Date.parse(new Date())/1000+7 * 24 * 3600-Number(item.validity)<0">到期时间:{{item.validity*1000 | dateformat('YYYY-MM-DD')}}</p>
                            <p class="i-p1" style="color:red" v-if="Date.parse(new Date())/1000+7 * 24 * 3600-Number(item.validity)>0">时间不足7天，请续费</p>
                            <Select class="i-select" v-model="item.staff_id"    filterable  :placeholder="item.staff_name?item.staff_name:'请选择员工绑定'"  :disabled="item.staff_id=='0'?false:true"  @on-change="gochange(item)">
                                <Option  v-for="item1 in list"  :key="item1.staff_id" :value="item1.staff_id?item1.staff_id:''"   :disabled="item1.station_id!='0'?true:false" >{{item1.staff_name}}</Option>
                            </Select>
                            <Button class="botton"  type="primary"  @click.prevent="relieve(item)">解除绑定</Button>
                            <Button class="botton"    v-if="item.is_pass=='1'" type="error"   :disabled="item.staff_id=='0'?true:false" @click.prevent="onEdit1(item)">忘记密码，修改</Button>
                            <Button class="botton"    v-if="item.is_pass=='0'" type="success"   :disabled="item.staff_id=='0'?true:false" @click.prevent="onEdit1(item)">无密码，添加</Button>
                        </div>
                    </Card>
                </Col>  
                <template v-if="(i+1)%5==0">
                    <Col class="i-col2" span="2" :md="4"  v-bind:key="item.station_id" >
                        <Card  class="i-card2" shadow  v-bind:key="i"  >
                            <div @click.prevent>
                                <img class="i-img"    src="../../assets/cz.jpg"/>
                                <p class="i-p2">工位组号：{{item.machine_id}}</p>
                                <p class="i-p1">到期时间：{{item.validity*1000 | dateformat('YYYY-MM-DD')}}</p>
                                <!--<Button style="margin:10px 0px 10px 5px" type="success" @click.prevent="onEdit(item)">支付续费</Button>-->
                                <Button style="margin:10px 0px 10px 5px" type="error" @click.prevent="onEdit2(item)">卡密续费</Button>
                            </div>
                        </Card>
                    </Col>
                </template>
            </template>
        </div>
       <Page  class="page" :total="pagecount" :page-size="pagesize" :current.sync="pagenum" show-total show-elevator @on-change="toPage(pagesize,pagenum)"/>
        <Modal v-model="modalShow" :title="modalTitle">
                <Form ref="form" :label-width="80"  @submit.native.prevent="saveUser('form')">
                    <input  v-model="form.machine_id" type="hidden" />
                    <FormItem label="单价：" v-model="form.price" >
                         <p >{{price}}</p>
                    </FormItem>
                     <FormItem label="时长：" >
                        <Select  v-model="form.overtime" >
                            <Option :value="1">1个月</Option>
                            <Option :value="3">3个月</Option>
                            <Option :value="6">6个月</Option>
                           
                        </Select>
                    </FormItem>
                     <FormItem label="总计：">
                        <p>{{totalprice}}元</p>
                    </FormItem>
                </Form>
                 <div slot="footer">
                    <Button type="text" size="large" @click="modalShow = false">取消</Button>
                    <Button type="primary" size="large" @click="saveUser('form')">续费</Button>
                </div>
        </Modal>
        <Modal v-model="modalShow2" :title="modalTitle2">
            <Form ref="form" :label-width="80"  @submit.native.prevent="saveUser2('form')">
                    <input  v-model="form.machine_id" type="hidden" />
                    <FormItem label="单价：" v-model="form.price" >
                         <p >{{price}}</p>
                    </FormItem>
                     <FormItem label="时长：" >
                        <p>1个月</p>      
                    </FormItem>
                     <!--<FormItem label="数量：" >
                         <Input v-model.number="form.quantity" placeholder="一个卡密对应5个工位"/>
                    </FormItem>
                     <FormItem label="总计：">
                        <p>{{totalprice1}}元</p>
                    </FormItem>-->
                     <FormItem label="验证：">
                       <Input v-model="form.trade" placeholder="请输入卡密验证" clearable />
                    </FormItem>
                </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="modalShow2 = false">取消</Button>
                <Button type="primary" size="large" @click="saveUser2('form')">确定</Button>
            </div>
        </Modal>
        <Modal v-model="modalShow1" :title="modalTitle1">
            <Form ref="form" :label-width="80"  @submit.native.prevent="saveUser1('form')">
                <input v-model="form.station_id" type="hidden" />
                <FormItem  label="密码" prop="password">
                    <Input type="password" placeholder="请输入密码" size="large" icon="md-lock" v-model="form.password"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="modalShow1 = false">取消</Button>
                <Button type="primary" size="large" @click="saveUser1('form')">确定</Button>
            </div>
        </Modal>
    </div>
    
</template>
<script>
    import {Card,Col,Select,Option,Page,FormItem,Form,Input} from 'iview'
    import Head from "../../components/Head"
    import qs from	'qs'
    export default {
        name: "Workstation",
          components: {
            Card,Col,Select,Option,Head,Page,FormItem,Form,Input
        },
        inject: ['reload'],
         data () {
            return {
                switch1: [],
                stationlist:[],
                list:[],
                payList:[],
                pagecount:0,
                pagenum:0,
                pagesize:0,
                show: true,
                disabled:true,
                modalShow: false,
                modalTitle: '订单续费',
                modalShow1: false,
                modalTitle1: '修改员工密码',
                modalShow2: false,
                modalTitle2: '卡密续费',
                query: {},
                thispage:1,
                form: {
                    overtime:1,
                     quantity:'',
                },
                price:'1000',
                usaged:'',
                rule: {
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    
                }
            } 
        },
        mounted() {
            //循环工位列表
            this.tostation(1)
            this.tolist()
            this.toprice()
        // console.log(Date.parse(new Date())/1000-7 * 24 * 3600)
        },
       
        methods: {
             //分页
             tolist(){
                 this.$http.post('/backend/staff/all').then(res=>{  
                     this.list=res.data.result
                    }).catch(function (error) {
                     console.log(error);
                })
             },
              //循环工位列表
             tostation(page){
                  this.$http.get(`/backend/station/list?size=10&page=${page}`).then(res=>{  
                    this.stationlist=res.data.result
                    this.pagecount=res.data.rowscount
                    this.pagenum=res.data.pagenum
                    this.pagesize=res.data.pagesize
                    this.usaged=res.data.usaged
                    }).catch(function (error) {
                     console.log(error);
                })
             },
             //循环员工列表
            toPage(size,count){
                    let  thispage=count
                   
                   this.$http.get(`/backend/station/list?size=${size}&page=${count}`).then(res=>{ 
                           this.stationlist=res.data.result
                           this.$router.push({
                                path: this.$route.path,
                                query: Object.assign({thispage})
                            })
                    }).catch(function (error) {
                     console.log(error);
                })
            },
             //套餐选择
             toprice(){
                   this.$http.post('/backend/buying/pricing').then(res=>{
                        this.payList=res.data.result
                        }).catch(function (error) {
                            console.log(error);
                  })
             },
            //解绑工位
            relieve (itemlist){
                      let params={
                    station_id:Number(itemlist.station_id),
                    staff_id:Number(itemlist.staff_id),
                }
                this.$http.post('/backend/station/unbind',qs.stringify(params)).then(res=>{ 
                     if(res.data.status==0){
                          this.$message.success('解绑成功')
                        //   this.$http.get(`/backend/station/list?size=10&page=${this.$route.query.thispage}`).then(res=>{  
                        //             this.stationlist=res.data.result
                        //             this.pagecount=res.data.rowscount
                        //             this.pagenum=res.data.pagenum
                        //             this.pagesize=res.data.rowscount
                        //             this.used=res.data.used
                        //             }).catch(function (error) {
                        //             console.log(error);
                        //       })
                            this.tostation(this.$route.query.thispage)
                            this.tolist()
                          }
                    }).catch(function (error) {
                     console.log(error);
                })
            },
            //绑定工位
            gochange(itemlist){
                 window.event? window.event.returnValue = false : event.preventDefault();
                   let params={
                    station_id:Number(itemlist.station_id),
                    staff_id:Number(itemlist.staff_id),
                }
                this.$http.post('/backend/station/bind',qs.stringify(params)).then(res=>{  
                     if(res.data.status==0){
                          this.$message.success({content:'已绑，员工账号：为"工位名称"，密码：如果没密码（请在工位处添加密码，）',duration:10, closable: true})
                          this.tostation(this.$route.query.thispage)
                          this.tolist()
                      
                     }
                    }).catch(function (error) {
                     console.log(error);
                })
            },
            //续费工位1
             onEdit(row) {
                if (row) {
                    this.form.machine_id=Number(row.machine_id)
                    this.modalTitle ='工位续费'
                }
                this.modalShow = true;
            },
            //续费工位发起请求确定1
            saveUser(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // console.log(this.form)
                        let params={
                            machine_id:this.form.machine_id,
                            overtime:this.form.overtime,
                            target:location.origin+"/paysuccess",
                        }
                        this.$http.post('/backend/renew/station', qs.stringify(params)).then((res) => {
                           if(res.data.status==0){
                                window.location.href=res.data.target
                                // this.reload()
                                this.tostation(this.$route.query.thispage)
                                this.tolist()
                            }
                             this.loadData(this.query);
                             this.modalShow1 = false
                        })
                    }
                })
            },
            onEdit2(row) {
                if (row) {
                    this.form.machine_id=Number(row.machine_id)
                    this.modalTitle2 ='卡密续费（一个卡密续费五个工位）'
                }
                this.modalShow2 = true;
            },
            //续费工位发起请求确定续费
            saveUser2(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // console.log(this.form)
                        let params={
                            machine_id:this.form.machine_id,
                            // overtime:this.form.overtime,
                            // target:location.origin+"/paysuccess",
                            code:this.form.trade
                        }
                        this.$http.post('/backend/renew/code', qs.stringify(params)).then((res) => {
                           if(res.data.status==0){
                                // window.location.href=res.data.target
                                this.$router.push({name: 'paysuccess'})
                                // this.reload()
                                this.tostation(this.$route.query.thispage)
                                this.tolist()
                            }
                             this.loadData(this.query);
                             this.modalShow2 = false
                        })
                    }
                })
            },
             //修改工位密码
             onEdit1(row) {
                if (row) {
                    this.form.station_id=Number(row.station_id)
                }
                this.modalShow1 = true;
            },
            //修改工位密码，发起请求确定
            saveUser1(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/backend/station/update', qs.stringify(this.form)).then((res) => {
                           if(res.data.status==0){
                                this.$message.success('工位密码修改成功')
                                //  this.reload()
                              this.tostation(this.$route.query.thispage)
                             this.tolist()
                            }
                             this.modalShow1 = false
                             this.form.password = ''
                        })
                    }
                })
            },
            //搜索已绑定员工
            search(){
                console.log(this.form.text)
                 this.$http.get(`/backend/station/list?size=10&search=${this.form.text?this.form.text:0}&status=${this.form.status}`).then(res=>{  
                           console.log(res)
                        this.stationlist=res.data.result
                        this.pagecount=res.data.rowscount
                        this.pagenum=res.data.pagenum
                        this.pagesize=res.data.pagesize
                        this.usaged=res.data.usaged
                    }).catch(function (error) {
                     console.log(error);
                })
            },
           
        },
         watch: {
            'modalShow'(val) {
                if (val) {
                    this.modalTitle = '工位续费';
                }
            },
             'modalShow1'(val) {
                if (val) {
                    this.modalTitle1 = '修改密码';
                }
             },
                 'modalShow2'(val) {
                if (val) {
                    this.modalTitle1 = '卡密续费';
                }
            }
        },
        computed: {
              totalprice( ) {
                return Number(this.price)*Number(this.form.overtime)
             },
              totalprice1( ) {
                return Number(this.price)*Number(this.form.quantity)
             }
        },
      
    }
</script> 
<style>
   .i-card2{
      height:240px;
      margin:20px;
   }
   .i-col2 div{
      text-align:center;
      padding:auto 
   }
  .i-switch{
      margin:10px;
  }
  .i-img{
      width:50px;
      height:50px;
      margin:10px auto;
  }
  .i-select{
      margin-top:10px;
      width:100%;
  }
  .i-h3{
      color:#146dd5;
      display:block;
      margin:60px; 
    
  }
  .i-p2{
      color:#146dd5;
      display:block;
      margin:3px;  
  }
   .i-p1{
      color:#146dd5;
      display:block;
  }
    .botton{
        margin:5px 5px 5px 5px;
        height: 25px;
        padding: 3px;
    }
    .input{
        width:200px;
        margin-right:10px;
        margin-left:30px;  
    }
     .content{
       margin:70px 20px 50px 220px;
    }
    .page{
        margin-left:220px;
        margin-bottom:20px;
    }
    @media screen and (max-width: 500px) {
       .content {
            margin-left:20px;
        }
        .page{
            margin-left:20px;
            margin-bottom:10px;
        }
      .i-col2{
            margin:0;
            width: 350px;
            /*margin:5px;*/
       }
       .i-card2{
            width:350px;
       }
       .i-h3{
            margin: 6px;
      }
      .botton{
            margin: 15px 5px 5px 5px;
            height: 30px;
            padding:6px;
        }
    }
</style>
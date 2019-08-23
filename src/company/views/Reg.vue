<template>  
    <div class="login-box">
        <div class="login-logo">
            <a href="#"><b>注册</b></a>
        </div>
        <div class="login-box-body">
            <p class="login-box-msg">请填写完整的注册信息</p>
            <Form ref="form" :model="form" :rules="rule" @submit.native.prevent="submitForm('form')">
                <FormItem prop="username">
                    <Input placeholder="公司名称" size="large" icon="md-person" v-model="form.username"/>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" placeholder="请输入密码" size="large" icon="md-lock" v-model="form.password"/>
                </FormItem>
                 <FormItem prop="password1">
                    <Input type="password" placeholder="请输入密码" size="large" icon="md-lock" v-model="form.password1"/>
                </FormItem>
                <FormItem  prop="text3" >
                    <Input class="text3" style="width:30%;" type="text" placeholder="图形验证码" v-model="form.text3" />
                </FormItem>
                <img class="checkimg" id="checkimg"  @click="refresh()"  src="/backend/fn/captcha">
                 <FormItem prop="text1">
                    <Input type="text" style="width:40%;" placeholder="手机号" size="large" icon="md-phone-portrait" v-model="form.text1"/>
                    <button id="getCodeBtn0"  v-show="show"  @click.prevent="goCode()">获取验证码</button>
                    <button id="clicked"  v-show="!show"  @click.prevent="goCode()">{{count}}s后重新获取</button>
                </FormItem>
                 <FormItem  prop="text2" >
                    <Input class="text2" style="width:40%;" type="text" placeholder="手机验证码" v-model="form.text2" />
                </FormItem>

                <FormItem style="text-align:center;">
                    <Button  style="width:90%;" type="success" html-type="submit" >立即注册</Button>
                </FormItem>
                 <a  @click="gotoindex()" tyle="margin-left:20px;display:block;">返回登陆</a>
            </Form>
        </div>
    </div>
</template>

<script>
    import {Form, FormItem, Input, Button} from 'iview'
    // import axios from 'axios'
    import qs from	'qs'
    export default {
        name: "Reg",
        inject: ['reload'],
        data() {
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.password) {
                    callback(new Error('两次密码输入不一致，请重新输入'));
                } else {
                    callback();
                }
            };
             const text1 = (rule, value, callback) => {
                var phonenum =/^1[345789]\d{9}$/;
                if (value === '') {
                    callback(new Error('手机号不能为空'));
                }else if (!phonenum.test( this.form.text1)) {
                    callback(new Error('手机格式不正确，请输入正确的手机号'));
                } else {
                     callback();
                }
                    
            };
            return {
                form: {
                    username:"",
                    password:"",
                    password1:"",
                    text1:"",
                    text2:"",
                    text3:"",
                },
                    show: true,
                    count: '',
                    timer: null,
                    error:'',
                    disabled:true,
                rule: {
                    username: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                         {min: 6,  message: '请输入最少6位密码', trigger: 'blur'}
                    ],
                     password1: [
                        {required: true,  trigger: 'blur',validator: validatePassCheck,},
                         {min: 6,  message: '请输入最少6位密码', trigger: 'blur'}
                    ],
                     text1: [
                        {required: true,trigger: 'blur',validator: text1,},
                         {min: 6,  message: '请输入最少6位密码', trigger: 'blur'}
                    ],
                     text2: [
                        {required: true, message: '请输入手机验证码', trigger: 'blur'}
                    ],
                     text3: [
                        {required: true, message: '请输入图形验证码', trigger: 'blur',}
                    ],
                }
            }
        },
        methods: {
            submitForm(formName) {
                // var phonenum =/^1[345789]\d{9}$/;
                   let params={
                            company:this.form.username,
                            password:this.form.password,
                            phone:this.form.text1,
                            checking:this.form.password1,
                            words:this.form.text2,
                            captcha:this.form.text3,
                           
                   }
                     this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$http.post('/backend/auth/sign', qs.stringify(params)
                                     ).then(res => {
                                console.log(res.data)
                                if(res.data.status==0){
                                     this.$message.success('注册成功,请回登录页');
                                      this.$router.push({name: 'login'})
                                }else{
                                     this.$message.error(res.data.result);
                                }
                               
                            })
                        } else {
                            return false;
                        }
                   })
               
            },
            //图片验证码刷新
             refresh () {
                document.getElementById("checkimg").src="/backend/fn/captcha"
                // this.reload()
            },
             //获取验证码
             goCode(){
                  var phonenum =/^1[345789]\d{9}$/;
                  let params={
                            phone:this.form.text1,
                            captcha:this.form.text3,
                  }
                        if(phonenum.test( this.form.text1)){
                       this.$http.post('/backend/auth/trymsg', qs.stringify(params),
                                //  {withCredentials:true}
                            ).then(res=>{
                                    console.log(res.data);
                                    if(res.data.status==0){
                                        this.$message.success(res.data.result);
                                          const TIME_COUNT = 90;
                                            if (!this.timer) {
                                                this.count = TIME_COUNT;
                                                this.show = false;
                                                document.getElementById("clicked").disabled=true
                                                this.timer = setInterval(() => {
                                                if (this.count > 0 && this.count <= TIME_COUNT) {
                                                        this.count--;
                                                 } else {
                                                        this.show = true;
                                                        clearInterval(this.timer);
                                                        this.timer = null;
                                                        this.disabled=false;
                                                    }
                                                }, 1000)
                                            }
                                    }else {
                                        this.$message.error(res.data.result);
                                    }
                            }).catch(function(reason) {
                            console.log( reason);
                            })
                        }
               },
        //回登录页面
            gotoindex(){
                var _this = this;
                _this.$router.push({ path: '/login' });
            }     
        },
        //周期函数
        mounted() {
             document.querySelector('body').setAttribute('style', 'background:url(http://img.zcool.cn/community/0370fea5a5da8d1a80120121fd2dbc5.jpg)center 0 repeat;background-size: auto;')
        },
        //周期函数销毁
        destroyed() {
            document.querySelector('body').removeAttribute('style')
        },
        //组件
        components: {
            Form, FormItem, Input, Button,
        }
    }
</script>

<style scoped>
      .login-box {
        width: 460px;
        position: absolute;
        top: 35%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .login-logo {
        font-size: 32px;
        text-align: center;
        margin-bottom: 20px;
        font-weight: 300;
    }

    .login-logo a {
        color: #fff;
    }

    .login-box-body {
        /*background: #fff;*/
        padding: 20px;
        border-top: 0;
       color: #fff;
       background:rgba(11,23,70,0.8);
    }

    .login-box-msg {
        margin: 0;
        text-align: center;
        font-size: 14px;
        padding: 0 20px 20px 20px;
    }
     .checkimg{
        width:45%;
        margin-left:160px;
        position:absolute;
        top:300px;
    }
    #getCodeBtn0{ 
        position: absolute;
        width: 120px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        top: 2px;
        right:20px;
        cursor: pointer;
        background-color:#2d8cf0;
        color:#fff
    }
    #clicked{
        position: absolute;
        width: 120px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        top: 2px;
        right:20px;
        cursor: pointer;
        background-color: #ed4014;
        color: #fff;
        font-size: 14px;
    }
    @media screen and (max-width: 500px) {
    .login-box {
        width: 350px;
        position: absolute;
        top: 47%;
        left: 50%;
        transform: translate(-50%, -50%);
             }
    }
</style>
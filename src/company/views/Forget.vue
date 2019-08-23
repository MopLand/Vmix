<template>  
    <div class="login-box">
        <div class="login-logo">
            <a href="#"><b>找回密码</b></a>
        </div>
        <div class="login-box-body">
            <p class="login-box-msg">按要求找回密码</p>
            <Form ref="form" :model="form" :rules="rule" @submit.native.prevent="submitForm('form')">
                <FormItem prop="company">
                    <Input type="text" placeholder="请输入公司名" size="large" icon="md-lock" v-model="form.company"/>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" placeholder="请输入新密码" size="large" icon="md-lock" v-model="form.password"/>
                </FormItem>
                <FormItem prop="checking">
                    <Input type="password" placeholder="请再次输入密码" size="large" icon="md-lock" v-model="form.checking"/>
                </FormItem>
                <FormItem  prop="captcha" >
                    <Input class="captcha" style="width:30%;"  placeholder="请输入图形验证码" v-model="form.captcha" />
                </FormItem>
                 <FormItem prop="phone">
                    <Input type="text" placeholder="请输入手机号"   style="width:40%;" size="large" icon="md-phone-portrait" v-model="form.phone"/>
                    <button id="getCodeBtn0"  v-show="show"  @click.prevent="goCode()">获取验证码</button>
                    <button id="clicked"  v-show="!show"  @click.prevent="goCode()">{{count}}s后重新获取</button>
                </FormItem>
                 <FormItem  prop="words" >
                    <Input  type="text"  style="width:40%;"  placeholder="请输入手机验证码" v-model="form.words" />
                 </FormItem>
                 <img class="checkimg" id="checkimg"   @click="refresh()"  src="/backend/fn/captcha">
                <FormItem style="text-align:center;">
                    <Button  style="width:90%" type="success" html-type="submit">立即找回</Button>
                </FormItem>
                <a  @click="gotoindex()" tyle="margin-left:20px;display:block">返回登陆</a>
            </Form>
        </div>
    </div>
</template>

<script>
    import {Form, FormItem, Input, Button} from 'iview'
    import qs from 'qs'
    export default {
        name: "Forget",
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

            return {
                form: {},
                show: true,
                count: '',
                rule: {
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6,  message: '请输入最少6位密码', trigger: 'blur'}
                    ],
                    
                     checking: [
                        {required: true,  trigger: 'blur',validator: validatePassCheck,}
                    ],
                    company: [
                        {required: true, message: '请输入公司名', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'}
                    ],
                    words: [
                        {required: true, message: '请输入手机验证码', trigger: 'blur'}
                    ],
                    captcha: [
                        {required: true, message: '请输入图形验证码', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                         let params={
                            phone:this.form.phone,
                            password:this.form.password,
                            checking:this.form.checking,
                            company:this.form.company,
                            words:this.form.words,
                            captcha:this.form.captcha,
                               }
                        this.$http.post('/backend/staff/list', qs.stringify(params)).then(res => {
                                    if(res.data.status==0){
                                        this.$message.success('密码修改成功,跳转登录中');
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
              refresh () {
                document.getElementById("checkimg").src="/backend/fn/captcha"
            },
               goCode(){
                  var phonenum =/^1[345789]\d{9}$/;
                  let params={
                            phone:this.form.phone,
                            captcha:this.form.captcha,
                  }
                if(phonenum.test( this.form.phone)){
                    this.$http.post('/backend/auth/trymsg', qs.stringify(params),
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
             gotoindex(){
                  var _this = this;
                   _this.$router.push({ path: '/login' });
            }
        },
        mounted() {
            document.querySelector('body').setAttribute('style', 'background:url(http://img.zcool.cn/community/0370fea5a5da8d1a80120121fd2dbc5.jpg)center 0 repeat;background-size:cover;')
        },
        destroyed() {
            document.querySelector('body').removeAttribute('style')
        },
        components: {
            Form, FormItem, Input, Button
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
         color: #fff;
       background:rgba(11,23,70,0.8);
        padding: 20px;
        border-top: 0;
        /*color: #666;*/
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
        right:40px;
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
        right:40px;
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
<template>
    <div class="login-box">
        <div class="login-logo">
            <a href="#"><b>招商团长管理系统</b></a>
        </div>
        <div class="login-box-body">
            <p class="login-box-msg">请输入账号密码！</p>
            <Form ref="form" :model="form" :rules="rule" @submit.native.prevent="submitForm('form')">
                <FormItem prop="username">
                    <Input placeholder="请输入手机号" size="large" icon="md-phone-portrait" v-model="form.username"/>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" placeholder="请输入密码" size="large" icon="md-lock" v-model="form.password"/>
                </FormItem>
                <FormItem prop="captcha">
                    <Input class="check" style="width:30%;" type="text" v-model="form.captcha" placeholder="请输入验证码"/>
                </FormItem>
                <img class="checkimg" id="checkimg" @click.prevent="refresh()" src="/backend/fn/captcha">
                <FormItem style="text-align:center;">
                    <Button style="width:90%;" type="primary" html-type="submit">立即登陆</Button>
                    <!--<Button  style="margin-left:20px;width:80px;" type="success" >忘记密码</Button>-->
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button style="width:90%;" type="success" :to="{name:'reg'}">注册新用户</Button>
                </FormItem>
                <a @click="gotoindex()" tyle="margin-left:20px;display:block;color:red;">忘记密码</a>
            </Form>
        </div>
    </div>
</template>

<script>
    import {Form, FormItem, Input, Button} from 'iview'
    import qs from 'qs'

    export default {
        name: "Login",
        // inject: ['reload'],
        data() {
            return {
                form: {},
                rule: {
                    username: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6,  message: '请输入最少6位密码', trigger: 'blur'}
                    ],
                    captcha: [
                        {required: true, message: '请输验证码', trigger: 'blur'},
                        {min:5,  message: '请输入最少5位验证码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                var _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = {
                            username: this.form.username,
                            password: this.form.password,
                            captcha: this.form.captcha,
                        }
                        _this.$http.post('/backend/auth/login', qs.stringify(params)).then(res => {
                                if (res.data.status == 0) {
                                    this.$message.success('登录成功!')
                                    this.$store.dispatch('setUserInfo', res.data.result)
                                    _this.$router.push({name: 'home'});
                                } else {
                                    this.$message.error(res.data.result)
                                    // _this.$router.push({ path: '/login' });
                                }
                            }
                        ).catch(function (error) {
                            console.log(error);
                        });
                    } else {
                        this.$message.error('登录失败!');
                    }
                })
            },
            gotoindex() {
                var _this = this;
                _this.$router.push({path: '/forget'});
            },
            refresh() {
                document.getElementById("checkimg").src = "/backend/fn/captcha"
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
        background: rgba(11, 23, 70, 0.8);
        padding: 20px;
        border-top: 0;
        color: #fff;
        /*filter: Chroma(Color=#FFFFFF);*/
    }

    .login-box-msg {
        margin: 0;
        text-align: center;
        font-size: 14px;
        padding: 0 20px 20px 20px;
    }

    .checkimg {
        width: 45%;
        margin-left: 160px;
        position: absolute;
        top: 240px
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
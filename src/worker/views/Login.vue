<template>
    <div class="login-box">
        <div class="login-logo">
            <b>{{ $store.getters.company }}</b>
        </div>
        <div class="login-box-body">
            <p class="login-box-msg">登录以开始您的会话！</p>
            <Form :model="form" :rules="rules" ref="form" @submit.native.prevent="submitForm('form')">
                <FormItem label="" prop="username">
                    <Input v-model="form.username" autocomplete="off" placeholder="用户名" suffix-icon="fa fa-user"/>
                </FormItem>
                <FormItem label="" prop="password">
                    <Input v-model="form.password" type="password" autocomplete="off" placeholder="密码" suffix-icon="fa fa-lock"/>
                </FormItem>
                <FormItem label="" prop="captcha">
                    <div class="captcha">
                        <Input v-model="form.captcha" autocomplete="off" placeholder="验证码"/>
                        <img src="/backend/fn/captcha" data-src="/backend/fn/captcha" height="40" @click="Refresh"/>
                    </div>
                </FormItem>
                <FormItem>
                    <Button type="primary" native-type="submit" style="width: 100%;">提交</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    import {Form, FormItem, Input, Button} from 'element-ui'
    import qs from 'qs'

    export default {
        name: 'Login',
        data() {
            return {
                form: {},
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入用密码', trigger: 'blur'},
                        // {min: 8, message: '长度至少 8 个字符', trigger: 'blur'}
                    ],
                    captcha: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                        {min: 5, max: 5, message: '请输入5位验证码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            Refresh(e) {
                e.target.src = e.target.dataset.src
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('/auth/login', qs.stringify(this.form)).then(data => {
                            this.$store.dispatch('setUserInfo', data.result)
                            this.$router.push({name: 'home'})
                        })
                    } else {
                        return false;
                    }
                });
            },

        },
        components: {
            Form,
            FormItem,
            Input,
            Button,
        },
        mounted() {
            document.querySelector('body').setAttribute('style', 'background-color: #d2d6de;')
        },
        destroyed() {
            document.querySelector('body').removeAttribute('style')
        }
    }
</script>

<style scoped>
    .captcha {
        position: relative;
        display: flex;
    }

    .captcha > img {
        cursor: pointer;
    }

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
        color: #444;
    }

    .login-box-body {
        background: #fff;
        padding: 20px;
        border-top: 0;
        color: #666;
    }

    .login-box-msg {
        margin: 0;
        text-align: center;
        padding: 0 20px 20px 20px;
    }

</style>
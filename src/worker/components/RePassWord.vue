<template>
    <Dialog title="修改密码" :visible.sync="option.visible" :center="true" width="460px">
        <Form :model="form" :rules="rules" ref="form" @submit.native.prevent="onSubmit('form')" label-width="64px">
            <FormItem label="原密码" prop="password">
                <Input v-model="form.password" type="password" autocomplete="off" placeholder="原始密码" suffix-icon="fa fa-lock"/>
            </FormItem>
            <FormItem label="新密码" prop="newpass">
                <Input v-model="form.newpass" type="password" autocomplete="off" placeholder="新密码" suffix-icon="fa fa-lock"/>
            </FormItem>
            <FormItem prop="checking">
                <Input v-model="form.checking" type="password" autocomplete="off" placeholder="确认新密码" suffix-icon="fa fa-lock"/>
            </FormItem>
        </Form>
        <div slot="footer" class="dialog-footer">
            <Button @click.stop="option.visible = false">取 消</Button>
            <Button type="primary" @click.stop="onSubmit('form')">确 定</Button>
        </div>
    </Dialog>
</template>

<script>
    import {Dialog, Form, FormItem, Button, Input} from 'element-ui'
    import qs from 'qs'

    export default {
        name: "RePassWord",
        props: {
            option: {
                type: Object,
                default: function _default() {
                    return {}
                }
            }
        },
        watch: {
            'option.visible'(val) {
                if (val === false) {
                    this.form = {}
                }
            }
        },
        data() {
            return {
                form: {},
                rules: {
                    password: [
                        {required: true, message: '请输入原始密码', trigger: 'blur'}
                    ],
                    newpass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 8, message: '长度至少 8 个字符', trigger: 'blur'}
                    ],
                    checking: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 8, message: '长度至少 8 个字符', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (value !== this.form.newpass) {
                                    callback(new Error('两次输入密码不一致!'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (!valid) return false;
                    await this.$http.post('/auth/reset', qs.stringify(this.form))

                    this.option.visible = false;
                    this.$message.success('密码修改成功,请使用新密码登陆！');

                    await this.$http.get('/auth/Logout')
                    this.$router.push({name: 'login'})
                })
            }
        },
        components: {
            Dialog, Form, FormItem, Button, Input
        }
    }
</script>

<style scoped>

</style>
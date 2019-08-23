<template>
    <div>
        <Head></Head>
        <div class="content">
            <Card>
                <p slot="title">
                    <Icon type="md-contact"></Icon>
                    活动参数
                </p>
                <div class="a-content">
                    <Form :model="event" :label-width="90" @submit.native.prevent="onSubmitEventConf">
                        <FormItem label="主活动标题">
                            <Input v-model="event.main_titles" type="textarea" :rows="5"/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" html-type="submit">保存</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import {Card, Icon, Form, FormItem, Input} from 'iview'
    import moment from 'moment'
    import Head from "../../components/Head"

    export default {
        name: "SysConfig",
        data() {
            return {
                form: {},
                auth: {},
                event: {}
            }
        },
        methods: {
            onSubmit() {
                this.$http.post('/sys/authorization', this.form).then(() => {
                    this.$message.success('授权成功！')
                    this.loadAuthData()
                })
            },
            onSubmitEventConf() {
                this.$http.post('/sys/event/config', this.event).then(() => {
                    this.$message.success('保存成功！')
                })
            },
            login() {
                window.open('https://oauth.taobao.com/authorize?client_id=23414612&response_type=code&redirect_uri=urn:ietf:wg:oauth:2.0:oob&view=web', '_blank')
            },
            formatDate(time) {
                return moment(new Date(time || 0)).format('YYYY-MM-DD HH:mm:ss')
            },
            loadAuthData() {
                this.$http.get('/sys/authorization').then(resp => {
                    let json = resp.data
                    this.form.pid = json.pid
                    this.auth = json.auth
                })
            },
            loadEventConf() {
                this.$http.get('/sys/event/config').then(resp => {
                    this.event = resp.data
                })
            }
        },
        mounted() {
            this.loadEventConf()
        },
        components: {
            Card, Icon, Form, FormItem, Input, Head
        }
    }
</script>

<style scoped>
    .ivu-card {
        margin: 10px;
    }

    .a-content {
        display: block;
        padding: 10px;
    }

    .content {
        margin: 70px 20px 20px 220px;
    }
</style>
<template>
    <Layout :class="collapsedClass">
        <Header class="header">
            <div class="logo">
                {{ $store.getters.Company }}
            </div>
            <div class="left">
                <Icon @click.native="collapsedSider" :class="rotateIcon" type="md-menu" size="24"></Icon>
            </div>
            <div class="right">
                <Dropdown @on-click="handleCommand">
                    <a href="javascript:void(0)">
                        {{$store.getters.Company }}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="password" >修改密码</DropdownItem>
                        <DropdownItem name="logout" divided>退出</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </Header>
        <Layout>
            <Sider breakpoint="md" collapsible v-model="isCollapsed" ref="sider" class="sider">
                <Menu theme="dark" accordion width="auto">
                    <template v-for="route in $router.options.routes">
                        <template v-if="!route.hidden">
                            <Submenu :name="route.name" :key="route.name" v-if="route.children">
                                <template slot="title">
                                    <Icon :type="route.meta.icon"/>
                                    <span>{{route.meta.title}}</span>
                                </template>
                                <MenuItem v-for="sub in route.children" :name="sub.name" :key="sub.name" :to="{ name: sub.name }">
                                    {{sub.meta.title}}
                                </MenuItem>
                            </Submenu>
                            <MenuItem :name="route.name" :key="route.name" :to="{ name: route.name }" v-else>
                                <Icon :type="route.meta.icon"/>
                                <span>{{route.meta.title}}</span>
                                <!-- && $store.getters.role === route.meta.role-->
                            </MenuItem>
                        </template>
                    </template>
                </Menu>
            </Sider>
        </Layout>
        <Modal   v-model="modalShow" :title="modalTitle"  width="460px">
            <Form :model="form" :rules="rules" ref="form" @submit.native.prevent="onSubmit('form')" >
                <FormItem label="原密码" prop="password">
                    <Input v-model="form.old_pass" type="password"  placeholder="原始密码" icon="md-lock"/>
                </FormItem>
                <FormItem label="新密码" prop="newpass">
                    <Input v-model="form.new_pass" type="password"  placeholder="新密码" icon="md-lock"/>
                </FormItem>
                <FormItem prop="checking">
                    <Input v-model="form.check_pass" type="password"  placeholder="确认新密码" icon="md-lock"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click.stop="modalShow = false">取 消</Button>
                <Button type="primary" @click.stop="onSubmit('form')">确 定</Button>
            </div>
       </Modal>
    </Layout>
</template>

<script>
    import {Layout, Sider, Menu, MenuItem, Submenu, Icon, Header, Dropdown, DropdownMenu, DropdownItem,FormItem,Form,} from 'iview'
    import qs from	'qs'
    export default {
        name: "Head",
         components: {
            Layout, Sider, Menu, MenuItem, Icon, Header, Submenu, Dropdown, DropdownMenu, DropdownItem,FormItem,Form,
        },
        computed: {
            rotateIcon() {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            collapsedClass() {
                if (!this.isCollapsed) return '';
                return this.$refs.sider.siderWidth === 0 ? 'collapsed-zero' : 'collapsed'
            }
        },
       
        data() {
            return {
                isCollapsed: false,
                modalShow: false,
                modalTitle: '修改密码',
                 form: {
                },
                rules: {
                    old_pass: [
                        {required: true, message: '请输入原始密码', trigger: 'blur'}
                    ],
                    new_pass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min:6, message: '长度至少 6 个字符', trigger: 'blur'}
                    ],
                    check_pass: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min:6, message: '长度至少 6 个字符', trigger: 'blur'},
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
            collapsedSider() {
                this.$refs.sider.toggleCollapse();
            },
            handleCommand(active) {
                console.log(active)
                switch (active) {
                    case 'logout':
                        this.logout();
                        break;
                    case 'password':
                        this.modalShow = true;
                        break;
                    default:
                        this.$message.info('click on item ' + active)
                }
            },
            async logout() {
                await this.$http.get('/backend/auth/Logout')
                this.$router.push({name: 'login'})
            },
             onSubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (!valid) return false;
                    await this.$http.post('/backend/auth/modify', qs.stringify(this.form))

                    this.modalShow= false;
                    this.$message.success('密码修改成功,请使用新密码登陆！');

                    await this.$http.get('/backend/auth/Logout')
                    this.$router.push({name: 'login'})
                })
            }
           
            // toLeaderboard(c) {
            //     this.leaderboard.show = true;
            //     this.leaderboard.company = c
            // }
        },
        mounted() {
            document.title = this.$store.getters.Company?this.$store.getters.Company:'系统后台'
        },
       
    }
</script>

<style scoped>
    .header {
        position: fixed;
        width: 100%;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
        z-index: 999;
        padding: 0;
        height: 50px;
        line-height: 50px
    }

    .header > div {
        float: left;
        display: block;
    }

    .header > .logo {
        width: 200px;
        text-align: center;
        font-size: 12px;
        /*font-weight: 700;*/
        color: hsla(0, 0%, 100%, .8);
        background-color: #515a6e;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .15);
    }

    .header > .left {
        margin-left: 20px;
    }

    .header > .right {
        float: right;
        margin-right: 20px;
    }

    .header > .left > *,
    .header > .right > * {
        margin: 0 10px;
    }

    .header > .right > span {
        display: inline-block;
        cursor: pointer;
    }

    .sider {
        position: fixed;
        height: 100vh;
        left: 0;
        padding-top: 50px;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 998;
    }

    .sider::-webkit-scrollbar {
        display: none;
    }

    .collapsed .logo {
        width: 64px;
    }

    .collapsed .content {
        margin-left: 84px;
    }

    .collapsed .ivu-menu span {
        display: none;
    }

    .collapsed .ivu-menu i {
        transform: translateX(-3px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

    .collapsed-zero .logo {
        display: none;
    }

    .collapsed-zero .content {
        margin-left: 20px;
    }

    .menu-icon {
        transition: all .3s;
    }

    .rotate-icon {
        transform: rotate(-90deg);
    }
</style>
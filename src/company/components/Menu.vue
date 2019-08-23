<template>
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
                            <!--<Icon :type="route.meta.icon"/>-->
                            <!--<span>{{route.meta.title}}</span>
                            && $store.getters.role === route.meta.role"-->
                        </MenuItem>
                    </template>
                </template>
            </Menu>
        </Sider>
    </Layout>
</template>
<script>
    import {Layout, Sider, Menu, MenuItem, Submenu, Icon,} from 'iview'
    // import Leaderboard from '../views/pages/Leaderboard'
    export default {
        name: "Menu",
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
                leaderboard: {
                    show: false,
                    company: 0
                }
            }
        },
        methods: {
            collapsedSider() {
                this.$refs.sider.toggleCollapse();
            },
            handleCommand(active) {
                switch (active) {
                    case 'logout':
                        this.$store.dispatch('logout');
                        window.location = '/'
                        break;
                    // case 'password':
                    //     break;
                    default:
                        this.$message.info('click on item ' + active)
                }
            },
            toLeaderboard(c) {
                this.leaderboard.show = true;
                this.leaderboard.company = c
            }
        },
        mounted() {

            // if (this.$store.getters.admin) {
            //     this.$router.push({name: 'admin'})
            // }
        },
        components: {
            Layout, Sider, Menu, MenuItem, Icon,  Submenu, 
            // Leaderboard
        }
    }
</script>

<style scoped>
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

    .content {
        margin: 70px 20px 20px 220px;
        background: #fff;
        min-height: 300px;
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
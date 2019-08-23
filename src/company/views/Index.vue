<template>
    <Layout :class="collapsedClass">
        <!--<Head></Head>-->
        <!--<Menu></Menu>-->
        <Content>
            <router-view v-if="isRouterAlive"></router-view>
            <!--<BackTop :duration="1500"/>-->
        </Content>
    </Layout>
</template>

<script>
    import {Content, Layout} from 'iview'
    // import Head from "../components/Head"
    export default {
        name: "Index",
        provide() {
            return {
                reload: this.reload
            }
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
                leaderboard: {
                    show: false,
                    company: 0
                },
                isRouterAlive: true

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
            },
            reload() {
                this.isRouterAlive = false
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
            }
        },
        mounted() {
        },
        components: {
            Content, Layout,
        }
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
        font-size: 16px;
        font-weight: 700;
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

    /*.content {
        margin: 70px 20px 20px 220px;
        background: #fff;
        min-height: 300px;
    }*/

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
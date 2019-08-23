<template>
    <div class="index" :class="{'collapse': collapse}">
        <div class="navbar">
            <div class="logo">
                <span>{{ collapse ? '' : $store.getters.company }}</span>
            </div>
            <div class="header">
                <div class="left">
                    <i :class="[collapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left']" @click.stop="collapse = !collapse"></i>
                </div>
                <div class="right">
                    <Dropdown @command="handleCommand">
                      <span class="el-dropdown-link">
                        {{$store.getters.nickName}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                        <DropdownMenu slot="dropdown">
                            <!--<DropdownItem>基本资料</DropdownItem>-->
                            <DropdownItem command="password">密码修改</DropdownItem>
                            <DropdownItem command="logout" divided>退出</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>
        <Scrollbar class="sidebar-container"
                   wrap-style="overflow-x: hidden;">
            <Menu :collapse="collapse"
                  class="aside-menu"
                  :default-active="$route.path"
                  :router="true"
                  :collapse-transition="false"
                  background-color="#20222A"
                  text-color="rgba(255,255,255,.7)"
                  active-text-color="#fff">
                <MenuItem index="/">
                    <i class="fa fa-home"></i>
                    <span slot="title">首页</span>
                </MenuItem>
                <MenuItem index="/event">
                    <i class="fa fa-list-alt"></i>
                    <span slot="title">我的活动</span>
                </MenuItem>
                <MenuItem index="/order">
                    <i class="fa fa-bars"></i>
                    <span slot="title">订单汇总</span>
                </MenuItem>
                <MenuItem index="/effect">
                    <i class="fa fa-podcast"></i>
                    <span slot="title">我的产品</span>
                </MenuItem>
                <!--<MenuItem index="/search">-->
                <!--<i class="fa fa-search-plus"></i>-->
                <!--<span slot="title">超级搜索</span>-->
                <!--</MenuItem>-->
            </Menu>
        </Scrollbar>
        <Main>
            <router-view/>
        </Main>
        <RePassWord :option="password"/>
    </div>
</template>
<script>
    import {
        Scrollbar,
        Main,
        Menu,
        MenuItem,
        Dropdown,
        DropdownMenu,
        DropdownItem,
    } from 'element-ui'
    import RePassWord from '../components/RePassWord'

    export default {
        name: 'Index',
        data() {
            return {
                collapse: false,
                option: {
                    visible: false
                },
                password: {
                    visible: false
                }
            }
        },
        methods: {
            handleCommand(command) {
                switch (command) {
                    case 'logout':
                        this.logout();
                        break;
                    case 'password':
                        this.password.visible = true;
                        break;
                    default:
                        this.$message('click on item ' + command);
                }
            },
            async logout() {
                await this.$http.get('/auth/Logout')
                this.$router.push({name: 'login'})
            }
        },
        mounted() {
            document.title = this.$store.getters.company;
            // setInterval(() => {
            //     if (this.$store.state.token) {
            //         this.$axios.get('/user/heartbeat')
            //     }
            // }, 2 * 60 * 1000);
        },
        components: {
            RePassWord,
            Main,
            Scrollbar,
            Menu,
            MenuItem,
            Dropdown,
            DropdownMenu,
            DropdownItem,
        }
    }
</script>

<style scoped>
    .el-menu-item [class^=fa],
    .el-submenu [class^=fa] {
        margin-right: 5px;
        width: 24px;
        text-align: center;
        font-size: 18px;
        vertical-align: middle;
    }

    .index {
        height: 100%;
    }

    .index > * {
        position: absolute;
    }

    .navbar {
        border-bottom: none;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
        box-sizing: border-box;
        background-color: #fff;
        top: 0;
        left: 0;
        right: 0;
        height: 50px;
        line-height: 50px;
        z-index: 1001;
    }

    .navbar > * {
        position: absolute;
        top: 0;
        bottom: 0;
    }

    .logo {
        color: rgba(255, 255, 255, .8);
        background-color: #20222A;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .15);
        left: 0;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
    }

    .header {
        overflow: hidden;
        padding: 0 10px;
        right: 0;
    }

    .header > div > * {
        margin: 0 20px;
    }

    .header > .left > i,
    .tools-box {
        cursor: pointer;
    }

    .sidebar-container {
        background-color: #20222A;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 1000;
        overflow: hidden;
    }

    .sidebar-container .aside-menu {
        border-right: 0;
        margin-top: 50px;
    }

    main {
        top: 50px;
        right: 0;
        bottom: 0;
        overflow: auto;
        padding: 15px;
    }

    .sidebar-container,
    .logo {
        width: 220px;
    }

    .header,
    main {
        left: 220px;
    }

    .collapse .sidebar-container,
    .collapse .logo {
        width: 64px;
    }

    .collapse .header,
    .collapse main {
        left: 64px;
    }
</style>
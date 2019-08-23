<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: 'app'
    }
</script>

<style>
    html, body, #app {
        height: 100%;
    }

    body {
        margin: 0;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        font-size: 14px;
        background-color: #f2f2f2;
    }

    .left {
        float: left;
    }

    .right {
        float: right;
    }

    /*base-table*/

    .main-content {
        height: 100%;
    }

    .main-content > .el-form .el-form-item {
        margin-bottom: 10px;
    }

    .main-content .el-pagination {
        margin: 5px 0;
        padding: 5px 0;
        background-color: #fff;
    }

    .main-content .el-pagination.is-background .btn-next,
    .main-content .el-pagination.is-background .btn-prev,
    .main-content .el-pagination.is-background .el-pager li {
        background-color: #fff;
    }

    /*base-table*/

    [class^=fa] {
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .el-button [class*=fa] + span {
        margin-left: 5px;
    }


</style>

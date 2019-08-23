<template>
    <div class="not-found">
        <h1>没有该功能权限！</h1>
    </div>
</template>

<script>
    export default {
        name: "Forbidden"
    }
</script>

<style scoped>
    .not-found {
        width: 360px;
        position: absolute;
        top: 40%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        text-align: center;
    }
</style>
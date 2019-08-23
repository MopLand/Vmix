<template>
    <div class="coupon">
        <template v-if="good.couponChannelName">
            <p>{{ good.couponChannelName }}</p>
            <p>{{ good.couponInfo }}</p>
            <p>（{{ good.couponLeftCount }}/{{ good.couponTotalCount }}）</p>
            <p><i class="ml5 pubfont icon-shuoming" style="font-size: 14px; margin-left: 5px"></i></p>
        </template>
        <span v-else>无</span>
    </div>
</template>

<script>
    export default {
        name: "TableColumnCoupon",
        props: {
            good: {
                type: Object,
                default: function _default() {
                    return {}
                }
            }
        },
    }
</script>

<style scoped>
    div p {
        margin: 0;
        color: rgb(51, 51, 51);
        line-height: 17px;
    }
</style>
<template>
    <div class="audit-status">
        <p :style="{ color: color }">{{ content }}</p>
        <p v-if="good.auditorNick" style="color: #999;">审核人：{{ good.auditorNick }}</p>
    </div>
</template>

<script>
    export default {
        name: "TableColumnGoodAuditStatus",
        props: {
            good: {
                type: Object,
                default: function _default() {
                    return {}
                }
            }
        },
        computed: {
            content() {
                switch (this.good.auditStatus) {
                    case 1:
                        return '待招商团长审核'
                    case 2:
                        return '通过'
                    case 3:
                        return '拒绝'
                    default:
                        return this.good.auditStatus
                }
            },
            color() {
                switch (this.good.auditStatus) {
                    case 1:
                        return '#49B6E0'
                    case 2:
                        return 'green'
                    case 3:
                        return '#D0021B'
                    default:
                        return ''
                }
            }
        }
    }
</script>

<style scoped>
    .audit-status p {
        margin: 0;
    }
</style>
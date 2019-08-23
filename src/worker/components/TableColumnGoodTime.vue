<template>
    <div class="good-time">
        <p>起：{{ good.queue_begin | dateformat('YYYY-MM-DD') }}</p>
        <p>止：{{ good.queue_final | dateformat('YYYY-MM-DD') }}</p>
    </div>
</template>

<script>
    export default {
        name: "TableColumnGoodTime",
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
    .good-time {
        color: rgb(51, 51, 51);
    }

    .good-time p {
        margin: 0;
    }
</style>
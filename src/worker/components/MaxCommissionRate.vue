<template>
    <Dialog v-dialogDrag title="商品佣金信息" :modal="true" :visible.sync="option.visible" width="600px">
        <div>最高佣金：{{ privilege.max_commission_rate }}%</div>
        <div>推广链接：<a target="_blank" :href="privilege.coupon_click_url">点击查看</a></div>
        <template v-if="privilege.coupon_type">
            <div>优惠券：{{ privilege.coupon_info }}</div>
            <div>券类型：{{ privilege.coupon_type ===1 ? '公开券' : privilege.coupon_type === 2 ? '私有券' : privilege.coupon_type ===3 ? '妈妈券' : '未知' }}</div>
            <div>券数量：总({{ privilege.coupon_total_count }}) 剩({{ privilege.coupon_remain_count }})</div>
            <div>有效期：{{ privilege.coupon_start_time }} - {{ privilege.coupon_end_time }}</div>
        </template>
    </Dialog>
</template>

<script>
    import {Dialog} from 'element-ui'

    export default {
        name: "MaxCommissionRate",
        props: {
            option: {
                type: Object,
                default: function _default() {
                    return {}
                }
            }
        },
        data() {
            return {
                privilege: {}
            }
        },
        watch: {
            'option.visible'(val) {
                if (val === true) {
                    const _self = this;
                    _self.$http.get('/bridge/HighestRate', {
                        loading: false,
                        params: {
                            goods_id: _self.option.itemId
                        }
                    }).then(data => {
                        _self.privilege = data.result
                    });

                    // _self.$axios.get('/top/historical.unit.price/' + _self.option.itemId).then(resp => {
                    //     const prices = resp.data;
                    //     prices.sort((a, b) => {
                    //         return new Date(b.time) - new Date(a.time)
                    //     });
                    //     this.prices = prices.slice(0, 6)
                    // })
                } else {
                    this.privilege = {};
                    // this.prices = []
                }
            }
        },
        components: {
            Dialog
        }
    }
</script>
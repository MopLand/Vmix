<template>
    <div class="main-content">
        <Form :inline="true" :model="query" size="mini" ref="form" @submit.native.prevent="onSubmit('form')">
            <FormItem label="搜索条件">
                <Input v-model="query.keyword" placeholder="商品ID/商品标题"/>
            </FormItem>
            <FormItem style="width: 82px;">
                <Input v-model="query.expire" placeholder="到期天数"/>
            </FormItem>
            <FormItem>
                <Checkbox :true-label="1" v-model="query.scoop" :checked="query.scoop ? true : false">被挖</Checkbox>
            </FormItem>
            <FormItem>
                <Button type="primary" native-type="submit">查询</Button>
            </FormItem>
        </Form>
        <Table :data="pagination.result"
               :highlight-current-row="true"
               :height="tableHight"
               stripe
               border
               ref="table"
               style="width: 100%">
            <TableColumn label="商品信息" width="366" min-width="366" :fixed="true">
                <GoodInfo slot-scope="scope" :good="scope.row"/>
            </TableColumn>
            <TableColumn label="活动ID" width="86">
                <router-link :to="{ name: 'eventGood',params:{ eventId: scope.row.event_id }, query: { keyword: scope.row.goods_id } }" slot-scope="scope">
                    {{ scope.row.event_id }}
                </router-link>
            </TableColumn>
            <TableColumn label="排期时间" align="center" width="110">
                <GoodTime slot-scope="scope" :good="scope.row"/>
            </TableColumn>
            <TableColumn label="审核佣金" align="right" width="70">
                <span slot-scope="scope" v-if="scope.row.attr_ratio">
                    {{ scope.row.attr_ratio }}%
                </span>
            </TableColumn>
            <TableColumn label="当前佣金" align="right" width="70">
                <span slot-scope="scope" v-if="scope.row.current_ratio">
                    {{ scope.row.current_ratio }}%
                </span>
            </TableColumn>
            <TableColumn label="被挖" align="center" width="48">
                <span slot-scope="scope" style="color: red;" v-if="Number(scope.row.attr_ratio || '0') < Number(scope.row.current_ratio || '0')">
                    是
                </span>
            </TableColumn>
            <TableColumn label="检测时间" align="center" width="140">
                <span slot-scope="scope" v-if="scope.row.updated_time">
                    {{ scope.row.updated_time * 1000 | dateformat }}
                </span>
            </TableColumn>
            <TableColumn label="服务费率" align="right" width="70" :show-overflow-tooltip="true">
                <span slot-scope="scope" v-if="scope.row.service_ratio">
                    {{ scope.row.service_ratio }}%
                </span>
            </TableColumn>
            <TableColumn label="优惠券" width="120">
                <div class="coupon" slot-scope="scope">
                    <template v-if="scope.row.coupon_explain">
                        <p>阿里妈妈推广</p>
                        <p>{{ scope.row.coupon_explain }}</p>
                        <p>（{{ scope.row.coupon_surplus }}/{{ scope.row.coupon_total }}）</p>
                        <p><i class="ml5 pubfont icon-shuoming" style="font-size: 14px; margin-left: 5px"></i></p>
                    </template>
                    <span v-else>无</span>
                </div>
            </TableColumn>
            <TableColumn label="店铺类型" align="center" width="70">
                <span slot-scope="scope">
                    {{ scope.row.attr_site === 'tmall' ? '天猫' : '淘宝' }}
                </span>
            </TableColumn>
            <TableColumn label="审核时间" align="center" width="140">
                <span slot-scope="scope">
                    {{ scope.row.created_time * 1000 | dateformat }}
                </span>
            </TableColumn>
        </Table>
        <Pagination v-if="pagination.pagecount> 1 "
                    @current-change="toPage"
                    :page-size.sync="pagination.pagesize || 40"
                    :total="pagination.rowscount || 0"
                    :current-page.sync="pagination.pagenum"
                    :pager-count="11"
                    background
                    layout="prev, pager, next, total"/>
    </div>
</template>

<script>
    import {
        Table, TableColumn, Form, FormItem, Input, Button, Pagination, Checkbox
    } from 'element-ui'
    import BaseTable from '../../components/BaseTable'
    import GoodInfo from '../../components/TableColumnGoodInfo'
    import GoodTime from '../../components/TableColumnGoodTime'

    export default {
        name: "Effect",
        extends: BaseTable,
        data() {
            return {
                apiUrl: '/event/goods',
                visible: false,
                seller: {}
            }
        },
        methods: {
            doView(row) {
                this.seller = {};
                this.$axios.get('/user/seller/contact/' + row.sellerId).then(resp => {
                    this.seller = resp.data;
                    this.visible = true
                })
            }
        },
        components: {
            Table, TableColumn, Form, FormItem, Input, Button, Pagination, Checkbox,
            GoodInfo, GoodTime
        }
    }
</script>

<style scoped>
    .el-table {
        font-size: 12px;
        border: none;
    }

    .coupon p {
        margin: 0;
        color: rgb(51, 51, 51);
        line-height: 17px;
    }
</style>
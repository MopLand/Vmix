<template>
    <div class="main-content">
        <Form :inline="true" :model="query" size="mini" @submit.native.prevent="onSubmit">
            <FormItem label="搜索条件">
                <Input v-model="query.keyword" placeholder="商品ID/商品标题"/>
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
            <TableColumn prop="trade_id" label="订单号" width="150"/>
            <TableColumn prop="create_time" label="创建时间" align="center" width="140"/>
            <TableColumn prop="goods_name" label="商品标题" width="230" :show-overflow-tooltip="true">
                <a slot-scope="scope" target="_blank" :href="'//item.taobao.com/item.htm?id=' + scope.row.goods_id">{{ scope.row.goods_name }}</a>
            </TableColumn>
            <TableColumn prop="seller_shop" label="店铺" width="110" :show-overflow-tooltip="true"/>
            <TableColumn prop="seller_wang" label="旺旺" width="110" :show-overflow-tooltip="true"/>
            <TableColumn prop="goods_num" label="下单数" align="right" width="70"/>
            <TableColumn prop="attr_price" label="单价" align="right" width="70"/>
            <TableColumn prop="service_ratio" label="服务费率" align="right" width="70"/>
            <TableColumn prop="attr_amount" label="支付金额" align="right" width="70"/>
            <TableColumn prop="service_charge" label="预估服务费" align="right" width="90"/>
            <TableColumn prop="status" label="状态" align="center" width="70" :formatter="formatStatus"/>
            <TableColumn prop="settle_time" label="结算时间" align="center" width="140"/>
            <TableColumn prop="settle_amount" label="结算金额" align="right" width="70"/>
            <TableColumn prop="settle_charge" label="结算服务费" align="right" width="90"/>
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
    import BaseTable from '../../../components/BaseTable'
    import {
        Table, TableColumn, Form, FormItem, Input, Button, Pagination
    } from 'element-ui'

    export default {
        name: "Order",
        extends: BaseTable,
        data() {
            return {
                apiUrl: '/event/order?event_id=' + this.$route.params.eventId
            }
        },
        methods: {
            formatStatus(row, column, cellValue) {
                switch (cellValue) {
                    case '0':
                    case '1':
                        return '订单付款';
                    case '2':
                        return '订单结算';
                    case '-1':
                        return '订单失效';
                    default:
                        return cellValue;
                }
            }
        },
        components: {
            Table, TableColumn, Form, FormItem, Input, Button, Pagination
        }
    }
</script>
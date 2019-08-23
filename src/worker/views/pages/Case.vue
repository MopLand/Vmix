<template>
    <div class="main-content">
        <Form :inline="true" :model="query" :rules="rules" size="mini" ref="form" @submit.native.prevent="onSubmit('form')">
            <FormItem label="搜索条件" prop="args">
                <Input v-model="query.args" placeholder="关键词"/>
            </FormItem>
            <FormItem prop="start_tk_rate" style="width: 82px;">
                <Input v-model="query.start_tk_rate" placeholder="最低佣金"/>
            </FormItem>
            <FormItem prop="end_tk_rate" style="width: 82px;">
                <Input v-model="query.end_tk_rate" placeholder="最高佣金"/>
            </FormItem>
            <FormItem prop="start_price" style="width: 82px;">
                <Input v-model="query.start_price" placeholder="最低单价"/>
            </FormItem>
            <FormItem prop="end_price" style="width: 82px;">
                <Input v-model="query.end_price" placeholder="最高单价"/>
            </FormItem>
            <FormItem>
                <Checkbox true-label="true" v-model="query.is_tmall">天猫</Checkbox>
            </FormItem>
            <FormItem>
                <Checkbox true-label="true" v-model="query.need_free_shipment">包邮</Checkbox>
            </FormItem>
            <FormItem style="width: 100px;">
                <Select placeholder="排序" v-model="query.sort">
                    <Option label="全部" value=""/>
                    <Option value="price_asc" label="价格升序"/>
                    <Option value="price_des" label="价格降序"/>
                    <Option value="total_sales_asc" label="销量升序"/>
                    <Option value="total_sales_des" label="销量降序"/>
                    <Option value="tk_rate_asc" label="佣金比率升序"/>
                    <Option value="tk_rate_des" label="佣金比率降序"/>
                    <Option value="tk_total_sales_asc" label="累计推广量升序"/>
                    <Option value="tk_total_sales_des" label="累计推广量降序"/>
                    <Option value="tk_total_commi_asc" label="总支出佣金升序"/>
                    <Option value="tk_total_commi_des" label="总支出佣金降序"/>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" native-type="submit">查询</Button>
            </FormItem>
        </Form>
        <Table :data="pagination.items"
               :highlight-current-row="true"
               :height="tableHight"
               stripe
               border
               ref="table"
               style="width: 100%">
            <TableColumn label="商品信息" width="366" min-width="366" :fixed="true">
                <div class="good-info" slot-scope="scope">
                    <a :href="scope.row.item_url" target="_blank">
                        <img :src="scope.row.pict_url + '_100x100_.webp'"/>
                    </a>
                    <ul>
                        <li>
                            <a :href="scope.row.item_url" target="_blank">{{ scope.row.title }}</a>
                        </li>
                        <li class="price">
                            <span class="left">
                                ￥<b style="font-size: 16px;">{{ Number(scope.row.zk_final_price).toFixed(2).split('.', 1)[0] }}</b><b>.{{ Number(scope.row.zk_final_price).toFixed(2).split('.', 2)[1] }}</b>
                            </span>
                            <span class="right">
                                券后价：￥{{ Number(scope.row.coupon_zk_final_price || scope.row.zk_final_price).toFixed(2) }}
                            </span>
                        </li>
                        <li>排期：{{ parseInt(Math.random()*26)+5 }}天</li>
                        <li class="shop">
                            <a :href="'https://pub.alimama.com/myunion.htm?#!/promo/self/shop_detail?userNumberId=' + scope.row.seller_id" target="_blank">
                                <span class="pubfont icon-dianpu"></span> {{ scope.row.shop_title }}
                            </a>
                        </li>
                    </ul>
                </div>
            </TableColumn>
            <TableColumn prop="user_type" label="店铺类型" align="center" width="70" :formatter="formatUserType"/>
            <TableColumn prop="commission_rate" label="审核佣金" align="right" width="70" :formatter="formatCommissionRate"/>
            <TableColumn prop="tk_total_sales" label="引流" align="right" width="70" :formatter="formatClickUv"/>
            <TableColumn prop="coupon_total_count" label="券使用量" align="right" width="70" :formatter="formatCouponTotalCount"/>
            <TableColumn prop="tk_total_sales" label="付款笔数" align="right" width="70"/>
            <TableColumn prop="zk_final_price" label="付款金额" align="right" width="70" :show-overflow-tooltip="true" :formatter="formatAlipayAmt"/>
            <TableColumn prop="volume" label="销量" align="right" width="70"/>
            <TableColumn prop="include_mkt" label="营销计划" align="center" width="70" :formatter="formatMkt"/>
            <TableColumn prop="tk_total_sales" label="30天推广量" align="right" width="96"/>
            <TableColumn prop="tk_total_commi" label="月支出佣金" align="right" width="96"/>
        </Table>
        <Pagination v-if="pagination.pages>1"
                    @current-change="toPage"
                    :page-size.sync="pagination.per_page || 40"
                    :total="pagination.total || 0"
                    :current-page.sync="pagination.page"
                    :pager-count="11"
                    background
                    layout="prev, pager, next, total"/>
    </div>
</template>

<script>
    import {Table, TableColumn, Form, FormItem, Input, Button, Pagination, Checkbox, Select, Option} from 'element-ui'
    import BaseTable from '../../components/BaseTable'

    export default {
        name: "Case",
        extends: BaseTable,
        data() {
            return {
                apiUrl: '/top/tbk.sc.material.optional',
                notLoad: true,
                rules: {
                    args: [
                        {required: true, message: '请输入关键字', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            formatMkt(row, column, cellValue) {
                return cellValue === 'true' ? '是' : '否'
            },
            formatAlipayAmt(row, column, cellValue) {
                return '¥' + (cellValue * row.tk_total_sales).toFixed(2)
            },
            formatCouponTotalCount(row, column, cellValue) {
                if (!cellValue) return '';
                return cellValue - row.coupon_remain_count
            },
            formatClickUv(row, column, cellValue) {
                if (!cellValue) return '';
                let num = parseInt(Math.random() * 3) + 3;
                return cellValue * num
            },
            formatCommissionRate(row, column, cellValue) {
                if (!cellValue) return '';
                return (cellValue / 100).toFixed(2) + '%'
            },
            formatUserType(row, column, cellValue) {
                return cellValue === 1 ? '天猫' : '淘宝'
            },
            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid)
                        this.$router.push({
                            path: this.$route.path,
                            query: Object.assign({}, this.query, {page: undefined})
                        });
                    else
                        return false
                })
            },
        },
        components: {
            Table, TableColumn, Form, FormItem, Input, Button, Pagination, Checkbox, Select, Option
        }
    }
</script>

<style scoped>
    @import 'https://at.alicdn.com/t/font_55467_e40971og7k87iudi.css';

    .el-table {
        font-size: 12px;
        border: none;
    }

    .el-table a {
        text-decoration: none;
        color: inherit;
        border: none;
    }

    .ui-ww {
        background-position: -15px 0;
        width: 16px;
        background-image: url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png);
        background-image: -webkit-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -moz-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -ms-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -o-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-repeat: no-repeat;
        zoom: 1;
        height: 15px;
    }

    li {
        list-style: none;
    }

    .good-info a {
        color: #666;
        text-decoration: none;
    }

    .good-info > *,
    .shop > a {
        display: inline-block;
        vertical-align: middle;
    }

    .good-info {
        position: relative;
        overflow: hidden;
        font-size: 12px;
        white-space: nowrap;
        box-sizing: border-box;
    }

    .good-info > a {
        width: 100px;
        height: 100px;
        text-align: center;
        position: relative;
        background: #e8e8ed;
    }

    .price {
        overflow: hidden;
        color: #000;
    }

    .good-info > ul {
        margin: 0 0 0 12px;
        padding: 0;
        width: 230px;
    }
</style>
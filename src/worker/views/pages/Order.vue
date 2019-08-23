<template>
    <div class="main-content">
        <Form :inline="true" :model="query" :rules="rules" size="mini" ref="form" @submit.native.prevent="onSubmit('form')">
            <FormItem label="搜索条件">
                <Input v-model="query.keyword" placeholder="商品ID/商品标题"/>
            </FormItem>
            <FormItem prop="rangeDate">
                <DatePicker v-model="query.rangeDate"
                            type="daterange"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyyMMdd"
                            :picker-options="pickerOptions"/>
            </FormItem>
            <FormItem>
                <Button type="primary" native-type="submit">查询</Button>
            </FormItem>
            <!--<FormItem class="sum">-->
            <!--成交数：<span style="color: #F56C6C;">{{ pagination.itemNum || 0 }}</span>-->
            <!--成交金额：<span style="color: #E6A23C;">{{ pagination.payAmount || 0 }}</span>-->
            <!--预估服务费：<span style="color: #67C23A;">{{ pagination.payServiceFee || 0 }}</span>-->
            <!--</FormItem>-->
        </Form>
        <Table :data="pagination.result"
               :highlight-current-row="true"
               :height="tableHight"
               stripe
               border
               ref="table"
               style="width: 100%">
            <TableColumn prop="event_id" label="活动ID" width="120"/>
            <TableColumn prop="goods_id" label="商品id" width="120"/>
            <TableColumn prop="goods_name" label="商品标题" width="300" :show-overflow-tooltip="true">
                <a slot-scope="scope" target="_blank" :href="'//item.taobao.com/item.htm?id=' + scope.row.goods_id">{{ scope.row.goods_name }}</a>
            </TableColumn>
            <TableColumn prop="seller_shop" label="店铺" width="130" :show-overflow-tooltip="true"/>
            <TableColumn prop="seller_wang" label="旺旺" width="130" :show-overflow-tooltip="true"/>
            <TableColumn prop="count" label="成交数" align="right" width="100"/>
            <TableColumn prop="attr_amount" label="成交金额" align="right" width="100" :formatter="toFixed"/>
            <TableColumn prop="service_charge" label="预估服务费" align="right" width="100" :formatter="toFixed"/>
        </Table>
        <Pagination v-if="pagination.pagecount > 1"
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
    import {Table, TableColumn, Form, FormItem, Input, Button, Pagination, DatePicker} from 'element-ui'
    import BaseTable from '../../components/BaseTable'

    export default {
        name: "Order",
        extends: BaseTable,
        data() {
            return {
                apiUrl: '/event/collect',
                notLoad: true,
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '今天',
                            onClick(picker) {
                                const now = new Date();
                                picker.$emit('pick', [now, now]);
                            }
                        }, {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                rules: {
                    rangeDate: [
                        {required: true, message: '请输入日期范围', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.query.start = this.query.rangeDate[0];
                        this.query.end = this.query.rangeDate[1];
                        this.$router.push({
                            path: this.$route.path,
                            query: Object.assign({}, this.query, {page: undefined})
                        })
                    } else {
                        return false
                    }
                })
            },
            toFixed(row, column, cellValue) {
                if (!cellValue) return '';
                return Number(cellValue).toFixed(2)
            }
        },
        components: {Table, TableColumn, Form, FormItem, Input, Button, Pagination, DatePicker}
    }
</script>

<style scoped>
    .el-table {
        font-size: 12px;
        border: none;
    }

    .sum {
        margin-left: 10px;
    }

    .sum span {
        margin-right: 10px;
    }
</style>
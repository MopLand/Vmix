<template>
    <div class="main-content">
        <Form :inline="true" :model="query" size="mini" @submit.native.prevent="onSubmit">
            <FormItem label="搜索条件">
                <Input v-model="query.keyword" placeholder="商品ID/商品标题/店铺名"/>
            </FormItem>
            <FormItem>
                <Button type="primary" native-type="submit">查询</Button>
            </FormItem>
        </Form>
        <Table :data="pagination.result"
               border
               stripe
               :highlight-current-row="true"
               :height="tableHight"
               ref="table"
               style="width: 100%">
            <TableColumn label="商品信息" width="366" min-width="366" :fixed="true">
                <GoodInfo slot-scope="scope" :good="scope.row"/>
            </TableColumn>
            <TableColumn label="店铺类型" align="center" width="70">
                <span slot-scope="scope">
                    {{ scope.row.userType === 1 ? '天猫' : '淘宝' }}
                </span>
            </TableColumn>
            <TableColumn label="审核佣金" align="right" width="70">
                <span slot-scope="scope" v-if="scope.row.commissionRate">
                    {{ scope.row.commissionRate.toFixed(2) }}%
                </span>
            </TableColumn>
            <TableColumn prop="clickUv" label="引流UV" align="right" width="70"/>
            <TableColumn prop="couponUseNum" label="券使用量" align="right" width="70"/>
            <TableColumn prop="alipayNum" label="付款笔数" align="right" width="70"/>
            <TableColumn label="付款金额" align="right" width="70" :show-overflow-tooltip="true">
                <span slot-scope="scope" v-if="scope.row.alipayAmt !== null">
                    ￥{{ scope.row.alipayAmt.toFixed(2) }}
                </span>
            </TableColumn>
            <TableColumn label="服务费率" align="right" width="70" :show-overflow-tooltip="true">
                <span slot-scope="scope" v-if="scope.row.avgServiceRate !== null">
                    {{ scope.row.avgServiceRate.toFixed(2) }}%
                </span>
            </TableColumn>
            <TableColumn label="预估付款服务费" align="right" width="110" :show-overflow-tooltip="true">
                <span slot-scope="scope" v-if="scope.row.preServiceFee !== null">
                    ￥{{ scope.row.preServiceFee.toFixed(2) }}
                </span>
            </TableColumn>
            <TableColumn prop="settleNum" label="结算笔数" align="right" width="70"/>
            <TableColumn label="结算金额" align="right" width="70" :show-overflow-tooltip="true">
                <span slot-scope="scope" v-if="scope.row.settleAmt !== null">
                    ￥{{ scope.row.settleAmt.toFixed(2) }}
                </span>
            </TableColumn>
            <TableColumn label="预估结算服务费" align="right" width="110" :show-overflow-tooltip="true">
                <span slot-scope="scope" v-if="scope.row.cmServiceFee !== null">
                    ￥{{ scope.row.cmServiceFee.toFixed(2) }}
                </span>
            </TableColumn>
            <TableColumn prop="taokeNum" label="淘宝客数" align="right" width="70"/>
            <TableColumn label="排期时间" align="center" width="110">
                <div class="good-time" slot-scope="scope">
                    <div>起：{{ scope.row.startTime }}</div>
                    <div>止：{{ scope.row.endTime }}</div>
                </div>
            </TableColumn>
        </Table>
        <Pagination v-if="pagination.totalPages>1"
                    @current-change="toPage"
                    :page-size.sync="pagination.pageSize || 40"
                    :total="pagination.totalCount || 0"
                    :current-page.sync="pagination.pageNo"
                    :pager-count="11"
                    background
                    layout="prev, pager, next, total"/>
    </div>
</template>

<script>
    import {
        Table, TableColumn, Form, FormItem, Input, Button, Pagination
    } from 'element-ui'
    import GoodInfo from '../../../components/TableColumnEventGood'

    export default {
        name: "Effect",
        computed: {
            hasPagination() {
                return (this.pagination.totalPages || 0) > 1
            }
        },
        data() {
            return {
                apiUrl: '/bridge/EventEffect/report?event_id=' + this.$route.params.eventId,
                pagination: {},
                query: {},
                tableHight: null
            }
        },
        watch: {
            '$route'(to) {
                this.loadData(to.query);
            },
            'pagination.totalPages'(value) {
                this.tableHight = this.$el.offsetHeight - 48 - ((value || 0) > 1 ? 38 : 0)
            }
        },
        methods: {
            loadData(query) {
                const _self = this;
                query.page = query.page || 1;
                query.size = query.size || 40;

                this.query = Object.assign({}, query)
                _self.$http.get(this.apiUrl, {params: query}).then(resp => {
                    _self.pagination = resp.result;
                    if (_self.$refs.table) {
                        _self.$refs.table.bodyWrapper.scrollTop = 0;
                    }
                })
            },
            toPage(page) {
                this.$router.push({
                    path: this.$route.path,
                    query: Object.assign({}, this.$route.query, {page: page})
                })
            },
            onSubmit() {
                this.$router.push({
                    path: this.$route.path,
                    query: Object.assign({}, this.query, {page: 1})
                })
            }
        },
        mounted() {
            const _self = this;
            this.loadData(this.$route.query);
            _self.tableHight = _self.$el.offsetHeight - 48;
            window.onresize = () => {
                _self.tableHight = _self.$el.offsetHeight - 48 - (_self.hasPagination ? 38 : 0)
            };
        },
        components: {
            Table, TableColumn, Form, FormItem, Input, Button, Pagination,
            GoodInfo
        }
    }
</script>

<style scoped>
    .el-table {
        font-size: 12px;
        border: none;
    }

    .el-table a {
        text-decoration: none;
        color: inherit;
        border: none;
    }
</style>
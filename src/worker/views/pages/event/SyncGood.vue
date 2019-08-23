<template>
    <div class="main-content">
        <Form :inline="true" :model="query" size="mini" @submit.native.prevent="onSubmit">
            <FormItem label="搜索条件">
                <Input v-model="query.keyword" placeholder="标题关键词/商品ID/店铺名"/>
            </FormItem>
            <FormItem style="width: 100px;">
                <Select placeholder="审核状态" v-model="query.auditStatus">
                    <Option label="全部" value=""/>
                    <Option label="待审核" value="1"/>
                    <Option label="通过" value="2"/>
                    <Option label="拒绝" value="3"/>
                </Select>
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
            <TableColumn label="商品信息" width="366" min-width="366">
                <GoodInfo slot-scope="scope" :good="scope.row"/>
            </TableColumn>
            <TableColumn label="状态" width="140">
                <AuditStatus slot-scope="scope" :good="scope.row"/>
            </TableColumn>
            <TableColumn label="排期" align="center" width="110">
                <GoodTime slot-scope="scope" :good="scope.row"/>
            </TableColumn>
            <TableColumn label="佣金比例" align="right" width="80">
                <div slot-scope="scope" style="color: #f50;" v-if="scope.row.commissionRate">
                    <b style="font-size: 16px; display: inline-block;">
                        {{ scope.row.commissionRate.toFixed(2).split('.', 1)[0] }}
                    </b>
                    <b>.{{ scope.row.commissionRate.toFixed(2).split('.', 2)[1] }}%</b>
                </div>
            </TableColumn>
            <TableColumn label="服务费率" align="right" width="80">
                <div slot-scope="scope" style="color: #f50;" v-if="scope.row.serviceRate">
                    <b style="font-size: 16px; display: inline-block;">
                        {{ scope.row.serviceRate.toFixed(2).split('.', 1)[0] }}
                    </b>
                    <b>.{{ scope.row.serviceRate.toFixed(2).split('.', 2)[1] }}%</b>
                </div>
            </TableColumn>
            <TableColumn label="优惠券" width="120">
                <TableColumnCoupon slot-scope="scope" :good="scope.row"/>
            </TableColumn>
            <TableColumn label="店铺类型" align="center" width="70">
                <span slot-scope="scope">
                    {{ scope.row.userType === 1 ? '天猫' : '淘宝' }}
                </span>
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
        Table, TableColumn, Form, FormItem, Input, Button, Pagination, Select, Option,
    } from 'element-ui'
    import GoodInfo from '../../../components/TableColumnGoodInfo'
    import AuditStatus from '../../../components/TableColumnGoodAuditStatus'
    import GoodTime from '../../../components/TableColumnGoodTime'
    import TableColumnCoupon from '../../../components/TableColumnCoupon'

    export default {
        name: "SyncGood",
        data() {
            return {
                apiUrl: '/event/' + this.$route.params.eventId + '/sync/good',
                pagination: {},
                query: {},
                tableHight: null
            }
        },
        computed: {
            hasPagination() {
                return (this.pagination.totalPages || 0) > 1
            }
        },
        methods: {
            loadData(query) {
                const _self = this;
                query.pageSize = query.pageSize || 40;

                this.query = Object.assign({}, query)
                _self.$http.get(this.apiUrl, {params: query}).then(resp => {
                    _self.pagination = resp.data;
                    if (_self.$refs.table) {
                        _self.$refs.table.bodyWrapper.scrollTop = 0;
                    }
                })
            },
            toPage(page) {
                this.$router.push({
                    path: this.$route.path,
                    query: Object.assign({}, this.$route.query, {toPage: page})
                })
            },
            onSubmit() {
                this.$router.push({
                    path: this.$route.path,
                    query: Object.assign({}, this.query, {toPage: undefined})
                })
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
        mounted() {
            const _self = this;
            this.loadData(this.$route.query);
            _self.tableHight = _self.$el.offsetHeight - 48;
            window.onresize = () => {
                _self.tableHight = _self.$el.offsetHeight - 48 - (_self.hasPagination ? 38 : 0)
            };
        },
        components: {
            Table, TableColumn, Form, FormItem, Input, Button, Pagination, Select, Option,
            GoodInfo, AuditStatus, GoodTime, TableColumnCoupon
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
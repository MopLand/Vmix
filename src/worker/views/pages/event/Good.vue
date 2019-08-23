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
                <div class="good-time" slot-scope="scope">
                    <div>起：{{ scope.row.startTime }}</div>
                    <div>止：{{ scope.row.endTime }}</div>
                </div>
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
            <TableColumn label="操作">
                <ButtonGroup slot-scope="scope">
                    <Button size="mini" type="warning" @click.stop="doCommissionRate(scope.row)">佣金</Button>
                    <Button size="mini" type="success" @click.stop="doAudit(scope.row)" v-if="scope.row.auditStatus === 1 && scope.row.itemStatus !== -1">审核</Button>
                    <Button size="mini" type="primary" @click.stop="doCoupon(scope.row)"
                            v-if="scope.row.auditStatus === 2 && scope.row.itemStatus !== -1 && scope.row.couponChannelName">优惠券
                    </Button>
                </ButtonGroup>
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
        <MaxCommissionRate :option="option"/>
        <Dialog title="查看优惠券" :visible.sync="coupon.visible" :center="true">
            <Form :model="coupon.object" label-width="80px">
                <FormItem label="优惠券">
                    <Input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="coupon.object.couponOnlyLink"/>
                </FormItem>
            </Form>
        </Dialog>
    </div>
</template>

<script>
    import {
        Table, TableColumn, Form, FormItem, Input, Button, ButtonGroup, Pagination, Select, Option, Dialog
    } from 'element-ui'
    import GoodInfo from '../../../components/TableColumnEventGood'
    import AuditStatus from '../../../components/TableColumnGoodAuditStatus'
    import TableColumnCoupon from '../../../components/TableColumnCoupon'
    import MaxCommissionRate from '../../../components/MaxCommissionRate'
    import qs from 'qs'

    export default {
        name: "Good",
        data() {
            return {
                apiUrl: '/bridge/itemlist?event_id=' + this.$route.params.eventId,
                pagination: {},
                query: {},
                tableHight: null,
                option: {
                    visible: false
                },
                coupon: {
                    visible: false,
                    object: {}
                }
            }
        },
        computed: {
            hasPagination() {
                return (this.pagination.totalPages || 0) > 1
            }
        },
        watch: {
            '$route'(to) {
                this.loadData(to.query);
            },
            'pagination.totalPages'(value) {
                this.tableHight = this.$el.offsetHeight - 48 - ((value || 0) > 1 ? 38 : 0)
            },
            'coupon.visible'(val) {
                if (!val) {
                    this.coupon.object = {}
                }
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
            },
            doCommissionRate(good) {
                this.option.itemId = good.itemId;
                this.option.visible = true;
            },
            doAudit(good) {
                this.$confirm('是否审核商品：' + good.title + '，注意：请勿随意审核产品，避免拉低活动成交率！', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/bridge/auditItem', qs.stringify({
                        event_id: this.$route.params.eventId,
                        goods_id: good.itemId,
                        status: 2
                    })).then(() => {
                        this.$message.success('审核成功！');
                        this.loadData(this.query);
                    });
                }).catch(() => {
                })
            },
            doCoupon(good) {
                this.$http.get('/bridge/AuctionCode', {
                    params: {
                        event_id: this.$route.params.eventId,
                        goods_id: good.itemId
                    }
                }).then(data => {
                    this.coupon.object = data.result;
                    this.coupon.visible = true
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
            Table, TableColumn, Form, FormItem, Input, Button, ButtonGroup, Pagination, Select, Option,
            GoodInfo, AuditStatus, TableColumnCoupon, MaxCommissionRate, Dialog
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
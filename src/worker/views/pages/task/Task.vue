<template>
    <div class="main-content">
        <Form :inline="true" :model="query" size="mini" @submit.native.prevent="onSubmit">
            <FormItem label="搜索条件">
                <Input v-model="query.args" placeholder="商品ID/商品标题/店铺名"/>
            </FormItem>
            <FormItem style="width: 100px;">
                <Select placeholder="店铺类型" v-model="query.userType">
                    <Option label="全部" value=""/>
                    <Option label="淘宝" value="0"/>
                    <Option label="天猫" value="1"/>
                </Select>
            </FormItem>
            <FormItem style="width: 100px;">
                <Select placeholder="状态" v-model="query.status">
                    <Option label="全部" value=""/>
                    <Option label="待处理" value="0"/>
                    <Option label="已完成" value="1"/>
                    <Option label="已锁定" value="3"/>
                </Select>
            </FormItem>
            <FormItem>
                <Checkbox :true-label="1" v-model="query.biz30day">销量排序</Checkbox>
            </FormItem>
            <FormItem>
                <Button type="primary" native-type="submit">查询</Button>
            </FormItem>
        </Form>
        <Table :data="pagination.items"
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
            <TableColumn label="操作">
                <ButtonGroup slot-scope="scope">
                    <Button size="mini" type="success" @click.stop="doCompleted(scope.row)" v-if="scope.row.oper_status!==1">已完成</Button>
                    <Button size="mini" type="danger" @click.stop="doLocked(scope.row)" v-if="scope.row.oper_status===0">锁定</Button>
                    <Button size="mini" type="warning" @click.stop="doCommissionRate(scope.row)">佣金</Button>
                </ButtonGroup>
            </TableColumn>
        </Table>
        <Pagination v-if="pagination.pages>1"
                    @current-change="toPage"
                    :page-size.sync="pagination.per_page || 40"
                    :total="pagination.total || 0"
                    :current-page.sync="pagination.page"
                    :pager-count="11"
                    background
                    layout="prev, pager, next, total"/>
        <MaxCommissionRate :option="option"/>
    </div>
</template>

<script>
    import BaseTable from '../../../components/BaseTable'
    import {
        Table, TableColumn, Form, FormItem, Input, Button, ButtonGroup, Pagination, Select, Option, Checkbox
    } from 'element-ui'
    import GoodInfo from '../../../components/TableColumnGoodInfo'
    import AuditStatus from '../../../components/TableColumnGoodAuditStatus'
    import GoodTime from '../../../components/TableColumnGoodTime'
    import TableColumnCoupon from '../../../components/TableColumnCoupon';
    import MaxCommissionRate from '../../../components/MaxCommissionRate'

    export default {
        extends: BaseTable,
        name: "Task",
        data() {
            return {
                apiUrl: '/task/good/' + this.$route.params.type,
                option: {
                    visible: false
                }
            }
        },
        methods: {
            doCommissionRate(good) {
                this.option.itemId = good.itemId;
                this.option.visible = true;
            },
            doCompleted(good) {
                this.$confirm('确认[' + good.shopTitle + ']已谈成，本操作会自动处理该商家所有商品！', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/event/' + good.eventId, {
                        sellerId: good.sellerId,
                        status: 1,
                        type: this.$route.params.type
                    }).then(resp => {
                        this.$message({
                            message: '成功处理' + resp.data.result + '条商品！',
                            type: 'success'
                        });
                        this.loadData(this.query);
                    })
                }).catch(() => {
                })
            },
            doLocked(good) {
                this.$confirm('确认锁定[' + good.shopTitle + ']，超过24小时未成功谈妥该商家将被释放！', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/event/' + good.eventId, {
                        sellerId: good.sellerId,
                        status: 3,
                        type: this.$route.params.type
                    }).then(resp => {
                        this.$message({
                            message: '成功处理' + resp.data.result + '条商品！',
                            type: 'success'
                        });
                        this.loadData(this.query);
                    })
                }).catch(() => {
                })
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.apiUrl = '/task/good/' + to.params.type;
            next()
        },
        components: {
            Table, TableColumn, Form, FormItem, Input, Button, ButtonGroup, Pagination, Select, Option, Checkbox,
            GoodInfo, AuditStatus, GoodTime, TableColumnCoupon, MaxCommissionRate
        }
    }
</script>

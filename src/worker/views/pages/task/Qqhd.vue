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
                <div class="good-info" slot-scope="scope">
                    <a :href="scope.row.itemUrl" target="_blank">
                        <img :src="scope.row.pictUrl + '_100x100_.webp'"/>
                    </a>
                    <ul>
                        <li>
                            <a :href="scope.row.itemUrl" target="_blank">
                                {{ scope.row.itemTitle }}
                            </a>
                        </li>
                        <li><span class="c3">行业类目:</span> {{ scope.row.catTitle }}</li>
                        <li>¥{{ scope.row.discountPrice.toFixed(2) }}</li>
                        <li class="shop">
                            <span class="c3">{{ scope.row.wangwangName }}</span>
                            <a class="layui-inline ui-ww ui-ww-online" target="_blank"
                               :href="'https://www.taobao.com/webww/ww.php?ver=3&siteid=cntaobao&status=1&charset=utf-8&touid=' + scope.row.wangwangName">
                            </a>
                        </li>
                    </ul>
                </div>
            </TableColumn>
            <TableColumn label="30天最低成交价" align="right" width="120">
                <div slot-scope="scope">
                    ¥{{ scope.row.discountPrice.toFixed(2) }}
                </div>
            </TableColumn>
            <TableColumn label="是否符合30天最低价要求" prop="downloadCompToReqPrice" width="160"/>
            <TableColumn label="佣金比例" align="right" width="80">
                <div slot-scope="scope">
                    {{ scope.row.commissionRate.toFixed(2) }}%
                </div>
            </TableColumn>
            <TableColumn label="30天销量" prop="soldQuantity" width="80"/>
            <TableColumn label="类目" prop="catTitle" width="80"/>
            <TableColumn label="审核状态" width="70">
                <span slot-scope="scope" class="c3">
                    {{ scope.row.auditStatus === 1 ? '待审核' : '审核通过' }}
                </span>
            </TableColumn>
            <TableColumn label="分类名称" prop="tagTitle" width="80"/>
            <TableColumn label="电话" prop="phone" width="120"/>
            <TableColumn label="操作">
                <ButtonGroup slot-scope="scope">
                    <Button size="mini" type="success" @click.stop="doCommissionRate(scope.row)">佣金</Button>
                    <Button size="mini" type="warning" @click.stop="doEnd(scope.row)">已谈成</Button>
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
    import MaxCommissionRate from '../../../components/MaxCommissionRate'
    import {Table, TableColumn, ButtonGroup, Button, Form, FormItem, Select, Option, Checkbox, Pagination, Input} from 'element-ui'

    export default {
        extends: BaseTable,
        name: "Qqhd",
        data() {
            return {
                apiUrl: '/task/good/qqhd',
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
            doEnd(good) {
                this.$confirm('确认[' + good.shopTitle + ']已报名你的团长活动？本操作会自动处理该商家所有商品！', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/task/good/qqhd', {
                        sellerId: good.sellerId
                    }).then(() => {
                        this.$message({
                            message: '操作完成！',
                            type: 'success'
                        });
                        this.loadData(this.query);
                    })
                })
            }
        },
        components: {
            Table, TableColumn, ButtonGroup, Button, Form, FormItem, Select, Option, Checkbox, Pagination, Input,
            MaxCommissionRate
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

    .good-info > ul {
        margin: 0 0 0 12px;
        padding: 0;
        width: 230px;
    }

    .c3 {
        color: #a9a9a9;
    }

    .ui-ww-online {
        background-position: -15px 0;
        width: 16px;
    }

    .ui-ww, .ui-ww-small, .ui-ww-static {
        background-image: url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png);
        background-image: -webkit-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -moz-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -ms-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -o-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-repeat: no-repeat;
        display: inline-block;
        zoom: 1;
        text-decoration: none !important;
        height: 15px;
        width: 67px;
        vertical-align: middle;
    }
</style>
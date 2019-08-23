<template>
    <div class="main-content">
        <Form :inline="true" :model="query" size="mini" @submit.native.prevent="onSubmit">
            <FormItem label="搜索条件">
                <Input v-model="query.keyword" placeholder="活动id，活动标题"/>
            </FormItem>
            <FormItem>
                <Button type="primary" native-type="submit">查询</Button>
            </FormItem>
            <FormItem>
                <Button type="success" @click="option.visible=true">发布活动</Button>
            </FormItem>
        </Form>
        <Table :data="pagination.result"
               border
               stripe
               :highlight-current-row="true"
               :height="tableHight"
               ref="table"
               style="width: 100%">
            <TableColumn prop="event_id"
                         label="活动id"
                         :fixed="true"
                         width="90"/>
            <!--<TableColumn prop="username"-->
            <!--label="所属账号"-->
            <!--:show-overflow-tooltip="true"-->
            <!--width="120"/>-->
            <TableColumn prop="event_name"
                         label="活动标题"
                         :show-overflow-tooltip="true"
                         width="220"/>
            <TableColumn prop="wangwang"
                         label="预留旺旺"
                         :show-overflow-tooltip="true"
                         width="110"/>
            <TableColumn label="服务费率" prop="service_ratio" align="right" :show-overflow-tooltip="true"/>
            <TableColumn label="报名时间" align="center" width="100">
                <template slot-scope="scope">
                    <p>{{ scope.row.join_begin | dateformat('YYYY-MM-DD') }}</p>
                    <p>{{ scope.row.join_final | dateformat('YYYY-MM-DD') }}</p>
                </template>
            </TableColumn>
            <TableColumn label="活动时间" align="center" width="110">
                <template slot-scope="scope">
                    <p>{{ scope.row.event_begin | dateformat('YYYY-MM-DD') }}</p>
                    <p>{{ scope.row.event_final | dateformat('YYYY-MM-DD') }}</p>
                </template>
            </TableColumn>
            <TableColumn label="操作" header-align="center" align="center" width="260">
                <template slot-scope="scope">
                    <ButtonGroup>
                        <Tooltip effect="dark" content="复制报名链接" placement="top-start">
                            <Button size="mini" type="info" icon="fa fa-copy" @click.stop="doCopy(scope.row)"/>
                        </Tooltip>
                        <Tooltip effect="dark" content="查看报名产品" placement="top-start">
                            <Button size="mini" type="success" icon="el-icon-goods" @click.stop="toGood(scope.row)"/>
                        </Tooltip>
                        <Tooltip effect="dark" content="查看推广效果" placement="top-start">
                            <Button size="mini" type="primary" icon="fa fa-podcast" @click.stop="toEffect(scope.row)"/>
                        </Tooltip>
                        <Tooltip effect="dark" content="查看订单" placement="top-start">
                            <Button size="mini" type="warning" icon="fa fa-bars" @click.stop="toOrder(scope.row)"/>
                        </Tooltip>
                        <Tooltip effect="dark" content="这不是我的活动" placement="top-start">
                            <Button size="mini" type="danger" icon="el-icon-delete" @click.stop="deleteEvent(scope.row)"/>
                        </Tooltip>
                        <!--<Tooltip effect="dark" content="推广效果汇总" placement="top-start">-->
                        <!--<Button size="mini" type="info" icon="el-icon-info" @click.stop="toEffectSum(scope.row)"/>-->
                        <!--</Tooltip>-->
                    </ButtonGroup>
                </template>
            </TableColumn>
            <TableColumn label="推广效果" header-align="center">
                <TableColumn label="更新时间" align="center" width="140">
                    <span slot-scope="scope" v-if="scope.row.updated_time">
                        {{ scope.row.updated_time * 1000 | dateformat }}
                    </span>
                </TableColumn>
                <TableColumn label="推广商品数" width="82" prop="goods_count" align="right" :show-overflow-tooltip="true"/>
                <TableColumn label="引流UV" prop="click_uv" align="right" :show-overflow-tooltip="true"/>
                <TableColumn label="付款金额" prop="payment_amount" align="right" :show-overflow-tooltip="true"/>
                <TableColumn label="付款笔数" prop="payment_count" align="right" :show-overflow-tooltip="true"/>
                <TableColumn label="预估付款服务费" width="106" prop="service_charge" align="right" :show-overflow-tooltip="true"/>
                <TableColumn label="结算金额" prop="settle_amount" align="right" :show-overflow-tooltip="true"/>
                <TableColumn label="结算笔数" prop="settle_count" align="right" :show-overflow-tooltip="true"/>
                <TableColumn label="预估结算服务费" width="106" prop="settle_charge" align="right" :show-overflow-tooltip="true"/>
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
        <Dialog title="发布新活动" :visible.sync="option.visible" width="600px" :close-on-click-modal="false">
            <Form :model="form" :rules="rules" ref="form" @submit.native.prevent="submitPostEvent('form')">
                <FormItem label="" prop="subject">
                    <Autocomplete class="el-input"
                                  v-model="form.subject"
                                  value-key="subject"
                                  :fetch-suggestions="queryTitle"
                                  placeholder="请输入活动标题"></Autocomplete>
                </FormItem>
                <FormItem label="" prop="service">
                    <Input v-model.number="form.service" type="number" autocomplete="off" placeholder="服务费率"/>
                </FormItem>
            </Form>
            <div slot="footer" class="dialog-footer">
                <Button @click="option.visible = false">取 消</Button>
                <Button type="primary" @click="submitPostEvent('form')">确 定</Button>
            </div>
        </Dialog>
    </div>
</template>

<script>
    import {
        Table, TableColumn, Form, FormItem, Tooltip, Input, Button, ButtonGroup,
        Pagination, Dialog, Autocomplete
    } from 'element-ui'
    import moment from 'moment'
    import BaseTable from '../../components/BaseTable'
    import qs from 'qs'

    export default {
        name: "Event",
        extends: BaseTable,
        data() {
            return {
                apiUrl: '/event/index',
                form: {},
                rules: {
                    subject: [
                        {required: true, message: '请输入活动标题', trigger: 'blur'},
                        {max: 30, message: '长度不得超过30个字符', trigger: 'blur'}
                    ],
                    service: [
                        {required: true, message: '请输入服务费率', trigger: 'blur'},
                        {type: 'number', message: '请输入正确的服务费率', trigger: 'blur'}
                    ]
                },
                option: {
                    visible: false
                }
            }
        },
        methods: {
            doCopy(row) {
                this.$copyText('https://ad.alimama.com/zhaoshang/cpevent/index.htm?selectedChannel=1&keyword=' + row.event_id).then(() => {
                    this.$notify({
                        title: '成功',
                        message: '复制成功',
                        type: 'success'
                    })
                }, () => {
                    this.$notify({
                        title: '警告',
                        message: '复制失败，浏览器可能不兼容！',
                        type: 'warning'
                    })
                })
            },
            toPage(page) {
                this.$router.push({
                    path: this.$route.path,
                    query: Object.assign({}, this.$route.query, {page: page})
                })
            },
            toGood(row) {
                this.$router.push({name: 'eventGood', params: {eventId: row.event_id}})
            },
            toEffect(row) {
                this.$router.push({name: 'eventEffect', params: {eventId: row.event_id}})
            },
            submitPostEvent() {
                this.$refs['form'].validate(async (valid) => {
                    if (valid) {
                        await this.$http.post('/bridge/postEvent', qs.stringify(this.form));
                        this.$message.success('发布成功！');
                        this.loadData(this.query);
                        this.option.visible = false;
                    } else {
                        return false;
                    }
                });
            },
            toOrder(row) {
                this.$router.push({name: 'eventOrder', params: {eventId: row.event_id}})
            },
            formatDate(row, column, cellValue) {
                if (!cellValue) return '';
                return moment(cellValue).format('YYYY-MM-DD');
            },
            async queryTitle(str, cb) {
                let data = await this.$http.get('/subject/list', {
                    params: {
                        search: str
                    },
                    loading: false
                });
                cb(data.result)
            },
            deleteEvent(row) {
                this.$confirm('是否删除当前活动，删除该活动后，当前活动所产生的订单将不会再计入您的业绩?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        event_id: row.event_id
                    };
                    this.$http.post('/bridge/removeEvent', qs.stringify(data)).then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                })
            }
        },
        components: {
            Table, TableColumn, Form, FormItem, Input, Button, ButtonGroup, Tooltip,
            Pagination, Dialog, Autocomplete
        }
    }
</script>

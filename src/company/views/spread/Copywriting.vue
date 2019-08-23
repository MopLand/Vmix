<template>
    <div>
        <Form inline :model="query" @submit.native.prevent="onSubmit">
            <FormItem>
                <Input placeholder="产品ID/产品标题" v-model="query.args"/>
            </FormItem>
            <FormItem>
                <Checkbox v-model="query.has_coupon" true-value="1" false-value="0">有优惠券</Checkbox>
            </FormItem>
            <FormItem>
                <Select v-model="query.userType" placeholder="类型">
                    <Option value="">全部</Option>
                    <Option :value="0">淘宝</Option>
                    <Option :value="1">天猫</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Select v-model="query.status" placeholder="状态">
                    <Option :value="0">待处理</Option>
                    <Option :value="1">已处理</Option>
                    <Option :value="-1">无效</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" html-type="submit">搜索</Button>
            </FormItem>
        </Form>
        <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.items"/>
        <Page :total="pagination.total" :page-size="pagination.per_page" :current.sync="pagination.page"
              show-total show-elevator @on-change="toPage"/>
        <Spread :option="edit"/>
    </div>
</template>

<script>
    import BaseTable from '../../components/BaseTable'
    import {Table, Page, Form, FormItem, Input, Select, Option, Checkbox} from 'iview'
    import moment from 'moment'
    import Spread from './Spread'

    export default {
        name: "Copywriting",
        extends: BaseTable,
        data() {
            return {
                apiUrl: '/copywriting',
                query: {status: 0},
                columns: [
                    {title: '产品Id', key: 'itemId', width: 120, tooltip: true},
                    {
                        title: '产品标题', key: 'title', width: 320, render: (h, params) => {
                            return h('a', {
                                attrs: {
                                    href: params.row.auctionUrl,
                                    target: '_blank'
                                }
                            }, params.row.title)
                        }
                    },
                    {'title': '销量', key: 'biz30day', width: 80, align: 'right'},
                    {
                        'title': '佣金比例', width: 90, align: 'right', render: (h, params) => {
                            let val = params.row.commissionRate || 0;
                            return h('span', val.toFixed(2) + '%')
                        }
                    },
                    {
                        'title': '服务费率', width: 90, align: 'right', render: (h, params) => {
                            let val = params.row.serviceRate || 0;
                            return h('span', val.toFixed(2) + '%')
                        }
                    },
                    {
                        title: '类型', key: 'userType', width: 80, align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.userType === 1 ? '天猫' : '淘宝')
                        }
                    },
                    {
                        title: '优惠券', width: 80, align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.couponUrl || params.row.mmCouponUrl ? '有' : '')
                        }
                    },
                    {
                        'title': '活动类型', width: 90, align: 'center', render: (h, params) => {
                            let val = null
                            switch (params.row.ju) {
                                case 1:
                                    val = '聚划算'
                                    break;
                                case 2:
                                    val = '淘抢购'
                                    break;
                            }
                            return h('span', val)
                        }
                    },
                    {
                        title: '状态', width: 80, align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.status === -1 ? '无效' : params.row.status === 1 ? '已处理' : '')
                        }
                    },
                    {title: '招商员', key: 'userName', width: 90, tooltip: true},
                    {title: '商家要求', key: 'claim', width: 180},
                    {
                        title: '更新时间', align: 'center', width: 156,
                        render: (h, params) => {
                            let rs = null;
                            if (params.row.updateTime) {
                                rs = moment(params.row.updateTime * 1000).format('YYYY-MM-DD HH:mm:ss')
                            }
                            return h('span', rs)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 140,
                        align: 'center',
                        render: (h, params) => {
                            return h('ButtonGroup', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.onPass(params.row)
                                        }
                                    }
                                }, '无效'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.onEdit(params.row)
                                        }
                                    }
                                }, '推广')
                            ])
                        }
                    }
                ],
                edit: {show: false, data: {}},
            }
        },
        methods: {
            async onPass(item) {
                if (item.status === -1) {
                    this.$message.warning('该产品已经是无效状态！');
                    return false;
                }
                if (item.status === 1) {
                    this.$message.warning('该产品当前是已处理状态！');
                    return false;
                }
                this.$modal.confirm({
                    title: '警告',
                    content: '<p>此功能用于将无法推广的产品忽略掉，请确定要操作！</p>',
                    onOk: async () => {
                        try {
                            await this.$http.post(this.apiUrl, {
                                itemId: item.itemId,
                                status: -1
                            });
                            item.status = -1
                        } catch (e) {
                            console.debug(e)
                        }
                    }
                });
            },
            async onEdit(item) {
                this.edit.data = item;
                this.edit.show = true;
            }
        },
        components: {Table, Page, Form, FormItem, Input, Select, Option, Checkbox, Spread}
    }
</script>
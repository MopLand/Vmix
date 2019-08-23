<template>
    <div>
        <Form inline :model="query" @submit.native.prevent="onSubmit">
            <FormItem>
                <Input placeholder="产品ID/产品标题" v-model="query.args"/>
            </FormItem>
            <FormItem>
                <Select v-model="query.userType" placeholder="类型">
                    <Option value="">全部</Option>
                    <Option :value="0">淘宝</Option>
                    <Option :value="1">天猫</Option>
                </Select>
            </FormItem>
            <FormItem>
                <DatePicker format="yyyy-MM-dd" type="daterange" placeholder="有效期范围" @on-change="changeExpired"/>
            </FormItem>
            <FormItem>
                <Button type="primary" html-type="submit">搜索</Button>
            </FormItem>
        </Form>
        <Table stripe border highlight-row :height="tableHight" :loading="loading" :columns="columns" :data="pagination.items"/>
        <Page :total="pagination.total" :page-size="pagination.per_page" :current.sync="pagination.page"
              show-total show-elevator @on-change="toPage"/>
    </div>
</template>

<script>
    import BaseTable from '../../components/BaseTable'
    import {Table, Page, Form, FormItem, Input, Select, Option, DatePicker} from 'iview'
    import moment from 'moment'
    import Clipboard from 'clipboard'

    export default {
        name: "Good",
        extends: BaseTable,
        data() {
            return {
                apiUrl: '/goods',
                query: {},
                columns: [
                    {title: '产品Id', key: 'itemId', width: 120},
                    {
                        title: '主图', width: 130, align: 'center', render: (h, params) => {
                            return h('img', {
                                style: {display: 'block', margin: '5px 0', width: '100%'},
                                attrs: {src: params.row.pic + '_90x90'}
                            })
                        }
                    },
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
                    {
                        title: '佣金比例', width: 90, align: 'right', render: (h, params) => {
                            return h('span', params.row.commissionRate.toFixed(2) + '%')
                        }
                    },
                    {
                        title: '价格', width: 160, align: 'right', render: (h, params) => {
                            //price，amount
                            return h('div', [
                                h('div', '原价：' + params.row.price.toFixed(2)),
                                h('div', '卷：' + params.row.amount.toFixed(2)),
                                h('div', '券后价：' + (params.row.price - params.row.amount).toFixed(2))
                            ])
                        }
                    },
                    {
                        title: '有效期', width: 120, align: 'center', render: (h, params) => {
                            return h('div', [
                                h('p', moment(params.row.startTime).add(-8, 'hours').format('YYYY-MM-DD')),
                                h('p', '至'),
                                h('p', moment(params.row.endTime).add(-8, 'hours').format('YYYY-MM-DD'))
                            ])
                        }
                    },
                    {title: '销量', key: 'biz30day', width: 80, align: 'right'},
                    {
                        title: '包邮', width: 80, align: 'center', render: (h, params) => {
                            return h('span', params.row.postFree ? '包邮' : null)
                        }
                    },
                    {
                        title: '类型', width: 80, align: 'center', render: (h, params) => {
                            return h('span', params.row.userType ? '天猫' : '淘宝')
                        }
                    },
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
                    {title: '推广员', key: 'nickname', width: 100},
                    {
                        render: (h, params) => {
                            const host = location.hostname.split('.');
                            host[0] = host[0] + 'cdn';
                            const hostname = host.join('.');

                            const intro = h('div',
                                {
                                    style: {
                                        width: '1px',
                                        height: '1px',
                                        overflow: 'hidden',
                                        opacity: 0,
                                    },
                                    attrs: {
                                        id: 'intro_' + params.row.itemId
                                    },
                                },
                                [
                                    h('img', {
                                        style: {width: '100%'},
                                        attrs: {
                                            src: '//' + hostname + '/' + params.row.longPic
                                        }
                                    }),
                                    h('div', params.row.subTitle),
                                    h('div', '原价' + params.row.price.toFixed(2) + '元【券后' + (params.row.price - params.row.amount).toFixed(2) + '元】' + (params.row.postFree ? '包邮' : '')),
                                    h('div', '领券：https://uland.taobao.com/quan/detail?sellerId=' + params.row.sellerId + '&activityId=' + params.row.activityId),
                                    h('div', '抢购：' + (/^https?:\/\//.test(params.row.auctionUrl) ? '' : 'https:') + params.row.auctionUrl),
                                    h('div', params.row.itemDesc)
                                ]
                            );

                            return h('div', [
                                h('Button', {
                                    class: 'intro-copy',
                                    attrs: {
                                        'data-clipboard-target': '#intro_' + params.row.itemId,
                                        'data-iid': params.row.itemId
                                    },
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    nativeOn: {
                                        mouseover: () => {
                                            this.$set(params.row, 'show', true)
                                        }
                                    }
                                }, '复制'),
                                params.row.show ? intro : null
                            ])
                        }
                    }
                ]
            }
        },
        methods: {
            changeExpired(f) {
                this.query.expired = f
            }
        },
        components: {Table, Page, Form, FormItem, Input, Select, Option, DatePicker},
        mounted() {
            this.clipboard = new Clipboard('.intro-copy').on('success', () => {
                this.$message.success('复制成功');
            }).on('error', () => {
                this.$message.error('复制失败，浏览器可能不兼容！')
            });
        },
        destroyed() {
            this.clipboard.destroy()
        }
    }
</script>
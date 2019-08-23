<template>
    <Modal v-model="option.show" fullscreen footer-hide class="leaderboard">
        <Row type="flex" align="top">
            <Col :xs="12" v-for="data in view" :key="data.userId">
                <table>
                    <tbody>
                    <tr v-for="row in data" :key="row.i">
                        <td width="20">{{row.i}}</td>
                        <td>{{ row.nickname }}</td>
                        <td>{{ row.payServiceFee || 0 }}</td>
                    </tr>
                    </tbody>
                </table>
            </Col>
        </Row>
    </Modal>
</template>

<script>
    import {Modal, Row, Col} from 'iview'

    export default {
        name: "Leaderboard",
        props: {
            option: {
                type: Object,
                default: function _default() {
                    return {
                        show: false,
                        company: 0
                    }
                }
            }
        },
        computed: {
            listTemp: function () {
                let list = this.data;
                let arrTemp = [];
                let index = 0;
                let sectionCount = 10;
                for (let i = 0; i < list.length; i++) {
                    index = parseInt(i / sectionCount);
                    if (arrTemp.length <= index) {
                        arrTemp.push([]);
                    }
                    list[i]['i'] = i + 1;
                    arrTemp[index].push(list[i]);
                }
                return arrTemp;
            },
            view: function () {
                let index = this.index;

                let arr = [];
                for (let i = 0; i < this.listTemp.length; i++) {
                    if (i >= index && i <= index + 1) {
                        arr.push(this.listTemp[i])
                    }
                }
                return arr;
            }
        },
        data() {
            return {
                data: [],
                index: 0,
            }
        },
        methods: {
            refresh() {
                this.$http.get('/leaderboard', {
                    params: {
                        company: this.option.company,
                        company_id: this.$store.state.userInfo.company_id
                    }
                }).then(resp => {
                    this.data = resp.data
                })
            }
        },
        watch: {
            'option.show'(val) {
                if (val) {
                    this.refresh()
                    this.index = 0
                }
            }
        },
        mounted() {
            let _self = this
            setInterval(function () {
                if (_self.option.show) {
                    _self.refresh();
                }
            }, 10 * 60 * 1000);

            setInterval(function () {
                if (_self.index + 1 >= _self.listTemp.length) {
                    _self.index = 0;
                } else {
                    _self.index++;
                }
            }, 10 * 1000);
        },
        components: {
            Modal, Row, Col
        }
    }
</script>

<style scoped>
    td, th {
        display: table-cell;
        vertical-align: inherit;
    }

    .leaderboard table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
    }

    .leaderboard table tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    .leaderboard table td {
        min-width: 0;
        box-sizing: border-box;
        text-align: left;
        text-overflow: ellipsis;
        vertical-align: middle;
        padding: 2px 10px;
    }
</style>
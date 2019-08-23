<script>
    export default {
        data() {
            return {
                pagination: {},
                tableHight: null,
                subHight: 88,
                query: {}
            }
        },
        computed: {
            hasPagination() {
                return (this.pagination.pages || 0) > 1
            }
        },
        methods: {
            loadData(query) {
                const _self = this;
                query.size = query.size || 40;

                this.query = Object.assign({}, query)
                _self.$http.get(this.apiUrl, {params: query}).then(resp => {
                    _self.pagination = resp;
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
                    query: Object.assign({}, this.query, {page: undefined})
                })
            }
        },
        // beforeRouteUpdate(to, from, next) {
        //     // react to route changes...
        //     // don't forget to call next()
        //     this.loadData(to.query);
        //     next()
        // },
        watch: {
            '$route'(to) {
                this.loadData(to.query);
            },
            'pagination.pages'(value) {
                this.tableHight = this.$el.offsetHeight - this.subHight - ((value || 0) > 1 ? 38 : 0)
            }
        },
        mounted() {
            const _self = this;
            if (!this.notLoad)
                this.loadData(this.$route.query);

            _self.tableHight = _self.$el.offsetHeight - this.subHight;
            window.onresize = () => {
                _self.tableHight = _self.$el.offsetHeight - this.subHight - (_self.hasPagination ? 38 : 0)
            };
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

    .el-table .cell > * {
        line-height: 23px;
        padding: 0;
        margin: 0;
    }
</style>
<script>
    export default {
        name: "BaseTable",
        data() {
            return {
                pagination: {},
                tableHight: null,
                query: {},
                loading: false,
            }
        },
        computed: {},
        methods: {
            async loadData(query) {
                query.size = query.size || 40;

                this.query = Object.assign({}, query);
                this.loading = true;
                try {
                    let rs = await this.$http.get(this.apiUrl, {params: query})
                    this.pagination = rs.data;
                } catch (e) {
                    console.debug(e)
                }
                this.loading = false;
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
        beforeRouteUpdate(to, form, next) {
            this.loadData(to.query);
            next()
        },
        mounted() {
            if (this.apiUrl) {
                this.loadData(Object.assign({}, this.query, this.$route.query));
            }
            this.tableHight = window.innerHeight - 190;
            window.onresize = () => {
                this.tableHight = window.innerHeight - 190;
            }
        }
    }
</script>

<style scoped>
    .ivu-page {
        margin: 15px 10px 10px 10px;
    }

    .ivu-form-inline {
        margin: 10px 10px 15px 10px;
    }

    .ivu-form-inline > .ivu-form-item {
        margin-bottom: 0;
    }
</style>
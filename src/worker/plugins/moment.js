import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateformat', function (str, pattern = 'YYYY-MM-DD HH:mm:ss') {
    if (!str) return ''
    return moment(str).format(pattern)
})
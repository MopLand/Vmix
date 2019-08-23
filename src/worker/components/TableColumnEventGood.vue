<template>
    <div class="good-info">
        <a :href="good.auctionUrl" target="_blank">
            <template v-if="good.itemStatus === -1">
                <img class="middle" src="//img.alicdn.com/tps/TB1Q736LXXXXXXpXFXXXXXXXXXX-32-32.png">
                <span class="middle">已失效</span>
            </template>
            <img v-else :src="good.pictUrl + '_100x100_.webp'"/>
        </a>
        <ul>
            <li>
                <a :href="good.auctionUrl" target="_blank">{{ good.title }}</a>
            </li>
            <li class="price">
                <span class="left">
                    ￥<b style="font-size: 16px;">{{ good.zkFinalPrice.toFixed(2).split('.', 1)[0] }}</b><b>.{{ good.zkFinalPrice.toFixed(2).split('.', 2)[1] }}</b>
                </span>
                <span class="right">
                    券后价：￥{{ (good.couponZkFinalPrice || good.zkFinalPrice).toFixed(2) }}
                </span>
            </li>
            <li v-if="good.biz30day !== undefined">销量：{{ good.biz30day }}</li>
            <li v-if="good.scheduleTime">排期：{{ good.scheduleTime }}天</li>
            <li class="shop">
                <a :href="'https://pub.alimama.com/myunion.htm?#!/promo/self/shop_detail?userNumberId=' + good.sellerId" target="_blank">
                    <span class="pubfont icon-dianpu"></span> {{ good.shopTitle }}
                </a>
                <a class="ui-ww ui-ww-online" target="_blank" v-if="good.wangwang"
                   :href="'https://www.taobao.com/webww/ww.php?ver=3&siteid=cntaobao&status=1&charset=utf-8&touid=' + good.wangwang">
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "TableColumnEventGood",
        props: {
            good: {
                type: Object,
                default: function _default() {
                    return {}
                }
            }
        },
    }
</script>

<style scoped>
    @import 'https://at.alicdn.com/t/font_55467_e40971og7k87iudi.css';

    .ui-ww {
        background-position: -15px 0;
        width: 16px;
        background-image: url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png);
        background-image: -webkit-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -moz-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -ms-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-image: -o-image-set(url(//img.alicdn.com/tps/TB1RrvbLXXXXXbMXFXXXXXXXXXX-32-16.png) 1x, url(//img.alicdn.com/tps/TB1XQKZLXXXXXa4aXXXXXXXXXXX-64-32.png) 2x);
        background-repeat: no-repeat;
        zoom: 1;
        height: 15px;
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

    .middle {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .price {
        overflow: hidden;
        color: #000;
    }

    .good-info > ul {
        margin: 0 0 0 12px;
        padding: 0;
        width: 230px;
    }
</style>
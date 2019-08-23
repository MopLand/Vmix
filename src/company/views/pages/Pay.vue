<template>
 <div>
    <Head></Head>
        <div class="content" >
            <h3 class="i-h33">请选择套餐购买</h3>
            <p class="i-p">付款步骤：</p>
            <p class="i-p">1.转账至行者(唐孝然)账户;</br>2.对应套餐中输入订单号验证(订单号为付款账单订单编号);</p>
            <Col  calss="i-col" >
               <Card shadow class="i-card" style=""> 
                    <div class="pay">
                        <img class="wx" src="../../assets/wx.jpg">
                        <h3  class="wxh3">微信号：tangyang002(唐孝然)</h3>
                    </div>
                    <div class="pay1">
                        <img class="wx" src="../../assets/zfb.png">
                        <h3 class="wxh3">支付宝:397980523@qq.com(唐孝然)</h3>
                    </div>
                </Card >
            </Col>
            <Col span="2" :md="5" v-for="(item,i) in payList" :key="i" class="i-col">
                <Card shadow class="i-card1" >
                    <div style="text-align:center;padding:auto;">
                        <h1 class="c-h2" >{{item.station}}个工位</h1>
                        <h2 class="c-h3" >￥{{Number(item.price)}}元/{{item.duration}}月</h2>
                        <p  class="c-p"  >一键查询团队业绩<br>数据实时展示<br>团长黑科技，<br>更多流量转换</p>
                        <Input v-model="item.trade" placeholder="请输入订单编号验证" clearable />
                        <span class="c-span" @click="paybuy(item)">立即购买</span>
                    </div>
                </Card>
            </Col>
        </div>
      
</div>
</template>
<script>
    import {Card,Col} from 'iview'
    import Head from "../../components/Head"
    import qs from	'qs'
    export default {
        name: "Pay",
         components: {
            Card,Col,Head
        },
        data( ){
            return{
                payList : []
            }
         
        },
        mounted() {
               this.$http.post('/backend/buying/pricing').then(res=>{  
                //   console.log(res)
                    this.payList=res.data.result
                    }).catch(function (error) {
                     console.log(error);
                })
        },
        methods: {
            // paybuy(price_id){
            //     // console.log(price_id)
            //     let params={
            //         price_id:Number(price_id),
            //         target:location.origin+"/paysuccess",
            //     }
            //     // var sn="http://payment/payment/submit?method=alipay&sn=1904111336148888"
            //     //       var en=sn.split("&",2)
            //     //       var rn=en[1].split("=",2)
            //     //       var vn=rn[1]
            //                 // console.log(vn)
            //     this.$http.post('/backend/buying/trade',qs.stringify(params)).then(res=>{  
            //              if(res.data.status==0){
            //                window.location.href=res.data.target
                          
            //              }
            //         }).catch(function (error) {
            //          console.log(error);
            //     });
            // }
             paybuy(item){
                console.log(item)
                 
                let params={
                    price_id:Number(item.deal_id),
                    trade:item.trade,
                }
                this.$http.post('/backend/buying/preOrder',qs.stringify(params)).then(res=>{  

                         if(res.data.status==0){
                              console.log(res)
                           this.$message.success('已提交，请联系工作人员验证')
                           this.$router.push({name: 'paysuccess'})
                         }
                    }).catch(function (error) {
                     console.log(error);
                });
            }
        },
       
    }
</script>
<style>
    .i-card{
       height:310px;
       margin:30px;
    }
    .i-col{
       margin:0 6%;
     }
   .c-span{
      margin:20px auto;
      display:block;
      color:#ffffff;
      width:110px;
      height:40px;
      border-radius:25px;
      background-color:red;
      font-size:18px;
      line-height:40px;
   }
   .i-p{
       color:red;
       display:block; 
       margin-left:140px; 
       font-size: 16px;
   }
   .c-h2{
       margin:20px auto; 
       color:#146dd5;
   }
   .i-h33{
      color:#146dd5;
      display:block;
      margin:10px 10px 10px 10px; 
      font-size:28px;
      text-align: center;
  }

   .c-h3{
       margin:10px auto; 
       color:#146dd5;
   }
   .c-p{
       margin:10px auto; 
       color:#010101;
       font-size:14px;
   }
   .wx{
        width: 160px;
        height: 240px;
        margin: 5px 20px 5px 20px;
   }
   .wxh3{
        color:#146dd5;
   }
   .pay{
       display: inline-block;
       margin-left:25%; 
       text-align:center;
       padding:auto;
   }
   .pay1{
       display: inline-block;
       margin-left:10%;
       text-align:center;
       padding:auto;

   }
   .content{
       margin:70px 10px 10px 220px;
    }
    @media screen and (max-width: 500px) {
         .content {
            margin-left:20px;
        }
         .i-p{
           margin-left:2px; 
     
       }
       .pay1 {
            margin-left: -2%;
            margin-top:20px; 
        }
         .pay {
            margin-left: 5%;
           
        }
         .i-card{
            height:650px;
            /*margin:30px;*/
        }
        .i-col{
            margin:0;
           width: 350px;
            margin:15px;
       }
       .i-card1{
           width:350px;
       }
    }
</style>
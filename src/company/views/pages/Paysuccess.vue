<template>
 <div>
    <Head></Head>
        <Row class="content">
            <img class="payimg" src="../../assets/pay.png">
            <h3 class="i-h3">恭喜你,已提交验证!</h3>
            <h3 class="i-h4">感谢您购买招商团长管理系统，请您与工作人员联系审核通过并开通系统！</h3>
            <Button  style="width:10%;margin:0 45%;margin-bottom:330px;" type="primary" html-type="submit" :to="{name:'home'}" >立即体验</Button>
        </Row>
</div>
</template>
<script>
    import { Row,} from 'iview'
    import Head from "../../components/Head"
    //  import qs from	'qs'
    export default {
        name: "paysuccess",
        data( ){
            return{
                payList : []
            }
         
        },
        mounted() {
            //   var en=location.split("&",2)
            //   var rn=en[1].split("=",2)
                        //      let params={
                        //          sn:'1904111630056388',
                        //          trade:'2019041122001461141026799212',
                        //      }
                        //        this.$http.post('/backend/station/verifyTrade',qs.stringify(params)).then(res=>{  
                        //                         console.log(res)
                        //             }).catch(function (error) {
                        //             console.log(error);
                        //    })
        },
        methods: {
           
        },
        components: {
             Row,Head
        },
    }
</script>
<style>
   .i-h3{
      color:#146dd5;
      display:block;
      margin:40px; 
      font-size:28px;
      text-align: center;
  }
   .i-h4{
      color:#146dd5;
      display:block;
      margin:40px; 
      font-size:28px;
      text-align: center;
      margin-bottom:40px;
  }
  .payimg{
      margin-left:46.5%; 
      margin-top:200px; 
      
  }
   .content{
       margin:70px 20px 20px 220px;
     
    }
</style>
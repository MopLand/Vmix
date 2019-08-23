<template>
    <div >
     <Head></Head>
      <div class="content">
        <h3 class="i-h333">业绩分析</h3>
        <DatePicker size="small" format="yyyy-MM-dd" type="daterange" placeholder="请选择日期"  @on-change="changeCompany" />
          <h3 class="point">前十占比</h3>
          <div id="myChart" ></div>
          <div id="myChart2"></div>
        </div>
      
     </div>
</template>
<script>
   import { DatePicker, } from 'iview'
    import moment from 'moment'
     import echarts from 'echarts'
    // 引入 echarts 主模块。
    // import  echarts from 'echarts/lib/echarts';
    // 引入折线图。
    import 'echarts/lib/chart/line';
    // 引入提示框组件、标题组件、工具箱组件。
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/toolbox';
    import Head from "../../components/Head"
    export default {
        name: "Statis",
          components: {
          Head,DatePicker
        },
        inject: ['reload'],
       data () {
            return {
                charts: '',
                opinionData:[],
                opinion:[],
                opinion2:[],
                }
        },
        mounted(){
            //   this.$nextTick(function() {
            //         this.drawPie('myChart')
            //     });
                this.getTodayData();
        },
        methods: {
            changeCompany(f) {
                    if (f.length !== 2 || !f[0] || !f[1]) return;
                    let f0=moment(f[0]).format('YYYYMMDD')
                    let f1=moment(f[1]).format('YYYYMMDD')
                    this.$http.get('/backend/statis/rank?size=10', {
                        params: {
                            startDate:f0,
                            endDate:f1,
                        }
                    }).then(res => {
                        var data=res.data.result
                        
                           this.opinionData=data.map(({service_charge:service_charge,staff_name:staff_name})=>{
                                var   value=service_charge
                                var   name=staff_name
                                    return{
                                        value,
                                        name,
                                    }
                            })
                        this.drawPie('myChart')
                })
                this.$http.get('/backend/statis/rank?size=10', {
                        params: {
                            startDate:f0,
                            endDate:f1,
                        }
                    }).then(res => {
                        var data=res.data.result
                            this.opinion=data.map(item =>{
                                 return  item.staff_name
                            })
                           this.opinion2=data.map(item=>{
                                 return item.service_charge
                            }) 
                        this.drawPie2('myChart2')
                })

            },
            getTodayData() {
                    let today = moment(new Date()).format('YYYYMMDD');
                        this.$http.get('/backend/statis/rank?size=10', {
                                params: {startDate:today,endDate:today}
                            }).then(res => {
                                var data=res.data.result
                            this.opinionData=data.map(({service_charge:service_charge,staff_name:staff_name})=>{
                                    var   value=service_charge
                                    var   name=staff_name
                                        return{
                                            value,
                                            name,
                                        }
                            })
                        this.drawPie('myChart')
                      
                    })
                     this.$http.get('/backend/statis/rank?size=10', {
                                params: {startDate:today,endDate:today}
                            }).then(res => {
                                var data=res.data.result
                           
                           this.opinion=data.map(item =>{
                                 return  item.staff_name
                            })
                            this.opinion2=data.map(item=>{
                                 return item.service_charge
                            }) 
                       
                        this.drawPie2('myChart2')
                    })
                    
                },
            drawPie(myChart){
                    this.charts = echarts.init(document.getElementById(myChart))
                    this.charts.setOption({
                        tooltip: {
                        trigger: 'item',
                        formatter: '{a}<br/>{b}:{c} ({d}%)'
                        },
                        legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:this.opinionData
                        },
                        series: [
                        {
                            name:'预估服务费占比',
                            type:'pie',
                            radius:['50%','70%'],
                            center:['50%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                            },
                            labelLine: {
                            normal: {
                                show: false
                            }
                            },
                            data:this.opinionData
                        }
                        ]
                    })
                },
                 drawPie2(myChart2){
                    this.charts = echarts.init(document.getElementById(myChart2))
                    this.charts.setOption({
                        color: ['#c33430'],
                         title: {
                                text: '排行榜（前十）',
                            },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '1%',
                            right: '1%',
                            bottom: '1%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : this.opinion,
                                axisTick: {
                                    alignWithLabel: false
                                },
                                axisLabel:{
                                    interval:0,
                                    // rotate:45,
                                    margin:2,
                                    // textStyle:{
                                    //     color:"#222"
                                    // }
                                },
                                // 'axisLabel':{'interval':0},
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'预估服务费',
                                type:'bar',
                                barWidth: '20%',
                                data:this.opinion2,
                                itemStyle: {
                                            normal: {
                                                label: {
                                                    show: true,		//开启显示
                                                    position: 'top',	//在上方显示
                                                    textStyle: {	    //数值样式
                                                        color:' #c33430',
                                                        fontSize: 12
                                                    }
                                                }
                                            }
                                        }
                            },
                            
                        ]
                    })
                 }
            }
        }
</script> 
<style>
  
     .content{
        margin:70px 20px 50px 220px;
    }
     .i-h333{
        display:block;
        margin:10px 10px 10px 10px; 
        font-size:28px;
        text-align: center;
  }
  #myChart2{
        width: 600px;
        height: 400px;
        margin-top:20px;
        position:absolute;
        top:120px;
        left:65%;
  }
   #myChart{
        width: 600px;
        height: 400px;
        margin-top:15px;
        margin-left:45px;
       
  }
  .point{
      display:block;
      font-size: 18px;
      margin:10px 0px 0px 0px;
      color: #000;
       padding-left: 30px; 
  }
  
    @media screen and (max-width: 600px) {
       .content {
            margin-left:20px;
        }
         #myChart2{
        width: 400px;
        height: 320px;
        margin-top:20px;
        position:absolute;
        top:600px;
        left:0%;
  }
        #myChart{
        width: 400px;
        height: 320px;
        margin-top:10px;
        margin-left:0px;
            
        }
        .point{
        display:block;
        font-size: 18px;
        margin:5px 0px 0px 0px;
        color: #000;
        padding-left:0px; 
        }
      
    }
</style>
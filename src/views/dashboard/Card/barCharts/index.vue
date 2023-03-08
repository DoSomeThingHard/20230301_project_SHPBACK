<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    mounted() {
        console.log(echarts)
        // 初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts)
        // 配置数据
        lineCharts.setOption({
            xAxis:{
                show:false,  // 隐藏x轴
                type: 'category'
            },
            yAxis:{
                show:false  // 隐藏y轴
            },
            // 布局调试
            grid:{
                left:0,
                right:0,
                top:0,
                bottom:0
            },
            series:[
                {
                    type:'bar',
                    data:[10,7,33,12,48,9,29,10,44,33,22,8],
                    color: 'cyan'
                }
            ],
            tooltip:{}
        })
    },
}
</script>

<style>
.charts{
    width: 100%;
    height: 100%
}
</style>
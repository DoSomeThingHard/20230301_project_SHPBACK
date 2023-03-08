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
                min:0,
                max: 100
            },
            yAxis:{
                show:false,  // 隐藏y轴
                type: 'category'
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
                    data:[78],
                    color: 'cyan',
                    // 设置宽度
                    barWidth: 10,
                    color: 'yellowgreen',
                    // 设置背景颜色
                    showBackground: true,
                    backgroundStyle:{
                        color: '#eee'
                    },
                    // 文本的样式
                    label:{
                        show:true,
                        // 改变文本的内容 默认是 78
                        formatter: '|',
                        // 改变文本的位置
                        position: 'right'
                    }
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
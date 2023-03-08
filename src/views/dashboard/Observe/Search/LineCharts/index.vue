<template>
    <div>
        <div class="header">
            <span class="search-header">搜索用户数</span>
            <svg t="1678168731822" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2755" width="26" height="26"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" fill="#999" p-id="2756"></path></svg>
        </div>
        <div class="main">
            <span class="main-title">12321</span>
            <span class="main-content">17.1</span>
            <span>上</span>
            <span>下</span>
        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
            
        </div>
    </div>
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
                type:'category'
            },
            yAxis:{
                show:false  // 隐藏y轴
            },
            series:[
                {
                    type:'line',
                    data:[10,7,33,12,48,9, 29, 10,44],
                    // 拐点的样式
                    itemStyle:{
                        opacity: 0
                    },
                    // 线条的样式
                    lineStyle:{
                        color: "purple"
                    },
                    smooth: true,   // 让折线比较柔缓
                    areaStyle:{
                        color:{
                            type: 'linear',
                            x:0,
                            y:0,
                            x2:0,
                            y2:1,
                            colorStops:[
                                {
                                    offset:0,
                                    color: 'purple',   // 0%处的颜色
                                },
                                {
                                    offset: 1,
                                    color:'#fff',   // 100%处的颜色
                                }
                            ],
                            global: false, 
                        }
                    }
                }
            ],
            // 布局调试
            grid:{
                left:0,
                right:0,
                top:0,
                bottom:0
            }
        })
    },
}
</script>

<style scoped>
.header{
    display: flex;
    align-items: center;
}
.search-header{
    margin-right: 10px;
}
.main{
    margin: 10px 0;
}
.main-title,.main-content{
    margin-right: 10px;
}
.charts{
    width: 100%;
    height: 50px;
}
</style>
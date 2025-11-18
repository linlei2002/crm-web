<template>
  <div id="tradeBar" style="height: 100%; width: 100%"></div>
  <div id="statisticsPie" style="height: 100%; width: 100%"></div>
</template>
<script lang="ts" name="ContractDataChart" setup>
// import * as echarts from 'echarts'
import { onMounted, PropType, ref, watch } from 'vue'
import { ContractStatistics } from '@/api/interface'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Object as PropType<ContractStatistics>,
    required: true
  }
})

const myChart = ref<echarts.ECharts | null>(null)

const barChart = () => {
  if (props.data?.contractName.length > 0) {
    const chartDom = document.getElementById('tradeBar')
    if (chartDom) {
      if (myChart.value) {
        myChart.value.dispose()
      }
      myChart.value = echarts.init(chartDom)

      const option = {
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['收款金额', '总金额']
        },
        xAxis: [
          {
            type: 'category',
            data: props.data?.contractName,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额'
          }
        ],
        series: [
          {
            name: '收款金额',
            type: 'bar',
            data: props.data?.receivedAmount
          },
          {
            name: '总金额',
            type: 'line',
            data: props.data?.totalAmount
          }
        ]
      }
      myChart.value.setOption(option)

      const handleResize = () => {
        myChart.value?.resize()
      }

      window.addEventListener('resize', handleResize)

      onMounted(() => {
        window.removeEventListener('resize', handleResize)
        myChart.value?.dispose()
      })
    }
  }
}

watch(
  () => props.data,
  (newData) => {
    if (newData?.contractName.length > 0) {
      barChart()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.data?.contractName && props.data?.contractName.length > 0) {
    barChart()
  }
})
</script>

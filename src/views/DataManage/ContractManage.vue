<template>
  <div class="container-box">
    <div class="select-box">
      <span>筛选：</span>
      <el-select v-model="selectedItem" placeholder="Select" style="width: 240px; margin-left: 20px" @change="clearSelectedItem()">
        <el-option v-for="item in ContractStatisticsList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <el-date-picker
        v-model="checkedValue"
        :type="selectedItem"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="请选择统计时间"
        v-if="selectedItem !== 'day' && selectedItem !== 'week'"
        style="margin-left: 20px"
        unlink-panels
        :disabled-date="disableFutureDates"
      />

      <div v-if="selectedItem !== 'day' && selectedItem === 'week'">
        <el-date-picker
          v-model="startWeekValue"
          :type="selectedItem"
          format="[第] ww [周]"
          placeholder="请选择开始周"
          style="margin-left: 20px"
          :disabled-date="disableFutureDates"
        />
        <span style="margin-left: 20px">至</span>
        <el-date-picker
          v-model="endWeekValue"
          :type="selectedItem"
          format="[第] ww [周]"
          placeholder="请选择结束周"
          style="margin-left: 20px"
          :disabled-date="disableEndWeekDates"
        />
      </div>
      <el-button type="primary" @click="getStatisData" style="margin-left: 20px">搜索</el-button>
    </div>
    <div style="height: 80vh; width: 100%">
      <ContractDataChart :data="statisticsData || {}" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ContractStatisticsList } from '@/configs/enum'
import { onMounted, ref } from 'vue'
import { ContractsApi } from '@/api/modules/contract'
import { ContractStatistics } from '@/api/interface'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { convertToTimeRanges } from '@/hooks/useMergeTime'
import ContractDataChart from '@/views/DataManage/components/ContractDataChart.vue'

const selectedItem = ref('default')
const checkedValue = ref<Array<Date>>([])
const startWeekValue = ref<Date>()
const endWeekValue = ref<Date>()

const statisticsData = ref<ContractStatistics>({
  contractName: [],
  receivedAmount: [],
  totalAmount: []
})

interface statisticsResponse extends IResponse {
  data: ContractStatistics
}

interface statisticsParams {
  transactionType: string
  timeRange?: [string, string]
}

const initData = async () => {
  try {
    const res = (await ContractsApi.getContractStatistics({ statisticsParams: selectedItem.value })) as statisticsResponse
    statisticsData.value = res.data
  } catch (error) {
    console.error(error)
  }
}
onMounted(() => {
  initData()
})

const disableFutureDates = (time) => {
  const now = Date.now()
  const endOfToday = new Date(now)
  endOfToday.setHours(23, 59, 59, 999)
  return time.getTime() > endOfToday.getTime()
}

const disableEndWeekDates = (date) => {
  if (!startWeekValue.value) {
    return date > new Date()
  }
  const start = new Date(startWeekValue.value)
  return date < start || date > new Date()
}

const clearSelectedItem = () => {
  checkedValue.value = []
  startWeekValue.value = undefined
  endWeekValue.value = undefined
}

const getStatisData = async () => {
  try {
    let param: statisticsParams = {
      transactionType: selectedItem.value
    }

    if (
      (checkedValue.value.length === 0 && (selectedItem.value === 'daterange' || selectedItem.value === 'monthrange')) ||
      (startWeekValue.value === undefined && endWeekValue.value === undefined && selectedItem.value === 'week')
    ) {
      ElMessage({
        type: 'warning',
        message: '请选择有效时间范围'
      })
      return
    }
    if (selectedItem.value === 'monthrange') {
      const [start, end] = checkedValue.value
      const startMonth = moment(start).format('YYYY-MM-01 00:00:00')
      const endMonth = moment(end).endOf('month').format('YYYY-MM-DD 23:59:59')
      param = {
        ...param,
        timeRange: [startMonth, endMonth]
      }
    } else if (selectedItem.value === 'daterange') {
      const [start, end] = checkedValue.value
      const startDay = moment(start).format('YYYY-MM-DD 00:00:00')
      const endDay = moment(end).format('YYYY-MM-DD 23:59:59')
      param = {
        ...param,
        timeRange: [startDay, endDay]
      }
    } else if (selectedItem.value === 'week') {
      if (startWeekValue.value instanceof Date && endWeekValue.value instanceof Date) {
        const [startWeek] = convertToTimeRanges(startWeekValue.value.toTimeString())
        const [, endWeek] = convertToTimeRanges(endWeekValue.value.toDateString())
        param = {
          ...param,
          timeRange: [startWeek, endWeek]
        }
        param = {
          ...param,
          timeRange: [startWeek, endWeek]
        }
      } else {
        console.warn('请选择有效时间')
        return
      }
    }
    const res = (await ContractsApi.getContractStatistics(param)) as statisticsResponse
    statisticsData.value = res.data
    console.log(param)
    console.log(statisticsData)
  } catch (error) {
    console.error(error)
  }
}
</script>
<style>
.container-box {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
.select-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 5vh;
}
</style>

<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="合同审核"
      :columns="columns"
      :requestApi="ContractsApi.page"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }"
      :row-key="(row) => row.id"
      @selection-change="selectionChange"
    >
      <template #product="scope">
        <span v-if="scope.row.products && scope.row.products.length > 0">
          {{
            scope.row.products
              .map((p) => p.pName)
              .slice(0, 2)
              .join('、')
          }}
          <span v-if="scope.row.products.length > 2">...</span>
        </span>
        <span v-else> 无产品 </span>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="Edit" @click="startApproval(scope.row)" v-if="scope.row.status === 0">审核</el-button>
        <el-button type="primary" link :icon="Delete" @click="returnApproval(scope.row)" v-if="scope.row.status === 1">审核未通过</el-button>
        <el-button type="primary" link :icon="SuccessFilled" @click="successApproval(scope.row)" v-if="scope.row.status === 1">审核通过</el-button>
        <el-button type="primary" link :icon="DeleteFilled" @click="deleteApproval(scope.row)" v-if="scope.row.status === 2">退回审核</el-button>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="ts">
import ProTable from '@/components/ProTable/index.vue'
import { ContractsApi } from '@/api/modules/contract'
import { ref } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import { ContractStatusList } from '@/configs/enum'
import { Delete, DeleteFilled, Edit, SuccessFilled } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'

const proTable = ref()
const initParam = ref()

const dataCallback = (data: any) => {
  return { list: data.list, total: data.total }
}

const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: '50' },
  { prop: 'number', label: '合同编号', width: '100' },
  { prop: 'name', label: '合同名称', width: '150' },
  { prop: 'customerName', label: '客户名称', width: '100' },
  { prop: 'status', label: '签约状态', width: '100', enum: Object.values(ContractStatusList) },
  { prop: 'product', label: '产品', width: '200' },
  { prop: 'signTime', label: '签约时间', width: '150' },
  { prop: 'startTime', label: '合同开始时间', width: '150' },
  { prop: 'endTime', label: '合同结束时间', width: '150' },
  { prop: 'operation', label: '操作', fixed: 'right', width: '150' }
]

const startApproval = async (row: any) => {
  await useHandleData(ContractsApi.startApproval, { id: row.id }, '发起合同审核')
  proTable.value.getTableList()
}

//退回审核
const returnApproval = async (row: any) => {
  if (row.customerName === null || row.products.length === 0) {
    await useHandleData(ContractsApi.returnApproval, { id: row.id }, '退回申请')
    alert('退回原因:签约客户或者商品列表为空')
    return
  }
}

//通过审核
const successApproval = async (row: any) => {
  await useHandleData(ContractsApi.successApproval, { id: row.id }, '审核通过')
  proTable.value.getTableList()
}

//审核成功的退回审核
const deleteApproval = async (row: any) => {
  await useHandleData(ContractsApi.deleteApproval, { id: row.id }, '退回审核')
  proTable.value.getTableList()
}
</script>

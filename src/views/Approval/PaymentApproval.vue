<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="回款审核"
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
        <el-button type="primary" link :icon="Edit" v-if="isRecoverPay(scope.row)" @click="recoverPay(scope.row)">追回收款</el-button>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="ts">
import ProTable from '@/components/ProTable/index.vue'
import { ref } from 'vue'
import { ContractsApi } from '@/api/modules/contract'
import { ColumnProps } from '@/components/ProTable/interface'
import { ContractStatusList } from '@/configs/enum'
import { Edit } from '@element-plus/icons-vue'

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
  { prop: 'receivedAmount', label: '实收款金额', width: '100' },
  { prop: 'amount', label: '总收款金额', width: '100' },
  { prop: 'operation', label: '操作', fixed: 'right', width: '150' }
]

const isRecoverPay = (row: any) => {
  if (row.receivedAmount < row.amount && row.status === 2) {
    return true
  }
}

const recoverPay = (row: any) => {
  row.id
}
</script>

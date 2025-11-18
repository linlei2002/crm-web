import http from '@/api'
import { COMMON_ADMIN_API } from '@/api/axios/servicePort'
export const ContractsApi = {
  page: (params: any) => http.post(COMMON_ADMIN_API + '/contract/page', params),
  saveOrUpdate: (params: any) => http.post(COMMON_ADMIN_API + '/contract/saveOrUpdate', params),
  startApproval: (params: any) => http.post(COMMON_ADMIN_API + '/contract/startApproval', params),
  getContractStatistics: (params: any) => http.post(COMMON_ADMIN_API + '/contract/getContractStatistics', params),
  returnApproval: (params: any) => http.post(COMMON_ADMIN_API + '/contract/returnApproval', params),
  successApproval: (params: any) => http.post(COMMON_ADMIN_API + '/contract/successApproval', params),
  deleteApproval: (params: any) => http.post(COMMON_ADMIN_API + '/contract/deleteApproval', params)
}

export const CustomerApi = {
  page: (params: any) => http.post(COMMON_ADMIN_API + '/customer/page', params)
}

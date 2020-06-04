import { getListIds } from '@/api/cms/fileInfo'
import { getList as companyModify } from '@/api/lpm/companyModify'
import FilesListComponent from '@/components/FilesList/index.vue'
import { getList as getCapitalModifyList } from '@/api/lpm/capitalModify'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { FilesListComponent },
  data() {
    return {
      id: '',
      /* 企业变更信息模块 */
      companyModifyData: [], // 企业变更信息相关数据

      businessLicenseFilesListCompanyModify: [], // 营业执照
      approvalFilesListCompanyModify: [], // 核准文件
      companyReferenceRegisterFilesListCompanyModify: [], // 公司备案登记表
      companyModifyRegisterFilesListCompanyModify: [], // 变更事项登记表
      companyArticlesAssociationFilesListCompanyModify: [], // 公司章程
      shareholdersDecideFilesListCompanyModify: [], // 股东会决议
      seniorManagementFilesListCompanyModify: [], // 董事会决议
      promiseFilesListCompanyModify: [], // 承诺书
      delegationFilesListCompanyModify: [], // 委托书
      authorizationFilesListCompanyModify: [], // 指定代表或者共同委托代理人授权委托书
      appointDismissFilesListCompanyModify: [], // 任职免职书
      otherFilesListCompanyModify: [], // 其它文件
      accessoryFilesListCompanyModify: [],
      listQuery: {
        page: 1,
        limit: 20,
        ids: ''
      },

      listCapitalModifyOldQuery: {
        page: 1,
        limit: 20,
        modifyStatusType: 0,
        id: undefined
      },
      listCapitalModifyOld: [],
      listCapitalModifyOldLoading: true,

      listCapitalModifyNewQuery: {
        page: 1,
        limit: 20,
        modifyStatusType: 1,
        id: undefined
      },
      listCapitalModifyNew: [],
      listCapitalModifyNewLoading: true,
      selCapitalModifyRow: {}
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  computed: {
    // 表单验证
    rules() {
      return {
      }
    }
  },
  watch: {
    '$route'(newUrl, oldUrl) {
      if (newUrl !== oldUrl) {
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 获取企业的id
      const id = this.$route.query.id

      // 企业变更数据
      companyModify({ enterpriseId: id, page: 1, limit: 20 }).then(response => {
        var accessoryArr = ['accessoryFiles', 'businessLicenseFiles', 'approvalFiles',
          'companyReferenceRegisterFiles', 'companyModifyRegisterFiles',
          'companyArticlesAssociationFiles', 'shareholdersDecideFiles',
          'seniorManagementFiles', 'promiseFiles',
          'delegationFiles', 'authorizationFiles',
          'appointDismissFiles', 'otherFiles']
        var shareholderArr = ['shareholderOld', 'shareholderNew']
        this.getFilesList('CompanyModify', accessoryArr, response.data, shareholderArr)
      })
    },

    fetchCapitalModifyOldData(tempRecord) {
      this.listCapitalModifyOldLoading = true
      this.listCapitalModifyOldQuery.serialIdModify = tempRecord.id
      getCapitalModifyList(this.listCapitalModifyOldQuery).then(response => {
        this.listCapitalModifyOld = response.data.records || []
        this.listCapitalModifyOldLoading = false
      })
    },
    fetchCapitalModifyNewData() {
      this.listCapitalModifyNewLoading = true
      this.listCapitalModifyNewQuery.serialIdModify = this.form.id
      getCapitalModifyList(this.listCapitalModifyNewQuery).then(response => {
        this.listCapitalModifyNew = response.data.records || []
        this.listCapitalModifyNewLoading = false
      })
    },

    // 获取原文列表
    async getFilesList(module, accessoryArr, record, shareholderArr) {
      const records = record
      if (records.length === 0) {
        return false
      }
      // for (let j = 0; j < accessoryArr.length; j++) {
      // const Module = module
      const listQuery = {
        page: 1,
        limit: 20
        // ids: records[0][accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')
      }
      if (records.length > 0) {
        const newRecords = []
        for (let p = 0; p < records.length; p++) {
          const Module = module
          const tempRecord = records[p]
          if (tempRecord.shareholderModifyState === 'true') {
            // this.listCapitalModifyOldQuery.ids = tempRecord.shareholderIdsOld
            // getCapitalModifyList(this.listCapitalModifyOldQuery).then(response => {
            //   tempRecord['shareholderOldList'] = response.data.records || []
            // })
            // this.listCapitalModifyNewQuery.ids = tempRecord.shareholderIdsNew
            // getCapitalModifyList(this.listCapitalModifyNewQuery).then(response => {
            //   tempRecord['shareholderNewList'] = response.data.records || []
            // })
            this.listCapitalModifyOldQuery.ids = tempRecord.shareholderIdsOld
            const response1 = await getCapitalModifyList(this.listCapitalModifyOldQuery)
            tempRecord['shareholderOldList'] = response1.data.records || []
            this.listCapitalModifyNewQuery.ids = tempRecord.shareholderIdsNew
            const response2 = await getCapitalModifyList(this.listCapitalModifyNewQuery)
            tempRecord['shareholderNewList'] = response2.data.records || []
          } else {
            tempRecord['shareholderOldList'] = []
            tempRecord['shareholderNewList'] = []
          }

          for (let j = 0; j < accessoryArr.length; j++) {
            if (tempRecord[accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')) {
              const ids = tempRecord[accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')
              listQuery.ids = ids

              if (!listQuery.ids) {
                // console.log('没有找到：' + accessoryArr[j] + 'List' + Module + ' 相关的原文！')
              } else {
                // getListIds({
                //   page: 1,
                //   limit: 20,
                //   ids: ids
                // }).then(response => {
                //   const fileList = []
                //   for (let i = 0; i < response.data.records.length; i++) {
                //     const file = {}
                //     file.id = response.data.records[i].id
                //     file.name = response.data.records[i].originalFileName
                //     fileList.push(file)
                //   }
                //   tempRecord[accessoryArr[j] + 'List' + Module] = fileList
                //   if (records.length === p + 1) {
                //     this.companyModifyData = []
                //     this.companyModifyData = newRecords
                //     console.log('companyModifyData:', this.companyModifyData)
                //   }
                // })
                const response3 = await getListIds({
                  page: 1,
                  limit: 20,
                  ids: ids
                })
                const fileList = []
                for (let i = 0; i < response3.data.records.length; i++) {
                  const file = {}
                  file.id = response3.data.records[i].id
                  file.name = response3.data.records[i].originalFileName
                  fileList.push(file)
                }
                tempRecord[accessoryArr[j] + 'List' + Module] = fileList
                if (records.length === p + 1) {
                  this.companyModifyData = []
                  this.companyModifyData = newRecords
                  console.log('companyModifyData:', this.companyModifyData)
                }
              }
            }
          }

          newRecords.push(tempRecord)
        }
      }
      // }
    }
  }
}

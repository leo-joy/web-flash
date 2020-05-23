import { getListIds } from '@/api/cms/fileInfo'
import { getList as companyModify } from '@/api/lpm/companyModify'
import FilesListComponent from '@/components/FilesList/index.vue'

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
      seniorManagementFilesListCompanyModify: [], // 企业高管信息确认书
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
      }
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
        var accessoryArr = ['businessLicenseFiles', 'approvalFiles',
          'companyReferenceRegisterFiles', 'companyModifyRegisterFiles',
          'companyArticlesAssociationFiles', 'shareholdersDecideFiles',
          'seniorManagementFiles', 'promiseFiles',
          'delegationFiles', 'authorizationFiles',
          'appointDismissFiles', 'otherFiles', 'accessoryFiles']
        this.getFilesList('CompanyModify', accessoryArr, response.data.records)
      })
    },

    // 获取原文列表
    getFilesList(module, accessoryArr, record) {
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
      if (records.length > 1) {
        var newRecords = []
        for (let p = 0; p < records.length; p++) {
          const Module = module
          const tempRecord = records[p]
          for (let j = 0; j < accessoryArr.length; j++) {
            if (tempRecord[accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')) {
              const ids = tempRecord[accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')
              listQuery.ids = ids

              if (!listQuery.ids) {
                // console.log('没有找到：' + accessoryArr[j] + 'List' + Module + ' 相关的原文！')
              } else {
                getListIds({
                  page: 1,
                  limit: 20,
                  ids: ids
                }).then(response => {
                  const fileList = []
                  for (let i = 0; i < response.data.records.length; i++) {
                    const file = {}
                    file.id = response.data.records[i].id
                    file.name = response.data.records[i].originalFileName
                    fileList.push(file)
                  }
                  tempRecord[accessoryArr[j] + 'List' + Module] = fileList
                  console.log('p:', tempRecord)
                  if (records.length === p + 1) {
                    this.companyModifyData = newRecords
                  }
                })
              }
            }
          }
          newRecords.push(tempRecord)
        }
        console.log(this.companyModifyData)
        console.log('companyModifyDataLength', this.companyModifyData.length)
      }
      // }
    }
  }
}

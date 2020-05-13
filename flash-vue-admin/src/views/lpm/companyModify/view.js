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
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('CompanyModify', accessoryArr, response.data.records)
      })
    },

    // 获取原文列表
    getFilesList(module, accessoryArr, record) {
      const records = record
      if (records.length === 0) {
        return false
      }
      for (let j = 0; j < accessoryArr.length; j++) {
        const Module = module
        const listQuery = {
          page: 1,
          limit: 20,
          ids: records[0][accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')
        }
        if (records.length > 1 && accessoryArr[j] === 'accessoryFiles') {
          var newRecords = []
          for (let p = 0; p < records.length; p++) {
            const tempRecord = records[p]
            if (tempRecord['accessoryFiles'].replace(/(^\s*)|(\s*$)/g, '')) {
              const ids = tempRecord['accessoryFiles'].replace(/(^\s*)|(\s*$)/g, '')
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
                  newRecords.push(tempRecord)
                  if (records.length === p + 1) {
                    this.companyModifyData = newRecords
                  }
                })
              }
            }
          }
          console.log(this.companyModifyData)
        }
      }
    }
  }
}

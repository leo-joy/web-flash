import { getListIds } from '@/api/cms/fileInfo'
import { get as businesslicense } from '@/api/lpm/businesslicense'
import { getList as investcompany } from '@/api/lpm/investcompany'
import FilesListComponent from '@/components/FilesList/index.vue'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { FilesListComponent },
  data() {
    return {
      id: '',
      /* 投资企业模块 */
      investcompanyData: [], // 投资相关数据
      accessoryFilesListInvestcompany: [],
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

      /* 投资企业模块 */
      investcompany({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.getCompanyList('investcompany', response.data.records)
      })
    },

    // 获取原文列表
    getFilesList(module, accessoryArr, record) {
      if (record.length === 0) {
        return false
      }
      for (let j = 0; j < accessoryArr.length; j++) {
        const Module = module
        var listQuery = {
          page: 1,
          limit: 20,
          ids: record[0][accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '')
        }
        if (record.length > 1 && accessoryArr[j] === 'accessoryFiles') {
          let ids = ''
          for (let p = 0; p < record.length; p++) {
            if (record[p]['accessoryFiles'].replace(/(^\s*)|(\s*$)/g, '')) {
              ids = record[p]['accessoryFiles'].replace(/(^\s*)|(\s*$)/g, '') + ' ' + ids
            }
          }
          listQuery.ids = ids
        }
        if (!listQuery.ids) {
          // console.log('没有找到：' + accessoryArr[j] + 'List' + Module + ' 相关的原文！')
        } else {
          getListIds(listQuery).then(response => {
            for (let i = 0; i < response.data.records.length; i++) {
              const file = {}
              file.id = response.data.records[i].id
              file.name = response.data.records[i].originalFileName
              this[accessoryArr[j] + 'List' + Module].push(file)
            }
          })
        }
      }
    },

    // 获取公司列表
    getCompanyList(module, records) {
      const Module = module
      this[Module + 'Data'] = []
      for (let j = 0; j < records.length; j++) {
        const id = records[j].branchCompanyCode
        if (!id) {
          console.log('没有找到：' + Module + ' 相关的信息！')
        } else {
          businesslicense(id).then(response => {
            this[Module + 'Data'].push(response.data)
          })
        }
      }
    },

    // 公司详情
    detail(row) {
      this.$router.push({ path: '/lpm/detailEnterpriseinfo', query: { id: row.id }})
    }
  }
}

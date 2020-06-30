import { getListIds } from '@/api/cms/fileInfo'
import { getList as capital } from '@/api/lpm/capital'
import { getList as dictList } from '@/api/system/dict'
import { getList as logList } from '@/api/system/log'
import { showDictLabel } from '@/utils/common'
import FilesListComponent from '@/components/FilesList/index.vue'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { FilesListComponent },
  data() {
    return {
      src: '',
      id: '',
      /* 股东信息模块 */
      shareholderData: [], // 股东信息相关数据
      shareholderType: '', // 股东类型
      shareholderStatus: '', // 股东状态
      accessoryFilesListShareholder: [],
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
      //this.src = '/d3tree/index.html?width=900&height=500&id=' + id + '#' + id
      this.src = '/guquan/index.html?width=900&height=500&id=' + id + '#' + id

      // 请求股东信息数据
      capital({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        var records = response.data.records
        this.shareholderData = records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Shareholder', accessoryArr, response.data.records)
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

    // 格式化 类型【股东信息】
    formatterShareholderType(row, name) {
      dictList({ name: '类型【股东信息】' }).then(response => {
        this.shareholderType = response.data[0].detail
      })
      const res = showDictLabel(this.shareholderType, row.shareholderType)
      return res
    },
    // 格式化 状态【股东信息】
    formatterShareholderStatus(row) {
      dictList({ name: '状态【股东信息】' }).then(response => {
        this.shareholderStatus = response.data[0].detail
      })
      const res = showDictLabel(this.shareholderStatus, row.status)
      return res
    },
    // 企业详情
    detail(row) {
      if (row.branchCompanyCode) {
        const routeUrl = this.$router.resolve({ path: '/lpm/detailEnterpriseinfo', query: { id: row.branchCompanyCode }})
        window.open(routeUrl.href, '_blank')
      } else {
        alert('没有匹配到对应的公司')
      }
    }
  }
}

import { getListIds } from '@/api/cms/fileInfo'
import { getList as knowledgepledge } from '@/api/lpm/knowledgepledge'
import { getList as dictList } from '@/api/system/dict'
import { showDictLabel } from '@/utils/common'
import FilesListComponent from '@/components/FilesList/index.vue'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { FilesListComponent },
  data() {
    return {
      id: '',
      /* 知识产权出质登记模块 */
      knowledgepledgeData: [], // 知识产权出质登记相关数据
      propertyType: '', // 种类
      knowledgeStatus: '', // 登记状态
      accessoryFilesListKnowledgepledge: [],
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

      /* 知识产权出质登记模块 */
      knowledgepledge({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.knowledgepledgeData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Knowledgepledge', accessoryArr, response.data.records)
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

    // 格式化 种类【知识产权出质登记信息】
    formatterPropertyType(row) {
      dictList({ name: '种类【知识产权出质登记信息】' }).then(response => {
        this.propertyType = response.data[0].detail
      })
      const res = showDictLabel(this.propertyType, row.propertyType)
      return res
    },
    // 格式化 状态【知识产权出质登记信息】
    formatterKnowledgeStatus(row) {
      dictList({ name: '状态【知识产权出质登记信息】' }).then(response => {
        this.knowledgeStatus = response.data[0].detail
      })
      const res = showDictLabel(this.knowledgeStatus, row.status)
      return res
    }
  }
}
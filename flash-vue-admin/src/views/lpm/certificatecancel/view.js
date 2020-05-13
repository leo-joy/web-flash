import { getListIds } from '@/api/cms/fileInfo'
import { getList as certificatecancel } from '@/api/lpm/certificatecancel'
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
      /* 证照废弃声明模块 */
      certificatecancelData: [], // 证照废弃声明相关数据
      transcriptStatus: '', // 是否正副本
      replaceStatus: '', // 是否补领
      accessoryFilesListCertificatecancel: [],
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

      // 证照废弃声明数据
      certificatecancel({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.certificatecancelData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Certificatecancel', accessoryArr, response.data.records)
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

    // 格式化 是否正副本【证照废弃声明】
    formatterTranscriptStatus(row) {
      dictList({ name: '是否正副本【证照废弃声明】' }).then(response => {
        this.transcriptStatus = response.data[0].detail
      })
      const res = showDictLabel(this.transcriptStatus, row.transcriptStatus)
      return res
    },

    // 格式化 是否补领【证照废弃声明】
    formatterReplaceStatus(row) {
      dictList({ name: '是否补领【证照废弃声明】' }).then(response => {
        this.replaceStatus = response.data[0].detail
      })
      const res = showDictLabel(this.replaceStatus, row.replaceStatus)
      return res
    }
  }
}

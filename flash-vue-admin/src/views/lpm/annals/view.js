import { getListIds } from '@/api/cms/fileInfo'
import { getList as annals } from '@/api/lpm/annals'
import FilesListComponent from '@/components/FilesList/index.vue'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { FilesListComponent },
  data() {
    return {
      id: '',
      /* 企业年报信息模块 */
      annalsData: [], // 企业年报信息相关数据
      accessoryFilesListAnnals: [],
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

      // 企业年报数据
      annals({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.annalsData = response.data.records
        this.initRecordFiles(this.annalsData)
      })
    },

    // 初始化条目原文
    initRecordFiles(records) {
      for (let i = 0; i < records.length; i++) {
        const filesTempArr = []
        const ids = records[i]['accessoryFiles'].replace(/(^\s*)|(\s*$)/g, '')
        if (ids) {
          var listQuery = {
            page: 1,
            limit: 20,
            ids: ids
          }

          getListIds(listQuery).then(response => {
            for (let j = 0; j < response.data.records.length; j++) {
              const file = {}
              file.id = response.data.records[j].id
              file.name = response.data.records[j].originalFileName
              filesTempArr.push(file)
              if (response.data.records.length - 1 === j) {
                this.annalsData[i]['accessoryArrList'] = filesTempArr
              }
            }
          })

          if (records.length - 1 === i) {
            // console.log(this.annalsData)
          }
        }
      }
    }
  }
}

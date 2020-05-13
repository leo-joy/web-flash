import { getListIds } from '@/api/cms/fileInfo'
import { getList as mainmember } from '@/api/lpm/mainmember'
import { getList as getUserList } from '@/api/system/user'
import FilesListComponent from '@/components/FilesList/index.vue'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { FilesListComponent },
  data() {
    return {
      id: '',

      /* 主要人员信息模块 */
      mainmemberData: [], // 主要人员相关数据
      directorList: [], // 董事相关信息
      accessoryFilesListMainmember: [],

      // 主要人员信息详情
      userInfoTitle: '主要人员信息详情',
      userInfoVisible: false,
      userInfoList: [],
      
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
    // 初始化
    init() {
      // 获取企业的id
      const id = this.$route.query.id
      // 请求主要人员信息数据
      mainmember({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.mainmemberData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Mainmember', accessoryArr, response.data.records)
      })
    },

    // 用户信息
    userDetail(row, type, name) {
      let userId = ''
      if (type === 'director') {
        const directorArr = row['director'].split('、')
        const directorIdArr = row['directorId'].split('、')
        for (let i = 0; i < directorArr.length; i++) {
          if (directorArr[i] === name) {
            userId = directorIdArr[i]
          }
        }
      } else if (type !== 'director') {
        userId = row[type + 'Id']
      }
      this.userInfoVisible = true
      const listQuery = {
        page: 1,
        limit: 1,
        id: userId
      }
      getUserList(listQuery).then(response => {
        console.log(response.data.records[0])
        this.userInfoList = response.data.records[0]
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
    }
  }
}

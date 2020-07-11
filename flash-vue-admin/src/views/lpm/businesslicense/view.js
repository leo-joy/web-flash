import { getListIds } from '@/api/cms/fileInfo'
import { get as businesslicense } from '@/api/lpm/businesslicense'

import { getList as dictList } from '@/api/system/dict'
import { parentdept as getParentdept } from '@/api/system/dept'
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
      id: '',
      /* 营业执照模块 */
      businesslicenseData: {}, // 营业执照的相关信息
      parentOrg: '', // 父组织机构
      grandfatherOrg: '', // 祖级组织机构
      enterpriseType: '', // 企业类型
      customTypeBL: '', // 自定义企业类型
      registrationTypeBL: '', // 企业注册类型
      currencyBL: '', // 币种
      registrationStatusBL: '', // 登记状态
      tagList: '', // 企业标签
      businessLicenseFilesListBL: [], // 营业执照的附件
      approvalFilesListBL: [], // 核准文件的附件
      companyArticlesAssociationListBL: [], // 股东决定的相关附件
      shareholdersDecideListBL: [], // 公司章程的相关附件
      applicationRegistrationFilesListBL: [], // 公司注册的附件
      otherFilesListBL: [], // 其他附件

      // 历史记录
      logTitle: '历史修改记录',
      logVisible: false,
      logList: [],
      logTotal: 0,

      // 主要人员信息详情
      userInfoTitle: '主要人员信息详情',
      userInfoVisible: false,
      userInfoList: [],

      deptTree: {
        show: false,
        data: [],
        defaultProps: {
          id: 'id',
          label: 'simplename',
          children: 'children'
        }
      },
      listQuery: {
        page: 1,
        limit: 20,
        ids: ''
      },
      form: {}
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
      // 请求营业执照信息
      businesslicense(id).then(response => {
        this.businesslicenseData = response.data
        this.logTitle = '【 ' + response.data.enterpriseName + ' 】'
        var accessoryArr = ['businessLicenseFiles', 'approvalFiles',
          'companyArticlesAssociation', 'shareholdersDecide',
          'applicationRegistrationFiles', 'otherFiles']
        var arr = []
        arr.push(response.data)
        this.translateDict('企业类型', response.data.type, 'enterpriseType')
        this.translateDict('自定义企业类型', response.data.customType, 'customTypeBL')
        this.translateDict('企业注册类型', response.data.registrationType, 'registrationTypeBL')
        this.translateDict('登记状态【营业执照】', response.data.registrationStatus, 'registrationStatusBL')
        this.translateDict('币种', response.data.currency, 'currencyBL')
        if (response.data.tags) {
          this.translateDictList('企业标签', response.data.tags.split('-'), 'tagList')
        }
        this.getFilesList('BL', accessoryArr, arr)
        getParentdept(response.data.pid).then(response => {
          this.parentOrg = response.data.simplename + ' / '
          console.log('父组织机构：', response)
          if (response.data.pid !== '0') {
            getParentdept(response.data.id).then(response => {
              if (response.data.simplename !== '组织机构' && response.data.simplename !== '雅居乐控股集团') {
                this.grandfatherOrg = response.data.simplename + ' / '
              }
            })
          }
        })
      })
    },

    // 获取原文列表
    getFilesList(module, accessoryArr, record) {
      if (record.length === 0) {
        return false
      }
      for (let j = 0; j < accessoryArr.length; j++) {
        const Module = module
        const _ids = record[0][accessoryArr[j]] ? record[0][accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '') : ''
        if (!_ids) {
          break
        }
        var listQuery = {
          page: 1,
          limit: 20,
          ids: _ids
        }

        if (_ids) {
          getListIds(listQuery).then(response => {
            for (let i = 0; i < response.data.records.length; i++) {
              const file = {}
              file.id = response.data.records[i].id
              file.name = response.data.records[i].originalFileName
              this[accessoryArr[j] + 'List' + Module].push(file)
            }
            console.log(accessoryArr[j] + 'List' + Module)
            console.log(this[accessoryArr[j] + 'List' + Module])
          })
        }
      }
    },

    translateDict(str, num, field) {
      dictList({ name: str }).then(response => {
        this[field] = showDictLabel(response.data[0].detail, num)
      })
    },

    translateDictList(str, arr, field) {
      dictList({ name: str }).then(response => {
        this[field] = []
        for (let i = 0; i < arr.length; i++) {
          const obj = {}
          obj.value = arr[i]
          obj.name = showDictLabel(response.data[0].detail, arr[i])
          this[field].push(obj)
        }
      })
    },

    // 变更历史
    viewLog(module, keyword, id) {
      this.logTitle = '【 ' + module + ' - 修改记录】'
      this.logVisible = true
      const listQuery = {
        page: 1,
        limit: 20,
        logName: keyword,
        message: '企业编码=' + id
      }
      logList(listQuery).then(response => {
        this.logList = []
        var records = response.data.records
        if (records && records.length > 0) {
          for (let i = 0; i < records.length; i++) {
            var messageArr = []
            if (records[i].regularMessage) {
              messageArr = records[i].regularMessage
              for (let j = 1; j < messageArr.length; j++) {
                var logArr = []
                logArr.push(messageArr[j]) //
                for (let t = 0; t < logArr.length; t++) {
                  var objArr = logArr[t].split(',')
                  var obj = {}
                  for (let g = 0; g < objArr.length; g++) {
                    var tempArr = objArr[g].split(':')
                    if (g === 0) {
                      obj['title'] = tempArr[1]
                    }
                    if (g === 1) {
                      obj['oldValue'] = tempArr[1]
                    }
                    if (g === 2) {
                      obj['newValue'] = tempArr[1]
                    }
                  }
                  obj.modifyTime = records[i].createTime
                  obj.userName = records[i].userName
                  this.logList.push(obj)
                }
              }
            }
          }
        }

        this.listLoading = false
        this.total = response.data.total
      })
    },

    handleChange(val) {
      // console.log(val)
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },
    back() {
      this.$router.go(-1)
    },

    hanglePreview(file) {
      this.$router.push({ path: '/lpm/enterpriseinfo/PDFView' })
    },
    editInfo(url, id) {
      this.$router.push({ path: url, query: { id: id }})
    }
  }
}

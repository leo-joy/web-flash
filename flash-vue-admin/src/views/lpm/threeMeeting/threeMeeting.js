
import { Loading } from 'element-ui'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { parseTime } from '@/utils'
import { getListIds } from '@/api/cms/fileInfo'
import { getList as dictList } from '@/api/system/dict'
import { getDictList, showDictLabel } from '@/utils/common'
import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { getList as getUserList } from '@/api/system/user'
import { remove, getList, save } from '@/api/lpm/threeMeeting'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加三会管理',
      typeList: '',
      meetingTypeList: '', // 会议类型
      companyListQuery: {
        page: 1,
        limit: 3000,
        id: undefined
      },
      companyList: [],
      companyListLength: 0,
      companyTree: {
        show: false,
        defaultProps: {
          id: 'id',
          label: 'enterpriseName',
          children: 'children'
        }
      },
      uploadUrl: '',
      uploadFileId: '',
      uploadHeaders: {
        'Authorization': ''
      },
      accessoryFilesList: [],

      isAdd: true,
      form: {
        enterpriseCode: '',
        enterpriseName: '',
        title: '',
        issue: '',
        meetingDate: '',
        organizers: '',
        organizersId: '',
        conferenceParticipant: '',
        conferenceParticipantId: '',
        meetingType: '',
        meetingConclusion: '',
        remark: '',
        meetingFiles: '',
        accessoryFiles: '',
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      listUserQuery: {
        page: 1,
        limit: 50000,
        type: '1,2',
        account: undefined,
        name: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      restaurants: [],
      conferenceParticipantTags: [], // 参会人员
      conferenceParticipantState: ''
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
        // cfgName: [
        //   { required: true, message: this.$t('config.name') + this.$t('common.isRequired'), trigger: 'blur' },
        //   { min: 3, max: 2000, message: this.$t('config.name') + this.$t('config.lengthValidation'), trigger: 'blur' }
        // ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
      dictList({ name: '会议类型' }).then(response => {
        this.typeList = getDictList(response.data[0].detail)
      })
      dictList({ name: '会议类型' }).then(response => {
        this.meetingTypeList = response.data[0].detail
      })
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.listQuery.enterpriseCode = this.$route.query.id
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
      })
      this.companyListQuery.id = this.$route.query.id
      getEnterpriseList(this.companyListQuery).then(response => {
        this.companyList = response.data.records
        this.listLoading = false
        this.registrationType = this.companyList[0].registrationType ? this.companyList[0].registrationType * 1 : 1
      })
    },
    search() {
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.fetchData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleClose() {

    },
    fetchNext() {
      this.listQuery.page = this.listQuery.page + 1
      this.fetchData()
    },
    fetchPrev() {
      this.listQuery.page = this.listQuery.page - 1
      this.fetchData()
    },
    fetchPage(page) {
      this.listQuery.page = page
      this.fetchData()
    },
    changeSize(limit) {
      this.listQuery.limit = limit
      this.fetchData()
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    resetForm() {
      this.form = {
        enterpriseCode: '',
        enterpriseName: '',
        title: '',
        issue: '',
        meetingDate: '',
        organizers: '',
        organizersId: '',
        conferenceParticipant: '',
        conferenceParticipantId: '',
        meetingType: '',
        meetingConclusion: '',
        remark: '',
        meetingFiles: '',
        accessoryFiles: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加三会管理',
      this.formVisible = true
      this.isAdd = true
      this.conferenceParticipantTags = []

      // 设置新增企业初始值;
      this.form.enterpriseName = this.companyList[0].enterpriseName
      this.form.enterpriseCode = this.companyList[0].id

      getUserList(this.listUserQuery).then(response => {
        this.restaurants = response.data.records
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            enterpriseCode: this.form.enterpriseCode,
            enterpriseName: this.form.enterpriseName,
            title: this.form.title,
            issue: this.form.issue,
            meetingDate: this.form.meetingDate ? parseTime(this.form.meetingDate, '{y}-{m}-{d}') : '',

            meetingDate: this.form.meetingDate,
            organizers: this.form.organizers,
            organizersId: this.form.organizersId,
            conferenceParticipant: this.form.conferenceParticipant,
            conferenceParticipantId: this.form.conferenceParticipantId,
            meetingType: this.form.meetingType,
            meetingConclusion: this.form.meetingConclusion,
            remark: this.form.remark,
            meetingFiles: this.form.meetingFiles,
            accessoryFiles: this.form.accessoryFiles,
            id: this.form.id
          }).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchData()
            this.formVisible = false
          })
        } else {
          return false
        }
      })
    },
    checkSel() {
      if (this.selRow && this.selRow.id) {
        return true
      }
      this.$message({
        message: this.$t('common.mustSelectOne'),
        type: 'warning'
      })
      return false
    },
    edit() {
      if (this.checkSel()) {
        this.isAdd = false
        this.form = this.selRow
        this.formTitle = '编辑三会管理'
        this.formVisible = true

        if (this.selRow.conferenceParticipantId) {
          this.conferenceParticipantTags = []
          const conferenceParticipantIdArr = this.selRow.conferenceParticipantId.split('、')
          const conferenceParticipantArr = this.selRow.conferenceParticipant.split('、')
          for (let j = 0; j < conferenceParticipantIdArr.length; j++) {
            this.conferenceParticipantTags.push({ name: conferenceParticipantArr[j], id: conferenceParticipantIdArr[j] })
          }
        }
        
        if (this.selRow.accessoryFiles) {
          this.accessoryFilesList = []
          const filesListQuery = {
            page: 1,
            limit: 20,
            ids: this.selRow.accessoryFiles.toString()
          }
          getListIds(filesListQuery).then(response => {
            for (let i = 0; i < response.data.records.length; i++) {
              const file = {}
              file.id = response.data.records[i].id
              file.name = response.data.records[i].originalFileName
              file.url = this.uploadUrl + '/getImgStream?idFile=' + response.data.records[i].id
              this.accessoryFilesList.push(file)
            }
          })
        }
        getUserList(this.listUserQuery).then(response => {
          this.restaurants = response.data.records
        })
      }
    },
    remove() {
      if (this.checkSel()) {
        var id = this.selRow.id
        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        }).then(() => {
          remove(id).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchData()
          }).catch(err => {
            this.$notify.error({
              title: '错误',
              message: err
            })
          })
        }).catch(() => {
        })
      }
    },

    handleCompanyNodeClick(data, node) {
      this.form.enterpriseCode = data.id
      this.form.enterpriseName = data.enterpriseName
      this.companyTree.show = false
    },
    handleBeforeUpload() {
      if (this.uploadFileId !== '') {
        this.$message({
          message: this.$t('common.mustSelectOne'),
          type: 'warning'
        })
        return false
      }
      this.loadingInstance = Loading.service({
        lock: true,
        text: this.$t('common.uploading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    hanglePreview(file) {
      this.$emit('viewfile', file.id, file.name)
    },
    handleRemoveFile(file) {
      // 删除原文时更新原文列表
      // 判断删除文件的位置，等于0，是在列表首位
      if (this.form.accessoryFiles.indexOf(file.id) !== 0) {
        this.form.accessoryFiles = this.form.accessoryFiles.replace(' ' + file.id, '')
      } else {
        this.form.accessoryFiles = this.form.accessoryFiles.replace(file.id, '')
      }
    },
    accessoryFilesUploadSuccess(response) {
      this.loadingInstance.close()
      if (response.code === 20000) {
        if (this.form.accessoryFiles) {
          this.form.accessoryFiles = this.form.accessoryFiles + ' ' + response.data.id
        } else {
          this.form.accessoryFiles = response.data.id
        }
      } else {
        this.$message({
          message: this.$t('common.uploadError'),
          type: 'error'
        })
      }
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        if (results && results.length === 0) {
          this.$message({
            message: '您输入的信息没有匹配到相应的结果！请检查输入是否正确！如匹配到不可通过右侧➕搜索配置高级管理人员！',
            type: 'warning'
          })
        }
        cb(results)
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        // return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        return (state.name.indexOf(queryString) === 0)
      }
    },
    handleOrganizersSelect(item) {
      this.form.organizersId = item.id
      this.form.organizers = item.name
    },
    handleConferenceParticipantSelect(item) {
      console.log(item)
      console.log(this.form.conferenceParticipant)
      if (this.form.conferenceParticipant) {
        if (this.form.conferenceParticipant.indexOf(item.name) === -1) {
          this.form.conferenceParticipantId = this.form.conferenceParticipantId + '、' + item.id
          this.form.conferenceParticipant = this.form.conferenceParticipant + '、' + item.name
          this.conferenceParticipantTags.push({ id: item.id, name: item.name })
        } else {
          this.form.conferenceParticipantId = this.form.conferenceParticipantId
          this.form.conferenceParticipant = this.form.conferenceParticipant
        }
      } else {
        this.form.conferenceParticipantId = item.id
        this.form.conferenceParticipant = item.name
        this.conferenceParticipantTags.push({ id: item.id, name: item.name })
      }
    },
    handleConferenceParticipantDelete(id, name) {
      var result = this.conferenceParticipantTags.filter(word => word.id !== id)
      console.log(result)
      this.conferenceParticipantTags = result.length > 0 ? result : []
      const n = (this.form.conferenceParticipantId.split('、')).length - 1
      console.log(this.form.conferenceParticipantId)
      console.log(this.form.conferenceParticipant)
      console.log(n)
      if (n > 0) {
        console.log('多个')
        if (this.form.conferenceParticipant.indexOf(name) !== 0) {
          this.form.conferenceParticipantId = this.form.conferenceParticipantId.replace('、' + id, '')
          this.form.conferenceParticipant = this.form.conferenceParticipant.replace('、' + name, '')
        } else {
          this.form.conferenceParticipantId = this.form.conferenceParticipantId.replace(id + '、', '')
          this.form.conferenceParticipant = this.form.conferenceParticipant.replace(name + '、', '')
        }
      } else {
        console.log('单个')
        this.form.conferenceParticipantId = this.form.conferenceParticipantId.replace(id, '')
        this.form.conferenceParticipant = this.form.conferenceParticipant.replace(name, '')
      }
    },
    handleIconClick(ev) {
      // this.addAdvancedUser()
    },
    // 格式化 登记状态
    formatterMeetingType(row) {
      const res = showDictLabel(this.meetingTypeList, row.meetingType)
      return res
    }
  }
}

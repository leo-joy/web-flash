
import { Loading } from 'element-ui'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { getListIds } from '@/api/cms/fileInfo'
import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { getList as getUserList, saveUser } from '@/api/system/user'
import { remove, getList, save } from '@/api/lpm/mainmember'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加主要人员信息',
      companyListQuery: {
        page: 1,
        limit: 2000,
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
        enterpriseName: '',
        enterpriseCode: '',
        chairmanId: '',
        chairman: '',
        directorId: '',
        director: '',
        supervisorId: '',
        supervisor: '',
        generalManagerId: '',
        generalManager: '',
        accessoryFiles: '',
        id: ''
      },
      rules: {
        enterpriseName: [
          { required: true, message: '请选择公司名称', trigger: 'blur' }
        ],
        generalManager: [
          { required: true, message: '请添加总经理', trigger: 'blur' }
        ],
        director: [
          { required: true, message: '请添加董事', trigger: 'blur' }
        ]
      },
      advancedUserRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在11位数字', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入email', trigger: 'blur' }]
      },
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined
      },
      listUserQuery: {
        page: 1,
        limit: 50000,
        account: undefined,
        name: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      restaurants: [],
      directorTags: [], // 董事
      supervisorTags: [], // 董事
      directorState: '',
      supervisorState: '',
      timeout: null,
      // 高级管理人员添加
      formAdvancedUserTitle: '添加高级管理人员',
      formAdvancedUserVisible: false,
      advancedUserForm: {
        id: '',
        account: '',
        name: '',
        birthday: '',
        sex: 1,
        academic: '',
        specialty: '',
        post: '',
        duty: '',
        experience: '',
        type: '1',
        email: '',
        phone: '',
        password: '',
        rePassword: '',
        dept: '',
        status: true,
        deptid: 1,
        deptName: ''
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
    // rules() {
    //   return {
    //     // cfgName: [
    //     //   { required: true, message: this.$t('config.name') + this.$t('common.isRequired'), trigger: 'blur' },
    //     //   { min: 3, max: 2000, message: this.$t('config.name') + this.$t('config.lengthValidation'), trigger: 'blur' }
    //     // ]
    //   }
    // }
  },
  created() {
    this.init()
  },
  mounted() {
    // this.restaurants = this.loadAll();
  },
  methods: {
    init() {
      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.listQuery.enterpriseCode = this.$route.query.id
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.companyListLength = this.list.length
        this.listLoading = false
        this.total = response.data.total
      })
      this.companyListQuery.id = this.$route.query.id
      getEnterpriseList(this.companyListQuery).then(response => {
        this.companyList = response.data.records
        this.listLoading = false
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
        enterpriseName: '',
        enterpriseCode: '',
        chairmanId: '',
        chairman: '',
        directorId: '',
        director: '',
        supervisorId: '',
        supervisor: '',
        generalManagerId: '',
        generalManager: '',
        accessoryFiles: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加主要人员信息'
      this.formVisible = true
      this.isAdd = true
      this.directorTags = []
      this.supervisorTags = []

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
            enterpriseName: this.form.enterpriseName,
            enterpriseCode: this.form.enterpriseCode,
            chairmanId: this.form.chairmanId,
            chairman: this.form.chairman,
            directorId: this.form.directorId,
            director: this.form.director,
            supervisorId: this.form.supervisorId,
            supervisor: this.form.supervisor,
            generalManagerId: this.form.generalManagerId,
            generalManager: this.form.generalManager,
            accessoryFiles: this.form.accessoryFiles.replace(/(^\s*)|(\s*$)/g, ''),
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
        this.formTitle = '编辑主要人员信息'
        this.formVisible = true
        if (this.selRow.directorId) {
          this.directorTags = []
          const directorIdArr = this.selRow.directorId.split('、')
          const directorArr = this.selRow.director.split('、')
          for (let j = 0; j < directorIdArr.length; j++) {
            this.directorTags.push({ name: directorArr[j], id: directorIdArr[j] })
          }
        }

        if (this.selRow.supervisorId) {
          this.supervisorTags = []
          const supervisorIdArr = this.selRow.supervisorId.split('、')
          const supervisorArr = this.selRow.supervisor.split('、')
          for (let j = 0; j < supervisorIdArr.length; j++) {
            this.supervisorTags.push({ name: supervisorArr[j], id: supervisorIdArr[j] })
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
    loadAll() {
      return [
        { value: '潘智勇', zhiwu: '总经理', zhicheng: '高级经济师' }
      ]
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        cb(results)
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        // return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        return (state.name.indexOf(queryString) === 0)
      }
    },
    handleChairmanSelect(item) {
      this.form.chairmanId = item.id
      this.form.chairman = item.name
    },
    handleGeneralManagerSelect(item) {
      this.form.generalManagerId = item.id
      this.form.generalManager = item.name
    },
    handleDirectorSelect(item) {
      console.log(item)
      console.log(this.form.director)
      if (this.form.director) {
        if (this.form.director.indexOf(item.name) === -1) {
          this.form.directorId = this.form.directorId + '、' + item.id
          this.form.director = this.form.director + '、' + item.name
          this.directorTags.push({ id: item.id, name: item.name })
        } else {
          this.form.directorId = this.form.directorId
          this.form.director = this.form.director
        }
      } else {
        this.form.directorId = item.id
        this.form.director = item.name
        this.directorTags.push({ id: item.id, name: item.name })
      }
    },
    handleDirectorDelete(id, name) {
      var result = this.directorTags.filter(word => word.id !== id)
      console.log(result)
      this.directorTags = result.length > 0 ? result : []
      const n = (this.form.directorId.split('、')).length - 1
      console.log(this.form.directorId)
      console.log(this.form.director)
      console.log(n)
      if (n > 0) {
        console.log('多个')
        if (this.form.director.indexOf(name) !== 0) {
          this.form.directorId = this.form.directorId.replace('、' + id, '')
          this.form.director = this.form.director.replace('、' + name, '')
        } else {
          this.form.directorId = this.form.directorId.replace(id + '、', '')
          this.form.director = this.form.director.replace(name + '、', '')
        }
      } else {
        console.log('单个')
        this.form.directorId = this.form.directorId.replace(id, '')
        this.form.director = this.form.director.replace(name, '')
      }
      console.log(this.form.directorId)
      console.log(this.form.director)
      console.log(this.directorTags)
    },
    handleSupervisorSelect(item) {
      console.log(item)
      console.log(this.form.supervisor)
      if (this.form.supervisor) {
        if (this.form.supervisor.indexOf(item.name) === -1) {
          this.form.supervisorId = this.form.supervisorId + '、' + item.id
          this.form.supervisor = this.form.supervisor + '、' + item.name
          this.supervisorTags.push({ id: item.id, name: item.name })
        } else {
          this.form.supervisorId = this.form.supervisorId
          this.form.supervisor = this.form.supervisor
        }
      } else {
        this.form.supervisorId = item.id
        this.form.supervisor = item.name
        this.supervisorTags.push({ id: item.id, name: item.name })
      }
    },
    handleSupervisorDelete(id, name) {
      var result = this.supervisorTags.filter(word => word.id !== id)
      console.log(result)
      this.supervisorTags = result.length > 0 ? result : []
      const n = (this.form.supervisorId.split('、')).length - 1
      console.log(this.form.supervisorId)
      console.log(this.form.supervisor)
      console.log(n)
      if (n > 0) {
        console.log('多个')
        if (this.form.supervisor.indexOf(name) !== 0) {
          this.form.supervisorId = this.form.supervisorId.replace('、' + id, '')
          this.form.supervisor = this.form.supervisor.replace('、' + name, '')
        } else {
          this.form.supervisorId = this.form.supervisorId.replace(id + '、', '')
          this.form.supervisor = this.form.supervisor.replace(name + '、', '')
        }
      } else {
        console.log('单个')
        this.form.supervisorId = this.form.supervisorId.replace(id, '')
        this.form.supervisor = this.form.supervisor.replace(name, '')
      }
      console.log(this.form.supervisorId)
      console.log(this.form.supervisor)
      console.log(this.supervisorTags)
    },
    handleIconClick(ev) {
      // getUserList(this.listUserQuery).then(response => {
      //   this.restaurants = response.data.records
      // })
      this.addAdvancedUser()
      // this.$router.push({ path: '/advancedUser/1' })
      // console.log(ev)
    },

    // 高级管理人员
    resetAdvancedUserForm() {
      this.advancedUserForm = {
        id: '',
        account: '',
        name: '',
        birthday: '',
        sex: 1,
        academic: '',
        specialty: '',
        post: '',
        duty: '',
        experience: '',
        type: 1,
        email: '',
        phone: '',
        password: '',
        rePassword: '',
        dept: '',
        status: true,
        deptid: 1
      }
    },
    addAdvancedUser() {
      this.resetAdvancedUserForm()
      this.formAdvancedUserTitle = '添加高级管理人员'
      this.formAdvancedUserVisible = true
      this.isAdvancedUserAdd = true
      console.log(this.advancedUserForm)
    },
    saveUser() {
      var self = this
      this.$refs['advancedUserForm'].validate(valid => {
        if (valid) {
          var form = self.advancedUserForm
          if (form.status === true) {
            // 启用
            form.status = 1
          } else {
            // 冻结
            form.status = 2
          }
          form.type = '1'
          form.account = 'yjl' + form.phone // 登录名
          form.password = 'yjl' + form.phone // 密码
          form.rePassword = 'yjl' + form.phone // 重复密码
          form.deptid = 36 // 部门
          console.log(form)
          saveUser(form).then(response => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            getUserList(this.listUserQuery).then(response => {
              this.restaurants = response.data.records
              this.formAdvancedUserVisible = false
            })
          })
        } else {
          console.log('发生错误')
          return false
        }
      })
    }

  }
}

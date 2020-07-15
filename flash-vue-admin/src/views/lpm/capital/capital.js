import { Loading } from 'element-ui'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { getListIds } from '@/api/cms/fileInfo'
import { parseTime } from '@/utils'
import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { getList as getUserList } from '@/api/system/user'

import { getList as dictList } from '@/api/system/dict'
import { getDictList } from '@/utils/common'
import { showDictLabel } from '@/utils/common'
import { remove, getList, save } from '@/api/lpm/capital'

import subcribeRecord from '@/views/lpm/subcribeRecord/index.vue'
import realityRecord from '@/views/lpm/realityRecord/index.vue'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: {
    subcribeRecord,
    realityRecord
  },
  data() {
    return {
      activeNames: ['1', '4'],
      formVisible: false,
      formTitle: '添加股权及出资信息',
      enterpriseCode: '', // 公司的id
      subscribedCapitalTypeList: [], // 认缴出资方式，从数据字典中获取
      realityCapitalTypeList: [], // 实缴出资方式，从数据字典中获取
      subscribedCapitalTypeCapital: '', // 认缴出资方式
      realityCapitalTypeCapital: '', // 实缴出资方式
      typeList: [], // 类型，从数据字典中获取
      statusList: [], // 状态，从数据字典中获取
      shareholderMold: 1, // 股东分类
      shareholderType: '', // 股东类型
      shareholderStatus: '', // 股东状态
      companyListQuery: {
        page: 1,
        limit: 2000,
        id: undefined
      },
      companyList: [],
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
        serialNumber: '',
        enterpriseName: '',
        enterpriseCode: '',
        shareholder: '',
        subscribedCapitalType: '',
        subscribedCapitalContribution: '',
        subscribedCapitalDate: '',
        realityCapitalType: '',
        realityCapitalContribution: '',
        realityCapitalDate: '',
        proportion: 0,
        shareholderMold: '1',
        shareholderType: '',
        status: '',
        responsiblePerson: '',
        accessoryFiles: '',
        branchCompanyName: '',
        branchCompanyCode: '',
        legalRepresentative: '',
        setupDate: '',
        type: '',
        customType: '',
        registrationType: '',
        registrationPlace: '',
        registeredCapital: '',
        currency: '',
        registrationStatus: '',
        remark: '',
        id: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      enterpriseShareholders: [], // 公司股东列表
      naturalPersonShareholders: [] // 自然人股东列表
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
        enterpriseName: [
          { required: true, message: '请选择所属公司名称', trigger: 'blur' }
        ],
        subscribedCapitalType: [
          { required: true, message: '请选择认缴出资方式', trigger: 'blur' }
        ],
        subscribedCapitalContribution: [
          { required: true, message: '认缴出资额不能为空', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,4})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留四位小数' }
        ],
        realityCapitalContribution: [
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,4})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确额格式,可保留四位小数' }
        ],
        shareholderType: [
          { required: true, message: '请选择股东类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
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
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.enterpriseCode = this.$route.query.id
      this.listQuery.enterpriseCode = this.enterpriseCode
      getList(this.listQuery).then(response => {
        var records = response.data.records
        // if (records && records.length > 0) {
        //   records.map((item) => {
        //     item.proportion = item.proportion * 100
        //   })
        // }
        this.list = records
        this.listLoading = false
        this.total = response.data.total
      })

      dictList({ name: '认缴出资方式【股权及出资信息】' }).then(response => {
        this.subscribedCapitalTypeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '实缴出资方式【股权及出资信息】' }).then(response => {
        this.realityCapitalTypeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '类型【股东信息】' }).then(response => {
        this.typeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '状态【股东信息】' }).then(response => {
        this.statusList = getDictList(response.data[0].detail)
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
        serialNumber: '',
        enterpriseName: '',
        enterpriseCode: '',
        shareholder: '',
        subscribedCapitalType: '',
        subscribedCapitalContribution: '',
        subscribedCapitalDate: '',
        realityCapitalType: '',
        realityCapitalContribution: '',
        realityCapitalDate: '',
        proportion: 0,
        shareholderMold: 1,
        shareholderType: '',
        status: '',
        responsiblePerson: '',
        accessoryFiles: '',
        branchCompanyName: '',
        branchCompanyCode: '',
        legalRepresentative: '',
        setupDate: '',
        type: '',
        customType: '',
        registrationType: '',
        registrationPlace: '',
        registeredCapital: '',
        currency: '',
        registrationStatus: '',
        remark: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加股权及出资信息'
      this.formVisible = true
      this.isAdd = true

      // 设置新增股东的初始值;
      this.form.enterpriseName = this.companyList[0].enterpriseName
      this.form.enterpriseCode = this.companyList[0].id

      //
      this.accessoryFilesList = []

      // 请求公司股东全部列表
      getEnterpriseList({
        page: 1,
        limit: 2000
      }).then(response => {
        this.enterpriseShareholders = response.data.records
      })

      // 请求自然人股东全部列表
      getUserList({
        page: 1,
        limit: 50000
      }).then(response => {
        this.naturalPersonShareholders = response.data.records
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            serialNumber: this.form.serialNumber,
            enterpriseName: this.form.enterpriseName,
            enterpriseCode: this.form.enterpriseCode,
            shareholder: this.form.shareholder,
            subscribedCapitalType: this.form.subscribedCapitalType,
            subscribedCapitalContribution: parseFloat(this.form.subscribedCapitalContribution).toFixed(4),
            subscribedCapitalDate: this.form.subscribedCapitalDate ? parseTime(this.form.subscribedCapitalDate, '{y}-{m}-{d}') : '',
            realityCapitalType: this.form.realityCapitalType,
            realityCapitalContribution: this.form.realityCapitalContribution ? parseFloat(this.form.realityCapitalContribution).toFixed(4) : '',
            realityCapitalDate: this.form.realityCapitalDate ? parseTime(this.form.realityCapitalDate, '{y}-{m}-{d}') : '',
            proportion: this.form.proportion,
            shareholderMold: this.form.shareholderMold,
            shareholderType: this.form.shareholderType,
            status: this.form.status,
            responsiblePerson: this.form.responsiblePerson,
            accessoryFiles: this.form.accessoryFiles.replace(/(^\s*)|(\s*$)/g, ''),
            branchCompanyName: this.form.branchCompanyName,
            branchCompanyCode: this.form.branchCompanyCode,
            legalRepresentative: this.form.legalRepresentative,
            setupDate: this.form.setupDate,
            type: this.form.type,
            customType: this.form.customType,
            registrationType: this.form.registrationType,
            registrationPlace: this.form.registrationPlace,
            registeredCapital: this.form.registeredCapital,
            currency: this.form.currency,
            registrationStatus: this.form.registrationStatus,
            remark: this.form.remark,
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
        this.activeNames = ['1', '2', '3', '4']
        this.form = this.selRow
        this.formTitle = '编辑股权及出资信息'
        this.formVisible = true
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
        } else {
          this.accessoryFilesList = []
        }
        // 请求公司股东全部列表
        getEnterpriseList({
          page: 1,
          limit: 2000
        }).then(response => {
          this.enterpriseShareholders = response.data.records
        })

        // 请求自然人股东全部列表
        getUserList({
          page: 1,
          limit: 50000
        }).then(response => {
          this.naturalPersonShareholders = response.data.records
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
    // 格式化 认缴出资方式【股权及出资信息】
    formatterSubscribedCapitalType(row) {
      dictList({ name: '认缴出资方式【股权及出资信息】' }).then(response => {
        this.subscribedCapitalTypeCapital = response.data[0].detail
      })
      const res = showDictLabel(this.subscribedCapitalTypeCapital, row.subscribedCapitalType)
      return res
    },
    // 格式化 实缴出资方式【股权及出资信息】
    formatterRealityCapitalType(row) {
      dictList({ name: '实缴出资方式【股权及出资信息】' }).then(response => {
        this.realityCapitalTypeCapital = response.data[0].detail
      })
      const res = showDictLabel(this.realityCapitalTypeCapital, row.realityCapitalType)
      return res
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

    handleChangeRadio() {
      console.log(this.isAdd)
      console.log(this.form.shareholder)
      if (this.isAdd) {
        this.form.shareholder = ''
      }
    },
    // 搜索分公司相关函数
    querySearchAsync(queryString, cb) {
      if (queryString) {
        var restaurants = this.enterpriseShareholders
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
        cb(results)
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        // return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        return (state.enterpriseName.indexOf(queryString) === 0)
      }
    },
    handleBranchCompanySelect(item) {
      // console.log(this.list)
      if (item.id === this.form.enterpriseCode) {
        alert('不能选本身公司')
        return
      }
      var result = this.list.filter(word => word.branchCompanyCode === item.id)
      if (result.length > 0 && this.isAdd) {
        alert('此股东已经添加')
        return
      }
      this.form.shareholder = item.enterpriseName
      this.form.branchCompanyName = item.enterpriseName
      this.form.branchCompanyCode = item.id
      this.form.legalRepresentative = item.legalRepresentative
      this.form.setupDate = item.setupDate
      this.form.type = item.type
      this.form.customType = item.customType
      this.form.registrationType = item.registrationType
      this.form.registrationPlace = item.registrationPlace
      this.form.registeredCapital = item.registeredCapital
      this.form.currency = item.currency
      this.form.registrationStatus = item.registrationStatus
      this.form.remark = item.remark
    },
    handleIconClick(ev) {
      // getUserList(this.listUserQuery).then(response => {
      //   this.enterpriseShareholders = response.data.records
      // })
      alert('如果没有搜索到，如有权限可以新增股东信息')
      console.log(ev)
    },

    // 搜索自然人股东相关函数
    querySearchNaturalPersonAsync(queryString, cb) {
      var naturalPersonShareholders = this.naturalPersonShareholders
      var results = queryString ? naturalPersonShareholders.filter(this.createStateNaturalPersonFilter(queryString)) : naturalPersonShareholders
      cb(results)
    },
    createStateNaturalPersonFilter(queryString) {
      return (state) => {
        // return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        return (state.name.indexOf(queryString) === 0)
      }
    },
    handleNaturalPersonSelect(item) {
      // console.log(this.list)
      if (item.id === this.form.enterpriseCode) {
        alert('不能选本身公司')
        return
      }
      var result = this.list.filter(word => word.branchCompanyCode === item.id)
      if (result.length > 0) {
        alert('此股东已经添加')
        return
      }
      this.form.shareholder = item.name
      this.form.branchCompanyName = item.name
      this.form.branchCompanyCode = item.id
    },
    handleIconNaturalPersonClick(ev) {
      // getUserList(this.listUserQuery).then(response => {
      //   this.enterpriseShareholders = response.data.records
      // })
      alert('如果没有搜索到，如有权限可以新增股东信息')
      console.log(ev)
    }

  }
}

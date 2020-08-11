import { Loading } from 'element-ui'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { getListIds } from '@/api/cms/fileInfo'
import { parseTime } from '@/utils'
import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { getList as dictList } from '@/api/system/dict'
import { getDictList } from '@/utils/common'
import { showDictLabel } from '@/utils/common'
import { remove, getList, save } from '@/api/lpm/stockpledge'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加股权出质登记信息',
      statusList: [], // 登记状态，从数据字典中获取
      stockStatus: '', // 登记状态
      companyListQuery: {
        page: 1,
        limit: 6000,
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
        registerCode: '',
        pledgor: '',
        pledgorCertificateNumber: '',
        pledgeStockContribution: '',
        pledgee: '',
        pledgeeCertificateNumber: '',
        stockPledgeRegisterDate: '',
        status: '',
        responsiblePerson: '',
        accessoryFiles: '',
        id: ''
      },
      rules: {
        enterpriseName: [
          { required: true, message: '请选择公司名称', trigger: 'blur' }
        ],
        pledgor: [
          { required: true, message: '请填写出质人', trigger: 'blur' }
        ],
        pledgorCertificateNumber: [
          { required: true, message: '请填写出质人证件号码', trigger: 'blur' }
        ],
        pledgeStockContribution: [
          { required: true, message: '请填写出质股权数额', trigger: 'blur' },
          { type: 'number', message: '只能输入是数值', trigger: 'blur' }

        ],
        pledgee: [
          { required: true, message: '请填写质权人', trigger: 'blur' }
        ],
        pledgeeCertificateNumber: [
          { required: true, message: '请填写质权人证件号码', trigger: 'blur' }
        ],
        stockPledgeRegisterDate: [
          { required: true, message: '请填写股权出质设立登记日期', trigger: 'blur' }
        ]
      },
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {}
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

    // // 表单验证
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
        this.listLoading = false
        this.total = response.data.total
      })

      dictList({ name: '状态【股权出质登记信息】' }).then(response => {
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
        registerCode: '',
        pledgor: '',
        pledgorCertificateNumber: '',
        pledgeStockContribution: '',
        pledgee: '',
        pledgeeCertificateNumber: '',
        stockPledgeRegisterDate: '',
        status: '',
        responsiblePerson: '',
        accessoryFiles: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加股权出质登记信息'
      this.formVisible = true
      this.isAdd = true

      // 设置新增企业初始值;
      this.form.enterpriseName = this.companyList[0].enterpriseName
      this.form.enterpriseCode = this.companyList[0].id
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            serialNumber: this.form.serialNumber,
            enterpriseName: this.form.enterpriseName,
            enterpriseCode: this.form.enterpriseCode,
            registerCode: this.form.registerCode,
            pledgor: this.form.pledgor,
            pledgorCertificateNumber: this.form.pledgorCertificateNumber,
            pledgeStockContribution: this.form.pledgeStockContribution,
            pledgee: this.form.pledgee,
            pledgeeCertificateNumber: this.form.pledgeeCertificateNumber,
            stockPledgeRegisterDate: parseTime(this.form.stockPledgeRegisterDate, '{y}-{m}-{d}'),
            status: this.form.status,
            responsiblePerson: this.form.responsiblePerson,
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
        this.formTitle = '编辑股权出质登记信息'
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
        }
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
    // 格式化 状态【股权出质登记信息】
    formatterStockStatus(row) {
      dictList({ name: '状态【股权出质登记信息】' }).then(response => {
        this.stockStatus = response.data[0].detail
      })
      const res = showDictLabel(this.stockStatus, row.status)
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
    }

  }
}

import { Loading } from 'element-ui'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'
import { getListIds } from '@/api/cms/fileInfo'
import { parseTime } from '@/utils'
import { getList as getEnterpriseList } from '@/api/lpm/businesslicense'
import { getList as dictList } from '@/api/system/dict'
import { getDictList } from '@/utils/common'
import { showDictLabel } from '@/utils/common'
import { remove, getList, save } from '@/api/lpm/certificatecancel'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加证照作废声明',
      transcriptStatusList: [], // 是否正副本，从数据字典中获取
      transcriptStatus: '', // 是否正副本
      replaceStatusList: [], // 是否补领，从数据字典中获取
      replaceStatus: '', // 是否补领
      companyListQuery: {
        page: 1,
        limit: 1000,
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
        transcriptStatus: '',
        transcriptCode: '',
        statementContent: '',
        statementDate: '',
        replaceStatus: '',
        publicityDate: '',
        responsiblePerson: '',
        accessoryFiles: '',
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

      dictList({ name: '是否正副本【证照废弃声明】' }).then(response => {
        this.transcriptStatusList = getDictList(response.data[0].detail)
      })

      dictList({ name: '是否补领【证照废弃声明】' }).then(response => {
        this.replaceStatusList = getDictList(response.data[0].detail)
      })

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
        transcriptStatus: '',
        transcriptCode: '',
        statementContent: '',
        statementDate: '',
        replaceStatus: '',
        publicityDate: '',
        responsiblePerson: '',
        accessoryFiles: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加证照作废声明'
      this.formVisible = true
      this.isAdd = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            serialNumber: this.form.serialNumber,
            enterpriseName: this.form.enterpriseName,
            enterpriseCode: this.form.enterpriseCode,
            transcriptStatus: this.form.transcriptStatus,
            transcriptCode: this.form.transcriptCode,
            statementContent: this.form.statementContent,
            statementDate: parseTime(this.form.statementDate, '{y}-{m}-{d}'),
            replaceStatus: this.form.replaceStatus,
            publicityDate: parseTime(this.form.publicityDate, '{y}-{m}-{d}'),
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
        this.formTitle = '编辑证照作废声明'
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
      this.$router.push({ path: '/lpm/businesslicense/pdfview' })
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

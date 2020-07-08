import { getUuid } from '@/utils/common'
import { remove, getList, save } from '@/api/system/interfaceManage'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  data() {
    return {
      formVisible: false,
      formTitle: '添加接口管理',
      isAdd: true,
      form: {
        code: '',
        name: '',
        url: '',
        description: '',
        status: 1,
        token: '',
        id: ''
      },
      rules: {
        code: [
          { required: true, message: '请系统编号', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入系统名称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ],
        token: [
          { required: true, message: '请输入token值', trigger: 'blur' },
          { min: 10, max: 64, message: '长度在 10 到 64 个字符', trigger: 'blur' }
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
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
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
        code: '',
        name: '',
        url: '',
        description: '',
        status: '',
        token: '',
        id: ''
      }
    },
    add() {
      this.resetForm()
      this.formTitle = '添加接口管理'
      this.formVisible = true
      this.isAdd = true
      this.form.token = getUuid()
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let status = 1
          if (this.form.status === true) {
            // 启用
            status = 1
          } else {
            // 冻结
            status = 2
          }
          save({
            code: this.form.code,
            name: this.form.name,
            url: this.form.url,
            description: this.form.description,
            status: status,
            token: this.form.token,
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
        this.formTitle = '编辑接口管理'
        this.formVisible = true
        if (this.form.status*1 === 1) {
          // 启用
          this.form.status = true
        } else {
          // 冻结
          this.form.status = false
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
    }

  }
}

import { getEnterpriseFiles } from '@/api/cms/fileInfo'
import { getList } from '@/api/lpm/businesslicense'

import { getApiUrl } from '@/utils/utils'
import PDFView from '@/components/PdfView/index.vue'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { PDFView },
  data() {
    return {
      searchType: 'enterpriseName',
      keyword: '',
      options: [{
        value: 'enterpriseName',
        label: '企业名称'
      }, {
        value: 'unifiedSocialCreditCode',
        label: '社会信用代码'
      }, {
        value: 'legalRepresentative',
        label: '法定代表人'
      }
      ],
      listQuery: {
        page: 1,
        limit: 5,
        mainModuleId: 1,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},

      table: false,
      dialog: false,
      loading: false,

      enterpriseName: '请点击左侧搜索按钮',
      legalRepresentative: '',
      filesList: null,
      downloadUrl: '',
      show: true,
      src: '',
      pdfTitle: '原文查看器',
      pdfVisible: false,
      loadedRatio: 0,
      page: 1,
      numPages: 0,
      rotate: 0,
      tableData: [{
        id: 1000000,
        createTime: '',
        name: '没有相关的附件信息',
        originalFileName: '',
        fileStatus: '',
        children: []
      }]
    }
  },

  created() {
    this.init()
    // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
  },
  methods: {
    init() {
      this.downloadUrl = getApiUrl() + '/file/download?idFile='
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      this.companys = this.$store.state.user.companys
      this.listQuery.ids = this.companys ? this.companys.toString() : ''
      getList(this.listQuery).then(response => {
        console.log('response', response)
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
        this.listQuery.enterpriseName = ''
        this.listQuery.unifiedSocialCreditCode = ''
        this.listQuery.legalRepresentative = ''
      })
    },
    search() {
      console.log(this.searchType === 'enterpriseName')
      if (this.searchType === 'enterpriseName') {
        this.listQuery.enterpriseName = this.keyword
      }
      if (this.searchType === 'unifiedSocialCreditCode') {
        this.listQuery.unifiedSocialCreditCode = this.keyword
      }
      if (this.searchType === 'legalRepresentative') {
        this.listQuery.legalRepresentative = this.keyword
      }
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
    viewArchitecture(row) {
      this.dialog = false
      this.enterpriseName = row.enterpriseName
      this.legalRepresentative = row.legalRepresentative
      const filesListQuery = {
        page: 1,
        limit: 10000,
        mainModuleId: row.id
      }
      getEnterpriseFiles(filesListQuery).then(response => {
        var fileData = []
        var businessLicenseObj = {} // 公司基本信息
        businessLicenseObj['id'] = 1000000
        businessLicenseObj['name'] = row.enterpriseName
        businessLicenseObj['originalFileName'] = ''
        businessLicenseObj['createTime'] = ''
        businessLicenseObj['fileStatus'] = ''
        businessLicenseObj['children'] = []
        const filesTypeArr = [
          { id: 1000001, name: '营业执照' },
          { id: 1000002, name: '核准文件' },
          { id: 1000003, name: '公司章程' },
          { id: 1000004, name: '股东决定' },
          { id: 1000005, name: '申请注册文件' },
          { id: 1000006, name: '其他文件' },
          { id: 1000007, name: '主要人员信息' },
          // { id: 1000008, name: "股东信息" },
          { id: 1000009, name: '印章信息' },
          { id: 1000010, name: '企业年报信息' },
          { id: 1000011, name: '股权及出资信息' }
        ]
        for (let i = 0; i < filesTypeArr.length; i++) {
          const obj = this.getFilesList(response.data.records, filesTypeArr[i].id, filesTypeArr[i].name)
          if (obj) {
            fileData.push(obj)
          }
        }

        this.filesList = (fileData && fileData.length > 0) ? fileData : this.tableData
      })
    },
    getFilesList(data, id, name) {
      if (data && data.length > 0) {
        var obj = {}
        obj['id'] = id
        obj['name'] = name
        obj['originalFileName'] = ''
        obj['createTime'] = ''
        obj['fileStatus'] = ''
        obj['children'] = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].sonModuleName === name) {
            var file = {}
            file['id'] = data[i].id
            file['name'] = ''
            file['originalFileName'] = data[i].originalFileName
            file['createTime'] = data[i].createTime
            file['fileStatus'] = data[i].fileStatus
            obj['children'].push(file)
          }
        }
        return obj
      }
    },
    password(updatePassword, reason) {
      updatePassword(prompt('password is "test"'))
    },
    error(err) {
      console.log(err)
    },

    // 格式化 登记状态
    formatterFileStatus(row) {
      if (row.fileStatus === '1') {
        return '正常'
      } else if (row.fileStatus === '0') {
        return '过期'
      } else {
        return ''
      }
    },

    download(id, fileName) {
      window.location.href =
        getApiUrl() + '/file/download?idFile=' + id + '&fileName=' + fileName
    },

    viewPdf(id, fileName) {
      this.pdfVisible = true
      this.src =
        getApiUrl() + '/file/download?idFile=' + id + '&fileName=' + fileName
    }
  }
}

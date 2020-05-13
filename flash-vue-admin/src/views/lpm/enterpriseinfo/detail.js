import ECharts from 'vue-echarts/components/ECharts'
import { getListIds } from '@/api/cms/fileInfo'
import { get as businesslicense } from '@/api/lpm/businesslicense'
// import { getList as businesslicense } from '@/api/lpm/businesslicense'
import { getList as mainmember } from '@/api/lpm/mainmember'
import { getList as seal } from '@/api/lpm/seal'
import { getList as annals } from '@/api/lpm/annals'
import { getList as capital } from '@/api/lpm/capital'
import { getList as administrativelicense } from '@/api/lpm/administrativelicense'
import { getList as administrativepunish } from '@/api/lpm/administrativepunish'
import { getList as certificatecancel } from '@/api/lpm/certificatecancel'
import { getList as liquidation } from '@/api/lpm/liquidation'
import { getList as branchcompany } from '@/api/lpm/branchcompany'
import { getList as investcompany } from '@/api/lpm/investcompany'
import { getList as propertypledge } from '@/api/lpm/propertypledge'
import { getList as stockpledge } from '@/api/lpm/stockpledge'
import { getList as knowledgepledge } from '@/api/lpm/knowledgepledge'
import { getList as trademark } from '@/api/lpm/trademark'

import { getList as dictList } from '@/api/system/dict'
import { getList as logList } from '@/api/system/log'

import { getList as getUserList } from '@/api/system/user'

import { showDictLabel } from '@/utils/common'
import { isPermissions } from '@/utils/common'
import FilesListComponent from '@/components/FilesList/index.vue'

import '@/assets/js/docxtemplater/docxtemplater.js'
import '@/assets/js/docxtemplater/jszip.js'
import '@/assets/js/docxtemplater/FileSaver.js'
import '@/assets/js/docxtemplater/jszip-utils.js'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { FilesListComponent, chart: ECharts },
  data() {
    return {
      id: '',
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'], // 展开的模块
      /* 营业执照模块 */
      businesslicenseData: {}, // 营业执照的相关信息
      enterpriseType: '', // 企业类型
      customTypeBL: '', // 自定义企业类型
      registrationTypeBL: '', // 企业注册类型
      registrationPlaceBL: '', // 企业注册地
      currencyBL: '', // 币种
      registrationStatusBL: '', // 登记状态
      businessLicenseListBL: [], // 营业执照的附件
      approvalFilesListBL: [], // 核准文件的附件
      companyArticlesAssociationListBL: [], // 股东决定的相关附件
      shareholdersDecideListBL: [], // 公司章程的相关附件
      applicationRegistrationFilesListBL: [], // 公司注册的附件
      otherFilesListBL: [], // 其他附件

      /* 主要人员信息模块 */
      mainmemberData: [], // 主要人员相关数据
      directorList: [], // 董事相关信息
      accessoryFilesListMainmember: [],

      /* 股东信息模块 */
      shareholderData: [], // 股东信息相关数据
      shareholderType: '', // 股东类型
      shareholderStatus: '', // 股东状态
      accessoryFilesListShareholder: [],

      /* 印章信息模块 */
      sealData: [], // 印章信息相关数据
      sealStatus: '', // 印章状态
      accessoryFilesListSeal: [],

      /* 企业年报信息模块 */
      annalsData: [], // 企业年报信息相关数据
      accessoryFilesListAnnals: [],

      /* 股权及出资信息模块 */
      capitalData: [], // 股权及出资信息相关数据
      subscribedCapitalTypeCapital: '', // 认缴出资方式
      realityCapitalTypeCapital: '', // 实缴出资方式
      accessoryFilesListCapital: [],

      /* 行政许可信息模块 */
      administrativelicenseData: [], // 行政许可信息相关数据
      licenseStatus: '', // 许可状态
      accessoryFilesListAdministrativelicense: [],

      /* 行政处罚信息模块 */
      administrativepunishData: [], // 行政处罚信息相关数据
      punishUnlawfulActType: '', // 违法行为类型
      accessoryFilesListAdministrativepunish: [],

      /* 证照废弃声明模块 */
      certificatecancelData: [], // 证照废弃声明相关数据
      transcriptStatus: '', // 是否正副本
      replaceStatus: '', // 是否补领
      accessoryFilesListCertificatecancel: [],

      /* 清算信息模块 */
      liquidationData: [], // 清算信息相关数据
      accessoryFilesListLiquidation: [],

      /* 分公司信息模块 */
      branchcompanyData: [], // 分公司信息相关数据
      accessoryFilesListBranchcompany: [],
      treeData: {
        title: {
          text: '分公司架构图'
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: false,
        series: [
          {
            name: '树图',
            type: 'tree',
            orient: 'horizontal', // vertical horizontal
            rootLocation: { x: '50%', y: '15%' }, // 根节点位置  {x: 'center',y: 10}
            nodePadding: 20,
            layerPadding: 40,
            symbol: 'emptyRect',
            borderColor: 'black',
            itemStyle: {
              normal: {
                color: '#fff', // 节点背景色
                label: {
                  show: true,
                  position: 'inside',
                  textStyle: {
                    color: 'black',
                    fontSize: 15
                    // fontWeight: 'bolder'
                  }
                },
                lineStyle: {
                  color: '#000',
                  width: 1,
                  type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                }
              },
              emphasis: {
                label: {
                  show: false
                }
              }
            },
            data: [

              {
                name: '雅居乐集团',
                value: 6,
                symbolSize: [140, 30],
                symbol: 'emptyRect',
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: 'black'
                  }
                },
                lineStyle: {
                  color: '#000',
                  width: 1,
                  type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                },
                children: [
                  {
                    name: '雅居乐控股集团',
                    value: 4,
                    symbolSize: [140, 30],
                    symbol: 'emptyRect',
                    itemStyle: {
                      normal: {
                        label: {
                          show: false,
                          position: 'inside'
                        }
                      },
                      borderWidth: 0,
                      borderColor: 'black'
                    },
                    lineStyle: {
                      color: '#000',
                      width: 1,
                      type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                    }
                  },
                  {
                    name: '雅居乐地产集团',
                    value: 4,
                    symbolSize: [140, 35],
                    symbol: 'emptyRect',
                    itemStyle: {
                      normal: {
                        label: {
                          show: false,
                          position: 'inside'
                        }
                      },
                      borderWidth: 0,
                      borderColor: 'black'
                    }
                  },
                  {
                    name: '教育集团',
                    value: 4,
                    symbolSize: [100, 35],
                    symbol: 'emptyRect',
                    itemStyle: {
                      normal: {
                        label: {
                          show: false,
                          position: 'inside'
                        }
                      },
                      borderWidth: 0,
                      borderColor: 'black'
                    }
                  },
                  {
                    name: '广州番禺雅居乐房地产开发有限公司',
                    value: 4,
                    symbolSize: [280, 35],
                    symbol: 'emptyRect',
                    itemStyle: {
                      normal: {
                        label: {
                          show: false,
                          position: 'inside'
                        }
                      },
                      borderWidth: 1,
                      borderColor: 'black'
                    }
                  },
                  {
                    name: '房管集团',
                    value: 4,
                    symbolSize: [100, 35],
                    symbol: 'emptyRect',
                    itemStyle: {
                      normal: {
                        label: {
                          show: false,
                          position: 'inside'
                        }
                      },
                      borderWidth: 0,
                      borderColor: 'black'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },

      /* 投资企业模块 */
      investcompanyData: [], // 投资相关数据
      accessoryFilesListInvestcompany: [],

      /* 动产抵押登记信息模块 */
      propertypledgeData: [], // 动产抵押登记信息相关数据
      propertyStatus: '', // 登记状态
      accessoryFilesListPropertypledge: [],

      /* 股权出质登记模块 */
      stockpledgeData: [], // 股权出质登记相关数据
      stockStatus: '', // 登记状态
      accessoryFilesListStockpledge: [],

      /* 知识产权出质登记模块 */
      knowledgepledgeData: [], // 知识产权出质登记相关数据
      propertyType: '', // 种类
      knowledgeStatus: '', // 登记状态
      accessoryFilesListKnowledgepledge: [],

      /* 商标信息模块 */
      trademarkData: [], // 商标信息相关数据
      trademarkType: '', // 类别
      accessoryFilesListTrademark: [],

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
      form: {},
      menuPermissions: []
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
    this.initPermission(this.$store.getters.permissions)
    this.init()
  },
  methods: {
    // 初始化功能权限
    initPermission(permissions) {
      this.permissions = permissions
    },
    // 判断功能权限
    hasMenu(url) {
      return isPermissions(this.permissions, url)
    },
    init() {
      // 获取企业的id
      const id = this.$route.query.id
      // 请求营业执照信息
      businesslicense(id).then(response => {
        this.businesslicenseData = response.data
        this.logTitle = '【 ' + response.data.enterpriseName + ' 】'
        var accessoryArr = ['businessLicense', 'approvalFiles',
          'companyArticlesAssociation', 'shareholdersDecide',
          'applicationRegistrationFiles', 'otherFiles']
        var arr = []
        arr.push(response.data)
        this.translateDict('企业类型', response.data.type, 'enterpriseType')
        this.translateDict('自定义企业类型', response.data.customType, 'customTypeBL')
        this.translateDict('企业注册类型', response.data.registrationType, 'registrationTypeBL')
        this.translateDict('企业注册地', response.data.registrationPlace, 'registrationPlaceBL')
        this.translateDict('币种', response.data.currency, 'currencyBL')
        this.translateDict('登记状态【营业执照】', response.data.registrationStatus, 'registrationStatusBL')
        this.getFilesList('BL', accessoryArr, arr)
      })
      // businesslicense({ id: id, page: 1, limit: 1 }).then(response => {
      //   this.businesslicenseData = response.data.records[0]
      //   var accessoryArr = ['businessLicense', 'approvalFiles',
      //     'companyArticlesAssociation', 'shareholdersDecide',
      //     'applicationRegistrationFiles', 'otherFiles']
      //   var arr = []
      //   // arr.push(response.data)
      //   arr = response.data.records[0]
      //   this.translateDict('企业类型', response.data.records[0].type, 'enterpriseType')
      //   this.translateDict('登记状态【营业执照】', response.data.records[0].registrationStatus, 'registrationStatusBL')
      //   this.getFilesList('BL', accessoryArr, arr)
      // })
      // 请求主要人员信息数据
      mainmember({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.mainmemberData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Mainmember', accessoryArr, response.data.records)
      })

      // 请求股东信息数据
      capital({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        var records = response.data.records
        // if (records && records.length > 0) {
        //   for (let i = 0; i < records.length; i++) {
        //     records[i].type = this.translateDict2('类型【股东信息】', records[i].type)
        //     records[i].status = this.translateDict2('状态【股东信息】', records[i].status)
        //   }
        // }
        // console.log(records)
        this.shareholderData = records
        // this.translateDict('类型【股东信息】', response.data.type, 'shareholderType')
        // this.translateDict('状态【股东信息】', response.data.status, 'shareholderStatus')
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Shareholder', accessoryArr, response.data.records)
      })

      // 印章信息数据
      seal({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.sealData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Seal', accessoryArr, response.data.records)
      })

      // 企业年报数据
      annals({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.annalsData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Annals', accessoryArr, response.data.records)
      })

      // 股权及出资信息数据
      capital({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.capitalData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Capital', accessoryArr, response.data.records)
      })

      // 行政许可信息数据
      administrativelicense({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.administrativelicenseData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Administrativelicense', accessoryArr, response.data.records)
      })

      // 行政处罚信息数据
      administrativepunish({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.administrativepunishData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Administrativepunish', accessoryArr, response.data.records)
      })

      // 证照废弃声明数据
      certificatecancel({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.certificatecancelData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Certificatecancel', accessoryArr, response.data.records)
      })

      /* 清算信息模块 */
      liquidation({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.liquidationData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Liquidation', accessoryArr, response.data.records)
      })

      /* 分公司信息模块 */
      branchcompany({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        console.log('enterpriseCode:', id)
        this.getCompanyList('branchcompany', response.data.records)
      })

      /* 投资企业模块 */
      investcompany({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.getCompanyList('investcompany', response.data.records)
      })

      /* 动产抵押登记信息模块 */
      propertypledge({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.propertypledgeData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Propertypledge', accessoryArr, response.data.records)
      })

      /* 股权出质登记模块 */
      stockpledge({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.stockpledgeData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Stockpledge', accessoryArr, response.data.records)
      })

      /* 知识产权出质登记模块 */
      knowledgepledge({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.knowledgepledgeData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Knowledgepledge', accessoryArr, response.data.records)
      })

      /* 商标信息模块 */
      trademark({ enterpriseCode: id, page: 1, limit: 20 }).then(response => {
        this.trademarkData = response.data.records
        var accessoryArr = ['accessoryFiles']
        this.getFilesList('Trademark', accessoryArr, response.data.records)
      })
    },

    // 获取公司列表
    getCompanyList(module, records) {
      const Module = module
      this[Module + 'Data'] = []
      for (let j = 0; j < records.length; j++) {
        const id = records[j].branchCompanyCode
        if (!id) {
          console.log('没有找到：' + Module + ' 相关的信息！')
        } else {
          businesslicense(id).then(response => {
            this[Module + 'Data'].push(response.data)
          })
        }
      }
    },

    detail(row) {
      this.$router.push({ path: '/lpm/detailEnterpriseinfo', query: { id: row.id }})
    },

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
    },

    translateDict(str, num, field) {
      dictList({ name: str }).then(response => {
        this[field] = showDictLabel(response.data[0].detail, num)
      })
    },
    // 格式化 类型【股东信息】
    formatterShareholderType(row, name) {
      dictList({ name: '类型【股东信息】' }).then(response => {
        this.shareholderType = response.data[0].detail
      })
      const res = showDictLabel(this.shareholderType, row.shareholderType)
      return res
    },
    // 格式化 状态【股东信息】
    formatterShareholderStatus(row) {
      dictList({ name: '状态【股东信息】' }).then(response => {
        this.shareholderStatus = response.data[0].detail
      })
      const res = showDictLabel(this.shareholderStatus, row.status)
      return res
    },
    // 格式化 状态【印章信息】
    formatterSealStatus(row) {
      dictList({ name: '状态【印章信息】' }).then(response => {
        this.sealStatus = response.data[0].detail
      })
      const res = showDictLabel(this.sealStatus, row.status)
      return res
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

    // 格式化 状态【行政许可信息】
    formatterLicenseStatus(row) {
      dictList({ name: '状态【行政许可信息】' }).then(response => {
        this.licenseStatus = response.data[0].detail
      })
      const res = showDictLabel(this.licenseStatus, row.status)
      return res
    },

    // 格式化 违法犯罪类型【行政处罚信息】
    formatterPunishType(row) {
      dictList({ name: '违法犯罪类型【行政处罚信息】' }).then(response => {
        this.punishUnlawfulActType = response.data[0].detail
      })
      const res = showDictLabel(this.punishUnlawfulActType, row.unlawfulActType)
      return res
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

    // 格式化 状态【动产抵押登记信息】
    formatterPropertyStatus(row) {
      dictList({ name: '状态【动产抵押登记信息】' }).then(response => {
        this.propertyStatus = response.data[0].detail
      })
      const res = showDictLabel(this.propertyStatus, row.status)
      return res
    },

    // 格式化 状态【股权出质登记信息】
    formatterStockStatus(row) {
      dictList({ name: '状态【股权出质登记信息】' }).then(response => {
        this.stockStatus = response.data[0].detail
      })
      const res = showDictLabel(this.stockStatus, row.status)
      return res
    },

    // 格式化 种类【知识产权出质登记信息】
    formatterPropertyType(row) {
      dictList({ name: '种类【知识产权出质登记信息】' }).then(response => {
        this.propertyType = response.data[0].detail
      })
      const res = showDictLabel(this.propertyType, row.propertyType)
      return res
    },
    // 格式化 状态【知识产权出质登记信息】
    formatterKnowledgeStatus(row) {
      dictList({ name: '状态【知识产权出质登记信息】' }).then(response => {
        this.knowledgeStatus = response.data[0].detail
      })
      const res = showDictLabel(this.knowledgeStatus, row.status)
      return res
    },

    // 格式化 类别【商标信息】
    formatterTrademarkType(row) {
      dictList({ name: '类别【商标信息】' }).then(response => {
        this.trademarkType = response.data[0].detail
      })
      const res = showDictLabel(this.trademarkType, row.trademarkType)
      return res
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

    back() {
      this.$router.go(-1)
    },
    hanglePreview(file) {
      this.$router.push({ path: '/lpm/enterpriseinfo/PDFView' })
    },
    editInfo(url, id) {
      this.$router.push({ path: url, query: { id: id }})
    },
    // 点击导出word
    exportWord: function(templateName, outputName) {
      const _this = this

      const mainmemberArr = [] // 主要人员信息
      const mainmemberData = _this.mainmemberData
      const userIdArr = []
      if (mainmemberData && mainmemberData.length > 0) {
        if (mainmemberData[0].chairmanId) {
          userIdArr.push(mainmemberData[0].chairmanId)
        }
        if (mainmemberData[0].directorId) {
          const directorId = mainmemberData[0].directorId.split('、')
          for (let i = 0; i < directorId.length; i++) {
            userIdArr.push(directorId[i])
          }
        }
        if (mainmemberData[0].generalManagerId) {
          userIdArr.push(mainmemberData[0].generalManagerId)
        }
        if (mainmemberData[0].supervisorId) {
          userIdArr.push(mainmemberData[0].supervisorId)
        }
      } else {
        alert('没有查询到相应的董事信息')
        return
      }

      for (let j = 0; j < userIdArr.length; j++) {
        getUserList({
          page: 1,
          limit: 1,
          id: userIdArr[j]
        }).then(response => {
          mainmemberArr.push(response.data.records[0])
          if (mainmemberArr.length === userIdArr.length) {
            console.log(mainmemberArr)
            const obj = {
              ..._this.businesslicenseData,
              mainmemberData: mainmemberArr
            }
            shareholderDoc(templateName, outputName, obj)
          }
        })
      }

      function shareholderDoc(templateName, outputName, obj) {
        const _url = window.location.origin + '/static/docx/' + templateName
        // 读取并获得模板文件的二进制内容
        JSZipUtils.getBinaryContent(_url, function(error, content) {
          // input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
          // 抛出异常
          if (error) {
            throw error
          }

          // 创建一个JSZip实例，内容为模板的内容
          const zip = new JSZip(content)
          // 创建并加载docxtemplater实例对象
          const doc = new window.docxtemplater().loadZip(zip)
          // 设置模板变量的值
          doc.setData(obj)

          try {
            // 用模板变量的值替换所有模板变量
            doc.render()
          } catch (error) {
            // 抛出异常
            const e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties
            }
            console.log(JSON.stringify({ error: e }))
            throw error
          }

          // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
          const out = doc.getZip().generate({
            type: 'blob',
            mimeType:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          })
          // 将目标文件对象保存为目标类型的文件，并命名
          saveAs(out, outputName)
        })
      }
    }
  }
}

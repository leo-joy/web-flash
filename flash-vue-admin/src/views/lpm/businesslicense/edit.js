import { Loading } from 'element-ui'
import pdf from 'vue-pdf'
import { list as deptList } from '@/api/system/dept'
import { getList as dictList } from '@/api/system/dict'
import { getDictList } from '@/utils/common'
import { get, save } from '@/api/lpm/businesslicense'
import { getListIds } from '@/api/cms/fileInfo'
import { parseTime } from '@/utils'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'

// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { pdf },
  data() {
    return {
      deptTree: {
        show: false,
        data: [],
        defaultProps: {
          id: 'id',
          label: 'simplename',
          children: 'children'
        }
      },
      typeList: [], // 企业类型，从数据字典中获取
      customTypeList: [], // 自定义企业类型，从数据字典中获取
      egistrationTypeList: [], // 企业注册类型，从数据字典中获取
      registrationPlaceList: [], // 企业注册地，从数据字典中获取
      currencyList: [], // 币种，从数据字典中获取
      registrationStatusList: [], // 登记状态，从数据字典中获取
      registrationTypeList: [], // 企业注册类型，从数据字典中获取
      companyTagOptions: [], // 企业标签，从数据字典中获取
      uploadUrl: '',
      uploadFileId: '',
      uploadHeaders: {
        'Authorization': ''
      },
      formVisible: false,
      formTitle: '添加营业执照',
      isAdd: true,
      form: {
        unifiedSocialCreditCode: '',
        enterpriseName: '',
        enterpriseNameEn: '',
        enterpriseNameBusiness: '',
        enterpriseCode: '',
        type: '',
        customType: '',
        registrationType: '',
        registrationPlace: '',
        legalRepresentative: '',
        registeredCapital: 0,
        currency: '',
        setupDate: '',
        achieveDate: '',
        operatingPeriodFrom: '',
        operatingPeriodEnd: '',
        registrationAuthority: '',
        approvalDate: '',
        registrationStatus: '',
        registeredAddress: '',
        businessAddress: '',
        tags: '',
        remark: '',
        businessScope: '',
        businessLicense: '',
        approvalFiles: '',
        companyArticlesAssociation: '',
        shareholdersDecide: '',
        applicationRegistrationFiles: '',
        otherFiles: '',
        id: ''
      },
      rules: {
        // pName: [
        //   { required: true, message: '请选中组织属性', trigger: 'blur' }
        // ],
        enterpriseName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        registrationPlace: [
          { required: true, message: '请选择企业注册地', trigger: 'blur' }
        ],
        registeredCapital: [
          { required: true, message: '请输入注册资本金额', trigger: 'blur' },
          { type: 'number', message: '只能输入是数值', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '请选择币种', trigger: 'blur' }
        ],
        registrationType: [
          { required: true, message: '请选择企业注册类型', trigger: 'blur' }
        ]
      },
      listQuery: {
        page: 1,
        limit: 20,
        ids: ''
      },
      businessLicenseList: [],
      approvalFilesList: [],
      companyArticlesAssociationList: [],
      shareholdersDecideList: [],
      applicationRegistrationFilesList: [],
      otherFilesList: [],
      provinces: [
        {
          'label': '北京市',
          'level': '1',
          'value': '1100',
          'children': [
            {
              'label': '北京市',
              'level': '1',
              'value': '1100'
            }
          ]
        },
        {
          'label': '天津市',
          'level': '1',
          'value': '1200',
          'children': [
            {
              'label': '天津市',
              'level': '1',
              'value': '1200'
            }
          ]
        },
        {
          'label': '河北省',
          'level': '1',
          'value': '1300',
          'children': [
            {
              'label': '石家庄市',
              'level': '2',
              'value': '1301'
            },
            {
              'label': '唐山市',
              'level': '3',
              'value': '1302'
            },
            {
              'label': '秦皇岛市',
              'level': '3',
              'value': '1303'
            },
            {
              'label': '邯郸市',
              'level': '3',
              'value': '1304'
            },
            {
              'label': '邢台市',
              'level': '3',
              'value': '1305'
            },
            {
              'label': '保定市',
              'level': '3',
              'value': '1306'
            },
            {
              'label': '张家口市',
              'level': '3',
              'value': '1307'
            },
            {
              'label': '承德市',
              'level': '3',
              'value': '1308'
            },
            {
              'label': '沧州市',
              'level': '3',
              'value': '1309'
            },
            {
              'label': '廊坊市',
              'level': '3',
              'value': '1310'
            },
            {
              'label': '衡水市',
              'level': '3',
              'value': '1311'
            }
          ]
        },
        {
          'label': '山西省',
          'level': '1',
          'value': '1400',
          'children': [
            {
              'label': '太原市',
              'level': '2',
              'value': '1401'
            },
            {
              'label': '大同市',
              'level': '3',
              'value': '1402'
            },
            {
              'label': '阳泉市',
              'level': '3',
              'value': '1403'
            },
            {
              'label': '长治市',
              'level': '3',
              'value': '1404'
            },
            {
              'label': '晋城市',
              'level': '3',
              'value': '1405'
            },
            {
              'label': '朔州市',
              'level': '3',
              'value': '1406'
            },
            {
              'label': '晋中市',
              'level': '3',
              'value': '1407'
            },
            {
              'label': '运城市',
              'level': '3',
              'value': '1408'
            },
            {
              'label': '忻州市',
              'level': '3',
              'value': '1409'
            },
            {
              'label': '临汾市',
              'level': '3',
              'value': '1410'
            },
            {
              'label': '吕梁市',
              'level': '3',
              'value': '1411'
            }
          ]
        },
        {
          'label': '内蒙古自治区',
          'level': '1',
          'value': '1500',
          'children': [
            {
              'label': '呼和浩特市',
              'level': '2',
              'value': '1501'
            },
            {
              'label': '包头市',
              'level': '3',
              'value': '1502'
            },
            {
              'label': '乌海市',
              'level': '3',
              'value': '1503'
            },
            {
              'label': '赤峰市',
              'level': '3',
              'value': '1504'
            },
            {
              'label': '通辽市',
              'level': '3',
              'value': '1505'
            },
            {
              'label': '鄂尔多斯市',
              'level': '3',
              'value': '1506'
            },
            {
              'label': '呼伦贝尔市',
              'level': '3',
              'value': '1507'
            },
            {
              'label': '巴彦淖尔市',
              'level': '3',
              'value': '1508'
            },
            {
              'label': '乌兰察布市',
              'level': '3',
              'value': '1509'
            },
            {
              'label': '兴安盟',
              'level': '3',
              'value': '1522'
            },
            {
              'label': '锡林郭勒盟',
              'level': '3',
              'value': '1525'
            },
            {
              'label': '阿拉善盟',
              'level': '3',
              'value': '1529'
            }
          ]
        },
        {
          'label': '辽宁省',
          'level': '1',
          'value': '2100',
          'children': [
            {
              'label': '沈阳市',
              'level': '2',
              'value': '2101'
            },
            {
              'label': '大连市',
              'level': '3',
              'value': '2102'
            },
            {
              'label': '鞍山市',
              'level': '3',
              'value': '2103'
            },
            {
              'label': '抚顺市',
              'level': '3',
              'value': '2104'
            },
            {
              'label': '本溪市',
              'level': '3',
              'value': '2105'
            },
            {
              'label': '丹东市',
              'level': '3',
              'value': '2106'
            },
            {
              'label': '锦州市',
              'level': '3',
              'value': '2107'
            },
            {
              'label': '营口市',
              'level': '3',
              'value': '2108'
            },
            {
              'label': '阜新市',
              'level': '3',
              'value': '2109'
            },
            {
              'label': '辽阳市',
              'level': '3',
              'value': '2110'
            },
            {
              'label': '盘锦市',
              'level': '3',
              'value': '2111'
            },
            {
              'label': '铁岭市',
              'level': '3',
              'value': '2112'
            },
            {
              'label': '朝阳市',
              'level': '3',
              'value': '2113'
            },
            {
              'label': '葫芦岛市',
              'level': '3',
              'value': '2114'
            }
          ]
        },
        {
          'label': '吉林省',
          'level': '1',
          'value': '2200',
          'children': [
            {
              'label': '长春市',
              'level': '2',
              'value': '2201'
            },
            {
              'label': '吉林市',
              'level': '3',
              'value': '2202'
            },
            {
              'label': '四平市',
              'level': '3',
              'value': '2203'
            },
            {
              'label': '辽源市',
              'level': '3',
              'value': '2204'
            },
            {
              'label': '通化市',
              'level': '3',
              'value': '2205'
            },
            {
              'label': '白山市',
              'level': '3',
              'value': '2206'
            },
            {
              'label': '松原市',
              'level': '3',
              'value': '2207'
            },
            {
              'label': '白城市',
              'level': '3',
              'value': '2208'
            },
            {
              'label': '延边朝鲜族自治州',
              'level': '3',
              'value': '2224'
            }
          ]
        },
        {
          'label': '黑龙江省',
          'level': '1',
          'value': '2300',
          'children': [
            {
              'label': '哈尔滨市',
              'level': '2',
              'value': '2301'
            },
            {
              'label': '齐齐哈尔市',
              'level': '3',
              'value': '2302'
            },
            {
              'label': '鸡西市',
              'level': '3',
              'value': '2303'
            },
            {
              'label': '鹤岗市',
              'level': '3',
              'value': '2304'
            },
            {
              'label': '双鸭山市',
              'level': '3',
              'value': '2305'
            },
            {
              'label': '大庆市',
              'level': '3',
              'value': '2306'
            },
            {
              'label': '伊春市',
              'level': '3',
              'value': '2307'
            },
            {
              'label': '佳木斯市',
              'level': '3',
              'value': '2308'
            },
            {
              'label': '七台河市',
              'level': '3',
              'value': '2309'
            },
            {
              'label': '牡丹江市',
              'level': '3',
              'value': '2310'
            },
            {
              'label': '黑河市',
              'level': '3',
              'value': '2311'
            },
            {
              'label': '绥化市',
              'level': '3',
              'value': '2312'
            },
            {
              'label': '大兴安岭地区',
              'level': '3',
              'value': '2327'
            }
          ]
        },
        {
          'label': '上海市',
          'level': '1',
          'value': '3100',
          'children': [
            {
              'label': '上海市',
              'level': '1',
              'value': '3100'
            }
          ]
        },
        {
          'label': '江苏省',
          'level': '1',
          'value': '3200',
          'children': [
            {
              'label': '南京市',
              'level': '2',
              'value': '3201'
            },
            {
              'label': '无锡市',
              'level': '3',
              'value': '3202'
            },
            {
              'label': '徐州市',
              'level': '3',
              'value': '3203'
            },
            {
              'label': '常州市',
              'level': '3',
              'value': '3204'
            },
            {
              'label': '苏州市',
              'level': '3',
              'value': '3205'
            },
            {
              'label': '南通市',
              'level': '3',
              'value': '3206'
            },
            {
              'label': '连云港市',
              'level': '3',
              'value': '3207'
            },
            {
              'label': '淮安市',
              'level': '3',
              'value': '3208'
            },
            {
              'label': '盐城市',
              'level': '3',
              'value': '3209'
            },
            {
              'label': '扬州市',
              'level': '3',
              'value': '3210'
            },
            {
              'label': '镇江市',
              'level': '3',
              'value': '3211'
            },
            {
              'label': '泰州市',
              'level': '3',
              'value': '3212'
            },
            {
              'label': '宿迁市',
              'level': '3',
              'value': '3213'
            }
          ]
        },
        {
          'label': '浙江省',
          'level': '1',
          'value': '3300',
          'children': [
            {
              'label': '杭州市',
              'level': '2',
              'value': '3301'
            },
            {
              'label': '宁波市',
              'level': '3',
              'value': '3302'
            },
            {
              'label': '温州市',
              'level': '3',
              'value': '3303'
            },
            {
              'label': '嘉兴市',
              'level': '3',
              'value': '3304'
            },
            {
              'label': '湖州市',
              'level': '3',
              'value': '3305'
            },
            {
              'label': '绍兴市',
              'level': '3',
              'value': '3306'
            },
            {
              'label': '金华市',
              'level': '3',
              'value': '3307'
            },
            {
              'label': '衢州市',
              'level': '3',
              'value': '3308'
            },
            {
              'label': '舟山市',
              'level': '3',
              'value': '3309'
            },
            {
              'label': '台州市',
              'level': '3',
              'value': '3310'
            },
            {
              'label': '丽水市',
              'level': '3',
              'value': '3311'
            }
          ]
        },
        {
          'label': '安徽省',
          'level': '1',
          'value': '3400',
          'children': [
            {
              'label': '合肥市',
              'level': '2',
              'value': '3401'
            },
            {
              'label': '芜湖市',
              'level': '3',
              'value': '3402'
            },
            {
              'label': '蚌埠市',
              'level': '3',
              'value': '3403'
            },
            {
              'label': '淮南市',
              'level': '3',
              'value': '3404'
            },
            {
              'label': '马鞍山市',
              'level': '3',
              'value': '3405'
            },
            {
              'label': '淮北市',
              'level': '3',
              'value': '3406'
            },
            {
              'label': '铜陵市',
              'level': '3',
              'value': '3407'
            },
            {
              'label': '安庆市',
              'level': '3',
              'value': '3408'
            },
            {
              'label': '黄山市',
              'level': '3',
              'value': '3410'
            },
            {
              'label': '滁州市',
              'level': '3',
              'value': '3411'
            },
            {
              'label': '阜阳市',
              'level': '3',
              'value': '3412'
            },
            {
              'label': '宿州市',
              'level': '3',
              'value': '3413'
            },
            {
              'label': '巢湖市',
              'level': '3',
              'value': '3414'
            },
            {
              'label': '六安市',
              'level': '3',
              'value': '3415'
            },
            {
              'label': '亳州市',
              'level': '3',
              'value': '3416'
            },
            {
              'label': '池州市',
              'level': '3',
              'value': '3417'
            },
            {
              'label': '宣城市',
              'level': '3',
              'value': '3418'
            }
          ]
        },
        {
          'label': '福建省',
          'level': '1',
          'value': '3500',
          'children': [
            {
              'label': '福州市',
              'level': '2',
              'value': '3501'
            },
            {
              'label': '厦门市',
              'level': '3',
              'value': '3502'
            },
            {
              'label': '莆田市',
              'level': '3',
              'value': '3503'
            },
            {
              'label': '三明市',
              'level': '3',
              'value': '3504'
            },
            {
              'label': '泉州市',
              'level': '3',
              'value': '3505'
            },
            {
              'label': '漳州市',
              'level': '3',
              'value': '3506'
            },
            {
              'label': '南平市',
              'level': '3',
              'value': '3507'
            },
            {
              'label': '龙岩市',
              'level': '3',
              'value': '3508'
            },
            {
              'label': '宁德市',
              'level': '3',
              'value': '3509'
            }
          ]
        },
        {
          'label': '江西省',
          'level': '1',
          'value': '3600',
          'children': [
            {
              'label': '南昌市',
              'level': '2',
              'value': '3601'
            },
            {
              'label': '景德镇市',
              'level': '3',
              'value': '3602'
            },
            {
              'label': '萍乡市',
              'level': '3',
              'value': '3603'
            },
            {
              'label': '九江市',
              'level': '3',
              'value': '3604'
            },
            {
              'label': '新余市',
              'level': '3',
              'value': '3605'
            },
            {
              'label': '鹰潭市',
              'level': '3',
              'value': '3606'
            },
            {
              'label': '赣州市',
              'level': '3',
              'value': '3607'
            },
            {
              'label': '吉安市',
              'level': '3',
              'value': '3608'
            },
            {
              'label': '宜春市',
              'level': '3',
              'value': '3609'
            },
            {
              'label': '抚州市',
              'level': '3',
              'value': '3610'
            },
            {
              'label': '上饶市',
              'level': '3',
              'value': '3611'
            }
          ]
        },
        {
          'label': '山东省',
          'level': '1',
          'value': '3700',
          'children': [
            {
              'label': '济南市',
              'level': '2',
              'value': '3701'
            },
            {
              'label': '青岛市',
              'level': '3',
              'value': '3702'
            },
            {
              'label': '淄博市',
              'level': '3',
              'value': '3703'
            },
            {
              'label': '枣庄市',
              'level': '3',
              'value': '3704'
            },
            {
              'label': '东营市',
              'level': '3',
              'value': '3705'
            },
            {
              'label': '烟台市',
              'level': '3',
              'value': '3706'
            },
            {
              'label': '潍坊市',
              'level': '3',
              'value': '3707'
            },
            {
              'label': '济宁市',
              'level': '3',
              'value': '3708'
            },
            {
              'label': '泰安市',
              'level': '3',
              'value': '3709'
            },
            {
              'label': '威海市',
              'level': '3',
              'value': '3710'
            },
            {
              'label': '日照市',
              'level': '3',
              'value': '3711'
            },
            {
              'label': '莱芜市',
              'level': '3',
              'value': '3712'
            },
            {
              'label': '临沂市',
              'level': '3',
              'value': '3713'
            },
            {
              'label': '德州市',
              'level': '3',
              'value': '3714'
            },
            {
              'label': '聊城市',
              'level': '3',
              'value': '3715'
            },
            {
              'label': '滨州市',
              'level': '3',
              'value': '3716'
            },
            {
              'label': '菏泽市',
              'level': '3',
              'value': '3717'
            }
          ]
        },
        {
          'label': '河南省',
          'level': '1',
          'value': '4100',
          'children': [
            {
              'label': '郑州市',
              'level': '2',
              'value': '4101'
            },
            {
              'label': '开封市',
              'level': '3',
              'value': '4102'
            },
            {
              'label': '洛阳市',
              'level': '3',
              'value': '4103'
            },
            {
              'label': '平顶山市',
              'level': '3',
              'value': '4104'
            },
            {
              'label': '安阳市',
              'level': '3',
              'value': '4105'
            },
            {
              'label': '鹤壁市',
              'level': '3',
              'value': '4106'
            },
            {
              'label': '新乡市',
              'level': '3',
              'value': '4107'
            },
            {
              'label': '焦作市',
              'level': '3',
              'value': '4108'
            },
            {
              'label': '濮阳市',
              'level': '3',
              'value': '4109'
            },
            {
              'label': '许昌市',
              'level': '3',
              'value': '4110'
            },
            {
              'label': '漯河市',
              'level': '3',
              'value': '4111'
            },
            {
              'label': '三门峡市',
              'level': '3',
              'value': '4112'
            },
            {
              'label': '南阳市',
              'level': '3',
              'value': '4113'
            },
            {
              'label': '商丘市',
              'level': '3',
              'value': '4114'
            },
            {
              'label': '信阳市',
              'level': '3',
              'value': '4115'
            },
            {
              'label': '周口市',
              'level': '3',
              'value': '4116'
            },
            {
              'label': '驻马店市',
              'level': '3',
              'value': '4117'
            }
          ]
        },
        {
          'label': '湖北省',
          'level': '1',
          'value': '4200',
          'children': [
            {
              'label': '武汉市',
              'level': '2',
              'value': '4201'
            },
            {
              'label': '黄石市',
              'level': '3',
              'value': '4202'
            },
            {
              'label': '十堰市',
              'level': '3',
              'value': '4203'
            },
            {
              'label': '宜昌市',
              'level': '3',
              'value': '4205'
            },
            {
              'label': '襄樊市',
              'level': '3',
              'value': '4206'
            },
            {
              'label': '鄂州市',
              'level': '3',
              'value': '4207'
            },
            {
              'label': '荆门市',
              'level': '3',
              'value': '4208'
            },
            {
              'label': '孝感市',
              'level': '3',
              'value': '4209'
            },
            {
              'label': '荆州市',
              'level': '3',
              'value': '4210'
            },
            {
              'label': '黄冈市',
              'level': '3',
              'value': '4211'
            },
            {
              'label': '咸宁市',
              'level': '3',
              'value': '4212'
            },
            {
              'label': '随州市',
              'level': '3',
              'value': '4213'
            },
            {
              'label': '恩施土家族苗族自治州',
              'level': '3',
              'value': '4228'
            }
          ]
        },
        {
          'label': '湖南省',
          'level': '1',
          'value': '4300',
          'children': [
            {
              'label': '长沙市',
              'level': '2',
              'value': '4301'
            },
            {
              'label': '株洲市',
              'level': '3',
              'value': '4302'
            },
            {
              'label': '湘潭市',
              'level': '3',
              'value': '4303'
            },
            {
              'label': '衡阳市',
              'level': '3',
              'value': '4304'
            },
            {
              'label': '邵阳市',
              'level': '3',
              'value': '4305'
            },
            {
              'label': '岳阳市',
              'level': '3',
              'value': '4306'
            },
            {
              'label': '常德市',
              'level': '3',
              'value': '4307'
            },
            {
              'label': '张家界市',
              'level': '3',
              'value': '4308'
            },
            {
              'label': '益阳市',
              'level': '3',
              'value': '4309'
            },
            {
              'label': '郴州市',
              'level': '3',
              'value': '4310'
            },
            {
              'label': '永州市',
              'level': '3',
              'value': '4311'
            },
            {
              'label': '怀化市',
              'level': '3',
              'value': '4312'
            },
            {
              'label': '娄底市',
              'level': '3',
              'value': '4313'
            },
            {
              'label': '湘西土家族苗族自治州',
              'level': '3',
              'value': '4331'
            }
          ]
        },
        {
          'label': '广东省',
          'level': '1',
          'value': '4400',
          'children': [
            {
              'label': '广州市',
              'level': '2',
              'value': '4401'
            },
            {
              'label': '韶关市',
              'level': '3',
              'value': '4402'
            },
            {
              'label': '深圳市',
              'level': '3',
              'value': '4403'
            },
            {
              'label': '珠海市',
              'level': '3',
              'value': '4404'
            },
            {
              'label': '汕头市',
              'level': '3',
              'value': '4405'
            },
            {
              'label': '佛山市',
              'level': '3',
              'value': '4406'
            },
            {
              'label': '江门市',
              'level': '3',
              'value': '4407'
            },
            {
              'label': '湛江市',
              'level': '3',
              'value': '4408'
            },
            {
              'label': '茂名市',
              'level': '3',
              'value': '4409'
            },
            {
              'label': '肇庆市',
              'level': '3',
              'value': '4412'
            },
            {
              'label': '惠州市',
              'level': '3',
              'value': '4413'
            },
            {
              'label': '梅州市',
              'level': '3',
              'value': '4414'
            },
            {
              'label': '汕尾市',
              'level': '3',
              'value': '4415'
            },
            {
              'label': '河源市',
              'level': '3',
              'value': '4416'
            },
            {
              'label': '阳江市',
              'level': '3',
              'value': '4417'
            },
            {
              'label': '清远市',
              'level': '3',
              'value': '4418'
            },
            {
              'label': '东莞市',
              'level': '3',
              'value': '4419'
            },
            {
              'label': '中山市',
              'level': '3',
              'value': '4420'
            },
            {
              'label': '潮州市',
              'level': '3',
              'value': '4451'
            },
            {
              'label': '揭阳市',
              'level': '3',
              'value': '4452'
            },
            {
              'label': '云浮市',
              'level': '3',
              'value': '4453'
            }
          ]
        },
        {
          'label': '广西壮族自治区',
          'level': '1',
          'value': '4500',
          'children': [
            {
              'label': '南宁市',
              'level': '2',
              'value': '4501'
            },
            {
              'label': '柳州市',
              'level': '3',
              'value': '4502'
            },
            {
              'label': '桂林市',
              'level': '3',
              'value': '4503'
            },
            {
              'label': '梧州市',
              'level': '3',
              'value': '4504'
            },
            {
              'label': '北海市',
              'level': '3',
              'value': '4505'
            },
            {
              'label': '防城港市',
              'level': '3',
              'value': '4506'
            },
            {
              'label': '钦州市',
              'level': '3',
              'value': '4507'
            },
            {
              'label': '贵港市',
              'level': '3',
              'value': '4508'
            },
            {
              'label': '玉林市',
              'level': '3',
              'value': '4509'
            },
            {
              'label': '百色市',
              'level': '3',
              'value': '4510'
            },
            {
              'label': '贺州市',
              'level': '3',
              'value': '4511'
            },
            {
              'label': '河池市',
              'level': '3',
              'value': '4512'
            },
            {
              'label': '来宾市',
              'level': '3',
              'value': '4513'
            },
            {
              'label': '崇左市',
              'level': '3',
              'value': '4514'
            }
          ]
        },
        {
          'label': '海南省',
          'level': '1',
          'value': '4600',
          'children': [
            {
              'label': '海口市',
              'level': '2',
              'value': '4601'
            },
            {
              'label': '三亚市',
              'level': '3',
              'value': '4602'
            }
          ]
        },
        {
          'label': '重庆市',
          'level': '1',
          'value': '5000',
          'children': [
            {
              'label': '重庆市',
              'level': '1',
              'value': '5000'
            }
          ]
        },
        {
          'label': '四川省',
          'level': '1',
          'value': '5100',
          'children': [
            {
              'label': '成都市',
              'level': '2',
              'value': '5101'
            },
            {
              'label': '自贡市',
              'level': '3',
              'value': '5103'
            },
            {
              'label': '攀枝花市',
              'level': '3',
              'value': '5104'
            },
            {
              'label': '泸州市',
              'level': '3',
              'value': '5105'
            },
            {
              'label': '德阳市',
              'level': '3',
              'value': '5106'
            },
            {
              'label': '绵阳市',
              'level': '3',
              'value': '5107'
            },
            {
              'label': '广元市',
              'level': '3',
              'value': '5108'
            },
            {
              'label': '遂宁市',
              'level': '3',
              'value': '5109'
            },
            {
              'label': '内江市',
              'level': '3',
              'value': '5110'
            },
            {
              'label': '乐山市',
              'level': '3',
              'value': '5111'
            },
            {
              'label': '南充市',
              'level': '3',
              'value': '5113'
            },
            {
              'label': '眉山市',
              'level': '3',
              'value': '5114'
            },
            {
              'label': '宜宾市',
              'level': '3',
              'value': '5115'
            },
            {
              'label': '广安市',
              'level': '3',
              'value': '5116'
            },
            {
              'label': '达州市',
              'level': '3',
              'value': '5117'
            },
            {
              'label': '雅安市',
              'level': '3',
              'value': '5118'
            },
            {
              'label': '巴中市',
              'level': '3',
              'value': '5119'
            },
            {
              'label': '资阳市',
              'level': '3',
              'value': '5120'
            },
            {
              'label': '阿坝藏族羌族自治州',
              'level': '3',
              'value': '5132'
            },
            {
              'label': '甘孜藏族自治州',
              'level': '3',
              'value': '5133'
            },
            {
              'label': '凉山彝族自治州',
              'level': '3',
              'value': '5134'
            }
          ]
        },
        {
          'label': '贵州省',
          'level': '1',
          'value': '5200',
          'children': [
            {
              'label': '贵阳市',
              'level': '2',
              'value': '5201'
            },
            {
              'label': '六盘水市',
              'level': '3',
              'value': '5202'
            },
            {
              'label': '遵义市',
              'level': '3',
              'value': '5203'
            },
            {
              'label': '安顺市',
              'level': '3',
              'value': '5204'
            },
            {
              'label': '铜仁地区',
              'level': '3',
              'value': '5222'
            },
            {
              'label': '黔西南布依族苗族自治州',
              'level': '3',
              'value': '5223'
            },
            {
              'label': '毕节地区',
              'level': '3',
              'value': '5224'
            },
            {
              'label': '黔东南苗族侗族自治州',
              'level': '3',
              'value': '5226'
            },
            {
              'label': '黔南布依族苗族自治州',
              'level': '3',
              'value': '5227'
            }
          ]
        },
        {
          'label': '云南省',
          'level': '1',
          'value': '5300',
          'children': [
            {
              'label': '昆明市',
              'level': '2',
              'value': '5301'
            },
            {
              'label': '曲靖市',
              'level': '3',
              'value': '5303'
            },
            {
              'label': '玉溪市',
              'level': '3',
              'value': '5304'
            },
            {
              'label': '保山市',
              'level': '3',
              'value': '5305'
            },
            {
              'label': '昭通市',
              'level': '3',
              'value': '5306'
            },
            {
              'label': '丽江市',
              'level': '3',
              'value': '5307'
            },
            {
              'label': '普洱市',
              'level': '3',
              'value': '5308'
            },
            {
              'label': '临沧市',
              'level': '3',
              'value': '5309'
            },
            {
              'label': '楚雄彝族自治州',
              'level': '3',
              'value': '5323'
            },
            {
              'label': '红河哈尼族彝族自治州',
              'level': '3',
              'value': '5325'
            },
            {
              'label': '文山壮族苗族自治州',
              'level': '3',
              'value': '5326'
            },
            {
              'label': '西双版纳傣族自治州',
              'level': '3',
              'value': '5328'
            },
            {
              'label': '大理白族自治州',
              'level': '3',
              'value': '5329'
            },
            {
              'label': '德宏傣族景颇族自治州',
              'level': '3',
              'value': '5331'
            },
            {
              'label': '怒江傈僳族自治州',
              'level': '3',
              'value': '5333'
            },
            {
              'label': '迪庆藏族自治州',
              'level': '3',
              'value': '5334'
            }
          ]
        },
        {
          'label': '西藏自治区',
          'level': '1',
          'value': '5400',
          'children': [
            {
              'label': '拉萨市',
              'level': '2',
              'value': '5401'
            },
            {
              'label': '昌都地区',
              'level': '3',
              'value': '5421'
            },
            {
              'label': '山南地区',
              'level': '3',
              'value': '5422'
            },
            {
              'label': '日喀则地区',
              'level': '3',
              'value': '5423'
            },
            {
              'label': '那曲地区',
              'level': '3',
              'value': '5424'
            },
            {
              'label': '阿里地区',
              'level': '3',
              'value': '5425'
            },
            {
              'label': '林芝地区',
              'level': '3',
              'value': '5426'
            }
          ]
        },
        {
          'label': '陕西省',
          'level': '1',
          'value': '6100',
          'children': [
            {
              'label': '西安市',
              'level': '2',
              'value': '6101'
            },
            {
              'label': '铜川市',
              'level': '3',
              'value': '6102'
            },
            {
              'label': '宝鸡市',
              'level': '3',
              'value': '6103'
            },
            {
              'label': '咸阳市',
              'level': '3',
              'value': '6104'
            },
            {
              'label': '渭南市',
              'level': '3',
              'value': '6105'
            },
            {
              'label': '延安市',
              'level': '3',
              'value': '6106'
            },
            {
              'label': '汉中市',
              'level': '3',
              'value': '6107'
            },
            {
              'label': '榆林市',
              'level': '3',
              'value': '6108'
            },
            {
              'label': '安康市',
              'level': '3',
              'value': '6109'
            },
            {
              'label': '商洛市',
              'level': '3',
              'value': '6110'
            }
          ]
        },
        {
          'label': '甘肃省',
          'level': '1',
          'value': '6200',
          'children': [
            {
              'label': '兰州市',
              'level': '2',
              'value': '6201'
            },
            {
              'label': '嘉峪关市',
              'level': '3',
              'value': '6202'
            },
            {
              'label': '金昌市',
              'level': '3',
              'value': '6203'
            },
            {
              'label': '白银市',
              'level': '3',
              'value': '6204'
            },
            {
              'label': '天水市',
              'level': '3',
              'value': '6205'
            },
            {
              'label': '武威市',
              'level': '3',
              'value': '6206'
            },
            {
              'label': '张掖市',
              'level': '3',
              'value': '6207'
            },
            {
              'label': '平凉市',
              'level': '3',
              'value': '6208'
            },
            {
              'label': '酒泉市',
              'level': '3',
              'value': '6209'
            },
            {
              'label': '庆阳市',
              'level': '3',
              'value': '6210'
            },
            {
              'label': '定西市',
              'level': '3',
              'value': '6211'
            },
            {
              'label': '陇南市',
              'level': '3',
              'value': '6212'
            },
            {
              'label': '临夏回族自治州',
              'level': '3',
              'value': '6229'
            },
            {
              'label': '甘南藏族自治州',
              'level': '3',
              'value': '6230'
            }
          ]
        },
        {
          'label': '青海省',
          'level': '1',
          'value': '6300',
          'children': [
            {
              'label': '西宁市',
              'level': '2',
              'value': '6301'
            },
            {
              'label': '海东地区',
              'level': '3',
              'value': '6321'
            },
            {
              'label': '海北藏族自治州',
              'level': '3',
              'value': '6322'
            },
            {
              'label': '黄南藏族自治州',
              'level': '3',
              'value': '6323'
            },
            {
              'label': '海南藏族自治州',
              'level': '3',
              'value': '6325'
            },
            {
              'label': '果洛藏族自治州',
              'level': '3',
              'value': '6326'
            },
            {
              'label': '玉树藏族自治州',
              'level': '3',
              'value': '6327'
            },
            {
              'label': '海西蒙古族藏族自治州',
              'level': '3',
              'value': '6328'
            }
          ]
        },
        {
          'label': '宁夏回族自治区',
          'level': '1',
          'value': '6400',
          'children': [
            {
              'label': '银川市',
              'level': '2',
              'value': '6401'
            },
            {
              'label': '石嘴山市',
              'level': '3',
              'value': '6402'
            },
            {
              'label': '吴忠市',
              'level': '3',
              'value': '6403'
            },
            {
              'label': '固原市',
              'level': '3',
              'value': '6404'
            },
            {
              'label': '中卫市',
              'level': '3',
              'value': '6405'
            }
          ]
        },
        {
          'label': '新疆维吾尔自治区',
          'level': '1',
          'value': '6500',
          'children': [
            {
              'label': '乌鲁木齐市',
              'level': '2',
              'value': '6501'
            },
            {
              'label': '克拉玛依市',
              'level': '3',
              'value': '6502'
            },
            {
              'label': '吐鲁番地区',
              'level': '3',
              'value': '6521'
            },
            {
              'label': '哈密地区',
              'level': '3',
              'value': '6522'
            },
            {
              'label': '昌吉回族自治州',
              'level': '3',
              'value': '6523'
            },
            {
              'label': '博尔塔拉蒙古自治州',
              'level': '3',
              'value': '6527'
            },
            {
              'label': '巴音郭楞蒙古自治州',
              'level': '3',
              'value': '6528'
            },
            {
              'label': '阿克苏地区',
              'level': '3',
              'value': '6529'
            },
            {
              'label': '克孜勒苏柯尔克孜自治州',
              'level': '3',
              'value': '6530'
            },
            {
              'label': '喀什地区',
              'level': '3',
              'value': '6531'
            },
            {
              'label': '和田地区',
              'level': '3',
              'value': '6532'
            },
            {
              'label': '伊犁哈萨克自治州',
              'level': '3',
              'value': '6540'
            },
            {
              'label': '塔城地区',
              'level': '3',
              'value': '6542'
            },
            {
              'label': '阿勒泰地区',
              'level': '3',
              'value': '6543'
            }
          ]
        },
        {
          'label': '台湾省',
          'level': '1',
          'value': '7100',
          'children': [
            {
              'label': '台湾省',
              'level': '1',
              'value': '7100'
            }
          ]
        },
        {
          'label': '香港特别行政区',
          'level': '1',
          'value': '8100',
          'children': [
            {
              'label': '香港特别行政区',
              'level': '1',
              'value': '8100'
            }
          ]
        },
        {
          'label': '澳门特别行政区',
          'level': '1',
          'value': '8200',
          'children': [
            {
              'label': '澳门特别行政区',
              'level': '1',
              'value': '8200'
            }
          ]
        }
      ]
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
  created() {
    this.init()
  },
  methods: {
    init() {
      deptList().then(response => {
        this.deptTree.data = response.data
      })

      dictList({ name: '企业类型' }).then(response => {
        this.typeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '自定义企业类型' }).then(response => {
        this.customTypeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '企业注册类型' }).then(response => {
        this.registrationTypeList = getDictList(response.data[0].detail)
      })

      dictList({ name: '币种' }).then(response => {
        this.currencyList = getDictList(response.data[0].detail)
      })

      dictList({ name: '企业注册地' }).then(response => {
        this.registrationPlaceList = getDictList(response.data[0].detail)
      })

      dictList({ name: '登记状态【营业执照】' }).then(response => {
        this.registrationStatusList = getDictList(response.data[0].detail)
      })

      dictList({ name: '企业标签' }).then(response => {
        this.companyTagOptions = getDictList(response.data[0].detail)
      })

      this.uploadUrl = getApiUrl() + '/file'
      this.uploadHeaders['Authorization'] = getToken()
      console.log(this.$route.query.registrationType)
      this.form.registrationType = this.$route.query.registrationType ? this.$route.query.registrationType + '' : ''
      const id = this.$route.query.id
      if (id) {
        get(id).then(response => {
          this.form = response.data
          // this.setContent(response.data.content)
          // this.ifUpload = false
          this.businessLicenseList = []
          var accessoryArr = ['businessLicense', 'approvalFiles',
            'companyArticlesAssociation', 'shareholdersDecide',
            'applicationRegistrationFiles', 'otherFiles']
          for (let j = 0; j < accessoryArr.length; j++) {
            if (response.data[accessoryArr[j]]) {
              const listQuery = {
                page: 1,
                limit: 20,
                ids: response.data[accessoryArr[j]].replace(/(^\s*)|(\s*$)/g, '') || '0'
              }
              // listQuery.ids = response.data[accessoryArr[j]]
              getListIds(listQuery).then(response => {
                for (let i = 0; i < response.data.records.length; i++) {
                  const file = {}
                  file.id = response.data.records[i].id
                  file.name = response.data.records[i].originalFileName
                  file.url = this.uploadUrl + '/getImgStream?idFile=' + response.data.records[i].id
                  this[accessoryArr[j] + 'List'].push(file)
                }
              })
            }
          }

          this.form.registrationPlace = this.form.registrationPlace.split('-')
          this.form.tags = this.form.tags?this.form.tags.split('-'):''
          // this.listQuery.ids = response.data.businessLicense
          // getListIds(this.listQuery).then(response => {
          //   console.log(response.data)
          //   this.list = response.data.records
          //   for (let i = 0; i < response.data.records.length; i++) {
          //     var file = {}
          //     file.name = response.data.records[i].originalFileName
          //     file.url = this.uploadUrl + '/getImgStream?idFile=' + response.data.records[i].id
          //     this.businessLicenseList.push(file)
          //   }
          //   // this.listLoading = false
          //   // this.total = response.data.total
          // })
        })
      }
    },
    back() {
      this.$router.go(-1)
    },
    resetForm() {
      this.form = {
        unifiedSocialCreditCode: '',
        enterpriseName: '',
        enterpriseNameEn: '',
        enterpriseNameBusiness: '',
        enterpriseCode: '',
        type: '',
        customType: '',
        registrationType: this.$route.query.registrationType,
        registrationPlace: '',
        legalRepresentative: '',
        registeredCapital: 0,
        currency: '',
        setupDate: '',
        achieveDate: '',
        operatingPeriodFrom: '',
        operatingPeriodEnd: '',
        registrationAuthority: '',
        approvalDate: '',
        registrationStatus: '',
        registeredAddress: '',
        businessAddress: '',
        tags: '',
        remark: '',
        businessScope: '',
        businessLicense: '',
        approvalFiles: '',
        companyArticlesAssociation: '',
        shareholdersDecide: '',
        applicationRegistrationFiles: '',
        otherFiles: '',
        id: ''
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          save({
            unifiedSocialCreditCode: this.form.unifiedSocialCreditCode,
            enterpriseName: this.form.enterpriseName,
            enterpriseNameEn: this.form.enterpriseNameEn,
            enterpriseNameBusiness: this.form.enterpriseNameBusiness,
            enterpriseCode: this.form.enterpriseCode,
            type: this.form.type,
            customType: this.form.customType,
            registrationType: this.form.registrationType,
            registrationPlace: this.form.registrationPlace.join('-'),
            legalRepresentative: this.form.legalRepresentative,
            registeredCapital: parseFloat(this.form.registeredCapital).toFixed(1) || 0,
            currency: this.form.currency,
            setupDate: this.form.setupDate ? parseTime(this.form.setupDate, '{y}-{m}-{d}') : '',
            achieveDate: this.form.achieveDate ? parseTime(this.form.achieveDate, '{y}-{m}-{d}') : '',
            operatingPeriodFrom: this.form.operatingPeriodFrom ? parseTime(this.form.operatingPeriodFrom, '{y}-{m}-{d}') : '',
            operatingPeriodEnd: this.form.operatingPeriodEnd ? parseTime(this.form.operatingPeriodEnd, '{y}-{m}-{d}') : '',
            registrationAuthority: this.form.registrationAuthority,
            approvalDate: this.form.approvalDate ? parseTime(this.form.approvalDate, '{y}-{m}-{d}') : '',
            registrationStatus: this.form.registrationStatus,
            registeredAddress: this.form.registeredAddress,
            businessAddress: this.form.businessAddress,
            tags: this.form.tags ? this.form.tags.join('-') : '',
            remark: this.form.remark,
            businessScope: this.form.businessScope,
            businessLicense: this.form.businessLicense.replace(/(^\s*)|(\s*$)/g, ''),
            approvalFiles: this.form.approvalFiles.replace(/(^\s*)|(\s*$)/g, ''),
            companyArticlesAssociation: this.form.companyArticlesAssociation.replace(/(^\s*)|(\s*$)/g, ''),
            shareholdersDecide: this.form.shareholdersDecide.replace(/(^\s*)|(\s*$)/g, ''),
            applicationRegistrationFiles: this.form.applicationRegistrationFiles.replace(/(^\s*)|(\s*$)/g, ''),
            otherFiles: this.form.otherFiles.replace(/(^\s*)|(\s*$)/g, ''),
            pid: this.form.pid,
            pIds: this.form.pIds,
            pName: this.form.pName,
            id: this.form.id

          }
          ).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            if (response.success) {
              this.$router.push({ path: '/enterprisemanage', query: { id: response.data.id }})
            } else {
              this.back()
            }
            //
          })
        } else {
          return false
        }
      })
    },
    handleNodeClick(data, node) {
      this.form.pid = data.id
      let pids = data.pids
      if (pids) {
        pids = pids.replace(/\[/g, '-')
        pids = pids.replace(/\]/g, '_')
        pids = pids.replace(/,/g, '|')
        pids = pids + '_' + data.id + '_1|'
        this.form.pIds = pids
      }

      this.form.pName = data.simplename
      this.deptTree.show = false
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

    handleRemoveFile(file, type) {
      // 删除原文时更新原文列表
      // 判断删除文件的位置，等于0，是在列表首位
      if (this.form[type].indexOf(file.id) !== 0) {
        this.form[type] = this.form[type].replace(' ' + file.id, '')
      } else {
        this.form[type] = this.form[type].replace(file.id, '')
      }
    },
    /**
     * 删除文件
     */

    businessLicenseRemoveFile(file) {
      this.handleRemoveFile(file, 'businessLicense')
    },
    approvalFilesRemoveFile(file) {
      this.handleRemoveFile(file, 'approvalFiles')
    },
    companyArticlesAssociationRemoveFile(file) {
      this.handleRemoveFile(file, 'companyArticlesAssociation')
    },
    shareholdersDecideRemoveFile(file) {
      this.handleRemoveFile(file, 'shareholdersDecide')
    },
    applicationRegistrationFilesRemoveFile(file) {
      this.handleRemoveFile(file, 'applicationRegistrationFiles')
    },
    otherFilesRemoveFile(file) {
      this.handleRemoveFile(file, 'otherFiles')
    },

    handleUploadSuccess(response, type) {
      this.loadingInstance.close()
      if (response.code === 20000) {
        this.form[type] = this.form[type] + ' ' + response.data.id
      } else {
        this.$message({
          message: this.$t('common.uploadError'),
          type: 'error'
        })
      }
    },

    /**
     * 文件上传成功
     */

    businessLicenseUploadSuccess(response) {
      this.handleUploadSuccess(response, 'businessLicense')
    },
    approvalFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'approvalFiles')
    },
    companyArticlesAssociationUploadSuccess(response) {
      this.handleUploadSuccess(response, 'companyArticlesAssociation')
    },
    shareholdersDecideUploadSuccess(response) {
      this.handleUploadSuccess(response, 'shareholdersDecide')
    },
    applicationRegistrationFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'applicationRegistrationFiles')
    },
    otherFilesUploadSuccess(response) {
      this.handleUploadSuccess(response, 'otherFiles')
    },
    handleChange(value) {
      console.log(value)
    }

  }
}

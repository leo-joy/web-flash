export default {
  route: {
    dashboard: '工作台',
    system: '系统管理',
    operationMgr: '运维管理',
    cms: 'CMS管理',
    banner: 'banner管理',
    article: '文章管理',
    editArticle: '编辑文章',
    file: '文件管理',
    contacts: '邀约管理',
    channel: '栏目管理',
    menu: '菜单管理',
    dept: '部门管理',
    mgr: '用户管理',
    role: '角色管理',
    task: '任务管理',
    taskLog: '任务日志',
    dict: '字典管理',
    loginLog: '登录日志',
    log: '业务日志',
    cfg: '参数管理',
    druid: '监控管理',
    swagger: '接口文档',
    messageMgr: '消息管理',
    msg: '历史消息',
    msgTpl: '消息模板',
    msgSender: '消息发送器',

    /**
     * 公司信息管理
     */
    lpm: '企业管理',
    enterpriseInfo: '企业信息管理',
    editCompany: '企业变更',

    enterpriseManage: '编辑公司基本信息',
    detailEnterpriseinfo: '公司详细信息',
    shareholderManage: '合作单位管理',
    editCompanyManage: '公司变更管理',
    filesManage: '附件管理',
    // 子菜单
    businessLicense: '营业执照',
    editBusinessLicense: '公司注册',
    mainmember: '主要人员信息',
    shareholder: '股东信息',
    seal: '印章信息',
    annals: '年报信息',
    capital: '股权及出资信息',
    subcribeRecord: '股东认缴记录',
    realityRecord: '股东实缴记录',
    administrativelicense: '行政许可信息',
    administrativepunish: '行政处罚信息',
    certificatecancel: '证照废弃声明',
    liquidation: '清算信息',
    branchcompany: '分公司信息',
    investcompany: '投资企业',
    propertypledge: '动产抵押登记',
    stockpledge: '股权出质登记',
    knowledgepledge: '知识产品出质登记',
    trademark: '商标信息',

    /**
     * 公司治理结构
     */
    companymanage: '公司治理结构',
    // 子菜单
    advancedUser: '企业人员管理',

    /**
     * 清算退出管理
     */
    liquidationManage: '清算退出管理',
    // 子菜单
    companyCancel: '公司注销',
    companyRevoked: '公司吊销',
    equityExit: '公司清算退出',
    shutdownBusiness: '终止经营',

    /**
     * 三会治理
     */
    threeMeetingManage: '公司治理结构',

    /**
     * 报表统计分析
     */
    reportStatistical: '报表统计分析',
    // 子菜单
    equityAnalysis: '股权架构图',
    reportOutput: '报表导出'

  },
  /**
   * 模块开发start
   */
  businessLicenseMgr: {
    enterpriseName: '企业名称',
    enterpriseCode: '企业编码'
  },

  /**
   * 模块开发end
   */
  navbar: {
    logOut: '退出登录',
    profile: '个人资料',
    updatePwd: '修改密码',
    dashboard: '我的首页',
    github: '项目地址',
    screenfull: '全屏',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: '雅居乐法人系统',
    errorAccount: '请输入5到32位的数字和字母',
    errorPassword: '密码至少位5位',
    logIn: '登录',
    username: '账号',
    password: '密码'
  },

  button: {
    add: '添加',
    edit: '修改',
    modity: '变更',
    delete: '删除',
    search: '搜索',
    reset: '重置',
    submit: '提交',
    cancel: '取消',
    clear: '清除',
    back: '返回',
    export: '导出',
    businessCirclesSyn: '同步工商数据'
  },
  common: {
    mustSelectOne: '请选中操作项!',
    deleteConfirm: '你确认删除该记录？',
    tooltip: '提示',
    warning: '警告',
    optionSuccess: '操作成功',
    uploadError: '上传文件失败',
    isRequired: '不能为空',
    week: {
      mon: '周一',
      tue: '周二',
      wed: '周三',
      thu: '周四',
      fri: '周五',
      sat: '周六',
      sun: '周日'
    }
  },
  dashboard: {
    newUser: '新增用户',
    message: '未处理消息',
    income: '收入',
    onlineUser: '在线用户',
    document: '在线文档',
    date: '日期',
    name: '名称',
    addr: '地址',
    email: '邮件营销',
    ad: '联盟广告',
    vedio: '视频广告',
    direct: '直接访问',
    searchEngine: '搜索引擎',
    userFrom: '用户来源'
  },
  config: {
    name: '参数名',
    value: '参数值',
    descript: '备注',
    add: '添加参数',
    edit: '编辑参数',
    nameInput: '请输入参数名',
    valueInput: '请输入参数值',
    lengthValidation: '长度在 2 到 20 个字符'
  }
}


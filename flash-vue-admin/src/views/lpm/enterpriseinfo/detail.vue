<template>
  <div>
    <el-row lass="dp-row">
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="22">
        <h2 style="color:#176c6b;">{{ businesslicenseData.enterpriseName }}</h2>
      </el-col>
    </el-row>
    <el-row lass="dp-row">
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="8">
        <h4>统一社会信用代码：{{ businesslicenseData.unifiedSocialCreditCode }}</h4>
      </el-col>
      <el-col :span="5">
        <h4>法定代表人：{{ businesslicenseData.legalRepresentative }}</h4>
      </el-col>
      <el-col :span="5">
        <h4>成立日期：{{ businesslicenseData.setupDate?businesslicenseData.setupDate.replace(' 00:00:00',''):'' }}</h4>
      </el-col>
    </el-row>
    <!-- <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
      <el-radio-button label="top">top</el-radio-button>
      <el-radio-button label="right">right</el-radio-button>
      <el-radio-button label="bottom">bottom</el-radio-button>
      <el-radio-button label="left">left</el-radio-button>
    </el-radio-group> -->
    <el-row lass="dp-row">
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="22">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="基础数据" name="first">
            <el-tabs :tab-position="tabPosition" style="height: auto;padding-top:10px">
              <el-tab-pane label="基本信息"><div><businesslicense /></div></el-tab-pane>
              <el-tab-pane label="主要人员信息"><mainmember /></el-tab-pane>
              <el-tab-pane label="股东信息"><shareholder /></el-tab-pane>
              <el-tab-pane label="印章信息"><seal /></el-tab-pane>
              <el-tab-pane label="年报信息"><annals /></el-tab-pane>
              <el-tab-pane label="股权及出资信息"><capital /></el-tab-pane>
              <el-tab-pane label="行政许可信息"><administrativelicense /></el-tab-pane>
              <el-tab-pane label="行政处罚信息"><administrativepunish /></el-tab-pane>
              <el-tab-pane label="证照废弃声明"><certificatecancel /></el-tab-pane>
              <el-tab-pane label="清算信息"><liquidation /></el-tab-pane>
              <el-tab-pane label="分公司信息"><branchcompany /></el-tab-pane>
              <el-tab-pane label="投资企业"><investcompany /></el-tab-pane>
              <el-tab-pane label="动产抵押登记"><propertypledge /></el-tab-pane>
              <el-tab-pane label="股权出质登记"><stockpledge /></el-tab-pane>
              <el-tab-pane label="知识产权出质登记"><knowledgepledge /></el-tab-pane>
              <el-tab-pane label="商标信息"><trademark /></el-tab-pane>
              <el-tab-pane label="税务信息"><tallage /></el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="公司文件" name="second">
            <companymodify />
          </el-tab-pane>
          <el-tab-pane label="产权文件" name="third">
            <div>开发中。。。</div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

  </div>
</template>
<style lang="scss">
.dp-table-expand {
  font-size: 0;
}
.dp-table-expand label {
  width: 150px;
  color: #99a9bf;
}
.dp-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.dp-row {
  padding: 10px;
}
// 清除浮动
.clearfix:after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}

.clearfix {
  zoom: 1;
}
// 底部按钮
.botmBtnContainer {
  text-align: center;
  padding: 20px;
}
</style>
<script>
import { get as getBusinesslicense } from '@/api/lpm/businesslicense'

import businesslicense from '@/views/lpm/businesslicense/view.vue'
import mainmember from '@/views/lpm/mainmember/view.vue'
import shareholder from '@/views/lpm/shareholder/view.vue'
import seal from '@/views/lpm/seal/view.vue'
import annals from '@/views/lpm/annals/view.vue'
import capital from '@/views/lpm/capital/view.vue'
import administrativelicense from '@/views/lpm/administrativelicense/view.vue'
import administrativepunish from '@/views/lpm/administrativepunish/view.vue'
import certificatecancel from '@/views/lpm/certificatecancel/view.vue'
import liquidation from '@/views/lpm/liquidation/view.vue'
import branchcompany from '@/views/lpm/branchcompany/view.vue'
import investcompany from '@/views/lpm/investcompany/view.vue'
import propertypledge from '@/views/lpm/propertypledge/view.vue'
import knowledgepledge from '@/views/lpm/knowledgepledge/view.vue'
import stockpledge from '@/views/lpm/stockpledge/view.vue'
import trademark from '@/views/lpm/trademark/view.vue'
import tallage from '@/views/lpm/tallage/view.vue'

import companymodify from '@/views/lpm/companyModify/view.vue'

export default {
  name: 'CompanyLayout',
  components: {
    businesslicense,
    mainmember,
    shareholder,
    seal,
    annals,
    capital,
    administrativelicense,
    administrativepunish,
    certificatecancel,
    liquidation,
    branchcompany,
    investcompany,
    propertypledge,
    stockpledge,
    knowledgepledge,
    trademark,
    tallage,

    companymodify
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
  data() {
    return {
      tabPosition: 'left',
      id: '',
      activeName: 'first',
      /* 营业执照模块 */
      businesslicenseData: {} // 营业执照的相关信息
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
    this.init()
  },
  methods: {
    // 初始化功能权限
    init() {
      // 获取企业的id
      const id = this.$route.query.id
      // 请求营业执照信息
      getBusinesslicense(id).then(response => {
        this.businesslicenseData = response.data
        this.logTitle = '【 ' + response.data.enterpriseName + ' 】'
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>


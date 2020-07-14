<template>
  <div>
    <el-row>
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="22">
        <h2 style="color:#176c6b;margin:10px 0 0 0;">{{ businesslicenseData.enterpriseName }}</h2>
        <h4 style="color:#176c6b;margin-top:0px">{{ businesslicenseData.enterpriseNameEn }}</h4>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="7">
        <h4 style="margin:0 0 20px 0">
          <div class="item-label">公司编号<br>Company Number&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          {{ businesslicenseData.unifiedSocialCreditCode }}</h4>
      </el-col>
      <el-col :span="7">
        <h4 style="margin:0 0 20px 0">
          <div class="item-label">成立日期<br>Register Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          {{ businesslicenseData.setupDate?businesslicenseData.setupDate.replace(' 00:00:00',''):'' }}</h4>
      </el-col>
      <el-col :span="9">
        <h4 style="margin:0 0 20px 0">
          <div class="item-label">注册地<br>Place of Incorporation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          {{ businesslicenseData.registrationPlaceName?businesslicenseData.registrationPlaceName.split('-')[0]:'' }} <br> {{ businesslicenseData.registrationPlaceName?businesslicenseData.registrationPlaceName.split('-')[1]:'' }}</h4>
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
              <el-tab-pane label="基本信息"><div><businesslicenseHw /></div></el-tab-pane>
              <el-tab-pane label="股东信息"><shareholder /></el-tab-pane>
              <el-tab-pane label="董事信息"><mainmember /></el-tab-pane>
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
<style rel="stylesheet/scss" lang="scss" scoped>
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
.item-label {
  color:#606266;
  float:left;
  margin-top:-2px;
  line-height:20px;
}
</style>

<script>
import { get as getBusinesslicense } from '@/api/lpm/businesslicense'

import businesslicenseHw from '@/views/lpm/businesslicense/view-hw.vue'
import mainmember from '@/views/lpm/mainmember/view.vue'
import shareholder from '@/views/lpm/shareholder/view.vue'

import companymodify from '@/views/lpm/companyModify/view.vue'

export default {
  name: 'CompanyLayout',
  components: {
    businesslicenseHw,
    mainmember,
    shareholder,

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


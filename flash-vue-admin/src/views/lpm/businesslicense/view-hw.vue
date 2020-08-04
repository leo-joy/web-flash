<template>
  <div class="dp-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="form" :model="form" :rules="rules" label-width="200px">
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="item-label">组织机构<br>Organizational</div>
                {{ grandfatherOrg }} {{ parentOrg }} {{ businesslicenseData.pName }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">企业编号<br>Company Number</div>
                {{ businesslicenseData.unifiedSocialCreditCode }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">登记状态<br>Registration Status</div>
                {{ registrationStatusBL }}</el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label=" ">
                <div class="item-label">{{ $t('businessLicenseMgr.enterpriseName') }}</div>
                {{ businesslicenseData.enterpriseName }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">企业类型<br>Type of Company</div>
                {{ enterpriseType }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">Company Name</div>
                {{ businesslicenseData.enterpriseNameEn }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">股本总额<br>Total Share Capital</div>
                {{ businesslicenseData.registeredCapital }} {{ currencyBL }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">已发行股本<br>Issued Share Capital</div>
                {{ businesslicenseData.issuedShareCapital }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">股本<br>Share Capital</div>
                {{ businesslicenseData.totalCapital }}</el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">实际持有股权<br>Shareholdings</div>
                {{ businesslicenseData.realProportion }} % </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">成立日期<br>Register Date</div>
                {{ businesslicenseData.setupDate?businesslicenseData.setupDate.replace(' 00:00:00',''):'' }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">登记机关</div>
                {{ businesslicenseData.registrationAuthority }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <div class="item-label">企业注册地<br>Place of Incorporation</div>
                <div class="item-label" style="margin-left:0px;font-weight:normal;color:#000;">{{ businesslicenseData.registrationPlaceName?businesslicenseData.registrationPlaceName.split('-')[0]:'' }}<br>
                  {{ businesslicenseData.registrationPlaceName?businesslicenseData.registrationPlaceName.split('-')[1]:'' }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <div class="item-label">Registration Authority</div>
                {{ businesslicenseData.registrationAuthorityEn }}</el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="item-label">地址</div>
                {{ businesslicenseData.registeredAddress }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <div class="item-label">Address</div>
                {{ businesslicenseData.registeredAddressEn }}</el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="item-label">业务性质</div>
                {{ businesslicenseData.businessScope }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <div class="item-label">Nature of Business</div>
                {{ businesslicenseData.businessScopeEn }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="">
                <div class="item-label">企业标签 <br> Label</div>
                <el-tag v-for="tag in tagList" :key="tag.value" style="margin: 0 10px" size="small" :type="tag.value">
                  {{ tag.name }}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <div class="item-label">备注 <br> Remark</div>
                {{ businesslicenseData.remark }}</el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="businessLicenseFilesListBL.length>0">
            <el-col :span="24">
              <FilesListComponent file-title="公司注册证 / Certificate of Incorporation" :files-list="businessLicenseFilesListBL" />
            </el-col>
          </el-row>

          <el-row v-if="companyArticlesAssociationListBL.length>0">
            <el-col :span="24">
              <FilesListComponent
                file-title="公司章程 / Company Article"
                :files-list="companyArticlesAssociationListBL"
              />
            </el-col>
          </el-row>

          <el-row v-if="approvalFilesListBL.length>0">
            <el-col :span="24">
              <FilesListComponent file-title="商业登记证 / Business Registration Certificate" :files-list="approvalFilesListBL" />
            </el-col>
          </el-row>
          <el-row v-if="shareholdersDecideListBL.length>0">
            <el-col :span="24">
              <FilesListComponent file-title="股东名册 / Register of Members" :files-list="shareholdersDecideListBL" />
            </el-col>
          </el-row>
          <el-row v-if="otherFilesListBL.length>0">
            <el-col :span="24">
              <FilesListComponent file-title="董事名册 / Register of Directors" :files-list="otherFilesListBL" />
            </el-col>
          </el-row>
          <el-row v-if="applicationRegistrationFilesListBL.length>0">
            <el-col :span="24">
              <FilesListComponent
                file-title="周年申报表 / Annual Return"
                :files-list="applicationRegistrationFilesListBL"
              />
            </el-col>
          </el-row>

        </el-form>
      </el-col>
    </el-row>
    <el-dialog :title="logTitle" :visible.sync="logVisible" width="60%">
      <template>
        <el-table :data="logList" style="width: 100%">
          <el-table-column prop="title" label="变更信息" width="150" />
          <el-table-column prop="oldValue" label="旧值" />
          <el-table-column prop="newValue" label="新值" />
          <el-table-column prop="modifyTime" label="变更时间" width="160" />
          <el-table-column prop="userName" label="变更操作人" width="150" />
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
.dp-container {
  padding: 0 10px;
}
.item-label {
    margin-left:-180px;
    padding-top:10px;
    color:#606266;
    float:left;
    line-height:18px;
    font-weight:bold;
  }
.el-form-item{
    margin-bottom:10px;
  }
</style>
<script src="./view.js"></script>

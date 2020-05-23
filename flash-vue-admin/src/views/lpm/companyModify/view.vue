<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="item in companyModifyData" :key="item.id" :timestamp="item.createTime" placement="top">
        <el-card>

          <el-row>
            <el-col :span="24">
              <h4>变更理由：{{ item.applyReason }}</h4>
            </el-col>
            <el-col :span="24">
              <table class="dp-table" border="1">
                <tr>
                  <th width="15%">变更事项</th>
                  <th width="35%">变更前</th>
                  <th width="35%">变更后</th>
                  <th width="15%">变更日期</th>
                </tr>
                <tr v-if="item.enterpriseNameState === 'true'">
                  <td>企业名称变更</td>
                  <td>{{ item.enterpriseNameOld }}</td>
                  <td>{{ item.enterpriseNameNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.legalRepresentativeState === 'true'">
                  <td>企业法人变更</td>
                  <td>{{ item.legalRepresentativeOld }}</td>
                  <td>{{ item.legalRepresentativeNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.registeredAddressState === 'true'">
                  <td>注册地址变更</td>
                  <td>{{ item.registeredAddressOld }}</td>
                  <td>{{ item.registeredAddressNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.operatingPeriodEndState === 'true'">
                  <td>经营期限变更</td>
                  <td>{{ item.operatingPeriodEndOld.replace("00:00:00","") }}</td>
                  <td>{{ item.operatingPeriodEndNew?item.operatingPeriodEndNew.replace("00:00:00",""):'长期' }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.businessScopeState === 'true'">
                  <td>经营范围变更</td>
                  <td>{{ item.businessScopeOld }}</td>
                  <td>{{ item.businessScopeNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.chairmanState === 'true'">
                  <td>董事长变更</td>
                  <td>{{ item.chairmanOld }}</td>
                  <td>{{ item.chairmanNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.generalManagerState === 'true'">
                  <td>经理变更</td>
                  <td>{{ item.generalManagerOld }}</td>
                  <td>{{ item.generalManagerNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.directorState === 'true'">
                  <td>董事变更</td>
                  <td>{{ item.directorOld }}</td>
                  <td>{{ item.directorNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
                <tr v-if="item.supervisorState === 'true'">
                  <td>监事变更</td>
                  <td>{{ item.supervisorOld }}</td>
                  <td>{{ item.supervisorNew }}</td>
                  <td>{{ item.modifyDate.replace("00:00:00","") }}</td>
                </tr>
              </table>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <h4 v-if="item.enterpriseNameState === 'true'"><b>企业名称变更：</b>由【 <i>{{ item.enterpriseNameOld }}</i>】变更为 【<i>{{ item.enterpriseNameNew }}</i>】</h4>
              <h4 v-if="item.registeredAddressState === 'true'"><b>注册地址变更：</b>由【 {{ item.registeredAddressOld }}】变更为 【{{ item.registeredAddressNew }}】</h4>
              <h4 v-if="item.businessScopeState === 'true'"><b>经营范围变更：</b></h4>
              <p v-if="item.businessScopeState === 'true'">原经营范围：{{ item.businessScopeOld }}</p>
              <p v-if="item.businessScopeState === 'true'">新经营范围：{{ item.businessScopeNew }}</p>
              <p>变更理由：{{ item.applyReason }}</p>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.businessLicenseFilesListCompanyModify && item.businessLicenseFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="营业执照" :files-list="item.businessLicenseFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.approvalFilesListCompanyModify && item.approvalFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="核准文件" :files-list="item.approvalFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.companyReferenceRegisterFilesListCompanyModify && item.companyReferenceRegisterFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="公司备案登记表" :files-list="item.companyReferenceRegisterFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.companyModifyRegisterFilesListCompanyModify && item.companyModifyRegisterFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="变更事项登记表" :files-list="item.companyModifyRegisterFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.companyArticlesAssociationFilesListCompanyModify && item.companyArticlesAssociationFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="公司章程" :files-list="item.companyArticlesAssociationFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.shareholdersDecideFilesListCompanyModify && item.shareholdersDecideFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="股东会决议" :files-list="item.shareholdersDecideFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.seniorManagementFilesListCompanyModify && item.seniorManagementFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="企业高管信息确认书" :files-list="item.seniorManagementFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.promiseFilesListCompanyModify && item.promiseFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="承诺书" :files-list="item.promiseFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.delegationFilesListCompanyModify && item.delegationFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="委托书" :files-list="item.delegationFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.authorizationFilesListCompanyModify && item.authorizationFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="指定代表或者共同委托代理人授权委托书" :files-list="item.authorizationFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.appointDismissFilesListCompanyModify && item.appointDismissFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="任职免职书" :files-list="item.appointDismissFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.otherFilesListCompanyModify && item.otherFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="其他附件" :files-list="item.otherFilesListCompanyModify" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" />
            <el-col v-if="item.accessoryFilesListCompanyModify && item.accessoryFilesListCompanyModify.length>0" :span="24">
              <FilesListComponent file-title="相关附件" :files-list="item.accessoryFilesListCompanyModify" />
            </el-col>
          </el-row>
        </el-card>
      </el-timeline-item>
      <el-timeline-item v-if="companyModifyData.length === 0">
        <el-card>
          <el-row>
            <el-col :span="24">
              <p>暂无相关的变更记录</p>
            </el-col>
          </el-row>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<style lang="scss">
.dp-table {
    width:100%;
  border:1px solid #ccc;
  border-collapse:collapse;
}

.dp-table th, .dp-table td {
    padding: 10px;
}

.dp-table th{
    margin:5px;
    text-align: center;
    background-color: #efefef;
}
.dp-table td b{
    margin: 10px 5px;
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
<script src="./view.js"></script>

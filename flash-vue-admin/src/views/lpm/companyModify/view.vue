<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="item in companyModifyData" :key="item.id" type="primary" color="#0f6d68" :timestamp="item.modifyDate.replace('00:00:00','')" placement="top">
        <el-card>
          <el-row>
            <el-col :span="21">
              <h3>{{ item.applyReason }}</h3>
            </el-col>

            <el-col :span="3">
              <el-button type="text" @click="openFilesDialog(item)">查看变更附件</el-button>
            </el-col>
            <el-col :span="24">
              <div v-if="item.enterpriseNameState+'' === 'true'">
                <span><b>企业名称：</b></span>
                <span>原</span>
                <span><b style="color:red">{{ item.enterpriseNameOld }}</b></span>
                <span>变更为</span>
                <span><b style="color:green">{{ item.enterpriseNameNew }}</b></span>
              </div>
              <div v-if="item.legalRepresentativeState+'' === 'true'">
                <span><b>企业法人：</b></span>
                <span>原</span>
                <span><b style="color:red">{{ item.legalRepresentativeOld }}</b></span>
                <span>变更为</span>
                <span><b style="color:green">{{ item.legalRepresentativeNew }}</b></span>
              </div>
              <div v-if="item.registeredAddressState+'' === 'true'">
                <span><b>注册地址：</b></span>
                <span>原</span>
                <span><b style="color:red">{{ item.registeredAddressOld }}</b></span>
                <span>变更为</span>
                <span><b style="color:green">{{ item.registeredAddressNew }}</b></span>
              </div>
              <div v-if="item.ownershipState+'' === 'true'">
                <span><b>改制：</b></span>
                <span>原</span>
                <span><b style="color:red">{{ item.ownershipOld }}</b></span>
                <span>变更为</span>
                <span><b style="color:green">{{ item.ownershipNew }}</b></span>
              </div>
              <div v-if="item.operatingPeriodEndState+'' === 'true'">
                <span><b>经营期限：</b></span>
                <span>原</span>
                <span><b style="color:red">{{ item.operatingPeriodEndOld.replace("00:00:00","") }}</b></span>
                <span>变更为</span>
                <span><b style="color:green">{{ item.operatingPeriodEndNew?item.operatingPeriodEndNew.replace("00:00:00",""):'长期' }}</b></span>
              </div>
              <div v-if="item.businessScopeState+'' === 'true'">
                <span><b>经营范围：</b></span>
                <span>原</span>
                <span>{{ item.businessScopeOld }}</span>
                <span>变更为</span>
                <span><b>{{ item.businessScopeNew }}</b></span>
              </div>
              <div v-if="item.constitutionState+'' === 'true'">
                <span><b>章程：</b></span>
                <span>原</span>
                <span>{{ item.constitutionOld }}</span>
                <span>变更为</span>
                <span><b>{{ item.constitutionNew }}</b></span>
              </div>
              <div v-if="item.chairmanState+'' === 'true'">
                <span><b>董事长：</b></span>
                <span>原</span>
                <span><b style="color:red">{{ item.chairmanOld }}</b></span>
                <span>变更为</span>
                <span><b style="color:green">{{ item.chairmanNew }}</b></span>
              </div>
              <div v-if="item.generalManagerState+'' === 'true'">
                <span><b>经理：</b></span>
                <span>原</span>
                <span><b style="color:red">{{ item.generalManagerOld }}</b></span>
                <span>变更为</span>
                <span><b style="color:green">{{ item.generalManagerNew }}</b></span>
              </div>
              <div v-if="item.directorState+'' === 'true'">
                <span><b>董事：</b></span>
                <span>原</span>
                <span><b style="color:red">{{ item.directorOld }}</b></span>
                <span>变更为</span>
                <span><b style="color:green">{{ item.directorNew }}</b></span>
              </div>
              <div v-if="item.supervisorState+'' === 'true'">
                <span><b>监事：</b></span>
                <span>原</span>
                <span><b style="color:red">{{ item.supervisorOld }}</b></span>
                <span>变更为</span>
                <span><b style="color:green">{{ item.supervisorNew }}</b></span>
              </div>
              <table class="dp-table" border="1">
                <tr v-if="item.shareholderModifyState === 'true'">
                  <td>股东变更</td>
                  <td>
                    <el-row>
                      <el-col v-for="sonItemOld in item.shareholderOldList" :key="sonItemOld.id" :span="24">
                        <h4>股东：{{ sonItemOld.shareholder }}</h4>
                        <h5>认缴出资额：{{ sonItemOld.subscribedCapitalContribution }}万元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;占比：{{ sonItemOld.proportion }}%</h5>
                        <div><hr></hr></div>
                      </el-col>
                    </el-row>
                  </td>
                  <td>
                    <el-row>
                      <el-col v-for="sonItemNew in item.shareholderNewList" :key="sonItemNew.id" :span="24">
                        <h4>股东：{{ sonItemNew.shareholder }}</h4>
                        <h5>认缴出资额：{{ sonItemNew.subscribedCapitalContribution }}万元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;占比：{{ sonItemNew.proportion }}%</h5>
                        <div><hr></hr></div>
                      </el-col>
                    </el-row>
                  </td>
                </tr>
              </table>
            </el-col>
          </el-row></el-card>
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
    <el-dialog
      title="附件列表"
      :visible.sync="fileDialogVisible"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <table class="dp-table" border="1">
        <tr>
          <th width="7%">序号</th>
          <th width="25%">文件类型</th>
          <th width="68%">文件</th>
        </tr>
        <tr>
          <td>1</td><td>内部审批文件</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.accessoryFilesListCompanyModify && currentCompanyModify.accessoryFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.accessoryFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.accessoryFilesListCompanyModify || currentCompanyModify.accessoryFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>2</td><td>工商申请表</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.companyReferenceRegisterFilesListCompanyModify && currentCompanyModify.companyReferenceRegisterFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.companyReferenceRegisterFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.companyReferenceRegisterFilesListCompanyModify || currentCompanyModify.companyReferenceRegisterFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>3</td><td>股东会决议</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.shareholdersDecideFilesListCompanyModify && currentCompanyModify.shareholdersDecideFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.shareholdersDecideFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.shareholdersDecideFilesListCompanyModify || currentCompanyModify.shareholdersDecideFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>4</td><td>董事会决议</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.seniorManagementFilesListCompanyModify && currentCompanyModify.seniorManagementFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.seniorManagementFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.seniorManagementFilesListCompanyModify || currentCompanyModify.seniorManagementFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>5</td><td>公司章程</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.companyArticlesAssociationFilesListCompanyModify && currentCompanyModify.companyArticlesAssociationFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.companyArticlesAssociationFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.companyArticlesAssociationFilesListCompanyModify || currentCompanyModify.companyArticlesAssociationFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>6</td><td>任职免职书</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.appointDismissFilesListCompanyModify && currentCompanyModify.appointDismissFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.appointDismissFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.appointDismissFilesListCompanyModify || currentCompanyModify.appointDismissFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>7</td><td>住所使用证明</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.promiseFilesListCompanyModify && currentCompanyModify.promiseFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.promiseFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.promiseFilesListCompanyModify || currentCompanyModify.promiseFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>8</td><td>股权转让合同</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.delegationFilesListCompanyModify && currentCompanyModify.delegationFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.delegationFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.delegationFilesListCompanyModify || currentCompanyModify.delegationFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>9</td><td>核准文件</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.approvalFilesListCompanyModify && currentCompanyModify.approvalFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.approvalFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.approvalFilesListCompanyModify || currentCompanyModify.approvalFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>10</td><td>营业执照</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.businessLicenseFilesListCompanyModify && currentCompanyModify.businessLicenseFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.businessLicenseFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.businessLicenseFilesListCompanyModify || currentCompanyModify.businessLicenseFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>11</td><td>印章备案文件</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.sealFilesListCompanyModify && currentCompanyModify.sealFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.sealFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.sealFilesListCompanyModify || currentCompanyModify.sealFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>12</td><td>开户许可证</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.openAccountFilesListCompanyModify && currentCompanyModify.openAccountFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.openAccountFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.openAccountFilesListCompanyModify || currentCompanyModify.openAccountFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>13</td><td>机构信用代码证</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.orgCreditCodeFilesListCompanyModify && currentCompanyModify.orgCreditCodeFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.orgCreditCodeFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.orgCreditCodeFilesListCompanyModify || currentCompanyModify.orgCreditCodeFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>14</td><td>外商投资批准文件（批复和批准证书）或备案文件</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.authorizationFilesListCompanyModify && currentCompanyModify.authorizationFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.authorizationFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.authorizationFilesListCompanyModify || currentCompanyModify.authorizationFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>15</td><td>外商投资企业变更备案回执</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.companyModifyRegisterFilesListCompanyModify && currentCompanyModify.companyModifyRegisterFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.companyModifyRegisterFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.companyModifyRegisterFilesListCompanyModify || currentCompanyModify.companyModifyRegisterFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>16</td><td>质权合同</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.stockPledgeFilesListCompanyModify && currentCompanyModify.stockPledgeFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.stockPledgeFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.stockPledgeFilesListCompanyModify || currentCompanyModify.stockPledgeFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>17</td><td>清算报告</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.liquidationFilesListCompanyModify && currentCompanyModify.liquidationFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.liquidationFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.liquidationFilesListCompanyModify || currentCompanyModify.liquidationFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>18</td><td>清算组成员备案通知书</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.liquidationPersonFilesListCompanyModify && currentCompanyModify.liquidationPersonFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.liquidationPersonFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.liquidationPersonFilesListCompanyModify || currentCompanyModify.liquidationPersonFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>19</td><td>清税证明</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.tallageFilesListCompanyModify && currentCompanyModify.tallageFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.tallageFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.tallageFilesListCompanyModify || currentCompanyModify.tallageFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>20</td><td>公告报纸样张</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.noticeFilesListCompanyModify && currentCompanyModify.noticeFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.noticeFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.noticeFilesListCompanyModify || currentCompanyModify.noticeFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>
        <tr>
          <td>21</td><td>其它文件</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.otherFilesListCompanyModify && currentCompanyModify.otherFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.otherFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.otherFilesListCompanyModify || currentCompanyModify.otherFilesListCompanyModify.length==0" :span="24">
                无
              </el-col>
            </el-row>
          </td>
        </tr>

      </table>
    </el-dialog>
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

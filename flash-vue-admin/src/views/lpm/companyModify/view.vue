<template>
  <div class="block">
    <el-row>
      <el-col :span="1">&nbsp;
      </el-col>
      <el-col :span="16">
        <el-select v-model="companyModifyTypeValue" multiple placeholder="请选择变更类型" style="width:100%" @change="filterTypeList">
          <el-option
            v-for="item in companyModifyTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" style="margin-left:10px;" @click.native="filterTypeList">{{ $t('button.search') }}</el-button>
      </el-col>
      <el-col :span="5">
        <el-button v-permission="['/newFilesList']" style="margin-left:10px;float:right" @click="openAllFilesDialog()">公司最新文件</el-button>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="24">
        <el-timeline>
          <el-timeline-item v-for="item in companyModifyData" :key="item.id" type="primary" color="#0f6d68" :timestamp="item.modifyDate.replace('00:00:00','')" placement="top">
            <el-card>
              <el-row>
                <el-col :span="21">
                  <h3>{{ item.applyReason }}</h3>
                </el-col>

                <el-col :span="3">
                  <el-button style="float:right" type="text" @click="openFilesDialog(item)">查看变更附件</el-button>
                </el-col>
                <el-col :span="24">
                  <div v-if="item.newRegisteredState+'' === 'true'" class="modifyList">
                    <div class="modifyList"><b>企业名称： </b>{{ item.enterpriseNameNew }}</div>
                    <div class="modifyList"><b>注册资本： </b>{{ item.registeredCapitalNew }} 万元</div>
                    <div class="modifyList"><b>法定代表人： </b>{{ item.legalRepresentativeNew }}</div>
                    <div class="modifyList"><b>经营期限： </b>{{ item.operatingPeriodEndNew?item.operatingPeriodEndNew.replace("00:00:00",""):'长期' }}</div>
                    <div class="modifyList"><b>注册地址： </b>{{ item.registeredAddressNew }}</div>
                    <div class="modifyList"><b>经营范围： </b><br><br>{{ item.businessScopeNew }}<br></div>
                    <div class="modifyList"><b>董事长： </b>{{ item.chairmanNew }}</div>
                    <div class="modifyList"><b>董事： </b>{{ item.directorNew }}</div>
                    <div class="modifyList"><b>监事： </b>{{ item.supervisorNew }}</div>
                    <div class="modifyList"><b>总经理： </b>{{ item.generalManagerNew }}</div>
                    <br>
                    <table class="dp-table" border="1">
                      <tr>
                        <td>股东信息</td>
                        <td>
                          <el-row>
                            <el-col v-for="sonItemOld in item.shareholderOldList" :key="sonItemOld.id" :span="24">
                              <h4>股东：{{ sonItemOld.shareholder }}</h4>
                              <h5>认缴出资额：{{ sonItemOld.subscribedCapitalContribution }}万元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;占比：{{ sonItemOld.proportion }}%</h5>
                              <div><hr></div>
                            </el-col>
                          </el-row>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div v-if="item.enterpriseNameState+'' === 'true'" class="modifyList">
                    <span><b>企业名称变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.enterpriseNameOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.enterpriseNameNew }}</b></span>
                  </div>
                  <div v-if="item.legalRepresentativeState+'' === 'true'" class="modifyList">
                    <span><b>法人变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.legalRepresentativeOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.legalRepresentativeNew }}</b></span>
                  </div>
                  <div v-if="item.registeredAddressState+'' === 'true'" class="modifyList">
                    <span><b>地址变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.registeredAddressOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.registeredAddressNew }}</b></span>
                  </div>
                  <div v-if="item.liquidationExitState+'' === 'true'" class="modifyList">
                    <span><b>股权清算退出备注：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.liquidationExitOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.liquidationExitNew }}</b></span>
                  </div>
                  <div v-if="item.registeredCapitalState+'' === 'true'" class="modifyList">
                    <span><b>注册资本变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.registeredCapitalOld }}万{{ item.currencyOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.registeredCapitalNew }}万{{ item.currencyNew }}</b></span>
                  </div>
                  <div v-if="item.ownershipState+'' === 'true'" class="modifyList">
                    <span><b>企业类型变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.ownershipOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.ownershipNew }}</b></span>
                  </div>
                  <div v-if="item.operatingPeriodEndState+'' === 'true'" class="modifyList">
                    <span><b>经营期限变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.operatingPeriodEndOld.replace("00:00:00","") }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.operatingPeriodEndNew?item.operatingPeriodEndNew.replace("00:00:00",""):'长期' }}</b></span>
                  </div>
                  <div v-if="item.businessScopeState+'' === 'true'" class="modifyList">
                    <div><b>经营范围：由 </b></div>
                    <div>{{ item.businessScopeOld }}</div>
                    <br>
                    <div><b>变更为:</b></div>
                    <div>{{ item.businessScopeNew }}</div>
                  </div>
                  <div v-if="item.constitutionState+'' === 'true'" class="modifyList">
                    <div><b>章程变更：由 </b></div>
                    <div>{{ item.constitutionOld }}</div>
                    <br>
                    <div><b>变更为:</b></div>
                    <div>{{ item.constitutionNew }}</div>
                  </div>
                  <div v-if="item.chairmanState+'' === 'true'" class="modifyList">
                    <span><b>董事长变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.chairmanOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.chairmanNew }}</b></span>
                  </div>
                  <div v-if="item.generalManagerState+'' === 'true'" class="modifyList">
                    <span><b>经理变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.generalManagerOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.generalManagerNew }}</b></span>
                  </div>
                  <div v-if="item.directorState+'' === 'true'" class="modifyList">
                    <span><b>董事变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.directorOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.directorNew }}</b></span>
                  </div>
                  <div v-if="item.supervisorState+'' === 'true'" class="modifyList">
                    <span><b>监事变更：</b></span>
                    <span>由</span>
                    <span><b style="color:red">{{ item.supervisorOld }}</b></span>
                    <span>变更为</span>
                    <span><b style="color:green">{{ item.supervisorNew }}</b></span>
                  </div>
                  <table class="dp-table" border="1">
                    <tr v-if="item.shareholderModifyState === 'true'">
                      <td>股东信息</td>
                      <td>
                        <el-row>
                          <el-col v-for="sonItemOld in item.shareholderOldList" :key="sonItemOld.id" :span="24">
                            <h4>股东：{{ sonItemOld.shareholder }}</h4>
                            <h5>认缴出资额：{{ sonItemOld.subscribedCapitalContribution }}万元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;占比：{{ sonItemOld.proportion }}%</h5>
                            <div><hr></div>
                          </el-col>
                        </el-row>
                      </td>
                      <td v-if="item.shareholderNewList.length>0">>></td>
                      <td>
                        <el-row>
                          <el-col v-for="sonItemNew in item.shareholderNewList" :key="sonItemNew.id" :span="24">
                            <h4>股东：{{ sonItemNew.shareholder }}</h4>
                            <h5>认缴出资额：{{ sonItemNew.subscribedCapitalContribution }}万元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;占比：{{ sonItemNew.proportion }}%</h5>
                            <div><hr></div>
                          </el-col>
                        </el-row>
                      </td>
                    </tr>
                  </table>
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
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="fileDialogVisible"
      width="90%"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col :span="8" sytle="border-right:#ccc 1px solid;">
          <el-input
            v-model="filterText"
            style="margin-top:-50px;margin-bottom:20px;padding-right:30px;"
            size="small"
            placeholder="可输入文件名进行搜索过滤"
          />
          <br>
          <el-tree
            ref="tree"
            class="filter-tree"
            icon-class="el-icon-folder-opened"
            :data="filesData"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="viewPdf"
          />
        </el-col>
        <el-col :span="16">
          <PDFView :src="src" />
        </el-col>
      </el-row>
      <!-- <table class="dp-table" border="0">
        <tr>
          <th width="7%">序号</th>
          <th width="27%">文件类型</th>
          <th width="65%">文件</th>
        </tr>
        <tr>
          <td>1</td><td>内部审批文件</td>
          <td>
            <el-row>
              <el-col v-if="currentCompanyModify.accessoryFilesListCompanyModify && currentCompanyModify.accessoryFilesListCompanyModify.length>0" :span="24">
                <FilesListComponent :files-list="currentCompanyModify.accessoryFilesListCompanyModify" />
              </el-col>
              <el-col v-if="!currentCompanyModify.accessoryFilesListCompanyModify || currentCompanyModify.accessoryFilesListCompanyModify.length==0" :span="24">
                {{ formatterNoAccessoryCause(currentCompanyModify.accessoryRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.companyReferenceRegisterRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.shareholdersDecideRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.seniorManagementRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.companyArticlesAssociationRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.appointDismissRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.promiseRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.delegationRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.approvalRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.businessLicenseRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.sealRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.openAccountRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.orgCreditCodeRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.authorizationRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.companyModifyRegisterRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.stockPledgeRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.liquidationRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.liquidationPersonRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.tallageRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.noticeRemark) }}
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
                {{ formatterNoAccessoryCause(currentCompanyModify.otherRemark) }}
              </el-col>
            </el-row>
          </td>
        </tr>

      </table> -->
      <br>
      <div><b>*附件备注：</b>{{ currentCompanyModify.remark? currentCompanyModify.remark:'没有备注信息' }}</div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.dp-table {
  width:100%;
  border:1px dotted #ebeef5;
  border-collapse:collapse;
}

.dp-table th, .dp-table td {
    border-top:1px solid #ebeef5;
    padding: 10px;
}

.dp-table th{
    margin:5px;
    text-align: center;
    background-color: #f9f9f9;
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
.modifyList {
  padding:5px
}
.filter-tree {
  padding-right:30px;
}

.filter-tree .el-tree-node__children {
  padding:3px 0;
  color:#00a2ff;
}
.el-tree-node {
  white-space:normal;
}
</style>
<script src="./view.js"></script>

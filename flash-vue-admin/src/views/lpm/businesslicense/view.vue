<template>
  <div class="dp-container">
    <el-row>
      <el-col :span="24">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <!-- <el-row class="dp-row">
                <el-col :span="24">
                  <el-button
                    v-permission="['/mainmember/add/modifylog/edit']"
                    icon="el-icon-log"
                    size="mini"
                    @click.native="viewLog('营业执照信息', '编辑营业执照',businesslicenseData.id)"
                  >变更记录</el-button>
                  <el-button
                    v-permission="['/businesslicense/edit']"
                    icon="el-icon-log"
                    size="mini"
                    @click.native="editInfo('/businesslicense/edit',businesslicenseData.id)"
                  >变更</el-button>
                  <el-button
                    v-permission="['/businesslicense/add']"
                    icon="el-icon-log"
                    size="mini"
                    @click.native="editInfo('/businesslicense',businesslicenseData.id)"
                  >添加</el-button>
                </el-col>
              </el-row> -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="组织属性：">{{ grandfatherOrg }} {{ parentOrg }} {{ businesslicenseData.pName }}</el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="企业名称：">{{ businesslicenseData.enterpriseName }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="businesslicenseData.enterpriseNameEn" label="企业英文名称：">{{ businesslicenseData.enterpriseNameEn }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="统一社会信用代码："
              >{{ businesslicenseData.unifiedSocialCreditCode }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="enterpriseType" label="企业类型：">{{ enterpriseType }}</el-form-item>
            </el-col>
            <!-- <el-col :span="12">
                    <el-form-item label="企业编码：">{{ businesslicenseData.enterpriseCode }}</el-form-item>
                  </el-col> -->
          </el-row>
          <!-- <el-row>
                  <el-col :span="12">
                    <el-form-item label="企业商业名称：">{{ businesslicenseData.enterpriseNameBusiness }}</el-form-item>
                  </el-col>
                </el-row> -->

          <el-row>
            <!-- <el-col :span="12">
                    <el-form-item label="自定义企业类型：">{{ customTypeBL }}</el-form-item>
                  </el-col> -->
          </el-row>

          <!-- <el-row>
                  <el-col :span="12">
                    <el-form-item label="企业注册地：">{{ registrationPlaceBL }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="企业注册类型：">{{ registrationTypeBL }}</el-form-item>
                  </el-col>
                </el-row> -->

          <el-row>
            <el-col :span="12">
              <el-form-item label="法定代表人：">{{ businesslicenseData.legalRepresentative }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="businesslicenseData.legalRepresentative" label="负责人：">{{ businesslicenseData.legalRepresentative }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="注册资本："
              >{{ businesslicenseData.registeredCapital }} 万{{ currencyBL }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="成立日期："
              >{{ businesslicenseData.setupDate?businesslicenseData.setupDate.replace(' 00:00:00',''):'' }}</el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                label="营业期限自："
              >{{ businesslicenseData.operatingPeriodFrom?businesslicenseData.operatingPeriodFrom.replace(' 00:00:00',''):'' }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                v-if="businesslicenseData.achieveDate"
                label="取得日期："
              >{{ businesslicenseData.achieveDate?businesslicenseData.achieveDate.replace(' 00:00:00',''):'' }}</el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                label="营业期限至："
              >{{ businesslicenseData.operatingPeriodEnd?businesslicenseData.operatingPeriodEnd.replace(' 00:00:00',''):'长期' }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="核准日期："
              >{{ businesslicenseData.approvalDate?businesslicenseData.approvalDate.replace(' 00:00:00',''):'' }}</el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="登记机关：">{{ businesslicenseData.registrationAuthority }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登记状态：">{{ registrationStatusBL }}</el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="地址：">{{ businesslicenseData.registeredAddress }}</el-form-item>
            </el-col>
            <!-- <el-col :span="12">
                    <el-form-item label="经营地址：">{{ businesslicenseData.businessAddress }}</el-form-item>
                  </el-col> -->
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="经营范围：">{{ businesslicenseData.businessScope }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="企业标签：">
                <el-tag v-for="tag in tagList" :key="tag.value" style="margin: 0 10px" size="small" :type="tag.value">
                  {{ tag.name }}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：">{{ businesslicenseData.remark }}</el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="businessLicenseListBL.length>0">
            <el-col :span="24">
              <FilesListComponent file-title="营业执照附件" :files-list="businessLicenseListBL" />
            </el-col>
          </el-row>

          <el-row v-if="approvalFilesListBL.length>0">
            <el-col :span="24">
              <FilesListComponent file-title="核准文件附件" :files-list="approvalFilesListBL" />
            </el-col>
          </el-row>

          <el-row v-if="companyArticlesAssociationListBL.length>0">
            <el-col :span="24">
              <FilesListComponent
                file-title="公司章程附件"
                :files-list="companyArticlesAssociationListBL"
              />
            </el-col>
          </el-row>

          <el-row v-if="shareholdersDecideListBL.length>0">
            <el-col :span="24">
              <FilesListComponent file-title="股东决定附件" :files-list="shareholdersDecideListBL" />
            </el-col>
          </el-row>

          <el-row v-if="applicationRegistrationFilesListBL.length>0">
            <el-col :span="24">
              <FilesListComponent
                file-title="申请注册文件"
                :files-list="applicationRegistrationFilesListBL"
              />
            </el-col>
          </el-row>

          <el-row v-if="otherFilesListBL.length>0">
            <el-col :span="24">
              <FilesListComponent file-title="其他文件" :files-list="otherFilesListBL" />
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
<style lang="scss">
.dp-container {
  padding: 0 10px;
}
</style>
<script src="./view.js"></script>

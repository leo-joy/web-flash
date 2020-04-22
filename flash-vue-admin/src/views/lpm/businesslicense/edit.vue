<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-button icon="el-icon-plus" size="small" type="primary" @click="save">{{
              $t("button.submit")
            }}</el-button>
            <el-button icon="el-icon-back" size="small" @click.native="back">{{
              $t("button.back")
            }}</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p>&nbsp;</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="组织属性">
              <el-input
                v-model="form.pName"
                placeholder="请选择组织属性"
                readonly="readonly"
                @click.native="deptTree.show = !deptTree.show"
              />
              <el-tree
                v-if="deptTree.show"
                empty-text="暂无数据"
                :expand-on-click-node="false"
                :data="deptTree.data"
                :props="deptTree.defaultProps"
                class="input-tree"
                @node-click="handleNodeClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('businessLicenseMgr.enterpriseName')" prop="enterpriseName">
              <el-input v-model="form.enterpriseName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="企业英文名称">
              <el-input
                v-model="form.enterpriseNameEn"
                minlength="1"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="企业商用名称">
              <el-input v-model="form.enterpriseNameBusiness" minlength="1"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="统一社会信用代码">
              <el-input
                v-model="form.unifiedSocialCreditCode"
                minlength="1"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12">
            <el-form-item label="企业编码">
              <el-input v-model="form.enterpriseCode" minlength="1"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="企业类型">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="自定义企业类型">
              <el-select v-model="form.customType" placeholder="请选择">
                <el-option
                  v-for="item in customTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="企业注册地">
              <el-select v-model="form.registrationPlace" placeholder="请选择">
                <el-option
                  v-for="item in registrationPlaceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法定代表人">
              <el-input
                v-model="form.legalRepresentative"
                minlength="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册资本(万元)" prop="registeredCapital">
              <el-input
                v-model="form.registeredCapital"
                minlength="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="币种">
              <el-select v-model="form.currency" placeholder="请选择">
                <el-option
                  v-for="item in currencyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="成立日期">
              <el-date-picker
                v-model="form.setupDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="取得日期">
              <el-date-picker
                v-model="form.achieveDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业期限自">
              <el-date-picker
                v-model="form.operatingPeriodFrom"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业期限至">
              <el-date-picker
                v-model="form.operatingPeriodEnd"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登记机关">
              <el-input
                v-model="form.registrationAuthority"
                minlength="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="核准日期">
              <el-date-picker
                v-model="form.approvalDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业注册类型">
              <el-select v-model="form.registrationType" placeholder="请选择">
                <el-option
                  v-for="item in registrationTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址">
              <el-input
                v-model="form.registeredAddress"
                minlength="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登记状态">
              <el-select v-model="form.registrationStatus" placeholder="请选择">
                <el-option
                  v-for="item in registrationStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24">
            <el-form-item label="经营地址">
              <el-input v-model="form.businessAddress" minlength="1"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="经营范围">
              <el-input v-model="form.businessScope" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息">
              <el-input v-model="form.remark" minlength="1" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="营业执照">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :file-list="businessLicenseList"
                :before-upload="handleBeforeUpload"
                :on-remove="businessLicenseRemoveFile"
                :on-success="businessLicenseUploadSuccess"
                :on-preview="hanglePreview"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传文件，且不超过10MB
                </div>
              </el-upload>
              <!-- <el-input v-model="form.businessLicense" minlength="1"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="核准文件">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :file-list="approvalFilesList"
                :before-upload="handleBeforeUpload"
                :on-remove="approvalFilesRemoveFile"
                :on-success="approvalFilesUploadSuccess"
                :on-preview="hanglePreview"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传文件，且不超过10MB
                </div>
              </el-upload>
              <!-- <el-input v-model="form.approvalFiles" minlength="1"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司章程">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :file-list="companyArticlesAssociationList"
                :before-upload="handleBeforeUpload"
                :on-remove="companyArticlesAssociationRemoveFile"
                :on-success="companyArticlesAssociationUploadSuccess"
                :on-preview="hanglePreview"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传文件，且不超过10MB
                </div>
              </el-upload>
              <!-- <el-input v-model="form.companyArticlesAssociation" minlength="1"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="股东决定">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :file-list="shareholdersDecideList"
                :before-upload="handleBeforeUpload"
                :on-remove="shareholdersDecideRemoveFile"
                :on-success="shareholdersDecideUploadSuccess"
                :on-preview="hanglePreview"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传文件，且不超过10MB
                </div>
              </el-upload>
              <!-- <el-input v-model="form.shareholdersDecide" minlength="1"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请注册文件">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :file-list="applicationRegistrationFilesList"
                :before-upload="handleBeforeUpload"
                :on-remove="applicationRegistrationFilesRemoveFile"
                :on-success="applicationRegistrationFilesUploadSuccess"
                :on-preview="hanglePreview"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传文件，且不超过10MB
                </div>
              </el-upload>
              <!-- <el-input v-model="form.applicationRegistrationFiles" minlength="1"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他文件">
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :file-list="otherFilesList"
                :before-upload="handleBeforeUpload"
                :on-remove="otherFilesRemoveFile"
                :on-success="otherFilesUploadSuccess"
                :on-preview="hanglePreview"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传文件，且不超过10MB
                </div>
              </el-upload>
              <!-- <el-input v-model="form.otherFiles" minlength="1"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">{{
            $t("button.submit")
          }}</el-button>
          <el-button @click.native="formVisible = false">{{
            $t("button.cancel")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script src="./edit.js"></script>

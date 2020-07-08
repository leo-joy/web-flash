<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="24">
            <el-button icon="el-icon-plus" size="small" type="primary" @click="save">{{
              $t("button.save")
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
          <el-col :span="20">
            <el-form-item label=" ">
              <div class="item-label">组织属性<br>Organization</div>
              <el-input
                v-model="form.pName"
                placeholder="请选择组织属性"
                readonly="readonly"
                @click.native="deptTree.show = !deptTree.show"
              />
              <el-tree
                v-if="deptTree.show"
                style="height:300px"
                empty-text="暂无数据"
                :default-expand-all="true"
                :expand-on-click-node="false"
                :data="deptTree.data"
                :props="deptTree.defaultProps"
                class="input-tree"
                @node-click="handleNodeClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            &nbsp;
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <div class="item-label">企业编号<br>Company Number</div>
              <el-input v-model="form.enterpriseCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="">
              <div class="item-label">登记状态<br>Registration Status</div>
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label=" " prop="enterpriseName">
              <div class="item-label">{{ $t('businessLicenseMgr.enterpriseName') }}</div>
              <el-input v-model="form.enterpriseName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="">
              <div class="item-label">企业类型<br>Type of Company</div>
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <div class="item-label">Company Name</div>
              <el-input
                v-model="form.enterpriseNameEn"
                minlength="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="" prop="currency">
              <div class="item-label">股本币种<br>Capital Currency</div>
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
            <el-form-item label="" prop="registeredCapital">
              <div class="item-label">股本<br>Capital</div>
              <el-input
                v-model.number="form.registeredCapital"
                minlength="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <div class="item-label">成立日期<br>Register Date</div>
              <el-date-picker
                v-model="form.setupDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="registrationPlace">
              <div class="item-label">企业注册地<br>Place of Incorporation</div>
              <el-cascader
                v-model="form.registrationPlace"
                :options="provinces"
                @change="handleChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <div class="item-label">登记机关</div>
              <el-input
                v-model="form.registrationAuthority"
                minlength="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="">
              <div class="item-label">实际持有股权（%）<br>Shareholdings(%)</div>
              <el-slider v-model="form.realProportion" show-input />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <div class="item-label">Registration Authority</div>
              <el-input
                v-model="form.registrationAuthorityEn"
                minlength="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">地址</div>
              <el-input
                v-model="form.registeredAddress"
                minlength="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">Address</div>
              <el-input
                v-model="form.registeredAddressEn"
                minlength="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">业务性质</div>
              <el-input v-model="form.businessScope" type="textarea" rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">Nature of Business</div>
              <el-input v-model="form.businessScopeEn" type="textarea" rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">企业标签</div>
              <el-select v-model="form.tags" multiple placeholder="请企业标签" style="width:100%">
                <el-option
                  v-for="item in companyTagOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">备注信息</div>
              <el-input v-model="form.remark" minlength="1" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">公司注册证<br>Certificate of Incorporation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :file-list="businessLicenseFilesList"
                :before-upload="handleBeforeUpload"
                :on-remove="businessLicenseFilesRemoveFile"
                :on-success="businessLicenseFilesUploadSuccess"
                :on-preview="hanglePreview"
              >
                <el-button size="small">点击上传</el-button>
                <span slot="tip" class="el-upload__tip">&nbsp;</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <div class="item-label">公司章程<br>Company Article&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
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
                <el-button size="small">点击上传</el-button>
                <span slot="tip" class="el-upload__tip">&nbsp;</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">商业登记证<br>Business Registration Certificate&nbsp;&nbsp;</div>
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
                <el-button size="small">点击上传</el-button>
                <span slot="tip" class="el-upload__tip">&nbsp;</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">股东名册<br>Register of Directors&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
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
                <el-button size="small">点击上传</el-button>
                <span slot="tip" class="el-upload__tip">&nbsp;</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">周年申报表<br>Annual Return&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
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
                <el-button size="small">点击上传</el-button>
                <span slot="tip" class="el-upload__tip">&nbsp;</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div class="item-label">董事名册<br>Register of Members&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
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
                <el-button size="small">点击上传</el-button>
                <span slot="tip" class="el-upload__tip">&nbsp;</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="19">&nbsp;</el-col>
          <el-col :span="5">
            <el-button style="float:right" icon="el-icon-plus" type="primary" @click="save">{{
              $t("button.save")
            }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script src="./edit-hw.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .item-label {
    margin-left:-150px;
    color:#606266;
    float:left;
    line-height:20px;
    font-weight:bold;
  }
  .el-form-item{
    margin-bottom:25px;
  }
</style>

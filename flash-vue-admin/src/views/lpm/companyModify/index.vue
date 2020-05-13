<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="success" size="mini" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="remove">{{ $t('button.delete') }}</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="企业id" width="80">
        <template slot-scope="scope">
          {{ scope.row.enterpriseId }}
        </template>
      </el-table-column>
      <el-table-column label="企业名称">
        <template slot-scope="scope">
          {{ scope.row.enterpriseNameOld }}
        </template>
      </el-table-column>
      <el-table-column label="注册地址">
        <template slot-scope="scope">
          {{ scope.row.registeredAddressOld }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100,500]"
      :page-size="listQuery.limit"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext"
    />

    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1" title="一、填写申请人相关信息">
            <el-row>
              <el-col :span="16">
                <el-form-item label="单位" prop="affiliatedUnit">
                  <el-input v-model="form.affiliatedUnit" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请部门" prop="applyDepartment">
                  <el-input v-model="form.applyDepartment" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请人" prop="applicant">
                  <el-input v-model="form.applicant" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式" prop="applicantContact">
                  <el-input v-model="form.applicantContact" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请时间">
                  <el-date-picker
                    v-model="form.applyTime"
                    type="datetime"
                    placeholder="选择日期时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="申请理由" prop="applyReason">
                  <el-input v-model="form.applyReason" type="textarea" rows="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请类型">
                  <el-input v-model="form.applyType" minlength="1" />
                </el-form-item>
              </el-col>

            </el-row>
          </el-collapse-item>
          <el-collapse-item name="2" title="二、填写变更事项相关信息">
            <el-row lass="dp-row">
              <el-col :span="1">&nbsp;
              </el-col>
              <el-col :span="11">
                <h2 style="color:#176c6b;">企业名称：{{ businesslicenseData.enterpriseName }}</h2>
              </el-col>
              <el-col :span="8">
                <h4>统一社会信用代码：{{ businesslicenseData.unifiedSocialCreditCode }}</h4>
              </el-col>
              <el-col :span="4">
                <h4>法定代表人：{{ businesslicenseData.legalRepresentative }}</h4>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="12">
                <el-form-item label="企业id">
                  <el-input v-model="form.enterpriseId" minlength="1" />
                </el-form-item>
              </el-col> -->
              <el-col :span="18">
                <el-form-item label="变更类型">
                  <el-checkbox v-model="form.enterpriseNameState" label="企业名称变更" />
                  <el-checkbox v-model="form.registeredAddressState" label="注册地址变更" />
                  <el-checkbox v-model="form.businessScopeState" label="经营范围变更" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="变更日期" prop="modifyDate">
                  <el-date-picker
                    v-model="form.modifyDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%;"
                  />
                </el-form-item>

              </el-col>
              <el-col v-if="form.enterpriseNameState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>变更企业名称</span>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="原企业名称">
                        <el-input v-model="form.enterpriseNameOld" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="新企业名称">
                        <el-input v-model="form.enterpriseNameNew" minlength="1" />
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-card>
                <br>
              </el-col>
              <el-col v-if="form.registeredAddressState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>变更注册地址</span>
                  </div>
                  <el-form-item label="原注册地址">
                    <el-input v-model="form.registeredAddressOld" :disabled="true" />
                  </el-form-item>
                  <el-form-item label="新注册地址">
                    <el-input v-model="form.registeredAddressNew" minlength="1" />
                  </el-form-item>
                </el-card>
                <br>
              </el-col>
              <el-col v-if="form.businessScopeState === true" :span="24">
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>变更经营范围</span>
                  </div>
                  <el-form-item label="原经营范围">
                    <el-input v-model="form.businessScopeOld" :disabled="true" type="textarea" rows="5" />
                  </el-form-item>
                  <el-form-item label="新经营范围">
                    <el-input v-model="form.businessScopeNew" type="textarea" rows="5" />
                  </el-form-item>
                </el-card>
                <br>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="3" title="三、上传相关的申请变更文件">
            <el-row>
              <el-col :span="24">
                <el-form-item label="详情附件">
                  <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :file-list="accessoryFilesList"
                    :before-upload="handleBeforeUpload"
                    :on-remove="handleRemoveFile"
                    :on-success="accessoryFilesUploadSuccess"
                    :on-preview="hanglePreview"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传文件，且不超过10MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
                  <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./companyModify.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
    .dp-row {
      padding: 5px;
    }
    .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>


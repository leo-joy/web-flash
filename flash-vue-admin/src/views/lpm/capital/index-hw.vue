<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button
            v-permission="['/capital/add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click.native="add"
          >{{ $t('button.add') }}</el-button>
          <el-button
            v-permission="['/capital/edit']"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click.native="edit"
          >{{ $t('button.edit') }}</el-button>
          <el-button
            v-permission="['/capital/delete']"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click.native="remove"
          >{{ $t('button.delete') }}</el-button>
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
      <el-table-column label="股东">
        <template slot-scope="scope">{{ scope.row.shareholder }}</template>
      </el-table-column>
      <el-table-column label="股份数量" width="120">
        <template slot-scope="scope">{{ scope.row.numberOfShares }}</template>
      </el-table-column>
      <el-table-column label="已缴股份数量" width="120">
        <template slot-scope="scope">{{ scope.row.numberOfPaidShares }}</template>
      </el-table-column>
      <el-table-column label="已缴付股款（万元）" width="150">
        <template slot-scope="scope">{{ scope.row.realityCapitalContribution }}</template>
      </el-table-column>
      <el-table-column label="占比（%）">
        <template slot-scope="scope">{{ scope.row.proportion }}</template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100, 500]"
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
      width="90%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleClose"
    >
      <el-collapse v-model="activeNames">
        <el-form ref="form" :model="form" :rules="rules" label-width="160px">

          <el-collapse-item title="一、股权信息" name="1">

            <el-row>
              <el-col :span="12">
                <el-form-item label="公司名称" prop="enterpriseName">
                  <el-input
                    v-model="form.enterpriseName"
                    :disabled="true"
                    placeholder="请选择公司"
                    readonly="readonly"
                    @click.native="companyTree.show = (!companyTree.show && false)"
                  />
                  <el-tree
                    v-if="companyTree.show"
                    empty-text="暂无数据"
                    :expand-on-click-node="false"
                    :data="companyList"
                    :props="companyTree.defaultProps"
                    class="input-tree"
                    @node-click="handleCompanyNodeClick"
                  />
                </el-form-item>
              </el-col>
              <el-col :class="[form.shareholderMold===1 && isAdd? 'dpShow' : 'dpHide']" :span="12">
                <el-form-item label="类型">
                  <el-radio-group v-model="form.shareholderMold" @change="handleChangeRadio">
                    <el-radio :label="1">企业股东</el-radio>
                    <el-radio :label="2">自然人股东</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :class="[form.shareholderMold===1 ? 'dpShow' : 'dpHide']" :span="12">
                <el-form-item label="企业股东" prop="shareholder">
                  <el-autocomplete
                    v-model="form.shareholder"
                    popper-class="my-autocomplete"
                    style="min-width:100%;line-height:10px;"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入股东名称"
                    @select="handleBranchCompanySelect"
                  >
                    <i
                      slot="suffix"
                      class="el-icon-circle-plus-outline el-input__icon"
                      @click="handleIconClick"
                    />
                    <template slot-scope="{ item }" style="width:300px">
                      <div class="name">{{ item.enterpriseName }}</div>
                      <span class="addr">信用代码：{{ item.unifiedSocialCreditCode }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span class="addr">地址：{{ item.registeredAddress }}</span>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :class="[form.shareholderMold===2 ? 'dpShow' : 'dpHide']" :span="12">
                <el-form-item label="自然人股东" prop="shareholder">
                  <el-autocomplete
                    v-model="form.shareholder"
                    popper-class="my-autocomplete"
                    style="min-width:500px;line-height:10px;"
                    :fetch-suggestions="querySearchNaturalPersonAsync"
                    placeholder="请输入股东名称"
                    @select="handleNaturalPersonSelect"
                  >
                    <i
                      slot="suffix"
                      class="el-icon-circle-plus-outline el-input__icon"
                      @click="handleIconNaturalPersonClick"
                    />
                    <template slot-scope="{ item }" style="width:300px">
                      <div class="name">{{ item.name }}</div>
                      <span v-if="item.workNumber" class="addr">工号：{{ item.workNumber }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span v-if="item.jobName" class="addr">职务：{{ item.jobName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span v-if="item.type*1 === 1" class="addr">类型：高级管理人员&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span v-if="item.type*1 === 2" class="addr">类型：自然人股东&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span class="addr">性别：{{ item.sexName }}</span>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="股东">
                  <el-input v-model="form.shareholder" :disabled="true" minlength="1" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="股份数量" prop="numberOfShares">
                  <el-input v-model.number="form.numberOfShares" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="已缴股份数量" prop="numberOfPaidShares">
                  <el-input v-model.number="form.numberOfPaidShares" minlength="1" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出资方式" prop="realityCapitalType">
                  <el-select v-model="form.subscribedCapitalType" placeholder="请选择">
                    <el-option
                      v-for="item in realityCapitalTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="每股面值">
                  <el-select v-model="form.parValueShare" placeholder="请选择">
                    <el-option
                      v-for="item in parValueShareList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="已缴付股款" prop="realityCapitalContribution">
                  <el-input v-model="form.realityCapitalContribution" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出资日期">
                  <el-date-picker
                    v-model="form.realityCapitalDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="占比（%）" prop="proportion">
                  <el-slider v-model="form.proportion" show-input />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="股东类型" prop="shareholderType">
                  <el-select v-model="form.shareholderType" placeholder="请选择">
                    <el-option
                      v-for="item in shareholderTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="股份类型" prop="shareType">
                  <el-select v-model="form.shareType" placeholder="请选择">
                    <el-option
                      v-for="item in shareTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="状态" prop="status">
                  <el-select v-model="form.status" placeholder="请选择">
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
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
              <el-col :span="8">
                <el-form-item label="经办人">
                  <el-input v-model="form.responsiblePerson" minlength="1" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="24">
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
              </el-col> -->
            </el-row>
            <!-- <el-form-item>
              <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
              <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
            </el-form-item> -->
          </el-collapse-item>
          <el-collapse-item v-if="!isAdd" title="二、股东认缴记录" name="2">
            <subcribeRecord
              v-if="formVisible"
              :enterpriseid="enterpriseCode"
              :enterprisename="form.enterpriseName"
              :shareholder="form.shareholder"
              :serialnumber="form.id"
              :currentregistrationtype="currentRegistrationType"
            />
          </el-collapse-item>
          <el-collapse-item v-if="!isAdd" title="三、股东实缴记录" name="3">
            <realityRecord
              v-if="formVisible"
              :enterpriseid="enterpriseCode"
              :enterprisename="form.enterpriseName"
              :shareholder="form.shareholder"
              :serialnumber="form.id"
              :currentregistrationtype="currentRegistrationType"
              :refresh="refreshCurrentShareholder"
            />
          </el-collapse-item>
          <el-collapse-item title="四、附件上传" name="4">
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
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-form>
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./capital-hw.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.dpShow {
  display: block;
}
.dpHide {
  display: none;
}
.my-autocomplete {
  li {
    line-height: 10px;
    padding: 5px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>


<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button
            v-permission="['/stockpledge/add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click.native="add"
          >{{ $t('button.add') }}</el-button>
          <el-button
            v-permission="['/stockpledge/edit']"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click.native="edit"
          >{{ $t('button.edit') }}</el-button>
          <el-button
            v-permission="['/stockpledge/delete']"
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
      <el-table-column label="登记编号" width="150">
        <template slot-scope="scope">{{ scope.row.registerCode }}</template>
      </el-table-column>
      <el-table-column label="出质人" width="150">
        <template slot-scope="scope">{{ scope.row.pledgor }}</template>
      </el-table-column>
      <el-table-column label="证照/证件号码(出质人)" width="200">
        <template slot-scope="scope">{{ scope.row.pledgorCertificateNumber }}</template>
      </el-table-column>
      <el-table-column label="出质股权数额" width="150">
        <template slot-scope="scope">{{ scope.row.pledgeStockContribution }}</template>
      </el-table-column>
      <el-table-column label="质权人" width="150">
        <template slot-scope="scope">{{ scope.row.pledgee }}</template>
      </el-table-column>
      <el-table-column label="证照/证件号码(质权人)" width="200">
        <template slot-scope="scope">{{ scope.row.pledgeeCertificateNumber }}</template>
      </el-table-column>
      <el-table-column label="股权出质设立登记日期" width="200">
        <template slot-scope="scope">{{ scope.row.stockPledgeRegisterDate.replace(' 00:00:00','') }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150" :formatter="formatterStockStatus" />
      <el-table-column label="经办人" width="150">
        <template slot-scope="scope">{{ scope.row.responsiblePerson }}</template>
      </el-table-column>
    </el-table>
    <br>
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

    <el-dialog :title="formTitle" :visible.sync="formVisible" width="70%">
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <el-row>
          <el-col :span="24">
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
                :default-checked-keys="[1]"
                :data="companyList"
                :props="companyTree.defaultProps"
                class="input-tree"
                @node-click="handleCompanyNodeClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登记编号">
              <el-input v-model="form.registerCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12" prop="responsiblePerson">
            <el-form-item label="经办人">
              <el-input v-model="form.responsiblePerson" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出质人" prop="pledgor">
              <el-input v-model="form.pledgor" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证照/证件号码(出质人)" prop="pledgorCertificateNumber">
              <el-input v-model="form.pledgorCertificateNumber" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质权人" prop="pledgee">
              <el-input v-model="form.pledgee" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证照/证件号码(质权人)" prop="pledgeeCertificateNumber">
              <el-input v-model="form.pledgeeCertificateNumber" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出质股权数额" prop="pledgeStockContribution">
              <el-input v-model.number="form.pledgeStockContribution" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="股权出质设立登记日期" prop="stockPledgeRegisterDate">
              <el-date-picker
                v-model="form.stockPledgeRegisterDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
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
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./stock_pledge.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>


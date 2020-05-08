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
      <el-table-column label="企业id">
        <template slot-scope="scope">
          {{ scope.row.enterpriseId }}
        </template>
      </el-table-column>
      <el-table-column label="企业名称变更状态">
        <template slot-scope="scope">
          {{ scope.row.enterpriseNameState }}
        </template>
      </el-table-column>
      <el-table-column label="旧企业名称">
        <template slot-scope="scope">
          {{ scope.row.enterpriseNameOld }}
        </template>
      </el-table-column>
      <el-table-column label="新企业名称">
        <template slot-scope="scope">
          {{ scope.row.enterpriseNameNew }}
        </template>
      </el-table-column>
      <el-table-column label="注册地址变更状态">
        <template slot-scope="scope">
          {{ scope.row.registeredAddressState }}
        </template>
      </el-table-column>
      <el-table-column label="旧注册地址">
        <template slot-scope="scope">
          {{ scope.row.registeredAddressOld }}
        </template>
      </el-table-column>
      <el-table-column label="新注册地址">
        <template slot-scope="scope">
          {{ scope.row.registeredAddressNew }}
        </template>
      </el-table-column>
      <el-table-column label="经营范围变更状态">
        <template slot-scope="scope">
          {{ scope.row.businessScopeState }}
        </template>
      </el-table-column>
      <el-table-column label="旧经营范围">
        <template slot-scope="scope">
          {{ scope.row.businessScopeOld }}
        </template>
      </el-table-column>
      <el-table-column label="新经营范围">
        <template slot-scope="scope">
          {{ scope.row.businessScopeNew }}
        </template>
      </el-table-column>
      <el-table-column label="其他文件">
        <template slot-scope="scope">
          {{ scope.row.otherFiles }}
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
      width="70%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业id">
              <el-input v-model="form.enterpriseId" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业名称变更状态">
              <el-input v-model="form.enterpriseNameState" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="旧企业名称">
              <el-input v-model="form.enterpriseNameOld" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新企业名称">
              <el-input v-model="form.enterpriseNameNew" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册地址变更状态">
              <el-input v-model="form.registeredAddressState" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="旧注册地址">
              <el-input v-model="form.registeredAddressOld" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新注册地址">
              <el-input v-model="form.registeredAddressNew" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营范围变更状态">
              <el-input v-model="form.businessScopeState" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="旧经营范围">
              <el-input v-model="form.businessScopeOld" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新经营范围">
              <el-input v-model="form.businessScopeNew" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他文件">
              <el-input v-model="form.otherFiles" minlength="1" />
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

<script src="./companyModify.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>


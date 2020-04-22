<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <!-- <el-button
            v-permission="['/shareholder/add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click.native="add"
          >{{ $t('button.add') }}</el-button>
          <el-button
            v-permission="['/shareholder/edit']"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click.native="edit"
          >{{ $t('button.edit') }}</el-button>
          <el-button
            v-permission="['/shareholder/delete']"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click.native="remove"
          >{{ $t('button.delete') }}</el-button> -->
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
      <el-table-column label="企业名称">
        <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
      </el-table-column>
      <el-table-column label="股东">
        <template slot-scope="scope">{{ scope.row.shareholder }}</template>
      </el-table-column>
      <el-table-column label="占比（%）" width="100">
        <template slot-scope="scope">{{ scope.row.proportion }}</template>
      </el-table-column>
      <el-table-column prop="shareholderType" label="类型" width="150" :formatter="formatterShareholderType" />
      <el-table-column prop="status" label="状态" width="150" :formatter="formatterShareholderStatus" />
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
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="所属公司名称" prop="enterpriseName">
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
          <el-col :span="24">
            <el-form-item label="股东">
              <el-input v-model="form.shareholder" :disabled="true" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="占比（%）">
              <el-input v-model="form.proportion" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="股东类型">
              <el-select v-model="form.shareholderType" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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

<script src="./shareholder.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>


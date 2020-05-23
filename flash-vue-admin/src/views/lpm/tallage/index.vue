<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button v-permission="['/tallage/add']" type="success" size="mini" icon="el-icon-plus" @click.native="add">{{ $t('button.add') }}</el-button>
          <el-button v-permission="['/tallage/edit']" type="primary" size="mini" icon="el-icon-edit" @click.native="edit">{{ $t('button.edit') }}</el-button>
          <el-button v-permission="['/tallage/delete']" type="danger" size="mini" icon="el-icon-delete" @click.native="remove">{{ $t('button.delete') }}</el-button>
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
      <el-table-column label="所属企业名称">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>
      <el-table-column label="税务登记号">
        <template slot-scope="scope">
          {{ scope.row.dutyParagraph }}
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="开户行">
        <template slot-scope="scope">
          {{ scope.row.openAccountBank }}
        </template>
      </el-table-column>
      <el-table-column label="银行账号">
        <template slot-scope="scope">
          {{ scope.row.bankAccount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="levyType"
        label="征收方式"
        width="150"
        :formatter="formatterLevyType"
      />
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
            <el-form-item label="税务登记号" prop="dutyParagraph">
              <el-input v-model="form.dutyParagraph" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input v-model="form.bankAccount" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行" prop="openAccountBank">
              <el-input v-model="form.openAccountBank" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行地址">
              <el-input v-model="form.address" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="form.phone" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="征收方式">
              <el-select v-model="form.levyType" placeholder="请选择">
                <el-option
                  v-for="item in levyTypeList"
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

<script src="./tallage.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>


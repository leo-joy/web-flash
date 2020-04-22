<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button
            v-permission="['/knowledgepledge/add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click.native="add"
          >{{ $t('button.add') }}</el-button>
          <el-button
            v-permission="['/knowledgepledge/edit']"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click.native="edit"
          >{{ $t('button.edit') }}</el-button>
          <el-button
            v-permission="['/knowledgepledge/delete']"
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
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">{{ scope.row.serialNumber }}</template>
      </el-table-column>
      <el-table-column label="企业名称" width="300">
        <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
      </el-table-column>
      <el-table-column label="知识产权登记证号" width="150">
        <template slot-scope="scope">{{ scope.row.propertyRegisterCode }}</template>
      </el-table-column>
      <el-table-column label="名称" width="300">
        <template slot-scope="scope">{{ scope.row.propertyName }}</template>
      </el-table-column>
      <el-table-column
        prop="propertyType"
        label="种类"
        width="150"
        :formatter="formatterPropertyType"
      />
      <el-table-column label="出质人名称" width="150">
        <template slot-scope="scope">{{ scope.row.pledgorName }}</template>
      </el-table-column>
      <el-table-column label="质权人名称" width="150">
        <template slot-scope="scope">{{ scope.row.pledgeeName }}</template>
      </el-table-column>
      <el-table-column label="质权登记期限" width="150">
        <template slot-scope="scope">{{ scope.row.pledgeeCertificateNumber }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="150" :formatter="formatterKnowledgeStatus" />

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
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司名称">
              <el-input
                v-model="form.enterpriseName"
                placeholder="请选择公司"
                readonly="readonly"
                @click.native="companyTree.show = !companyTree.show"
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
          <el-col :span="12">
            <el-form-item label="序号">
              <el-input v-model="form.serialNumber" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="知识产权登记证号">
              <el-input v-model="form.propertyRegisterCode" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input v-model="form.propertyName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="种类">
              <el-select v-model="form.propertyType" placeholder="请选择">
                <el-option
                  v-for="item in propertyTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出质人名称">
              <el-input v-model="form.pledgorName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质权人名称">
              <el-input v-model="form.pledgeeName" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质权登记期限">
              <el-input v-model="form.pledgeeCertificateNumber" minlength="1" />
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
          <el-col :span="12">
            <el-form-item label="经办人">
              <el-input v-model="form.responsiblePerson" minlength="1" />
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

<script src="./knowledge_pledge.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>


<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button
            v-if="companyListLength < 2"
            v-permission="['/mainmember/add']"
            type="success"
            icon="el-icon-plus"
            size="small"
            @click.native="add"
          >{{ $t('button.add') }}</el-button>
          <el-button
            v-permission="['/mainmember/edit']"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click.native="edit"
          >{{ $t('button.edit') }}</el-button>
          <el-button
            v-permission="['/mainmember/delete']"
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
      <el-table-column v-if="registrationType !== 2" label="董事长" width="100">
        <template slot-scope="scope">{{ scope.row.chairman }}</template>
      </el-table-column>
      <el-table-column label="董事">
        <template slot-scope="scope">{{ scope.row.director }}</template>
      </el-table-column>
      <el-table-column v-if="registrationType !== 2" label="监事" width="150">
        <template slot-scope="scope">{{ scope.row.supervisor }}</template>
      </el-table-column>
      <el-table-column v-if="registrationType !== 2" label="总经理" width="100">
        <template slot-scope="scope">{{ scope.row.generalManager }}</template>
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

    <el-dialog :title="formTitle" :visible.sync="formVisible" :append-to-body="true" width="80%">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
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
          <el-col v-if="registrationType !== 2" :span="12">
            <el-form-item label="董事长">
              <el-autocomplete
                v-model="form.chairman"
                style="width:100%"
                popper-class="my-autocomplete"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入姓名"
                @select="handleChairmanSelect"
              >
                <i
                  slot="suffix"
                  class="el-icon-circle-plus-outline el-input__icon"
                  @click="handleIconClick"
                />
                <template slot-scope="{ item }">
                  <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                  <span class="addr">电话：{{ item.phone }}</span>
                  <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col v-if="registrationType !== 2" :span="12">
            <el-form-item label="总经理">
              <el-autocomplete
                v-model="form.generalManager"
                style="width:100%"
                popper-class="my-autocomplete"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入姓名"
                @select="handleGeneralManagerSelect"
              >
                <i
                  slot="suffix"
                  class="el-icon-circle-plus-outline el-input__icon"
                  @click="handleIconClick"
                />
                <template slot-scope="{ item }">
                  <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                  <span class="addr">电话：{{ item.phone }}</span>
                  <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="董事">
              <div>
                <el-col :span="24">
                  <el-autocomplete
                    v-model="directorState"
                    style="width:100%"
                    popper-class="my-autocomplete"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入董事姓名"
                    @select="handleDirectorSelect"
                  >
                    <i
                      slot="suffix"
                      class="el-icon-circle-plus-outline el-input__icon"
                      @click="handleIconClick"
                    />
                    <el-tag
                      v-for="tag in directorTags"
                      slot="append"
                      :key="tag.name"
                      closable
                      @close="handleDirectorDelete(tag.id, tag.name)"
                    >{{ tag.name }}</el-tag>
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                      <span class="addr">电话：{{ item.phone }}</span>
                      <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                    </template>
                  </el-autocomplete>
                </el-col>
                <!-- <el-col :span="16">
                  <el-input v-model="form.director" minlength="1"></el-input>
                </el-col>-->
              </div>
            </el-form-item>
          </el-col>

          <el-col v-if="registrationType !== 2" :span="24">
            <el-form-item label="监事" prop="supervisor">
              <div>
                <el-col :span="24">
                  <el-autocomplete
                    v-model="supervisorState"
                    style="width:100%"
                    popper-class="my-autocomplete"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入监事姓名"
                    @select="handleSupervisorSelect"
                  >
                    <i
                      slot="suffix"
                      class="el-icon-circle-plus-outline el-input__icon"
                      @click="handleIconClick"
                    />
                    <el-tag
                      v-for="tag in supervisorTags"
                      slot="append"
                      :key="tag.name"
                      closable
                      @close="handleSupervisorDelete(tag.id, tag.name)"
                    >{{ tag.name }}</el-tag>
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.name }} <span class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                      <span class="addr">电话：{{ item.phone }}</span>
                      <span class="addr">&nbsp;&nbsp;&nbsp;&nbsp;邮箱：{{ item.email }}</span>
                    </template>
                  </el-autocomplete>
                </el-col>
                <!-- <el-col :span="16">
                  <el-input v-model="form.supervisor" minlength="1"></el-input>
                </el-col>-->
              </div>
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

    <!-- 高级管理人员 -->
    <el-dialog
      :title="formAdvancedUserTitle"
      :visible.sync="formAdvancedUserVisible"
      :append-to-body="true"
      width="80%"
      @close="initAdvancedUserList"
    >
      <advanced-user />
    </el-dialog>
  </div>
</template>

<script src="./main_member.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

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


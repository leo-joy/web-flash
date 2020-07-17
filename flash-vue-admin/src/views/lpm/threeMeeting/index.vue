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
      <el-table-column label="企业名称">
        <template slot-scope="scope">
          {{ scope.row.enterpriseName }}
        </template>
      </el-table-column>
      <el-table-column
        prop="meetingType"
        label="状态"
        :formatter="formatterMeetingType"
      />
      <el-table-column label="会议标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="开会日期" width="120px">
        <template slot-scope="scope">
          {{ scope.row.meetingDate.replace(' 00:00:00', '') }}
        </template>
      </el-table-column>
      <el-table-column label="组织者" width="100px">
        <template slot-scope="scope">
          {{ scope.row.organizers }}
        </template>
      </el-table-column>
      <el-table-column label="参会人员">
        <template slot-scope="scope">
          {{ scope.row.conferenceParticipant }}
        </template>
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
          <el-col :span="24">
            <el-form-item label="会议标题">
              <el-input v-model="form.title" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议议题">
              <el-input v-model="form.issue" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开会日期">
              <el-date-picker
                v-model="form.meetingDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="会议类型">
              <el-select v-model="form.meetingType" placeholder="请选择">
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
            <el-form-item label="组织者">
              <el-autocomplete
                v-model="form.organizers"
                style="width:100%"
                popper-class="my-autocomplete"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入姓名"
                @select="handleOrganizersSelect"
              >
                <i
                  slot="suffix"
                  class="el-icon-circle-plus-outline el-input__icon"
                  @click="handleIconClick"
                />
                <template slot-scope="{ item }">
                  <div class="name">{{ item.name }} <span v-if="item.workNumber" class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                  <span v-if="item.type*1 === 1" class="addr">类型：高级管理人员&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span v-if="item.type*1 === 2" class="addr">类型：自然人股东&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span v-if="item.jobName" class="addr">职务：{{ item.jobName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span class="addr">性别：{{ item.sexName }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参会人员">
              <div>
                <el-col :span="24">
                  <el-autocomplete
                    v-model="conferenceParticipantState"
                    style="width:100%"
                    popper-class="my-autocomplete"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入参会人员"
                    @select="handleConferenceParticipantSelect"
                  >
                    <i
                      slot="suffix"
                      class="el-icon-circle-plus-outline el-input__icon"
                      @click="handleIconClick"
                    />
                    <el-tag
                      v-for="tag in conferenceParticipantTags"
                      slot="append"
                      :key="tag.name"
                      closable
                      @close="handleConferenceParticipantDelete(tag.id, tag.name)"
                    >{{ tag.name }}</el-tag>
                    <template slot-scope="{ item }">
                      <div class="name">{{ item.name }} <span v-if="item.workNumber" class="addr"> &nbsp;&nbsp;&nbsp;&nbsp;工号：{{ item.workNumber }}</span></div>
                      <span v-if="item.type*1 === 1" class="addr">类型：高级管理人员&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span v-if="item.type*1 === 2" class="addr">类型：自然人股东&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span v-if="item.jobName" class="addr">职务：{{ item.jobName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span class="addr">性别：{{ item.sexName }}</span>
                    </template>
                  </el-autocomplete>
                </el-col>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议总结">
              <el-input v-model="form.meetingConclusion" minlength="1" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注信息">
              <el-input v-model="form.remark" minlength="1" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="会前文件">
              <el-input v-model="form.meetingFiles" minlength="1" />
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="会议文件">
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

<script src="./threeMeeting.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>


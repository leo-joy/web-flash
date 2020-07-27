<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="24">

        <el-col :span="16">
          <el-date-picker
            v-model="rangeDate"
            size="mini"
            type="datetimerange"
            range-separator="至"
            start-placeholder="发送起始日期"
            end-placeholder="发送截至日期"
            value-format="yyyyMMddHHmmss"
            align="right"
          />
          <el-button type="success" size="mini" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
        </el-col>
        <el-col :span="8">
          <el-button style="float:right" type="success" size="mini" icon="el-icon-plus" @click.native="add">高管离职提醒</el-button>
        </el-col>
      </el-row>
      <br>
      <!-- <el-row>
        <el-col :span="24">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click.native="clear">{{ $t('button.clear') }}</el-button>
        </el-col>
      </el-row> -->
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
      <!-- <el-table-column label="模板编码">
        <template slot-scope="scope">
          {{ scope.row.tplCode }}
        </template>
      </el-table-column> -->
      <el-table-column label="消息内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="接收者" width="150">
        <template slot-scope="scope">
          {{ scope.row.receiver }}
        </template>
      </el-table-column>
      <el-table-column label="发送日期" width="180">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="消息类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.type==0?"短信":"邮件" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.state==1?"成功":"失败" }}
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
          <el-col :span="14">
            <el-form-item label="提醒标题" prop="title">
              <el-input v-model="form.title" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="被提醒人邮箱" prop="to">
              <el-input v-model="form.to" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="提醒内容" prop="content">
              <el-input v-model="form.content" type="textarea" rows="5" />
            </el-form-item>
          </el-col>
        </el-row>
        <br>
        <el-form-item>
          <el-button type="primary" @click="save">{{ $t('button.submit') }}</el-button>
          <el-button @click.native="formVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>
</template>

<script src="./t_message.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/common.scss";
</style>


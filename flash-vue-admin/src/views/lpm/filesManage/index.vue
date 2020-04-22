<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-button icon="el-icon-search" circle @click="dialog = true" />
          {{ this.enterpriseName }}
          {{ this.legalRepresentative?'|  法人：'+this.legalRepresentative:'' }}
        </el-col>
      </el-row>
      <br>
      <el-drawer
        ref="drawer"
        title="搜索并查看企业相关附件信息"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        size="60%"
      >
        <div class="demo-drawer__content">
          <div class="app-container">
            <el-row :gutter="24">
              <el-col :span="6">
                <el-select v-model="searchType" placeholder="搜索类型">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-input v-model="keyword" placeholder="请输入搜索关键字" />
              </el-col>
              <el-col :span="6">
                <el-button
                  type="success"
                  icon="el-icon-search"
                  @click.native="search"
                >{{ $t('button.search') }}</el-button>
              </el-col>
            </el-row>
            <br>
            <el-table
              v-loading="listLoading"
              :data="list"
              height="300"
              element-loading-text="Loading"
              border
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <el-table-column type="index" width="50" />
              <el-table-column property="opt" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    icon="el-icon-log"
                    size="mini"
                    @click.native="viewArchitecture(scope.row)"
                  >查看</el-button>
                </template>
              </el-table-column>
              <el-table-column label="企业名称">
                <template slot-scope="scope">{{ scope.row.enterpriseName }}</template>
              </el-table-column>
              <el-table-column label="法定代表人" width="100">
                <template slot-scope="scope">{{ scope.row.legalRepresentative }}</template>
              </el-table-column>
            </el-table>
            <br>
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[5, 10, 20, 50, 100,500]"
              :page-size="listQuery.limit"
              :total="total"
              @size-change="changeSize"
              @current-change="fetchPage"
              @prev-click="fetchPrev"
              @next-click="fetchNext"
            />
          </div>
        </div>
      </el-drawer>
      <el-table
        :data="filesList?filesList:tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          prop="name"
          label="附件类别"
          width="180"
        />
        <el-table-column
          prop="originalFileName"
          label="附件文件名称"
        />
        <el-table-column
          prop="createTime"
          label="上传时间"
          width="180"
        />
        <el-table-column
          prop="fileStatus"
          label="状态"
          width="100"
          :formatter="formatterFileStatus"
        />
        <el-table-column labe="操作" width="180">
          <template v-if="scope.row.originalFileName" slot-scope="scope">
            <el-button
              icon="el-icon-log"
              size="mini"
              @click.native="viewPdf(scope.row.id,scope.row.originalFileName)"
            >查看</el-button>
            <el-button
              icon="el-icon-log"
              size="mini"
              @click.native="download(scope.row.id,scope.row.originalFileName)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="pdfTitle" :visible.sync="pdfVisible" width="60%">
        <template>
          <PDFView :src="src" />
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script src="./file_manage.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.block {
  position: relative;
  top: -20px;
  left: -10px;
  z-index: 10;
}
</style>


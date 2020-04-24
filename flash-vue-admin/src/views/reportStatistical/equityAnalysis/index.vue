<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button icon="el-icon-search" circle @click="dialog = true" />
        </el-col>
      </el-row>
      <br>
    </div>
    <el-drawer
      ref="drawer"
      title="搜索并查看企业股权结构图"
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
                  @click.native="viewArchitecture(scope.row.id)"
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

    <iframe
      :src="src"
      width="100%"
      height="100%"
      frameborder="0"
      scrolling="auto"
      style="background-color:#efefef;position:absolute;top:-9px;left:-9px;bottom:0px;right:0px;"
    />
  </div>
</template>

<script>
import { getList } from '@/api/lpm/businesslicense'
export default {
  name: 'EquityAnalysis',

  data() {
    return {
      src: '/d3tree/index.html?#906',
      searchType: 'enterpriseName',
      keyword: '',
      options: [{
        value: 'enterpriseName',
        label: '企业名称'
      }, {
        value: 'unifiedSocialCreditCode',
        label: '社会信用代码'
      }, {
        value: 'legalRepresentative',
        label: '法定代表人'
      }
      ],
      listQuery: {
        page: 1,
        limit: 5,
        id: undefined
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},

      table: false,
      dialog: false,
      loading: false

    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        console.log('response', response)
        this.list = response.data.records
        this.listLoading = false
        this.total = response.data.total
        this.listQuery.enterpriseName = ''
        this.listQuery.unifiedSocialCreditCode = ''
        this.listQuery.legalRepresentative = ''
      })
    },
    search() {
      console.log(this.searchType === 'enterpriseName')
      if (this.searchType === 'enterpriseName') {
        this.listQuery.enterpriseName = this.keyword
      }
      if (this.searchType === 'unifiedSocialCreditCode') {
        this.listQuery.unifiedSocialCreditCode = this.keyword
      }
      if (this.searchType === 'legalRepresentative') {
        this.listQuery.legalRepresentative = this.keyword
      }
      this.fetchData()
    },
    reset() {
      this.listQuery.id = ''
      this.fetchData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleClose() {

    },
    fetchNext() {
      this.listQuery.page = this.listQuery.page + 1
      this.fetchData()
    },
    fetchPrev() {
      this.listQuery.page = this.listQuery.page - 1
      this.fetchData()
    },
    fetchPage(page) {
      this.listQuery.page = page
      this.fetchData()
    },
    changeSize(limit) {
      this.listQuery.limit = limit
      this.fetchData()
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    viewArchitecture(id) {
      this.src = '/d3tree/index.html?id=' + id + '#' + id
      this.dialog = false
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.block {
  position: relative;
  top: -20px;
  left: -10px;
  z-index: 10;
}
</style>

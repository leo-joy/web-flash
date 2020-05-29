<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="filesList"
      element-loading-text="Loading"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column :label="fileTitle">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column width="180">
        <template slot-scope="scope">
          <el-button
            v-permission="['/file/view']"
            icon="el-icon-log"
            size="mini"
            @click.native="viewPdf(scope.row.id,scope.row.name)"
          >查看</el-button>
          <el-button
            v-permission="['/file/download']"
            icon="el-icon-log"
            size="mini"
            @click.native="download(scope.row.id,scope.row.name)"
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
</template>

<script>
import { getApiUrl } from '@/utils/utils'
import PDFView from '@/components/PdfView/index.vue'
// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { PDFView },

  props: {
    fileTitle: String,
    filesList: Array
  },
  data() {
    return {
      src: '',
      pdfTitle: '原文查看器',
      pdfVisible: false,
      listLoading: false,
      selRow: {}
    }
  },

  methods: {
    init() {},

    handleCurrentChange(currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    download(id, fileName) {
      window.location.href =
        getApiUrl() + '/file/download?idFile=' + id + '&fileName=' + fileName
    },

    viewPdf(id, fileName) {
      this.pdfVisible = true
      this.src =
        getApiUrl() + '/file/download?idFile=' + id + '&fileName=' + fileName
    }
  }
}
</script>

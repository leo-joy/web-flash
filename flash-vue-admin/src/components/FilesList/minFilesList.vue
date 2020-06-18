<template>
  <div>
    <el-row>
      <el-col v-for="file in filesList" :key="file.id">
        <el-button type="text" @click.native="viewPdf(file.id,file.name)">{{ file.name }}</el-button>
      </el-col>
    </el-row>
    <el-dialog :title="pdfTitle" :visible.sync="pdfVisible" width="80%">
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
        getApiUrl() + '/file/download?idFile=' + id + '&fileName=' + encodeURI(fileName)
    },

    viewPdf(id, fileName) {
      this.pdfVisible = true
      this.src =
        getApiUrl() + '/file/download?idFile=' + id + '&fileName=' + encodeURI(fileName)
    }
  }
}
</script>

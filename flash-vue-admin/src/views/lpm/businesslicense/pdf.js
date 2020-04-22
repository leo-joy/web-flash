import pdf from 'vue-pdf'
// 权限判断指令
import permission from '@/directive/permission/index.js'
export default {
  directives: { permission },
  components: { pdf },
  data() {
    return {
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'pdf', // 文件类型
      src: '/static/001.pdf' // pdf文件地址
    }
  },
  created: {
    // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
    // this.src = pdf.createLoadingTask(this.src)
  },
  methods: {
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
        // console.log(this.currentPage)
      }
    },

    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 1 // 加载的时候先加载第一页
    }

  }
}

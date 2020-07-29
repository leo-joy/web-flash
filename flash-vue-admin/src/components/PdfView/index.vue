<template>
  <div class="pdf">
    <div class="btnContainer">
      <el-button size="mini" icon="el-icon-arrow-left" @click="changePdfPage(0)">上一页</el-button>
      <el-button size="mini" @click="changePdfPage(1)">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
      <el-button size="mini" @click="rotateL()">&#x27F3; 顺时针旋转</el-button>
      <el-button size="mini" @click="rotateR()">&#x27F2; 逆时针旋转</el-button>
      <!-- <el-button size="mini" @click="scaleD()">+</el-button>
      <el-button size="mini" @click="scaleX()">-</el-button>
      <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前第 {{ currentPage }} 页， 总共 {{ pageCount }} 页</span> -->
      <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前第 {{ currentPage }} 页， 总共 {{ pageCount }} 页</span>
      <div
        v-if="loadedRatio > 0 && loadedRatio < 1"
        style="background-color: green; color: white; text-align: center"
        :style="{ width: loadedRatio * 100 + '%' }"
      >{{ Math.floor(loadedRatio * 100) }}%</div>
      <!-- <button @click="$refs.pdf.print()">print</button> -->
    </div>
    <pdf
      ref="pdf"
      style="border:1px dotted #efefef;padding:5px;background-color:#ffffff; display: inline-block;width:100%;"
      :src="src"
      :page="currentPage"
      :rotate="rotate"
      @password="password"
      @progress="onprogress"
      @error="error"
      @num-pages="pageCount=$event"
      @page-loaded="currentPage=$event"
      @loaded="loadPdfHandler"
      @link-clicked="currentPage = $event"
    />
    <!-- <div class="btnContainer" style="margin-bottom:30px;">
      <el-button size="mini" icon="el-icon-arrow-left" @click="changePdfPage(0)">上一页</el-button>
      <el-button size="mini" @click="changePdfPage(1)">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
      <el-button size="mini" @click="rotateL()">&#x27F3; 顺时针旋转</el-button>
      <el-button size="mini" @click="rotateR()">&#x27F2; 逆时针旋转</el-button>
      <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前第 {{ currentPage }} 页， 总共 {{ pageCount }} 页</span>
      <div
        v-if="loadedRatio > 0 && loadedRatio < 1"
        style="background-color: green; color: white; text-align: center"
        :style="{ width: loadedRatio * 100 + '%' }"
      >{{ Math.floor(loadedRatio * 100) }}%</div>
      <button @click="$refs.pdf.print()">print</button>
    </div> -->
  </div>
</template>
<style lang="scss">
 .pdf {
   margin-top:-30px;
   //overflow:auto;
 }
 .btnContainer {
   padding:5px 30px 5px 30px;
   float: right;
 }
</style>
<script>
import { Loading } from 'element-ui'
import pdf from 'vue-pdf'
export default {
  components: { pdf },
  props: {
    src: String
  },
  data() {
    return {
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'pdf', // 文件类型
      scale: 100, // 放大系数
      loadedRatio: 0,
      rotate: 0,
      process: 0
    }
  },
  // created: {
  //   // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
  //    //this.src = pdf.createLoadingTask(this.src)
  // },
  activated() {
    const pdfurl = this.src
    console.log(pdfurl)

    if (pdfurl) {
      this.src = decodeURIComponent(pdfurl)
    } else {
      this.$toast('无效的pdf')
      this.$router.go(-1)
    }
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

    // 放大
    scaleD() {
      this.scale += 20
      // this.$refs.wrapper.$el.style.transform = "scale(" + this.scale + ")";
      this.$refs.pdf.$el.style.width = parseInt(this.scale) + '%'
    },

    // 缩小
    scaleX() {
      if (this.scale === 100) {
        return
      }
      this.scale += -20
      this.$refs.pdf.$el.style.width = parseInt(this.scale) + '%'
      // this.$refs.wrapper.$el.style.transform = "scale(" + this.scale + ")";
    },

    onprogress(e) {
      this.loadingInstance = Loading.service({
        lock: true,
        text: (e * 100).toFixed(0),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (e === 1) {
        setTimeout(() => {
          this.loadingInstance.close()
        }, 10)
      }
    },

    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 1 // 加载的时候先加载第一页
      this.rotate = 0
      this.scale = 100
    },

    password(updatePassword, reason) {
      updatePassword(prompt('password is "test"'))
    },
    rotateL() {
      this.rotate = this.rotate + 90
    },
    rotateR() {
      this.rotate = this.rotate - 90
    },
    error(err) {
      if (err && err.message === 'Invalid PDF structure') {
        alert('您好！此文件不能在线预览！请下载查看！')
      }
    }
  }
}
</script>

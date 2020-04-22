<template>
  <div class="pdf">
    <div class="arrow">
      <button @click="changePdfPage(0)">上一页</button>
      {{currentPage}} / {{pageCount}}
      <button @click="changePdfPage(1)">下一页</button>
      <button @click="rotate += 90">&#x27F3;</button>
      <button @click="rotate -= 90">&#x27F2;</button>
      <div
        v-if="loadedRatio > 0 && loadedRatio < 1"
        style="background-color: green; color: white; text-align: center"
        :style="{ width: loadedRatio * 100 + '%' }"
      >{{ Math.floor(loadedRatio * 100) }}%</div>
      <!-- <button @click="$refs.pdf.print()">print</button> -->
      
    </div>
      
    <pdf
      ref="pdf"
      style="border: none; display: inline-block; width: 100%;"
      :src="src"
      :page="currentPage"
      :rotate="rotate"
      @password="password"
      @progress="loadedRatio = $event"
      @error="error"
      @num-pages="pageCount=$event"
      @page-loaded="currentPage=$event"
      @loaded="loadPdfHandler"
      @link-clicked="currentPage = $event"
    ></pdf>
    <div class="arrow">
      <button @click="changePdfPage(0)">上一页</button>
      {{currentPage}} / {{pageCount}}
      <button @click="changePdfPage(1)">下一页</button>
      <button @click="rotate += 90">&#x27F3;</button>
      <button @click="rotate -= 90">&#x27F2;</button>
      <div
        v-if="loadedRatio > 0 && loadedRatio < 1"
        style="background-color: green; color: white; text-align: center"
        :style="{ width: loadedRatio * 100 + '%' }"
      >{{ Math.floor(loadedRatio * 100) }}%</div>
      <!-- <button @click="$refs.pdf.print()">print</button> -->
      
    </div>
  </div>
</template>
<script>
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
      loadedRatio: 0,
      rotate: 0
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
    },
    password(updatePassword, reason) {
      updatePassword(prompt('password is "test"'))
    },
    error(err) {
      if(err && err.message === 'Invalid PDF structure') {
        alert('您好！此文件不能在线预览！请下载查看！')
      }
    }
  }
}
</script>

<template>
  <div class="pdf">
    <el-row>
      <el-col :span="24">
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
      </el-col>
      <el-col :span="24" style="position: relative;">
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
        <canvas id="marskCavas" style="position:absolute; left:0px; top:0px; right:0px; bottom:0px;" />
      </el-col>
    </el-row>

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
      this.setWatermark(1000, 1)
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
        text: '文件加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (e === 1) {
        setTimeout(() => {
          this.loadingInstance.close()
          this.setWatermark(1000, 1)
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
    },
    setWatermark(time, fz) {
      const watermarkArray = [{
        createTime: '2018-10-09T08:12:11.245Z',
        watermarkAlpha: '0.3',
        watermarkColor: 'gray',
        watermarkFontSize: '36',
        watermarkImg: '',
        watermarkPosition: '0',
        watermarkRotation: '-30',
        watermarkScale: '300%',
        watermarkText: '雅居乐档案共享中心',
        watermarkType: '文本',
        _id: '5bbc62dbbb7c5b001b4590b9' }]
      setTimeout(function() {
        const allCanvas = document.getElementsByTagName('canvas') // 获取标签名为canvas所有页面元素。
        const marskCavas = document.getElementById('marskCavas')

        const width = allCanvas[0].width
        const height = allCanvas[0].height

        marskCavas.width = width
        marskCavas.height = height

        const ctx = marskCavas.getContext('2d')

        ctx.textAlign = 'left'

        if (watermarkArray && watermarkArray.length > 0) {
          for (let i = 0; i < watermarkArray.length; i++) {
            const obj = watermarkArray[i]
            const fontsize = fz ? obj.watermarkFontSize * fz : obj.watermarkFontSize * 1
            ctx.fillStyle = obj.watermarkColor
            ctx.lineWidth = 1
            ctx.globalAlpha = obj.watermarkAlpha * 1
            ctx.font = fontsize + 'px Arial' // 图像中的字体
            const w = obj.watermarkText.length * fontsize

            const h = fontsize
            const angleInRadians = obj.watermarkRotation * 1 * Math.PI / 180
            let xx, yy
            switch (obj.watermarkPosition) {
              case '0':
                xx = 10
                yy = w / 2
                ctx.translate(xx + 0.5 * w, yy + 0.5 * h)
                ctx.rotate(angleInRadians) // 旋转角画布
                ctx.fillText(obj.watermarkText, -w / 2, -h / 2)

                break
              case '1':
                xx = (width - w) / 2
                yy = w / 2
                ctx.translate(xx + 0.5 * w, yy + 0.5 * h)
                ctx.rotate(angleInRadians)
                ctx.fillText(obj.watermarkText, -w / 2, -h / 2)

                break
              case '2':

                xx = (width - w) - 10
                yy = w / 2
                ctx.translate(xx + 0.5 * w, yy + 0.5 * h)
                ctx.rotate(angleInRadians)
                ctx.fillText(obj.watermarkText, -w / 2, -h / 2)

                break
              case '3':
                xx = 10
                yy = (height - h) / 2
                ctx.translate(xx + 0.5 * w, yy + 0.5 * h)
                ctx.rotate(angleInRadians)
                ctx.fillText(obj.watermarkText, -w / 2, -h / 2)
                break
              case '4':
                xx = (width - w) / 2
                yy = (height - h) / 2
                ctx.translate(xx + 0.5 * w, yy + 0.5 * h)
                ctx.rotate(angleInRadians)
                ctx.fillText(obj.watermarkText, -w / 2, -h / 2)

                break
              case '5':
                xx = (width - w) - 10
                yy = (height - h) / 2
                ctx.translate(xx + 0.5 * w, yy + 0.5 * h)
                ctx.rotate(angleInRadians)
                ctx.fillText(obj.watermarkText, -w / 2, -h / 2)

                break
              case '6':
                xx = 10
                yy = (height - h) - 100
                ctx.translate(xx + 0.5 * w, yy + 0.5 * h)
                ctx.rotate(angleInRadians)
                ctx.fillText(obj.watermarkText, -w / 2, -h / 2)

                break
              case '7':

                xx = (width - w) / 2
                yy = (height - h) - 100
                ctx.translate(xx + 0.5 * w, yy + 0.5 * h)
                ctx.rotate(angleInRadians)
                ctx.fillText(obj.watermarkText, -w / 2, -h / 2)

                break
              case '8':

                xx = (width - w) - 10
                yy = (height - h) - 100
                ctx.translate(xx + 0.5 * w, yy + 0.5 * h)
                ctx.rotate(angleInRadians)
                ctx.fillText(obj.watermarkText, -w / 2, -h / 2)
                break
              default:
            }
            ctx.rotate(-angleInRadians) // 还原画布角度
            ctx.translate(-xx - 0.5 * w, -yy - 0.5 * h)
          }
        }

        ctx.stroke()
      }, time || 100)
    }
  }
}
</script>

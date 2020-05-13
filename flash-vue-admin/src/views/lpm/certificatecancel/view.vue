<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="certificatecancelData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="dp-table-expand">
              <el-form-item label="是否正副本">
                <span>{{ formatterTranscriptStatus(props.row) }}</span>
              </el-form-item>
              <el-form-item label="副本编号">
                <span>{{ props.row.transcriptCode }}</span>
              </el-form-item>
              <el-form-item label="声明内容">
                <span>{{ props.row.statementContent }}</span>
              </el-form-item>
              <el-form-item label="声明日期">
                <span>{{ props.row.statementDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="是否补领">
                <span>{{ formatterReplaceStatus(props.row) }}</span>
              </el-form-item>
              <el-form-item label="补领日期">
                <span>{{ props.row.publicityDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="经办人">
                <span>{{ props.row.responsiblePerson }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="statementContent" label="声明内容" />
        <el-table-column label="声明日期" width="160">
          <template
            slot-scope="scope"
          >{{ scope.row.statementDate?scope.row.statementDate.replace(' 00:00:00',''):'' }}</template>
        </el-table-column>
        <el-table-column prop="responsiblePerson" label="经办人" width="100" />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListCertificatecancel.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListCertificatecancel" />
    </el-col>
  </el-row>
</template>
<style lang="scss">
.el-collapse-item__wrap {
  border: #ebeff5 dashed 1px;
  border-radius: 10px;
}
.dp-table-expand {
  font-size: 0;
}
.dp-table-expand label {
  width: 150px;
  color: #99a9bf;
}
.dp-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.dp-row {
  padding: 10px;
}
// 清除浮动
.clearfix:after {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}

.clearfix {
  zoom: 1;
}
// 底部按钮
.botmBtnContainer {
  text-align: center;
  padding: 20px;
}
//
.my-menu-vertical {
 position:fixed;
 top:180px;
 right:30px;
 z-index:10;
}
.my-menu-vertical .el-menu-item {
  height:36px;
  line-height: 36px;
}
</style>
<script src="./view.js"></script>

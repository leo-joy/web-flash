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

</style>
<script src="./view.js"></script>

<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="knowledgepledgeData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="dp-table-expand">
              <el-form-item label="知识产权登记证号">
                <span>{{ props.row.propertyRegisterCode }}</span>
              </el-form-item>
              <el-form-item label="名称">
                <span>{{ props.row.propertyName }}</span>
              </el-form-item>
              <el-form-item label="种类">
                <span>{{ formatterPropertyType(props.row) }}</span>
              </el-form-item>
              <el-form-item label="出质人">
                <span>{{ props.row.pledgorName }}</span>
              </el-form-item>
              <el-form-item label="质权人">
                <span>{{ props.row.pledgeeName }}</span>
              </el-form-item>
              <el-form-item label="质权登记期限">
                <span>{{ props.row.pledgeeCertificateNumber }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ formatterKnowledgeStatus(props.row) }}</span>
              </el-form-item>
              <el-form-item label="经办人">
                <span>{{ props.row.responsiblePerson }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="propertyName" label="名称" width="200" />
        <el-table-column prop="pledgorName" label="出质人" />
        <el-table-column prop="pledgeeName" label="质权人" />
        <el-table-column
          prop="status"
          label="状态"
          width="150"
          :formatter="formatterKnowledgeStatus"
        />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListKnowledgepledge.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListKnowledgepledge" />
    </el-col>
  </el-row>
</template>
<style lang="scss">

</style>
<script src="./view.js"></script>

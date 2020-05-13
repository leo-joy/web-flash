<template>
  <el-row>
    <el-col :span="24">
      <el-table :data="propertypledgeData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="dp-table-expand">
              <el-form-item label="登记编号">
                <span>{{ props.row.registerCode }}</span>
              </el-form-item>
              <el-form-item label="被担保债权数额">
                <span>{{ props.row.byAssureBondContribution }}</span>
              </el-form-item>
              <el-form-item label="登记机关">
                <span>{{ props.row.registerOrg }}</span>
              </el-form-item>
              <el-form-item label="登记日期">
                <span>{{ props.row.registerDate.replace(' 00:00:00','') }}</span>
              </el-form-item>
              <el-form-item label="状态">
                <span>{{ formatterPropertyStatus(props.row) }}</span>
              </el-form-item>
              <el-form-item label="经办人">
                <span>{{ props.row.responsiblePerson }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="registerCode" label="登记编号" width="160" />
        <el-table-column prop="registerOrg" label="登记机关" />
        <el-table-column label="登记日期" width="120">
          <template
            slot-scope="scope"
          >{{ scope.row.registerDate?scope.row.registerDate.replace(' 00:00:00',''):'' }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          :formatter="formatterPropertyStatus"
        />
      </el-table>
    </el-col>
    <el-col v-if="accessoryFilesListPropertypledge.length>0" :span="24">
      <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListPropertypledge" />
    </el-col>
  </el-row>
</template>
<style lang="scss">

</style>
<script src="./view.js"></script>

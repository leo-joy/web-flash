<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="3">
            <div class="grid-content bg-purple">&nbsp;</div>
          </el-col>
          <el-col :span="16">
            <!-- <el-button icon="el-icon-back" @click.native="back">{{ $t('button.back') }}</el-button>
            <el-button
              @click="exportWord('input.docx','test.docx')"
              size="small"
              type="primary"
            >test</el-button>
            <el-button
              @click="exportWord('L93-NAR1.docx','年度报表.docx')"
              size="small"
              type="primary"
            >导出年度报表</el-button>
            <el-button
              @click="exportWord('Members.docx','股东名册.docx')"
              size="small"
              type="primary"
            >导出股东名册</el-button> -->
            <el-button
              size="small"
              @click="exportWord('Directors.docx',businesslicenseData.enterpriseName+'-董事名册.docx')"
            >导出董事名册</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content bg-purple">&nbsp;</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <div class="grid-content bg-purple">&nbsp;</div>
          </el-col>
          <el-col :span="16">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item name="1">
                <template slot="title">一、营业执照信息</template>
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/modifylog/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="viewLog('营业执照信息', '编辑营业执照',businesslicenseData.id)"
                    >变更记录</el-button>
                    <el-button
                      v-if="hasMenu('/businesslicense/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/businesslicense/edit',businesslicenseData.id)"
                    >变更</el-button>
                    <el-button
                      v-if="hasMenu('/businesslicense/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/businesslicense',businesslicenseData.id)"
                    >添加</el-button>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="组织属性：">{{ businesslicenseData.pName }}</el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="企业名称：">{{ businesslicenseData.enterpriseName }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="企业英文名称：">{{ businesslicenseData.enterpriseNameEn }}</el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      label="统一社会信用代码："
                    >{{ businesslicenseData.unifiedSocialCreditCode }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="企业类型：">{{ enterpriseType }}</el-form-item>
                  </el-col>
                  <!-- <el-col :span="12">
                    <el-form-item label="企业编码：">{{ businesslicenseData.enterpriseCode }}</el-form-item>
                  </el-col> -->
                </el-row>
                <!-- <el-row>
                  <el-col :span="12">
                    <el-form-item label="企业商业名称：">{{ businesslicenseData.enterpriseNameBusiness }}</el-form-item>
                  </el-col>
                </el-row> -->

                <el-row>
                  <!-- <el-col :span="12">
                    <el-form-item label="自定义企业类型：">{{ customTypeBL }}</el-form-item>
                  </el-col> -->
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="企业注册地：">{{ registrationPlaceBL }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="企业注册类型：">{{ registrationTypeBL }}</el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="法定代表人：">{{ businesslicenseData.legalRepresentative }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="负责人：">{{ businesslicenseData.legalRepresentative }}</el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      label="注册资本(万元)："
                    >{{ businesslicenseData.registeredCapital }} {{ currencyBL }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="成立日期："
                    >{{ businesslicenseData.setupDate?businesslicenseData.setupDate.replace(' 00:00:00',''):'' }}</el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      label="营业期限自："
                    >{{ businesslicenseData.operatingPeriodFrom?businesslicenseData.operatingPeriodFrom.replace(' 00:00:00',''):'' }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="取得日期："
                    >{{ businesslicenseData.achieveDate?businesslicenseData.achieveDate.replace(' 00:00:00',''):'' }}</el-form-item>
                  </el-col>

                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      label="营业期限至："
                    >{{ businesslicenseData.operatingPeriodEnd?businesslicenseData.operatingPeriodEnd.replace(' 00:00:00',''):'' }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="核准日期："
                    >{{ businesslicenseData.approvalDate?businesslicenseData.approvalDate.replace(' 00:00:00',''):'' }}</el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="12">
                    <el-form-item label="登记机关：">{{ businesslicenseData.registrationAuthority }}</el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="登记状态：">{{ registrationStatusBL }}</el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="地址：">{{ businesslicenseData.registeredAddress }}</el-form-item>
                  </el-col>
                  <!-- <el-col :span="12">
                    <el-form-item label="经营地址：">{{ businesslicenseData.businessAddress }}</el-form-item>
                  </el-col> -->
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="经营范围：">{{ businesslicenseData.businessScope }}</el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="备注：">{{ businesslicenseData.remark }}</el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="businessLicenseListBL.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="营业执照附件" :files-list="businessLicenseListBL" />
                  </el-col>
                </el-row>

                <el-row v-if="approvalFilesListBL.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="核准文件附件" :files-list="approvalFilesListBL" />
                  </el-col>
                </el-row>

                <el-row v-if="companyArticlesAssociationListBL.length>0">
                  <el-col :span="24">
                    <FilesListComponent
                      file-title="公司章程附件"
                      :files-list="companyArticlesAssociationListBL"
                    />
                  </el-col>
                </el-row>

                <el-row v-if="shareholdersDecideListBL.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="股东决定附件" :files-list="shareholdersDecideListBL" />
                  </el-col>
                </el-row>

                <el-row v-if="applicationRegistrationFilesListBL.length>0">
                  <el-col :span="24">
                    <FilesListComponent
                      file-title="申请注册文件"
                      :files-list="applicationRegistrationFilesListBL"
                    />
                  </el-col>
                </el-row>

                <el-row v-if="otherFilesListBL.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="其他文件" :files-list="otherFilesListBL" />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="二、主要人员信息" name="2">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/modifylog/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="viewLog('主要人员信息', '编辑主要人员信息', businesslicenseData.id)"
                    >变更记录</el-button>
                    <el-button
                      v-if="hasMenu('/mainmember/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/mainmember',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/mainmember/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/mainmember',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="mainmemberData" style="width: 100%">
                  <el-table-column prop="chairman" label="董事长" width="100">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        @click="userDetail(scope.row, 'chairman', scope.row.chairman)"
                      >{{ scope.row.chairman }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="director" label="董事">
                    <template slot-scope="scope">
                      <el-button
                        v-for="(name, i) in scope.row.director.split('、')"
                        :key="i"
                        type="text"
                        @click="userDetail(scope.row, 'director', name)"
                      >{{ name }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="supervisor" label="监事" width="100">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        @click="userDetail(scope.row, 'supervisor', scope.row.supervisor)"
                      >{{ scope.row.supervisor }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="generalManager" label="总经理" width="100">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        @click="userDetail(scope.row, 'generalManager', scope.row.generalManager)"
                      >{{ scope.row.generalManager }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row v-if="accessoryFilesListMainmember.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListMainmember" />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="三、股东信息" name="3">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/modifylog/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="viewLog('股东信息', '编辑股东信息',businesslicenseData.id)"
                    >变更记录</el-button>
                    <el-button
                      v-if="hasMenu('/shareholder/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/shareholder',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/shareholder/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/shareholder',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="shareholderData" style="width: 100%">
                  <el-table-column prop="shareholder" label="股东" />
                  <el-table-column label="占比（%）" width="100">
                    <template
                      slot-scope="scope"
                    >{{ scope.row.proportion*100 }}</template>
                  </el-table-column>
                  <el-table-column
                    prop="shareholderType"
                    label="类型"
                    :formatter="formatterShareholderType"
                    width="160"
                  />
                  <el-table-column
                    prop="status"
                    label="状态"
                    :formatter="formatterShareholderStatus"
                    width="100"
                  />
                </el-table>
                <el-row v-if="accessoryFilesListShareholder.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListShareholder" />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="四、印章信息" name="4">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/modifylog/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="viewLog('印章信息', '编辑印章信息',businesslicenseData.id)"
                    >变更记录</el-button>
                    <el-button
                      v-if="hasMenu('/seal/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/seal',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/seal/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/seal',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="sealData" style="width: 100%">
                  <el-table-column prop="sealName" label="印章名称" />
                  <el-table-column label="启用日期" width="120">
                    <template slot-scope="scope">{{ scope.row.activeDate.replace(' 00:00:00','') }}</template>
                  </el-table-column>
                  <el-table-column label="作废日期" width="120">
                    <template slot-scope="scope">{{ scope.row.obsoleteDate.replace(' 00:00:00','') }}</template>
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    label="状态"
                    width="100"
                    :formatter="formatterSealStatus"
                  />
                </el-table>
                <el-row v-if="accessoryFilesListSeal.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListSeal" />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="五、企业年报信息" name="5">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/modifylog/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="viewLog('企业年报信息', '编辑企业年报信息',businesslicenseData.id)"
                    >变更记录</el-button>
                    <el-button
                      v-if="hasMenu('/annals/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/annals',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/annals/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/annals',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="annalsData" style="width: 100%">
                  <el-table-column prop="submissionYear" label="报送年度" width="180" />
                  <el-table-column label="报送日期" width="150">
                    <template
                      slot-scope="scope"
                    >{{ scope.row.submissionDate.replace(' 00:00:00','') }}</template>
                  </el-table-column>
                  <el-table-column prop="responsiblePerson" label="经办人" />
                </el-table>
                <el-row v-if="accessoryFilesListAnnals.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListAnnals" />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="六、股权及出资信息" name="6">
                <template>
                  <el-row class="dp-row">
                    <el-col :span="24">
                      <el-button
                        v-if="hasMenu('/modifylog/edit')"
                        icon="el-icon-log"
                        size="mini"
                        @click.native="viewLog('股权及出资信息', '编辑股权及出资信息',businesslicenseData.id)"
                      >变更记录</el-button>
                      <el-button
                        v-if="hasMenu('/capital/add')"
                        icon="el-icon-log"
                        size="mini"
                        @click.native="editInfo('/capital',businesslicenseData.id)"
                      >添加</el-button>
                      <el-button
                        v-if="hasMenu('/capital/edit')"
                        icon="el-icon-log"
                        size="mini"
                        @click.native="editInfo('/capital',businesslicenseData.id)"
                      >变更</el-button>
                    </el-col>
                  </el-row>
                  <el-table :data="capitalData" style="width: 100%">
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="dp-table-expand">
                          <el-form-item label="股东">
                            <span>{{ props.row.shareholder }}</span>
                          </el-form-item>
                          <el-form-item label="占比（%）">
                            <span>{{ props.row.proportion*100 }}</span>
                          </el-form-item>
                          <el-form-item label="认缴出资方式">
                            <span>{{ formatterSubscribedCapitalType(props.row) }}</span>
                          </el-form-item>
                          <el-form-item label="认缴出资额（万元）">
                            <span>{{ props.row.subscribedCapitalContribution }}</span>
                          </el-form-item>
                          <el-form-item label="认缴出资日期">
                            <span>{{ props.row.subscribedCapitalDate.replace(' 00:00:00','') }}</span>
                          </el-form-item>
                          <el-form-item label="实缴出资方式">
                            <span>{{ formatterRealityCapitalType(props.row) }}</span>
                          </el-form-item>
                          <el-form-item label="实缴出资额（万元）">
                            <span>{{ props.row.realityCapitalContribution }}</span>
                          </el-form-item>
                          <el-form-item label="实缴出资日期">
                            <span>{{ props.row.realityCapitalDate.replace(' 00:00:00','') }}</span>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column prop="shareholder" label="股东" />
                    <el-table-column label="占比（%）">
                      <template
                        slot-scope="scope"
                      >{{ scope.row.proportion*100 }}</template>
                    </el-table-column>

                    <el-table-column
                      prop="subscribedCapitalContribution"
                      label="认缴出资额（万元）"
                      width="100"
                    />
                    <el-table-column
                      prop="realityCapitalContribution"
                      label="实缴出资额（万元）"
                      width="100"
                    />
                    <el-table-column label="实缴出资日期" width="120">
                      <template
                        slot-scope="scope"
                      >{{ scope.row.realityCapitalDate.replace(' 00:00:00','') }}</template>
                    </el-table-column>
                  </el-table>
                </template>
                <el-row v-if="accessoryFilesListCapital.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListCapital" />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="七、行政许可信息" name="7">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/modifylog/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="viewLog('行政许可信息', '编辑行政许可信息',businesslicenseData.id)"
                    >变更记录</el-button>
                    <el-button
                      v-if="hasMenu('/administrativelicense/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/administrativelicense',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/administrativelicense/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/administrativelicense',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="administrativelicenseData" style="width: 100%">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="dp-table-expand">
                        <el-form-item label="许可文件编号">
                          <span>{{ props.row.permissionFileCode }}</span>
                        </el-form-item>
                        <el-form-item label="许可文件名称">
                          <span>{{ props.row.permissionFileName }}</span>
                        </el-form-item>
                        <el-form-item label="有效期自">
                          <span>{{ props.row.validityFrom.replace(' 00:00:00','') }}</span>
                        </el-form-item>
                        <el-form-item label="有效日期至">
                          <span>{{ props.row.validityEnd.replace(' 00:00:00','') }}</span>
                        </el-form-item>
                        <el-form-item label="许可机关">
                          <span>{{ props.row.permissionOrg }}</span>
                        </el-form-item>
                        <el-form-item label="许可内容">
                          <span>{{ props.row.permissionContent }}</span>
                        </el-form-item>
                        <el-form-item label="状态">
                          <span>{{ formatterLicenseStatus(props.row) }}</span>
                        </el-form-item>
                        <el-form-item label="经办人">
                          <span>{{ props.row.responsiblePerson }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="permissionFileName" label="许可文件名称" />
                  <el-table-column prop="permissionOrg" label="许可机关" width="160" />
                  <el-table-column label="有效期自" width="100">
                    <template
                      slot-scope="scope"
                    >{{ scope.row.validityFrom?scope.row.validityFrom.replace(' 00:00:00',''):'' }}</template>
                  </el-table-column>
                  <el-table-column label="有效日期至" width="100">
                    <template
                      slot-scope="scope"
                    >{{ scope.row.validityEnd?scope.row.validityEnd.replace(' 00:00:00',''):'' }}</template>
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    label="状态"
                    width="100"
                    :formatter="formatterLicenseStatus"
                  />
                </el-table>
                <el-row v-if="accessoryFilesListAdministrativelicense.length>0">
                  <el-col :span="24">
                    <FilesListComponent
                      file-title="相关附件"
                      :files-list="accessoryFilesListAdministrativelicense"
                    />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="八、行政处罚信息" name="8">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/modifylog/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="viewLog('行政处罚信息', '编辑行政处罚信息',businesslicenseData.id)"
                    >变更记录</el-button>
                    <el-button
                      v-if="hasMenu('/administrativepunish/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/administrativepunish',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/administrativepunish/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/administrativepunish',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="administrativepunishData" style="width: 100%">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="dp-table-expand">
                        <el-form-item label="决定书文号">
                          <span>{{ props.row.decisionReferenceNumber }}</span>
                        </el-form-item>
                        <el-form-item label="违法行为类型">
                          <span>{{ formatterPunishType(props.row) }}</span>
                        </el-form-item>
                        <el-form-item label="行政处罚内容">
                          <span>{{ props.row.administrativePunishContent }}</span>
                        </el-form-item>
                        <el-form-item label="决定机关名称">
                          <span>{{ props.row.decisionOrgName }}</span>
                        </el-form-item>
                        <el-form-item label="处罚决定日期">
                          <span>{{ props.row.validityFrom.replace(' 00:00:00','') }}</span>
                        </el-form-item>
                        <el-form-item label="公示日期">
                          <span>{{ props.row.publicityDate.replace(' 00:00:00','') }}</span>
                        </el-form-item>
                        <el-form-item label="备注">
                          <span>{{ props.row.remark }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="decisionReferenceNumber" label="决定书文号" width="160" />
                  <el-table-column prop="decisionOrgName" label="决定机关名称" width="200" />
                  <el-table-column prop="administrativePunishContent" label="行政处罚内容" />
                  <el-table-column label="公示日期" width="150">
                    <template
                      slot-scope="scope"
                    >{{ scope.row.publicityDate?scope.row.publicityDate.replace(' 00:00:00',''):'' }}</template>
                  </el-table-column>
                </el-table>
                <el-row v-if="accessoryFilesListAdministrativepunish.length>0">
                  <el-col :span="24">
                    <FilesListComponent
                      file-title="相关附件"
                      :files-list="accessoryFilesListAdministrativepunish"
                    />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="九、证照作废声明" name="9">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/modifylog/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="viewLog('证照作废声明', '编辑证照作废声明',businesslicenseData.id)"
                    >变更记录</el-button>
                    <el-button
                      v-if="hasMenu('/certificatecancel/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/certificatecancel',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/certificatecancel/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/certificatecancel',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
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
                <el-row v-if="accessoryFilesListCertificatecancel.length>0">
                  <el-col :span="24">
                    <FilesListComponent
                      file-title="相关附件"
                      :files-list="accessoryFilesListCertificatecancel"
                    />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="十、清算信息" name="10">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/modifylog/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="viewLog('清算信息', '编辑清算信息',businesslicenseData.id)"
                    >变更记录</el-button>
                    <el-button
                      v-if="hasMenu('/liquidation/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/liquidation',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/liquidation/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/liquidation',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="liquidationData" style="width: 100%">
                  <el-table-column prop="liquidationTeamLeader" label="清算组负责人" width="160" />
                  <el-table-column prop="liquidationTeamMember" label="清算组成员" />
                </el-table>
                <el-row v-if="accessoryFilesListLiquidation.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListLiquidation" />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="十一、分公司信息" name="11">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/branchcompany/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/branchcompany',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/branchcompany/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/branchcompany',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="branchcompanyData" style="width: 100%">
                  <el-table-column prop="unifiedSocialCreditCode" label="统一社会信用代码" width="200" />
                  <el-table-column prop="enterpriseName" label="企业名称" />
                  <el-table-column prop="legalRepresentative" label="法定代表人" width="120" />
                  <el-table-column label="详情" width="80">
                    <template slot-scope="scope">
                      <el-button type="text" @click="detail(scope.row)">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="十二、投资企业" name="12">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/investcompany/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/investcompany',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/investcompany/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/investcompany',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="investcompanyData" style="width: 100%">
                  <el-table-column prop="unifiedSocialCreditCode" label="统一社会信用代码" width="200" />
                  <el-table-column prop="enterpriseName" label="企业名称" />
                  <el-table-column prop="legalRepresentative" label="法定代表人" width="120" />
                  <el-table-column label="详情" width="80">
                    <template slot-scope="scope">
                      <el-button type="text" @click="detail(scope.row)">详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="十三、动产抵押登记信息" name="13">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/propertypledge/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/propertypledge',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/propertypledge/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/propertypledge',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="propertypledgeData" style="width: 100%">
                  <el-row class="dp-row">
                    <el-col :span="24">
                      <el-button
                        v-if="hasMenu('/stockpledge/add')"
                        icon="el-icon-log"
                        size="mini"
                        @click.native="editInfo('/stockpledge',businesslicenseData.id)"
                      >添加</el-button>
                      <el-button
                        v-if="hasMenu('/stockpledge/edit')"
                        icon="el-icon-log"
                        size="mini"
                        @click.native="editInfo('/properstockpledgetypledge',businesslicenseData.id)"
                      >变更</el-button>
                    </el-col>
                  </el-row>
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
                <el-row v-if="accessoryFilesListPropertypledge.length>0">
                  <el-col :span="24">
                    <FilesListComponent
                      file-title="相关附件"
                      :files-list="accessoryFilesListPropertypledge"
                    />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="十四、股权出质登记信息" name="14">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/stockpledge/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/stockpledge',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/stockpledge/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/stockpledge',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="stockpledgeData" style="width: 100%">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="dp-table-expand">
                        <el-form-item label="登记编号">
                          <span>{{ props.row.registerCode }}</span>
                        </el-form-item>
                        <el-form-item label="出质人">
                          <span>{{ props.row.pledgor }}</span>
                        </el-form-item>
                        <el-form-item label="证照/证件号码(出质人)">
                          <span>{{ props.row.pledgorCertificateNumber }}</span>
                        </el-form-item>
                        <el-form-item label="出质股权数额">
                          <span>{{ props.row.pledgeStockContribution }}</span>
                        </el-form-item>
                        <el-form-item label="质权人">
                          <span>{{ props.row.pledgee }}</span>
                        </el-form-item>
                        <el-form-item label="证照/证件号码(质权人)">
                          <span>{{ props.row.pledgeeCertificateNumber }}</span>
                        </el-form-item>
                        <el-form-item label="股权出质设立登记日期">
                          <span>{{ props.row.stockPledgeRegisterDate.replace(' 00:00:00','') }}</span>
                        </el-form-item>
                        <el-form-item label="状态">
                          <span>{{ formatterStockStatus(props.row) }}</span>
                        </el-form-item>
                        <el-form-item label="经办人">
                          <span>{{ props.row.responsiblePerson }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="registerCode" label="登记编号" width="150" />
                  <el-table-column prop="pledgor" label="出质人" />
                  <el-table-column prop="pledgeStockContribution" label="出质股权数额" width="160" />
                  <el-table-column prop="pledgee" label="质权人" />
                  <el-table-column
                    prop="status"
                    label="状态"
                    width="120"
                    :formatter="formatterStockStatus"
                  />
                </el-table>
                <el-row v-if="accessoryFilesListStockpledge.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListStockpledge" />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="十五、知识产权出质登记信息" name="15">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/knowledgepledge/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/knowledgepledge',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/knowledgepledge/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/knowledgepledge',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
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
                        <el-form-item label="出质人名称">
                          <span>{{ props.row.pledgorName }}</span>
                        </el-form-item>
                        <el-form-item label="质权人名称">
                          <span>{{ props.row.pledgeeName }}</span>
                        </el-form-item>
                        <el-form-item label="质权登记期限">
                          <span>{{ props.row.pledgeeCertificateNumber }}</span>
                        </el-form-item>
                        <el-form-item label="状态">
                          <span>{{ formatterStockStatus(props.row) }}</span>
                        </el-form-item>
                        <el-form-item label="经办人">
                          <span>{{ props.row.responsiblePerson }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="propertyName" label="名称" width="200" />
                  <el-table-column prop="pledgorName" label="出质人名称" />
                  <el-table-column prop="pledgeeName" label="质权人名称" />
                  <el-table-column
                    prop="status"
                    label="状态"
                    width="150"
                    :formatter="formatterKnowledgeStatus"
                  />
                </el-table>
                <el-row v-if="accessoryFilesListKnowledgepledge.length>0">
                  <el-col :span="24">
                    <FilesListComponent
                      file-title="相关附件"
                      :files-list="accessoryFilesListKnowledgepledge"
                    />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
              <el-collapse-item title="十六、商标信息" name="16">
                <el-row class="dp-row">
                  <el-col :span="24">
                    <el-button
                      v-if="hasMenu('/trademark/add')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/trademark',businesslicenseData.id)"
                    >添加</el-button>
                    <el-button
                      v-if="hasMenu('/trademark/edit')"
                      icon="el-icon-log"
                      size="mini"
                      @click.native="editInfo('/trademark',businesslicenseData.id)"
                    >变更</el-button>
                  </el-col>
                </el-row>
                <el-table :data="trademarkData" style="width: 100%">
                  <el-table-column prop="trademarkRegisterCode" label="注册号" width="160" />
                  <el-table-column prop="trademarkName" label="商标名称" />
                  <el-table-column
                    prop="trademarkType"
                    label="类别"
                    width="150"
                    :formatter="formatterTrademarkType"
                  />
                  <el-table-column label="注册日期" width="160">
                    <template
                      slot-scope="scope"
                    >{{ scope.row.trademarkRegisterDate?scope.row.trademarkRegisterDate.replace(' 00:00:00',''):'' }}</template>
                  </el-table-column>
                  <el-table-column prop="responsiblePerson" label="经办人" width="100" />
                </el-table>
                <el-row v-if="accessoryFilesListTrademark.length>0">
                  <el-col :span="24">
                    <FilesListComponent file-title="相关附件" :files-list="accessoryFilesListTrademark" />
                  </el-col>
                </el-row>
              </el-collapse-item>
              <br>
              <br>
            </el-collapse>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">&nbsp;</div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-dialog :title="logTitle" :visible.sync="logVisible" width="60%">
      <template>
        <el-table :data="logList" style="width: 100%">
          <el-table-column prop="title" label="变更信息" width="150" />
          <el-table-column prop="oldValue" label="旧值" />
          <el-table-column prop="newValue" label="新值" />
          <el-table-column prop="modifyTime" label="变更时间" width="160" />
          <el-table-column prop="userName" label="变更操作人" width="150" />
        </el-table>
      </template>
    </el-dialog>
    <el-dialog :title="userInfoTitle" :visible.sync="userInfoVisible" width="60%">
      <template>
        <el-form label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名：">{{ userInfoList.name }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文名：">{{ userInfoList.name }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号：">{{ userInfoList.workNumber }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：">{{ userInfoList.sexName }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="电话：">{{ userInfoList.phone }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱：">{{ userInfoList.email }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </el-dialog>
  </div>
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
</style>
<script src="./detail.js"></script>

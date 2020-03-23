<template>
  <div>
    <!-- 目录地址-->
    <!-- 文件路径 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>我的文档</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in filePathItem" :key="item.num" class="file-path-item">{{item}}</el-breadcrumb-item>
      <div>
        <el-dropdown class="creatNewFolder">
          <span>创建文件夹</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><span @click="createFolderDialog = true">文件夹</span></el-dropdown-item>
            <el-dropdown-item>文件</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <span class="stepBack" @click="stepBack()">回退</span>
      </div>
      <div>
        <span class="el-icon-refresh refreshFiles" @click="refreshFiles()"></span>
      </div>
    </el-breadcrumb>
    <!-- 文件区域 -->
    <el-card>
      <div class="folderAndTxt" v-for="item in currentPathFiles" :key="item.num">
        <div v-if="item.folderBool === 0" class="txt-item">
          <el-dropdown class="edit">
            <span class="el-dropdown-link">
              <i class="el-icon-s-tools"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="deleteFile(item.folderUrl)">删除</span></el-dropdown-item>
              <el-dropdown-item>编辑</el-dropdown-item>
              <el-dropdown-item>重命名</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <img src="../assets/picture/text.png" />
          <span class="txt-item-name">{{item.folderName}}</span>
        </div>
        <div v-else class="folder-item" @click="intoFolder(item.folderName)">
          <el-dropdown class="edit">
            <span class="el-dropdown-link">
              <i class="el-icon-s-tools"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="deleteFile(item.folderUrl)">删除</span></el-dropdown-item>
              <el-dropdown-item>重命名</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <img src="../assets/picture/folder.png" />
          <span class="folder-item-name">{{item.folderName}}</span>
        </div>
      </div>
      <!-- 文件上传部分 -->
      <div class="upload">
        <el-upload class="upload-demo" ref="upload" action="http://localhost:8888/folder/uploadFile" :on-change="handleChange"
          :file-list="fileList" :auto-upload="false" :data="uploadData" :limit="3"
          :on-success="fileUploadSuccess">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload()">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">文件不超过500kb, 一次最多上传3个文件.</div>
        </el-upload>
      </div>
    </el-card>
    <!-- dialog部分 -->
    <!-- 文件夹dialog -->
    <el-dialog title="创建文件夹" :visible="createFolderDialog">
      <el-form :model="createFolderForm" ref="createFolderForm">
        <el-form-item label="文件夹名称">
          <el-input v-model="createFolderForm.folderName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFolderDialog = false">取 消</el-button>
        <el-button type="primary" @click="createFolder(); createFolderDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getCurrentPathFiles()
  },
  data () {
    return {
      fileList: [],
      userName: '',
      // 当前路径选项, 用以渲染页面路径头
      filePathItem: [],
      // 完整当前路径
      filePath: '',
      // 页面文件
      currentPathFiles: '',
      // 上传文件携带数据
      uploadData: {
        userName: window.sessionStorage.getItem('fileCloudToken').split('_')[0],
        targetFilePath: ''
      },
      // 创建文件夹dialog
      createFolderDialog: false,
      // 创建文件的form
      createFolderForm: {},
      // 创建文件dialog
      createFileDialog: false
    }
  },
  methods: {
    // 常见文件夹
    createFolder () {
      // 创建文件夹携带的数据
      var folderData = {
        targetFilePath: this.getCurrentFilePath(),
        folderName: this.createFolderForm.folderName,
        userName: this.userName,
        fileType: 1
      }
      this.$axios({
        method: 'POST',
        url: 'http://localhost:8888/folder/createFolder',
        data: this.$qs.stringify(folderData)
      }).then((res) => {
        this.createFileDialog = false
        alert(this.createFileDialog)
        this.$message.success(res.data)
        this.refresh()
      })
    },
    // 文件上传相关函数
    submitUpload () {
      this.uploadData.targetFilePath = this.getCurrentFilePath()
      this.$refs.upload.submit()
    },
    fileUploadSuccess (response, file, fileList) {
      this.$message.success(response)
    },
    handleChange (file, fileList) {
      console.log(file, fileList)
    },
    // 刷新文件列表
    refreshFiles () {
      this.getCurrentPathFiles(this.getCurrentFilePath())
    },
    // 获取用户名
    getUserName () {
      this.userName = window.sessionStorage.getItem('fileCloudToken').split('_')[0]
      return window.sessionStorage.getItem('fileCloudToken').split('_')[0]
    },
    // 点击文件夹时触发函数
    intoFolder (fileName) {
      this.filePathItem.push(fileName)
      this.getCurrentFilePath()
      this.getCurrentPathFiles()
    },
    // 点击文件触发函数
    intoFile () {
      alert(this.getCurrentFilePath())
    },
    // 获取当前文件路径
    getCurrentFilePath () {
      var filePathTemp = ''
      for (var i = 0; i < this.filePathItem.length; i++) {
        filePathTemp += this.filePathItem[i] + '\\'
      }
      filePathTemp = this.getUserName() + '\\' + filePathTemp.replace(/>/g, '\\')
      if (filePathTemp[filePathTemp.length - 1] === '\\') {
        filePathTemp = filePathTemp.substring(0, filePathTemp.length - 1)
      }
      return filePathTemp
    },
    // 获取当前路径下所有文件夹or文件
    getCurrentPathFiles (filePathName) {
      this.$axios({
        method: 'POST',
        url: 'http://localhost:8888/folder/getCurrentPathFiles',
        data: this.$qs.stringify({
          filePath: this.getCurrentFilePath()
        })
      }).then((res) => {
        this.currentPathFiles = res.data
        this.filePath = this.getCurrentFilePath()
      })
    },
    // 返回文件目录上一级
    stepBack () {
      this.filePathItem.pop()
      this.getCurrentPathFiles()
    },
    // 删除文件
    deleteFile (folderUrl) {
      this.$axios({
        method: 'GET',
        url: 'http://localhost:8888/folder/deleteFile?folderUrl=' + folderUrl
      }).then((res) => {
        this.$message.success(res.data)
        console.log(res)
        this.getCurrentPathFiles(this.getCurrentFilePath())
      })
    },
    // 刷新当前页面文件
    refresh () {
      this.getCurrentPathFiles(this.getCurrentFilePath())
    },
    // 用来测试
    test () {
      alert('hello')
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  img {
    width: 60px;
    height: 40px;
  }

  .folderAndTxt {
    position: relative;
    display: inline-block;
    .edit {
      right: 4px;
      top: 4px;
      position: absolute;
      display: none;
    }
  }
  .folderAndTxt:hover {
    .edit {
      display: block;
    }
  }

  .el-breadcrumb {

    .creatNewFolder,
    .stepBack,
    .refreshFiles {
      background-color: #4A4A4A;
      color: white;
      padding: 5px 10px 5px 10px;
      margin-left: 10px;
      border-radius: 3px;
      float: right;
      cursor: pointer;
    }

    .stepBack {
      background-color: #909399;
    }
  }

  .el-card {
    position: relative;
    height: 600px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;

    .upload {
      position: absolute;
      bottom: 120px;
      text-align: center;
      left: 40%;
    }

    .folder-item,
    .txt-item {
      // position: absolute;
      border-radius: 5%;
      display: inline-block;
      width: 123px;
      height: 128px;
      text-align: center;
    }

    .folder-item:hover,
    .txt-item:hover {
      background-color: #E9E9E9;
    }

    .folder-item-name,
    .txt-item-name {
      display: block;
      width: 103px;
      height: 36px;
      font-size: 13px;
      margin: 0px 9.5px;
      color: #555;
    }

    .folder-item img {
      width: 70px;
      height: 70px;
      margin: 8px 0px;
    }

    .txt-item img {
      width: 60px;
      height: 80px;
      margin: 6px 0px 0px;
    }
  }
</style>

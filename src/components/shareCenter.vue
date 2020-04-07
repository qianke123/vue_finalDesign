<template>
  <div>
    <!-- 搜索栏 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="关键字" value="1"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getTableData()"></el-button>
      </el-input>
    </div>
    <div class="tag">
      <span>最近搜索：</span><br /><br />
      <el-tag v-for="t in tags" :key="t.number" :type="getTagType()" closable="closable">
        <span @click="getSearchInput(t)" class="tagItem">{{t}}</span>
      </el-tag>
    </div>
    <!-- tag标签 -->
    <!-- 结果列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="userName" label="作者" width="180"></el-table-column>
      <el-table-column prop="folderName" label="文件名称" width="180"></el-table-column>
      <el-table-column prop="folderUrl" label="文件路径"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template>
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
    </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  created () {
    // 初始化查询标签
    this.getTags()
  },
  data () {
    return {
      // 搜索内容
      input: '',
      select: '',
      // 列表数据
      tableData: [],
      // 搜索标签
      tags: [],
      fileCloudToken: window.sessionStorage.getItem('fileCloudToken')
    }
  },
  methods: {
    getTagType () {
      var num = Math.round(Math.random() * 4)
      if (num === 0 || num === 4) return 'success'
      else if (num === 1) return 'info'
      else if (num === 2) return 'warning'
      else if (num === 3) return 'danger'
    },
    getSearchInput (input) {
      this.input = input
    },
    // 添加tag
    pushTag () {
      this.$axios({
        method: 'GET',
        url: 'http://localhost:8888/tag/pushTag?tag=' + this.input + '&fileCloudToken=' + this.fileCloudToken
      }).then((res) => {
        console.log('tag添加成功')
      })
      this.getTags()
    },
    // 获取搜索结果
    getTableData () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.el-table')
      })
      this.$axios({
        method: 'GET',
        url: 'http://localhost:8888/folder/getTableData?fileName=' + this.input
      }).then((res) => {
        console.log(res)
        this.tableData = res.data
        loading.close()
      })
      this.pushTag()
    },
    // 获取缓存的tag
    getTags () {
      this.$axios({
        method: 'GET',
        url: 'http://localhost:8888/tag/getTags?fileCloudToken=' + this.fileCloudToken
      }).then((res) => {
        this.tags = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .el-select .el-input {
      width: 130px;
    }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-table {
    margin-top: 50px;
  }
  .tag {
    margin-top: 30px;
    .el-tag {
      margin-left: 10px;
    }
  }
  .tagItem:hover {
    cursor: pointer;
  }
</style>

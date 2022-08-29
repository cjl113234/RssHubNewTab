<template>
  <div class="subScribeContainer">
    <div class="subScribeTitle">
      <span class="title">订阅</span>
      <div class="addFileOrSubscribe">
        <el-popover
          ref="addNewFilePopoverRef"
          placement="bottom-start"
          title="新建收藏夹"
          :width="200"
          trigger="click"
        >
          <template #reference>
            <el-button type="info" :icon="FolderAdd" size="small" circle />
          </template>
          <el-form :model="addNewFileForm" ref="addNewFileFormRef" :rules="addNewFileRules">
            <el-form-item label="名称:" prop="label">
              <el-input v-model="addNewFileForm.label" autocomplete="off" />
            </el-form-item>
          </el-form>
          <div class="btnGroup">
            <el-button size="small" @click="handleAddNewFileCancel()">取消</el-button>
            <el-button type="success" size="small" @click="handleAddNewFileForm(addNewFileFormRef,addNewFileForm.label)">确定</el-button>
          </div>
        </el-popover>
        <el-button @click="addSubscribeDialogVisible = true" type="success" :icon="Plus" size="small" circle />
      </div>
    </div>

    <el-input v-model="filterText" class="search" placeholder="搜索" />
    <el-tree 
      :data="data"
      ref="treeRef"
      :props="defaultProps" 
      accordion
      :allow-drop="allowDrop"
      draggable
      @node-drop="handleDrop"
      @node-click="handleNodeClick"
      :filter-node-method="filterNode" >
      <template #default="{ node, data }">
        <div class="tree-node">
          <span v-if="!data.value" class="treeLabel"><el-icon><Folder /></el-icon>{{ node.label }}</span>
          <span v-if="data.value" class="treeLabel"><el-icon><Paperclip /></el-icon>{{ node.label }}</span>
          <el-popconfirm title="确认删除？" @confirm="remove(node, data)">
            <template #reference>
              <svg class="removeChildNode" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z" fill="#606266"/>
              </svg>
            </template>
          </el-popconfirm>
        </div>
      </template>
      </el-tree>

      <AddSubscribe :addSubscribeDialogVisible="addSubscribeDialogVisible" 
      :subscribeList="data" @dialogClose="handleDialogClose" @addSubscribe="handleAddSubscribe"/>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue"
import AddSubscribe from './addSubscribe.vue'
// import { ElTree } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { DropType } from 'element-plus/es/components/tree/src/tree.type'
import { Plus, Folder, Paperclip, FolderAdd } from '@element-plus/icons-vue'
import { apiGet } from '../../apis/rssHub'
import emitter from '../../utils/mybus.js';
import "animate.css/animate.min.css";

const emits = defineEmits(['feedShow']);

interface Tree {
  id: number,
  label: string,
  children?: Tree[]
  value?: string
}

if(!window.localStorage.getItem('subscribeList'))
  window.localStorage.setItem('subscribeList',`[{"id": 0,"label": "默认收藏夹"}]`)
if(!window.localStorage.getItem('subscribeID')) window.localStorage.setItem('subscribeID','1')

let id = Number(window.localStorage.getItem('subscribeID'))


const defaultProps = {
  id: 'id',
  children: 'children',
  label: 'label',
  value: 'value'
}

const filterText = ref('')
const treeRef = ref()

const addNewFileForm = ref({
  label:""
})
const addNewFileFormRef = ref<FormInstance>()
const addNewFilePopoverRef = ref({hide:()=>{}})
const addNewFileRules = reactive<FormRules>({
  label: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, max: 6, message: '太长太短都不好哦', trigger: 'blur' },
  ]
})

const data = ref<Tree[]>(JSON.parse(window.localStorage.getItem('subscribeList')))

// let feedInfo = ref([])

let addSubscribeDialogVisible = ref(false)

const handleNodeClick = async (data: Tree) => {
  if(data.value){
    // console.log(data.value)
    emitter.emit('loading',true);
    
    emits('feedShow',true)
    
    let subScribeContainer = document.querySelector('.subScribeContainer')
    subScribeContainer!.style.borderRadius="7px 0px 0px 7px";
    subScribeContainer!.style.boxShadow = "-5px 0px 10px 0px rgba(212, 212, 221, 0.75) 5px 0px 10px 0px rgba(212, 212, 221, 0.75);";

    await apiGet(data.value).then((res:any) => {
      // console.log(rssParser.xml2dom(res))
      // console.log(rssParser.xml2js(res).rss.channel.item)
      // feedInfo.value = rssParser.xml2js(res).rss.channel.item
      // console.log(feedInfo.value)
      emitter.emit('feedInfo',res);
	  })
  }
}

const handleDrop = (
  draggingNode: Node,
  dropNode: Node,
  dropType: DropType,
  ev: DragEvents
) => {
  window.localStorage.setItem('subscribeList',JSON.stringify(data.value))
}

const allowDrop = (draggingNode: Node, dropNode: Node, type: DropType) => {
  if (dropNode.data.value && draggingNode.data.value) {
    return false
  } else {
    return true
  }
}

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const remove = (node: Node, dataSource: Tree) => {
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === dataSource.id)
  children.splice(index, 1)
  data.value = [...data.value]
  window.localStorage.setItem('subscribeList',JSON.stringify(data.value))
}

const handleDialogClose = () => {
  // console.log(111)
  addSubscribeDialogVisible.value = false
}

const handleAddNewFileForm = async (formEl: FormInstance | undefined,value:string) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      data.value.push({
        id: Number(window.localStorage.getItem('subscribeID')),
        label: value,
      })
      addNewFilePopoverRef.value.hide()
      formEl.resetFields()
      window.localStorage.setItem('subscribeID',(Number(window.localStorage.getItem('subscribeID')) + 1).toString())
      window.localStorage.setItem('subscribeList',JSON.stringify(data.value))
    } else {
      // console.log('error submit!', fields)
    }
  })
}

const handleAddNewFileCancel = () => addNewFilePopoverRef.value.hide()

const handleAddSubscribe = (val:object) => {
  data.value.push(val)
  addSubscribeDialogVisible.value = false
  window.localStorage.setItem('subscribeList',JSON.stringify(data.value))
  // console.log(val)
}

</script>

<style scoped lang="scss">
.subScribeContainer{
  max-width: 15%;
  min-width: 200px;
  margin: 20px 0 20px 20px;
  flex:1;
  // overflow-y: scroll;
  background: #fff;
  border: 1px solid white;
  border-radius: 7px;
  box-shadow: 0px 0px 10px 0px rgba(212, 212, 221, 0.75);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(212, 212, 221, 0.75);
  -moz-box-shadow: 0px 0px 10px 0px rgba(212, 212, 221, 0.75);
  /* 隐藏滚动条 */
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  // transition: 1.5s;
  z-index: 2;

  .subScribeTitle{
    padding: 10px;
    border-bottom: 1px solid #e4e7ec;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title{
      font-size: 18px;
      font-weight: 500;
      // color: #777ab8;
    }
  }

  .search{
    padding: 5px;
  }
}
.subScribeContainer::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}

.tree-node{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 12px;

  .treeLabel{
    display: flex;
    align-items: center;

    .el-icon{
      margin-right: 5px;
    }
  }

  .removeChildNode{
    display: none;
    transition: 0.5s;
    padding: 4px;
    margin-right: 10px;
    border-radius: 5px;
  }
  .removeChildNode:hover{
    box-shadow:
    0px 0px 2.7px rgba(0, 0, 0, 0.006),
    0px 0px 6.9px rgba(0, 0, 0, 0.017),
    0px 0px 14.2px rgba(0, 0, 0, 0.109),
    0px 0px 29.2px rgba(0, 0, 0, 0.146),
    0px 0px 80px rgba(0, 0, 0, 0.17)
  ;
  }
}

.tree-node:hover{
  .removeChildNode{
    display: block;
  }
}

.btnGroup{
  display: flex;
  justify-content: end;
}
</style>

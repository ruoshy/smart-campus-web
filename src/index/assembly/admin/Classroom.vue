<template>
  <div style="padding: 10px;">
    <div style="background: white;min-height: 750px;overflow: hidden;border-radius: 15px;box-shadow: 0 0 5px #ccc">
      <div style="margin: 10px;height: 650px">
        <!--新增-->
        <IButton @click="openAddModal" type="default">新增</IButton>
        <!--表格-->
        <ITable style="margin-top: 20px" @reply="tableReply" :columns="columns" :data="data" :widths="widths"/>
      </div>
      <IPaging :max="classroom_list.length" :rows="10" @reply="pagingReply" style="margin: 30px 10px;min-width: 400px"/>
    </div>

    <IMask :show="show_mask" @click="exitModal"/>
    <!--新增-->
    <IModal :show="show_add_button_modal" @confirm="addClassroom" @cancel="exitModal" title="新增"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 170px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          教 室 号 ：
          <IInput v-model="add_classroom_name" width="200"/>
        </div>
        <div style="margin: 20px 30px">
          位 &nbsp;&nbsp;&nbsp; 置 ：
          <IInput v-model="add_classroom_address" width="200"/>
        </div>
        <div style="margin: 20px 30px">
          容 &nbsp;&nbsp;&nbsp; 量 ：
          <IInput v-model="add_classroom_volume" width="200"/>
        </div>
      </div>
    </IModal>

    <!--编辑-->
    <IModal :show="show_edit_button_modal" @confirm="updateClassroom" @cancel="exitModal" title="编辑"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 60px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          容 量 ：
          <IInput v-model="add_classroom_volume" width="250"/>
        </div>
      </div>
    </IModal>

    <!--删除系部-->
    <IModal :show="show_delete_button_modal" @confirm="deleteClassroom" @cancel="exitModal" title="警告"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">确定删除该教室？</span>
      </div>
    </IModal>
  </div>
</template>

<script>
  import IButton from '../../../components/IButton'
  import ITable from '../../../components/ITable'
  import IMask from '../../../components/IMask'
  import IDropdown from '../../../components/IDropdown'
  import IModal from '../../../components/IModal'
  import IInput from '../../../components/IInput'
  import IPaging from '@/components/IPaging'

  export default {
    name: 'Classroom',
    components: {IPaging, IInput, IModal, IDropdown, IMask, ITable, IButton},
    data () {
      return {
        widths: ['10%', '20%', '20%', '20%', '30%'],
        columns: [
          {title: '序列', key: 'idn', align: 'center'},
          {title: '教室号', key: 'major', align: 'center'},
          {title: '位置', key: 'classs', align: 'center'},
          {title: '容量', key: 'year', align: 'center'},
          {
            title: '操作',
            key: 'render',
            align: 'center',
            buttons: [{name: '编辑', type: 'primary', key: 'edit'}, {name: '删除', type: 'error', key: 'delete'}]
          }
        ],
        data: [],
        pagesition: 1,
        school_id: '',
        show_mask: false,
        show_add_button_modal: false,
        show_edit_button_modal: false,
        show_delete_button_modal: false,
        classroom_list: [],
        switch_classroom_id: '',
        add_classroom_name: '',
        add_classroom_address: '',
        add_classroom_volume: ''
      }
    }, methods: {
      pagingReply (position) {
        this.pagesition = position
        let list = []
        for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
          let row = {}
          if (this.classroom_list[i] === undefined) {
            break
          }
          row.idn = i + 1
          row.name = this.classroom_list[i].name
          row.address = this.classroom_list[i].address + '号楼'
          row.volume = this.classroom_list[i].volume
          list.push(row)
        }
        this.data = list
      },
      getClassroomList () {
        // 获取教室列表
        this.axios.get('/admin/clrbd?id=' + this.school_id).then((response) => {
          this.classroom_list = response.data
          let list = []
          if (this.classroom_list.length <= 10) {
            this.pagesition = 1
          }
          for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
            let row = {}
            if (this.classroom_list[i] === undefined) {
              break
            }
            row.idn = i + 1
            row.name = this.classroom_list[i].name
            row.address = this.classroom_list[i].address + '号楼'
            row.volume = this.classroom_list[i].volume
            list.push(row)
          }
          this.data = list
        })
      },
      updateClassroom () {
        // 更新教室容量
        this.axios.post('/admin/upclr', {
          id: this.switch_classroom_id,
          volume: this.add_classroom_volume
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getClassroomList()
          }
        })
      },
      deleteClassroom () {
        // 删除教室
        this.axios.post('/admin/dlclr', {
          id: this.switch_classroom_id,
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getClassroomList()
          }
        })
      },
      openAddModal () {
        // 初始化
        this.add_classroom_name = ''
        this.add_classroom_address = ''
        this.add_classroom_volume = ''

        // 打开模态框
        this.show_add_button_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      openEditModal () {
        this.show_edit_button_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      openDeleteModal () {
        this.show_delete_button_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      exitModal () {
        // 关闭新增框
        if (this.show_add_button_modal === true) {
          this.show_add_button_modal = false
        }

        // 关闭删除框
        if (this.show_delete_button_modal === true) {
          this.show_delete_button_modal = false
        }

        // 关闭编辑框
        if (this.show_edit_button_modal === true) {
          this.show_edit_button_modal = false
        }

        // 关闭遮罩层
        this.show_mask = false
      },
      addClassroom () {
        // 添加教室
        this.axios.post('/admin/inclr', {
          name: this.add_classroom_name,
          address: this.add_classroom_address,
          volume: this.add_classroom_volume,
          school_id: this.school_id
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getClassroomList()
          }
        })
      },
      tableReply (index, key) {
        let pos = (this.pagesition - 1) * 10 + index
        // 获得点击行对应数据信息
        this.switch_classroom_id = this.classroom_list[pos].id
        if (key === 'edit') {
          // 获取行对应数据
          this.add_classroom_volume = this.classroom_list[pos].volume + ''
          this.openEditModal()
          return
        }
        if (key === 'delete') {
          this.openDeleteModal()
        }
      }
    }, created () {
      this.school_id = this.$store.state.info.school_id
      this.getClassroomList()
    }
  }
</script>

<style scoped>

</style>

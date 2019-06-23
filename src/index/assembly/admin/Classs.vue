<template>
  <div style="padding: 10px;">
    <div style="background: white;min-height: 750px;overflow: hidden;border-radius: 15px;box-shadow: 0 0 5px #ccc">
      <div style="margin: 10px;height: 650px">
        <IDropdown placeholder="选择系部" @reply="depDrply" :list="dep_list"/>
        <!--新增-->
        <IButton @click="openAddModal" type="default">新增</IButton>
        <!--表格-->
        <ITable style="margin-top: 20px" @reply="tableReply" :columns="columns" :data="data" :widths="widths"/>
      </div>
      <IPaging :max="class_list.length" :rows="10" @reply="pagingReply" style="margin: 30px 10px;min-width: 400px"/>
    </div>

    <IMask :show="show_mask" @click="exitModal"/>
    <!--新增-->
    <IModal :show="show_add_button_modal" @confirm="addClasss" @cancel="exitModal" title="新增"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 170px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          专 业 ：
          <IDropdown placeholder="选择专业" @reply="majorDrply" :list="major_list" style="margin-left: 2px"/>
        </div>
        <div style="margin: 20px 30px">
          班 级 ：
          <IInput v-model="add_major_number" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          年 级 ：
          <IInput v-model="add_major_year" width="250"/>
        </div>
      </div>
    </IModal>

    <!--删除系部-->
    <IModal :show="show_delete_button_modal" @confirm="deleteClasss" @cancel="exitModal" title="警告"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">确定删除该班级？</span>
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
    name: 'Classs',
    components: {IPaging, IInput, IModal, IDropdown, IMask, ITable, IButton},
    data () {
      return {
        widths: ['10%', '20%', '20%', '20%', '30%'],
        columns: [
          {title: '序列', key: 'idn', align: 'center'},
          {title: '专业', key: 'major', align: 'center'},
          {title: '年级', key: 'year', align: 'center'},
          {title: '班级', key: 'classs', align: 'center'},
          {
            title: '操作',
            key: 'render',
            align: 'center',
            buttons: [{name: '删除', type: 'error', key: 'delete'}]
          }
        ],
        data: [],
        pagesition: 1,
        school_id: '',
        show_mask: false,
        show_add_button_modal: false,
        show_delete_button_modal: false,
        select_dep_flag: false,
        select_major_flag: false,
        dep_list: [],
        major_list: [],
        class_list: [],
        switch_dep_id: '',
        switch_dep_name: '',
        switch_major_id: '',
        switch_major_name: '',
        switch_class_id: '',
        switch_class_courseTable_id: '',
        add_major_year: '',
        add_major_number: ''
      }
    }, methods: {
      getDepList () {
        this.axios.get('/admin/depbd?id=' + this.school_id).then((response) => this.dep_list = response.data)
      },
      pagingReply (position) {
        this.pagesition = position
        console.log(this.pagesition)
        let list = []

        for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
          if (this.class_list[i] === undefined) {
            break
          }
          let row = {}
          row.idn = i + 1
          row.major = this.class_list[i].major.name
          row.year = this.class_list[i].year
          row.number = this.class_list[i].number
          list.push(row)
        }
        this.data = list
      },
      getClassList () {
        if (this.switch_dep_id === '') {
          return
        }
        this.axios.get('/admin/clsbd?id=' + this.switch_dep_id).then((response) => {
          this.class_list = response.data
          let list = []
          if(this.class_list.length<=10){
            this.pagesition = 1
          }
          for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
            if (this.class_list[i] === undefined) {
              break
            }
            let row = {}
            row.idn = i + 1
            row.major = this.class_list[i].major.name
            row.year = this.class_list[i].year
            row.number = this.class_list[i].number
            list.push(row)
          }
          this.data = list
        })
      },
      getMajorList () {
        this.axios.get('/admin/majbd?id=' + this.switch_dep_id).then((response) => this.major_list = response.data)
      },
      deleteClasss () {
        this.axios.post('/admin/dlcls', {
          id: this.switch_class_id,
          course_table_id: this.switch_class_courseTable_id
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getClassList()
          }
        })
      },
      majorDrply (index) {
        this.select_major_flag = false
        this.switch_major_id = this.major_list[index].id
        this.switch_major_name = this.major_list[index].name
      },
      depDrply (index) {
        this.select_dep_flag = false
        this.switch_dep_id = this.dep_list[index].id
        this.switch_dep_name = this.dep_list[index].name
        this.pagesition = 1
        this.class_list = []
        this.getClassList()
      },
      openAddModal () {
        if (this.switch_dep_id === '') {
          return
        }

        this.select_major_flag = false
        this.switch_major_id = ''
        this.switch_major_name = ''
        this.add_major_year = ''
        this.add_major_number = ''
        this.getMajorList()
        this.show_add_button_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      openDeleteModal (index) {
        let pos = (this.pagesition-1)*10+index

        this.switch_class_id = this.class_list[pos].id
        this.switch_class_courseTable_id = this.class_list[pos].course_table_id
        this.show_delete_button_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      exitModal () {
        // 关闭新增模态框
        if (this.show_add_button_modal === true) {
          this.show_add_button_modal = false
        }
        // 关闭删除模态框
        if (this.show_delete_button_modal === true) {
          this.show_delete_button_modal = false
        }

        // 关闭遮罩层
        this.show_mask = false
      },
      addClasss () {
        this.axios.post('/admin/incls', {
          number: this.add_major_number,
          year: this.add_major_year,
          major_id: this.switch_major_id
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getClassList()
          }
        })
      },
      tableReply (index, key) {
        if (key === 'delete') {
          this.openDeleteModal(index)
        }
      }
    }, created () {
      this.school_id = this.$store.state.info.school_id
      this.getDepList()
    }
  }
</script>

<style scoped>

</style>

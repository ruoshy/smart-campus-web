<template>
  <div style="padding: 10px;">
    <div style="background: white;min-height: 750px;overflow: hidden;border-radius: 15px;box-shadow: 0 0 5px #ccc">
      <div style="margin: 10px;height: 650px">
        <IDropdown @reply="depreply" :list="dep_list" placeholder="系部"/>
        <IButton @click="openAddModal">新增</IButton>
        <ITable style="margin-top: 20px" @reply="tableReply" :columns="columns" :data="data" :widths="widths">
        </ITable>
      </div>
      <IPaging :max="teacher_list.length" :rows="10" @reply="pagingReply" style="margin: 30px 10px;min-width: 400px"/>
    </div>

    <IMask :show="show_mask" @click="exitModal"/>
    <!--添加教师账号-->
    <IModal :show="show_add_modal" @confirm="addTeacher" @cancel="exitModal" title="添加"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 170px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          姓 名 ：
          <IInput v-model="ls_teacher_name" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          账 号 ：
          <IInput v-model="ls_teacher_user" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          密 码 ：
          <IInput v-model="ls_teacher_password" width="250"/>
        </div>
      </div>
    </IModal>

    <!--编辑教师信息-->
    <IModal :show="show_edit_modal" @confirm="editTeacher" @cancel="exitModal" title="编辑"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 170px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          姓 名 ：
          <IInput v-model="ls_teacher_name" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          账 号 ：
          <IInput v-model="ls_teacher_user" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          密 码 ：
          <IInput v-model="ls_teacher_password" width="250"/>
        </div>
      </div>
    </IModal>

    <!--删除教师账号-->
    <IModal :show="show_delete_modal" @confirm="deleteTeacher" @cancel="exitModal" title="警告"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">确定删除该教师账号？</span>
      </div>
    </IModal>

  </div>
</template>

<script>
  import IMask from '../../../components/IMask'
  import IModal from '../../../components/IModal'
  import IInput from '../../../components/IInput'
  import IButton from '../../../components/IButton'
  import ITable from '../../../components/ITable'
  import IDropdown from '../../../components/IDropdown'
  import IPaging from '@/components/IPaging'

  export default {
    name: 'Teacher',
    data () {
      return {
        school_id: '',
        administrators_id: 1,
        show_mask: false,
        show_add_modal: false,
        show_edit_modal: false,
        show_delete_modal: false,
        widths: ['10%', '20%', '20%', '10%', '40%'],
        columns: [
          {title: '序列', key: 'idn', align: 'center'},
          {title: '姓名', key: 'name', align: 'center'},
          {title: '账号', key: 'user', align: 'center'},
          {title: '密码', key: 'password', align: 'center'},
          {
            title: '操作',
            key: 'render',
            align: 'center',
            buttons: [{name: '编辑', type: 'primary', key: 'edit'}, {name: '删除', type: 'error', key: 'delete'}]
          }
        ],
        data: [],
        pagesition: 1,
        dep_list: [],
        select_dep_id: '',
        teacher_list: '',
        ls_teacher_name: '',
        ls_teacher_user: '',
        ls_teacher_password: '',
        select_teacher_id: ''
      }
    },
    methods: {
      exitModal () {
        // 关闭添加框
        if (this.show_add_modal === true) {
          this.show_add_modal = false
        }

        // 关闭编辑框
        if (this.show_edit_modal === true) {
          this.show_edit_modal = false
        }

        // 关闭删除框
        if (this.show_delete_modal === true) {
          this.show_delete_modal = false
        }

        this.show_mask = false
      },
      depreply (index, key) {
        this.select_dep_id = this.dep_list[index].id
        // 获得教师列表
        this.getTeacherList()
      },
      getDepList () {
        // 获得系部列表
        this.axios.get('/admin/depbd?id=' + this.school_id)
          .then((response) => {
            this.dep_list = response.data
          })
      },
      pagingReply (position) {
        this.pagesition = position
        let list = []
        for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
          if (this.teacher_list[i] === undefined) {
            break
          }
          let row = {}
          row.idn = i + 1
          row.name = this.teacher_list[i].name
          row.user = this.teacher_list[i].user
          row.password = this.teacher_list[i].password
          list.push(row)
        }
        this.data = list
      },
      getTeacherList () {
        if (this.select_dep_id !== '') {
          // 初始化系部信息
          this.teacher_list = []
          // 获得教师列表
          this.axios.get('/admin/suabd?id=' + this.select_dep_id)
            .then((response) => {
              this.teacher_list = response.data
              let list = []
              if (this.teacher_list.length <= 10) {
                this.pagesition = 1
              }
              for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
                if (this.teacher_list[i] === undefined) {
                  break
                }
                let row = {}
                row.idn = i + 1
                row.name = this.teacher_list[i].name
                row.user = this.teacher_list[i].user
                row.password = this.teacher_list[i].password
                list.push(row)
              }
              this.data = list
            })
        }
      },
      openAddModal () {
        if (this.select_dep_id === '') {
          return
        }
        this.ls_teacher_name = ''
        this.ls_teacher_user = ''
        this.ls_teacher_password = ''
        // 开启添加框
        this.show_add_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      openEditModal () {
        this.show_edit_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      openDeleteModal () {
        this.show_delete_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      addTeacher () {
        this.axios.post('/admin/insua', {
          name: this.ls_teacher_name,
          user: this.ls_teacher_user,
          password: this.ls_teacher_password,
          administrators_id: this.administrators_id,
          department_id: this.select_dep_id
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getTeacherList()
          }
        })
      },
      editTeacher () {
        this.axios.post('/admin/upsua', {
          name: this.ls_teacher_name,
          user: this.ls_teacher_user,
          password: this.ls_teacher_password,
          id: this.select_teacher_id
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getTeacherList()
          }
        })
      },
      deleteTeacher () {
        this.axios.post('/admin/dlsua', {
          id: this.select_teacher_id
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getTeacherList()
          }
        })
      },
      tableReply (index, key) {
        let pos = (this.pagesition - 1) * 10 + index
        // 获得选择行数据
        this.select_teacher_id = this.teacher_list[pos].id
        if (key === 'edit') {
          this.ls_teacher_name = this.teacher_list[pos].name
          this.ls_teacher_user = this.teacher_list[pos].user
          this.ls_teacher_password = this.teacher_list[pos].password
          this.openEditModal()
          return
        }
        if (key === 'delete') {
          this.openDeleteModal()
        }

      }
    },
    created () {
      this.school_id = this.$store.state.info.school_id
      // 获得系部列表
      this.getDepList()
    },
    components: {
      IPaging,
      IDropdown,
      ITable,
      IButton,
      IInput,
      IModal,
      IMask
    }
  }
</script>

<style scoped>

</style>

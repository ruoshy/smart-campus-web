<template>
  <div style="padding: 10px;">
    <div style="background: white;min-height: 750px;overflow: hidden;border-radius: 15px;box-shadow: 0 0 5px #ccc">
      <div style="margin: 10px;height: 650px">
        <IDropdown @reply="depreply" :list="dep_list" placeholder="系部"/>
        <IDropdown @reply="majreply" :list="major_list" placeholder="专业"/>
        <IDropdown @reply="yearreply" :list="year_list" placeholder="年级"/>
        <IDropdown @reply="classreply" :list="class_list" placeholder="班级"/>
        <IButton @click="getStudentList">查询</IButton>
        <IButton @click="openAddModal">新增</IButton>
        <ITable style="margin-top: 20px" @reply="tableReply" :columns="columns" :data="data" :widths="widths">
        </ITable>
      </div>
      <IPaging :max="studet_list.length" :rows="10" @reply="pagingReply" style="margin: 30px 10px;min-width: 400px"/>
    </div>

    <IMask :show="show_mask" @click="exitModal"/>
    <!--添加学生账号-->
    <IModal :show="show_add_modal" @confirm="addStudent" @cancel="exitModal" title="添加"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 170px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          姓 名 ：
          <IInput v-model="ls_student_name" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          账 号 ：
          <IInput v-model="ls_student_user" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          密 码 ：
          <IInput v-model="ls_student_password" width="250"/>
        </div>
      </div>
    </IModal>

    <!--编辑学生信息-->
    <IModal :show="show_edit_modal" @confirm="editStudent" @cancel="exitModal" title="编辑"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 170px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          姓 名 ：
          <IInput v-model="ls_student_name" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          账 号 ：
          <IInput v-model="ls_student_user" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          密 码 ：
          <IInput v-model="ls_student_password" width="250"/>
        </div>
      </div>
    </IModal>

    <!--删除学生账号-->
    <IModal :show="show_delete_modal" @confirm="deleteStudent" @cancel="exitModal" title="警告"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">确定删除该学生账号？</span>
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
    name: 'Student',
    data () {
      return {
        school_id: '',
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
        studet_list: [],
        year_list: [{name: '2016'}, {name: '2017'}, {name: '2018'}],
        select_year: '',
        dep_list: [],
        select_dep_id: '',
        major_list: [],
        select_maj_id: '',
        select_maj_number: '',
        class_list: [],
        select_class_id: '',
        ls_student_name: '',
        ls_student_user: '',
        ls_student_password: '',
        select_student_id: ''
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
      tableReply (index, key) {
        let pos = (this.pagesition-1)*10+index
        this.select_student_id = this.studet_list[pos].id
        if (key === 'edit') {
          this.ls_student_name = this.studet_list[pos].name
          this.ls_student_user = this.studet_list[pos].user
          this.ls_student_password = this.studet_list[pos].password
          this.openEditModal()
          return
        }
        if (key === 'delete') {
          this.openDeleteModal()
        }
      },
      yearreply (index, key) {
        this.data = []
        this.class_list = []
        this.pagesition = 1
        this.studet_list = []
        // 选择的年级
        this.select_year = key
        this.getClassList()
      },
      depreply (index, key) {
        this.data = []
        this.class_list = []
        this.pagesition = 1
        this.studet_list = []
        // 选择的系部id
        this.select_dep_id = this.dep_list[index].id
        // 获得专业列表
        this.getMajorList()
      },
      majreply (index, key) {
        this.data = []
        this.class_list = []
        this.pagesition = 1
        this.studet_list = []
        // 选择的专业数据
        this.select_maj_id = this.major_list[index].id
        this.select_maj_number = this.major_list[index].number
      },
      classreply (index, key) {
        this.pagesition = 1

        this.select_class_id = this.class_list[index].id
        this.getStudentList()
      },
      getDepList () {
        // 初始化专业信息
        this.major_list = []
        this.select_maj_number = ''
        // 获得系部列表
        this.axios.get('/admin/depbd?id=' + this.school_id)
          .then((response) => {
            this.dep_list = response.data
          })
      },
      getMajorList () {
        if (this.select_dep_id !== '') {
          // 获得专业列表
          this.axios.get('/admin/majbd?id=' + this.select_dep_id)
            .then((response) => {
              this.major_list = response.data
            })
        }
      },
      getClassList () {
        if (this.select_maj_id !== '' && this.select_year !== '') {
          // 获得班级列表
          this.axios.get('/admin/clssl?major_id=' + this.select_maj_id + '&year=' + this.select_year)
            .then((response) => {
              this.class_list = response.data
              for (let i = 0; i < this.class_list.length; i++) {
                this.class_list[i].name = this.class_list[i].number
              }
            })
        }
      },
      pagingReply (position) {
        this.pagesition = position
        let list = []
        for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
          if (this.studet_list[i] === undefined) {
            break
          }
          let row = {}
          row.idn = i + 1
          row.name = this.studet_list[i].name
          row.user = this.studet_list[i].user
          row.password = this.studet_list[i].password
          list.push(row)
        }
        this.data = list
      },
      getStudentList () {
        this.axios.get('/admin/usrsl?classs_id=' + this.select_class_id)
          .then((response => {
            this.studet_list = response.data
            let list = []
            if (this.studet_list.length <= 10) {
              this.pagesition = 1
            }
            for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
              if (this.studet_list[i] === undefined) {
                break
              }
              let row = {}
              row.idn = i + 1
              row.name = this.studet_list[i].name
              row.user = this.studet_list[i].user
              row.password = this.studet_list[i].password
              list.push(row)
            }
            this.data = list
          }))
      },
      openAddModal () {
        if (this.select_class_id === '') {
          return
        }
        this.ls_student_name = ''
        this.ls_student_user = ''
        this.ls_student_password = ''

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
      addStudent () {
        this.axios.post('/admin/inusr', {
          name: this.ls_student_name,
          user: this.ls_student_user,
          password: this.ls_student_password,
          year: this.select_year,
          school_id: this.school_id,
          classs_id: this.select_class_id,
          department_id: this.select_dep_id
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getStudentList()
          }
        })
      },
      editStudent () {
        this.axios.post('/admin/upusr', {
          id: this.select_student_id,
          name: this.ls_student_name,
          user: this.ls_student_user,
          password: this.ls_student_password,
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getStudentList()
          }
        })
      },
      deleteStudent () {
        this.axios.post('/admin/dlusr', {
          id: this.select_student_id
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getStudentList()
          }
        })
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

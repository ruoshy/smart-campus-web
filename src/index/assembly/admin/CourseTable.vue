<template>
  <div style="padding: 10px;">
    <div style="background: white;min-height: 750px;overflow: hidden;border-radius: 15px;box-shadow: 0 0 5px #ccc">
      <div style="margin: 10px;height: 600px">
        <IDropdown placeholder="选择系部" @reply="depDropReply" :list="dropdown.dep_list" :defval="temp.select_dep_name"/>
        <IDropdown placeholder="选择专业" @reply="majorDropReply" :list="dropdown.major_list"
                   :defval="temp.select_major_name"/>
        <IDropdown placeholder="选择年级" @reply="yearDropReply" :list="dropdown.year_list"
                   :defval="temp.select_year_name"/>
        <IDropdown placeholder="选择班级" @reply="classDropReply" :list="dropdown.class_list"/>
        <IButton @click="showModal(-1,'add')">添加</IButton>
        <IButton style="float: right" type="primary" @click="showModal(-1,'courseTable')">课程表</IButton>
        <ITable style="margin-top: 20px;" @reply="showModal" :columns="table_data.columns"
                :data="table_data.data"
                :widths="table_data.widths"/>
      </div>
      <IPaging :max="dropdown.course_list.length" :rows="10" @reply="pagingReply"
               style="margin: 30px 10px;min-width: 400px"/>
    </div>

    <IMask :show="modal.mask.show" @click="exitModal"/>
    <!--添加课程-->
    <IModal :show="modal.add.show" @confirm="addCourse" @cancel="exitModal" title="添加" style="width: 500px;"
            mgleft="250"
            mgtop="300">
      <div style="margin: 0 3%;width: 100%;height: 400px;font-size: 16px;color: #4E5360;" class="i-modal">
        <div style="margin: 30px 20px">
          <span>课程名称:</span>
          <IInput placeholder="请输入课程名称" width="250" v-model="modal.add.data.name"/>
        </div>
        <div style="margin: 30px 20px">
          <span>教室:</span>
          <IDropdown @reply="addressDropReply" :list="modal.add.data.address_list" :winW="66" style="margin-left: 2px"/>
          <span style="width: 10px;text-align: center">-</span>
          <IDropdown @reply="classroomDropReply" :list="modal.add.data.room_list" :winW="66" style="margin-left: 2px"/>
        </div>
        <div style="margin: 30px 20px">
          <span>开课时间:</span>
          <IDropdown @reply="dateDropReply" :list="modal.add.sort_time_date" :winW="66" style="margin-left: 2px"
                     defval="选择"/>
          <span style="width: 10px;text-align: center">-</span>
          <IDropdown @reply="timeDropReply" :list="modal.add.sort_time_number" :winW="66" style="margin-left: 2px"
                     defval="选择"/>
        </div>
        <div style="margin: 30px 20px">
          <span>教师:</span>
          <ISearch :list="dropdown.teacher_list" @click="searchClick" @change="searchChange"
                   style="display: inline-block"/>
        </div>
      </div>
    </IModal>

    <!--删除模态框-->
    <IModal :show="modal.delete.show" @confirm="deleteCourse" @cancel="exitModal" title="警告" style="width: 400px;">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">确定删除该课程？</span>
      </div>
    </IModal>

    <!--课程表-->
    <IModal :show="modal.courseTable.show" @confirm="exitModal" @cancel="exitModal" title="课程表" style="width: 800px;"
            mgleft="400"
            mgtop="300">
      <div style="margin: 0 3%;width: 100%;height: 460px;font-size: 16px;color: #4E5360;" class="i-modal">
        <!--课程表-->
        <div
          style="width: 720px;height: 430px;margin-top: 20px;border-left: #D8DDD9 solid 1px;border-right: #D8DDD9 solid 1px;">
          <div>
            <div v-for="name in ['周一','周二','周三','周四','周五']"
                 style="display: inline-block;width: 144px;height: 60px;
                 border-bottom: #D8DDD9 solid 1px;border-top: #D8DDD9 solid 1px;color: gray;line-height: 60px;text-align: center">
              {{name}}
            </div>
          </div>
          <div v-for="(itemX,index) in modal.courseTable.data">
            <div v-for="(itemY,indexY) in itemX"
                 style="float: left;width: 143px;height: 60px;
                 border-bottom: #D8DDD9 solid 1px;color: gray;"
                 :style="indexY!==4?'border-right: #D8DDD9 solid 1px':''">
              <div style="height: 40px;line-height: 20px;padding: 0 10px;width:130px;font-size: 14px">
                {{itemY.name===undefined?'　':itemY.name}}
              </div>
              <div style="height: 20px;line-height: 20px;padding: 0 10px;overflow: hidden;font-size: 13px">
                {{itemY.address===undefined?'　':itemY.address}} {{itemY.teacher===undefined?'　':'<>'+itemY.teacher}}
              </div>
            </div>
            <div v-if="index===1 || index===3"
                 style="float: left;height: 30px;width: 720px;border-bottom: #D8DDD9 solid 1px;">
            </div>
          </div>

        </div>
      </div>
    </IModal>
  </div>
</template>

<script>
  import IDropdown from '@/components/IDropdown'
  import IPaging from '@/components/IPaging'
  import IButton from '@/components/IButton'
  import ITable from '@/components/ITable'
  import IModal from '@/components/IModal'
  import IMask from '@/components/IMask'
  import IInput from '@/components/IInput'
  import ISearch from '@/components/ISearch'

  export default {
    name: 'CourseTable',
    data () {
      return {
        dropdown: {
          dep_list: [],
          major_list: [],
          year_list: [],
          class_list: [],
          classroom_list: [],
          teacher_list: [],
          course_list: []
        },
        temp: {
          school_id: '', select_dep_id: '', select_dep_name: '',
          select_major_id: '', select_major_name: '',
          select_year_name: '',
          select_class_name: '', select_courseTable_id: '', pagesition: 1
        },
        table_data: {
          widths: ['10%', '15%', '15%', '15%', '15%', '30%'],
          columns: [
            {title: '序列', key: 'idn', align: 'center'},
            {title: '课程名', key: 'name', align: 'center'},
            {title: '开课时间', key: 'sort_time', align: 'center'},
            {title: '教室', key: 'class_room', align: 'center'},
            {title: '教师', key: 'teacher', align: 'center'},
            {
              title: '操作',
              key: 'render',
              align: 'center',
              buttons: [{name: '编辑', type: 'primary', key: 'edit'}, {name: '删除', type: 'error', key: 'delete'}]
            }
          ],
          data: []
        },
        modal: {
          mask: {
            show: false,
          },
          add: {
            show: false,
            sort_time_date: [{name: '周一'}, {name: '周二'}, {name: '周三'}, {name: '周四'}, {name: '周五'}],
            sort_time_number: [{name: '1'}, {name: '2'}, {name: '3'}, {name: '4'}, {name: '5'}],
            data: {
              name: '', classroom_id: '', date_index: '', time_index: '',
              teacher_id: '', address_list: [], room_list: [], select_address_name: ''
            }
          },
          delete: {
            show: false,
            data: {select_course_id: ''}
          },
          courseTable: {
            show: false,
            data: []
          }
        }
      }
    },
    methods: {
      init () {
        this.modal.add.data.course_table_id = ''
        this.table_data.data = []
        this.dropdown.class_list = []
      },
      exitModal () {
        if (this.modal.add.show === true) {
          this.modal.add.show = false
        }
        if (this.modal.delete.show === true) {
          this.modal.delete.show = false
        }
        if (this.modal.courseTable.show === true) {
          this.modal.courseTable.show = false
        }

        this.modal.mask.show = false
      },
      pagingReply (position) {
        this.temp.pagesition = position
        let list = []
        for (let i = (this.temp.pagesition - 1) * 10; i < this.temp.pagesition * 10; i++) {
          let row = {}
          let line = this.dropdown.course_list[i]
          if (line === undefined) {
            break
          }
          row.idn = i + 1
          row.name = line.name
          row.sort_time = line.sort_time
          row.class_room = line.classroom.address + '-' + line.classroom.name
          row.teacher = line.subadministrator.name
          list.push(row)
        }
        this.table_data.data = list
      },
      showModal (index, key) {
        switch (key) {
          case 'add':
            if (this.temp.select_courseTable_id === '') {
              return
            }
            this.modal.add.show = true
            this.modal.add.data.name = ''
            this.modal.add.data.date_index = ''
            this.modal.add.data.time_index = ''
            this.modal.add.data.classroom_id = ''
            this.modal.add.data.teacher_id = ''

            this.getClassroom()
            break
          case 'delete':
            let pos = (this.temp.pagesition - 1) * 10 + index
            this.modal.delete.data.select_course_id = this.dropdown.course_list[pos].id
            this.modal.delete.show = true
            break
          case 'courseTable':
            if (this.dropdown.course_list.length === 0) {
              return
            }
            this.modal.courseTable.show = true
            this.getCourseTable()
            break
        }
        this.modal.mask.show = true
      },
      getDepList () {
        // 获得系部列表
        this.axios.get('/admin/depbd?id=' + this.temp.school_id)
          .then((response) => {
            this.dropdown.dep_list = response.data
          })
      },
      getMajorList () {
        // 获得专业列表
        if (this.temp.select_dep_id !== '') {
          this.axios.get('/admin/majbd?id=' + this.temp.select_dep_id)
            .then((response) => {
              this.dropdown.major_list = response.data
            })
        }
      },
      getClasss () {
        // 获得班级列表
        if (this.temp.select_major_id !== '' && this.temp.select_year_name !== '') {
          // 获得班级列表
          this.axios.get('/admin/clssl?major_id=' + this.temp.select_major_id + '&year=' + this.temp.select_year_name)
            .then((response) => {
              this.dropdown.class_list = response.data
              for (let i = 0; i < this.dropdown.class_list.length; i++) {
                this.dropdown.class_list[i].name = this.dropdown.class_list[i].number
              }
            })
        }
      },
      getClassroom () {
        this.axios.get('/admin/clsabd?id=' + this.temp.school_id)
          .then((response) => {
            this.dropdown.classroom_list = response.data
            this.getAddress()
          })
      },
      getTeacherLike (name) {
        this.axios.get('/admin/sualk?name=' + name).then((response) => {
          this.dropdown.teacher_list = response.data
        })
      },
      depDropReply (index) {
        this.init()
        // 初始化页位置
        this.temp.pagesition = 1
        // 初始化专业列表
        this.dropdown.major_list = []
        // 初始化年份表
        this.dropdown.year_list = [{name: '2016'}, {name: '2017'}, {name: '2018'}]
        // 初始化课程列表
        this.dropdown.course_list = []

        this.temp.select_dep_id = this.dropdown.dep_list[index].id
        this.temp.select_dep_name = this.dropdown.dep_list[index].name
        this.getMajorList()
      },
      majorDropReply (index) {
        // 初始化分页
        this.temp.pagesition = 1
        this.table_data.data = []
        // 初始化课程列表
        this.dropdown.course_list = []

        this.init()
        // 初始化年份表
        this.dropdown.year_list = [{name: '2016'}, {name: '2017'}, {name: '2018'}]
        this.temp.select_major_id = this.dropdown.major_list[index].id
        this.temp.select_major_name = this.dropdown.major_list[index].name
      },
      yearDropReply (index) {
        // 初始化分页
        this.temp.pagesition = 1
        this.table_data.data = []
        // 初始化课程列表
        this.dropdown.course_list = []

        this.init()
        this.temp.select_year_name = this.dropdown.year_list[index].name
        this.getClasss()
      },
      classDropReply (index) {
        // 初始化分页
        this.temp.pagesition = 1
        this.table_data.data = []

        this.temp.select_courseTable_id = this.dropdown.class_list[index].course_table_id
        this.temp.select_class_name = this.dropdown.class_list[index].name
        this.getCourse()
      },
      dateDropReply (index) {
        this.modal.add.data.date_index = index
      },
      timeDropReply (index) {
        this.modal.add.data.time_index = index
      },
      addressDropReply (index, name) {
        this.modal.add.data.select_address_name = name
        this.getRooms()
      },
      classroomDropReply (index) {
        this.modal.add.data.classroom_id = this.dropdown.classroom_list[index].id
      },
      // 获得教学楼列表
      getAddress () {
        this.modal.add.data.address_list = []
        this.dropdown.classroom_list.map((item) => {
          let flag = true
          for (let i = 0; i < this.modal.add.data.address_list.length; i++) {
            if (this.modal.add.data.address_list[i].name === item.address) {
              flag = false
              break
            }
          }
          if (flag) {
            this.modal.add.data.address_list.push({name: item.address})
          }
        })
      },
      getRooms () {
        this.modal.add.data.room_list = []
        this.dropdown.classroom_list.map((item) => {
          if (item.address === this.modal.add.data.select_address_name) {
            this.modal.add.data.room_list.push({name: item.name})
          }
        })
      },
      getCourse () {
        this.axios.get('/admin/curcut?course_table_id=' + this.temp.select_courseTable_id)
          .then((response) => {
            this.dropdown.course_list = response.data
            let list = []
            for (let i = (this.temp.pagesition - 1) * 10; i < this.temp.pagesition * 10; i++) {
              let row = {}
              let line = response.data[i]
              if (line === undefined) {
                break
              }
              row.idn = i + 1
              row.name = line.name
              row.sort_time = line.sort_time
              row.class_room = line.classroom.address + '-' + line.classroom.name
              row.teacher = line.subadministrator.name
              list.push(row)
            }
            this.table_data.data = list
          })
      },
      addCourse () {
        if (this.modal.add.data.name === '') {
          return
        }
        if (this.modal.add.data.classroom_id === '') {
          return
        }
        if (this.modal.add.data.date_index === '') {
          return
        }
        if (this.modal.add.data.time_index === '') {
          return
        }
        if (this.temp.select_courseTable_id === '') {
          return
        }
        if (this.modal.add.data.teacher_id === '') {
          return
        }

        this.axios.post('/admin/incur', {
          name: this.modal.add.data.name,
          sort_time: (this.modal.add.data.date_index + 1) + '-' + (this.modal.add.data.time_index + 1),
          course_table_id: this.temp.select_courseTable_id,
          classroom_id: this.modal.add.data.classroom_id,
          subadministrator_id: this.modal.add.data.teacher_id
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getCourse()
          }
        })
      },
      deleteCourse () {
        if (this.modal.delete.data.select_course_id === '') {
          return
        }
        this.axios.post('/admin/dlcur', {id: this.modal.delete.data.select_course_id})
          .then((response) => {
            let json = response.data
            if (json.code === 1) {
              this.exitModal()
              this.getCourse()
            }
          })
      },
      searchChange (val) {
        this.getTeacherLike(val)
      },
      searchClick (item) {
        this.modal.add.data.teacher_id = item.id
      },
      getCourseTable () {
        // 生成槽位
        let courseTable = []
        for (let i = 1; i < 6; i++) {
          let row = []
          for (let o = 1; o < 6; o++) {
            row.push({})
          }
          courseTable.push(row)
        }
        // 填充槽位
        this.dropdown.course_list.forEach((item) => {
          let sort_time = item.sort_time.split('-')
          let course_x = parseInt(sort_time[0]) - 1
          let course_y = parseInt(sort_time[1]) - 1
          courseTable[course_y][course_x].address = item.classroom.address + '号楼' + item.classroom.name
          courseTable[course_y][course_x].name = item.name
          courseTable[course_y][course_x].teacher = item.subadministrator.name
        })
        this.modal.courseTable.data = courseTable
      }
    },
    created () {
      this.temp.school_id = this.$store.state.info.school_id
      this.getDepList()
    },
    components: {ISearch, IInput, IMask, IModal, ITable, IButton, IPaging, IDropdown}
  }
</script>

<style scoped>
  .i-modal span {
    display: inline-block;
    width: 70px;
    font-size: 14px
  }
</style>

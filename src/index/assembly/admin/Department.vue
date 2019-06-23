<template>
  <div style="padding: 10px;">
    <div style="background: white;min-height: 750px;overflow: hidden;border-radius: 15px;box-shadow: 0 0 5px #ccc">
      <div style="margin: 10px;height: 650px">
        <!--新增-->
        <IButton @click="openAddModal" type="default">新增</IButton>
        <ITable style="margin-top: 20px;" @reply="tableReply" :columns="columns" :data="data" :widths="widths"/>
      </div>
      <IPaging :max="130" :rows="12" @reply="" style="margin: 30px 10px;min-width: 400px"/>
    </div>

    <IMask :show="show_mask" @click="exitModal"/>
    <!--添加系部-->
    <IModal :show="show_add_button_modal" @confirm="addDepartment" @cancel="exitModal" title="添加" style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 130px;font-size: 16px;color: #4E5360;">
        <div style="margin: 30px 30px">
          系 名 ：
          <IInput v-model="add_dep_name" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          编 号 ：
          <IInput v-model="add_dep_number" width="250"/>
        </div>
      </div>
    </IModal>

    <!--编辑系部-->
    <IModal :show="show_edit_button_modal" @confirm="editDepartment" @cancel="exitModal" title="编辑"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 130px;font-size: 16px;color: #4E5360;">
        <div style="margin: 30px 30px">
          系 名 ：
          <IInput v-model="edit_dep_name" width="250"/>
        </div>
        <div style="margin: 20px 30px">
          编 号 ：
          <IInput v-model="edit_dep_number" width="250"/>
        </div>
      </div>
    </IModal>

    <!--删除系部-->
    <IModal :show="show_delete_button_modal" @confirm="deleteDepartment" @cancel="exitModal" title="警告"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">确定删除该系？</span>
      </div>
    </IModal>
  </div>
</template>

<script>
  import ITable from '../../../components/ITable'
  import IButton from '../../../components/IButton'
  import IMask from '../../../components/IMask'
  import IModal from '../../../components/IModal'
  import IInput from '../../../components/IInput'
  import IPaging from '@/components/IPaging'

  export default {
    name: 'Department',
    data () {
      return {
        widths: ['10%', '20%', '20%', '50%'],
        columns: [
          {title: '序列', key: 'idn', align: 'center'},
          {title: '系名', key: 'name', align: 'center'},
          {title: '编号', key: 'number', align: 'center'},
          {
            title: '操作',
            key: 'render',
            align: 'center',
            buttons: [{name: '编辑', type: 'primary', key: 'edit'}, {name: '删除', type: 'error', key: 'delete'}]
          }
        ],
        data: [],
        dep_list: [],
        school_id: '',
        show_mask: false,
        show_add_button_modal: false,
        show_edit_button_modal: false,
        show_delete_button_modal: false,
        add_dep_name: '',
        add_dep_number: '',
        edit_dep_name: '',
        edit_dep_number: '',
        switch_dep_id: 0
      }
    },
    methods: {
      getDepList () {
        this.axios.get('/admin/depbd?id=' + this.school_id)
          .then((response) => {
            this.dep_list = response.data
            let list = []
            for (let i = 0; i < this.dep_list.length; i++) {
              let row = {}
              row.idn = i + 1
              row.name = this.dep_list[i].name
              row.number = this.dep_list[i].number
              list.push(row)
            }
            this.data = list
          })
      },
      openAddModal () {
        this.add_dep_name = ''
        this.add_dep_number = ''
        this.show_add_button_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      openEditModal (index) {
        this.switch_dep_id = this.dep_list[index].id
        this.edit_dep_name = this.dep_list[index].name
        this.edit_dep_number = this.dep_list[index].number + ''

        this.show_edit_button_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      openDeleteModal (index) {
        this.switch_dep_id = this.dep_list[index].id
        this.show_delete_button_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      exitModal () {
        // 关闭新增模态框
        if (this.show_add_button_modal === true) {
          this.show_add_button_modal = false
        }

        // 关闭编辑模态框
        if (this.show_edit_button_modal === true) {
          this.show_edit_button_modal = false
        }

        // 关闭删除模态框
        if (this.show_delete_button_modal === true) {
          this.show_delete_button_modal = false
        }

        // 关闭遮罩层
        this.show_mask = false
      },
      addDepartment () {
        this.axios.post('/admin/indep', {
          name: this.add_dep_name,
          school_id: this.school_id,
          number: this.add_dep_number
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getDepList()
          }
        })
      },
      editDepartment () {
        this.axios.post('/admin/updep', {
          id: this.switch_dep_id,
          name: this.edit_dep_name,
          number: this.edit_dep_number
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getDepList()
          }
        })
      },
      deleteDepartment () {
        this.axios.post('/admin/dldep', {
          id: this.switch_dep_id,
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getDepList()
          }
        })
      },
      tableReply (index, key) {
        if (key === 'edit') {
          this.openEditModal(index)
        } else if (key === 'delete') {
          this.openDeleteModal(index)
        }
      }
    }, created () {
      this.school_id = this.$store.state.info.school_id
      this.getDepList();
    }, components: {
      IPaging,
      IInput,
      IModal,
      IMask,
      IButton,
      ITable
    }
  }
</script>

<style scoped>

</style>

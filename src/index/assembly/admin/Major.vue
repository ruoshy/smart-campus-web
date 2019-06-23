<template>
  <div style="padding: 10px;">
    <div style="background: white;min-height: 750px;overflow: hidden;border-radius: 15px;box-shadow: 0 0 5px #ccc">
      <div style="margin: 10px;height: 650px;">
        <IDropdown placeholder="选择系部" @reply="depDrply" :list="dep_list"/>
        <!--新增-->
        <IButton @click="openAddModal" type="default">新增</IButton>
        <!--表格-->
        <ITable style="margin-top: 20px" @reply="tableReply" :columns="columns" :data="data" :widths="widths"/>
      </div>
      <IPaging :max="130" :rows="12" @reply="" style="margin: 30px 10px;min-width: 400px"/>
    </div>

    <IMask :show="show_mask" @click="exitModal"/>
    <!--新增-->
    <IModal :show="show_add_button_modal" @confirm="addMajor" @cancel="exitModal" title="新增"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 130px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          专 业 名：
          <IInput v-model="add_major_name" width="200"/>
        </div>
        <div style="margin: 20px 30px">
          编 &nbsp;&nbsp;&nbsp; 号：
          <IInput v-model="add_major_number" width="200"/>
        </div>
      </div>
    </IModal>

    <!--删除系部-->
    <IModal :show="show_delete_button_modal" @confirm="deleteMajor" @cancel="exitModal" title="警告"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">确定删除该班级？</span>
      </div>
    </IModal>
  </div>
</template>

<script>
  import IButton from "../../../components/IButton";
  import ITable from "../../../components/ITable";
  import IMask from "../../../components/IMask";
  import IDropdown from "../../../components/IDropdown";
  import IModal from "../../../components/IModal";
  import IInput from "../../../components/IInput";
  import IPaging from '@/components/IPaging'

  export default {
    name: "Major",
    components: {IPaging, IInput, IModal, IDropdown, IMask, ITable, IButton},
    data() {
      return {
        widths: ['10%', '30%', '30%', '30%'],
        columns: [
          {title: '序列', key: 'idn', align: 'center'},
          {title: '专业', key: 'major', align: 'center'},
          {title: '编号', key: 'number', align: 'center'},
          {
            title: '操作',
            key: 'render',
            align: 'center',
            buttons: [{name: '删除', type: 'error', key: 'delete'}]
          }
        ],
        data: [],
        school_id: '',
        show_mask: false,
        show_add_button_modal: false,
        show_delete_button_modal: false,
        select_dep_flag: false,
        select_major_flag: false,
        dep_list: [],
        major_list: [],
        switch_dep_id: '',
        switch_major_id: '',
        add_major_name: '',
        add_major_number: ''
      }
    }, methods: {
      getDepList() {
        this.axios.get("/admin/depbd?id=" + this.school_id).then((response) => this.dep_list = response.data)
      },
      getMajorList() {
        this.axios.get("/admin/majbd?id=" + this.switch_dep_id)
          .then((response) => {
            this.major_list = response.data;
            let list = [];
            for (let i = 0; i < this.major_list.length; i++) {
              let row = {};
              row.idn = i + 1;
              row.major = this.major_list[i].name;
              row.number = this.major_list[i].number;
              list.push(row);
            }
            this.data = list;

          })
      },
      deleteMajor() {
        this.axios.post("/admin/dlmaj", {
          id: this.switch_major_id,
        }).then((response) => {
          let json = response.data;
          if (json.code === 1) {
            this.exitModal();
            this.getMajorList();
          }
        })
      },
      depDrply(index) {
        this.select_dep_flag = false;
        this.switch_dep_id = this.dep_list[index].id;
        this.getMajorList();
      },
      openAddModal() {
        if (this.switch_dep_id === '')
          return;

        this.select_major_flag = false;
        this.switch_major_id = '';
        this.add_major_name = '';
        this.add_major_number = '';
        this.getMajorList();
        this.show_add_button_modal = true;
        // 开启遮罩
        this.show_mask = true;
      },
      openDeleteModal(index) {
        this.switch_major_id = this.major_list[index].id;
        this.show_delete_button_modal = true;
        // 开启遮罩
        this.show_mask = true;
      },
      exitModal() {
        // 关闭新增模态框
        if (this.show_add_button_modal === true)
          this.show_add_button_modal = false;

        // 关闭删除模态框
        if (this.show_delete_button_modal === true)
          this.show_delete_button_modal = false;

        // 关闭遮罩层
        this.show_mask = false;
      },
      addMajor() {
        this.axios.post("/admin/inmaj", {
          name: this.add_major_name,
          number: this.add_major_number,
          department_id: this.switch_dep_id
        }).then((response) => {
          let json = response.data;
          if (json.code === 1) {
            this.exitModal();
            this.getMajorList();
          }
        })
      },
      tableReply(index, key) {
        if (key === 'delete') {
          this.openDeleteModal(index);
        }
      }
    }, created() {
      this.school_id = this.$store.state.info.school_id;
      this.getDepList();
    }
  }
</script>

<style scoped>

</style>

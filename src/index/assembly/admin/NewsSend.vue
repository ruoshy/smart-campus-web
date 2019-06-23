<template>
  <div style="padding: 10px;">
    <div style="background: white;min-height: 750px;overflow: hidden;border-radius: 15px;box-shadow: 0 0 5px #ccc">
      <div style="margin: 10px">
        <div style="height: 45px;margin: 0 20px;line-height: 45px">
          <IButton @click="openAddModal">添加</IButton>
          <IButton @click="sendNews">发布</IButton>
        </div>
        <div style="height: 650px;">
          <div style="margin-left: 20px;">
            <IInput v-model="title" height="30" width="268" placeholder="标题"/>
          </div>
          <div class="i-moi"
               style="width: 252px;height: 564px;box-shadow: 0 0 5px #999;border-radius: 10px;padding: 10px;font-size: 10px;float: left;margin: 10px 20px;overflow: auto">
            <ul>
              <li v-for="(item,index) in data_list" :key="index">
                <div v-if="item.type===0" v-html="item.cten.replace(/\n|\r\n/g,'</br>')">
                </div>
                <img v-else :src="item.cten" style="max-width: 242px"/>
              </li>
            </ul>
          </div>
          <ITable @reply="tableReply" :tableH="585" :columns="columns" :data="data" :data_list="data_list"
                  :widths="widths"
                  :moveflag="true"
                  style="position: relative;top: -33px;margin-left: 300px">
          </ITable>
        </div>
      </div>
    </div>

    <input type="file" style="display: none" ref="upimg" @change="changeimage($event)"/>
    <IMask :show="show_mask" @click="exitModal"/>
    <!--添加新闻-->
    <IModal :show="show_add_modal" @confirm="addDate" @cancel="exitModal" title="添加"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 300px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          <IDropdown :list="uptype_list" :defval="uptype_list[0].name" @reply="uptypeReply"/>
        </div>
        <div style="margin: 20px 30px">
          <IInput width="145" placeholder="名字" v-model="update.name"/>
        </div>
        <div style="margin: 20px 30px" v-if="temp.select_type_idn===0">
          <label>
            <textarea wrap="hard" style="width: 300px;height: 160px" v-model="update.txt">{{update.txt}}</textarea>
          </label>
        </div>
        <div style="padding: 0 32px;height: 160px;" v-if="temp.select_type_idn===1">
          <IButton @click="upimg">上传图片</IButton>
          <div style="width: 300px;overflow: hidden;padding: 10px 0">
            <img :src="temp.upimgf" style="max-height: 120px"/>
          </div>
        </div>
      </div>
    </IModal>

    <!--编辑新闻元素-->
    <IModal :show="show_edit_modal" @confirm="editDate" @cancel="exitModal" title="编辑"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 250px;font-size: 16px;color: #4E5360;">
        <div style="margin: 20px 30px">
          <IInput width="145" placeholder="名字" v-model="update.name"/>
        </div>
        <div style="margin: 20px 30px" v-if="temp.select_type_idn===0">
          <label>
            <textarea style="width: 300px;height: 160px" v-model="update.txt">{{update.txt}}</textarea>
          </label>
        </div>
        <div style="padding: 0 32px;height: 160px;" v-if="temp.select_type_idn===1">
          <IButton @click="upimg">上传图片</IButton>
          <div style="width: 300px;overflow: hidden;padding: 10px 0">
            <img :src="temp.upimgf" style="max-height: 120px"/>
          </div>
        </div>
      </div>
    </IModal>

    <!--删除新闻元素-->
    <IModal :show="show_delete_modal" @confirm="deleteDate" @cancel="exitModal" title="警告"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">确定删除该元素？</span>
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

  export default {
    name: 'NewsSend',
    data () {
      return {
        show_mask: false,
        show_add_modal: false,
        show_edit_modal: false,
        show_delete_modal: false,
        uptype_list: [{name: '文本'}, {name: '图片'}],
        update: {txt: '', name: ''},
        temp: {name: '', file: undefined, select_type_idn: 0, select_index: 0, upimgf: ''},

        widths: ['10%', '40%', '50%'],
        columns: [
          {title: '序列', key: 'idn', align: 'center'},
          {title: '名字', key: 'password', align: 'center'},
          {
            title: '操作',
            key: 'render',
            align: 'center',
            buttons: [
              {name: '编辑', type: 'primary', key: 'edit'},
              {name: '删除', type: 'error', key: 'delete'},
            ]
          }
        ],
        // {idn: 1, name: 'a1'}
        data: [],
        // {cten: '1', type: 0}
        data_list: [],
        title: '',
      }
    },
    methods: {
      exitModal () {
        if (this.show_add_modal) {
          this.show_add_modal = false
        }

        if (this.show_edit_modal) {
          this.show_edit_modal = false
        }

        if (this.show_delete_modal) {
          this.show_delete_modal = false
        }

        this.show_mask = false
      },
      openAddModal () {
        // 初始化数据
        this.update.txt = ''
        this.update.name = ''
        this.temp.select_type_idn = 0
        this.temp.upimgf = ''
        this.temp.name = ''
        this.temp.file = undefined

        this.show_mask = true
        this.show_add_modal = true
      },
      openEditModal () {
        let index = this.temp.select_index
        // 初始化数据
        this.update.name = this.data[index].name
        this.temp.select_type_idn = this.data_list[index].type

        if (this.data_list[index].type === 0) {
          this.update.txt = this.data_list[index].cten
        } else {
          this.upimgf = this.data_list[index].cten
        }

        this.show_mask = true
        this.show_edit_modal = true
      },
      openDeleteModal () {
        this.show_mask = true
        this.show_delete_modal = true
      },
      editDate () {
        let index = this.temp.select_index

        if (this.update.name === '') {
          return
        }
        if (this.data_list[index].type === 1 && this.temp.upimgf === '') {
          return
        }

        // 修改数据
        this.data[index].name = this.update.name
        if (this.data_list[index].type === 0) {
          this.data_list[index].cten = this.update.txt
        } else {
          this.data_list[index].cten = this.upimgf
          this.data_list[index].file = this.temp.file
        }

        this.exitModal()
      },
      addDate () {
        if (this.update.name === '') {
          return
        }
        if (this.temp.select_type_idn === 1 && this.upimgf === '') {
          return
        }
        // 添加到数据体
        let date_item = {}
        date_item.type = this.temp.select_type_idn
        date_item.name = date_item.type === 0 ? '' : this.temp.file.name
        date_item.cten = date_item.type === 0 ? this.update.txt : this.temp.upimgf
        date_item.file = date_item.type === 0 ? undefined : this.temp.file
        this.data_list.push(date_item)
        // 添加到表格
        let json = {}
        json.idn = this.data.length + 1 + ''
        json.name = this.update.name
        this.data.push(json)

        this.exitModal()
      },
      deleteDate () {
        let index = this.temp.select_index
        this.data.splice(index, 1)
        this.data_list.splice(index, 1)

        this.dataSort()

        this.exitModal()
      },
      upimg () {
        this.$refs.upimg.click()
      },
      changeimage (event) {
        if (event.target.files.length > 0) {
          this.temp.file = event.target.files[0]
          this.temp.upimgf = window.webkitURL.createObjectURL(event.target.files[0])
        }
        this.$refs.upimg.value = null
      },
      uptypeReply (index) {
        this.temp.select_type_idn = index
      },
      tableReply (index, key) {
        this.temp.select_index = index
        if (key === 'edit') {
          this.openEditModal()
        } else if (key === 'delete') {
          this.openDeleteModal()
        }
      },
      sendNews () {
        if (this.title === '') {
          return
        }

        let formDate = new FormData()
        let up_data_list = []

        this.data_list.forEach((item) => {
          if (item.type === 1) {
            formDate.append('files', item.file)
          }
          // up datalist
          let temp = {}
          temp.type = item.type
          temp.cten = item.type === 1 ? item.img : item.cten
          temp.name = item.name
          up_data_list.push(temp)
        })

        formDate.append('name', this.title)
        formDate.append('data', JSON.stringify(up_data_list))
        formDate.append('administrators_id', this.$store.state.info.admin_id)

        this.axios.post('/admin/innew', formDate, {
          headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: e => {
            console.log(e)
          }
        }).then(() => alert('发布成功'))

      },
      dataSort () {
        for (let i = 0; i < this.data_list.length; i++) {
          this.data[i].idn = i + 1
        }
      }
    },
    created () {

    },
    components: {
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
  .i-moi::-webkit-scrollbar {
    display: none;
  }

  textarea {
    -webkit-appearance: none;
    outline: none;
    background: none;

    font-size: 13px;
    padding: 5px 10px;
    border: #D8DDD9 solid 1px;
    border-radius: 3px;
    color: #4E5360;
    margin-left: 3px;
  }

  ul {
    margin: 0;
    padding: 0;
    line-height: 20px;
  }
</style>

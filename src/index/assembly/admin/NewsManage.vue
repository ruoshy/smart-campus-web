<template>
  <div style="padding: 10px;">
    <div style="background: white;min-height: 750px;overflow: hidden;border-radius: 15px;box-shadow: 0 0 5px #ccc">
      <div style="margin: 10px;height: 590px">
        <ITable style="margin-top: 20px" @reply="tableReply" :columns="columns" :data="data" :widths="widths">
        </ITable>
      </div>
      <IPaging :max="new_list.length" :rows="10" @reply="" style="margin: 30px 10px;min-width: 400px"/>
    </div>

    <IMask :show="show_mask" @click="exitModal"/>
    <!--查看新闻信息-->
    <IModal :show="show_select_modal" title="查看" :showb="false"
            style="width: 400px">
      <div class="i-moi"
           style="width: 189px;height: 423px;box-shadow: 0 0 5px #999;border-radius: 10px;padding: 10px;font-size: 10px;margin: 20px auto;overflow: auto">
        <ul>
          <li v-for="(item,index) in data_list" :key="index">
            <div v-if="item.type===0" v-html="item.cten.replace(/\n|\r\n/g,'</br>')">
            </div>
            <img v-else :src="imgUrl(item.name)" style="max-width: 189px"/>
          </li>
        </ul>
      </div>
    </IModal>

    <!--删除新闻信息-->
    <IModal :show="show_delete_modal" @confirm="deleteNews" @cancel="exitModal" title="警告"
            style="width: 400px">
      <div style="margin: 0 3%;width: 100%;height: 90px;line-height: 70px;color: #4E5360;">
        <span style="margin: 0 20px">确定删除该条新闻？</span>
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
    name: 'NewsManage',
    data () {
      return {
        show_mask: false,
        show_select_modal: false,
        show_delete_modal: false,
        widths: ['10%', '30%', '20%', '40%'],
        columns: [
          {title: '序列', key: 'idn', align: 'center'},
          {title: '标题', key: 'title', align: 'center'},
          {title: '日期', key: 'date', align: 'center'},
          {
            title: '操作',
            key: 'render',
            align: 'center',
            buttons: [{name: '查看', type: 'primary', key: 'select'}, {name: '删除', type: 'error', key: 'delete'}]
          }
        ],
        temp: {select_news_index: 0, select_news_name: ''},
        data: [],
        pagesition: 1,
        data_list: [],
        new_list: '',
        admin_id: ''
      }
    },
    methods: {
      imgUrl (name) {
        let url = 'http://localhost:8081/image/'
        let index = this.temp.select_news_index
        let dir = this.new_list[index].resource
        return url + dir + '/' + name
      },
      strFormat (txt, list) {
        for (let i = 0; i < list.length; i++) {
          txt = txt.replace('{' + i + '}', list[i])
        }
        return txt
      },
      timeFormat (time) {
        let date = new Date(time)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let second = date.getSeconds()
        return this.strFormat('{0}-{1}-{2} {3}:{4}:{5}', [year, month, day, hours, minutes, second])
      },
      exitModal () {
        // 关闭查询框
        if (this.show_select_modal === true) {
          this.show_select_modal = false
        }

        // 关闭删除框
        if (this.show_delete_modal === true) {
          this.show_delete_modal = false
        }

        this.show_mask = false
      },
      pagingReply (position) {
        this.pagesition = position
        this.data = []
        for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
          if (this.class_list[i] === undefined) {
            break
          }
          let row = {}
          row.idn = i + 1
          row.name = this.new_list[i].name
          row.date = this.timeFormat(this.new_list[i].date)
          this.data.push(row)
        }
      },
      getNewList () {
        // 获得新闻列表
        this.axios.get('/admin/newsl?administrators_id=' + this.admin_id)
          .then((response) => {
            this.new_list = response.data
            this.data = []
            if (this.new_list.length <= 10) {
              this.pagesition = 1
            }
            for (let i = (this.pagesition - 1) * 10; i < this.pagesition * 10; i++) {
              if (this.new_list[i] === undefined) {
                break
              }
              let row = {}
              row.idn = i + 1
              row.name = this.new_list[i].name
              row.date = this.timeFormat(this.new_list[i].date)
              this.data.push(row)
            }
          })
      },
      selectNews () {
        this.axios.get('/admin/ifnew?administrators_id=' + this.admin_id + '&name=' + this.temp.select_news_name)
          .then((response) => {
            this.data_list = response.data
          })
      },
      openSelectModal () {
        this.show_select_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      openDeleteModal () {
        this.show_delete_modal = true
        // 开启遮罩
        this.show_mask = true
      },
      deleteNews () {
        this.axios.post('/admin/dlnew', {
          administrators_id: this.admin_id,
          id: this.new_list[this.temp.select_news_index].id,
          resource: this.new_list[this.temp.select_news_index].resource
        }).then((response) => {
          let json = response.data
          if (json.code === 1) {
            this.exitModal()
            this.getNewList()
          }
        })
      },
      tableReply (index, key) {
        let pos = (this.pagesition-1) * 10 + index
        // 获得选择行数据
        this.temp.select_news_name = this.new_list[pos].name
        this.temp.select_news_index = pos
        if (key === 'select') {
          this.data_list = []
          this.selectNews()
          this.openSelectModal()
        } else if (key === 'delete') {
          this.openDeleteModal()
        }

      }
    },
    created () {
      this.admin_id = this.$store.state.info.admin_id
      // 获得新闻列表
      this.getNewList()
    },
    components: {
      IPaging,
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

  ul {
    margin: 0;
    padding: 0;
    line-height: 20px;
  }
</style>

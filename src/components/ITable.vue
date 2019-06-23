<template>
  <div class="i-table">
    <div class="i-table-head" :style="{display: 'grid',gridTemplateColumns:widths.join(' ')}">
      <div v-for="(column,index) in columns" :key="index"
           style="color: #6E7885;line-height: 40px;background: #F5F7F9;">
        {{column.title}}
      </div>
    </div>
    <div :style="tableH!==undefined?'overflow: auto;height:'+tableH+'px':''">
      <div class="i-table-body" :style="{fontSize:bodySize+'px',display: 'grid',gridTemplateColumns:widths.join(' ')}"
           v-for="(a,i) in data"
           :draggable="moveflag" @dragend="endMove($event,i)">
      <span v-for="(item,index) in data[i]" :key="index"
            style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
        {{item}}
      </span>
        <div>
          <IButton v-for="(item,index) in columns[columns.length-1].buttons"
                   style="margin:  0 5px"
                   @click="reply(i,item.key)"
                   :type="item.type" :key="index">{{item.name}}
          </IButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IButton from './IButton'

  export default {
    name: 'ITable',
    props: {
      columns: Array,
      data: Array,
      data_list: Array,
      bodySize: {type: Number, default: 13},
      moveflag: {type: Boolean, default: false},
      tableH: {type: Number, required: false},
      widths: {type: Array, required: true},
    },
    methods: {
      reply (index, key) {
        this.$emit('reply', index, key)
      },
      // 行位置交换
      endMove (e, index) {
        if (!this.moveflag) {
          return
        }
        // 跨行数
        let lrow = e.offsetY / e.path[0].scrollHeight
        if (e.offsetY - e.path[0].scrollHeight > 0) {
          // 列表最后一个向下则退出
          if (index === this.data.length - 1) {
            return
          }
          // 获取准确移动行数
          if (lrow > this.data.length - 1) {
            lrow = this.data.length - 1 - index
          } else {
            lrow = lrow - 1
          }
          this.down(Math.ceil(lrow), index)
        } else if (e.offsetY < 0) {
          // 列表最后一个向上则退出
          if (index === 0) {
            return
          }
          // 获取准确移动行数
          if (-lrow > index) {
            lrow = -index
          }
          this.upward(Math.ceil(-lrow), index)
        }
      },
      upward (lrow, index) {
        let tem_data = this.data[index]
        this.data.splice(index, 1, this.data[index - lrow])
        this.data.splice(index - lrow, 1, tem_data)

        let tem_data_list = this.data_list[index]
        this.data_list.splice(index, 1, this.data_list[index - lrow])
        this.data_list.splice(index - lrow, 1, tem_data_list)

        this.dataSort()
      },
      down (lrow, index) {
        let tem_data = this.data[index]
        this.data.splice(index, 1, this.data[index + lrow])
        this.data.splice(index + lrow, 1, tem_data)

        let tem_data_list = this.data_list[index]
        this.data_list.splice(index, 1, this.data_list[index + lrow])
        this.data_list.splice(index + lrow, 1, tem_data_list)

        this.dataSort()
      },
      dataSort () {
        for (let i = 0; i < this.data_list.length; i++) {
          this.data[i].idn = i + 1
        }
      }
    }, components: {
      IButton
    }
  }
</script>

<style scoped>
  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style: none;
  }

  .i-table {
    text-align: center;
  }

  .i-table-head {
    border: #D8DDE3 solid 1px;
  }

  .i-table-body {
    border-style: solid;
    border-color: #D8DDE3;
    border-width: 1px;
    border-top-width: 0;
    line-height: 50px;
    color: #4E5360;
  }

  .i-table-body:hover {
    background: #F2FAFE;
  }

</style>

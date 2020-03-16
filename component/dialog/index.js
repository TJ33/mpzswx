/**
 * 弹出层组件
 * 
 * 使用方法：     <dialog popup-show='{{shows}}' title="我是标题" bindbtn="btn"></dialog>    组件中的节点可自定义添加
 * 参数：     
 *          属性：                 介绍：                  值：
 *       popup-show           组件的显示隐藏            true/false
 *        bindbtn            确认/取消返回事件      返回 true为确定/false为取消
 *     is-cancel-show          返回按钮显示             true/false
 *          title               标题内容                  
 */

Component({

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },

  properties: {
    popupShow: {
      type: Boolean,
      observer(newVal, oldVal, changedPath) {
        let Animation = (dur, del) => {
          let animation = wx.createAnimation({
            duration: dur,
            delay: del
          });
          return animation
        }
        if (newVal) {
          let show = Animation(0, 0).height('100vh').step();
          this.setData({
            showHeightAnimation: show.export()
          })
        } else {
          let hiden = Animation(0, 500).height('0').step();
          this.setData({
            showHeightAnimation: hiden.export()
          })
        }
      }
    },
    isCancelShow: {
      type: Boolean
    },
    title: {
      type: String
    },
  },

  attached() {

  },

  observers: {},

  data: {
    showHeightAnimation: '',
    // 弹窗显示控制
  },

  methods: {
    confirmBtn() {
      this.triggerEvent('btn', true)
    },
    cancelBtn() {
      this.triggerEvent('btn', false)
    },
  }
})
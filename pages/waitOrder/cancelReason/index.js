// pages/waitOrder/cancelReason/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reason: [{ name: '司机态度恶劣，服务差', value: '' }, { name: '计划有变，已不需要服务', value: '' }, { name: '司机爽约、乱抢单', value: '' }, { name: '司机告诉我要等很久(大于15分钟)', value: '' }, { name: '所选车型装不下我的货物', value: '' }, { name: '司机让我私下联系', value: '' }, { name: '司机乱开价(装卸费等)', value: '' }, { name: '联系不上司机', value: '' }, { name: '我已经找到其他车了', value: '' }],
    value: '',   //勾选的取消原因
    //按钮判断
    buttonClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //勾选取消原因
  radioChange(e) {
    let value = e.detail.value
    this.setData({
      value: value
    })
  },

  //点击提交按钮
  submit(e) {

    let value = this.data.value

    if (this.data.buttonClick == true) {
      wx.showModal({
        title: '提示',
        content: '是否确认提交',
        async success(res) {
          if (res.confirm) {
            // let result = await ToolServer.cancelReason(value)
            // console.log("result===================================", result)
            // wx.redirectTo({
            //   url: '../single/index'
            // })
          }
        }
      })
      this.setData({
        buttonClick: false
      })
    }

  }
})
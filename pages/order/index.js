// pages/order/index.js
var ToolServer = require('../utils/ToolServer');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation: '',
    vehicleType: [{
      type: '111',
      name: '111'
    }, {
      type: '222',
      name: '222'
    }, {
      type: '333',
      name: '333'
    }, {
      type: '444',
      name: '444'
    }, {
      type: '555',
      name: '555'
    }, {
      type: '666',
      name: '666'
    }],
    sdClearingTypeList: [
      {
        id: 'SPAY',
        value: '是'
      },
      {
        id: 'POSTPAID',
        value: '否'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    //查询车辆类型
    // let vehicleType = await ToolServer.vehicleType()
    // console.log('vehicleType======', vehicleType)
  },

  //导航栏
  async titleTab(e) {
    let index = e.currentTarget.dataset.index;
    console.log('index', index)

    let active = this.data.TopicTitleActive

    let animation = wx.createAnimation({
      duration: 300,
    });
    for (var i in this.data.type) {
      if (index == i && index != active) {
        animation.left(i * 50 + 22 + '%').step()
      }
    }

    this.setData({
      'TopicTitleActive': index,
      'animation': animation.export()
    })

  },

  //滑动切换
  async bindtransition(e) {
    let index = e.detail.current;
    let active = this.data.TopicTitleActive
    let animation = wx.createAnimation({
      duration: 300,
    });
    for (var i in this.data.type) {
      if (index == i && index != active) {
        animation.left(i * 50 + 22 + '%').step()
      }
    }
    this.setData({
      'TopicTitleActive': index,
      'animation': animation.export()
    })

  },

  //付款方式
  radioChange2(e) {
    let sdFreightPayMethod
    console.log(e);
    console.log(this.data.sdClearingTypeList);

    if (e.detail.value == 'SPAY') {
      sdFreightPayMethod = 'PREPAID'
    } else if (e.detail.value == 'RPAY') {
      sdFreightPayMethod = 'POSTPAID'
    }

    this.setData({ 'sdClearingType': e.detail.value, 'sdFreightPayMethod': sdFreightPayMethod })
  },
})
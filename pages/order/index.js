// pages/order/index.js
var ToolServer = require('../utils/ToolServer');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    send: '',
    receipt: '',
    animation: '',
    vehicleType: [{
      type: '111',
      name: '小型面包'
    }, {
      type: '222',
      name: '金杯/微厢'
    }, {
      type: '333',
      name: '小型厢货'
    }, {
      type: '444',
      name: '大型厢货'
    }],
    timeList: [
      {
        id: '0',
        value: '现在'
      },
      {
        id: '1',
        value: '预约'
      }
    ],
    monthList: [
      {
        id: true,
        value: '是'
      },
      {
        id: false,
        value: '否'
      }
    ],
    company: [],

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

  //选择地址
  bindAdds() {

  },

  //选择物流公司
  changeCP() {

  },

  //预约时间的选择
  timeChange(e) {

  },

  //运费是否月结
  monthChange(e) {

  },

  //输入代收货款
  bindCM() {

  },

  //输入备注
  bindBlurBz() {

  },

  //立即下单
  bindOrder() {

  }
})
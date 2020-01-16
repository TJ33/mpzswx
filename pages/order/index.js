// pages/order/index.js
var ToolServer = require('../utils/ToolServer');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    send: '',
    receipt: '',
    freightMonthly: '',
    cargoMoney: '',
    distance: '',
    remark: '',
    animation: '',
    freight: '',
    state: '',
    appointment: '',
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
    companyList: [
      '111', '222'
    ],
    companyIndex: 0,
    companyIdList: [],
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
    //查询用户关联物流公司
    let company = await ToolServer.queryLogisticsCompany()
    console.log("company=======================================", company)

    //查询车辆类型
    let operationTeam = company.id
    let vehicleType = await ToolServer.vehicleType(operationTeam)
    console.log('vehicleType======', vehicleType)
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

    //导航栏自动带出配送距离 参考运费

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
  bindAdds(e) {

  },

  //选择物流公司
  changeCP(e) {
    this.setData({
      companyList: this.data.companyList,
      companyIndex: e.detail.value
    })
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
  async bindOrder() {
    let send = this.data.send
    let receipt = this.data.receipt
    let freightMonthly = this.data.freightMonthly
    let cargoMoney = this.data.cargoMoney
    let distance = this.data.distance
    let remark = this.data.remark
    let vehicleType = this.data.vehicleType
    let freight = this.data.freight
    let operationTeam = this.data.operationTeam
    let state = this.data.state
    let appointment = this.data.appointment

    let result = await ToolServer.merchantOrder(send, receipt, freightMonthly, cargoMoney, distance, remark, vehicleType, freight, operationTeam, state, appointment)
  }
})
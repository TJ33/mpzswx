// pages/account/billDetails/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../../utils/ToolServer');
var TimeServer = require('../../utils/TimeServer');
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    cost: '',
    polyline: [],
    hidden: false,
    other: false,
    translateY: 0,
    waybill: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let waybill = await ToolServer.findWayBill('', options.sn)
    waybill = waybill[0]
    this.reviseTr(waybill)
    let time = waybill.time
    waybill.time.createAt = moment(Date.now(waybill.time.createAt)).format('YYYY-MM-DD HH:mm')
    waybill.time.OrderAt = moment(Date.now(waybill.time.OrderAt)).format('YYYY-MM-DD HH:mm')
    waybill.time.receiveAt = moment(Date.now(waybill.time.receiveAt)).format('YYYY-MM-DD HH:mm')
    waybill.time.signAt = moment(Date.now(waybill.time.signAt)).format('YYYY-MM-DD HH:mm')
    this.setData({
      'waybill': waybill
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  reviseTr(e) {
    let list = e
    let transportStatus = list.transportStatus
    switch (true) {
      case transportStatus == 'CREATED':
        transportStatus = '已下单'
        break;
      case transportStatus == 'PUSHED_ORDER':
        transportStatus = '派单中'
        break;
      case transportStatus == 'RECEIVED_ORDER':
        transportStatus = '已接单'
        break;
      case transportStatus == 'DELIVERING':
        transportStatus = '已揽件'
        break;
      case transportStatus == 'SIGN_IN':
        transportStatus = '已签收'
        break;
      case transportStatus == 'COMPLETE':
        transportStatus = '已完成'
        break;
    }
    list.transportStatus = transportStatus
  },
  up_bt() {
    this.setData({
      'hidden': !this.data.hidden
    })
  },
  other_bt() {
    this.setData({
      'translateY': this.data.translateY * 73 * 3,
      'other': !this.data.other
    })
  }

})
// pages/account/billDetails/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../../utils/ToolServer');
var TimeServer = require('../../utils/TimeServer');
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
    first: '',
    rest: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let waybill = await ToolServer.getAccountDetail(options.id)
    this.reviseTr(waybill)
    waybill.time = await TimeServer.createAtYMD_ONE(waybill.time)
    let [first, ...rest] = waybill.statusLogs.reverse()
    first = await TimeServer.timeYMD_ONE(first)
    rest = await TimeServer.timeYMD(rest)
    this.setData({
      'first': first,
      'rest': rest,
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
    for (let i in list.statusLogs) {
      switch (true) {
        case list.statusLogs[i].status == 'CREATED':
          list.statusLogs[i].status = '下单'
          break;
        case list.statusLogs[i].status == 'IN_LANSHOU':
          list.statusLogs[i].status = '揽件中'
          break;
        case list.statusLogs[i].status == 'RECEIVED':
          list.statusLogs[i].status = '已揽件'
          break;
        case list.statusLogs[i].status == 'DOOR_RECEIVE':
          list.statusLogs[i].status = '上门收件'
          break;
        case list.statusLogs[i].status == 'ALLOCATING':
          list.statusLogs[i].status = '分拨'
          break;
        case list.statusLogs[i].status == 'TRANSPORT':
          list.statusLogs[i].status = '运输中'
          break;
        case list.statusLogs[i].status == 'TO_INTRA_CITY':
          list.statusLogs[i].status = '到达同城配送点'
          break;
        case list.statusLogs[i].status == 'DELIVERING':
          list.statusLogs[i].status = '配送中'
          break;
        case list.statusLogs[i].status == 'SIGN_IN':
          list.statusLogs[i].status = '已签收'
          break;
        case list.statusLogs[i].status == 'RETURN':
          list.statusLogs[i].status = '退回'
          break;
        case list.statusLogs[i].status == 'LOSE':
          list.statusLogs[i].status = '货物丢失'
          break;
        case list.statusLogs[i].status == 'RETURN_STORAGE':
          list.statusLogs[i].status = '退回入库'
          break;
        case list.statusLogs[i].status == 'RETURN_TAKES':
          list.statusLogs[i].status = '退回取走'
          break;
      }
    }
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
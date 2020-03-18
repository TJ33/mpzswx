// pages/account/accountDetail/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../../utils/ToolServer');
var TimeServer = require('../../utils/TimeServer');
Page({

  data: {
    list: [],
    pageNum: 1,
    time: '',
    title: '核对账单',
    shows: false
  },
  async onLoad(options) {
    let time = options.time
    let status = options.status
    console.log('time===========================', time)
    console.log('status================================', status)
    let list = await ToolServer.getAccountList(time, time, status, this.data.pageNum)
    console.log('list================================================', list)
    list.waybills = await this.createTime(list.waybills)
    this.setData({
      'list': list,
      'time': time
    })
  },

  onShow: function () {

  },
  async createTime(e) {
    if (e != '') {
      e = await TimeServer.signInAtYMD(e)
    }
    return e
  },
  bindDes(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../billDetails/index?id=${id}`
    })
  },
  async bindConfirm() {
    this.setData({ 'shows': true })
  },
  async btn(e) {
    if (e.detail) {
      await ToolServer.reconcileConfirm(this.data.list._id)
      this.data.list = await ToolServer.reconcileDateList(this.data.id, 'HAVE_CHECK', this.data.pageNum)
      this.data.list.waybills = await this.createTime(this.data.list.waybills)
      wx.redirectTo({ url: '../account/index' })
    }
    this.setData({
      'list': this.data.list,
      'shows': false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
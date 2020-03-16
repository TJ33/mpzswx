// pages/account/accountDetail/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../../utils/ToolServer');
var TimeServer = require('../../utils/TimeServer');
Page({

  data: {
    list: [],
    pageNum: 1,
    id: '',
    title: '核对账单',
    shows: false
  },
  async onLoad(options) {
    // let id = options.id
    // let status = options.status
    // let list = await ToolServer.reconcileDateList(id, status, this.data.pageNum)
    // list.rows.waybills = await this.createTime(list.rows.waybills)
    // this.setData({
    //   'list': list,
    //   'id': id
    // })
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
      await ToolServer.reconcileConfirm(this.data.list.rows._id)
      this.data.list = await ToolServer.reconcileDateList(this.data.id, 'HAVE_CHECK', this.data.pageNum)
      this.data.list.rows.waybills = await this.createTime(this.data.list.rows.waybills)
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
// pages/account/accountDetail/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../../utils/ToolServer');
var TimeServer = require('../../utils/TimeServer');
import moment from 'moment';
Page({

  data: {
    list: [],
    pageNum: 1,
    // time: '',
    title: '核对账单',
    shows: false
  },
  async onLoad(options) {
    let id = options.id
    let list = await ToolServer.getAccountDetail(id)
    let waybills = list.waybills
    waybills.forEach(function (index, value, array) {
      let signAt = index.time.signAt
      if (signAt != undefined) {
        signAt = moment(Date.now(signAt)).format('YYYY-MM-DD HH:mm')
        index.time.signAt = signAt
      }
    })
    this.setData({
      'list': list
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
    let sn = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../billDetails/index?sn=${sn}`
    })
  },
  async bindConfirm() {
    this.setData({ 'shows': true })
  },
  async btn(e) {
    if (e.detail) {
      let result = await ToolServer.reconcileConfirm(this.data.list.id)
      if (result.success == true) {
        wx.showToast({
          title: '核对成功',
          icon: 'success',
          duration: 1000
        });
        setTimeout(function () {
          wx.redirectTo({ url: '../accountList/index' })
        }, 1000);
      } else {
        wx.showToast({
          title: '核对失败',
          icon: 'none',
          duration: 1000
        });
      }
      // this.data.list = await ToolServer.reconcileDateList(this.data.id, 'HAVE_CHECK', this.data.pageNum)
      // this.data.list.waybills = await this.createTime(this.data.list.waybills)

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
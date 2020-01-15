// pages/addressBook/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../utils/ToolServer');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    list: [],
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {

  },

  async onShow() {
    //查询地址簿列表
    let list = await ToolServer.findAddressBook()
    console.log("list================================", list)
    this.setData({ 'list': list })
  },

  //新增地址
  bindAdds() {
    wx.redirectTo({ url: '../address/index' })
  },

  bindscrolltolower(e) {
    console.log('翻页');
  },
  //修改地址
  bindUp(e) {
    let id = e.currentTarget.dataset.id
    wx.redirectTo({ url: `../address/index?id=${id}` })
  },
  //删除地址
  async bindDel(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否删除当前地址',
      success: async function (res) {
        if (res.confirm) {
          await ToolServer.delAddressBook(id)
          await that.onShow()
        } else if (res.cancel) {
        }
      }
    })
  }
})
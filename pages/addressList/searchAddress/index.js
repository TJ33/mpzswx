// pages/addressList/searchAddress/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../../utils/ToolServer');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',  //0寄件人，1收件人
    menu: 0,
    keyword: '',
    pageNum: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
    let id = e.id
    let list = await ToolServer.findAddressBook('')
    this.setData({ 'id': id, 'list': list })
  },
  async bindMerchant(e) {
    let list
    this.data.keyword = e.detail.value
    let keyword = this.data.keyword
    if (this.data.menu == 0) {
      list = await ToolServer.findAddressBook(keyword)
    }
    this.setData({ 'list': list, 'keyword': keyword })
  },
  //地址薄收货点
  bindAddress(e) {
    let id = this.data.id
    let index = e.currentTarget.dataset.index
    let shops = this.data.list[index]
    if (id == '0') {
      let sendAddress = {
        _id: shops._id,
        address: shops.address,
        anotherNamer: shops.anotherNamer,
        contactName: shops.contactName,
        contactPhone: shops.contactPhone,
        coordinates: shops.coordinates,
        doorplate: shops.doorplate,
      }
      wx.setStorageSync('sendAddress', sendAddress)
    } else {
      let reciveAddress = {
        _id: shops._id,
        address: shops.address,
        anotherNamer: shops.anotherNamer,
        contactName: shops.contactName,
        contactPhone: shops.contactPhone,
        coordinates: shops.coordinates,
        doorplate: shops.doorplate,
      }
      wx.setStorageSync('reciveAddress', reciveAddress)
    }

    wx.switchTab({
      url: `../../order/index`
    })
  },

  //操作菜单
  async bindMenu() {
    let that = this
    let itemList = ['添加地址薄']
    wx.showActionSheet({
      itemList: itemList,
      success: async function (res) {
        if (res.tapIndex == 0) {
          let sp = ''
          wx.navigateTo({ url: '../address/index' })
        }
        that.setData({
          'menu': res.tapIndex,
          'list': that.data.list
        })
      }
    })

  }
})
// pages/addressList/searchAddress/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../../utils/ToolServer');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoname: '',
    pageNum: 1,
    list: [],
    listOther: [],
    logisticsCompany: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(e) {
    console.log(e)
    let logisticsCompany = e.id
    let list_other = await ToolServer.historyMerchant(logisticsCompany) //获取历史商家
    for (var i in list_other.rows) {
      for (var b in list_other.rows[i].contacts) {
        if (list_other.rows[i].contacts[b].default == true) {
          list_other.rows[i].contact = list_other.rows[i].contacts[b]
        }
      }
    }
    console.log('list_other', list_other)
    this.setData({ 'listOther': list_other, 'logisticsCompany': logisticsCompany })
  },
  async onShow() {
  },
  async bindMerchant(e) {
    this.data.phoname = e.detail.value
    let list = await ToolServer.searchMerchant(this.data.contactName, this.data.contactPhone, this.data.address, this.data.pageNum)
    for (var i in list.list) {
      for (var b in list.list[i].contacts) {
        if (list.list[i].contacts[b].default == true) {
          list.list[i].contact = list.list[i].contacts[b]
        }
      }
    }
    console.log('list', list)
    this.setData({
      'list': list
    })
  },
  //选择收货点
  bindShopLs(e) {
    let index = e.currentTarget.dataset.index
    let shops = this.data.listOther.rows[index]

    for (var i in shops.contacts) {
      if (shops.contacts[i].default == true) {
        shops.contact = {
          name: shops.contacts[i].name,
          phone: shops.contacts[i].phone,
        }
      }
    }
    console.log('ShopLs', shops);
    wx.setStorageSync('shops', shops)
    wx.switchTab({
      url: "../../order/index"
    })
  },
  //选择收货点
  bindShop(e) {
    let index = e.currentTarget.dataset.index
    let shops = this.data.list.list[index]
    for (var i in shops.contacts) {
      if (shops.contacts[i].default == true) {
        shops.contact = {
          name: shops.contacts[i].name,
          phone: shops.contacts[i].phone,
        }
      }
    }
    console.log('shops', shops);

    wx.setStorageSync('shops', shops)
    wx.switchTab({
      url: "../../order/index"
    })
  },

})
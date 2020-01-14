import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../utils/ToolServer');
var TimeServer = require('../utils/TimeServer');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    duration: 500,
    animation: '',
    TopicTitleActive: 0,
    type: ['已下单', '已揽件', '已签收', '已完成'],
    waybill: '',
    pageNum: 1,
    list1: [],
    list2: [],
    list3: [],
    list4: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {

  },

  async onShow() {
    let list1 = await ToolServer.findWayBill(this.data.waybill, 'CREATED', this.data.pageNum)
    let list2 = await ToolServer.findWayBill(this.data.waybill, 'DELIVERING', this.data.pageNum)
    let list3 = await ToolServer.findWayBill(this.data.waybill, 'SIGN_IN', this.data.pageNum)
    let list4 = await ToolServer.findWayBill(this.data.waybill, 'COMPLETE', this.data.pageNum)
    this.reviseTr(list1)
    this.reviseTr(list2)
    this.reviseTr(list3)
    this.reviseTr(list4)
    list1.rows = await this.createTime(list1.rows)
    list2.rows = await this.createTime(list2.rows)
    list3.rows = await this.createTime(list3.rows)
    list4.rows = await this.createTime(list4.rows)
    this.setData({
      list1: list1,
      list2: list2,
      list3: list3,
      list4: list4,
    })
  },
  async onPullDownRefresh() {
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000)
    await this.onLoad()
  },
  onReachBottom() {
    wx.showToast({
      title: '加载中',
      icon: 'none',
      duration: 600
    });
  },

  //转换日期
  async createTime(e) {
    if (e != '') {
      e = await TimeServer.createAtFormatLLL(e)
    }
    return e
  },
  reviseTr(e) {
    let list = e
    for (let i in list.rows) {
      switch (true) {
        case list.rows[i].transportStatus == 'CREATED':
          list.rows[i].transportStatus = '下单'
          break;
        case list.rows[i].transportStatus == 'IN_LANSHOU':
          list.rows[i].transportStatus = '揽件中'
          break;
        case list.rows[i].transportStatus == 'RECEIVED':
          list.rows[i].transportStatus = '已揽件'
          break;
        case list.rows[i].transportStatus == 'DOOR_RECEIVE':
          list.rows[i].transportStatus = '上门收件'
          break;
        case list.rows[i].transportStatus == 'ALLOCATING':
          list.rows[i].transportStatus = '分拨'
          break;
        case list.rows[i].transportStatus == 'TRANSPORT':
          list.rows[i].transportStatus = '运输中'
          break;
        case list.rows[i].transportStatus == 'TO_INTRA_CITY':
          list.rows[i].transportStatus = '到达同城配送点'
          break;
        case list.rows[i].transportStatus == 'DELIVERING':
          list.rows[i].transportStatus = '配送中'
          break;
        case list.rows[i].transportStatus == 'SIGN_IN':
          list.rows[i].transportStatus = '已签收'
          break;
        case list.rows[i].transportStatus == 'RETURN':
          list.rows[i].transportStatus = '退回'
          break;
        case list.rows[i].transportStatus == 'LOSE':
          list.rows[i].transportStatus = '货物丢失'
          break;
        case list.rows[i].transportStatus == 'RETURN_STORAGE':
          list.rows[i].transportStatus = '退回入库'
          break;
        case list.rows[i].transportStatus == 'RETURN_TAKES':
          list.rows[i].transportStatus = '退回取走'
          break;
      }
    }
  },
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
  async waybillInput(e) {
    this.setData({
      'waybill': e.detail.value
    })
    if (this.data.TopicTitleActive == 0) {
      this.data.flag = 'SEND'
      this.data.list1 = await ToolServer.searchOrder(e.detail.value, this.data.flag, this.data.pageNum, '', '')
      this.data.list1.rows = await this.createTime(this.data.list1.rows)
      this.reviseTr(this.data.list1)
      this.setData({ 'list1': this.data.list1, 'pageNum': 1 })
    } else {
      this.data.flag = 'RECEIVE'
      this.data.list2 = await ToolServer.searchOrder(e.detail.value, this.data.flag, this.data.pageNum, '', '')
      this.data.list2.rows = await this.createTime(this.data.list2.rows)
      this.reviseTr(this.data.list2)
      this.setData({ 'list2': this.data.list2, 'pageNum': 1 })
    }
  },
  async bindQx() {
    this.setData({
      'waybill': ''
    })
    await this.onLoad()
  },
  //跳转到详情页
  bindDes(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../waybill_other/details/index?id=' + id
    })
  },
  //扫码
  async scanCode() {
    let that = this
    wx.scanCode({
      success: async function (res) {
        console.log(res)
        that.data.list = await ToolServer.searchOrder(res.result, '', that.data.pageNum)
        that.reviseTr(that.data.list)
        that.data.list.rows = await that.createTime(that.data.list.rows)
        that.setData({ 'list': that.data.list })
      }
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
    if (index == 0) {
      this.data.flag = 'SEND'
      this.data.list1 = await ToolServer.searchOrder(this.data.waybill, this.data.flag, this.data.pageNum, '', '')
      this.data.list1.rows = await this.createTime(this.data.list1.rows)
      this.reviseTr(this.data.list1)
      this.setData({ 'list1': this.data.list1, 'pageNum': 1 })
    } else {
      this.data.flag = 'RECEIVE'
      this.data.list2 = await ToolServer.searchOrder(this.data.waybill, this.data.flag, this.data.pageNum, '', '')
      this.data.list2.rows = await this.createTime(this.data.list2.rows)
      this.reviseTr(this.data.list2)
      this.setData({ 'list2': this.data.list2, 'pageNum': 1 })
    }
  },
  //分页加载
  async bindscrolltolower1() {
    await this.tolower(this.data.list1)
    this.setData({ list1: this.data.list1 })

  },
  async bindscrolltolower2() {
    await this.tolower(this.data.list2)
    this.setData({ list2: this.data.list2 })
  },
  async tolower(e) {
    if (e.total > this.data.pageNum * e.pageSize) {
      this.data.pageNum++
      let item = await ToolServer.searchOrder(this.data.waybill, this.data.flag, this.data.pageNum, '', '')
      e.rows = e.rows.concat(item.rows)
      this.reviseTr(e)
      e.rows = await this.createTime(e.rows)
      this.setData({
        pageNum: this.data.pageNum,
      })
    }
  },

})
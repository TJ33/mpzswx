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
    // CREATED：已下单  DELIVERING：已揽件  SIGN_IN：已签收   COMPLETE: 已完成
    type: ['已下单', '已揽件', '已签收', '已完成'],
    waybill: '',     //运单编号
    pageNum: 1,
    createdList: [],
    deliveringList: [],
    signInList: [],
    completeList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {

  },

  async onShow() {
    let createdList = await ToolServer.findWayBill('CREATED', '')
    let deliveringList = await ToolServer.findWayBill('DELIVERING', '')
    let signInList = await ToolServer.findWayBill('SIGN_IN', '')
    let completeList = await ToolServer.findWayBill('COMPLETE', '')

    if (createdList && deliveringList && signInList && completeList) {
      this.reviseTr(createdList)
      this.reviseTr(deliveringList)
      this.reviseTr(signInList)
      this.reviseTr(completeList)
      createdList = await this.createTime(createdList)
      deliveringList = await this.createTime(deliveringList)
      signInList = await this.createTime(signInList)
      completeList = await this.createTime(completeList)

      this.setData({
        createdList: createdList,
        deliveringList: deliveringList,
        signInList: signInList,
        completeList: completeList,
      })
    }

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
    for (let i in list) {
      switch (true) {
        case list[i].transportStatus == 'CREATED':
          list[i].transportStatus = '已下单'
          break;
        case list[i].transportStatus == 'DELIVERING':
          list[i].transportStatus = '已揽件'
          break;
        case list[i].transportStatus == 'SIGN_IN':
          list[i].transportStatus = '已签收'
          break;
        case list[i].transportStatus == 'COMPLETE':
          list[i].transportStatus = '已完成'
          break;
      }
    }
  },
  async titleTab(e) {
    let index = e.currentTarget.dataset.index;
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
      this.data.flag = 'CREATED'
      this.data.createdList = await ToolServer.findWayBill('CREATED', this.data.waybill)
      this.data.createdList = await this.createTime(this.data.createdList)
      this.reviseTr(this.data.createdList)
      this.setData({ 'createdList': this.data.createdList, 'pageNum': 1 })
    } else if (this.data.TopicTitleActive == 1) {
      this.data.flag = 'DELIVERING'
      this.data.deliveringList = await ToolServer.findWayBill('DELIVERING', this.data.waybill)
      this.data.deliveringList = await this.createTime(this.data.deliveringList)
      this.reviseTr(this.data.deliveringList)
      this.setData({ 'deliveringList': this.data.deliveringList, 'pageNum': 1 })
    } else if (this.data.TopicTitleActive == 2) {
      this.data.flag = 'SIGN_IN'
      this.data.signInList = await ToolServer.findWayBill('SIGN_IN', this.data.waybill)
      this.data.signInList = await this.createTime(this.data.signInList)
      this.reviseTr(this.data.signInList)
      this.setData({ 'signInList': this.data.signInList, 'pageNum': 1 })
    } else {
      this.data.flag = 'COMPLETE'
      this.data.completeList = await ToolServer.findWayBill('COMPLETE', this.data.waybill)
      this.data.completeList = await this.createTime(this.data.completeList)
      this.reviseTr(this.data.completeList)
      this.setData({ 'completeList': this.data.completeList, 'pageNum': 1 })
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
      url: '../waybillDetail/index?id=' + id
    })
  },
  //扫码
  async scanCode() {
    let that = this

    let TopicTitleActive = that.data.TopicTitleActive
    let waybill = that.data.waybill
    let status = ''
    switch (TopicTitleActive) {
      case 0:
        status = 'CREATED'
        break;
      case 1:
        status = 'DELIVERING'
        break;
      case 2:
        status = 'SIGN_IN'
        break;
      case 3:
        status = 'COMPLETE'
        break;
      default:
        status = ''
    }

    wx.scanCode({
      success: async function (res) {
        console.log(res)
        let list = await ToolServer.findWayBill(status, waybill)
        that.reviseTr(that.data.list)
        switch (status) {
          case 'CREATED':
            that.data.createdList = list
            that.data.createdList = await that.createTime(that.data.createdList)
            that.setData({ createdList: that.data.createdList })
            break;
          case 'DELIVERING':
            that.data.deliveringList = list
            that.data.deliveringList = await that.createTime(that.data.deliveringList)
            that.setData({ deliveringList: that.data.deliveringList })
            break;
          case 'SIGN_IN':
            that.data.signInList = list
            that.data.signInList = await that.createTime(that.data.signInList)
            that.setData({ signInList: that.data.signInList })
            break;
          case 'COMPLETE':
            that.data.completeList = list
            that.data.completeList = await that.createTime(that.data.completeList)
            that.setData({ completeList: that.data.completeList })
            break;
          default:
        }


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
      this.data.flag = 'CREATED'
      this.data.createdList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      this.data.createdList = await this.createTime(this.data.createdList)
      this.reviseTr(this.data.createdList)
      this.setData({ 'createdList': this.data.createdList, 'pageNum': 1 })
    } else if (index == 1) {
      this.data.flag = 'DELIVERING'
      this.data.deliveringList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      this.data.deliveringList = await this.createTime(this.data.deliveringList)
      this.reviseTr(this.data.deliveringList)
      this.setData({ 'deliveringList': this.data.deliveringList, 'pageNum': 1 })
    } else if (index == 2) {
      this.data.flag = 'SIGN_IN'
      this.data.signInList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      this.data.signInList = await this.createTime(this.data.signInList)
      this.reviseTr(this.data.signInList)
      this.setData({ 'signInList': this.data.signInList, 'pageNum': 1 })
    } else {
      this.data.flag = 'COMPLETE'
      this.data.completeList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      this.data.completeList = await this.createTime(this.data.completeList)
      this.reviseTr(this.data.completeList)
      this.setData({ 'completeList': this.data.completeList, 'pageNum': 1 })
    }
  },
  //分页加载
  async bindscrolltolower1() {
    await this.tolower(this.data.createdList)
    this.setData({ createdList: this.data.createdList })

  },
  async bindscrolltolower2() {
    await this.tolower(this.data.deliveringList)
    this.setData({ deliveringList: this.data.deliveringList })
  },
  async tolower(e) {
    if (e.total > this.data.pageNum * e.pageSize) {
      this.data.pageNum++
      let item = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      e = e.concat(item)
      this.reviseTr(e)
      e = await this.createTime(e)
      this.setData({
        pageNum: this.data.pageNum,
      })
    }
  },

})
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
    waybill: '',
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


    console.log("createdList111======================", createdList)
    console.log("deliveringList111======================", deliveringList)
    console.log("signInList111=====================", signInList)
    console.log("completeList111======================", completeList)

    if (createdList && deliveringList && signInList && completeList) {
      this.reviseTr(createdList)
      this.reviseTr(deliveringList)
      this.reviseTr(signInList)
      this.reviseTr(completeList)
      createdList = await this.createTime(createdList)
      deliveringList = await this.createTime(deliveringList)
      signInList = await this.createTime(signInList)
      completeList = await this.createTime(completeList)

      console.log("createdList222======================", createdList)
      console.log("deliveringList222======================", deliveringList)
      console.log("signInList222=====================", signInList)
      console.log("completeList222======================", completeList)


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
    console.log("日期e111====================================================", e)
    if (e != '') {
      e = await TimeServer.createAtFormatLLL(e)
    }

    console.log("日期e222====================================================", e)
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

    console.log("TopicTitleActive=======================", this.data.TopicTitleActive)

  },
  async waybillInput(e) {
    console.log("e==============================", e.detail.value)
    this.setData({
      'waybill': e.detail.value
    })
    if (this.data.TopicTitleActive == 0) {
      this.data.flag = 'CREATED'
      this.data.createdList = await ToolServer.findWayBill('CREATED', this.data.waybill)
      console.log("this.data.createdList==========================", this.data.createdList)
      this.data.createdList = await this.createTime(this.data.createdList)
      this.reviseTr(this.data.createdList)
      this.setData({ 'createdList': this.data.createdList, 'pageNum': 1 })
    } else if (this.data.TopicTitleActive == 1) {
      this.data.flag = 'DELIVERING'
      this.data.deliveringList = await ToolServer.findWayBill('DELIVERING', this.data.waybill)
      console.log("this.data.deliveringList==========================", this.data.deliveringList)
      this.data.deliveringList = await this.createTime(this.data.deliveringList)
      this.reviseTr(this.data.deliveringList)
      this.setData({ 'deliveringList': this.data.deliveringList, 'pageNum': 1 })
    } else if (this.data.TopicTitleActive == 2) {
      this.data.flag = 'SIGN_IN'
      this.data.signInList = await ToolServer.findWayBill('SIGN_IN', this.data.waybill)
      console.log("this.data.signInList==========================", this.data.signInList)
      this.data.signInList = await this.createTime(this.data.signInList)
      this.reviseTr(this.data.signInList)
      this.setData({ 'signInList': this.data.signInList, 'pageNum': 1 })
    } else {
      this.data.flag = 'COMPLETE'
      this.data.completeList = await ToolServer.findWayBill('COMPLETE', this.data.waybill)
      console.log("this.data.completeList==========================", this.data.completeList)
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
    console.log("waybillDetail  id=================================", id)
    wx.navigateTo({
      url: '../waybillDetail/index?id=' + id
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
        that.data.list = await that.createTime(that.data.list)
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
    console.log("index++++++++++++++++++++++++++++++++++++++++++++++++", index)
    if (index == 0) {
      this.data.flag = 'CREATED'
      this.data.createdList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      console.log("this.data.createdList++++++++++++++++++++++++++++++++++++++++++++++++", this.data.createdList)
      this.data.createdList = await this.createTime(this.data.createdList)
      this.reviseTr(this.data.createdList)
      this.setData({ 'createdList': this.data.createdList, 'pageNum': 1 })
    } else if (index == 1) {
      this.data.flag = 'DELIVERING'
      this.data.deliveringList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      console.log("this.data.deliveringList111++++++++++++++++++++++++++++++++++++++++++++++++", this.data.deliveringList)
      this.data.deliveringList = await this.createTime(this.data.deliveringList)
      console.log("this.data.deliveringList222++++++++++++++++++++++++++++++++++++++++++++++++", this.data.deliveringList)
      this.reviseTr(this.data.deliveringList)
      console.log("this.data.deliveringList333------------------------------------------------------------------", this.data.deliveringList)
      this.setData({ 'deliveringList': this.data.deliveringList, 'pageNum': 1 })
    } else if (index == 2) {
      this.data.flag = 'SIGN_IN'
      this.data.signInList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      console.log("this.data.signInList++++++++++++++++++++++++++++++++++++++++++++++++", this.data.signInList)
      this.data.signInList = await this.createTime(this.data.signInList)
      this.reviseTr(this.data.signInList)
      this.setData({ 'signInList': this.data.signInList, 'pageNum': 1 })
    } else {
      this.data.flag = 'COMPLETE'
      this.data.completeList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      console.log("this.data.completeList++++++++++++++++++++++++++++++++++++++++++++++++", this.data.completeList)
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
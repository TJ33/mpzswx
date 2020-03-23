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
    // CREATED：已下单 PUSHED_ORDER:已推单   RECEIVED_ORDER: 已接单 DELIVERING：已揽件，正在配送中  SIGN_IN：已签收   COMPLETE: 已完成
    type: ['全部', '已揽件', '已签收', '派单中'],
    waybill: '',     //运单编号
    pageNum: 1,
    allList: [],         //全部
    deliveringList: [],  //已揽件
    signInList: [],      //已签收
    pushedOrderList: [],    //派单中(已推单)
  },

  async onLoad() {
    let judgeLogin = wx.getStorageSync('judgeLogin')
    console.log('judgeLogin======================', judgeLogin)
    if (judgeLogin != '') {
      //查询全部
      let allList = await ToolServer.findWayBill('', '')
      let deliveringList = await ToolServer.findWayBill('DELIVERING', '')
      let signInList = await ToolServer.findWayBill('SIGN_IN', '')
      let pushedOrderList = await ToolServer.findWayBill('RECEIVED_ORDER', '')
      if (allList && deliveringList && signInList && pushedOrderList) {
        allList = await this.createTime(allList)
        deliveringList = await this.createTime(deliveringList)
        signInList = await this.createTime(signInList)
        pushedOrderList = await this.createTime(pushedOrderList)
        this.setData({
          allList: allList,
          deliveringList: deliveringList,
          signInList: signInList,
          pushedOrderList: pushedOrderList
        })
      }
    }

  },

  async onShow() {
    let judgeLogin = wx.getStorageSync('judgeLogin')
    if (judgeLogin != '') {
      //查询全部
      let allList = await ToolServer.findWayBill('', '')
      allList = await this.createTime(allList)
      this.setData({
        allList: allList
      })
    }

    // let createdList = await ToolServer.findWayBill('CREATED', '')
    // let deliveringList = await ToolServer.findWayBill('DELIVERING', '')
    // let signInList = await ToolServer.findWayBill('SIGN_IN', '')
    // let completeList = await ToolServer.findWayBill('COMPLETE', '')

    // if (createdList && deliveringList && signInList && completeList) {
    //   this.reviseTr(createdList)
    //   this.reviseTr(deliveringList)
    //   this.reviseTr(signInList)
    //   this.reviseTr(completeList)
    //   createdList = await this.createTime(createdList)
    //   deliveringList = await this.createTime(deliveringList)
    //   signInList = await this.createTime(signInList)
    //   completeList = await this.createTime(completeList)

    //   this.setData({
    //     createdList: createdList,
    //     deliveringList: deliveringList,
    //     signInList: signInList,
    //     completeList: completeList,
    //   })
    // }

    // let createdList = await ToolServer.findWayBill('CREATED', '')
    // if (createdList) {
    //   this.reviseTr(createdList)
    //   createdList = await this.createTime(createdList)
    //   this.setData({
    //     createdList: createdList
    //   })
    // }
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
        case list[i].transportStatus == 'DELIVERING':
          list[i].transportStatus = '已揽件'
          break;
        case list[i].transportStatus == 'SIGN_IN':
          list[i].transportStatus = '已签收'
          break;
        case list[i].transportStatus == 'PUSHED_ORDER':
          list[i].transportStatus = '派单中'
          break;
        case list[i].transportStatus == 'CREATED':
          list[i].transportStatus = '已下单'
          break;
        case list[i].transportStatus == 'RECEIVED_ORDER':
          list[i].transportStatus = '已接单'
          break;
        case list[i].transportStatus == 'COMPLETE':
          list[i].transportStatus = '已完成'
          break;
        // case list[i].transportStatus == 'CREATED':
        //   list[i].transportStatus = '已下单'
        //   break;
        // case list[i].transportStatus == 'COMPLETE':
        //   list[i].transportStatus = '已完成'
        //   break;  
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
      this.data.flag = ''
      this.data.allList = await ToolServer.findWayBill('', this.data.waybill)
      this.data.allList = await this.createTime(this.data.allList)
      // this.reviseTr(this.data.allList)
      this.setData({ 'allList': this.data.allList, 'pageNum': 1 })
    }
    else if (this.data.TopicTitleActive == 1) {
      this.data.flag = 'DELIVERING'
      this.data.deliveringList = await ToolServer.findWayBill('DELIVERING', this.data.waybill)
      this.data.deliveringList = await this.createTime(this.data.deliveringList)
      // this.reviseTr(this.data.deliveringList)
      this.setData({ 'deliveringList': this.data.deliveringList, 'pageNum': 1 })
    } else if (this.data.TopicTitleActive == 2) {
      this.data.flag = 'SIGN_IN'
      this.data.signInList = await ToolServer.findWayBill('SIGN_IN', this.data.waybill)
      this.data.signInList = await this.createTime(this.data.signInList)
      // this.reviseTr(this.data.signInList)
      this.setData({ 'signInList': this.data.signInList, 'pageNum': 1 })
    } else {
      this.data.flag = 'PUSHED_ORDER'
      this.data.pushedOrderList = await ToolServer.findWayBill('PUSHED_ORDER', this.data.waybill)
      this.data.pushedOrderList = await this.createTime(this.data.pushedOrderList)
      // this.reviseTr(this.data.pushedOrderList)
      this.setData({ 'pushedOrderList': this.data.pushedOrderList, 'pageNum': 1 })
    }
    // if (this.data.TopicTitleActive == 0) {
    //   this.data.flag = 'CREATED'
    //   this.data.createdList = await ToolServer.findWayBill('CREATED', this.data.waybill)
    //   this.data.createdList = await this.createTime(this.data.createdList)
    //   this.reviseTr(this.data.createdList)
    //   this.setData({ 'createdList': this.data.createdList, 'pageNum': 1 })
    // } 
    // else {
    //   this.data.flag = 'COMPLETE'
    //   this.data.completeList = await ToolServer.findWayBill('COMPLETE', this.data.waybill)
    //   this.data.completeList = await this.createTime(this.data.completeList)
    //   this.reviseTr(this.data.completeList)
    //   this.setData({ 'completeList': this.data.completeList, 'pageNum': 1 })
    // }



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
    let status = ''
    switch (TopicTitleActive) {
      case 0:
        status = ''
        break;
      case 1:
        status = 'DELIVERING'
        break;
      case 2:
        status = 'SIGN_IN'
        break;
      case 3:
        status = 'PUSHED_ORDER'
        break;
      // case 0:
      //   status = 'CREATED'
      //   break;
      // case 3:
      //   status = 'COMPLETE'
      //   break;
    }

    wx.scanCode({
      success: async function (res) {
        let waybill = res.result
        let list = await ToolServer.findWayBill(status, waybill)
        // that.reviseTr(that.data.list)
        switch (status) {
          case '':
            that.data.allList = list
            that.data.allList = await that.createTime(that.data.allList)
            that.setData({ allList: that.data.allList })
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
          case 'PUSHED_ORDER':
            that.data.signInList = list
            that.data.signInList = await that.createTime(that.data.signInList)
            that.setData({ signInList: that.data.signInList })
            break;
          // case 'CREATED':
          //   that.data.createdList = list
          //   that.data.createdList = await that.createTime(that.data.createdList)
          //   that.setData({ createdList: that.data.createdList })
          //   break;
          // case 'COMPLETE':
          //   that.data.completeList = list
          //   that.data.completeList = await that.createTime(that.data.completeList)
          //   that.setData({ completeList: that.data.completeList })
          //   break;
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
      this.data.flag = ''
      this.data.allList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      this.data.allList = await this.createTime(this.data.allList)
      // this.reviseTr(this.data.allList)
      this.setData({ 'allList': this.data.allList, 'pageNum': 1 })
    }
    else if (index == 1) {
      this.data.flag = 'DELIVERING'
      this.data.deliveringList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      this.data.deliveringList = await this.createTime(this.data.deliveringList)
      // this.reviseTr(this.data.deliveringList)
      this.setData({ 'deliveringList': this.data.deliveringList, 'pageNum': 1 })
    } else if (index == 2) {
      this.data.flag = 'SIGN_IN'
      this.data.signInList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      this.data.signInList = await this.createTime(this.data.signInList)
      // this.reviseTr(this.data.signInList)
      this.setData({ 'signInList': this.data.signInList, 'pageNum': 1 })
    } else {
      this.data.flag = 'PUSHED_ORDER'
      this.data.pushedOrderList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      this.data.pushedOrderList = await this.createTime(this.data.pushedOrderList)
      // this.reviseTr(this.data.pushedOrderList)
      this.setData({ 'pushedOrderList': this.data.pushedOrderList, 'pageNum': 1 })
    }

    // if (index == 0) {
    //   this.data.flag = 'CREATED'
    //   this.data.createdList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
    //   this.data.createdList = await this.createTime(this.data.createdList)
    //   this.reviseTr(this.data.createdList)
    //   this.setData({ 'createdList': this.data.createdList, 'pageNum': 1 })
    // } 
    // else {
    //   this.data.flag = 'COMPLETE'
    //   this.data.completeList = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
    //   this.data.completeList = await this.createTime(this.data.completeList)
    //   this.reviseTr(this.data.completeList)
    //   this.setData({ 'completeList': this.data.completeList, 'pageNum': 1 })
    // }
  },
  //分页加载
  async bindscrolltolower1() {
    await this.tolower(this.data.allList)
    this.setData({ allList: this.data.allList })
  },
  async bindscrolltolower2() {
    await this.tolower(this.data.deliveringList)
    this.setData({ deliveringList: this.data.deliveringList })
  },
  async bindscrolltolower3() {
    await this.tolower(this.data.signInList)
    this.setData({ signInList: this.data.signInList })
  },
  async bindscrolltolower4() {
    await this.tolower(this.data.pushedOrderList)
    this.setData({ pushedOrderList: this.data.pushedOrderList })
  },
  async tolower(e) {
    if (e.total > this.data.pageNum * e.pageSize) {
      this.data.pageNum++
      let item = await ToolServer.findWayBill(this.data.flag, this.data.waybill)
      e = e.concat(item)
      // this.reviseTr(e)
      e = await this.createTime(e)
      this.setData({
        pageNum: this.data.pageNum,
      })
    }
  },

})
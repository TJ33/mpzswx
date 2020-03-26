// pages/waitOrder/history/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../../utils/ToolServer');
var TimeServer = require('../../utils/TimeServer');
import moment from 'moment';
Page({
  data: {
    duration: 500,
    animation: '',
    TopicTitleActive: 0,
    type: ['全部', '派单中', '已揽件', '已签收'],
    waybill: '',
    pageNum: 1,
    list: [],
    stTime: '',
    edTime: '',
    startList: [{
      value: '全部',
      id: ''
    }, {
      value: '派单中',
      id: 'PUSHED_ORDER'
    }, {
      value: '已揽件',
      id: 'DELIVERING'
    }, {
      value: '已签收',
      id: 'SIGN_IN'
    }],
    startIndex: 0,
    dataList: ['昨天', '本周', '本月'],
    dataIndex: '',
    ser: false,
    ssBoxShow: false,
    dataBoxShow: true,
    animation: '',
  },

  async onLoad() {
    let data = moment().format('YYYY-MM-DD')
    let result = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, data, data, this.data.startList[this.data.startIndex].id)
    let list = result.data
    this.reviseTr(list)
    list = await this.createTime(list)
    this.setData({
      'list': list,
      'stTime': data,
      'edTime': data,
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
    for (let i in list) {
      switch (true) {
        case list[i].transportStatus == 'CREATED':
          list[i].transportStatus = '已下单'
          break;
        case list[i].transportStatus == 'PUSHED_ORDER':
          list[i].transportStatus = '派单中'
          break;
        case list[i].transportStatus == 'RECEIVED_ORDER':
          list[i].transportStatus = '已接单'
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
  //运单状态选择
  async bindStart(e) {
    let index = e.currentTarget.dataset.index;
    let result = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[index].id)
    let list = result.data
    this.reviseTr(list)
    list = await this.createTime(list)
    this.setData({
      'list': list,
      'startIndex': index
    })
  },
  //日期选择
  async bindData(e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.data.stTime = moment().subtract('days', 1).format('YYYY-MM-DD');
    } else if (index == 1) {
      this.data.stTime = moment().subtract('days', 7).format('YYYY-MM-DD');
    } else if (index == 2) {
      this.data.stTime = moment().subtract('days', 31).format('YYYY-MM-DD');
    }
    let result = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[this.data.startIndex].id)
    let list = result.data
    this.reviseTr(list)
    list = await this.createTime(list)
    this.setData({
      'list': list,
      'dataIndex': index,
      'stTime': this.data.stTime
    })
  },
  //点击搜索图标 显示/隐藏 输入运单编号的框
  bindSer() {
    let ser = !this.data.ser
    this.setData({ ser: ser })
  },
  bindssBox() {
    let ssBoxShow = !this.data.ssBoxShow
    this.setData({ ssBoxShow: ssBoxShow })
  },
  bindDataBox() {
    let dataBoxShow = !this.data.dataBoxShow
    let animation = wx.createAnimation({
      duration: 300,
    });
    if (dataBoxShow) {
      animation.rotate(90).step()
    } else {
      animation.rotate(0).step()
    }

    this.setData({ 'dataBoxShow': dataBoxShow, 'animation': animation.export() })
  },
  //输入运单编号查询
  async waybillInput(e) {
    let result = await ToolServer.searchOrder(e.detail.value, this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[this.data.startIndex].id)
    let list = result.data
    this.reviseTr(list)
    list = await this.createTime(list)
    this.setData({
      'list': list,
      'waybill': e.detail.value
    })
  },
  //扫码
  async scanCode() {
    let that = this
    wx.scanCode({
      success: async function (res) {
        let result = await ToolServer.searchOrder(res.result, that.data.pageNum, that.data.stTime, that.data.edTime, that.data.startList[that.data.startIndex].id)
        let list = result.data
        that.reviseTr(list)
        list = await that.createTime(list)
        that.setData({ 'list': list })
      }
    })
  },
  //点击取消
  async bindQx() {
    let result = await ToolServer.searchOrder('', this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[this.data.startIndex].id)
    let list = result.data
    this.reviseTr(list)
    list = await this.createTime(list)
    this.setData({
      'list': list,
      'waybill': ''
    })
  },
  //选择日期开始时间
  async bindStTime(e) {
    let result = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, e.detail.value, this.data.edTime, this.data.startList[this.data.startIndex].id)
    let list = result.data
    this.reviseTr(list)
    list = await this.createTime(list)
    this.setData({
      stTime: e.detail.value,
      list: list
    })
  },
  //选择日期结束时间
  async bindEdTime(e) {
    let result = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, this.data.stTime, e.detail.value, this.data.startList[this.data.startIndex].id)
    let list = result.data
    this.reviseTr(list)
    list = await this.createTime(list)
    this.setData({
      edTime: e.detail.value,
      list: list
    })
  },



  bindDes(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '../../waybillDetail/index?id=' + id })
  },
  async bindscrolltolower() {
    await this.tolower(this.data.list)
    this.reviseTr(this.data.list)
    this.data.list = await this.createTime(this.data.list)
    this.setData({ list: this.data.list })
  },
  async tolower(e) {
    if (e.total > this.data.pageNum * e.pageSize) {
      this.data.pageNum++
      let item = await searchOrder(this.data.waybill, this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[this.data.startIndex].id)
      e = e.concat(item)
      this.reviseTr(e)
      e = await this.createTime(e)
      this.setData({
        pageNum: this.data.pageNum,
      })
    }
  },





})
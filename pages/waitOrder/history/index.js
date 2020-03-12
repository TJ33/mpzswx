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
    console.log('this.data.waybill==================================', this.data.waybill)
    console.log('this.data.pageNum==================================', this.data.pageNum)
    console.log('this.data.stTime==================================', data)
    console.log('this.data.edTime==================================', data)
    console.log('this.data.startList==================================', this.data.startList[this.data.startIndex].id)
    let list = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, data, data, this.data.startList[this.data.startIndex].id)
    console.log('list================================================', list)
    this.reviseTr(list)
    list.rows = await this.createTime(list.rows)
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
    for (let i in list.rows) {
      switch (true) {
        case list.rows[i].transportStatus == 'CREATED':
          list.rows[i].transportStatus = '已下单'
          break;
        case list.rows[i].transportStatus == 'PUSHED_ORDER':
          list.rows[i].transportStatus = '派单中'
          break;
        case list.rows[i].transportStatus == 'RECEIVED_ORDER':
          list.rows[i].transportStatus = '已接单'
          break;
        case list.rows[i].transportStatus == 'DELIVERING':
          list.rows[i].transportStatus = '已揽件'
          break;
        case list.rows[i].transportStatus == 'SIGN_IN':
          list.rows[i].transportStatus = '已签收'
          break;
        case list.rows[i].transportStatus == 'COMPLETE':
          list.rows[i].transportStatus = '已完成'
          break;
      }
    }
  },
  //状态选择
  async bindStart(e) {
    let index = e.currentTarget.dataset.index;
    let list = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[index].id)
    this.reviseTr(list)
    list.rows = await this.createTime(list.rows)
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
    let list = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[this.data.startIndex].id)
    this.reviseTr(list)
    list.rows = await this.createTime(list.rows)
    this.setData({
      'list': list,
      'dataIndex': index,
      'stTime': this.data.stTime
    })
  },
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

  async waybillInput(e) {
    let list = await ToolServer.searchOrder(e.detail.value, this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[this.data.startIndex].id)
    this.reviseTr(list)
    list.rows = await this.createTime(list.rows)
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
        console.log(res)
        that.data.list = ToolServer.searchOrder(res.result, this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[this.data.startIndex].id)
        that.reviseTr(that.data.list)
        that.data.list.rows = await that.createTime(that.data.list.rows)
        that.setData({ 'list': that.data.list })
      }
    })
  },
  async bindQx() {
    let list = await ToolServer.searchOrder('', this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[this.data.startIndex].id)
    this.reviseTr(list)
    list.rows = await this.createTime(list.rows)
    this.setData({
      'list': list,
      'waybill': ''
    })
  },
  async bindStTime(e) {
    let list = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, e.detail.value, this.data.edTime, this.data.startList[this.data.startIndex].id)
    this.reviseTr(list)
    list.rows = await this.createTime(list.rows)
    this.setData({
      stTime: e.detail.value,
      list: list
    })
  },
  async bindEdTime(e) {
    let list = await ToolServer.searchOrder(this.data.waybill, this.data.pageNum, this.data.stTime, e.detail.value, this.data.startList[this.data.startIndex].id)
    this.reviseTr(list)
    list.rows = await this.createTime(list.rows)
    this.setData({
      edTime: e.detail.value,
      list: list
    })
  },



  bindDes(e) {
    let sn = e.currentTarget.dataset.sn
    wx.navigateTo({ url: `../../order_other/qrDetails/index?id=${sn}` })
  },
  async bindscrolltolower() {
    await this.tolower(this.data.list)
    this.reviseTr(this.data.list)
    this.data.list.rows = await this.createTime(this.data.list.rows)
    this.setData({ list: this.data.list })
  },
  async tolower(e) {
    if (e.total > this.data.pageNum * e.pageSize) {
      this.data.pageNum++
      let item = await searchOrder(this.data.waybill, this.data.pageNum, this.data.stTime, this.data.edTime, this.data.startList[this.data.startIndex].id)
      e.rows = e.rows.concat(item.rows)
      this.reviseTr(e)
      e.rows = await this.createTime(e.rows)
      this.setData({
        pageNum: this.data.pageNum,
      })
    }
  },





})
// pages/account/accountList/index.js
import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../../utils/ToolServer');
var TimeServer = require('../../utils/TimeServer');
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation: '',
    TopicTitleActive: 0,    //导航按钮
    type: ['未对账', '已对账'],
    screen: ['全部', '筛选'],
    screenActive: 0,      //筛选日期按钮
    screenBs: false,
    status: 'NOT_CHECK',    //NOT_CHECK未对账 HAVE_CHECK已对账
    startTime: '',
    endTime: '',
    noCheckList: [],
    haveCheckList: [],
    pageNum: 1,

    dataList: ['昨天', '本周', '本月'],
    dataIndex: '',
    ssBoxShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //周期对账
    let noCheckList = await ToolServer.getAccountList('', '', 'NOT_CHECK', this.data.pageNum)
    let haveCheckList = await ToolServer.getAccountList('', '', 'HAVE_CHECK', this.data.pageNum)
    noCheckList = noCheckList.data
    haveCheckList = haveCheckList.data
    noCheckList = await this.createTime(noCheckList)
    haveCheckList = await this.createTime(haveCheckList)
    this.setData({
      'noCheckList': noCheckList,
      'haveCheckList': haveCheckList,
    })
  },
  async onShow() {

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
  async createTime(e) {
    if (e != '') {
      e = await TimeServer.createDateYMD(e)
    }
    return e
  },

  //标题选择
  async titleTab(e) {
    let index = e.currentTarget.dataset.index;
    let active = this.data.TopicTitleActive

    let animation = wx.createAnimation({
      duration: 300,
    });
    for (var i in this.data.type) {
      if (index == i && index != active) {
        animation.left(i * 50 + 20 + '%').step()
      }
    }
    this.setData({
      'TopicTitleActive': index,
      'status': this.data.status,
      'animation': animation.export()
    })
  },
  //全部或筛选
  async screenTab(e) {
    let index = e.currentTarget.dataset.index;
    let screenBs
    if (index == 0) {
      this.data.dataIndex = 4
      screenBs = false
      this.data.ssBoxShow = false
      if (this.data.TopicTitleActive == 0) {
        this.data.status = 'NOT_CHECK'
        this.data.noCheckList = await ToolServer.getAccountList('', '', this.data.status, this.data.pageNum)
        this.data.noCheckList = this.data.noCheckList.data
        this.data.noCheckList = await this.createTime(this.data.noCheckList)
      } else {
        this.data.status = 'HAVE_CHECK'
        this.data.haveCheckList = await ToolServer.getAccountList('', '', this.data.status, this.data.pageNum)
        this.data.haveCheckList = this.data.haveCheckList.data
        this.data.haveCheckList = await this.createTime(this.data.haveCheckList)
      }
    } else {
      screenBs = true
      let data = moment().format('YYYY-MM-DD')
      this.data.startTime = data
      this.data.endTime = data
      if (this.data.TopicTitleActive == 0) {
        this.data.status = 'NOT_CHECK'
        this.data.noCheckList = await ToolServer.getAccountList(this.data.startTime, this.data.endTime, this.data.status, this.data.pageNum)
        this.data.noCheckList = this.data.noCheckList.data
        this.data.noCheckList = await this.createTime(this.data.noCheckList)
      } else {
        this.data.status = 'HAVE_CHECK'
        this.data.haveCheckList = await ToolServer.getAccountList(this.data.startTime, this.data.endTime, this.data.status, this.data.pageNum)
        this.data.haveCheckList = this.data.haveCheckList.data
        this.data.haveCheckList = await this.createTime(this.data.haveCheckList)
      }
    }
    this.setData({
      'dataIndex': this.data.dataIndex,
      'ssBoxShow': this.data.ssBoxShow,
      'screenActive': index,
      'screenBs': screenBs,
      'noCheckList': this.data.noCheckList,
      'haveCheckList': this.data.haveCheckList,
      'status': this.data.status,
      'startTime': this.data.startTime,
      'endTime': this.data.endTime
    })

  },
  //跳转到每日账单
  bindBill(e) {
    let time = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../accountDetail/index?time=' + time + '&status=' + this.data.status
    })
  },
  //选择日期
  async bindStartTime(e) {
    if (this.data.TopicTitleActive == 0) {
      this.data.status = 'NOT_CHECK'
      this.data.noCheckList = await ToolServer.getAccountList(e.detail.value, this.data.endTime, this.data.status, this.data.pageNum)
      this.data.noCheckList = this.data.noCheckList.data
      this.data.noCheckList = await this.createTime(this.data.noCheckList)
    } else {
      this.data.status = 'HAVE_CHECK'
      this.data.haveCheckList = await ToolServer.getAccountList(e.detail.value, this.data.endTime, this.data.status, this.data.pageNum)
      this.data.haveCheckList = this.data.haveCheckList.data
      this.data.haveCheckList = await this.createTime(this.data.haveCheckList)
    }
    this.setData({
      'noCheckList': this.data.noCheckList,
      'haveCheckList': this.data.haveCheckList,
      'status': this.data.status,
      'startTime': e.detail.value
    })
  },
  async bindEndTime(e) {
    if (this.data.TopicTitleActive == 0) {
      this.data.status = 'NOT_CHECK'
      this.data.noCheckList = await ToolServer.getAccountList(this.data.startTime, e.detail.value, this.data.status, this.data.pageNum)
      this.data.noCheckList = this.data.noCheckList.data
      this.data.noCheckList = await this.createTime(this.data.noCheckList)
    } else {
      this.data.status = 'HAVE_CHECK'
      this.data.haveCheckList = await ToolServer.getAccountList(this.data.startTime, e.detail.value, this.data.status, this.data.pageNum)
      this.data.haveCheckList = this.data.haveCheckList.data
      this.data.haveCheckList = await this.createTime(this.data.haveCheckList)
    }
    this.setData({
      'noCheckList': this.data.noCheckList,
      'haveCheckList': this.data.haveCheckList,
      'status': this.data.status,
      'endTime': e.detail.value
    })
  },
  // //查询按钮
  // async bindSearch() {
  //   this.setData({
  //     'screenActive': 1,
  //     'screenBs': false,
  //   })
  //   let index = this.data.TopicTitleActive
  //   if (index == 0) {
  //     this.data.status = 'NOT_CHECK'
  //     this.data.noCheckList = await ToolServer.getAccountList(this.data.startTime,this.data.endTime, this.data.status, this.data.pageNum)
  // this.data.noCheckList = this.data.noCheckList.data
  //     this.data.noCheckList = await this.createTime(this.data.noCheckList)
  //   } else {
  //     this.data.status = 'HAVE_CHECK'
  //     this.data.haveCheckList = await ToolServer.getAccountList(this.data.startTime,this.data.endTime, this.data.status, this.data.pageNum)
  // this.data.haveCheckList = this.data.haveCheckList.data
  //     this.data.haveCheckList = await this.createTime(this.data.haveCheckList)
  //   }
  //   this.setData({
  //     'noCheckList': this.data.noCheckList,
  //     'haveCheckList': this.data.haveCheckList,
  //     'status': this.data.status
  //   })
  // },
  //日期图标开关
  bindssBox() {
    let ssBoxShow = !this.data.ssBoxShow
    this.setData({ ssBoxShow: ssBoxShow })
  },
  //日期选择
  async bindData(e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.data.startTime = moment().subtract('days', 1).format('YYYY-MM-DD');
    } else if (index == 1) {
      this.data.startTime = moment().subtract('days', 7).format('YYYY-MM-DD');
    } else if (index == 2) {
      this.data.startTime = moment().subtract('days', 31).format('YYYY-MM-DD');
    }
    if (this.data.TopicTitleActive == 0) {
      this.data.status = 'NOT_CHECK'
      this.data.noCheckList = await ToolServer.getAccountList(this.data.startTime, this.data.endTime, this.data.status, this.data.pageNum)
      this.data.noCheckList = this.data.noCheckList.data
      this.data.noCheckList = await this.createTime(this.data.noCheckList)
    } else {
      this.data.status = 'HAVE_CHECK'
      this.data.haveCheckList = await ToolServer.getAccountList(this.data.startTime, this.data.endTime, this.data.status, this.data.pageNum)
      this.data.haveCheckList = this.data.haveCheckList.data
      this.data.haveCheckList = await this.createTime(this.data.haveCheckList)
    }

    this.setData({
      'noCheckList': this.data.noCheckList,
      'haveCheckList': this.data.haveCheckList,
      'status': this.data.status,
      'dataIndex': index,
      'startTime': this.data.startTime
    })
  },
  // bindScreen(e) {
  //   let animation = wx.createAnimation({
  //     duration: 300,
  //   });
  //   animation.scale(1, 1).step()
  //   this.setData({
  //     animation: animation.export()
  //   })
  // },
  async bindtransition(e) {
    let index = e.detail.current;
    let active = this.data.TopicTitleActive
    let animation = wx.createAnimation({
      duration: 300,
    });
    for (var i in this.data.type) {
      if (index == i && index != active) {
        animation.left(i * 50 + 20 + '%').step()
      }
    }
    if (this.data.screenActive == 0) {
      if (index == 0) {
        this.data.status = 'NOT_CHECK'
        this.data.noCheckList = await ToolServer.getAccountList('', '', this.data.status, this.data.pageNum)
        this.data.noCheckList = this.data.noCheckList.data
        this.data.noCheckList = await this.createTime(this.data.noCheckList)
      } else {
        this.data.status = 'HAVE_CHECK'
        this.data.haveCheckList = await ToolServer.getAccountList('', '', this.data.status, this.data.pageNum)
        this.data.haveCheckList = this.data.haveCheckList.data
        this.data.haveCheckList = await this.createTime(this.data.haveCheckList)
      }
    } else {
      if (index == 0) {
        this.data.status = 'NOT_CHECK'
        this.data.noCheckList = await ToolServer.getAccountList(this.data.startTime, this.data.endTime, this.data.status, this.data.pageNum)
        this.data.noCheckList = this.data.noCheckList.data
        this.data.noCheckList = await this.createTime(this.data.noCheckList)
      } else {
        this.data.status = 'HAVE_CHECK'
        this.data.haveCheckList = await ToolServer.getAccountList(this.data.startTime, this.data.endTime, this.data.status, this.data.pageNum)
        this.data.haveCheckList = this.data.haveCheckList.data
        this.data.haveCheckList = await this.createTime(this.data.haveCheckList)
      }
    }
    this.setData({
      'TopicTitleActive': index,
      'noCheckList': this.data.noCheckList,
      'haveCheckList': this.data.haveCheckList,
      'status': this.data.status,
      'animation': animation.export()
    })
  },
  //分页加载
  async bindscrolltolower1() {
    await this.tolower(this.data.noCheckList)
    this.setData({ noCheckList: this.data.noCheckList })

  },
  async bindscrolltolower2() {
    await this.tolower(this.data.haveCheckList)
    this.setData({ haveCheckList: this.data.haveCheckList })
  },
  async tolower(e) {
    if (e.total > this.data.pageNum * e.pageSize) {
      this.data.pageNum++
      let item = await ToolServer.getAccountList(this.data.startTime, this.data.endTime, this.data.status, this.data.pageNum)
      item = item.data
      e = e.concat(item)
      e = await this.createTime(e)
      this.setData({
        pageNum: this.data.pageNum,
      })
    }
  }


})
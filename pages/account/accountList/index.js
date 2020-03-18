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
    timeAt: '',
    timeEt: '',
    list1: [],
    list2: [],
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
    // let list1 = await ToolServer.getAccountList('', 'NOT_CHECK', this.data.pageNum)
    // let list2 = await ToolServer.getAccountList('', 'HAVE_CHECK', this.data.pageNum)
    // list1.rows = await this.createTime(list1.rows)
    // list2.rows = await this.createTime(list2.rows)
    // this.setData({
    //   'list1': list1,
    //   'list2': list2,
    // })
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
        this.data.list1 = await ToolServer.getAccountList('', this.data.status, this.data.pageNum)
        this.data.list1.rows = await this.createTime(this.data.list1.rows)
      } else {
        this.data.status = 'HAVE_CHECK'
        this.data.list2 = await ToolServer.getAccountList('', this.data.status, this.data.pageNum)
        this.data.list2.rows = await this.createTime(this.data.list2.rows)
      }
    } else {
      screenBs = true
      let data = moment().format('YYYY-MM-DD')
      this.data.timeAt = data
      this.data.timeEt = data
      if (this.data.TopicTitleActive == 0) {
        this.data.status = 'NOT_CHECK'
        this.data.list1 = await ToolServer.getAccountList(this.data.timeAt + '--' + this.data.timeEt, this.data.status, this.data.pageNum)
        this.data.list1.rows = await this.createTime(this.data.list1.rows)
      } else {
        this.data.status = 'HAVE_CHECK'
        this.data.list2 = await ToolServer.getAccountList(this.data.timeAt + '--' + this.data.timeEt, this.data.status, this.data.pageNum)
        this.data.list2.rows = await this.createTime(this.data.list2.rows)
      }
    }
    this.setData({
      'dataIndex': this.data.dataIndex,
      'ssBoxShow': this.data.ssBoxShow,
      'screenActive': index,
      'screenBs': screenBs,
      'list1': this.data.list1,
      'list2': this.data.list2,
      'status': this.data.status,
      'timeAt': this.data.timeAt,
      'timeEt': this.data.timeEt
    })

  },
  //跳转到每日账单
  bindBill(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../bill/index?id=' + id + '&status=' + this.data.status
    })
  },
  //选择日期
  async bindtimeAt(e) {
    if (this.data.TopicTitleActive == 0) {
      this.data.status = 'NOT_CHECK'
      this.data.list1 = await ToolServer.getAccountList(e.detail.value + '--' + this.data.timeEt, this.data.status, this.data.pageNum)
      this.data.list1.rows = await this.createTime(this.data.list1.rows)
    } else {
      this.data.status = 'HAVE_CHECK'
      this.data.list2 = await ToolServer.getAccountList(e.detail.value + '--' + this.data.timeEt, this.data.status, this.data.pageNum)
      this.data.list2.rows = await this.createTime(this.data.list2.rows)
    }
    this.setData({
      'list1': this.data.list1,
      'list2': this.data.list2,
      'status': this.data.status,
      'timeAt': e.detail.value
    })
  },
  async bindtimeEt(e) {
    if (this.data.TopicTitleActive == 0) {
      this.data.status = 'NOT_CHECK'
      this.data.list1 = await ToolServer.getAccountList(this.data.timeAt + '--' + e.detail.value, this.data.status, this.data.pageNum)
      this.data.list1.rows = await this.createTime(this.data.list1.rows)
    } else {
      this.data.status = 'HAVE_CHECK'
      this.data.list2 = await ToolServer.getAccountList(this.data.timeAt + '--' + e.detail.value, this.data.status, this.data.pageNum)
      this.data.list2.rows = await this.createTime(this.data.list2.rows)
    }
    this.setData({
      'list1': this.data.list1,
      'list2': this.data.list2,
      'status': this.data.status,
      'timeEt': e.detail.value
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
  //     this.data.list1 = await ToolServer.getAccountList(this.data.timeAt+'--'+this.data.timeEt, this.data.status, this.data.pageNum)
  //     this.data.list1.rows = await this.createTime(this.data.list1.rows)
  //   } else {
  //     this.data.status = 'HAVE_CHECK'
  //     this.data.list2 = await ToolServer.getAccountList(this.data.timeAt+'--'+this.data.timeEt, this.data.status, this.data.pageNum)
  //     this.data.list2.rows = await this.createTime(this.data.list2.rows)
  //   }
  //   this.setData({
  //     'list1': this.data.list1,
  //     'list2': this.data.list2,
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
      this.data.timeAt = moment().subtract('days', 1).format('YYYY-MM-DD');
    } else if (index == 1) {
      this.data.timeAt = moment().subtract('days', 7).format('YYYY-MM-DD');
    } else if (index == 2) {
      this.data.timeAt = moment().subtract('days', 31).format('YYYY-MM-DD');
    }
    if (this.data.TopicTitleActive == 0) {
      this.data.status = 'NOT_CHECK'
      this.data.list1 = await ToolServer.getAccountList(this.data.timeAt + '--' + this.data.timeEt, this.data.status, this.data.pageNum)
      this.data.list1.rows = await this.createTime(this.data.list1.rows)
    } else {
      this.data.status = 'HAVE_CHECK'
      this.data.list2 = await ToolServer.getAccountList(this.data.timeAt + '--' + this.data.timeEt, this.data.status, this.data.pageNum)
      this.data.list2.rows = await this.createTime(this.data.list2.rows)
    }

    this.setData({
      'list1': this.data.list1,
      'list2': this.data.list2,
      'status': this.data.status,
      'dataIndex': index,
      'timeAt': this.data.timeAt
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
    console.log('e', index)
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
        this.data.list1 = await ToolServer.getAccountList('', this.data.status, this.data.pageNum)
        this.data.list1.rows = await this.createTime(this.data.list1.rows)
      } else {
        this.data.status = 'HAVE_CHECK'
        this.data.list2 = await ToolServer.getAccountList('', this.data.status, this.data.pageNum)
        this.data.list2.rows = await this.createTime(this.data.list2.rows)
      }
    } else {
      if (index == 0) {
        this.data.status = 'NOT_CHECK'
        this.data.list1 = await ToolServer.getAccountList(this.data.timeAt + '--' + this.data.timeEt, this.data.status, this.data.pageNum)
        this.data.list1.rows = await this.createTime(this.data.list1.rows)
      } else {
        this.data.status = 'HAVE_CHECK'
        this.data.list2 = await ToolServer.getAccountList(this.data.timeAt + '--' + this.data.timeEt, this.data.status, this.data.pageNum)
        this.data.list2.rows = await this.createTime(this.data.list2.rows)
      }
    }
    this.setData({
      'TopicTitleActive': index,
      'list1': this.data.list1,
      'list2': this.data.list2,
      'status': this.data.status,
      'animation': animation.export()
    })
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
      let item = await ToolServer.getAccountList(this.data.timeAt + '--' + this.data.timeEt, this.data.status, this.data.pageNum)
      e.rows = e.rows.concat(item.rows)
      e.rows = await this.createTime(e.rows)
      this.setData({
        pageNum: this.data.pageNum,
      })
    }
  }


})
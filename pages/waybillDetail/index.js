// pages/waybillDetail/index.js
import regeneratorRuntime from "regenerator-runtime";
import moment from 'moment';
var ToolServer = require('../utils/ToolServer');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //原本
    cost: '',
    polyline: [],
    hidden: false,
    other: false,
    translateY: 0,
    waybill: '',
    first: '',
    rest: [],
    id: '',
    //新增
    time: {
      createAt: '',
      OrderAt: '',
      receiveAt: ''
    },
    transportStatus: '',      //运单状态
    consignor: {               //寄件人
      address: '',
      name: '',
      phone: ''
    },
    consignee: {               //收件人
      address: '',
      name: '',
      phone: ''
    },
    sn: '',                   //运单编号
    cargoMoney: '',            //代收货款
    //遮罩修改框
    dialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log("options id=============================", options.id)
    let waybill = await ToolServer.findWayBillDetails(options.id)
    //商家已下单  
    let transportStatus = waybill.transportStatus    //CREATED：已下单   DELIVERING：已揽件   SIGN_IN：已签收   COMPLETE: 已完成
    //到达(揽件)时间
    let time = waybill.time
    let createAt = time.createAt   //下单时间
    let OrderAt = time.OrderAt     //接单时间
    let receiveAt = time.receiveAt //揽件时间 
    let newTime = new Object()

    console.log("createAt111==============================", createAt)

    newTime.createAt = moment(createAt).format("YYYY-MM-DD HH:mm")
    newTime.OrderAt = moment(OrderAt).format("YYYY-MM-DD HH:mm")
    newTime.receiveAt = moment(receiveAt).format("YYYY-MM-DD HH:mm")

    //寄件人信息 店铺名 姓名 电话
    let consignor = waybill.consignor
    let consignorAddress = consignor.address
    let consignorName = consignor.contactName
    let consignorPhone = consignor.contactPhone
    let newConsignor = new Object()
    newConsignor.address = consignorAddress
    newConsignor.name = consignorName
    newConsignor.phone = consignorPhone
    //收件人信息 店铺名 姓名 电话
    let consignee = waybill.consignee
    let consigneeAddress = consignee.address
    let consigneeName = consignor.contactName
    let consigneePhone = consignor.contactPhone
    let newConsignee = new Object()
    newConsignee.address = consigneeAddress
    newConsignee.name = consigneeName
    newConsignee.phone = consigneePhone
    //运单编号  查看条码
    let sn = waybill.sn
    //代收货款   
    let cargoMoney = waybill.cargoMoney
    console.log("cargoMoney==============================", cargoMoney)

    this.setData({
      transportStatus: transportStatus,
      time: newTime,
      consignor: newConsignor,
      consignee: newConsignee,
      sn: sn,
      cargoMoney: cargoMoney
    })

    // console.log("waybill====================================", waybill)
    // // this.reviseTr(waybill)
    // waybill.cost.freightPayMethod = this.payMethod(waybill.cost.freightPayMethod)
    // console.log('waybill', waybill)
    // waybill.time = await TimeServer.createAtYMD_ONE(waybill.time)

    // let [first, ...rest] = waybill.statusLogs.reverse()
    // first = await TimeServer.timeYMD_ONE(first)
    // rest = await TimeServer.timeYMD(rest)
    // this.setData({
    //   'first': first,
    //   'rest': rest,
    //   'waybill': waybill,
    //   'id': options.id,
    //   'cargoMoney': waybill.cost.cargoMoney,
    // })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  reviseTr(e) {
    let list = e
    for (let i in list.statusLogs) {
      switch (true) {
        case list.statusLogs[i].status == 'CREATED':
          list.statusLogs[i].status = '下单'
          break;
        case list.statusLogs[i].status == 'IN_LANSHOU':
          list.statusLogs[i].status = '揽件中'
          break;
        case list.statusLogs[i].status == 'RECEIVED':
          list.statusLogs[i].status = '已揽件'
          break;
        case list.statusLogs[i].status == 'DOOR_RECEIVE':
          list.statusLogs[i].status = '上门收件'
          break;
        case list.statusLogs[i].status == 'ALLOCATING':
          list.statusLogs[i].status = '分拨'
          break;
        case list.statusLogs[i].status == 'TRANSPORT':
          list.statusLogs[i].status = '运输中'
          break;
        case list.statusLogs[i].status == 'TO_INTRA_CITY':
          list.statusLogs[i].status = '到达同城配送点'
          break;
        case list.statusLogs[i].status == 'DELIVERING':
          list.statusLogs[i].status = '配送中'
          break;
        case list.statusLogs[i].status == 'SIGN_IN':
          list.statusLogs[i].status = '已签收'
          break;
        case list.statusLogs[i].status == 'RETURN':
          list.statusLogs[i].status = '退回'
          break;
        case list.statusLogs[i].status == 'LOSE':
          list.statusLogs[i].status = '货物丢失'
          break;
        case list.statusLogs[i].status == 'RETURN_STORAGE':
          list.statusLogs[i].status = '退回入库'
          break;
        case list.statusLogs[i].status == 'RETURN_TAKES':
          list.statusLogs[i].status = '退回取走'
          break;
      }
    }
  },
  payMethod(e) {
    switch (true) {
      case e == "DEDUCTION":
        e = '账号扣款'
        break;
      case e == "PREPAID":
        e = '寄件人付'
        break;
      case e == "POSTPAID":
        e = '收件人付'
        break;
    }
    return e
  },
  up_bt() {
    this.setData({
      'hidden': !this.data.hidden
    })
  },
  other_bt() {
    this.setData({
      'translateY': this.data.translateY * 73 * 3,
      'other': !this.data.other
    })
  },
  bindMap() {
    wx.navigateTo({ url: '../map/index?id=' + this.data.id })
  },
  phoneDeliveryman() {
    wx.makePhoneCall({
      phoneNumber: this.data.first.deliveryman.phone // 仅为示例，并非真实的电话号码
    })
  },
  phoneConsignee() {
    wx.makePhoneCall({
      phoneNumber: this.data.waybill.consignee.contact.phone // 仅为示例，并非真实的电话号码
    })
  },
  bindTm() {
    wx.navigateTo({ url: '../../order_other/qrDetails/index?id=' + this.data.waybill.sn })
  },
  //修改代收货款
  bindHk() {
    wx.redirectTo({ url: `../updata/index?id=${this.data.id}&cargoMoney=${this.data.waybill.cost.cargoMoney}` })



  },
  //修改活保存
  // async bindClose(e) {
  //   let index = e.currentTarget.dataset.index
  //   console.log('e', index)
  //   if (index == 0) {
  //     await ToolServer.cargoMoneyUpdate({ 'id': this.data.id, 'cargoMoney': this.data.cargoMoney })

  //     let waybill = await ToolServer.orderDetails(this.data.id)
  //     waybill.cost.freightPayMethod = this.payMethod(waybill.cost.freightPayMethod)
  //     console.log('waybill', waybill)
  //     waybill.time = await TimeServer.createAtYMD_ONE(waybill.time)
  //     let [first, ...rest] = waybill.statusLogs.reverse()
  //     first = await TimeServer.timeYMD_ONE(first)
  //     rest = await TimeServer.timeYMD(rest)
  //     this.setData({
  //       'first': first,
  //       'rest': rest,
  //       'waybill': waybill,
  //       'cargoMoney': waybill.cost.cargoMoney,
  //     })
  //   }
  //   this.setData({
  //     dialog: false
  //   })
  // },



  // }

})
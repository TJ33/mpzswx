// pages/order/index.js
var ToolServer = require('../utils/ToolServer');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    consignor: {
      contactName: '',    // 联系人
      contactPhone: '',   // 联系电话
      address: '',        // 详细地址
      coordinates: ''     // 地图坐标
    },
    consignee: {
      contactName: '',
      contactPhone: '',
      address: '',
      coordinates: ''
    },
    freightMonthly: [{    //运费是否月结
      id: true,
      value: '是'
    },
    {
      id: false,
      value: '否'
    }],
    cargoMoney: '',        //代收货款金额
    distance: '',          //配送距离
    remark: '',            //商家备注
    vehicleList: [{        //车辆类型
      id: '111',
      name: '小型面包'
    }, {
      id: '222',
      name: '金杯/微厢'
    }, {
      id: '333',
      name: '小型厢货'
    }, {
      id: '444',
      name: '大型厢货'
    }],
    freight: '',           //运费
    operationTeam: '',     //物流公司id
    receiveAt: '',         //预约时间
    animation: '',         //
    appointment: '',       //
    state: [               //现在 0/预约 1
      {
        id: '0',
        value: '现在'
      },
      {
        id: '1',
        value: '预约'
      }
    ],
    companyIndexList: [],  //物流公司下标集合
    companyList: [],       //物流公司集合
    companyIndex: 0,       //物流公司下标
    sendIndexList: [],     //寄件地址下标集合
    sendList: [],          //寄件地址集合
    sendIndex: 0,          //寄件地址下标
    receiptIndexList: [],  //收件地址下标集合
    receiptList: [],       //收件地址集合
    receiptIndex: 0,       //收件地址下标
    consignorList: [],      //寄件人对象集合
    consigneeList: [],      //收件人对象集合
    //useCoupon:'',        //优惠卷
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    //查询用户关联物流公司
    let companyList = []
    let companyIndexList = []
    let company = await ToolServer.queryLogisticsCompany()
    console.log("company=======================================", company)
    for (let i = 0; i < company.length; i++) {
      let name = company[i].name
      let id = company[i].id
      console.log("物流公司id==========================", id)
      companyList.push(name)
      companyIndexList.push(id)
    }

    this.setData({
      companyList: companyList,
      companyIndexList: companyIndexList
    })

    console.log("companyList=======", companyList)
    console.log("companyIndexList===================", companyIndexList)


    //查询车辆类型 根据物流公司id查询车辆类型
    // let sendList = []
    // let sendIndexList = []
    // let operationTeam = company.id
    // let vehicleType = await ToolServer.vehicleType(operationTeam)
    // for (let i = 0; i < vehicleType.length; i++) {
    //   let name = vehicleType[i].name
    //   let id = vehicleType[i].id
    //   sendList.push(name)
    //   sendIndexList.push(id)
    // }
    // console.log('vehicleType======', vehicleType)

    //查询地址簿
    let sendList = []
    let sendIndexList = []
    let receiptList = []
    let receiptIndexList = []
    let consignorList = []
    let consigneeList = []


    let addressBook = await ToolServer.findAddressBook()
    console.log("addressBook======================================", addressBook)
    for (let i = 0; i < addressBook.length; i++) {
      let addressName = addressBook[i].address
      let addressId = addressBook[i]._id
      sendList.push(addressName)
      sendIndexList.push(addressId)
      receiptList.push(addressName)
      receiptIndexList.push(addressId)

      //寄件人/收件人 对象集合
      let name = addressBook[i].contactName
      let phone = addressBook[i].contactPhone
      let coordinates = addressBook[i].coordinates

      let consignor = new Object()
      consignor.address = addressName
      consignor.name = name
      consignor.phone = phone
      consignor.coordinates = coordinates
      let consignee = new Object()
      consignee.address = addressName
      consignee.name = name
      consignee.phone = phone
      consignee.coordinates = coordinates
      consignorList.push(consignor)
      consigneeList.push(consignee)
      // let phone = addressBook[i]
    }

    //车辆
    let vehicleList = await ToolServer.vehicleType(companyIndexList[0])
    console.log("vehicleList================================", vehicleList)

    this.setData({
      sendList: sendList,
      sendIndexList: sendIndexList,
      receiptList: receiptList,
      receiptIndexList: receiptIndexList,
      consignorList: consignorList,
      consigneeList: consigneeList,
      consignor: consignorList[0],
      consignee: consigneeList[0],
      vehicleList: vehicleList
    })

    console.log('addressBook===========================', addressBook)
    console.log('consignorList===========================', consignorList)
    console.log('consigneeList===========================', consigneeList)

  },

  //导航栏
  async titleTab(e) {
    let index = e.currentTarget.dataset.index;
    console.log('index', index)
    //选择车辆
    let vehicleId = this.data.vehicleList[index].id
    console.log("车辆id========================", vehicleId)

    //根据寄件人坐标 收件人坐标 车辆类型 计算配送距离
    let send = this.data.consignor.coordinates
    let receipt = this.data.consignee.coordinates
    console.log("send=====================", send)
    console.log("receipt=====================", receipt)
    // let distance = await ToolServer.waybillDistance(send, receipt, vehicleId);
    // console.log("distance=====================", distance)
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

    //导航栏自动带出配送距离 参考运费

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

  },

  //付款方式
  radioChange2(e) {
    let sdFreightPayMethod
    console.log(e);
    console.log(this.data.sdClearingTypeList);

    if (e.detail.value == 'SPAY') {
      sdFreightPayMethod = 'PREPAID'
    } else if (e.detail.value == 'RPAY') {
      sdFreightPayMethod = 'POSTPAID'
    }

    this.setData({ 'sdClearingType': e.detail.value, 'sdFreightPayMethod': sdFreightPayMethod })
  },

  //选择寄件地址
  changeSend(e) {
    let index = e.detail.value
    let consignor = this.data.consignorList[index]
    this.setData({
      sendList: this.data.sendList,
      sendIndex: index,
      consignor: consignor
    })
  },

  //选择收件地址
  changeReceipt(e) {
    let index = e.detail.value
    let consignee = this.data.consigneeList[index]
    this.setData({
      receiptList: this.data.receiptList,
      receiptIndex: index,
      consignee: consignee
    })
  },

  //选择物流公司
  async changeCP(e) {
    console.log("e=============================", e)
    let index = e.detail.value
    console.log("index==========================", index)
    console.log("this.data.companyList=======================", this.data.companyList)
    console.log("this.data.companyList[e.detail.value]=======================", this.data.companyList[e.detail.value])
    this.setData({
      companyList: this.data.companyList,
      companyIndex: e.detail.value
    })

    //根据物流公司id 选择对应车辆
    let companyId = this.data.companyIndexList[index]
    // console.log("companyId==========================", companyId)
    let vehicleList = await ToolServer.vehicleType(companyId)
    console.log("vehicleList===============================", vehicleList)
    this.setData({
      vehicleList: vehicleList
    })


  },

  //预约时间的选择
  timeChange(e) {

  },

  //运费是否月结
  monthChange(e) {

  },

  //输入代收货款
  bindCM() {

  },

  //输入备注
  bindBlurBz() {

  },

  //立即下单
  async bindOrder() {
    let send = this.data.send
    let receipt = this.data.receipt
    let freightMonthly = this.data.freightMonthly
    let cargoMoney = this.data.cargoMoney
    let distance = this.data.distance
    let remark = this.data.remark
    let vehicleType = this.data.vehicleType
    let freight = this.data.freight
    let operationTeam = this.data.operationTeam
    let state = this.data.state
    let appointment = this.data.appointment

    let result = await ToolServer.merchantOrder(send, receipt, freightMonthly, cargoMoney, distance, remark, vehicleType, freight, operationTeam, state, appointment)
  }
})
// pages/order/index.js
var ToolServer = require('../utils/ToolServer');
var dateTimePicker = require('../utils/DateTimePicker.js');
// var TimeServer = require('../utils/TimeServer');
import moment from 'moment';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    consignor: '',         //寄件人id
    consignee: '',         //收件人id
    consignorObject: {
      contactName: '',    // 联系人
      contactPhone: '',   // 联系电话
      address: '',        // 详细地址
      coordinates: ''     // 地图坐标
    },
    consigneeObject: {
      contactName: '',
      contactPhone: '',
      address: '',
      coordinates: ''
    },
    freightMonthlyList: [{    //运费是否月结
      id: true,
      value: '是',
    },
    {
      id: false,
      value: '否',
    }],
    freightMonthly: '',
    cargoMoney: '',        //代收货款金额
    distance: '',          //配送距离
    remark: '',            //商家备注
    vehicleTypeList: [{        //车辆类型
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
    vehicleType: '',
    freight: '',           //运费
    haveFreight: true,
    operationTeam: '',     //物流公司id
    stateList: [               //现在 0/预约 1
      {
        id: '0',
        value: '现在'
      },
      {
        id: '1',
        value: '预约'
      }
    ],
    state: '',
    receiveAt: '',         //预约时间
    animation: '',         //
    appointment: '',       //
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

    //时间选择相关
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    startYear: 2000,
    endYear: 2050,
    isNow: false,
    haveTime: true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //选择时间相关
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();

    this.setData({
      dateTimeArray: obj.dateTimeArray,
      dateTime: obj.dateTime
    });
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

      let consignorObject = new Object()
      consignorObject.address = addressName
      consignorObject.name = name
      consignorObject.phone = phone
      consignorObject.coordinates = coordinates
      consignorObject.id = addressId
      let consigneeObject = new Object()
      consigneeObject.address = addressName
      consigneeObject.name = name
      consigneeObject.phone = phone
      consigneeObject.coordinates = coordinates
      consigneeObject.id = addressId
      consignorList.push(consignorObject)
      consigneeList.push(consigneeObject)
    }

    //车辆
    let vehicleTypeList = await ToolServer.vehicleType(companyIndexList[0])
    console.log("companyIndexList[0]==========================", companyIndexList[0])
    console.log("vehicleTypeList================================", vehicleTypeList)
    console.log("consignorList========================", consignorList)
    console.log("consigneeList========================", consigneeList)

    this.setData({
      companyList: companyList,
      companyIndexList: companyIndexList,
      sendList: sendList,
      sendIndexList: sendIndexList,
      receiptList: receiptList,
      receiptIndexList: receiptIndexList,
      consignorList: consignorList,
      consigneeList: consigneeList,
      consignorObject: consignorList[0],
      consigneeObject: consigneeList[0],
      consignor: consignorList[0].id,
      consignee: consigneeList[0].id,
      vehicleTypeList: vehicleTypeList,
      operationTeam: companyIndexList[0]
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
    let vehicleId = this.data.vehicleTypeList[index].id
    console.log("车辆id========================", vehicleId)

    //根据寄件人坐标 收件人坐标 车辆类型 计算配送距离
    console.log("this.data.consignor================", this.data.consignorObject)
    console.log("this.data.consignor.coordinates================", this.data.consignorObject.coordinates)
    let sendCoordinates = this.data.consignorObject.coordinates
    let receipteCoordinates = this.data.consigneeObject.coordinates
    let send = {
      longitude: sendCoordinates[0],
      latitude: sendCoordinates[1]
    }
    let receipt = {
      longitude: receipteCoordinates[0],
      latitude: receipteCoordinates[1]
    }
    let result = await ToolServer.waybillDistance(sendCoordinates, receipteCoordinates, vehicleId);
    let distance = result.distance
    let price = result.price
    console.log("result=====================", result)
    console.log("distance=====================", distance)
    console.log("price=====================", price)
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
      'animation': animation.export(),
      vehicleType: vehicleId,
      haveFreight: false,
      freight: price,
      distance: distance
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

  //选择寄件地址
  changeSend(e) {
    let index = e.detail.value
    let consignor = this.data.consignorList[index].id
    console.log("consignor==================", consignor)
    this.setData({
      sendList: this.data.sendList,
      sendIndex: index,
      consignor: consignor
    })
  },

  //选择收件地址
  changeReceipt(e) {
    let index = e.detail.value
    let consignee = this.data.consigneeList[index].id
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
    let vehicleTypeList = await ToolServer.vehicleType(companyId)
    console.log("vehicleTypeList===============================", vehicleTypeList)
    this.setData({
      operationTeam: companyId,
      vehicleTypeList: vehicleTypeList
    })


  },

  //预约时间的选择
  timeChange(e) {
    let index = e.detail.value
    if (index == 0) {
      this.setData({
        state: '0',
        isNow: false,
        receiveAt: moment().format("YYYY-MM-DD HH:mm")
      })
    } else {
      this.setData({
        state: '1',
        isNow: true,
        receiveAt: ''
      })
    }
  },

  //运费是否月结
  monthChange(e) {
    let index = e.detail.value
    if (index == 0) {
      this.setData({
        freightMonthly: true
      })
    } else {
      this.setData({
        freightMonthly: false,
      })
    }
  },

  //输入代收货款
  bindCM(e) {
    this.setData({
      cargoMoney: e.detail.value
    })
  },

  //输入备注
  bindBlurBz(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  //立即下单
  async bindOrder() {
    let consignor = this.data.consignor
    let consignee = this.data.consignee
    let freightMonthly = this.data.freightMonthly
    let cargoMoney = this.data.cargoMoney
    let distance = this.data.distance
    let remark = this.data.remark
    let vehicleType = this.data.vehicleType
    let freight = this.data.freight
    let operationTeam = this.data.operationTeam
    let state = this.data.state
    let receiveAt = this.data.receiveAt

    console.log("consignor================================", consignor)
    console.log("consignee================================", consignee)
    console.log("freightMonthly================================", freightMonthly)
    console.log("cargoMoney================================", cargoMoney)
    console.log("distance================================", distance)
    console.log("remark================================", remark)
    console.log("vehicleType================================", vehicleType)
    console.log("freight================================", freight)
    console.log("operationTeam================================", operationTeam)
    console.log("state================================", state)
    console.log("receiveAt================================", receiveAt)

    if (vehicleType == "") {
      wx.showToast({
        title: '请选择车辆',
        icon: 'none',
        duration: 1000
      });
      return
    }

    if (state == "") {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none',
        duration: 1000
      });
      return
    }

    if (state == '1' && receiveAt == "") {
      wx.showToast({
        title: '请选择具体时间',
        icon: 'none',
        duration: 1000
      });
      return
    }

    // if (freightMonthly == "") {
    //   wx.showToast({
    //     title: '请选择是否月结',
    //     icon: 'none',
    //     duration: 1000
    //   });
    //   return
    // }

    if (cargoMoney == "") {
      wx.showToast({
        title: '代收货款不能为空',
        icon: 'none',
        duration: 1000
      });
      return
    }

    wx.showModal({
      title: '提示',
      content: '是否确认下单',
      async success(res) {
        if (res.confirm) {
          let result = await ToolServer.merchantOrder(consignor, consignee, freightMonthly, cargoMoney, distance, remark, vehicleType, freight, operationTeam, state, receiveAt)
          console.log("result===================================", result)
        }
      }
    })




  },


  //时间选择相关方法
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    let receiveAt = dateArr[0][arr[0]] + "-" + dateArr[1][arr[1]] + "-" + dateArr[2][arr[2]] + " " + dateArr[3][arr[3]] + ":" + dateArr[4][arr[4]]
    // {{dateTimeArray[0][dateTime[0]]}}-{{dateTimeArray[1][dateTime[1]]}}-{{dateTimeArray[2][dateTime[2]]}} {{dateTimeArray[3][dateTime[3]]}}:{{dateTimeArray[4][dateTime[4]]}}
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      receiveAt: receiveAt,
      haveTime: false
    });
  },
})
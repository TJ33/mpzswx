// pages/order/index.js
var ToolServer = require('../utils/ToolServer');
var dateTimePicker = require('../utils/DateTimePicker.js');
// var TimeServer = require('../utils/TimeServer');
import moment from 'moment';
import io from 'weapp.socket.io'

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
    freightMonthly: false,
    cargoMoney: '',        //代收货款金额
    distance: '',          //配送距离
    remark: '',            //商家备注
    vehicleTypeIndexList: '',   //车辆下标集合  
    vehicleTypeList: [],       //车辆集合
    vehicleTypeIndex: 0,        //车辆类型下标
    vehicleType: '',             //车辆id
    freight: '',           //运费
    haveFreight: true,
    operationTeam: '',     //物流公司id
    state: '0',
    receiveAt: moment().format("YYYY-MM-DD HH:mm"),         //预约时间
    animation: '',         //
    appointment: '',       //
    companyIndexList: [],  //物流公司下标集合
    companyList: [],       //物流公司集合
    companyIndex: 0,       //物流公司下标

    //时间选择相关
    date: '',
    time: '',
    dateTimeArray: null,
    dateTime: null,
    startYear: 2000,
    endYear: 2050,
    isNow: false,
    haveTime: true,

    //长链接相关
    //纬度
    latitude: 0.0,
    //经度
    longitude: 0.0,

    //switch开关相关
    appointChecked: false,
    monthChecked: false,

    //选择地址相关
    sendAddress: '',
    reciveAddress: '',
    id: '',        //0寄件人，1收件人

    // sendIndexList: [],     //寄件地址下标集合
    // sendList: [],          //寄件地址集合
    // sendIndex: 0,          //寄件地址下标
    // receiptIndexList: [],  //收件地址下标集合
    // receiptList: [],       //收件地址集合
    // receiptIndex: 0,       //收件地址下标
    // consignorList: [],      //寄件人对象集合
    // consigneeList: [],      //收件人对象集合
    // sendAddress: false,
    // receiptAddress: false,
    //useCoupon:'',        //优惠卷
    // freightMonthlyList: [{    //运费是否月结
    //   id: true,
    //   value: '是',
    // },
    // {
    //   id: false,
    //   value: '否',
    // }],
    // stateList: [               //现在 0/预约 1
    //   {
    //     id: '0',
    //     value: '现在'
    //   },
    //   {
    //     id: '1',
    //     value: '预约'
    //   }
    // ],

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
    //选择地址之后跳转的数据
    let sendAddress = wx.getStorageSync('sendAddress')
    let reciveAddress = wx.getStorageSync('reciveAddress')
    console.log("sendAddress----------------------------------------", sendAddress)
    console.log("reciveAddress----------------------------------------", reciveAddress)
    this.setData({
      sendAddress: sendAddress,
      reciveAddress: reciveAddress
    })


    //查询用户关联物流公司
    let companyList = []
    let companyIndexList = []
    let company = await ToolServer.queryLogisticsCompany()
    for (let i = 0; i < company.length; i++) {
      let name = company[i].name
      let id = company[i].id
      companyList.push(name)
      companyIndexList.push(id)
    }

    //查询地址簿
    let sendList = []
    let sendIndexList = []
    let receiptList = []
    let receiptIndexList = []
    let consignorList = []
    let consigneeList = []
    let addressBook = await ToolServer.findAddressBook('')

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
    let vehicleTypeIndexList = []
    let newVehicleTypeList = []
    for (let i = 0; i < vehicleTypeList.length; i++) {
      let id = vehicleTypeList[i].id
      let name = vehicleTypeList[i].name
      newVehicleTypeList.push(name)
      vehicleTypeIndexList.push(id)
    }

    this.setData({
      companyList: companyList,
      companyIndexList: companyIndexList,
      operationTeam: companyIndexList[0],
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
      vehicleTypeList: newVehicleTypeList,
      vehicleTypeIndexList: vehicleTypeIndexList,
      vehicleType: vehicleTypeIndexList[0]
    })
  },

  //选择寄件/收件地址
  bindAdds(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../addressList/searchAddress/index?id=${id}`
    })
  },

  //导航栏
  // async titleTab(e) {
  //   let index = e.currentTarget.dataset.index;
  //   //选择车辆
  //   let vehicleId = this.data.vehicleTypeList[index].id
  //   //根据寄件人坐标 收件人坐标 车辆类型 计算配送距离
  //   let sendCoordinates = this.data.consignorObject.coordinates
  //   let receipteCoordinates = this.data.consigneeObject.coordinates


  //   let send = {
  //     longitude: sendCoordinates[0],
  //     latitude: sendCoordinates[1]
  //   }
  //   let receipt = {
  //     longitude: receipteCoordinates[0],
  //     latitude: receipteCoordinates[1]
  //   }
  //   //查询运费
  //   let result = await ToolServer.waybillDistance(sendCoordinates, receipteCoordinates, vehicleId);
  //   let distance = result.distance
  //   let price = result.price
  //   let active = this.data.TopicTitleActive

  //   let animation = wx.createAnimation({
  //     duration: 300,
  //   });
  //   for (var i in this.data.type) {
  //     if (index == i && index != active) {
  //       animation.left(i * 50 + 22 + '%').step()
  //     }
  //   }

  // this.setData({
  //   'TopicTitleActive': index,
  //   'animation': animation.export(),
  //   vehicleType: vehicleId,
  //   haveFreight: false,
  //   freight: price,
  //   distance: distance
  // })

  //   //导航栏自动带出配送距离 参考运费

  // },

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

  //选择物流公司
  async changeCP(e) {
    let index = e.detail.value
    this.setData({
      companyList: this.data.companyList,
      companyIndex: e.detail.value
    })

    //根据物流公司id 选择对应车辆
    let companyId = this.data.companyIndexList[index]


    let vehicleTypeList = await ToolServer.vehicleType(companyId)
    let vehicleTypeIndexList = []
    let newVehicleTypeList = []
    for (let i = 0; i < vehicleTypeList.length; i++) {
      let id = vehicleTypeList[i].id
      let name = vehicleTypeList[i].name
      newVehicleTypeList.push(name)
      vehicleTypeIndexList.push(id)
    }

    this.setData({
      operationTeam: companyId,
      vehicleTypeList: newVehicleTypeList,
      vehicleTypeIndexList: vehicleTypeIndexList
    })
  },

  //选择车辆
  async changeVT(e) {
    let index = e.detail.value;
    let vehicleId = this.data.vehicleTypeIndexList[index]

    //根据寄件人坐标 收件人坐标 车辆类型 计算配送距离
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
    //查询运费
    let result = await ToolServer.waybillDistance(sendCoordinates, receipteCoordinates, vehicleId);
    let distance = result.distance
    let price = result.price
    let active = this.data.TopicTitleActive

    this.setData({
      vehicleType: vehicleId,
      haveFreight: false,
      freight: price,
      distance: distance
    })
  },


  //是否预约
  appointChange(e) {
    let value = e.detail.value
    if (value == false) {
      this.setData({
        state: '0',
        isNow: false,
        receiveAt: moment().format("YYYY-MM-DD HH:mm"),
        haveTime: true
      })
    } else {
      this.setData({
        state: '1',
        isNow: true,
        receiveAt: ''
      })
    }
  },

  //是否月结
  monthChange(e) {
    let value = e.detail.value
    if (value == false) {
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


  //选择寄件地址
  async changeSend(e) {
    let index = e.detail.value
    let consignor = this.data.consignorList[index].id
    let consignorObject = this.data.consignorList[index]


    let vehicleId = this.data.vehicleType
    let sendCoordinates = consignorObject.coordinates
    let receipteCoordinates = this.data.consigneeObject.coordinates
    let result = await ToolServer.waybillDistance(sendCoordinates, receipteCoordinates, vehicleId);
    let distance = result.distance
    let price = result.price
    let active = this.data.TopicTitleActive

    this.setData({
      sendList: this.data.sendList,
      sendIndex: index,
      consignor: consignor,
      sendAddress: true,
      consignorObject: consignorObject,
      //运费相关
      vehicleType: vehicleId,
      haveFreight: false,
      freight: price,
      distance: distance
    })
  },

  //选择收件地址
  async changeReceipt(e) {
    let index = e.detail.value
    let consignee = this.data.consigneeList[index].id
    let consigneeObject = this.data.consigneeList[index]

    let vehicleId = this.data.vehicleType
    let sendCoordinates = this.data.consignorObject.coordinates
    let receipteCoordinates = consigneeObject.coordinates
    let result = await ToolServer.waybillDistance(sendCoordinates, receipteCoordinates, vehicleId);
    let distance = result.distance
    let price = result.price
    let active = this.data.TopicTitleActive

    this.setData({
      receiptList: this.data.receiptList,
      receiptIndex: index,
      consignee: consignee,
      receiptAddress: true,
      consigneeObject: consigneeObject,
      //运费相关
      vehicleType: vehicleId,
      haveFreight: false,
      freight: price,
      distance: distance
    })
  },


  //立即下单
  async bindOrder() {

    let consignor = this.data.consignor
    let consignee = this.data.consignee
    let freightMonthly = this.data.freightMonthly
    let cargoMoney = this.data.cargoMoney
    if (cargoMoney == "") {
      cargoMoney = 0
    }
    let distance = this.data.distance
    let remark = this.data.remark
    let vehicleType = this.data.vehicleType
    let freight = this.data.freight
    let operationTeam = this.data.operationTeam
    let state = this.data.state
    let receiveAt = this.data.receiveAt
    //需要判断用户有没有选择寄件收件地址
    let sendAddress = this.data.sendAddress
    let receiptAddress = this.data.receiptAddress


    if (sendAddress == false) {
      wx.showToast({
        title: '请选择寄件地址',
        icon: 'none',
        duration: 1000
      });
      return
    }
    if (receiptAddress == false) {
      wx.showToast({
        title: '请选择收件地址',
        icon: 'none',
        duration: 1000
      });
      return
    }

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

    if (freightMonthly === '') {
      wx.showToast({
        title: '请选择是否月结',
        icon: 'none',
        duration: 1000
      });
      return
    }


    // if (cargoMoney == "") {
    //   wx.showToast({
    //     title: '代收货款不能为空',
    //     icon: 'none',
    //     duration: 1000
    //   });
    //   return
    // }

    wx.showModal({
      title: '提示',
      content: '是否确认下单',
      async success(res) {
        if (res.confirm) {
          let result = await ToolServer.merchantOrder(consignor, consignee, freightMonthly, cargoMoney, distance, remark, vehicleType, freight, operationTeam, state, receiveAt)
          console.log('result==========================下单完成====', result)
          let sn = result.sn
          let id = result.id
          wx.redirectTo({
            url: '../waitOrder/single/index?sn=' + sn + '&&id=' + id
          })
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

  //预约时间的选择
  // timeChange(e) {
  //   let index = e.detail.value
  //   if (index == 0) {
  //     this.setData({
  //       state: '0',
  //       isNow: false,
  //       receiveAt: moment().format("YYYY-MM-DD HH:mm")
  //     })
  //   } else {
  //     this.setData({
  //       state: '1',
  //       isNow: true,
  //       receiveAt: ''
  //     })
  //   }
  // },

  //运费是否月结
  // monthChange(e) {
  //   let index = e.detail.value
  //   if (index == 0) {
  //     this.setData({
  //       freightMonthly: true
  //     })
  //   } else {
  //     this.setData({
  //       freightMonthly: false,
  //     })
  //   }
  // },
})
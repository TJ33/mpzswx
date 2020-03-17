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
    freight: '',           //运费
    haveFreight: true,
    haveDistance: true,
    operationTeam: '',     //物流公司id
    state: '0',
    receiveAt: moment().format("YYYY-MM-DD HH:mm"),         //预约时间
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

    //备注相关
    remark: '',            //商家备注
    bz: [{
      value: '挂账',
      checked: false
    }, {
      value: '给货',
      checked: false
    }, {
      value: '换货',
      checked: false
    }, {
      value: '退货',
      checked: false
    }, {
      value: '顺带',
      checked: false
    }],

    //选择车辆相关   做卡片显示(车辆种类、载重、长宽高、载货体积)  name、load、size、capacity
    vehicleTypeIndexList: '',   //车辆下标集合  
    vehicleTypeList: [],       //车辆集合
    vehicleTypeIndex: 0,        //车辆类型下标
    vehicleType: '',             //车辆id
    TopicTitleActive: 0,
    vehicleTypeArray: [],
    load: '',
    size: '',
    capacity: '',
    photo: ''

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

    let user = wx.getStorageSync('USER')
    if (user != '') {
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

      //车辆
      let vehicleTypeIndexList = []
      let newVehicleTypeList = []
      let newVehicleTypeArray = []
      let vehicleTypeList = await ToolServer.vehicleType(companyIndexList[0])


      for (let i = 0; i < vehicleTypeList.length; i++) {
        let id = vehicleTypeList[i].id
        let name = vehicleTypeList[i].name
        let photo = vehicleTypeList[i].phone
        let load = vehicleTypeList[i].load
        let size = vehicleTypeList[i].size
        let capacity = vehicleTypeList[i].capacity
        let object = new Object()
        object.name = name
        object.photo = photo
        object.load = load
        object.size = size
        object.capacity = capacity
        vehicleTypeIndexList.push(id)
        newVehicleTypeList.push(object)
        newVehicleTypeArray.push(name)
      }

      let vehicle = newVehicleTypeList[0]
      let load = vehicle.load
      let size = vehicle.size
      let capacity = vehicle.capacity
      let photo = vehicle.photo
      this.setData({
        load: load,
        size: size,
        capacity: capacity,
        photo: photo,
        TopicTitleActive: 0,
      })

      //选择地址之后跳转的数据
      let sendAddress = wx.getStorageSync('sendAddress')
      let reciveAddress = wx.getStorageSync('reciveAddress')
      this.setData({
        sendAddress: sendAddress,
        reciveAddress: reciveAddress,
      })

      if (sendAddress != '') {
        //寄件人信息
        let consignor = new Object()
        consignor.contactName = sendAddress.contactName
        consignor.contactPhone = sendAddress.contactPhone
        consignor.address = sendAddress.address
        consignor.coordinates = sendAddress.coordinates
        consignor._id = sendAddress._id
        //根据寄件人坐标 收件人坐标 车辆类型 计算配送距离
        let sendCoordinates = consignor.coordinates
        this.setData({
          companyList: companyList,
          companyIndexList: companyIndexList,
          operationTeam: companyIndexList[0],
          vehicleTypeList: newVehicleTypeList,
          vehicleTypeArray: newVehicleTypeArray,
          vehicleType: vehicleTypeIndexList[0],
          vehicleTypeIndexList: vehicleTypeIndexList,
          //新的
          sendAddress: sendAddress,
          consignor: consignor._id,
          consignorObject: consignor
        })
      } else {
        this.setData({
          companyList: companyList,
          companyIndexList: companyIndexList,
          operationTeam: companyIndexList[0],
          vehicleTypeList: newVehicleTypeList,
          vehicleTypeArray: newVehicleTypeArray,
          vehicleType: vehicleTypeIndexList[0],
          vehicleTypeIndexList: vehicleTypeIndexList
        })
      }

      if (sendAddress != '' && reciveAddress != '') {
        //下单所需要的数据
        //寄件人信息
        let consignor = new Object()
        consignor.contactName = sendAddress.contactName
        consignor.contactPhone = sendAddress.contactPhone
        consignor.address = sendAddress.address
        consignor.coordinates = sendAddress.coordinates
        consignor._id = sendAddress._id

        //收件人信息
        let consignee = new Object()
        consignee.contactName = reciveAddress.contactName
        consignee.contactPhone = reciveAddress.contactPhone
        consignee.address = reciveAddress.address
        consignee.coordinates = reciveAddress.coordinates
        consignee._id = reciveAddress._id
        //根据寄件人坐标 收件人坐标 车辆类型 计算配送距离
        let sendCoordinates = consignor.coordinates
        let receipteCoordinates = consignee.coordinates
        //查询运费
        let result = await ToolServer.waybillDistance(sendCoordinates, receipteCoordinates, vehicleTypeIndexList[0]);
        let distance = result.distance
        let price = result.price
        let active = this.data.TopicTitleActive


        this.setData({
          companyList: companyList,
          companyIndexList: companyIndexList,
          operationTeam: companyIndexList[0],
          vehicleTypeList: newVehicleTypeList,
          vehicleTypeArray: newVehicleTypeArray,
          vehicleType: vehicleTypeIndexList[0],
          vehicleTypeIndexList: vehicleTypeIndexList,
          //新的
          sendAddress: sendAddress,
          reciveAddress: reciveAddress,
          consignor: consignor._id,
          consignee: consignee._id,
          freight: price,
          distance: distance,
          haveFreight: false,
          haveDistance: false,
          consigneeObject: consignee,
          consignorObject: consignor
        })
      } else {
        this.setData({
          companyList: companyList,
          companyIndexList: companyIndexList,
          operationTeam: companyIndexList[0],
          vehicleTypeList: newVehicleTypeList,
          vehicleTypeArray: newVehicleTypeArray,
          vehicleType: vehicleTypeIndexList[0],
          vehicleTypeIndexList: vehicleTypeIndexList
        })
      }
    }

  },

  //选择车辆
  async titleTab(e) {
    let index = e.currentTarget.dataset.index;
    let vehicle = this.data.vehicleTypeList[index]
    let load = vehicle.load
    let size = vehicle.size
    let capacity = vehicle.capacity
    let photo = vehicle.photo
    let vehicleId = this.data.vehicleTypeIndexList[index]


    //根据寄件人坐标 收件人坐标 车辆类型 计算配送距离 运费
    let sendCoordinates = this.data.consignorObject.coordinates
    let receipteCoordinates = this.data.consigneeObject.coordinates

    if (sendCoordinates == '') {
      wx.showToast({
        title: '请选择寄件地址',
        icon: 'none',
        duration: 1000
      });
      return
    }
    if (receipteCoordinates == '') {
      wx.showToast({
        title: '请选择收件地址',
        icon: 'none',
        duration: 1000
      });
      return
    }

    //查询运费
    let result = await ToolServer.waybillDistance(sendCoordinates, receipteCoordinates, vehicleId);
    let distance = result.distance
    let price = result.price
    let active = this.data.TopicTitleActive

    this.setData({
      load: load != undefined ? load : '',
      size: size != undefined ? size : '',
      capacity: capacity != undefined ? capacity : '',
      photo: photo != undefined ? photo : '',
      TopicTitleActive: index,
      vehicleType: vehicleId,
      haveFreight: false,
      haveDistance: false,
      freight: price,
      distance: distance,
      vehicleTypeIndex: index
    })

  },

  //选择寄件/收件地址
  bindAdds(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../addressList/searchAddress/index?id=${id}`
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

    if (sendCoordinates == '') {
      wx.showToast({
        title: '请选择寄件地址',
        icon: 'none',
        duration: 1000
      });
      return
    }
    if (receipteCoordinates == '') {
      wx.showToast({
        title: '请选择收件地址',
        icon: 'none',
        duration: 1000
      });
      return
    }

    //查询运费
    let result = await ToolServer.waybillDistance(sendCoordinates, receipteCoordinates, vehicleId);
    let distance = result.distance
    let price = result.price
    let active = this.data.TopicTitleActive

    this.setData({
      vehicleType: vehicleId,
      haveFreight: false,
      haveDistance: false,
      freight: price,
      distance: distance,
      vehicleTypeIndex: index
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
    if (value == true) {
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
      haveDistance: false,
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
      haveDistance: false,
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
    let reciveAddress = this.data.reciveAddress

    if (sendAddress == false) {
      wx.showToast({
        title: '请选择寄件地址',
        icon: 'none',
        duration: 1000
      });
      return
    }
    if (reciveAddress == false) {
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

    wx.showModal({
      title: '提示',
      content: '是否确认下单',
      async success(res) {
        if (res.confirm) {
          let result = await ToolServer.merchantOrder(consignor, consignee, freightMonthly, cargoMoney, distance, remark, vehicleType, freight, operationTeam, state, receiveAt)
          let sn = result.sn
          let id = result.id
          wx.redirectTo({
            url: '../waitOrder/single/index?sn=' + sn + '&&id=' + id
          })
          // wx.removeStorageSync('sendAddress')
          wx.removeStorageSync('reciveAddress')
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
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      receiveAt: receiveAt,
      haveTime: false
    });
  },

  //点击备注选项
  bindBlurBz(e) {
    this.setData({ remark: e.detail.value })
  },

  //备注
  bindBz(e) {
    let index = e.currentTarget.dataset.index
    let remark
    for (var i in this.data.bz) {
      if (!this.data.bz[index].checked) {
        remark = this.data.remark + ' ' + this.data.bz[index].value
        this.data.bz[index].checked = !this.data.bz[index].checked
      } else {
        remark = this.data.remark.split(this.data.bz[index].value).join("");
        this.data.bz[index].checked = !this.data.bz[index].checked
      }
    }


    this.setData({
      remark: remark,
      bz: this.data.bz
    })
  }
})


  //data相关
    // sendIndexList: [],     //寄件地址下标集合
    // sendList: [],          //寄件地址集合
    // sendIndex: 0,          //寄件地址下标
    // receiptIndexList: [],  //收件地址下标集合
    // receiptList: [],       //收件地址集合
    // receiptIndex: 0,       //收件地址下标
    // consignorList: [],      //寄件人对象集合
    // consigneeList: [],      //收件人对象集合
    // sendAddress: false,
    // reciveAddress: false,
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

      //owshow
       //查询地址簿
      // let sendList = []
      // let sendIndexList = []
      // let receiptList = []
      // let receiptIndexList = []
      // let consignorList = []
      // let consigneeList = []
      // let addressBook = await ToolServer.findAddressBook('')

      // for (let i = 0; i < addressBook.length; i++) {
      //   let addressName = addressBook[i].address
      //   let addressId = addressBook[i]._id
      //   sendList.push(addressName)
      //   sendIndexList.push(addressId)
      //   receiptList.push(addressName)
      //   receiptIndexList.push(addressId)

      //   //寄件人/收件人 对象集合
      //   let name = addressBook[i].contactName
      //   let phone = addressBook[i].contactPhone
      //   let coordinates = addressBook[i].coordinates

      //   let consignorObject = new Object()
      //   consignorObject.address = addressName
      //   consignorObject.name = name
      //   consignorObject.phone = phone
      //   consignorObject.coordinates = coordinates
      //   consignorObject.id = addressId
      //   let consigneeObject = new Object()
      //   consigneeObject.address = addressName
      //   consigneeObject.name = name
      //   consigneeObject.phone = phone
      //   consigneeObject.coordinates = coordinates
      //   consigneeObject.id = addressId
      //   consignorList.push(consignorObject)
      //   consigneeList.push(consigneeObject)
      // }


    // this.setData({
    //   companyList: companyList,
    //   companyIndexList: companyIndexList,
    //   operationTeam: companyIndexList[0],
    //   sendList: sendList,
    //   sendIndexList: sendIndexList,
    //   receiptList: receiptList,
    //   receiptIndexList: receiptIndexList,
    //   consignorList: consignorList,
    //   consigneeList: consigneeList,
    //   consignorObject: consignorList[0],
    //   consigneeObject: consigneeList[0],
    //   consignor: consignorList[0].id,
    //   consignee: consigneeList[0].id,
    //   vehicleTypeList: newVehicleTypeList,
    //   vehicleTypeIndexList: vehicleTypeIndexList,
    //   vehicleType: vehicleTypeIndexList[0],
    //   sendAddress: sendAddress,
    //   reciveAddress: reciveAddress
    // })

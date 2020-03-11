// pages/waitOrder/single/index.js
import io from 'weapp.socket.io';
var ToolServer = require('../../utils/ToolServer');
let init


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',    //运单id
    sn: '',   //运单编号
    //地图组件
    //下单 纬度
    latitude: 0.0,
    //下单 经度
    longitude: 0.0,
    //配送员 维度
    deliverLatitude: 0.0,
    //配送员 经度
    deliverLongitude: 0.0,

    //小程序倒计时
    minute: 0,
    second: 0,
    timecount: '0:0',
    cost: 0,
    flag: 1,
    endtime: "",
    //在地图上显示圆
    circles: [{
      latitude: 0.0,
      longitude: 0.0,
      // color: '#F5FFFA',
      fillColor: '#FFEBCD',
      radius: 500,
      strokeWidth: 2
    }],

    //模态弹框
    // showModal: false,
    // items: [
    //   { name: 'wait', value: '继续等待', checked: 'true' },
    //   { name: 'reset', value: '重新下单' }
    // ],
    chance: 'wait',


    //wait页面需要用到的东西
    haveSingle: true,
    //需要交互的信息
    idcardPositivePic: '',     //身份证正面
    licensePlate: '',          //车牌号码
    vehiclePic: '',            //车辆照片
    name: '',                  //司机姓名
    successRate: 0,           //接单成功率   
    totalWaybillCount: 0,     //总运单数
    vehicleTypeName: '',       //车辆类型名字  
    vehicleTypeSize: '',       //长宽高
    //标记点标记位置
    markers: [{
      iconPath: "/images/order/start.png",
      id: 0,
      latitude: 0.0,
      longitude: 0.0,
      width: 50,
      height: 50,

      //气泡label (可与callout 2选1)  markers上面固定悬浮的气泡
      label: {
        // content: '距离发货地还有7.1公里&#10预计17分钟到达',  //文本
        color: '#000000',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#ffffff',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      },
      //markers上面固定悬浮的气泡  同label
      callout: {
        // content: '距离发货地还有7.1公里&#10预计17分钟到达',  //文本
        color: '#000000',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#ffffff',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      }
    }, {
      iconPath: "/images/order/car.png",
      id: 0,
      latitude: 23.09057,
      longitude: 113.15179,
      width: 50,
      height: 50,

      //气泡label (可与callout 2选1)
      label: {
        //content: '距离发货地还有7.1公里&#10预计17分钟到达',  //文本
        color: '#000000',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#ffffff',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      },

      callout: {
        //content: '距离发货地还有7.1公里&#10预计17分钟到达',  //文本
        color: '#000000',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#ffffff',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      }
    }],
    //缩放视野以包含所有给定的坐标点
    // includePoints: [{
    //   latitude: 23.02067,
    //   longitude: 113.75179
    // },
    // {
    //   latitude: 23.09057,
    //   longitude: 113.15179
    // }],
    //指定一系列坐标点，从数组第一项连线至最后一项  显示路线
    // polyline: [{
    //   points: [{
    //     longitude: 113.75179,
    //     latitude: 23.02067
    //   }, {
    //     longitude: 113.15179,
    //     latitude: 23.09057
    //   }],
    //   color: "#ff6600",
    //   width: 10,
    //   dottedLine: false,
    //   arrowLine: true,
    //   borderColor: "#000",
    //   borderWidth: 5
    // }],
    //底部消息栏
    allMessage: [{ icon: '/images/order/detail.png', message: '查看订单' }, { icon: '/images/order/append.png', message: '再次下单' }]
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: async function () {

    let that = this
    await wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function (res) {
        that.data.latitude = res.latitude
        that.data.longitude = res.longitude
        let markers = [{
          // iconPath: "/images/me.png",
          id: 0,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          width: 50,
          height: 50,

          //气泡label (可与callout 2选1)
          label: {
            content: '已为您通知到1名司机',  //文本
            color: '#000000',  //文本颜色
            borderRadius: 3,  //边框圆角
            borderWidth: 1,  //边框宽度
            borderColor: '#ffffff',  //边框颜色
            bgColor: '#ffffff',  //背景色
            padding: 5,  //文本边缘留白
            textAlign: 'center'  //文本对齐方式。有效值: left, right, center
          }
        }]

        let circles = [{
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          fillColor: '#FFEBCD',
          radius: 500,
          strokeWidth: 2
        }]


        that.setData({
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          markers: markers,
          circles: circles
        })
      },
      //定位失败回调      
      fail: function () {
        wx.hideLoading();
      },
      complete: function () {
        //隐藏定位中信息进度       
        wx.hideLoading()
      }
    })

    let user = wx.getStorageSync('USER')
    let id = user.id
    let socket = io('http://zs.51qp.top/mpzs', {
      transports: ['websocket']
    });
    //家
    // var socket = io('http://192.168.1.4:8011/mpzs', {
    //   transports: ['websocket']
    // });
    //公司
    // var socket = io('http://192.168.7.119:8011/mpzs', {
    //   transports: ['websocket']
    // });

    //连接监听
    socket.on('connect', () => {
      //向服务器发送注册信息
      socket.emit('ZS:MERCHANTLOGIN',
        { id: id, latitude: this.data.latitude, longitude: this.data.longitude }
      );
    })

    //接受服务器注册信息
    socket.on("ZS:RECEIVED", async (data) => {
      let deliveryman = data.deliveryman
      if (deliveryman != null) {

        //请求司机经纬度
        let locationResult = await ToolServer.findDriverLocation(that.data.sn)
        let location = locationResult.location
        let deliverLongitude = location[0]
        let deliverLatitude = location[1]
        this.setData({
          haveSingle: false,
          deliverLongitude: deliverLongitude,
          deliverLatitude: deliverLatitude
        })

        let name = deliveryman.name                             //司机姓名
        let licensePlate = deliveryman.licensePlate             //车牌号码   
        let stat = deliveryman.stat                             //统计数据  totalPushWaybillCount总推送运单数 totalWaybillCount总运单数 totalIncome总收入 totalMileage总运输里程 successRate接单成功率 avgRespTime平均运单响应时间
        let vehicleType = deliveryman.vehicleType               //车辆类型
        let photos = deliveryman.photos                         //相关证件照片 idcardPositivePic身份证正面 idcardPOppositePic身份证反面 vehiclePic车辆照片 vehicleLicense1Pic主页 vehicleLicense2Pic副页

        let id = deliveryman.id                                 //deliveryman id
        let birthdate = deliveryman.birthdate                   //出生日期
        let config = deliveryman.config                         //配置 accept是否开启接单 crossCity是否接跨域的单                         
        let nature = deliveryman.nature                         //员工性质   INTERNAL:内部员工   EXTERNAL:外聘员工 
        let operationTeam = deliveryman.operationTeam           //所属运营团队
        let ownVehicle = deliveryman.ownVehicle                 //是否自带车辆
        let phone = deliveryman.phone                           //手机号
        let registerStatus = deliveryman.registerStatus         //注册状态     [WAITCONFIRM：待审核  INREVIEW:审核中  PASS：审核通过  FILL_AGAIN: 回退重填]
        let sex = deliveryman.sex                               // 性别   MALE:男性  FEMALE:女性
        let status = deliveryman.status                         //状态     [NORMAL:正常  DISABLED：禁用]    
        let updatedAt = deliveryman.updatedAt
        let createdAt = deliveryman.createdAt

        // idcardPositivePic: '',     //身份证正面
        // licensePlate: '',          //车牌号码
        // vehiclePic: '',            //车辆照片
        // name: '',                  //司机姓名
        // successRate: 0,           //接单成功率   
        // totalWaybillCount: 0,     //总运单数
        // vehicleTypeName: '',       //车辆类型名字  
        // vehicleTypeSize: '',       //长宽高




        //需要用到的数据
        //idcardPositivePic 身份证正面
        let idcardPositivePic = photos.idcardPositivePic
        //licensePlate 车牌号码
        //vehiclePic 车辆照片
        let vehiclePic = photos.vehiclePic
        //name  司机姓名
        //successRate 接单成功率
        let successRate = stat.successRate
        //totalWaybillCount 总运单数
        let totalWaybillCount = stat.totalWaybillCount
        //vehicleType 车辆类型 需要显示名字  长宽高也需要(这两个没有)
        let vehicleTypeName = vehicleType.name
        let vehicleTypeSize = vehicleType.size

        this.setData({
          //配送员信息
          idcardPositivePic: idcardPositivePic,
          licensePlate: licensePlate,
          vehiclePic: vehiclePic,
          name: name,
          successRate: successRate,
          totalWaybillCount: totalWaybillCount,
          vehicleTypeName: vehicleTypeName,
          vehicleTypeSize: vehicleTypeSize
        })
        // wx.redirectTo({
        //   url: '../wait/index'
        // })
      }

      let markers = [{
        iconPath: "/images/order/start.png",
        id: 0,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        width: 50,
        height: 50,

        //气泡label (可与callout 2选1)
        label: {
          // content: '距离发货地还有7.1公里&#10预计17分钟到达',  //文本
          color: '#000000',  //文本颜色
          borderRadius: 3,  //边框圆角
          borderWidth: 1,  //边框宽度
          borderColor: '#ffffff',  //边框颜色
          bgColor: '#ffffff',  //背景色
          padding: 5,  //文本边缘留白
          textAlign: 'center'  //文本对齐方式。有效值: left, right, center
        }
      },
      {
        iconPath: "/images/order/car.png",
        id: 0,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        width: 50,
        height: 50,

        //气泡label (可与callout 2选1)
        label: {
          //content: '距离发货地还有7.1公里&#10预计17分钟到达',  //文本
          color: '#000000',  //文本颜色
          borderRadius: 3,  //边框圆角
          borderWidth: 1,  //边框宽度
          borderColor: '#ffffff',  //边框颜色
          bgColor: '#ffffff',  //背景色
          padding: 5,  //文本边缘留白
          textAlign: 'center'  //文本对齐方式。有效值: left, right, center
        }
      }]

      //路线显示
      let polyline = [{
        points: [{
          longitude: that.data.latitude,
          latitude: that.data.longitude
        }, {
          longitude: that.data.deliverLongitude,
          latitude: that.data.deliverLatitude
        }],
        color: "#ff6600",
        width: 10,
        dottedLine: false,
        arrowLine: true,
        borderColor: "#000",
        borderWidth: 5
      }]

      this.setData({
        markers: markers,
        polyline: polyline,
      })

    });

    //更改定位
    socket.on("ZS:MERCHANTPOSITIONING", (data) => {
    });

    socket.connect();

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sn = options.sn
    let id = options.id
    clearInterval(init);
    let that = this;
    that.setData({
      minute: 0,
      second: 0,
      sn: sn,
      id: id
    })
    init = setInterval(function () {
      that.timer()
    }, 1000)

  },

  chooseUrl(e) {
    let value = e.currentTarget.id
    switch (value) {
      //查看运单  
      case "0":
        wx.switchTab({
          url: '../../waybill/index'
        })
        clearInterval(init);
        break;
      //再次下单  
      case "1":
        wx.switchTab({
          url: '../../order/index'
        })
        clearInterval(init);
        break;
      default:
        break;
    }
  },


  //视野变化事件 拖动地图触发
  regionchange(e) {
    console.log("regionchange e===", e)
  },
  //点击 marker 标记点时触发
  markertap(e) {
    console.log("markertap e===", e)
  },
  //点击控件时触发
  controltap(e) {
    console.log("controltap e===", e)
  },

  //模态框
  /**
   * 隐藏模态对话框
   */
  // hideModal: function () {
  //   this.setData({
  //     showModal: false
  //   });
  // },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function (e) {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function (e) {
    let that = this
    that.hideModal();
    let value = that.data.chance
    if (value == "wait") {
      init = setInterval(function () {
        that.setData({
          second: that.data.second + 1
        })

        if (that.data.second >= 60) {
          that.setData({
            second: 0,
            minute: that.data.minute + 1
          })
        }
        that.setData({
          timecount: that.data.minute + ":" + that.data.second
        })
      }, 1000)
    } else {
      wx.redirectTo({
        url: '../../order/index'
      })
      clearInterval(init);
    }

  },
  //单选框
  radioChange: function (e) {
    let value = e.detail.value
    this.setData({
      chance: value
    })
  },

  timer: function () {
    let that = this;
    that.setData({
      second: that.data.second + 1
    })

    if (that.data.second >= 60) {
      that.setData({
        second: 0,
        minute: that.data.minute + 1
      })
    }
    that.setData({
      timecount: that.data.minute + ":" + that.data.second
    })

    if (that.data.minute == 2 && that.data.name == '') {
      clearInterval(init);
      wx.showModal({
        title: '提示',
        content: '操作选择',
        showCancel: true,//是否显示取消按钮
        cancelText: "重新下单",//默认是“取消”
        cancelColor: 'black',//取消文字的颜色
        confirmText: "继续等待",//默认是“确定”
        confirmColor: 'skyblue',//确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
            wx.redirectTo({
              url: '../../order/index'
            })
            clearInterval(init);
          } else {
            init = setInterval(function () {
              that.setData({
                second: that.data.second + 1
              })

              if (that.data.second >= 60) {
                that.setData({
                  second: 0,
                  minute: that.data.minute + 1
                })
              }
              that.setData({
                timecount: that.data.minute + ":" + that.data.second
              })
            }, 1000)
          }
        }
      })


      // this.setData({
      //   showModal: true
      // })
    }
  },

  //取消订单的功能
  cancelOrder(e) {
    let that = this
    let sn = that.data.sn
    wx.showModal({
      title: '提示',
      content: '是否确认取消',
      async success(res) {
        if (res.confirm) {
          let result = await ToolServer.cancelOrder(sn)
          let success = result.success
          if (success == true) {
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/order/index'
              })
              clearInterval(init);
            }, 1000);
          } else {
            wx.showToast({
              title: '取消失败',
              icon: 'none',
              duration: 1000
            })
          }

        }
      }
    })

  }

})
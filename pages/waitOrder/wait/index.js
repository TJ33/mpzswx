// pages/waitOrder/wait/index.js
import io from 'weapp.socket.io'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //需要交互的信息
    idcardPositivePic: '',     //身份证正面
    licensePlate: '',          //车牌号码
    vehiclePic: '',            //车辆照片
    name: '',                  //司机姓名
    successRate: 0,           //接单成功率   
    totalWaybillCount: 0,     //总运单数
    vehicleTypeName: '',       //车辆类型名字  
    vehicleTypeSize: '',       //长宽高


    //纬度
    latitude: 0.0,
    //经度
    longitude: 0.0,
    //标记点标记位置
    markers: [{
      iconPath: "/images/order/start.png",
      id: 0,
      latitude: 23.02067,
      longitude: 113.75179,
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
        content: '距离发货地还有7.1公里&#10预计17分钟到达',  //文本
        color: '#000000',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#ffffff',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      },

      callout: {
        content: '距离发货地还有7.1公里&#10预计17分钟到达',  //文本
        color: '#000000',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#ffffff',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      }
    }
    ],
    //缩放视野以包含所有给定的坐标点
    includePoints: [{
      latitude: 23.02067,
      longitude: 113.75179
    },
    {
      latitude: 23.09057,
      longitude: 113.15179
    }
    ],
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color: "#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
    // controls: [{
    //   id: 1,
    //   iconPath: '/images/bg.jpg',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }],
    //指定一系列坐标点，从数组第一项连线至最后一项  显示路线
    polyline: [{
      points: [{
        longitude: 113.75179,
        latitude: 23.02067
      }, {
        longitude: 113.15179,
        latitude: 23.09057
      }],
      color: "#ff6600",
      width: 10,
      dottedLine: false,
      arrowLine: true,
      borderColor: "#000",
      borderWidth: 5
    }],
    //底部消息栏
    allMessage: [{ icon: '/images/order/police.png', message: '一键报警' }, { icon: '/images/order/share.png', message: '行程分享' }, { icon: '/images/order/message.png', message: '发送消息' }, { icon: '/images/order/more.png', message: '更多操作' }]
  },

  //拖动地图触发
  regionchange(e) {
    console.log("regionchange e===", e)
    console.log("e.type===", e.type)
  },
  //标记点时触发
  markertap(e) {
    console.log("markertap e===", e)
    console.log("e.markerId===", e.markerId)
  },
  //点击控件时触发
  controltap(e) {
    console.log("controltap e===", e)
    console.log("e.controlId===", e.controlId)
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
    let user = wx.getStorageSync('USER')
    let id = user.id
    console.log("user=======================", user)
    console.log("id=======================", id)
    var socket = io('http://zs.51qp.top/mpzs', {
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
      console.log("成功")

      //向服务器发送注册信息
      socket.emit('ZS:MERCHANTLOGIN',
        { id: id, latitude: this.data.latitude, longitude: this.data.longitude }
      );
    })

    //接受服务器注册信息
    socket.on("ZS:RECEIVED", (data) => {
      console.log('接收数据data==========================', data);
      let deliveryman = data.deliveryman
      console.log('接收数据deliveryman==========================', deliveryman);
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
      let vehicleTypeName = '小型面包'
      let vehicleTypeSize = '1.7*1.1*1m'
      this.setData({
        idcardPositivePic: idcardPositivePic,
        licensePlate: licensePlate,
        vehiclePic: vehiclePic,
        name: name,
        successRate: successRate,
        totalWaybillCount: totalWaybillCount,
        vehicleTypeName: vehicleTypeName,
        vehicleTypeSize: vehicleTypeSize
      })



    });

    //更改定位
    socket.on("ZS:MERCHANTPOSITIONING", (data) => {
      console.log('更改定位', data);
    });

    socket.connect();


    let that = this
    await wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function (res) {
        console.log("res===============", res)
        that.data.latitude = res.latitude
        that.data.longitude = res.longitude
        // that.moveToLocation()
        console.log("that.data.latitude=================", that.data.latitude)
        console.log("that.data.longitude=================", that.data.longitude)
        //标记点标记位置
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
            content: '距离发货地还有7.1公里&#10预计17分钟到达',  //文本
            color: '#000000',  //文本颜色
            borderRadius: 3,  //边框圆角
            borderWidth: 1,  //边框宽度
            borderColor: '#ffffff',  //边框颜色
            bgColor: '#ffffff',  //背景色
            padding: 5,  //文本边缘留白
            textAlign: 'center'  //文本对齐方式。有效值: left, right, center
          }
        }

        ]
        //路线显示
        let polyline = [{
          points: [{
            longitude: 113.75179,
            latitude: 23.10229
          }, {
            longitude: 113.15179,
            latitude: 23.09057
          }],
          color: "#ff6600",
          width: 10,
          dottedLine: false,
          arrowLine: true,
          borderColor: "#000",
          borderWidth: 5
        }]

        // let markers = [{
        //   iconPath: "/images/me.png",
        //   id: 0,
        //   latitude: that.data.latitude,
        //   longitude: that.data.longitude,
        //   width: 50,
        //   height: 50
        // }]
        // let polyline = [{
        //   points: [{
        //     latitude: that.data.latitude,
        //     longitude: that.data.longitude
        //   }, {
        //     latitude: that.data.latitude,
        //     longitude: that.data.longitude
        //   }],
        //   color: "#FF0000DD",
        //   width: 2,
        //   dottedLine: true
        // }]

        that.setData({
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          // markers: markers,
          // polyline: polyline
        })

        // console.log("that.data.markers================", that.data.markers)
        console.log("that.data.polyline================", that.data.polyline)
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
  },

  //移动选点
  moveToLocation: function (type) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        let chooseAddress = res.address
        let chooseErrMsg = res.errMsg
        let chooseLatitude = res.latitude
        let chooseLongitude = res.longitude
        let chooseName = res.name
        //选择地点之后返回的结果
        that.setData({
          address: chooseName
        })
      }
    })
  },

  //下面消息的四个方法
  chooseUrl(e) {
    let id = e.currentTarget.id
    switch (id) {
      //一键报警
      case "0":
        console.log('一键报警=======')
        break;
      //行程分享  
      case "1":
        console.log('行程分享=======')
        break;
      //发送消息  
      case "2":
        console.log('发送消息=======')
        break;
      //更多操作  
      case "3":
        console.log('更多操作=======')
        break;
      default:
        break;
    }


    console.log("id=====================================", id)
  }

})
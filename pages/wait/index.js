// pages/wait/index.js
import io from 'weapp.socket.io'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0.0,
    longitude: 0.0,
    markers: [{
      // iconPath: "/images/me.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50,

      //气泡label (可与callout 2选1)
      label: {
        content: '已为您通知0名司机',  //文本
        color: '#000000',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#ffffff',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      },

      callout: {
        content: '已为您通知0名司机',  //文本
        color: '#000000',  //文本颜色
        borderRadius: 3,  //边框圆角
        borderWidth: 1,  //边框宽度
        borderColor: '#ffffff',  //边框颜色
        bgColor: '#ffffff',  //背景色
        padding: 5,  //文本边缘留白
        textAlign: 'center'  //文本对齐方式。有效值: left, right, center
      }

    }],
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

    polyline: [{
      points: [{
        longitude: 23.10229,
        latitude: 113.3245211
      }, {
        longitude: 113.701855,
        latitude: 34.779778
      }],
      color: "#ff6600",
      width: 2,
      dottedLine: false,
      arrowLine: true,
      borderColor: "#000",
      borderWidth: 5
    }],
    allMessage: [{ icon: '/images/order/police.png', message: '一键报警' }, { icon: '/images/order/share.png', message: '行程分享' }, { icon: '/images/order/message.png', message: '发送消息' }, { icon: '/images/order/more.png', message: '更多操作' }]
  },


  regionchange(e) {
    console.log("regionchange e===", e)
    console.log("e.type===", e.type)
  },
  markertap(e) {
    console.log("markertap e===", e)
    console.log("e.markerId===", e.markerId)
  },
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
    var socket = io('http://192.168.1.4:8011/mpzs', {
      transports: ['websocket']
    });

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
      console.log('接收数据', data);
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

        let markers = [{
          // iconPath: "/images/me.png",
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
        }]
        let polyline = [{
          points: [{
            longitude: 23.10229,
            latitude: 113.3245211
          }, {
            longitude: 113.701855,
            latitude: 34.779778
          }],
          color: "#ff6600",
          width: 2,
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
          markers: markers,
          polyline: polyline
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
  }

})
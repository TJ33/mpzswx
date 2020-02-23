// pages/single/index.js
import io from 'weapp.socket.io'
let init

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //小程序倒计时
    minute: 0,
    second: 0,
    timecount: '0:0',
    cost: 0,
    flag: 1,
    endtime: "",
    //地图组件
    //纬度
    latitude: 0.0,
    //经度
    longitude: 0.0,
    //标记位置
    // markers: [{
    //   iconPath: "/images/me.png",
    //   id: 0,
    //   latitude: 23.099994,
    //   longitude: 113.324520,
    //   width: 50,
    //   height: 50
    // }],
    //显示控件，控件不随着地图移动  图标  用cover-view替代
    // controls: [{
    //   id: 1,
    //   // iconPath: '/images/bg.jpg',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }],
    //在地图上显示路线
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    //在地图上显示圆
    circles: [{
      latitude: '23.02067',
      longitude: '113.75179',
      // color: '#F5FFFA',
      fillColor: '#FFEBCD',
      radius: 500,
      strokeWidth: 2
    }],
  },

  //视野变化事件 拖动地图触发
  regionchange(e) {
    console.log("regionchange e===", e)
    console.log("e.type===", e.type)
  },
  //点击 marker 标记点时触发
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
    clearInterval(init);
    let that = this;
    that.setData({
      minute: 0,
      second: 0,
    })
    init = setInterval(function () {
      that.timer()
    }, 1000)

    console.log("that.data.minute111==============", that.data.minute)
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

    console.log("that.data.minute222==============", that.data.minute)
    if (that.data.minute == 2) {
      clearInterval(init);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    let user = wx.getStorageSync('USER')
    let id = user.id
    console.log("user=======================", user)
    console.log("id=======================", id)
    let socket = io('http://192.168.1.4:8011/mpzs', {
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
            content: '已为您通知到0名司机',  //文本
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
            latitude: that.data.latitude,
            longitude: that.data.longitude
          }, {
            latitude: that.data.latitude,
            longitude: that.data.longitude
          }],
          color: "#FF0000DD",
          width: 2,
          dottedLine: true
        }]

        that.setData({
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          markers: markers,
          polyline: polyline
        })
        console.log("that.data.circles================", that.data.circles)
        console.log("that.data.markers================", that.data.markers)
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
    let that = this;
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
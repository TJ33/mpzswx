// pages/wait/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0.0,
    longitude: 0.0,
    markers: [{
      iconPath: "/images/me.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
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
    controls: [{
      id: 1,
      iconPath: '/images/bg.jpg',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    allMessage: ['一键报警', '行程分享', '发送消息', '更多操作']
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
          iconPath: "/images/me.png",
          id: 0,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          width: 50,
          height: 50
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

  // start() {
  //   console.log("开始长连接")
  //   wx.connectSocket({
  //     url: 'ws://localhost:8012',
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     protocols: ['protocol1'],
  //     tcpNoDelay: false,
  //     perMessageDeflate: false,
  //     timeout: 10000,
  //     success: function (e) {
  //       console.log("请求成功===================", e)
  //     },
  //     fail: function (e) {
  //       console.log("请求失败===================", e)
  //     },
  //     complete: function (e) {
  //       console.log("请求完成===================", e)
  //     }
  //   })

  //   // websocket打开
  //   wx.onSocketOpen(res => {
  //     console.log('监听到 WebSocket 连接已打开！')
  //   })

  //   // 收到websocket消息
  //   wx.onSocketMessage(res => {
  //     this.getSocketMsg(JSON.parse(res.data))  // 收到的消息为字符串，需处理一下
  //     console.log("收到websocket消息=================", this.getSocketMsg(JSON.parse(res.data)))
  //   })


  //   // 监听webSocket错误
  //   wx.onSocketError(res => {
  //     console.log('监听到 WebSocket 打开错误，请检查！')
  //     // 修改连接状态
  //     this.connectStatus = 0
  //   })

  //   // 监听WebSocket关闭
  //   wx.onSocketClose(res => {
  //     console.log('监听到 WebSocket 已关闭！')
  //     this.connectStatus = 0
  //   })

  //   //监听Websocket发送的数据
  //   wx.sendSocketMessage({
  //     data: "12345",
  //     success: function (e) {
  //       console.log("发送成功===================", e)
  //     },
  //     fail: function (e) {
  //       console.log("发送失败===================", e)
  //     },
  //     complete: function (e) {
  //       console.log("发送完成===================", e)
  //     }
  //   })
  // },

  //   close() {
  //   console.log("关闭长连接")
  //     wx.onSocketOpen(function () {
  //     wx.closeSocket({
  //       code: 1000,
  //       reason: '连接被关闭',
  //       success: function (e) {
  //         console.log("关闭成功===================", e)
  //       },
  //       fail: function (e) {
  //         console.log("关闭失败===================", e)
  //       },
  //       complete: function (e) {
  //         console.log("关闭完成===================", e)
  //       }
  //     })
  //   })
  // }
})
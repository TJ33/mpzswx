// pages/waitOrder/cancel/index.js
import io from 'weapp.socket.io'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //需要交互的数据
    time: '',     //用车时间
    sendAddress: '',      //始发地
    receiptAddress: '',   //目的地

    latitude: 0.0,
    longitude: 0.0,
    //标记位置
    markers: [{
      iconPath: "/images/order/start.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],

    //底部消息栏
    allMessage: [{ icon: '/images/order/headset.png', message: '联系客服' }, { icon: '/images/order/order.png', message: '再来一单' }, { icon: '/images/order/the_order.png', message: '运单信息' }]
  },

  //拖动地图触发
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
    var socket = io('http://zs.51qp.top', {
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
    socket.on("ZS:RECEIVED", (data) => {
    });

    //更改定位
    socket.on("ZS:MERCHANTPOSITIONING", (data) => {
    });

    socket.connect();


    let that = this
    await wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function (res) {
        that.data.latitude = res.latitude
        that.data.longitude = res.longitude
        // that.moveToLocation()
        //标记位置
        let markers = [{
          iconPath: "/images/order/start.png",
          id: 0,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          width: 50,
          height: 50
        }]

        that.setData({
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          markers: markers,
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

  //选择下面三个消息
  chooseUrl(e) {
    let id = e.currentTarget.id
    switch (id) {
      //联系客服
      case "0":
        console.log('联系客服=======')
        break;
      //再来一单  
      case "1":
        console.log('再来一单=======')
        break;
      //运单信息  
      case "2":
        console.log('运单信息=======')
        break;
      default:
        break;
    }
  }

})
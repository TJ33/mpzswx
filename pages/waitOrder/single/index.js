// pages/waitOrder/single/index.js
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
    //在地图上显示圆
    circles: [{
      latitude: '23.02067',
      longitude: '113.75179',
      // color: '#F5FFFA',
      fillColor: '#FFEBCD',
      radius: 500,
      strokeWidth: 2
    }],

    //模态弹框
    showModal: false,
    items: [
      { name: 'wait', value: '继续等待', checked: 'true' },
      { name: 'reset', value: '重新下单' }
    ],
    chance: 'wait'
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

        that.setData({
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          markers: markers
        })
        console.log("that.data.circles================", that.data.circles)
        console.log("that.data.markers================", that.data.markers)
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
    console.log("user=======================", user)
    console.log("id=======================", id)
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
      console.log("成功")

      //向服务器发送注册信息
      socket.emit('ZS:MERCHANTLOGIN',
        { id: id, latitude: this.data.latitude, longitude: this.data.longitude }
      );
    })

    //接受服务器注册信息
    socket.on("ZS:RECEIVED", (data) => {
      console.log('接收数据data===========================', data);
      let deliveryman = data.deliveryman
      if (data.deliveryman != null) {
        wx.redirectTo({
          url: '../wait/index'
        })
      }
    });

    //更改定位
    socket.on("ZS:MERCHANTPOSITIONING", (data) => {
      console.log('更改定位', data);
    });

    socket.connect();

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
      this.setData({
        showModal: true
      })
    }
  },

  //模态框
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function (e) {
    this.hideModal();
    console.log("取消e===========================", e)
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function (e) {
    let that = this
    that.hideModal();
    console.log("确定e===========================", e)
    let value = that.data.chance
    console.log("value===========================", value)
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
        url: '../order/index'
      })
    }

  },
  //单选框
  radioChange: function (e) {
    let value = e.detail.value
    this.setData({
      chance: value
    })
  }

})
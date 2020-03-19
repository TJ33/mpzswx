//index.js
const QQMapWX = require('../utils/qqmap-wx-jssdk.js')

Page({
  data: {
    send: "",
    received: "",
    flag: false,
    //按钮判断
    buttonClick: true
  },
  onLoad: function () {
    // 将当前页面的 this 赋值给 vm, 以区别于下面回调函数中的 this 
    const that = this
    wx.getSetting({
      success(res) {
        // 1. scope.userLocation 为真， 代表用户已经授权
        if (res.authSetting['scope.userLocation']) {
          // 1.1 使用 getlocation 获取用户 经纬度位置
          wx.getLocation({
            type: 'gcj02',
            altitude: true,
            //定位成功，更新定位结果      
            success: function (res) {
              var latitude = res.latitude
              var longitude = res.longitude
              that.getAddress(latitude, longitude)
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
        } else {
          // 2. 用户未授权的情况下， 打开授权界面， 引导用户授权.
          wx.openSetting({
            success(res) {
              // 2.1 如果二次授权允许了 userLocation 权限， 就再次执行获取位置的接口
              if (res.authSetting["scope.userLocation"]) {
                wx.getLocation({
                  type: 'gcj02',
                  altitude: true,
                  //定位成功，更新定位结果      
                  success: function (res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    that.getAddress(latitude, longitude)
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
              }
            }
          })
        }
      }
    })
  },

  onShow: function () {

  },

  //选择寄件人
  chooseSend(e) {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.moveToLocation("send")
      }, //定位失败回调      
      fail: function () {
        wx.hideLoading();
      },
      complete: function () {
        //隐藏定位中信息进度       
        wx.hideLoading()
      }
    })
  },

  //选择收件人
  chooseReceived(e) {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.moveToLocation("received")
      }, //定位失败回调      
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
        if (type == "send") {
          that.setData({
            send: chooseName
          })
        } else {
          that.setData({
            received: chooseName
          })
        }

        if (that.data.send != "" && that.data.received != "") {
          that.setData({
            flag: true
          })
        } else {
          that.setData({
            flag: false
          })
        }
      }
    })
  },

  //让经纬度变成具体的位置信息
  getAddress(latitude, longitude) {
    let that = this
    // 生成 QQMapWX 实例
    let qqmapsdk = new QQMapWX({
      key: 'V3WBZ-I5TW6-2NASU-MOSRJ-MMOIF-AFFGG'
    })
    // reverseGeocoder 为 QQMapWX 解析 经纬度的方法
    qqmapsdk.reverseGeocoder({
      location: { latitude, longitude },
      success(res) {
        let recommend = res.result.formatted_addresses.recommend
        that.setData({
          send: recommend
        })
      }
    })
  },

  //点击确认按钮
  sure() {
    if (this.data.buttonClick == true) {
      wx.showModal({
        title: '提示',
        content: '是否确认选择',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/order/index'
            })
          }
        }
      })
      this.setData({
        buttonClick: false
      })
    }

  }

  // onLoad: function () {
  //   let that = this
  //   wx.getLocation({
  //     type: 'gcj02',
  //     altitude: true,
  //     //定位成功，更新定位结果      
  //     success: function (res) {
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       that.getAddress(latitude, longitude)
  //       console.log("res111=====================", res)
  //     },
  //     //定位失败回调      
  //     // fail: function () {
  //     //   wx.hideLoading();
  //     //   console.log("getLocationFail")
  //     // },
  //     // complete: function () {
  //     //   //隐藏定位中信息进度       
  //     //   wx.hideLoading()
  //     // }
  //   })
  // },

})

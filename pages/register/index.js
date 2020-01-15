// pages/register/index.js
var ToolServer = require('../utils/ToolServer');
var LoginServer = require('../utils/LoginServer');
const { domain } = require('../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '注册',
    storeName: '',
    longitude: '',
    latitude: '',
    userName: '',
    userPhone: '',
    storeAddress: '',
    number: '',
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let phone = wx.getStorageSync('MYPHONE')
    this.setData({
      phone: phone,
    })
  },

  //输入店铺名称
  inputStoreName(e) {
    let name = e.detail.value
    this.setData({
      storeName: name
    })
  },

  //选择店铺地址
  inputStoreAddress() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.moveToLocation()
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

  //输入门牌号
  inputNumber(e) {
    let name = e.detail.value
    this.setData({
      number: name
    })
  },

  //输入用户名
  inputUser(e) {
    let name = e.detail.value
    this.setData({
      userName: name
    })
  },

  //输入联系电话
  inputPhone(e) {
    let name = e.detail.value
    this.setData({
      userPhone: name
    })
  },

  //移动选点
  moveToLocation: function () {
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
          storeAddress: chooseName,
          longitude: chooseLongitude,
          latitude: chooseLatitude
        })
      }
    })
  },

  //点击获取手机号码
  getPhoneNumber(e) {
    let that = this
    //执行wx.login
    wx.login({
      async success(res) {
        that.setData({
          code: res.code
        })
        if (e.detail.errMsg == 'getPhoneNumber:ok') {
          await wx.request({
            url: `${domain}/api/wxapp/analys_phone`,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              code: res.code
            },
            async success(res) {
              if (res.statusCode == 200) {
                let ret = res.data.data.phoneNumber
                if (ret == undefined) {
                  wx.showToast({
                    title: '请求异常',
                    icon: 'none',
                    duration: 1000
                  })
                } else {
                  that.setData({
                    userPhone: ret
                  })
                }
              }
              else if (res.statusCode = 500) {
                wx.showToast({
                  title: '请求错误',
                  icon: 'none',
                  duration: 1000
                })
              }
              else {
                wx.showToast({
                  title: '网络连接异常',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }
      }
    })
  },

  //点击注册按钮
  register() {
    let storeName = this.data.storeName
    let longitude = this.data.longitude
    let latitude = this.data.latitude
    let userName = this.data.userName
    let userPhone = this.data.userPhone
    let storeAddress = this.data.storeAddress
    let number = this.data.number
    let code = this.data.code

    if (storeName == "") {
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (storeAddress == "") {
      wx.showToast({
        title: '请选择店铺地址',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (number == "") {
      wx.showToast({
        title: '请输入门牌号',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (userName == "") {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (userPhone == "") {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (!(/^1[3456789]\d{9}$/.test(userPhone))) {
      wx.showToast({
        title: '号码有误，请重填',
        icon: 'none',
        duration: 1000
      })
      return
    }

    storeAddress = storeAddress + number

    wx.showModal({
      title: '提示',
      content: '是否确认注册',
      async success(res) {
        if (res.confirm) {
          if (code != '') {
            let result = await ToolServer.merchantEntry(storeName, longitude, latitude, userName, userPhone, code, storeAddress)
            let errorcode = result.errorcode
            let message = result.message
            let success = result.success
            if (errorcode == 0) {
              wx.showToast({
                title: '注册成功',
                icon: 'success',
                duration: 1000
              })
              wx.switchTab({
                url: '../me/index'
              })
            } else {
              wx.showToast({
                title: '注册失败',
                icon: 'none',
                duration: 1000
              })
            }
          } else {
            wx.showToast({
              title: '网络请求错误',
              icon: 'none',
              duration: 1000
            })
          }
        }
      }
    })
  }
})
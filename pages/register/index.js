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

    choose: [{ value: '商家', key: '1', checked: true }, { value: '个人', key: '2', checked: false }],
    judgeStoreName: false,
    judgeStoreAddress: false,
    judgeUserName: false,
    judgeUserPhone: false,
    judge: true,

    //按钮判断
    buttonClick: true
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
    if (name == '') {
      this.setData({
        judgeStoreName: true
      })
    } else {
      this.setData({
        judgeStoreName: false
      })
    }
  },

  //选择店铺地址
  inputStoreAddress() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      //定位成功，更新定位结果      
      success: function (res) {
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
    if (name == '') {
      this.setData({
        judgeUserName: true
      })
    } else {
      this.setData({
        judgeUserName: false
      })
    }
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
        if (that.data.storeAddress != '') {
          that.setData({
            judgeStoreAddress: false
          })
        }
      },
      fail: function (e) {
        let message = e.errMsg
        if (that.data.storeAddress == '' && message == 'chooseLocation:fail cancel') {
          that.setData({
            judgeStoreAddress: true
          })
        } else {
          that.setData({
            judgeStoreAddress: false
          })
        }
      }
    })


  },

  //点击获取手机号码
  getPhoneNumber(e) {
    let phone = wx.getStorageSync('PHONE')
    this.setData({
      userPhone: phone
    })
    if (phone == '') {
      this.setData({
        judgeUserPhone: true
      })
    } else {
      this.setData({
        judgeUserPhone: false
      })
    }
  },

  // 选择角色,获取用户选择的单选框的值
  radioChange: function (e) {
    let value = e.detail.value
    if (value == '商家') {
      this.setData({
        judge: true,
        storeName: '',
        longitude: '',
        latitude: '',
        userName: '',
        userPhone: '',
        storeAddress: '',
        number: '',
        judgeStoreName: false,
        judgeStoreAddress: false,
        judgeUserName: false,
        judgeUserPhone: false,
      })
    } else {
      this.setData({
        judge: false,
        storeName: '',
        longitude: '',
        latitude: '',
        userName: '',
        userPhone: '',
        storeAddress: '',
        number: '',
        judgeStoreName: false,
        judgeStoreAddress: false,
        judgeUserName: false,
        judgeUserPhone: false,
      })
    }
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

    let user = wx.getStorageSync('USER')
    let code = wx.getStorageSync('CODE')

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

    // if (number == "") {
    //   wx.showToast({
    //     title: '请输入门牌号',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return
    // }

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
        title: '请获取联系电话',
        icon: 'none',
        duration: 1000
      })
      return
    }

    storeAddress = storeAddress + number
    if (this.data.buttonClick == true) {
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
                setTimeout(function () {
                  wx.switchTab({
                    url: '../me/index'
                  })
                }, 1000);
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
      this.setData({
        buttonClick: false
      })
    }

  }
})
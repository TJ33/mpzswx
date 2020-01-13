// pages/register/index.js
var ToolServer = require('../utils/ToolServer');
var LoginServer = require('../utils/LoginServer');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '注册',
    storeName: '',
    storeAddress: '',
    number: '',
    userName: '',
    userPhone: '',
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
    console.log("进入移动选点")
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
          storeAddress: chooseName
        })
      }
    })
  },

  //点击注册按钮
  register() {
    let storeName = this.data.storeName
    let storeAddress = this.data.storeAddress
    let number = this.data.number
    let userName = this.data.userName
    let userPhone = this.data.userPhone

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

    wx.showModal({
      title: '提示',
      content: '是否确认注册',
      async success(res) {
        if (res.confirm) {
          // let result = await ToolServer.userRegistration(oCode, name, phone)
          // if (result.message == "手机号码已存在") {
          //   wx.showToast({
          //     title: '手机号码已存在',
          //     icon: 'none',
          //     duration: 1000
          //   })
        } else {
          // wx.showToast({
          //   title: '注册成功',
          //   icon: 'success',
          //   duration: 1000
          // })
          // wx.switchTab({ url: '../../tap/me/index' })
        }
      }
    })

  }

})
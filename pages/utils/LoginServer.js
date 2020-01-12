//登陆方法
import regeneratorRuntime from "regenerator-runtime";
const { domain } = require('../config.js')

class LoginServer {
  //获取本机号码
  async myPhone(iv, encryptedData) {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
      })
      wx.login({
        success(res) {
          console.log('res', res)
          wx.request({
            url: `${domain}/api/mobile/merchant/get_user_info`,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              iv: iv,
              encryptedData: encryptedData,
              code: res.code
            },
            success(res) {
              resolve(res.data.data.phoneNumber)
            }
          })
        }
      })
      setTimeout(function () {
        wx.hideLoading()
      })
    })
  }
  //本机登录
  async myPhoneLogin(phone) {
    wx.setStorageSync('MYPHONE', phone)
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: `${domain}/api/mobile/merchant/login`,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          phone: phone,
        },
        success(res) {
          if (res.data.errortype == 0) {
            resolve(res.data)
            wx.setStorageSync('AUTHORIZATION', res.data.data)
            wx.setStorageSync('LOGINSTART', 'LOGINSTART1')

            wx.switchTab({
              url: '../../waybill/index'
            })
          } else {

            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 4000
            })

          }

        }
      })
      setTimeout(function () {
        wx.hideLoading()
      })
    })
  }

  //获取手机验证码
  async phoneCode(phone) {
    wx.setStorageSync('MYPHONE', phone)
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: `${domain}/api/mobile/merchant/phone_code`,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          phone: phone,
        },
        success(res) {
          resolve(res.data)
          switch (true) {
            case res.data.errortype == 0:
              wx.navigateTo({
                url: '../verification/index?phone=' + phone
              })
              break;
            case res.data.errortype == 1:
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              break;
            case res.data.errortype == 2:
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              break;
            case res.data.errortype == 3:
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              break;
          }
        }
      })
      setTimeout(function () {
        wx.hideLoading()
      })
    })
  }
  //校验手机验证码
  async checkCode(phone, code) {
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: `${domain}/api/mobile/merchant/check_code`,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          phone: phone,
          code: code
        },
        success(res) {
          resolve(res.data)
          switch (true) {
            case res.data.errortype == 0:
              wx.setStorageSync('AUTHORIZATION', res.data.data)
              wx.setStorageSync('LOGINSTART', 'LOGINSTART1')
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
              })
              wx.switchTab({
                url: '../../waybill/index'
              })
              break;
            case res.data.errortype == 1:
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              break;
            case res.data.errortype == 2:
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              break;
            case res.data.errortype == 3:
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              break;
            case res.data.errortype == 4:
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              break;
          }
        }
      })
      setTimeout(function () {
        wx.hideLoading()
      })
    })
  }
}
module.exports = new LoginServer
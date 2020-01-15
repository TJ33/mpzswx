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
          wx.request({
            url: `${domain}/api/wxapp/analys_phone`,
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
              if (res.data == "Internal Server Error") {
                resolve(res.data)
              } else {
                resolve(res.data.phone)
              }
            },
            fail(res) {
              resolve(res.data)
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
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: `${domain}/api/wxapp/login`,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          code: phone,
        },
        success(res) {
          if (res.data.data != null) {
            resolve(res.data)
            let AUTHORIZATION = 'Bearer ' + res.data.token
            wx.setStorageSync('AUTHORIZATION', AUTHORIZATION)
            wx.setStorageSync('USER', res.data.data)
          } else {
            resolve(res.data)
            wx.showToast({
              title: '用户需要注册',
              icon: 'none',
              duration: 1000
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
        url: `${domain}/api/mobile/main/phone_code`,
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
        url: `${domain}/api/mobile/main/check_code`,
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
              let AUTHORIZATION = 'Bearer ' + res.data.token
              wx.setStorageSync('AUTHORIZATION', AUTHORIZATION)
              wx.setStorageSync('LOGINSTART', 'LOGINSTART1')
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
              })
              wx.switchTab({
                url: '../../tap/index/index'
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
// pages/me/index.js
import regeneratorRuntime from "regenerator-runtime";
var LoginServer = require('../utils/LoginServer');
const { domain } = require('../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    popupShow: false,
    showHeightAnimation: '',
    Myhead: '',
    user: {},
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad() {
    let Animation = (dur, del) => {
      let animation = wx.createAnimation({
        duration: dur,
        delay: del
      });
      return animation
    }
    let show = Animation(0, 0).height('100vh').step();
    this.setData({
      showHeightAnimation: show.export(),
    })
    let Myhead = wx.getStorageSync('Myhead')
    let User = wx.getStorageSync('USER')
    let judgeLogin = wx.getStorageSync('judgeLogin')
    if (judgeLogin) {
      this.setData({
        user: User,
        Myhead: Myhead,
      })
    } else {
      this.setData({
        user: '',
        Myhead: '',
      })
    }

    let that = this
    wx.login({
      success: function (res) {
        that.setData({
          code: res.code
        })
      }
    })

  },
  onShow: function () {

  },
  onGotUserInfo(e) {
    let Myhead = e.detail.userInfo.avatarUrl
    wx.setStorageSync('Myhead', Myhead)
    this.setData({
      Myhead: Myhead,
      popupShow: false,
    })
  },
  //点击用户授权
  async getPhoneNumber(e) {
    let that = this
    //执行wx.login
    wx.login({
      async success(res) {
        wx.setStorageSync("CODE", that.data.code)
        if (e.detail.errMsg == 'getPhoneNumber:ok') {
          await wx.request({
            url: `${domain}/api/wxapp/analys_phone`,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              appid: "wxfea63eb860bd639e",
              secret: "70372a7d632e6e03a9ff5608d15c715f",
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              code: that.data.code
            },
            async success(res) {
              if (res.statusCode == 200) {
                let ret = res.data.data.phoneNumber
                wx.setStorageSync("PHONE", ret)
                if (ret == undefined) {
                  wx.showToast({
                    title: '请求异常',
                    icon: 'none',
                    duration: 1000
                  })
                } else {
                  let user = await LoginServer.myPhoneLogin(ret)
                  let errorcode = user.errorcode
                  if (errorcode == 0) {
                    wx.setStorageSync('judgeLogin', true)
                    that.setData({
                      user: user.data,
                      popupShow: true,
                    })
                    wx.setStorageSync("USER", user.data)
                  } else if (errorcode == 1) {
                    wx.showToast({
                      title: '用户审核中',
                      icon: 'none',
                      duration: 1000
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '请问是否注册',
                      success(res) {
                        if (res.confirm) {
                          //用户不存在 跳转注册页面
                          wx.navigateTo({ url: '../register/index' })
                        }
                      }
                    })

                  }
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
  //退出登录
  bindOut(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否退出登陆',
      success(res) {
        if (res.confirm) {
          wx.clearStorage()
          wx.clearStorageSync()
          wx.showLoading({
            title: '正在退出',
          })

          setTimeout(function () {
            wx.showToast({
              title: '退出成功',
              icon: 'success',
              duration: 1000
            })
            wx.hideLoading()
            that.onLoad()
          }, 2000)

        } else if (res.cancel) {
        }
      }
    })



  }
})
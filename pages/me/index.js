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
    set: [
      {
        icon: 'iconfont icon-xiaoxi1',
        centent: '店铺地址',
        url: '../addressBook/index',
      }
    ],
    user: {
      name: ''
    }
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
    this.setData({
      user: User,
      Myhead: Myhead,
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
  getPhoneNumber(e) {
    console.log("用户授权================================", e)
    let that = this
    //执行wx.login
    wx.login({
      async success(res) {
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
                  let user = await LoginServer.myPhoneLogin(ret)
                  let errorcode = user.errorcode
                  if (errorcode == 0) {
                    that.setData({
                      user: user.data,
                      popupShow: true
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
  }
})
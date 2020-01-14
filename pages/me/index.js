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
    popupShow: true,
    isCancelShow: true,
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

  async onLoad(options) {

  },
  onShow: function () {
    // let myshop = wx.getStorageSync('MYSHOP')
    // let Myhead = wx.getStorageSync('Myhead')
    // let Animation = (dur, del) => {
    //   let animation = wx.createAnimation({
    //     duration: dur,
    //     delay: del
    //   });
    //   return animation
    // }
    // if (Myhead != '') {
    //   this.data.popupShow = false
    //   let hiden = Animation(0, 500).height('0').step();
    //   this.setData({
    //     showHeightAnimation: hiden.export()
    //   })
    // } else {
    //   this.data.popupShow = true
    //   let show = Animation(0, 0).height('100vh').step();
    //   this.setData({
    //     showHeightAnimation: show.export()
    //   })
    // }
    // this.setData({
    //   'myshop': myshop,
    //   'Myhead': Myhead,
    //   'popupShow': this.data.popupShow,
    // })
  },
  onGotUserInfo(e) {
    console.log(e.detail.userInfo.avatarUrl)
    let Myhead = e.detail.userInfo.avatarUrl
    wx.setStorageSync('Myhead', Myhead)
    this.setData({
      'Myhead': Myhead,
      'popupShow': false,
    })
  },
  //点击用户授权
  getPhoneNumber(e) {
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
              appid: "wxccd5f8fd7806fd16",
              secret: "939e0dacbc5d3eb28cb89027637a09be",
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              code: res.code
            },
            async success(res) {
              if (res.statusCode == 200) {
                let ret = res.data.phone
                if (ret == undefined) {
                  wx.showToast({
                    title: '请求异常',
                    icon: 'none',
                    duration: 1000
                  })
                } else {
                  let user = await LoginServer.myPhoneLogin(ret)
                  if (user.success == false) {
                    wx.showModal({
                      title: '提示',
                      content: '请问是否注册',
                      success(res) {
                        if (res.confirm) {
                          wx.setStorageSync('MYPHONE', ret)
                          //用户不存在 跳转注册页面
                          wx.navigateTo({ url: '../register/index' })
                        }
                      }
                    })
                  }
                  else {
                    if (user.data != null) {
                      that.setData({
                        popupShow: true,
                        user: {
                          name: user.name
                        }
                      })
                    }
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
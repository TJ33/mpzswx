// pages/me/index.js
import regeneratorRuntime from "regenerator-runtime";
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
    myshop: '',
    set: [
      {
        icon: 'iconfont icon-xiaoxi1',
        centent: '店铺地址',
        url: '../addressBook/index',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  async onLoad(options) {
    let myshop = wx.getStorageSync('MYSHOP')
    console.log('myshop', myshop);
    this.setData({
      'myshop': myshop
    })
  },
  onShow: function () {
    let myshop = wx.getStorageSync('MYSHOP')
    let Myhead = wx.getStorageSync('Myhead')
    let Animation = (dur, del) => {
      let animation = wx.createAnimation({
        duration: dur,
        delay: del
      });
      return animation
    }
    if (Myhead != '') {
      this.data.popupShow = false
      let hiden = Animation(0, 500).height('0').step();
      this.setData({
        showHeightAnimation: hiden.export()
      })
    } else {
      this.data.popupShow = true
      let show = Animation(0, 0).height('100vh').step();
      this.setData({
        showHeightAnimation: show.export()
      })
    }
    this.setData({
      'myshop': myshop,
      'Myhead': Myhead,
      'popupShow': this.data.popupShow,
    })
  },
  bindUser() {
    wx.navigateTo({
      url: '../me_other/users/index'
    })
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
})
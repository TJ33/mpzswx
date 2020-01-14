import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../utils/ToolServer');
Page({

  data: {
    id: '',
    name: '',    //收件人
    phone: '',   //电话号码
    address: '',    //详情地址
    door: '', //门牌号
    set: true, //是否保存到地址薄
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

  },
  onShow() {

  },
  //收件人
  bindName(e) {
    this.setData({ 'name': e.detail.value })
  },
  //电话号码
  bindPhone(e) {
    this.setData({ 'phone': e.detail.value })
  },
  //门牌号
  bindDoor(e) {
    this.setData({ 'door': e.detail.value })
  },
  //选择地址
  bindDw() {
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
  bindSwitch(e) {
    this.setData({ 'set': e.detail.value })
  },
  //保存信息
  async bindAdds(e) {
    if (!(/^1[3456789]\d{9}$/.test(this.data.phone))) {
      wx.showToast({
        title: '手机号码有误，请重填',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let data = {
      'id': this.data.id,
      'name': this.data.name,
      'phone': this.data.phone,
      'street': this.data.address,
      'houseNumber': this.data.door,
    }

    let ds = {
      _id: '',
      nickname: '',
      contact: {
        name: this.data.name,
        phone: this.data.phone
      },
      address: this.data.address + this.data.door,
    }

    if (this.data.set) {
      // await ToolServer.createAndUpdate(data)
    }
    console.log('e', e.detail.value)
  },

})
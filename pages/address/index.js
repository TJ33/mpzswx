import regeneratorRuntime from "regenerator-runtime";
var ToolServer = require('../utils/ToolServer');
Page({

  data: {
    storeName: '',   //店铺名称
    name: '',    //联系人
    phone: '',   //联系电话
    address: '',    //店铺地址
    coordinates: '', //地图坐标
    id: '',          //非必须
    door: '', //门牌号
    longitude: '',  //经度
    latitude: '', //维度
    //set: true, //是否保存到地址薄
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log('options================', options)
  },
  onShow() {

  },
  //店铺名称
  bindStoreName(e) {
    this.setData({ 'storeName': e.detail.value })
  },

  //联系姓名
  bindName(e) {
    this.setData({ 'name': e.detail.value })
  },
  //联系电话
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
        that.data.latitude = res.latitude
        that.data.longitude = res.longitude
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
        that.setData({
          address: chooseName
        })
      }
    })
  },
  // bindSwitch(e) {
  //   this.setData({ 'set': e.detail.value })
  // },
  //保存信息
  async bindAdds(e) {
    console.log('e', e.detail.value)
    let storeName = this.data.storeName
    let name = this.data.name
    let phone = this.data.phone
    let address = this.data.address
    let coordinates = '(' + this.data.longitude + ',' + this.data.latitude + ')'
    let door = this.data.door
    let id = this.data.id

    console.log('storeName======================', storeName)
    console.log('name======================', name)
    console.log('phone======================', phone)
    console.log('address======================', address)
    console.log('coordinates======================', coordinates)
    console.log('door======================', door)
    console.log('id======================', id)

    if (storeName == "") {
      wx.showToast({
        title: '请输入店铺名称',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (name == "") {
      wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (phone == "") {
      wx.showToast({
        title: '请输入联系人电话',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (address == "") {
      wx.showToast({
        title: '请选择店铺地址',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (door == "") {
      wx.showToast({
        title: '请输入门牌号',
        icon: 'none',
        duration: 1000
      })
      return
    }

    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号码有误，请重填',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    wx.showModal({
      title: '提示',
      content: '是否确认添加',
      async success(res) {
        if (res.confirm) {
          let result = await ToolServer.addAddressBook(storeName, name, phone, address, coordinates, door, id)
          console.log('result=====', result)
          let success = result.success
          if (success) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            })
            wx.redirectTo({
              url: '../addressBook/index'
            })
          } else {
            wx.showToast({
              title: '添加失败',
              icon: 'none',
              duration: 1000
            })
          }
        }
      }
    })
  },
})
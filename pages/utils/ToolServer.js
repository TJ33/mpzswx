import regeneratorRuntime from "regenerator-runtime";
const { domain } = require('../config.js')
var LoginServer = require('./LoginServer')

class ToolServer {

  //手机登陆接口
  //解析手机号

  //商家注册
  async merchantEntry(name, longitude, latitude, userName, userPhone, address, code) {
    let url = `${domain}/api/wxapp/merchant_entry`
    let data = {
      name: name,
      longitude: longitude,
      latitude: latitude,
      userName: userName,
      userPhone: userPhone,
      address: address,
      code: code,
    }
    return this.post(url)
  }

  //查询运单
  async findWayBill(status, transportStatus) {
    let url = `${domain}/api/wxapp/find_waybill`
    let data = {
      status: status,
      transportStatus: transportStatus
    }
    return this.post(url)
  }

  //查询地址簿
  async findAddressBook() {
    let url = `${domain}/api/wxapp/find_address_book`
    return this.get(url)
  }

  //添加地址
  async addAddressBook(anotherNamer, contactName, contactPhone, address, coordinates) {
    let url = `${domain}/api/wxapp/add_address_book`
    let data = {
      anotherNamer: anotherNamer,
      contactName: contactName,
      contactPhone: contactPhone,
      address: address,
      coordinates: coordinates,
    }
    return this.post(url)
  }

  //商家下单
  async merchantOrder(consignor, consignee, freightMonthly, cargoMoney, distance, useCoupon, remark, vehicleType, freight) {
    let url = `${domain}/api/wxapp/merchant_order`
    let data = {
      consignor: consignor,
      consignee: consignee,
      freightMonthly: freightMonthly,
      cargoMoney: cargoMoney,
      distance: distance,
      useCoupon: useCoupon,
      remark: remark,
      vehicleType: vehicleType,
      freight: freight,
    }
    return this.post(url)
  }


  //配送距离
  async waybillDistance(consignor, consignee, vehicleType) {
    let url = `${domain}/api/wxapp/waybill_distance`
    let data = {
      consignor: consignor,
      consignee: consignee,
      vehicleType: vehicleType
    }
    return this.post(url)
  }

  //优惠卷查询
  async findCoupon(status, startAt, endAt) {
    let url = `${domain}/api/wxapp/find_coupon`
    let data = {
      status: status,
      startAt: startAt,
      endAt: endAt
    }
    return this.post(url)
  }


  //查询车辆类型
  async vehicleType() {
    let url = `${domain}/api/wxapp/vehicle_type`
    return this.get(url)
  }



  async untyingUser(childId) {
    let url = `${domain}/api/wxapp/untying_user`
    let data = {
      user: childId
    }
    return this.post2(url, data)
  }

  //








  async post(url, data) {
    let that = this
    let phones = wx.getStorageSync('MYPHONE')
    let Authorization = wx.getStorageSync('AUTHORIZATION')
    let promise = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        header: {
          'Authorization': Authorization,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: data,
        success: async function (res) {
          if (res.data == 'Internal Server Error') {
            wx.showToast({
              title: '服务器连接异常',
              icon: 'none',
              duration: 2000
            })
          } else if (res.data.errorcode == 0) {
            resolve(res.data.data)
          } else if (res.data.errorcode == 1002) {
            resolve(res.data.message)
            // await LoginServer.myPhoneLogin(phones)
            // await that.post(url, data)
          }
        }
      })
    })
    return promise;
  }
  async post2(url, data) {
    let that = this
    let phones = wx.getStorageSync('MYPHONE')
    let Authorization = wx.getStorageSync('AUTHORIZATION')
    let promise = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        header: {
          'Authorization': Authorization,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: data,
        success: async function (res) {
          if (res.data == 'Internal Server Error') {
            wx.showToast({
              title: '服务器连接异常',
              icon: 'none',
              duration: 2000
            })
          } else if (res.data.errorcode == 0) {
            resolve(res.data)
          } else if (res.data.errorcode == 1002) {
            resolve(res.data)
            // await LoginServer.myPhoneLogin(phones)
            // await that.post(url, data)
          }
        }
      })

    })
    return promise;
  }
  async get(url, data) {
    let that = this
    let phones = wx.getStorageSync('MYPHONE')
    let Authorization = wx.getStorageSync('AUTHORIZATION')
    let promise = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        header: {
          'Authorization': Authorization
        },
        method: 'GET',
        data: data,
        success: async function (res) {
          if (res.data == 'Internal Server Error') {
            wx.showToast({
              title: '服务器连接异常',
              icon: 'none',
              duration: 2000
            })
          } else if (res.data.errorcode == 0) {
            resolve(res.data.data)
          } else if (res.data.errorcode == 1002) {
            resolve(res.data.data)
            // await LoginServer.myPhoneLogin(phones)
            // await that.get(url, data)
          }
        }
      })

    })
    return promise;
  }

  async get2(url, data) {
    let that = this
    let phones = wx.getStorageSync('MYPHONE')
    let Authorization = wx.getStorageSync('AUTHORIZATION')
    let promise = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        header: {
          'Authorization': Authorization
        },
        method: 'GET',
        data: data,
        success: async function (res) {
          if (res.data == 'Internal Server Error') {
            wx.showToast({
              title: '服务器连接异常',
              icon: 'none',
              duration: 2000
            })
          } else if (res.data.errorcode == 0) {
            resolve(res.data)
          } else if (res.data.errorcode == 1002) {
            resolve(res.data)
            // await LoginServer.myPhoneLogin(phones)
            // await that.get(url, data)
          }
        }
      })

    })
    return promise;
  }
}
module.exports = new ToolServer
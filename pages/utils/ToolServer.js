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
  async findWayBill(sn, transportStatus) {
    let url = `${domain}/api/wxapp/find_waybill`
    let data = {
      sn: sn,
      transportStatus: transportStatus
    }
    return this.post(url)
  }

  //查询地址簿列表
  async findAddressBook() {
    let url = `${domain}/api/wxapp/find_address_book`
    return this.get(url)
  }

  //添加/编辑 地址簿
  async addAddressBook(anotherNamer, contactName, contactPhone, address, coordinates, doorplate, id) {
    let url = `${domain}/api/wxapp/add_address_book`
    let data = {
      anotherNamer: anotherNamer,
      contactName: contactName,
      contactPhone: contactPhone,
      address: address,
      coordinates: coordinates,
      doorplate: doorplate,
      id: id
    }
    return this.post(url)
  }

  //删除地址簿
  async delAddressBook(id) {
    let url = `${domain}/api/wxapp/del_address_book`
    let data = {
      id: id
    }
    return this.post(url)
  }

  //查询用户关联的物流公司
  async queryLogisticsCompany() {
    let url = `${domain}/api/wxapp/query_logistics_company`
    return this.get(url)
  }

  //查询车辆类型
  async vehicleType(operationTeam) {
    let url = `${domain}/api/wxapp/vehicle_type`
    let data = {
      operationTeam: operationTeam
    }
    return this.get(url, data)
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



  //商家下单
  async merchantOrder(consignor, consignee, freightMonthly, cargoMoney, distance, remark, vehicleType, freight, operationTeam, state, appointment) {
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
      operationTeam: operationTeam,
      state: state,
      appointment: appointment
    }
    return this.post(url)
  }








  async untyingUser(childId) {
    let url = `${domain}/api/wxapp/untying_user`
    let data = {
      user: childId
    }
    return this.post2(url, data)
  }
  /*-------------------------------------------原版------------------------------------------------*/
  //获取商家信息
  async getInformation() {
    let that = this
    let phones = wx.getStorageSync('MYPHONE')
    phones = "13412924605"
    let Authorization = wx.getStorageSync('AUTHORIZATION')
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: `${domain}/api/mobile/merchant/get_information`,
        method: 'GET',
        header: {
          'Authorization': Authorization
        },

        success: async (res) => {
          if (res.data.errorcode == 0) {
            resolve(res.data)
            res.data.data.user = res.data.data.contacts.find(d => d.phone === phones)
            for (var i in res.data.data.contacts) {
              if (res.data.data.contacts[i].default == true) {
                res.data.data.contact = res.data.data.contacts[i]
              }
            }
            console.log('MYSHOP', res.data.data)
            wx.setStorageSync('MYSHOP', res.data.data)
          } else {
            await LoginServer.myPhoneLogin(phones)
            await that.getInformation()
          }
        }
      })
      setTimeout(function () {
        wx.hideLoading()
      })
    })
  }

  //带搜索的查单列表
  async searchOrder(sn, flag, pageNum, time, transportStatus) {
    let url = `${domain}/api/mobile/merchant/search_order`
    let data = {
      sn: sn,
      flag: flag,
      pageNum: pageNum,
      pageSize: 10,
      time: time,
      transportStatus: transportStatus
    }
    return this.get(url, data)

  }








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
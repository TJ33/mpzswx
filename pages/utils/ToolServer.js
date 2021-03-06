import regeneratorRuntime from "regenerator-runtime";
const { domain } = require('../config.js')
var LoginServer = require('./LoginServer')

class ToolServer {

  //手机登陆接口

  //解析手机号

  //商家注册
  async merchantEntry(name, longitude, latitude, userName, userPhone, code, address) {
    let url = `${domain}/api/wxapp/merchant_entry`
    let data = {
      name: name,
      longitude: longitude,
      latitude: latitude,
      userName: userName,
      userPhone: userPhone,
      code: code,
      address: address,
    }
    return this.post2(url, data)
  }

  async merchantEntryWithOutAddress(userName, userPhone, code) {
    let url = `${domain}/api/wxapp/merchant_entry`
    let data = {
      name: userName,
      userPhone: userPhone,
      code: code
    }
    return this.post2(url, data)
  }



  //查询运单
  async findWayBill(transportStatus, sn) {
    let url = `${domain}/api/wxapp/find_waybill`
    let data = {
      transportStatus: transportStatus,
      sn: sn
    }
    return this.post(url, data)
  }

  //查询运单详情
  async findWayBillDetails(id) {
    let url = `${domain}/api/wxapp/find_waybill_details`
    let data = {
      id: id
    }
    return this.post(url, data)
  }

  //查询地址簿列表
  async findAddressBook(keyword) {
    let url = `${domain}/api/wxapp/find_address_book`
    let data = {
      keyword: keyword
    }
    return this.post(url, data)
  }

  //添加/编辑 地址簿
  async addAddressBook(anotherNamer, contactName, contactPhone, address, coordinates, doorplate, id) {
    let url = `${domain}/api/wxapp/add_update_address_book`
    let data = {
      anotherNamer: anotherNamer,
      contactName: contactName,
      contactPhone: contactPhone,
      address: address,
      coordinates: coordinates,
      doorplate: doorplate,
      id: id
    }
    return this.post2(url, data)
  }

  //根据id查询地址簿
  async findAddressById(id) {
    let url = `${domain}/api/wxapp/find_address_by_id`
    let data = {
      id: id
    }
    return this.post(url, data)
  }

  //删除地址簿
  async delAddressBook(id) {
    let url = `${domain}/api/wxapp/del_address_book`
    let data = {
      id: id
    }
    return this.post2(url, data)
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
    console.log("consignor+++++++++++++++", consignor)
    console.log("consignee++++++++++++++++", consignee)
    console.log("vehicleType+++++++++++++++", vehicleType)
    let url = `${domain}/api/wxapp/waybill_distance`
    let data = {
      consignor: consignor,
      consignee: consignee,
      vehicleType: vehicleType
    }
    return this.post2(url, data)
  }


  //商家下单
  async merchantOrder(consignor, consignee, freightMonthly, cargoMoney, distance, remark, vehicleType, freight, operationTeam, state, receiveAt) {
    let url = `${domain}/api/wxapp/merchant_order`
    let data = {
      consignor: consignor,
      consignee: consignee,
      freightMonthly: freightMonthly,
      cargoMoney: cargoMoney,
      distance: distance,
      remark: remark,
      vehicleType: vehicleType,
      freight: freight,
      operationTeam: operationTeam,
      state: state,
      receiveAt: receiveAt
    }
    return this.post(url, data)
  }

  //获取司机位置信息
  async findDriverLocation(sn) {
    let url = `${domain}/api/wxapp/get_position_deliveryman`
    let data = {
      sn: sn
    }
    return this.post2(url, data)
  }

  //取消订单
  async cancelOrder(sn) {
    let url = `${domain}/api/wxapp/waybill_del`
    let data = {
      sn: sn
    }
    return this.post2(url, data)
  }


  //商家点击提交取消运单原因
  async cancelReason(value) {
    let url = `${domain}/api/wxapp/cancel_reason`
    let data = {
      value: value
    }
    return this.post(url, data)
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

  //默认历史下单商家
  async historyMerchant(logisticsCompany) {
    let url = `${domain}/api/mobile/merchant/history_merchant`
    let data = {
      pageNum: 1,
      pageSize: 100,
      logisticsCompany: logisticsCompany
    }
    return this.get(url, data)
  }

  //搜索联系人信息
  async searchMerchant(contactName, contactPhone, address, pageNum) {
    let url = `${domain}/api/mobile/merchant/search_merchant`
    let data = {
      contactName: contactName,
      contactPhone: contactPhone,
      address: address,
      pageNum: pageNum,
      pageSize: 10,
    }
    return this.get(url, data)
  }

  //查询历史运单信息
  async searchOrder(sn, pageNum, start, end, transportStatus) {
    let url = `${domain}/api/wxapp/search_order`
    let data = {
      sn: sn,
      pageNum: pageNum,
      pageSize: 10,
      start: start,
      end: end,
      transportStatus: transportStatus
    }
    return this.post(url, data)
  }


  async untyingUser(childId) {
    let url = `${domain}/api/wxapp/untying_user`
    let data = {
      user: childId
    }
    return this.post2(url, data)
  }

  //对账相关
  //查询账单列表
  async getAccountList(startTime, endTime, status, pageNum) {
    let url = `${domain}/api/wxapp/account_list`
    let data = {
      startTime: startTime,
      endTime: endTime,
      status: status,  //标志:历史对帐(HAVE_CHECK)or未对帐(NOT_CHECK)
      pageNum: pageNum,
      pageSize: 10,
    }
    return this.post(url, data)
  }

  //对帐列表--每天
  async reconcileDateList(time, status, pageNum) {

    let url = `${domain}/api/wxapp/date_list`
    let data = {
      time: time,
      status: status,  //标志:历史对帐(HAVE_CHECK)or未对帐(NOT_CHECK)
      pageNum: pageNum,
      pageSize: 10,
    }
    return this.post(url, data)
  }

  //确认对帐
  async reconcileConfirm(id) {
    let url = `${domain}/api/wxapp/account_confirm`
    let data = {
      id: id,
    }
    return this.post2(url, data)
  }


  //账单详情
  async getAccountDetail(id) {
    let url = `${domain}/api/wxapp/account_details`
    let data = {
      id: id,
    }
    return this.post(url, data)
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
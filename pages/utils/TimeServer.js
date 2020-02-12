import moment from 'moment';
import regeneratorRuntime from "regenerator-runtime";

class TimeServer {

  otherCs() {
    let times
    let timestamp = (new Date()).valueOf();
    let createAt = moment('2019-03-11T07:49:41.733Z').valueOf()
    let nTime = (timestamp - createAt) / 1000 / 86400
    if (nTime > 1) {
      times = moment('2019-03-11T07:49:41.733Z').valueOf().utc().format('LLL')
    } else {
      times = moment('2019-03-11T07:49:41.733Z').valueOf().utc().format('H:mm')
    }
    // let times = moment(moment.unix(parseInt('2019-02-25T07:49:41.733Z')).toDate())
    return times
  }
  /****************************************
   * 获取日期格式化（LLL），utc是转北京时间
   */
  async createAtFormatLLL(items) {
    console.log('items,times')
    console.log(items)
    for (var inr in items) {
      items[inr].time.createAt = new Date(+new Date(new Date(items[inr].time.createAt).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      // items[inr].time.createAt = moment(items[inr].time.createAt).locale('zh-cn').utc().format('YYYY-MM-DD HH:mm')
    }
    return items
  }
  async createAtFormatLLL2(items) {
    console.log('items,times')
    console.log(items)
    for (var inr in items) {
      items[inr].time = new Date(+new Date(new Date(items[inr].time).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      // items[inr].time.createAt = moment(items[inr].time.createAt).locale('zh-cn').utc().format('YYYY-MM-DD HH:mm')
    }
    return items
  }

  async createAtFormatYMD(items) {
    console.log('items,times')
    console.log(items)
    for (var inr in items) {
      items[inr].dates.date = moment(items[inr].dates.date).locale('zh-cn').utc().format('YYYY-MM-DD')
    }
    return items
  }

  async createDateYMD(items) {
    console.log('items,times')
    console.log(items)
    for (var inr in items) {
      items[inr].date = new Date(+new Date(new Date(items[inr].date).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      // items[inr].date = moment(items[inr].date).locale('zh-cn').utc().format('YYYY-MM-DD')
    }
    return items
  }
  async signInAtYMD(items) {
    console.log('items,times')
    console.log(items)
    for (var inr in items) {
      items[inr].signInAt = moment(items[inr].signInAt).locale('zh-cn').utc().format('YYYY-MM-DD H:mm')
    }
    return items
  }

  async timeYMD(items) {
    console.log('items,times')
    console.log(items)
    for (var inr in items) {
      items[inr].time = new Date(+new Date(new Date(items[inr].time).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      // items[inr].time = moment(items[inr].time).locale('zh-cn').utc().format('YYYY-MM-DD H:mm')
    }
    return items
  }

  async timeYMD_ONE(items) {
    console.log('items,times')
    console.log(items)
    items.time = new Date(+new Date(new Date(items.time).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    // items.time = moment(items.time).locale('zh-cn').utc().format('YYYY-MM-DD H:mm')
    return items
  }
  async createAtYMD_ONE(items) {
    console.log('items,times')
    console.log(items)
    items.createAt = new Date(+new Date(new Date(items.createAt).toJSON()) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    // items.createAt = moment(items.createAt).locale('zh-cn').utc().format('YYYY-MM-DD H:mm')
    return items
  }

  async timeOther(items) {
    for (var inr in items) {
      let timestamp = (new Date()).valueOf();
      let createAt = moment(items[inr].time).valueOf()
      let nTime = (timestamp - createAt) / 1000 / 86400
      if (nTime > 1) {
        items[inr].time = moment(items[inr].time).locale('zh-cn').utc().format('YYYY-MM-DD H:mm')
      } else {
        items[inr].time = moment(items[inr].time).locale('zh-cn').utc().format('H:mm')
      }
    }
    return items
  }

}
module.exports = new TimeServer

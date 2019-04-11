// pages/myDevice/myDevice.js
var app = getApp();
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    hasUserInfo: true,
    userNick: '',
    isHide: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goodsSales:[],//商品销售排行数据
    deviceSales:[],//设备销售记录
    operateInfo:[],//运营数据
    tradeRecords:[],//x销售记录
    current: 1,
    total:'5'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload")
    wx.hideTabBar()
    //判断是否授权用户信息
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: resSetting => {
              app.globalData.userInfo = resSetting.userInfo;
              that.setData({
                userInfo: resSetting.userInfo,
                hasUserInfo: true,
                userNick: resSetting.userInfo.nickName
              });
            }
          });
         
          that.login();
        } else {
          that.setData({
            hasUserInfo: true,
            isHide:true
          });
        }
      }
    });

  },
  login() {
    var _self = this;
    wx.login({
      scopes: 'auth_user',
      success: (res) => {
        wx.getUserInfo({
          success: result => {
            const data = {
              "code": res.code,
              "keyPoolId": "11", //小程序id
            }
            let { encryptedData, iv } = result

            http('qsq/miniService/miniProComm/weChatCommon/commonLogin', JSON.stringify(data), 1, 1).then(lres => {
              app.globalData.sessionId = lres.sessionId;
              app.globalData.openid = lres.openid;
              const params = {
                sign: encode({
                  openid: lres.openid,
                  encryptedData: encryptedData,
                  iv: iv
                }, lres.sessionId),
                sessionId: lres.sessionId,
                params: {
                  openid: lres.openid,
                  encryptedData: encryptedData,
                  iv: iv
                }
              }
              http('qsq/miniService/miniProComm/weChatCommon/saveAnalysisData', JSON.stringify(params), 1, 1).then(sres => {

              })
              _self.getUser()
            
            })
          }
        })
      }
    })
  },

 
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    const {
      errMsg
    } = e.detail
    if (errMsg === 'getUserInfo:ok') {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        userNick: e.detail.userInfo.nickName,
        isHide:false
      });
      this.login();
    }

  },
  //查看管理员信息
  getUser() {

    const params = {
      sign: encode({
        sessionId: app.globalData.sessionId,
        openid: app.globalData.openid
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        sessionId: app.globalData.sessionId,
        openid: app.globalData.openid

      }
    }
    http('qsq/service/external/WxUser/saveUserMessage', JSON.stringify(params), 1, 1).then(res => {
      if (res.openid == "" || res.openid != app.globalData.openid) {
        wx.redirectTo({
          url: '../login/login',
        })
      } else {
          app.globalData.id = res.id,
          app.globalData.type = res.type,
          app.globalData.levelTypeId = res.levelTypeId
        this.queryGoodsSalesRank();
      }
    })
  },

  //获取商品销量排行
  queryGoodsSalesRank(){
    const { sessionId,id,type,levelTypeId} = app.globalData
    const params = {
      sign: encode({
        sessionId: sessionId,
        userId: id,
        type: type,
        levelTypeId: levelTypeId
      },sessionId),
      sessionId: sessionId,
      params: {
        sessionId: sessionId,
        userId: id,
        type: type,
        levelTypeId: levelTypeId
      }
    }
  
    http('qsq/service/external/salesDetails/getGoodsSaleRank', JSON.stringify(params), 1, 1).then(res => {
      var tradeRecords = res.tradeRecords
      for (var i = 0; i < tradeRecords.length;i++){
        tradeRecords[i].time = this.formatDateTime(tradeRecords[i].createTime)

      }
      this.setData({
        goodsSales: res.goodsSales,
        deviceSales: res.deviceSales,
        tradeRecords: tradeRecords
      })
    })
    http('qsq/service/external/salesDetails/getDeviceOperateInfo', JSON.stringify(params), 1, 1).then(res => {
      this.setData({
        operateInfo: res
      })
    })
  //   http('qsq/service/external/salesDetails/getDeviceTradeInfo', JSON.stringify(params), 1, 1).then(res => {
  //     this.setData({
  //       deviceSales: res
  //     })
  //   })
  //   http('qsq/service/external/salesDetails/getAllTradeRecords', JSON.stringify(params), 1, 1).then(res => {
  //     this.setData({
  //       tradeRecords: res
  //     })
  //   })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.type){
      this.queryGoodsSalesRank()
    }
  },
  handleChange(e) {
    const type = e.target.dataset.choose;
    if (type === 'next') {
      this.setData({
        current: this.data.current + 1
      });
    } else if (type === 'prev') {
      this.setData({
        current: this.data.current - 1
      });
    }
  },
  //格式化时间
  formatDateTime: function (inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
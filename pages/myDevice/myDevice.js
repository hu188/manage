// pages/myDevice/myDevice.js
var app = getApp();
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
const util = require('../../utils/util.js')
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
    current: 1,//当前页
    pageCount:'1',//总页数
    realName:'',//用户名
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
          app.globalData.levelTypeId = res.levelTypeId,
          this.setData({
            realName:res.realname
          })
        this.queryOperationData();
      }
    })
  },

  //获取设备运营数据
  queryOperationData(){
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
    //商品排行
    http('qsq/service/external/salesDetails/getGoodsSaleRank', JSON.stringify(params), 1, 1).then(res => {
   
      this.setData({
        goodsSales: res.goodsSales,
        deviceSales: res.deviceSales
    
      })
    })
    http('qsq/service/external/salesDetails/getDeviceOperateInfo', JSON.stringify(params), 1, 1).then(res => {
      this.setData({
        operateInfo: res
      })
    })
 
  this.getTradeRecords()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.type){
      this.queryOperationData()
    }
  },
  handleChange(e) {
    const choose = e.target.dataset.choose;
    const {current,pageCount} = this.data

    if (choose === 'next') {
      this.setData({
        current: (current>=pageCount)?current:current + 1,
      });
    } else if (choose === 'prev') {
      this.setData({
        current: (current <= 1) ?current:current - 1,
      });
    }
    this.getTradeRecords()
  },

  //获取销售记录汇总
  getTradeRecords(){
    const { sessionId, id, type, levelTypeId } = app.globalData
    const params = {
      sign: encode({
        sessionId: sessionId,
        userId: id,
        type: type,
        levelTypeId: levelTypeId,
        currentPage: this.data.current,
        limit: '10'
      }, sessionId),
      sessionId: sessionId,
      params: {
        sessionId: sessionId,
        userId: id,
        type: type,
        levelTypeId: levelTypeId,
        currentPage: this.data.current,
        limit: '10'
      }
    }
    http('qsq/service/external/salesDetails/getAllTradeRecords', JSON.stringify(params), 1, 1).then(res => {
      var tradeRecords = res.allRecordsList
      for (var i = 0; i < tradeRecords.length; i++) {
        tradeRecords[i].time = util.formatDateTime(tradeRecords[i].createTime)
      }
      this.setData({
        tradeRecords: tradeRecords,
        pageCount: res.pageCount
      })
    })
  },
  //退出登录
  exitLogin: function () {
    wx.showModal({
      title: '友情提醒',
      content: '是否确认退出',
      success(res) {
        if (res.confirm) {
          const { sessionId, id } = app.globalData
          console.log(id)
          const params = {
            sign: encode({
              sessionId: sessionId,
              id: id
            }, sessionId),
            sessionId: sessionId,
            params: {
              sessionId: sessionId,
              id: id
            }
          }
          http('qsq/service/external/WxUser/saveExitUserLogin', JSON.stringify(params), 1, 1).then(res => {
            if (res == 1) {
              wx.showToast({
                title: '退出成功',
              })
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
        } 
      }
    })
   
  },


 
})
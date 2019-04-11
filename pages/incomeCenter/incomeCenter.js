// pages/incomeCenter/incomeCenter.js
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
//退出登录
  exitLogin:function(){
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
    http('qsq/service/external/WxUser/saveExitUserLogin', JSON.stringify(params), 1, 1).then(res=>{
      if(res==1){
        wx.showToast({
          title: '退出成功',
        })
        wx.redirectTo({
          url: '../login/login',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
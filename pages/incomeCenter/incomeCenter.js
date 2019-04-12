// pages/incomeCenter/incomeCenter.js
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acountDetails:[],
    acountCurrent:1,
    acountPageCount:'1',
    accountHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar()
    this.getAccountDetails()
  },

 /**
  * 查询分账信息
  */
  getAccountDetails(){
    let that= this
    const { sessionId, id, type, levelTypeId } = app.globalData
    const params = {
      sign: encode({
        sessionId: sessionId,
        type: type,
        levelTypeId: levelTypeId,
        currentPage: that.data.acountCurrent,
        limit: '5'
      }, sessionId),
      sessionId: sessionId,
      params: {
        sessionId: sessionId,
        type: type,
        levelTypeId: levelTypeId,
        currentPage: that.data.acountCurrent,
        limit:'5'
      }
    }
    http('qsq/service/external/salesDetails/getAccountDetails', JSON.stringify(params), 1, 1).then(res=>{
      var acountDetails = res.userList
      for (var i = 0; i < acountDetails.length; i++) {
        if (acountDetails[i].payedMoneyTime){
          acountDetails[i].time = this.formatDateTime(acountDetails[i].payedMoneyTime)
        }
      
      }
      that.setData({
        acountDetails: acountDetails,
        acountPageCount:res.pageCount,
        accountHeight: acountDetails.length*29+30
      })
    })
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
  //上一页/下一页
  handleChange(e) {
    const choose = e.target.dataset.choose;
    const { acountCurrent, acountPageCount } = this.data
    console.log(acountCurrent)
    if (choose === 'next') {
      this.setData({
        acountCurrent: (acountCurrent >= acountPageCount) ? acountCurrent : acountCurrent + 1,
      });
      console.log(this.data.acountCurrent)
    } else if (choose === 'prev') {
      this.setData({
        acountCurrent: (acountCurrent <= 1) ? acountCurrent : acountCurrent - 1,
      });
    }
    this.getAccountDetails()
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
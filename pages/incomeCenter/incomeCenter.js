// pages/incomeCenter/incomeCenter.js
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
const util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acountDetails:[],//分账信息
    acountCurrent:1,
    acountPageCount:1,

    transferList:[],//转账记录
    transferCurrent: 1,
    transferPageCount: 1,
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideTabBar()
   
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
        limit: '6'
      }, sessionId),
      sessionId: sessionId,
      params: {
        sessionId: sessionId,
        type: type,
        levelTypeId: levelTypeId,
        currentPage: that.data.acountCurrent,
        limit:'6'
      }
    }
    http('qsq/service/external/salesDetails/getAccountDetails', JSON.stringify(params), 1, 1).then(res=>{
      var acountDetails = res.userList
      for (var i = 0; i < acountDetails.length; i++) {
        if (acountDetails[i].payedMoneyTime){
          acountDetails[i].time = util.formatDateTime(acountDetails[i].payedMoneyTime)
        }
      
      }
      that.setData({
        acountDetails: acountDetails,
        acountPageCount:res.pageCount,
  
      })
    })
  },


  /**
 * 查询转账记录
 */
  getTransferList() {
    let that = this
    const { sessionId, id, type, levelTypeId } = app.globalData
    const params = {
      sign: encode({
        sessionId: sessionId,
        type: type,
        levelTypeId: levelTypeId,
        currentPage: that.data.transferCurrent,
        userId:id,
        limit: '6'
      }, sessionId),
      sessionId: sessionId,
      params: {
        sessionId: sessionId,
        type: type,
        levelTypeId: levelTypeId,
        currentPage: that.data.transferCurrent,
        userId:id,
        limit: '6'
      }
    }
    http('qsq/service/external/salesDetails/getTransferList', JSON.stringify(params), 1, 1).then(res => {
      var transferList = res.transferList
      for (var i = 0; i < transferList.length; i++) {
        if (transferList[i].createTime) {
          transferList[i].time = util.formatDateTime(transferList[i].createTime)
        }

      }
      that.setData({
        transferList: transferList,
        transferPageCount: res.pageCount,
 
      })
    })
  },

  //分账信息上一页/下一页
  handleChange(e) {
    const choose = e.target.dataset.choose;
    const { acountCurrent, acountPageCount } = this.data
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

  //转账记录上一页/下一页
  transferHandleChange(e) {
    const choose = e.target.dataset.choose;
    const { transferCurrent, transferPageCount } = this.data
    if (choose === 'next') {
      this.setData({
        transferCurrent: (transferCurrent >= transferPageCount) ? transferCurrent : transferCurrent + 1,
      });
      console.log(this.data.transferCurrent)
    } else if (choose === 'prev') {
      this.setData({
        transferCurrent: (transferCurrent <= 1) ? transferCurrent : transferCurrent - 1,
      });
    }
    this.getTransferList()
  },
  //下拉刷新

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getAccountDetails();
    this.getTransferList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAccountDetails();
    this.getTransferList();
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
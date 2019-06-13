const { $Toast } = require('../../Components/base/index');
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAccount:'',
    password:''
  },
  onLoad:function(){

  },
  //登录
  login: function (e) {
    let { userAccount, password } = e.detail.value;
    this.setData({
      userAccount: userAccount,
      password: password
    })
    if (userAccount == "" || password == "") {
      $Toast({
        content: '用户名和密码必须输入',
        type: 'warning'
      });
    }
   
      const { sessionId, openid } = app.globalData
      const params = {
        sign: encode({
          username: userAccount,
          password: password,
          sessionId:sessionId,
          open_id:openid
        }, sessionId),
        sessionId: sessionId,
        params: {
          username: userAccount,
          password: password,
          sessionId: sessionId,
          open_id: openid
        }
      }
    http('qsq/service/external/WxUser/saveUserLogin', JSON.stringify(params), 1, 1).then(res => {
        if (res.id) {
          app.globalData.id = res.id
          wx.switchTab({
            url: '../myDevice/myDevice',
          })
          
        }else{
          $Toast({
            content:res,
            type: 'warning'
          });
        }
      })
    } 
  
})
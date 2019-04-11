//app.js
import { http } from './utils/http'
import { encode } from './utils/encode';
App({
  onLaunch: function () {

   
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
              this.globalData.sessionId = lres.sessionId;
              this.globalData.openid = lres.openid;
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
              this.getUser()
      
            })
          }
        })
      }
    })
  },
  //查看管理员信息
  getUser() {

    const params = {
      sign: encode({
        sessionId: this.globalData.sessionId,
        openid: this.globalData.openid
      }, this.globalData.sessionId),
      sessionId: this.globalData.sessionId,
      params: {
        sessionId: this.globalData.sessionId,
        openid: this.globalData.openid

      }
    }
    http('qsq/service/external/WxUser/saveUserMessage', JSON.stringify(params), 1, 1).then(res => {
      if(res.openid=="" ||  res.openid!=this.globalData.openid){
        wx.redirectTo({
          url: '../login/login',
        })
      }else{
        this.globalData.id=res.id,
        this.globalData.type = res.type,
        this.globalData.levelTypeId = res.levelTypeId
      }
    })
  },
  globalData: {
    userInfo: null,
    sessionId:'',
    id:'',//管理员id
    levelTypeId:'',
    type:""
  }
})
//app.js
import { http } from './utils/http'
import { encode } from './utils/encode';
App({
  onLaunch: function () {
    this.reLogin()
  },
  reLogin(){
    var that = this
    setTimeout(function () {
      wx.login({
        scopes: 'auth_user',
        success: (res) => {
          wx.getUserInfo({
            success: result => {
              const data = {
                "code": res.code,
                "keyPoolId": "13", //小程序id
              }
              let { encryptedData, iv } = result

              http('qsq/miniService/miniProComm/weChatCommon/commonLogin', JSON.stringify(data), 1, 1).then(lres => {
                that.globalData.sessionId = lres.sessionId;
                that.globalData.openid = lres.openid;
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

              })
            }
          })
        }
      })
    that.reLogin()
    }, 3600000 ) //延迟时间 一小时3600000
  },
  globalData: {
    userInfo: null,
    sessionId:'',
    id:'',//管理员id
    levelTypeId:'',
    type:""
  }
})
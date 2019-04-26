//index.js
//获取应用实例
const app = getApp()
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';

Page({
  data: {
    userInfo: {},
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } 
  },
  reLogin(){
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
                // _self.getUser()
                wx.navigateBack({
                  delta: 1
                })
              })
            }
          })
        }
      })
    
  },

})

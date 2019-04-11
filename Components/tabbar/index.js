// Components/tabbar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      current: {
      type: String,
      value: 'mine'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange({ detail }) {
      const { key } = detail
      
      if (key === 'mine') {
        wx.switchTab({
          url: '/pages/myDevice/myDevice',
        })
      } else if (key === 'income'){
        wx.switchTab({
          url: '/pages/incomeCenter/incomeCenter',
        })
      }
     
    },
  }
})

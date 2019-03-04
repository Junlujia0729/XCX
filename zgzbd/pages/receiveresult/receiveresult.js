// pages/receiveresult.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:0,
    clientHeight:0,
    tip1:'',
    tip2:'',
    tip3:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let channel = 0 ;
    if (options.channel){
      channel = options.channel;
    }
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/query_score_sub", {
        
    }, function (res) {
      that.setData({
        tip1:res.data.data.msg1,
        tip2: res.data.data.msg2,
        tip3: res.data.data.msg3
      })
    });
    

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight -50
        });
      }
    }); 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '提前查分，邀你一起来预约',
      imageUrl: 'http://imgs.52jiaoshi.com/1543370171.png',
      path: '/pages/home/home',
      success: function (res1) {
        var scene = 10007;
        if (res1.shareTickets != undefined) {
          scene = 10044;
        }
        // userApi.requestAppApi_POST(app.globalData.mainDomain + "/ApiNlpgbg/xcx_share_stat", {
        //   scene: app.globalData.scene, openid: app.globalData.openId
        // }, function (shres) {

        // });
        // 转发成功,通过res1.shareTickets[0]获取转发ticket
      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
  },

  returnpage:function(){
    wx.switchTab({
      url: '../home/home',
    })
  }
})
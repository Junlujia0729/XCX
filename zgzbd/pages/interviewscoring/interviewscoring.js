// pages/interviewscoring/interviewscoring.js

const app = getApp()
const userApi = require('../../libraries/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.id){
      that.setData({
        id: options.id
      })
    }
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
  onShareAppMessage: function () {

  },

  formSubmit:function(e){
    let that = this;
    let score1 = e.detail.value.score1;
    let score2 = e.detail.value.score2;
    let score3 = e.detail.value.score3;
    let score4 = e.detail.value.score4;
    let score5 = e.detail.value.score5;
    let score6 = e.detail.value.score6;
    let score7 = e.detail.value.score7;
    let score8 = e.detail.value.score8;
    if (!score1 || !score2 || !score3 || !score4 || !score5 || !score6 || !score7 || !score8){
      wx.showToast({
        title: '请完善各项评分',
        icon: 'none'
      })
      return;
    }
    if (app.globalData.nickname == "" || app.globalData.avatar == "") {
      //未设置电话号码
      wx.navigateTo({
        url: '../getuserinfo/getuserinfo',
      })
    } else {
      userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/grade", {
        id: that.data.id, score1: score1, score2: score2, score3: score3, score4: score4, score5: score5, score6: score6, score7: score7, score8: score8
      }, function (res) {
        wx.showToast({
          title: res.data.data.msg,
          icon: 'none'
        })
        setTimeout(function () {
          if (res.data.code == 200) {
            wx.navigateBack({

            })
          }
        }, 500)
      });
    }
  },
  redirectToReplay:function(){
    let that = this;
    that.formSubmit();
  }
})
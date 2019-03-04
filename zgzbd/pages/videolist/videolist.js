// pages/videolist.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoes:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/recite_more_viedo", {}, function (res) {
      console.log(res.data);
      let _videoes = {};
      _videoes.videoes = res.data.data.videoes;
      that.setData({
        videoes: _videoes
      })
    })
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
      wx.stopPullDownRefresh();
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
  playvideo: function (e) {
    wx.navigateTo({
      url: '../videoplay/videoplay?index=' + e.currentTarget.dataset.index,
    })
  }
})
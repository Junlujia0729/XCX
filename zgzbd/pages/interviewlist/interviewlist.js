// pages/Interviewlist/Interviewlist.js
const app = getApp()
const userApi = require('../../libraries/user.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[],
    wxcode: '6',
    maskshow: false,
    isIphoneX: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/interview_list", {
    }, function (res) {
      if (res.data.code == 200) {
        that.setData({
          datas: res.data.data.data
        });
      }
    });

    if (app.globalData.systemInfo.model && app.globalData.systemInfo.model.indexOf('iPhone X') > -1){
      that.setData({isIphoneX:true});
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
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/interview_list", {
    }, function (res) {
      if (res.data.code == 200) {
        that.setData({
          datas: res.data.data.data
        });
      }
    });
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
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/interview_list", {
    }, function (res) {
      if (res.data.code == 200) {
        that.setData({
          datas: res.data.data.data
        });
      }
    });
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
    return {
      title: '快来帮我评分啦',
      path: '/pages/interviewdetail/interviewdetail?id=' + that.data.id,
      // imageUrl: 'http://www.52jiaoshi.com/download/52_green.jpg',
      success: function (res1) {

      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
  },

  //邀请老师打分
  askteacher: function () {
    let that = this;
    that.setData({
      maskshow: true
    })
  },
  // 复制微信号
  copy: function () {
    let that = this;
    wx.setClipboardData({
      data: that.data.wxcode,
      success(res) {
        wx.getClipboardData({
          success(res) {

          }
        })
      }
    })
  },
  // 关闭
  close: function () {
    let that = this;
    that.setData({
      maskshow: false
    })
  },

  start: function () {
    if (app.globalData.mobile == "") {
      //未设置电话号码
      wx.navigateTo({
        url: '../getphone/getphone',
      })
    } else {
      wx.navigateTo({
        url: '../identity/identity',
      })
    }
  },

  redirectToDetail: function () {
    let that = this;
    wx.redirectTo({
      url: '../identity/identity',
    });
  }
})
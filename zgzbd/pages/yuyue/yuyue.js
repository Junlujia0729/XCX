// pages/yuyue/yuyue.js
const app = getApp()
const userApi = require('../../libraries/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask:0,
    img:'',
    desc:[],
    isbind:0,
    mobile:'',
    isinit:0,
  },
  showinitphone:function(e){
    let that = this;
    if (app.globalData.mobile != '') {
      // that.setData({
      //   mobile: app.globalData.mobile,
      //   isbind: 1,
      // });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (app.globalData.mobile != ''){
      that.setData({
        isinit: 1,
      });
    }
    
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/yuyue_text", {}, function (res) {
      that.setData({
        img: res.data.data.img,
        desc: res.data.data.desc,
      });
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
      title: '教师资格证预约查分',
      path: '/pages/home/home',
      success: function (res1) {
      },
      fail: function (res1) {
      }
    }
  },
  onGetPhoneNum: function (e) {
    console.log(e);
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/matrix_setUserBindPhone", {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }, function (res) {
      if (res.data.code == 200) {
        app.globalData.mobile = res.data.data.mobile;
        that.setData({
          mobile: app.globalData.mobile,
          isbind: 1,
        });
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function (res) {

          }
        })
      }
    });
  },
  queryScore:function(e){
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/matrix_formid", {
      formid: e.detail.formId
    }, function (res) {
    });

    if (that.data.isbind){
      let _mobile = that.data.mobile;
      userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/yuyue", {
        mobile: _mobile,
        captcha: '',
        bind: 1,
      }, function (res2) {
        wx.showModal({
          title: '预约成功',
          showCancel: false,
          content: '官方公布成绩后系统第一时间短信通知您',
        })
      });
    }else{
      if (e.detail.value.mobile.length == 11){
        let _mobile = e.detail.value.mobile;
        userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/yuyue_sms", {
          mobile: _mobile
        }, function (res1) {
          that.setData({
            mobile: _mobile,
            mask: 1
          });
        });
      }else{
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请输入正确的手机号',
        })
      }
    }
  },
  queryScore22: function (e) {
    let that = this;
    console.log(e.detail.value);
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/matrix_formid", {
      formid: e.detail.formId
    }, function (res) {
    });

    if (that.data.isbind) {

    } else {
      if (e.detail.value.captcha.length == 4) {
        let _mobile = that.data.mobile;
        let _captcha = e.detail.value.captcha;
        userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/yuyue", {
          mobile: _mobile,
          captcha: _captcha,
          bind: 0,
        }, function (res1) {
          if (res1.data.code == 200){
            that.setData({
              mask: 0
            });
            wx.showModal({
              title: '预约成功',
              showCancel: false,
              content: '官方公布成绩后系统第一时间短信通知您',
            })
          }else{
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: res1.data.data.msg,
            })
          }
          
        });
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请输入正确的验证码',
        })
      }
    }
  },
  cancle: function () {
    var that = this;
    that.setData({
      mask: 0,
    })
  }
})
// pages/home/home.js
const app = getApp()
const userApi = require('../../libraries/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_level:0,
    select_subject: 0,
    subjects:[],
    levels:[],
    ischoose:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/get_subject", {
      appid: app.globalData.appid
    }, function (res) {
      that.setData({
        levels: res.data.data.level,
        subjects: res.data.data.subject
      })
      var _levels = res.data.data.level;
      var _subjects = res.data.data.subject;
      var _select_level = 0;
      var _select_subject = 0;
      for (var item in _subjects) {
        if (_subjects[item].type == 1){
          that.setData({
            select_subject: _subjects[item].id
          });
          _select_level =1;
        }
      }
      for (var item in _levels) {
        if (_levels[item].type == 1) {
          that.setData({
            select_level: _levels[item].id,
          });
          _select_subject = 1;
        }
      }
      if (_select_level && _select_subject){
        that.setData({
          ischoose: 1
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
    //未设置电话号码
    // if (app.globalData.mobile == "") {
    //   wx.navigateTo({
    //     url: '../getphone/getphone',
    //   })
    // }
  },
  gotoClass: function (e) {
    
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
    const that = this;
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
      title: '资格证考试宝典',
      path: '/pages/home/home',
      success: function (res1) {
        var scene = 10007;
        if (res1.shareTickets != undefined) {
          scene = 10044;
        }
        
        // 转发成功,通过res1.shareTickets[0]获取转发ticket
        //console.log(res1.shareTickets[0]);
      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
  },
  // 选择学段
  chooseType: function (e) {
    let that = this;
    const id = e.currentTarget.dataset.id;
    that.setData({
      select_level: e.currentTarget.dataset.id
    });
    var _subjects = that.data.subjects;
    if (id == 1){
      for (var item in _subjects) {
        _subjects[item].type =2;
      }
      that.setData({
        ischoose: 1,
        select_subject:0
      })
    } else if (id == 2) {
      for (var item in _subjects) {
        _subjects[item].type = 0;
      }
      if (!that.data.select_level || !that.data.select_subject){
        that.setData({
          ischoose: 0
        })
      }
    }else if (id == 3){
      for (var item in _subjects) {
        _subjects[item].type = 0;
        if (_subjects[item].name == '体育'){
          _subjects[item].type = 2;
        }
      }
      if (!that.data.select_level || !that.data.select_subject) {
        that.setData({
          ischoose: 0
        })
      }
    } else if (id == 4) {
      for (var item in _subjects) {
        if (_subjects[item].name == '体育' || _subjects[item].name == '数学') {
          _subjects[item].type = 2;
        }else{
          _subjects[item].type = 0;
        }
      }
      if (!that.data.select_level || !that.data.select_subject) {
        that.setData({
          ischoose: 0
        })
      }
    }
    that.setData({
      subjects: _subjects
    })
  },
  // 选择学科
  chooseSubject: function (e) {
    let that = this;
    let select_subject = e.currentTarget.dataset.id;
    var _subjects = that.data.subjects;
    for (var item in _subjects) {
      _subjects[item].type = 0;
    }
    that.setData({
      select_subject: e.currentTarget.dataset.id,
      ischoose: 1,
      subjects: _subjects
    });
  },
  choose:function(){
    var that =this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/update_info", {
      appid: app.globalData.appid,
      level: that.data.select_level,
      subject: that.data.select_subject
    }, function (res) {
      wx.redirectTo({
        url: '../interview/interview',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    });
  }
})
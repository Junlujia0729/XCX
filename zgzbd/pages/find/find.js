const app = getApp()
const userApi = require('../../libraries/user.js')

Page({
  data: {
    currentTab: 0,
    tab_items:[],
    post_id:2,
    articledata2:[],
    articledata3: [],
    articledata4: [],
    articledata5: [],
    clientHeight: 0
  },
  onLoad(params) {
    var that=this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/xcx_find", {}, function (res) {
      var _datas = res.data.data;
      for (var i = 0; i < _datas.length ;i++){
        if(i==0){
          _datas[i].sign = 1;
        }else{
          _datas[i].sign = 0;
        }
      }
      that.setData({
        tab_items: _datas,
        post_id: _datas[0].id
      });
      userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/xcx_find_list", { id: that.data.post_id }, function (res) {
        console.log(res.data);
        that.setData({
          articledata2: res.data.data
        });
      });
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            clientHeight: res.windowHeight
          });
        }
      }); 
    }); 
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/xcx_find", {}, function (res) {
      var _datas = res.data.data;
      for (var i = 0; i < _datas.length; i++) {
        if (i == 0) {
          _datas[i].sign = 1;
        } else {
          _datas[i].sign = 0;
        }
      }
      that.setData({
        tab_items: _datas
      });
    });
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/xcx_find_list", { id: that.data.post_id }, function (res) {
      console.log(res.data);
      if (that.data.currentTab == 0){
        that.setData({
          articledata2: res.data.data
        });
      } else if (that.data.currentTab == 1) {
        that.setData({
          articledata3: res.data.data
        });
      } else if (that.data.currentTab == 2) {
        that.setData({
          articledata4: res.data.data
        });
      } else if (that.data.currentTab == 3) {
        that.setData({
          articledata5: res.data.data
        });
      }
      
    });
    wx.stopPullDownRefresh();
  },

  onShow: function () {
    const that = this
    
  },
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
    });
    let toTab = e.detail.current;
    let _post_id = that.data.tab_items[toTab].id;
    let _sign = that.data.tab_items[toTab].sign;
    let signstr = 'tab_items[' + e.detail.current + '].sign';
    that.setData({
      post_id: _post_id
    })
    if (_sign == 0){
      userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/xcx_find_list", { id: that.data.post_id }, function (res) {
        if (toTab == 0) {
          that.setData({
            articledata2: res.data.data,
            [signstr]: 1
          });
        } else if (toTab == 1) {
          that.setData({
            articledata3: res.data.data,
            [signstr]: 1
          });
        } else if (toTab == 2) {
          that.setData({
            articledata4: res.data.data,
            [signstr]: 1
          });
        } else if (toTab == 3) {
          that.setData({
            articledata5: res.data.data,
            [signstr]: 1
          });
        }

      });
    }
    
  },
  //点击切换
  clickTab:function(e) {
    var that =this;
    let toTab = e.target.dataset.current;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        post_id: e.target.dataset.id
      })
      let _sign = e.target.dataset.sign;
      let signstr = 'tab_items['+e.target.dataset.current+'].sign';
      if (_sign == 0){
        userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/xcx_find_list", { id: that.data.post_id }, function (res) {
          if (toTab == 0){
            that.setData({
              articledata2: res.data.data,
              [signstr]: 1
            });
          } else if (toTab == 1){
            that.setData({
              articledata3: res.data.data,
              [signstr]: 1
            });
          } else if (toTab == 2) {
            that.setData({
              articledata4: res.data.data,
              [signstr]: 1
            });
          } else if (toTab == 3) {
            that.setData({
              articledata5: res.data.data,
              [signstr]: 1
            });
          }
          
        });
      }
      
    }
  },

  // 查看详情
  Todetail:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../articledetail/articledetail?id='+id,
    })
  },
})






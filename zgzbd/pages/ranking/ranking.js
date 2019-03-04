const app = getApp()
const userApi = require('../../libraries/user.js')

Page({
  data: {
    currentTab: 0,
    items:[],
    totalitems:[],
    clientHeight:0,
    is_total:0,
    currentPage:0,
    TcurrentPage:0,
    is_loadingmore: 0,
    loadingmore_text: '正在加载'
  },
  onLoad(params) {
    console.log(app.globalData.userInfo );
    var that=this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/ranking_day_list", {
      page: that.data.currentPage
    }, function (res) {
      var _datas = res.data.data;
      that.setData({
        items: _datas
      });
    });  

    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/ranking_total_list", { page: that.data.TcurrentPage}, function (res) {
      var _datas = res.data.data;
      that.setData({
        totalitems: _datas
      });
    });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/ranking_day_list", {
      page: that.data.currentPage
    }, function (res) {
      var _datas = res.data.data;
      that.setData({
        items: _datas
      });
    });

    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/ranking_total_list", { page: that.data.TcurrentPage }, function (res) {
      var _datas = res.data.data;
      that.setData({
        totalitems: _datas
      });
    });
    wx.stopPullDownRefresh();
  },

  onShow: function () {
    const that = this
    
  },
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTba: e.detail.current,
    });
    if (e.detail.current == 0){
      that.setData({
        is_total:0
      })
    } else if(e.detail.current == 1){
      that.setData({
        is_total: 1
      })
    }
  },
  //点击切换
  clickTab:function(e) {
    var that =this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
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

  // 个人上拉加载更多
  loadMore: function () {
    var taht = this;
    // 当前页是最后一页
    if (taht.data.currentPage == taht.data.allPages) {
      taht.setData({
        is_loadingmore: 1,
        loadingmore_text: '没有更多数据了'
      })
      return;
    }
    setTimeout(function () {
      console.log('上拉加载更多');
      var _currentPage = taht.data.currentPage;
      _currentPage = _currentPage + 1;
      taht.setData({
        currentPage: _currentPage,
        hideBottom: false
      })
      userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/ranking_total_list", { page: _currentPage}, function (res) {
        var _datas = res.data.data;
        that.setData({
          items: _datas
        });
      }); 
    }, 300);
  },
  

  // 总榜上拉加载更多
  loadMoretotal: function () {
    var taht = this;
    setTimeout(function () {
      console.log('上拉加载更多');
      var _TcurrentPage = taht.data.TcurrentPage;
      _TcurrentPage = _TcurrentPage + 1;
      taht.setData({
        TcurrentPage: _TcurrentPage,
        hideBottom: false
      })
      userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/ranking_day_list", { page: _TcurrentPage }, function (res) {
        var _datas = res.data.data;
        that.setData({
          totalitems: _datas
        });
      });
    }, 300);
  },
})






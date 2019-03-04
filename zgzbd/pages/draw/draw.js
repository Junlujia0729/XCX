// pages/draw/draw.js
const app = getApp()
const userApi = require('../../libraries/user.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientHeight:0,
    clientWidth:0,
    showsection1:0,
    showsection2: 0,
    animation1: {},
    animation2:{},
    animation3: {},
    animation4: {},
    animation6: {},
    animation7: {},
    animation8: {},
    animation9: {},
    items:[],
    imgurl: '',
    maskZindex:1,
    animationfish:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this;
    // 加载图片
    setTimeout(function(){
      let _imgurl = app.globalData.mainDomain + 'XcxApi/koi?token=' + app.globalData.userToken
      that.setData({
        imgurl: _imgurl
      })
      that.imageDown(_imgurl);
    },500);
    
    var circleCount = 0;
    // 心跳的外框动画        
    that.animationfish = wx.createAnimation({
      duration: 1500, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });

    setInterval(function () {
      if (circleCount % 2 == 0) {
        that.animationfish.rotate(5).step();
      } else { that.animationfish.rotate(-5).step(); } that.setData({
        animationfish: that.animationfish.export()  //输出动画       
      });

      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 1000); 

    // 设置锦鲤图片数据
    let _items =[
      {
        smallimg:'http://imgs.52jiaoshi.com/1540522047.png',
        bigimg:'http://imgs.52jiaoshi.com/15350782965b7f6f98e2913.jpg'
      },
      {
        smallimg: 'http://imgs.52jiaoshi.com/1540522047.png',
        bigimg: 'http://imgs.52jiaoshi.com/15350782965b7f6f98e2913.jpg'
      },
      {
        smallimg: 'http://imgs.52jiaoshi.com/1540522047.png',
        bigimg: 'http://imgs.52jiaoshi.com/15350782965b7f6f98e2913.jpg'
      },
      {
        smallimg: 'http://imgs.52jiaoshi.com/1540522047.png',
        bigimg: 'http://imgs.52jiaoshi.com/15350782965b7f6f98e2913.jpg'
      },
      {
        smallimg: 'http://imgs.52jiaoshi.com/1540522139.png',
        bigimg: 'http://imgs.52jiaoshi.com/15350782965b7f6f98e2913.jpg'
      },
      {
        smallimg: 'http://imgs.52jiaoshi.com/1540522047.png',
        bigimg: 'http://imgs.52jiaoshi.com/15350782965b7f6f98e2913.jpg'
      },
      {
        smallimg: 'http://imgs.52jiaoshi.com/1540522047.png',
        bigimg: 'http://imgs.52jiaoshi.com/15350782965b7f6f98e2913.jpg'
      },
      {
        smallimg: 'http://imgs.52jiaoshi.com/1540522047.png',
        bigimg: 'http://imgs.52jiaoshi.com/15350782965b7f6f98e2913.jpg'
      },
      {
        smallimg: 'http://imgs.52jiaoshi.com/1540522047.png',
        bigimg: 'http://imgs.52jiaoshi.com/15350782965b7f6f98e2913.jpg'
      },
    ]
    that.setData({
      items:_items
    })
    that.data.animation1 = wx.createAnimation({
      duration: 1000, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });
    that.data.animation2 = wx.createAnimation({
      duration: 1000, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });
    that.data.animation3 = wx.createAnimation({
      duration: 1000, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });
    that.data.animation4 = wx.createAnimation({
      duration: 1000, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });
    that.data.animation6 = wx.createAnimation({
      duration: 1000, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });
    that.data.animation7 = wx.createAnimation({
      duration: 1000, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });
    that.data.animation8 = wx.createAnimation({
      duration: 1000, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });
    that.data.animation9 = wx.createAnimation({
      duration: 1000, // 以毫秒为单位         
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight,
          clientWidth: res.windowWidth
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '锦鲤护体，逢考必过，你试试',
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  ScaleBig1: function (e) {
    let that = this;
    let H = that.data.clientHeight;
    that.data.animation1.rotateY(360).step()
    that.data.animation1.translate(100, (H - 400)/2).scale(3, 4).step({ duration: 500 })
    that.setData({ 
      animation1: that.data.animation1.export(),
    })
    setTimeout(function(){
      that.setData({
        maskZindex:3
      })
    },1000)
  },
  ScaleBig2: function (e) {
    let that = this;
    let H = that.data.clientHeight;
    that.data.animation2.rotateY(360).step()
    that.data.animation2.translate(0, (H - 400) / 2).scale(3, 4).step({ duration: 500 })
    that.setData({
      animation2: that.data.animation2.export()
    })
    setTimeout(function () {
      that.setData({
        maskZindex: 3
      })
    }, 1000)
  },
  ScaleBig3: function (e) {
    let that = this;
    let H = that.data.clientHeight;
    that.data.animation3.rotateY(360).step()
    that.data.animation3.translate(-100, (H - 400) / 2).scale(3, 4).step({ duration: 500 })
    that.setData({
      animation3: that.data.animation3.export()
    })
    setTimeout(function () {
      that.setData({
        maskZindex: 3
      })
    }, 1000)
  },
  ScaleBig4: function (e) {
    let that = this;
    let H = that.data.clientHeight;
    that.data.animation4.rotateY(360).step()
    that.data.animation4.translate(100, -20).scale(3, 4).step({ duration: 500 })
    that.setData({
      animation4: that.data.animation4.export()
    })
    setTimeout(function () {
      that.setData({
        maskZindex: 3
      })
    }, 1000)
  },
  ScaleBig6: function (e) {
    let that = this;
    let H = that.data.clientHeight;
    that.data.animation6.rotateY(360).step()
    that.data.animation6.translate(-100, -20).scale(3, 4).step({ duration: 500 })
    that.setData({
      animation6: that.data.animation6.export()
    })
    setTimeout(function () {
      that.setData({
        maskZindex: 3
      })
    }, 1000)
  },
  ScaleBig7: function (e) {
    let that = this;
    let H = that.data.clientHeight;
    that.data.animation7.rotateY(360).step()
    that.data.animation7.translate(100, -165).scale(3, 4).step({ duration: 500 })
    that.setData({
      animation7: that.data.animation7.export()
    })
    setTimeout(function () {
      that.setData({
        maskZindex: 3
      })
    }, 1000)
  },
  ScaleBig8: function (e) {
    let that = this;
    let H = that.data.clientHeight;
    that.data.animation8.rotateY(360).step()
    that.data.animation8.translate(0, -165).scale(3, 4).step({ duration: 500 })
    that.setData({
      animation8: that.data.animation8.export()
    })
    setTimeout(function () {
      that.setData({
        maskZindex: 3
      })
    }, 1000)
  },
  ScaleBig9: function (e) {
    let that = this;
    let H = that.data.clientHeight;
    that.data.animation9.rotateY(360).step()
    that.data.animation9.translate(-100, -165).scale(3, 4).step({ duration: 500 })
    that.setData({
      animation9: that.data.animation9.export()
    })
    setTimeout(function () {
      that.setData({
        maskZindex: 3
      })
    }, 1000)
  },
  //图片加载完毕
  imgload: function (e) {
    let that = this;
    that.setData({
      showsection1:1
    })
  },
  startdraw:function(e){
    let that = this;
    that.setData({
      showsection2:1
    })
  },
  saveimg:function(e){
    let that = this;
    let fileimg = that.data.imgurl
    wx.getSetting({
      success(ss) {
        if (!ss.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.saveImageToPhotosAlbum({
                filePath: fileimg,
                success(ires) {
                  wx.showModal({
                    title: '提示',
                    content: '保存成功，赶快晒朋友圈吧！',
                    showCancel: false
                  })
                }
              })
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: fileimg,
            success(ires) {
              wx.showModal({
                title: '提示',
                content: '保存成功，赶快晒朋友圈吧！',
                showCancel: false
              })
            }
          })
        }
      }
    })
  },
  imageDown: function (url) {
    var that = this;
    var fileimg = '';
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        fileimg = res.tempFilePath;
        that.setData({
          imgurl: fileimg
        })
        
      }, fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '下载图片失败',
        })
      }
    })
  },
})
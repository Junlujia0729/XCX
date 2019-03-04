// pages/interviewscore.js

const app = getApp()
const userApi = require('../../libraries/user.js');
var WxParse = require('../../wxParse/wxParse.js');

// 语音播放
const innerAudioContext = wx.createInnerAudioContext();
const options = {
  duration: 600000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio_JGH: [],  //结构化1
    audio_JGH2: [], //结构化2
    audio_SJ: [], //试讲
    audio_DB: [], //答辩

    identity:2,
    header_img:'',
    nickname:'',
    id:1,
    score:'',
    playaudioIndex: -1,  //播放音频index值记录
    playaudioQIndex: -1,  //播放音频题目类型值记录

    wxcode: '6',
    maskshow: false,
    maskshow_JGH: false,
    JGH_1: false,
    JGH_2: false,

    canshare:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (app.globalData.nickname == "" || app.globalData.avatar == "") {
      that.setData({
        canshare:false
      })
    }
    var id =1;
    if (options.id){
      id = options.id;
      that.setData({
        id: options.id
      });
    }
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/teacher_score", {
      id: id
    }, function (res) {
      if (res.data.code == 200) {
        that.setData({
          score: res.data.data.data.score
        });
      }else{
        that.setData({
          score: 0
        });
      }
    });

    // 获取答题数据
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/interview_details", {
      id: id
    }, function (res) {
      console.log(res.data.data)
      var question_jgh1 = res.data.data.data.question_jgh1.title;
      var question_jgh2 = res.data.data.data.question_jgh2.title;
      var question_sj = res.data.data.data.question_sj.title;
      //题干
      WxParse.wxParse('question_jgh1', 'html', question_jgh1, that, 5);
      WxParse.wxParse('question_jgh2', 'html', question_jgh2, that, 5);
      WxParse.wxParse('question_sj', 'html', question_sj, that, 5);

      // 结构化1
      let _audio_JGH = res.data.data.data.question_jgh1.list;
      let _audio_JGH_q = {};
      _audio_JGH_q.audio_url = res.data.data.data.question_jgh1.audio_url;
      _audio_JGH_q.duration = res.data.data.data.question_jgh1.duration;
      _audio_JGH.unshift(_audio_JGH_q);

      for (var i = 0; i < _audio_JGH.length; i++) {
        _audio_JGH[i].playstate = 'pause';
        _audio_JGH[i].new_duration = formatTime(_audio_JGH[i].duration);
        if (i == 0) {
          _audio_JGH[i].play_img = 'http://imgs.52jiaoshi.com/1545012299.png';
        } else {
          _audio_JGH[i].play_img = 'http://imgs.52jiaoshi.com/1531100999.png';
        }
      }
      
      // 结构化2
      let _audio_JGH2 = res.data.data.data.question_jgh2.list;
      let _audio_JGH2_q = {};
      _audio_JGH2_q.audio_url = res.data.data.data.question_jgh2.audio_url;
      _audio_JGH2_q.duration = res.data.data.data.question_jgh2.duration;
      _audio_JGH2.unshift(_audio_JGH2_q);

      for (var i = 0; i < _audio_JGH2.length; i++) {
        _audio_JGH2[i].playstate = 'pause';
        _audio_JGH2[i].new_duration = formatTime(_audio_JGH2[i].duration);
        if (i == 0) {
          _audio_JGH2[i].play_img = 'http://imgs.52jiaoshi.com/1545012299.png';
        } else {
          _audio_JGH2[i].play_img = 'http://imgs.52jiaoshi.com/1531100999.png';
        }
      }

      // 试讲
      let _audio_SJ = res.data.data.data.question_sj.list;
      let _audio_SJ_q = {};
      _audio_SJ_q.audio_url = '';
      _audio_SJ_q.duration = '';
      _audio_SJ.unshift(_audio_SJ_q);

      for (var i = 0; i < _audio_SJ.length; i++) {
        _audio_SJ[i].playstate = 'pause';
        _audio_SJ[i].new_duration = formatTime(_audio_SJ[i].duration);
        if (i == 0) {
          _audio_SJ[i].play_img = 'http://imgs.52jiaoshi.com/1545012299.png';
        } else {
          _audio_SJ[i].play_img = 'http://imgs.52jiaoshi.com/1531100999.png';
        }
      }

      // 答辩
      let _audio_DB = res.data.data.data.question_db.list;
      let _audio_DB_q = {};
      _audio_DB_q.audio_url = res.data.data.data.question_db.audio_url;
      _audio_DB_q.duration = res.data.data.data.question_db.duration;
      _audio_DB.unshift(_audio_DB_q);

      for (var i = 0; i < _audio_DB.length; i++) {
        _audio_DB[i].playstate = 'pause';
        _audio_DB[i].new_duration = formatTime(_audio_JGH[i].duration);
        if (i == 0) {
          _audio_DB[i].play_img = 'http://imgs.52jiaoshi.com/1545012299.png';
        } else {
          _audio_DB[i].play_img = 'http://imgs.52jiaoshi.com/1531100999.png';
        }
      }
      console.log(_audio_JGH);
      console.log(_audio_JGH2);
      that.setData({
        identity: res.data.data.data.identity,
        audio_JGH: _audio_JGH,
        audio_JGH2: _audio_JGH2,
        audio_SJ: _audio_SJ,
        audio_DB: _audio_DB,
        header_img: res.data.data.data.user.avatar,
        nickname: res.data.data.data.user.nickname
      })
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
    let that = this;
    return {
      title: '快来帮我评分啦',
      path: '/pages/interviewdetail/interviewdetail?id=' + that.data.publicid,
      // imageUrl: 'http://www.52jiaoshi.com/download/52_green.jpg',
      success: function (res1) {

      },
      fail: function (res1) {
        // 转发失败
        //console.log(res1);
      }
    }
  },

  //语音播放
  audioPlay: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;    //音频index值
    var qindex = e.currentTarget.dataset.qindex;  //所属题目类型
    var time = parseInt(e.currentTarget.dataset.duration / 1000);
    var playstate_ = e.currentTarget.dataset.playstate;

    var _play_img;
    var _playstate;
    if (qindex == 1) {
      _play_img = 'audio_JGH[' + index + '].play_img';
      _playstate = 'audio_JGH[' + index + '].playstate';
    } else if (qindex == 2) {
      _play_img = 'audio_JGH2[' + index + '].play_img';
      _playstate = 'audio_JGH2[' + index + '].playstate';
    } else if (qindex == 3) {
      _play_img = 'audio_SJ[' + index + '].play_img';
      _playstate = 'audio_SJ[' + index + '].playstate';
    } else if (qindex == 4) {
      _play_img = 'audio_DB[' + index + '].play_img';
      _playstate = 'audio_DB[' + index + '].playstate';
    }
    if (playstate_ == 'pause') {
      //当前点击音频是暂停状态，要播放

      if (innerAudioContext.paused == false) {
        //当前有其他语音在播放

        var playstate1;
        var play_img1;
        var duration1;
        var new_duration1;
        //根据qindex 判断哪个题目
        if (that.data.playaudioQIndex == 1) {
          playstate1 = 'audio_JGH[' + that.data.playaudioIndex + '].playstate';
          play_img1 = 'audio_JGH[' + that.data.playaudioIndex + '].play_img';
          duration1 = that.data.audio_JGH[that.data.playaudioIndex].duration;
          new_duration1 = 'audio_JGH[' + that.data.playaudioIndex + '].new_duration';
        } else if (that.data.playaudioQIndex == 2) {
          playstate1 = 'audio_JGH2[' + that.data.playaudioIndex + '].playstate';
          play_img1 = 'audio_JGH2[' + that.data.playaudioIndex + '].play_img';
          duration1 = that.data.audio_JGH2[that.data.playaudioIndex].duration;
          new_duration1 = 'audio_JGH2[' + that.data.playaudioIndex + '].new_duration';
        } else if (that.data.playaudioQIndex == 3) {
          playstate1 = 'audio_SJ[' + that.data.playaudioIndex + '].playstate';
          play_img1 = 'audio_SJ[' + that.data.playaudioIndex + '].play_img';
          duration1 = that.data.audio_SJ[that.data.playaudioIndex].duration;
          new_duration1 = 'audio_SJ[' + that.data.playaudioIndex + '].new_duration';
        } else if (that.data.playaudioQIndex == 4) {
          playstate1 = 'audio_DB[' + that.data.playaudioIndex + '].playstate';
          play_img1 = 'audio_DB[' + that.data.playaudioIndex + '].play_img';
          duration1 = that.data.audio_DB[that.data.playaudioIndex].duration;
          new_duration1 = 'audio_DB[' + that.data.playaudioIndex + '].new_duration';
        }

        console.log(duration1);
        console.log(that.data.playaudioIndex);
        if (that.data.playaudioIndex == 0){
          that.setData({
            [play_img1]: 'http://imgs.52jiaoshi.com/1545012299.png',
            [playstate1]: 'pause',
            [new_duration1]: formatTime(duration1)
          })
        }else{
          that.setData({
            [play_img1]: 'http://imgs.52jiaoshi.com/1531100999.png',
            [playstate1]: 'pause',
            [new_duration1]: formatTime(duration1)
          })
        }
        
        innerAudioContext.stop();
      }

      if (index != that.data.playaudioIndex || qindex != that.data.playaudioQIndex) {
        innerAudioContext.src = e.currentTarget.dataset.audio;
      }
      innerAudioContext.play();
      console.log('播放');
      if (index == 0) {
        that.setData({
          [_play_img]: 'http://imgs.52jiaoshi.com/1545040258.png',
          [_playstate]: 'play',
          playaudioIndex: index,
          playaudioQIndex: qindex
        })
      } else {
        that.setData({
          [_play_img]: 'http://imgs.52jiaoshi.com/1531102717.gif',
          [_playstate]: 'play',
          playaudioIndex: index,
          playaudioQIndex: qindex
        })
      }
      
    } else {
      // 当前状态为播放  要暂停
      that.setData({
        [_play_img]: 'http://imgs.52jiaoshi.com/1531100999.png',
        [_playstate]: 'pause'
      })
      innerAudioContext.pause();
      console.log('暂停');
    }
    // 跟新播放进度 必须有onplay事件
    innerAudioContext.onPlay(function (res) {
      //console.log("play"); 
    });

    // 音频播放进度更新
    innerAudioContext.onTimeUpdate(function (res) {
      let currentTime = innerAudioContext.currentTime;

      if (qindex == 1) {
        var _new_duration = 'audio_JGH[' + index + '].new_duration';
      } else if (qindex == 2) {
        var _new_duration = 'audio_JGH2[' + index + '].new_duration';
      } else if (qindex == 3) {
        var _new_duration = 'audio_SJ[' + index + '].new_duration';
      } else if (qindex == 4) {
        var _new_duration = 'audio_DB[' + index + '].new_duration';
      }
      that.setData({
        [_new_duration]: formatTime(currentTime),
      })
    })

    innerAudioContext.onEnded(function (res) {
      innerAudioContext.seek(0); 
      if(index == 0){
        that.setData({
          [_play_img]: 'http://imgs.52jiaoshi.com/1545012299.png',
          [_playstate]: 'pause'
        })
      }else{
        that.setData({
          [_play_img]: 'http://imgs.52jiaoshi.com/1531100999.png',
          [_playstate]: 'pause'
        })
      }
      
    })
  },

  read: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (index == 1) {
      that.setData({
        maskshow_JGH: true,
        JGH_1: true
      })
    } else if (index == 2) {
      that.setData({
        maskshow_JGH: true,
        JGH_2: true
      })
    }

  },
  // 关闭
  close_jgh: function () {
    let that = this;
    that.setData({
      maskshow_JGH: false,
      JGH_1: false,
      JGH_2: false
    })
  },
  //
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
  onGetUserInfo: function (e) {
    let that = this;
    console.log(e);
    if (e.detail.errMsg == 'getUserInfo:fail user deny') {
      // 未授权
      that.setData({
        getuserinfo: false
      })
    } else {
      app.globalData.nickname = e.detail.userInfo.nickName;
      app.globalData.avatar = e.detail.userInfo.avatarUrl;

      userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/matrix_setUserInfo", {
        nickname: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl,
        gender: e.detail.userInfo.gender,
        city: e.detail.userInfo.city,
        province: e.detail.userInfo.province
      }, function (res2) {
        that.setData({
          canshare:true
        })
      });
    }
  }
})

function formatTime(seconds) {
  var min = ~~(seconds / 60)
  var sec = parseInt(seconds - min * 60)
  return ('00' + min).substr(-2) + ':' + ('00' + sec).substr(-2)
}
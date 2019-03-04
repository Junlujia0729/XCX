// pages/recorderManager.js
const app = getApp()
const userApi = require('../../libraries/user.js');
var WxParse = require('../../wxParse/wxParse.js');
// 录音
const recorderManager = wx.getRecorderManager();

// 语音播放
const innerAudioContext = wx.createInnerAudioContext();
var interval;
var timer;//定时器
const options = {
  duration: 600000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'mp3',
  frameSize: 50
}
//背景音乐播放
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio_JGH:[],  //结构化1
    audio_JGH2: [], //结构化2
    audio_SJ: [], //试讲
    audio_DB: [], //答辩
    audioArr: [], //导语及结构化语音题
    // 音频
    ap_progress: 0,
    duration: '600',
    state: 'stop',
    countDownMinute: '00',
    countDownSecond: '00',
    wave: 'http://imgs.52jiaoshi.com/1545027032.gif',
    play_img: 'http://imgs.52jiaoshi.com/1530841265.png',
    playaudioIndex:-1,  //播放音频index值记录
    playaudioQIndex: -1,  //播放音频题目类型值记录
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,

    datas:{},
    Q_countDownMinute: '00',
    Q_countDownSecond: '00',
    speed_1:'http://imgs.52jiaoshi.com/1544774208.png',
    speed_2: 'http://imgs.52jiaoshi.com/1544774667.png',
    flag:true,

    JGH_recording1:true,
    JGH_recording2:true,
    SJ_recording: true,
    DB_recording: true,

    publicid:'',
    uptoken: '',
    upurl: app.globalData.mainDomain + 'XcxApi/upload_qiniu?fieldname=file&token=',
    upload_picture_list: [],

    wxcode:'6',
    maskshow: false,
    maskshow_JGH:false,
    JGH_1:false,
    JGH_2: false,
    introduction:'',  // 面试导语
    isIphoneX: false,

    canshare: true
  },
  
  totalSecond1: '1200',// 准备时间
  totalSecond_jgh: '300',// 结构化答题时间
  totalSecond_sj: '600',// 试讲答题时间
  totalSecond_db: '300',// 答辩答题时间
  isrecordering: false, //监听是否在录音
  g_audiotype:0,
  TM_index:0,
  switchChange:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (app.globalData.nickname == "" || app.globalData.avatar == "") {
      that.setData({
        canshare: false
      })
    }
    that.setData({
      winWidth: app.globalData.systemInfo.windowWidth,
      winHeight: app.globalData.systemInfo.windowHeight
    });
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/upload_token", {}, function (res) {
      that.setData({
        uptoken: res.data.data.uptoken,
        upurl: app.globalData.mainDomain + 'XcxApi/upload_qiniu?fieldname=file&token=' + res.data.data.uptoken
      });
    });

    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/introduction", {
    }, function (res) {
      that.setData({
        introduction: res.data.data.introduction
      })
    });

    if (app.globalData.systemInfo.model && app.globalData.systemInfo.model.indexOf('iPhone X') > -1) {
      that.setData({ isIphoneX: true });
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
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },

  ct:function(){
    var that =this;
    wx.showLoading({
      title: '抽题中',
    })
    
    // 抽题 获取所有题目
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/extract_question", {
      appid: app.globalData.appid
    }, function (res) {
      
      var _datas = res.data.data.data;
      _datas.introducer[0].play_img = 'http://imgs.52jiaoshi.com/1545012299.png';
      _datas.introducer[0].play_state = 'pause';
      _datas.introducer[0].Q_type = '评委导语';
      _datas.introducer[0].new_duration = formatTime(_datas.introducer[0].time);
      _datas.introducer[0].progress = 0;
      _datas.question_jgh1.audio.play_img = 'http://imgs.52jiaoshi.com/1545012299.png';
      _datas.question_jgh1.audio.play_state = 'pause';
      _datas.question_jgh1.audio.Q_type = '结构化题目1';
      _datas.question_jgh1.audio.new_duration = formatTime(_datas.question_jgh1.audio.time);
      _datas.question_jgh1.audio.progress = 0;
      _datas.question_jgh2.audio.play_img = 'http://imgs.52jiaoshi.com/1545012299.png';
      _datas.question_jgh2.audio.play_state = 'pause';
      _datas.question_jgh2.audio.Q_type = '结构化题目2';
      _datas.question_jgh2.audio.new_duration = formatTime(_datas.question_jgh2.audio.time);
      _datas.question_jgh2.audio.progress = 0;
      _datas.question_sj.audio.play_img = 'http://imgs.52jiaoshi.com/1545200609.png';
      _datas.question_sj.audio.play_state = 'pause';
      _datas.question_sj.audio.new_duration = formatTime(_datas.question_sj.audio.time);

      var audioArr = [];
      audioArr.push(_datas.introducer[0]);
      audioArr.push(_datas.question_jgh1.audio);
      audioArr.push(_datas.question_jgh2.audio);
      console.log(audioArr);
      that.setData({
        datas: _datas,
        audioArr: audioArr,
        publicid: res.data.data.id
      });
      var question_jgh1 = res.data.data.data.question_jgh1.title;
      var question_jgh2 = res.data.data.data.question_jgh2.title;
      var question_sj = res.data.data.data.question_sj.title;
      var question_db = res.data.data.data.question_sj.audio.title;
      WxParse.wxParse('question_jgh1', 'html', question_jgh1, that, 5);
      WxParse.wxParse('question_jgh2', 'html', question_jgh2, that, 5);
      WxParse.wxParse('question_sj', 'html', question_sj, that, 5);
      WxParse.wxParse('question_db', 'html', question_db, that, 5);
      that.countDown(that.totalSecond1, 1);
      setTimeout(function () {
        wx.hideLoading({});
        that.setData({ currentTab: 1 });
      }, 800)
    }); 
  },
  /** 
   * 点击tab切换 
   */
  
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 1){
         
      }
      if (e.target.dataset.current == 2){
        that.autoplay();  
      }
      if (e.target.dataset.current == 3){
        that.countDown(that.totalSecond_jgh, 3);
        backgroundAudioManager.stop(); 
      }
      if (e.target.dataset.current == 4) {
        if (that.isrecordering){
          that.stoprecorder();
        }
        that.countDown(that.totalSecond_sj, 4);
      }
      if (e.target.dataset.current == 5) {
        if (that.isrecordering) {
          that.stoprecorder();
        }
        that.autopaly_q_db();
        that.countDown(that.totalSecond_db, 5);
      }
      if (e.target.dataset.current == 6){
        if (that.isrecordering) {
          that.stoprecorder();
        }
        that.endexam();
      }
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 开始录制
  start: function (e) {
    const that = this;
    console.log(e);
    var qindex = e.currentTarget.dataset.qindex;
    that.g_audiotype = e.currentTarget.dataset.qindex;
    if (qindex == 1){
      that.setData({
        JGH_recording1:false
      })
    } else if (qindex == 2){
      that.setData({
        JGH_recording2: false
      })
    } else if (qindex == 3) {
      that.setData({
        SJ_recording: false
      })
    } else if (qindex == 4) {
      that.setData({
        DB_recording: false
      })
    }
    recorderManager.start(options);
    recorderManager.onStart(() => {
      that.isrecordering = true;
    })
    //时间统计
    var totalSecond = 0;
    interval = setInterval(function () {
      // 秒数  
      var second = totalSecond;

      // 分钟位  
      var min = Math.floor((second) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      that.setData({
        totalSecond: totalSecond,
        countDownMinute: minStr,
        countDownSecond: secStr
      });
      totalSecond++;
      if (totalSecond < 0) {
        clearInterval(interval);
        //设置结束
        that.setData({
          totalSecond: totalSecond,
          countDownMinute: '00',
          countDownSecond: '00'
        });
      }
    }.bind(this), 1000);
    
  },


  // 停止录音
  stop: function (e) {
    const that = this;
    recorderManager.stop();
    clearInterval(interval);
    that.isrecordering = false;
    that.setData({
      state: 'stop',
      countDownMinute: '00',
      countDownSecond: '00'
    })
    var qindex = e.currentTarget.dataset.qindex;
    if (qindex == 1) {
      that.setData({
        JGH_recording1: true
      })
    } else if (qindex == 2){
      that.setData({
        JGH_recording2: true
      })
    } else if (qindex == 3) {
      that.setData({
        SJ_recording: true
      })
    }
    recorderManager.onStop(function (res) {
      let _new_count = formatTime(res.duration / 1000);
      let audioData = {};
      audioData.audio_url = res.tempFilePath;
      audioData.duration = res.duration;
      audioData.playstate = 'pause';
      audioData.new_duration = _new_count;
      audioData.play_img = 'http://imgs.52jiaoshi.com/1531100999.png';

      that.subaudio(qindex, res.tempFilePath, res.duration, audioData);

    });
  },

  stoprecorder: function (){
    console.log('停止录音并上传')
    const that = this;
    recorderManager.stop();
    clearInterval(interval);
    that.isrecordering = false;
    that.setData({
      state: 'stop',
      countDownMinute: '00',
      countDownSecond: '00'
    });
    recorderManager.onStop(function (res) {
      let _new_count = formatTime(res.duration / 1000);
      let audioData = {};
      audioData.audio_url = res.tempFilePath;
      audioData.duration = res.duration;
      audioData.playstate = 'pause';
      audioData.new_duration = _new_count;
      audioData.play_img = 'http://imgs.52jiaoshi.com/1531100999.png';

      that.subaudio(that.g_audiotype, res.tempFilePath, res.duration, audioData);

    });
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
    if (playstate_ == 'pause'){
      //当前点击音频是暂停状态，要播放

      if (innerAudioContext.paused == false){
        //当前有其他语音在播放
        
        var playstate1;
        var play_img1;
        var duration1;
        var new_duration1;
        //根据qindex 判断哪个题目
        if (that.data.playaudioQIndex == 1){
          playstate1 = 'audio_JGH[' + that.data.playaudioIndex + '].playstate';
          play_img1 = 'audio_JGH[' + that.data.playaudioIndex + '].play_img';
          duration1 = that.data.audio_JGH[that.data.playaudioIndex].duration;
          new_duration1 = 'audio_JGH[' + that.data.playaudioIndex + '].new_duration';
        } else if (that.data.playaudioQIndex == 2){
          playstate1 = 'audio_JGH2[' + that.data.playaudioIndex + '].playstate';
          play_img1 = 'audio_JGH2[' + that.data.playaudioIndex + '].play_img';
          duration1 = that.data.audio_JGH2[that.data.playaudioIndex].duration;
          new_duration1 = 'audio_JGH2[' + that.data.playaudioIndex + '].new_duration';
        } else if (that.data.playaudioQIndex == 3){
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
        that.setData({
          [play_img1]: 'http://imgs.52jiaoshi.com/1531100999.png',
          [playstate1]: 'pause',
          [new_duration1]: formatTime(duration1 / 1000)
        })
        innerAudioContext.stop();
      }

      if (index != that.data.playaudioIndex || qindex != that.data.playaudioQIndex) {
        innerAudioContext.src = e.currentTarget.dataset.audio;
      }
      innerAudioContext.play();
      console.log('播放');
      that.setData({
        [_play_img]: 'http://imgs.52jiaoshi.com/1531102717.gif',
        [_playstate]: 'play',
        playaudioIndex: index,
        playaudioQIndex:qindex
      })
    }else{
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
      that.setData({
        [_play_img]: 'http://imgs.52jiaoshi.com/1531100999.png',
        [_playstate]: 'pause'
      })
    })
  },

  play_T:function(e){
    var that = this;
    var audio = e.currentTarget.dataset.audio; 
    var index = e.currentTarget.dataset.index;    //音频index值
    var time = parseInt(e.currentTarget.dataset.duration / 1000);
    var playstate_ = e.currentTarget.dataset.playstate; 

    var _play_img = 'audioArr[' + index + '].play_img';
    var _new_duration = 'audioArr[' + index + '].new_duration';
    var _progress = 'audioArr[' + index + '].progress';
    var _playstate = 'audioArr[' + index + '].play_state';

    if (playstate_ == 'pause'){
      if (that.TM_index != index){
        console.log(that.data.audioArr[that.TM_index].new_duration);
        var _play_img_1 = 'audioArr[' + that.TM_index + '].play_img';
        var _new_duration_1 = 'audioArr[' + that.TM_index + '].new_duration';
        var _progress_1 = 'audioArr[' + that.TM_index + '].progress';
        var _playstate_1 = 'audioArr[' + that.TM_index + '].play_state';
        that.setData({
          [_play_img_1]: 'http://imgs.52jiaoshi.com/1545012299.png',
          [_playstate_1]: 'pause',
          [_new_duration_1]: formatTime(that.data.audioArr[that.TM_index].time),
          [_progress_1]:0
        })

        backgroundAudioManager.src = audio; // 设置了 src 之后会自动播放
        backgroundAudioManager.title = '导语';
        that.TM_index = index;
        that.setData({
          [_play_img]: 'http://imgs.52jiaoshi.com/1545040258.png',
          [_playstate]: 'play'
        })
        backgroundAudioManager.onEnded(function () {
          that.setData({
            [_play_img]: 'http://imgs.52jiaoshi.com/1545012299.png',
            [_new_duration]: that.data.audioArr[index].new_duration,
            [_progress]: 100,
            [_playstate]: 'pause'
          })
        });

        // 音频播放进度更新
        backgroundAudioManager.onTimeUpdate(function (res) {
          var currentTime = backgroundAudioManager.currentTime;
          var duration = backgroundAudioManager.duration;
          var progress = parseInt((currentTime / duration) * 100);
          _new_duration = 'audioArr[' + index + '].new_duration';
          _progress = 'audioArr[' + index + '].progress';
          that.setData({
            [_new_duration]: formatTime(currentTime),
            [_progress]: progress
          })
        })
      }else{
        backgroundAudioManager.play();
        that.TM_index = index;
        that.setData({
          [_play_img]: 'http://imgs.52jiaoshi.com/1545040258.png',
          [_playstate]: 'play'
        })
      }
    }else{
      backgroundAudioManager.pause();
      console.log('暂停');
      that.setData({
        [_play_img]: 'http://imgs.52jiaoshi.com/1545012299.png',
        [_playstate]: 'pause'
      })
    }
  },

  //进度条拖动事件
  handleTouchEnd: function (e) {
    console.log(e);
    var that = this;
    var x = e.detail.value;
    var time = e.currentTarget.dataset.time;

    var progress = parseInt(time * x / 100);
    that.setData({
      ap_progress: x
    });
    innerAudioContext.seek(progress); 
  },

  // 答题倒计时
  countDown: function (totalSecond,pageindex) {
    let that = this;
    //设置结束
    that.setData({
      Q_countDownMinute: '00',
      Q_countDownSecond: '00'
    });
    clearInterval(timer);
    //时间统计
    timer= setInterval(function () {
      // 秒数  
      var second = totalSecond;
      // 分钟位  
      var min = Math.floor((second) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      that.setData({
        Q_countDownMinute: minStr,
        Q_countDownSecond: secStr
      });
      totalSecond--;
      if (totalSecond <= 0) {
        clearInterval(timer);
        //设置结束
        that.setData({
          Q_countDownMinute: '00',
          Q_countDownSecond: '00',
          currentTab: pageindex + 1
        });
        if (pageindex == 1){
          // 自动播放导语及结构化题
          that.autoplay();
        }
        if (pageindex == 3) {
          // 结构化倒计时
          //如果当前有录音 停止 并上传
          if (that.isrecordering) {
            that.stoprecorder();
          }
        }
        if (pageindex == 4){
          // 试讲倒计时
          // 自动播放答辩题目
          that.autopaly_q_db();
          if (that.isrecordering) {
            that.stoprecorder();
          }
        }
        if (pageindex == 5){
          // 答辩倒计时
          that.endexam();
          if (that.isrecordering) {
            that.stoprecorder();
          }
        }
      }
    }, 1000)
  },

  // switch开关
  switchChange: function (e) {
    let that =this;
    if (e.detail.value) {
      that.switchChange = 1;
    } else {
      that.switchChange = 0;
    }
  },

  stopTouchMove: function () {
    return false;
  },

  // 上传音频
  subaudio: function (questiontype, audio, audio_duration, audioData){
    wx.showLoading({
      title: '上传中',
    })
    var that = this;
    var upload_task = wx.uploadFile({
      url: that.data.upurl, //需要用HTTPS，同时在微信公众平台后台添加服务器地址
      filePath: audio,//上传的文件本地地址
      name: 'file',
      formData: { 'path': 'wxchat' },//附近数据，这里为路径
      success: function (res) {
        var data = JSON.parse(res.data) //字符串转化为JSON
        var _audio = data.data.key
        userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/upload_audio", {
          type: questiontype, id: that.data.publicid, audio: _audio, time: audio_duration
        }, function (res) {
          console.log('上传成功');
          wx.hideLoading();
          if (questiontype == 1) {
            let _audio_JGH = that.data.audio_JGH;
            _audio_JGH.push(audioData);
            that.setData({
              audio_JGH: _audio_JGH,
              JGH_recording1: true
            })
          } else if (questiontype == 2) {
            let _audio_JGH2 = that.data.audio_JGH2;
            _audio_JGH2.push(audioData);
            that.setData({
              audio_JGH2: _audio_JGH2,
              JGH_recording2: true
            })
          } else if (questiontype == 3) {
            var _audio_SJ = that.data.audio_SJ;
            _audio_SJ.push(audioData);
            that.setData({
              audio_SJ: _audio_SJ,
              SJ_recording: true
            })
          } else if (questiontype == 4) {
            var _audio_DB = that.data.audio_DB;
            _audio_DB.push(audioData);
            that.setData({
              audio_DB: _audio_DB,
              DB_recording: true
            })
          } 
        });
      }
    }) 
  },
  autoplay:function(){
    //导语 结构化两道题 自动播放
    var that = this;
    var aindex = 0;
    backgroundAudioManager.src = that.data.audioArr[aindex].audio; // 设置了 src 之后会自动播放
    backgroundAudioManager.title = '导语';
    var _play_img = 'audioArr[' + aindex + '].play_img';
    var _new_duration = 'audioArr[' + aindex + '].new_duration';
    var _progress = 'audioArr[' + aindex + '].progress';
    var _playstate = 'audioArr[' + aindex + '].play_state';
    that.setData({
      [_play_img]: 'http://imgs.52jiaoshi.com/1545040258.png',
      [_playstate]:'play'
    })
    
    backgroundAudioManager.onEnded(function () {
      that.setData({
        [_play_img]: 'http://imgs.52jiaoshi.com/1545012299.png',
        [_new_duration]: that.data.audioArr[aindex].new_duration,
        [_progress]: 100,
        [_playstate]: 'pause'
      })
      aindex++;
      if (aindex <= 2) {
        backgroundAudioManager.src = that.data.audioArr[aindex].audio;
        _play_img = 'audioArr[' + aindex + '].play_img';
        that.setData({
          [_play_img]: 'http://imgs.52jiaoshi.com/1545040258.png',
          [_playstate]: 'play'
        })
      } else {
        if (that.switchChange){
          that.setData({
            currentTab: 3
          })
          backgroundAudioManager.stop();
          that.countDown(that.totalSecond_jgh, 2);
        }
      }
    });

    // 音频播放进度更新
    backgroundAudioManager.onTimeUpdate(function (res) {
      var currentTime = backgroundAudioManager.currentTime;
      var duration = backgroundAudioManager.duration;
      var progress = parseInt((currentTime / duration) * 100);
      _new_duration = 'audioArr[' + aindex + '].new_duration';
      _progress = 'audioArr[' + aindex + '].progress';
      that.setData({
        [_new_duration]: formatTime(currentTime),
        [_progress]: progress
      })
      that.TM_index = aindex;
    })
  },
  //
  askteacher:function(){
    let that = this;
    that.setData({
      maskshow: true
    })
  },
  // 复制微信号
  copy:function(){
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
  close:function(){
    let that = this;
    that.setData({
      maskshow: false
    })
  },
  read:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    if (index == 1){
      that.setData({
        maskshow_JGH: true,
        JGH_1: true
      })
    } else if (index == 2){
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

  autopaly_q_db:function(){
    let that = this;
    innerAudioContext.src = that.data.datas.question_sj.audio.audio;
    innerAudioContext.play();
    let db_playimg = 'datas.question_sj.audio.play_img';
    that.setData({
      [db_playimg]: 'http://imgs.52jiaoshi.com/1545211665.gif'
    })
    // 跟新播放进度 必须有onplay事件
    innerAudioContext.onPlay(function (res) {
      //console.log("play"); 
    });

    // 音频播放进度更新
    innerAudioContext.onTimeUpdate(function (res) {
      let currentTime = innerAudioContext.currentTime;
      let _db_new_duration = 'datas.question_sj.audio.new_duration';

      that.setData({
        [_db_new_duration]: formatTime(currentTime),
      })
    })

    innerAudioContext.onEnded(function (res) {
      innerAudioContext.seek(0);
      let _db_new_duration = 'datas.question_sj.audio.new_duration';
      let _db_duration = 'datas.question_sj.audio.duration';
      that.setData({
        [db_playimg]: 'http://imgs.52jiaoshi.com/1545200609.png',
        [_db_duration]: formatTime(_db_duration),
      })
    })
  },
  godetail:function(){
    let that =this;
    wx.redirectTo({
      url: '../interviewdetail/interviewdetail?id='+that.data.publicid,
    })
  },
  endexam:function(){
    let that = this;
    userApi.requestAppApi_POST(app.globalData.mainDomain + "XcxApi/interview_complete", {
      id: that.data.publicid
    }, function (res) {

    });
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
          canshare: true
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

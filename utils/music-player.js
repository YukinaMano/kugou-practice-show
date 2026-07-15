// 注意禁止使用私有变量，防止ref错误
export class MusicPlayer {
  Audio = null;
  isInit = false;
  funcInitDefault = null;
  getInitialState = _ => ({
    // 歌曲控制
    musicList: [],              // 音乐列表
    nowMusicIndex: 0,           // 当前播放音乐索引
    nowMusicInfo: {             // 当前播放音乐信息
      mId: 0,                     // 歌曲唯一标识
      mTitle: "",                 // 歌曲标题
      mSinger: "",                // 歌曲歌手
      mPictureUrl: "",            // 封面图片地址
      mMusicUrl: "",              // 音频文件地址
      mLyricUrl: "",              // 歌词文件地址
    },
    // 歌词控制
    lyricText: "",              // 歌词文本
    lyricLines: [],             // 歌词行数组
    // 播放控制
    isAutoPlay: true,           // 是否自动播放
    isPause: true,              // 是否暂停
    volume: 0.1,                // 音量 0~1
    duration: 0,                // 当前音乐总时长，秒
    skipMode: 0,                // 播放模式 0-顺序播放 1-随机播放 2-单曲循环
  });
  loadInitialState = () => {
    Object.assign(this, this.getInitialState());
  };

  constructor(funcInitDefault) {
    this.loadInitialState();
    this.Audio = uni.createInnerAudioContext();
    this.Audio.volume = this.volume;
    this.Audio.playbackRate = 1.0;
    this.funcInitDefault = funcInitDefault;
    // 生成监听器
    this.onPlaying = (callback) => {
      this.Audio.onTimeUpdate(callback);
    };
    this.onCanplay = (callback) => {
      this.Audio.onCanplay(callback);
    };
    this.Audio.onCanplay(() => {
      this.duration = this.Audio.duration;
      // #ifdef APP-PLUS
      // @AC#>: APP-PLUS平台下，无法获取音乐时长，随机生成
      this.duration = this.duration || (Math.floor(Math.random() * 71) + 210);
      // #endif
    })
  }
  async _initDefaultMusic() {
    if (!this.isInit) {
      this.isInit = true;
      const defaultMusicList = await this.funcInitDefault();
      this.loadMusicList(defaultMusicList);
      return defaultMusicList;
    }
    return;
  }
  /**
   * 载入播放音乐列表
   * @param {array} musicList - 音乐列表
   * 每个元素都包含以下属性：
   * - mId: number   // 唯一标识
   * - mTitle: string   // 歌曲标题
   * - mSinger: string  // 歌手
   * - mPictureUrl: string (URL.href) // 封面图片地址
   * - mMusicUrl: string (URL.href)   // 音频文件地址
   * - mLyricUrl: string (URL.href)   // 歌词文件地址
   */
  loadMusicList(musicList) {
    this.nowMusicIndex = 0;
    this.doPause();
    Object.assign(this.musicList, musicList);
    this._loadMusicInfo();
    // @AC#>: 注意h5平台因浏览器限制需要手动触发播放，其异常无法被try-catch和Promise捕获
    // #ifndef H5
    this.isAutoPlay && this.doPlay();
    // #endif
    console.debug("[Player] 载入音乐列表", this.musicList);
  }
  /**
   * 载入当前播放音乐信息
   * @param {number} index - 指定音乐索引
   */
  async _loadMusicInfo(index = 0) {
    if (0 <= index < this.musicList.length) {
      this.nowMusicIndex = index;
      Object.assign(this.nowMusicInfo, this.musicList[this.nowMusicIndex]);
      this.Audio.src = this.nowMusicInfo.mMusicUrl;
      await this._loadLyricSrc(this.nowMusicInfo.mLyricUrl);
      console.debug("[Player] 载入音乐信息", this.nowMusicInfo);
    } else {
      console.log("[Player] 索引错误");
    }
  }
  /**
   * 载入当前播放歌词信息
   * @param {string} lyricUrl - 歌词文件地址
   */
  async _loadLyricSrc(lyricUrl) {
    // #ifdef H5
    if (process.env.NODE_ENV === "development") {
      try {
        lyricUrl = new URL(lyricUrl).pathname;
      } catch (e) { }
    }
    // #endif
    return new Promise((resolve) => {
      uni.request({
        url: lyricUrl,
        method: "GET",
        responseType: "arraybuffer",
        success: (res) => {
          console.debug("[Player] 成功获取歌词文件", res);
          let text = "";
          if (res.data instanceof ArrayBuffer) {
            const uint8 = new Uint8Array(res.data);
            try {
              text = new TextDecoder("gbk").decode(uint8);
            } catch (e) {
              text = new TextDecoder("utf-8").decode(uint8);
            }
          } else if (typeof res.data === "string") {
            text = res.data;
          } else if (typeof res === "string") {
            text = res;
          } else {
            text = String(res.data || "");
          }
          this.lyricLines = this.parseLRC(text);
          this.lyricText = text;
          console.debug("[Player] 获取到歌词", this.lyricLines);
          resolve();
        },
        fail: (err) => {
          console.error("[Player] 获取歌词失败", err);
          resolve();
        },
      });
    });
  }
  /**
   * 获取当前播放音乐的专辑封面url
   * @returns {string} 专辑封面url
   */
  getAlbumCoverUrl() {
    return this.nowMusicInfo.mPictureUrl;
  }
  /**
   * 设置可以播放时触发的事件
   * @param {function} event - 事件回调函数
   */
  onCanPlaying(event) {
    this.Audio.onCanplay(event);
  }
  onMusicEnded(event) {
    this.Audio.onEnded(event);
  }
  /**
   * 播放当前音乐
   */
  doPlay() {
    this.Audio.play();
    this.isPause = false;
    console.debug("[Player] 播放");
  }
  /**
   * 暂停当前音乐
   */
  doPause() {
    this.Audio.pause();
    this.isPause = true;
    console.debug("[Player] 暂停");
  }
  /**
   * 切换当前音乐播放状态（播放/暂停）
   * @returns {boolean} 当前是否暂停
   */
  doToggle() {
    this.isPause ? this.doPlay() : this.doPause();
    return this.isPause;
  }
  /**
   * 播放下一首音乐
   * @returns {object} 包含当前音乐索引和暂停状态的对象
   */
  toNextMusic() {
    this._doSkipMusic();
    return {
      index: this.nowMusicIndex,
      isPause: this.isPause,
    };
  }
  /**
   * 播放上一首音乐
   * @returns {object} 包含当前音乐索引和暂停状态的对象
   */
  toLastMusic() {
    const l = this.musicList.length;
    this._loadMusicInfo((this.nowMusicIndex + l - 1) % l);
    console.debug("[Player] 切换上一首歌曲 " + this.nowMusicIndex);
    return {
      index: this.nowMusicIndex,
      isPause: this.isPause,
    };
  }
  /**
   * 切换播放模式
   * @returns {number} 当前播放模式
   */
  doSwitchSkipMode() {
    this.skipMode = (this.skipMode + 1) % 3;
    console.debug("[Player] 切换播放模式到 " + this.skipMode);
    return this.skipMode;
  }
  /** 获取当前音乐列表
   * @returns {array} 当前音乐列表
   */
  getList() {
    return this.musicList;
  }
  /** 获取当前播放状态
   * @returns {boolean} 当前是否暂停
   */
  getPaused() {
    return this.isPause;
  }
  /** 获取当前音乐时长
   * @returns {number} 当前音乐时长（秒）
   */
  getDuration() {
    return this.duration;
  }
  /** 获取当前播放时间
   * @returns {number} 当前播放时间（秒）
   */
  getCurrentTime() {
    return this.Audio.currentTime;
  }
  /** 获取当前播放进度
   * @returns {number} 当前播放进度（0~100）
   */
  getLoading() {
    return (this.getCurrentTime() / this.getDuration()) * 100;
  }

  /** 解析歌词文本
   * @param {string} lrcText - 歌词文本
   * @returns {array} 解析后的歌词数组
   * 每个元素包含以下属性：
   * - time: number  // 时间，单位毫秒
   * - text: string  // 歌词文本
   */
  parseLRC(lrcText) {
    const lines = lrcText.split("\n");
    const result = [];
    const timeReg = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;

    for (const line of lines) {
      const match = timeReg.exec(line);
      if (match) {
        const min = parseInt(match[1]);
        const sec = parseInt(match[2]);
        const ms = match[3] ? parseInt(match[3].padEnd(3, "0")) : 0;
        const time = min * 60 * 1000 + sec * 1000 + ms; // 毫秒
        const text = line.replace(timeReg, "").trim();
        if (text.length > 0) {
          result.push({ time, text });
        }
      }
    }
    return result;
  }
  /**
   * 根据 skipMode 切换歌曲：
   * 0 - 顺序播放下一首
   * 1 - 随机播放（不与当前重复）
   * 2 - 重播当前歌曲
   */
  async _doSkipMusic() {
    const total = this.musicList.length;
    if (total === 0) return;

    if (this.skipMode === 0) {
      // 顺序播放
      const nextIndex = (this.nowMusicIndex + 1) % total;
      await this._loadMusicInfo(nextIndex);
      console.debug("[Player] 顺序播放下一首歌曲 " + this.nowMusicIndex);
    } else if (this.skipMode === 1) {
      // 随机播放（避免重复当前）
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * total);
      } while (nextIndex === this.nowMusicIndex && total > 1);
      await this._loadMusicInfo(nextIndex);
      console.debug("[Player] 随机播放下一首歌曲 " + this.nowMusicIndex);
    } else if (this.skipMode === 2) {
      // 重播当前歌曲
      this.Audio.seek(0);
      console.debug("[Player] 重播当前歌曲 " + this.nowMusicIndex);
    }
    this.isAutoPlay && this.doPlay();
  }

  resetPlayerState() {
    this.doPause();
    this.loadInitialState();
    this.Audio.src = '';
    this.isInit = false;
  }
}

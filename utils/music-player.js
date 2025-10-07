// 注意禁止使用私有变量，防止ref错误
export class MusicPlayer {
  Audio = null;
  isAutoPlay = true;
  isPause = true;
  musicList = [];
  nowMusicInfo = {
    mId: 0,           // 唯一标识
    mTitle: '',        // 歌曲标题
    mSinger: '',       // 歌手
    mPictureUrl: '',   // 封面图片地址
    mMusicUrl: '',     // 音频文件地址
    mLyricUrl: '',     // 歌词文件地址
  };
  lyricLines = [];  // 歌词行数组
  lyricText = '';
  nowMusicIndex = 0;
  volume = 0.1;  // 音量 0~1
  duration = 0;  // 当前音乐总时长，秒
  skipMode = 0;  // 播放模式 0-顺序播放 1-随机播放 2-单曲循环

  constructor() {
    // 箭头声明，防止this指向错误
    // 播放进度更新时触发
    this.Audio = uni.createInnerAudioContext();
    this.Audio.volume = this.volume;
    this.onPlaying = (callback) => {
      this.Audio.onTimeUpdate(callback);
    }
    this.Audio.playbackRate = 2.0;

    this.Audio.onCanplay(() => {
      this.duration = this.Audio.duration;
    });
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
    this.isPause = true;
    Object.assign(this.musicList, musicList);
    this._loadMusicInfo();
    console.debug('load music list', this.musicList);
  }
  /**
   * 载入当前播放音乐信息
   * @param {number} index - 指定音乐索引
   */
  async _loadMusicInfo(index = 0) {
    if (0 <= index < this.musicList.length) {
      this.doPause();
      this.nowMusicIndex = index;
      Object.assign(this.nowMusicInfo, this.musicList[this.nowMusicIndex])
      this.Audio.src = this.nowMusicInfo.mMusicUrl;
      await this._loadLyricSrc(this.nowMusicInfo.mLyricUrl);
      if (this.isAutoPlay) {
        this.doPlay();
      }
      console.debug('load music info', this.nowMusicInfo);
    }
    else {
      console.log('索引错误');
    }
  }
  /**
   * 载入当前播放歌词信息
   * @param {string} lyricUrl - 歌词文件地址
   */
  async _loadLyricSrc(lyricUrl) {
    const res = await fetch(lyricUrl);
    const buffer = await res.arrayBuffer();
    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(buffer);
    this.lyricLines = this.parseLRC(text);
    this.lyricText = text;
    console.debug('load lyric', this.lyricLines);
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
    this.isPause = false;
    this.Audio.play();
    console.debug('play');
  }
  /**
   * 暂停当前音乐
   */
  doPause() {
    this.isPause = true;
    this.Audio.pause();
    console.debug('pause');
  }
  /**
   * 切换当前音乐播放状态（播放/暂停）
   * @returns {boolean} 当前是否暂停
   */
  doToggle() {
    this.isPause ? this.doPlay() : this.doPause()
    return this.isPause
  }
  /**
   * 播放下一首音乐
   * @returns {object} 包含当前音乐索引和暂停状态的对象
   */
  toNextMusic() {
    this._doSkipMusic();
    console.debug('check to next song ' + this.nowMusicIndex)
    return {
      index: this.nowMusicIndex,
      isPause: this.isPause
    }
  }
  /**
   * 播放上一首音乐
   * @returns {object} 包含当前音乐索引和暂停状态的对象
   */
  toLastMusic() {
    const l = this.musicList.length;
    this._loadMusicInfo((this.nowMusicIndex + l - 1) % l);
    console.debug('check to last song ' + this.nowMusicIndex)
    return {
      index: this.nowMusicIndex,
      isPause: this.isPause
    }
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
  /** 获取当前播放进度
   * @returns {number} 当前播放进度（0~100）
   */
  getLoading() {
    return (this.Audio.currentTime / this.Audio.duration) * 100;
  }
  /** 获取当前播放时间
   * @returns {number} 当前播放时间（秒）
   */
  getCurrentTime() {
    return this.Audio.currentTime;
  }
  /** 解析歌词文本
   * @param {string} lrcText - 歌词文本
   * @returns {array} 解析后的歌词数组
   * 每个元素包含以下属性：
   * - time: number  // 时间，单位毫秒
   * - text: string  // 歌词文本
   */
  parseLRC(lrcText) {
    const lines = lrcText.split('\n');
    const result = [];
    const timeReg = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;

    for (const line of lines) {
      const match = timeReg.exec(line);
      if (match) {
        const min = parseInt(match[1]);
        const sec = parseInt(match[2]);
        const ms = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0;
        const time = min * 60 * 1000 + sec * 1000 + ms; // 毫秒
        const text = line.replace(timeReg, '').trim();
        result.push({ time, text });
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
  _doSkipMusic() {
    const total = this.musicList.length;
    if (total === 0) return;

    if (this.skipMode === 0) {
      // 顺序播放
      const nextIndex = (this.nowMusicIndex + 1) % total;
      this._loadMusicInfo(nextIndex);
    }
    else if (this.skipMode === 1) {
      // 随机播放（避免重复当前）
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * total);
      } while (nextIndex === this.nowMusicIndex && total > 1);
      this._loadMusicInfo(nextIndex);
    }
    else if (this.skipMode === 2) {
      // 重播当前歌曲
      this.Audio.seek(0);
      if (this.isAutoPlay) {
        this.doPause();
        this.doPlay();
      }
      console.log(`🔁 重播当前歌曲: ${this.nowMusicInfo.mTitle}`);
    }
  }
}
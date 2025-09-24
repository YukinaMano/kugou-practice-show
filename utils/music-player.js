export class MusicPlayer {
  // 禁用autoplay，自己调用play()方法
  constructor() {
    this.musicList = [];
    this.nowMusicInfo = {};
    this.index = 0;
    this.ispause = true;
    this.Audio = uni.createInnerAudioContext();
    this.lyricText = '';
    this.lyricLines = [];
    this.volume = 0.2;
    this.Audio.volume = this.volume;
    this.duration = 0
    
    this.Audio.onCanplay(()=>{
      this.duration = this.Audio.duration;
    });
  }
  /**
   * 载入播放音乐列表
   * @param {list} musicList - 音乐列表
   * 每个元素都包含以下属性：
   * - mId: number   // 唯一标识
   * - mTitle: string   // 歌曲标题
   * - mSinger: string  // 歌手
   * - mPictureUrl: string (URL.href) // 封面图片地址
   * - mMusicUrl: string (URL.href)   // 音频文件地址
   * - mLyricUrl: string (URL.href)   // 歌词文件地址
   */
  loadMusicList(musicList) {
    this.index = 0;
    this.ispause = true;
    Object.assign(this.musicList, musicList);
    this.isAutoPlay = false;
    this.loadMusicInfo();
  }
  /**
   * 载入当前播放音乐信息
   * @param {number} index - 指定音乐索引
   */
  loadMusicInfo(index=0, isAutoPlay=false){
    if(0 <= index < this.musicList.length){
      this.pause();
      this.index = index;
      Object.assign(this.nowMusicInfo, this.musicList[this.index]);
      this.Audio.src = this.nowMusicInfo.mMusicUrl;
      this._loadLyricSrc(this.nowMusicInfo.mLyricUrl);
      if(this.isAutoPlay){
        this.play();
      }
    }
    else{
      console.log('索引错误');
    }
  }
  
  // 加载歌词文件
  async _loadLyricSrc(lyricUrl) {
    const res = await fetch(lyricUrl);
    const buffer = await res.arrayBuffer();
    // 指定 gbk 解码
    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(buffer);
    this.lyricLines = this.parseLRC(text);
    this.lyricText = text;
    return text;
  }
  
  // 获取专辑封面url
  getAlbumCoverUrl() {
    return this.nowMusicInfo.mPictureUrl;
  }
  
  // 设置播放时触发的事件
  onPlaying(event){
    this.Audio.onTimeUpdate(event);
  }
  
  // 设置可以播放时触发的事件
  onCanPlaying(event){
    this.Audio.onCanplay(event);
  }
  
  play(){
    this.ispause = false;
    this.Audio.play();
    console.log('play');
  }
  pause(){
    this.ispause = true;
    this.Audio.pause();
    console.log('pause');
  }
  toggle() {
    this.ispause ? this.play() : this.pause()
    return this.ispause
  }

  // isAutoPlay: 切歌是否自动播放
  toNextMusic(isAutoPlay=false){
    const l = this.musicList.length;
    this.loadMusicInfo((this.index+1) % l, isAutoPlay);
    console.debug('check to next song '+ this.index)
    return {
      index: this.index,
      ispause: this.ispause
    }
  }
  
  toLastMusic(isAutoPlay=false){
    const l = this.musicList.length;
    this.loadMusicInfo((this.index+l-1) % l, isAutoPlay);
  }
  
  getList(){
    return this.musicList;
  }
  
  getPaused(){
    return this.ispause;
  }
  
  getLoading(){
    return (this.Audio.currentTime/this.Audio.duration)*100;
  }
  
  getCurrentTime(){
    return this.Audio.currentTime;
  }
  
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



}
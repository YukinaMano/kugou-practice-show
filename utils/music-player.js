export class MusicPlayer {
  // 禁用autoplay，自己调用play()方法
  constructor() {
    this.musiclist = [];
    this.index = 0;
    this.ispause = true;
    this.Audio = uni.createInnerAudioContext();
    this.lyricSrc = '';
  }
  
  initList(list) {
    this.index = 0;
    this.ispause = true;
    this.musiclist = list;
    this.isAutoPlay = true;
    this.Audio.src = this.musiclist[this.index].mMusicUrl;
    this._loadLyricSrc(this.musiclist[this.index].mLyricUrl);
    // this.Audio.src = new URL('@/mock/assets/hanser - 鱼玄机.ogg', import.meta.url).href
  }
  
  // 加载歌词文件
  async _loadLyricSrc(lyricUrl) {
    const res = await fetch(lyricUrl);
    const buffer = await res.arrayBuffer();
    // 指定 gbk 解码
    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(buffer);
    this.lyricSrc = text;
    return text;
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

  // 播放第{{index}}首歌
  // index: 播放歌曲的索引, isAutoPlay: 切歌是否自动播放
  initMusic(index=0, isAutoPlay=false){
    if(0 <= index < this.musiclist.length){
      this.pause();
      this.index = index;
      this.Audio.src = this.musiclist[index].mMusicUrl;
      this._loadLyricSrc(this.musiclist[index].mLyricUrl);
      if(this.isAutoPlay){
        this.play();
      }
    }
    else{
      console.log('索引错误');
    }
  }
  
  // isAutoPlay: 切歌是否自动播放
  toNextMusic(isAutoPlay=false){
    const l = this.musiclist.length;
    this.initMusic((this.index+1) % l, isAutoPlay);
    console.debug('check to next song '+ this.index)
    return {
      index: this.index,
      ispause: this.ispause
    }
  }
  
  toLastMusic(isAutoPlay=false){
    const l = this.musiclist.length;
    this.initMusic((this.index+l-1) % l, isAutoPlay);
  }
  
  getList(){
    return this.musiclist;
  }
  
  getPaused(){
    return this.ispause;
  }
  
  getLoading(){
    return (this.Audio.currentTime/this.Audio.duration)*100;
  }
  
  getCurrentTime(){
    return this.getTime(this.Audio.currentTime);
  }
  
  //需要在onCanplay保护下执行
  getDuration(){
    let durL = this.Audio.duration;
    console.log(durL);
    return this.getTime(durL);
  }
  
  // 内置工具函数
  getTime(t){
    const nt = t;
    const sec = parseInt(nt%60)+'';
    const min = parseInt(nt/60)+'';
    return Array(3-min.length).join('0')+min+':'+Array(3-sec.length).join('0')+sec;
  }

}
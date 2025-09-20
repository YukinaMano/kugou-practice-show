
export class MusicPlayer {
  // 禁用autoplay，自己调用play()方法
  constructor() {
    this.musiclist = [];
    this.index = 0;
    this.ispause = true;
    this.Audio = uni.createInnerAudioContext();
  }
  
  initList(list) {
    this.index = 0;
    this.ispause = true;
    this.musiclist = list;
    this.Audio.src = this.musiclist[this.index].surl;
  }
  
  
  // 设置播放时触发的事件
  initPlaying(event){
    this.Audio.onTimeUpdate(event);
  }
  
  // 设置可以播放时触发的事件
  initCanPlaying(event){
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
  
  // 播放第{{index}}首歌
  // index: 播放歌曲的索引, isAutoPlay: 切歌是否自动播放
  initMusic(index=0, isAutoPlay=false){
    if(0 <= index < this.musiclist.length){
      this.pause();
      this.index = index;
      this.Audio.src = this.musiclist[index].surl;
      if(isAutoPlay){
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
    this.initMusic((this.index+1) % l);
  }
  
  toLastMusic(isAutoPlay=false){
    const l = this.musiclist.length;
    this.initMusic((this.index+l-1) % l);
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
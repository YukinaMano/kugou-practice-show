<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
/*每个页面公共css */
$status-bar-height: 60px;
$content-padding: 0 0 18px 0;
$base-font-color: #FFFFFF;
$base-font-size: 1.2rem;
$base-font-family: '华文楷体';

.main {
  color: $base-font-color;
  font-size: $base-font-size;
  font-family: $base-font-family;
}
.status-bar {
  height: $status-bar-height;
}
.content {
  box-sizing: border-box;
  height: calc(100vh - $status-bar-height);
  padding: $content-padding;
  display: flex;
  flex-direction: column;

  &-top {
    // padding: 18px 0 0 0;
  }
  &-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  &-bottom {
    // padding: 0 0 18px 0;
  }
}

@-webkit-keyframes rotation{
  from{transform: rotate(0deg);}
  to{transform: rotate(360deg);}
}
@keyframes rotation {
  from{transform: rotate(0deg);}
  to{transform: rotate(360deg);}
}
.anplay {
  animation: rotation 8s infinite linear;
}
.anpause {
  animation-play-state: paused;
}
</style>

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

<style>
/*每个页面公共css */
@-webkit-keyframes rotation{
  from{transform: rotate(0deg);}
  to{transform: rotate(360deg);}
}
@keyframes rotation {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.anplay {
  animation: rotation 8s infinite linear;
}
.anpause {
  animation-play-state: paused;
}
</style>

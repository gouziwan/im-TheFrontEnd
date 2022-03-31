<script>
	import { getUserInfo,getUserAllMssage  } from "./Api/index.js"
	import Socket from "./Socket/Socket.js"
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		created(){
			// 不用登录自动初始化
			this.initServiceLink();
		},
		mounted(){
			this.getTokenServer();
			
			// #ifdef H5
			window.addEventListener('resize',(e)=>{
				this.$store.state.innerHeight = window.innerHeight
				document.body.style.height = this.innerHeight + 'px'
			})
			// #endif
		},
		methods:{
			// 通过token获取个人信息  主要也是要拦截 tonken
			getTokenServer(){
				let token = uni.getStorageSync('user_token');
				if(token == undefined || token == ''){
					uni.redirectTo({
						url:"./pages/login/login"
					})
					return 
				}
				getUserInfo(token,v => {
					if(v.data.code==200){
						this.$store.state.userInfo = v.data.data
						this.$setStorage({key:'user_info',data:v.data.data})
						this.$store.state.token = token
						// 获取用户的聊天的信息
						this.getUserAllMssage()
						// 初始化服务器连接
					} else {
						uni.removeStorageSync('user_token');
						setTimeout(()=>{
							uni.redirectTo({
								url:"../login/login"
							})
						},0)
					}
				})
			},
			// 获取用户的信息
			getUserAllMssage(){
				const { userid } = this.userInfo
				getUserAllMssage(userid,res=>{
					const { data,user,code } = res.data
					if(code === 200){
						this.$store.state.userChar = data
						this.$store.state.userFriend = user
					}
				})
			},
		},
		mixins:[Socket]
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	*{
		padding: 0;
		margin: 0;
		font-family: "AlibabaPuHuiTi" !important;
	}
	
	body{
		overflow: hidden;
	}

	@font-face {
		font-family:"AlibabaPuHuiTi";
		src: url(/static/font/Alibaba-PuHuiTi-Regular.ttf);
	}
	
	button::after { border: none }
</style>
                                 
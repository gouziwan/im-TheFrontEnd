import { duration } from "../../../config.js"

export default {
	created(){
		this.systemInSync = uni.getSystemInfoSync();
		
		const { screenHeight } = this.systemInSync
		
		this.charViewHeight = screenHeight
	},
	mounted(){
		this.createdAanimtion('height',this.getCharHeight,'animation');
		this.createdAanimtion('height',this.getContextHeight,'contextAnimation');
		this.scrollToPlace();
	},
	data(){
		return {
			charViewHeight:0,
			KeyboardHeight:0,
			contextAnimation:'',
			// 当前执行的 是键盘 还是 fun
			index:0,
			systemInSync:{}
		}
	},
	computed:{
		getCharHeight(){
			const { charViewHeight , KeyboardHeight} = this;
			return charViewHeight - KeyboardHeight
		},
		//状态栏跟导航栏的高度
		getStatusBarAndNavigationBar(){
			const { statusBarHeight } = this.systemInSync
			// ios 导航栏高度默认 44px
			return statusBarHeight + 44
		},
		getButtonInputHeight(){
			const { getBorderSecurity } = this
			// 上下5px 就是内边距是10px
			let height = this.inputHeight + 10 + 10 + getBorderSecurity
			return height
		},
		// iphoneX 以上底部的安全边界
		getBorderSecurity(){
			const { safeArea,screenHeight	} = this.systemInSync
			if(this.KeyboardHeight>0) return 5
			return screenHeight - safeArea.bottom + 5
		},
		// 中间的高度就等于
		getContextHeight(){
			const { getCharHeight,getStatusBarAndNavigationBar,getButtonInputHeight } = this
			// 等于 总页面高度 - 导航栏的高度 - 底部输入框的高度
			return getCharHeight - getStatusBarAndNavigationBar - getButtonInputHeight
		},
		// 这里是 底部导航栏的高度
		getFunctionalAreas(){
			const { screenHeight } = this.systemInSync
			return screenHeight * 0.3
		},
		getExpressionHeight(){
			const { screenHeight } = this.systemInSync
			return screenHeight * 0.3
		}
	},
	
	methods:{
		onClickShowFunctionalAreas(){
			this.show = !this.show
			this.KeyboardHeight = this.show ? this.getFunctionalAreas : 0;
			
			
			if(this.expressionShow){
				this.duration = 0
				this.expressionShow = false
			}else{
				this.duration = duration
			}
		},
		onkeyboardheightchange(e){
			const { height } = e.detail
			// 就是键盘展开的时候
			this.index++;
			console.log(e)
			if(height === 0 && (this.show || this.expressionShow)){
				return 
			}
		
			if(height === this.KeyboardHeight) return
		
			this.duration = duration
		
			this.show = false;
			this.expressionShow = false
			this.KeyboardHeight = height;	
		},
		onClickShowExpression(){
			this.expressionShow = !this.expressionShow
			this.KeyboardHeight = this.expressionShow ? this.getExpressionHeight : 0;
			
			if(this.show){
				this.duration = 0
				this.show = false
			}else{
				this.duration = duration
			}
			
		},
		onFocus(){
			
		},
		onBlur(){
			
		}
	},
	watch:{
		KeyboardHeight:{
			immediate:true,
			handler(){
				const { createdAanimtion ,scrollToPlace,duration,getCharHeight,getContextHeight } = this
				setTimeout(()=>{
					createdAanimtion('height',getCharHeight,'animation');
					createdAanimtion('height',getContextHeight,'contextAnimation');
					scrollToPlace(duration)
				},0)
			}
		}
	}
}
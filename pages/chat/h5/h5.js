import {duration} from "../../../config.js"
export default {
	data(){
		return {
			node:'',
			isKeyboardPopsUp:false
		}
	},
	mounted(){
		this.scrollToPlace()
		// 这里是添加动画使得第一次动画生效
		this.node = document.querySelector('#chatView');
		this.node.style.transition = `all ${this.duration / 1000}s linear`
	},
	computed:{
		getHeight(){
			const { innerHeight } = this
				
			let offset = this.show || this.expressionShow || this.isKeyboardPopsUp ? this.getFunctionalAreas : 0
			
			return {
				height: (innerHeight - offset)  + 'px'
			}
		},
		getFunctionalAreas(){
			return this.innerHeight * 0.3
		},
		getExpressionHeight(){
			return this.innerHeight * 0.3
		}
	},
	methods:{
		onClickShowFunctionalAreas(){
			this.show = !this.show;
			
			this.expressionShow  == true ? this.setValue('expressionShow') : this.setNode()
			setTimeout(()=>{
				let num = this.show ? this.getFunctionalAreas : 0;
				let height = this.innerHeight - num
				this.createdAanimtion('height',height,'animation');
				this.scrollToPlace(this.duration)
			},0)
		},
		onClickShowExpression(){
			this.expressionShow = !this.expressionShow;
			
			this.show == true ? this.setValue('show') : this.setNode()
			
			setTimeout(()=>{
				let num = this.expressionShow ? this.getFunctionalAreas : 0
				let height = this.innerHeight - num;
				this.createdAanimtion('height',height,'animation')
				this.scrollToPlace(this.duration)
			},0)
		},
		onFocus(){
			if(this.show || this.expressionShow){
				this.show = false
				this.expressionShow = false
				this.isKeyboardPopsUp = true;
				this.setNode()
			}
		},
		onBlur(){
			this.isKeyboardPopsUp = false
		},
		
		setValue(key){
			this[key] = false
			this.duration = 0
		},
		setNode(val = duration){
			this.duration = val
			this.node.style.transition = `all ${this.duration / 1000}s linear`
		}
	}
}
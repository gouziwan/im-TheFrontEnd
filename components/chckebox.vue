<template>
	<view class="app-checkbox" :style="{
			width:this.size + 'px',
			height:this.size + 'px'
		}">
		<label  @click="onChange" :style="{
			width:this.size + 'px',
			height:this.size + 'px'
		}">
			<view class="checkbox-content" :style="getStyle">
				<text class="iconfont icon-zhengque" :class="!checkboxChecked ? 'options' : ''" :style="getFontSize"></text>
			</view>
			<checkbox  class="checkbox-input" ref="checkbox"></checkbox>
		</label>
	</view>
</template>

<script>
	export default {
		props:{
			size:{
				type:Number,
				default:25
			},
			baColor:{
				type:String,
				default:"#Ffffff"
			},
			shape:{
				type:String,
				default:"circle"
			},
			data:{},
			selectBack:{
				type:String,
				default:"#0055ff"
			},
			color:{
				type:String,
				default:"#ffffff"
			},
			id:{
				type:String,
				default: Math.floor(Math.random()) + ''
			},
			checkbox:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				checkboxChecked:false
			}
		},
		created(){
			this.checkboxChecked = this.checkbox
		},
		computed:{
			getStyle(){
				let radius = this.shape == "circle" ? "50%" : "5px"
				
				return {
					width:this.size + 'px',
					height:this.size + 'px',
					'background-color':this.checkboxChecked ? this.selectBack : this.baColor,
					borderRadius:radius,
					border:this.checkboxChecked ? `solid 1px ${this.selectBack}` : "solid 1px #b9b9b9"
				}
			},
			getFontSize(){
				return {
					'font-size':this.size * 0.85  + 'px',
					color:this.color
				}
			}
		},
		methods:{
			onChange(e){
				this.checkboxChecked = this.$refs.checkbox.checkboxChecked
				this.$emit('onChange',this.checkboxChecked,this.data)
			}
		},
		watch:{
			checkbox(newValue){
				this.checkboxChecked = newValue 
				this.$refs.checkbox.checkboxChecked = newValue
				this.$emit('onChange',this.checkboxChecked,this.data)
			}
		}
	}
	
</script>

<style lang="scss">
	.app-checkbox{
		display: inline-block;
		line-height: 0;		
		.checkbox-content{
			border-radius: 3px;
			border: solid 1px #b9b9b9;
			display: flex;
			align-items: center;
			justify-content: center;
			.iconfont.icon-zhengque{
				display: inline-block;
			}
			
			.iconfont.icon-zhengque.options{
				opacity: 0;
			}
		}
		
		
		.checkbox-input{
			display: none;
		}
	}
</style>

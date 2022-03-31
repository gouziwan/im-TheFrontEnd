<template>
	<view class="app-cell" @click="onClick">
		<view class="app-cell-left">
			<slot name="left">
				{{leftValue}}
			</slot>
		</view>
		<view class="app-cell-content" :class="[overflo ? 'overflo':'']">
			<slot name="content">
				{{title}}
			</slot>
		</view>
		<view class="app-cell-right">
			<slot name="right">
				{{ rightValue }}
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			overflo:{
				type:Boolean,
				default:false
			},
			name:{
				type:String,
				default:''
			},
			title:{
				type:String,
				default:''
			},
			leftValue:{
				type:String,
				default:''
			},
			rightValue:{
				type:String,
				default:''
			}
		},
		data(){
			return {
				
			}
		},
		methods:{
			onClick(e){
				this.$emit("click",e,this.name)
			}
		}
	}
	
	
</script>

<style scoped lang="scss">
	.app-cell{
		padding: 10px 15px;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		border-bottom: solid 1px $uni-border-color;
		.app-cell-left{
			display: flex;
		}
		
		.app-cell-content{
			flex: 1;
			margin-left: 10px;
			
		}
		.app-cell-content.overflo{
			margin-left: 10px;
			flex: 1;
			width: 100%;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		
		.app-cell-right{
			align-items: center;
		}
	}
	
	
</style>

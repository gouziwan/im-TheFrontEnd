<template>
	<view class="char-map" :style="getSizeStyle">
		<view class="char-map-title" :style="{
			width:width+'px',
			height:height*0.3+'px'
		}">
			<view>{{value.title || value.address}}</view>
		</view>
		<view class="char-map-title-map">
			<map class="map" :latitude="getlat" :longitude="getlng" :markers="markers" :style="getMapSize"></map>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			width:{
				type:Number,
				default:200
			},
			height:{
				type:Number,
				default:120
			},
			item:{
				type:String,
				default:''
			}
		},
		data(){
			return {
				value:''
			}
		},
		created(){
			this.value = JSON.parse(this.item)
		},
		computed:{
			getlat(){
				const { value } = this
				return value.location && value.location.lat
			},
			getlng(){
				const { value } = this
				return value.location && value.location.lng
			},
			markers(){
				const { getlat , getlng} = this
				return [
					{
						latitude:getlat,
						longitude:getlng,
						width:30,
						height:30,
						iconPath:'/static/images/地标.png'
					}
				]
			},
			getSizeStyle(){
				return {
					width:this.width+'px',
					height:this.height+'px'
				}
			},
			getMapSize(){
				return {
					width:this.width+'px',
					height:this.height * 0.7 +'px'
				}
			}
		}
	}
	
</script>

<style lang="scss">
	.char-map{
		width: 200px;
		height: 150px;
		overflow: hidden;
		.char-map-title{
			display: inline-block;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			padding-left: 10px;
			& view{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		
		.char-map-title-map{
			.map{
				width: 200px;
				height: 110px;
			}
		}
	}
</style>

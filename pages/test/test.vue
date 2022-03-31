<template>
	<view style="background-color: #00aa00">
	
	
		<CharViewMap></CharViewMap>
		
	</view>
</template>

<script>
	import AppCheckbox from "../../components/chckebox.vue"
	import CharViewMap from "../../components/CharViewMap.vue"
	export default{
		data(){
			return {
				value:0
			}
		},		
		components:{
			AppCheckbox,
			CharViewMap
		},
		mounted(){
		}
	}
</script>

<style>
	.bar-top{
		width: 100%;
		height: 50px;
		background-color: yellow;
		position: absolute;
		bottom: 0;
}
</style>

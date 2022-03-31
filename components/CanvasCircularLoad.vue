<template>
	<div class="canvasCircular" :style="getSizeStyle">
		<canvas :canvas-id="backId" class="canvasBack" ></canvas>
		<canvas :canvas-id="id" class="canvas" ></canvas>
		<div class="count-to" :style="getFontSizeStyle">
			<u-count-to :startVal="startEnd * 100" :duration="20" :useEasing="false" :autoplay="autoplay" :endVal="cruuentPercent*100" color="#ffffff" :color="fontColor" :fontSize="fontSize" ></u-count-to>%
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			size:{
				type: Number,
				default:40
			},
			value:{
				type:Number,
				default:0
			},
			lineWidth:{
				type:Number,
				default:5
			},
			fontSize:{
				type:Number,
				default:12
			},
			fontColor:{
				type:String,
				default:"#ffffff"
			},
			color:{
				type:String,
				default:"#ffffff"
			},
			baColor:{
				type:String,
				default:'#d0d0d0'
			}
		},
		data(){
			return {
				id:`canvas-${Math.random()}`,
				backId:`canvasBack-${Math.random()}`,
				percent:0,
				cruuentPercent:0,
				startEnd:0,
				anitionId:'',
				ctx:'',
				ctxBack:'',
				autoplay:true
			}
		},
		computed:{
			getSizeStyle(){
				let { size } = this
				size = size + 'px'
				return {
					width:size,
					height:size
				}
			},
			getArcSize(){
				let { size,lineWidth } = this
				size = size / 2
				return {
					offset:size,
					radius:size - lineWidth
				}
			},
			getFontSizeStyle(){
				const { fontSize,fontColor } = this
				return {
					fontSize:fontSize+'px',
					color:fontColor
				}
			}
		},
		mounted(){
			this.ctx = uni.createCanvasContext(this.id,this);
			this.ctxBack = uni.createCanvasContext(this.backId,this);
			this.createBackArc(this.ctxBack)
			this.createCurcularArc(this.ctx);
			
		},
		methods:{
			createBackArc(ctx){
				const { offset ,radius } = this.getArcSize
				
				ctx.arc(offset, offset, radius, 0, 2 * Math.PI);
				ctx.setStrokeStyle(this.baColor)
				ctx.setLineWidth(this.lineWidth)
				ctx.stroke()
				ctx.draw()
			},
			createCurcularArc(ctx){
				const { offset ,radius } = this.getArcSize
				ctx.arc(offset, offset, radius, 0, 2*this.percent * Math.PI);
				ctx.setStrokeStyle(this.color)
				ctx.setLineWidth(this.lineWidth)
				ctx.stroke()
				ctx.draw()
			},
			
			createdAnimation(ctx){
				clearInterval(this.anitionId);
				this.anitionId =  setInterval(()=>{
					if(this.cruuentPercent <= this.percent) clearInterval(this.anitionId);
					this.percent += 0.01				
					this.createCurcularArc(ctx)
				},20)
			}
		},
		watch:{
			value:{
				 handler(newName, oldName) {
					 this.cruuentPercent = newName
					 setTimeout(()=>{
						 this.startEnd = this.percent
						this.createdAnimation(this.ctx) 
					 },0)
				},
				immediate: true
			}
		}
	}	
</script>

<style lang="scss" scoped>
	.canvasCircular{
		position: relative;
		.canvas{
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			transform: rotate(-90deg);
			z-index: 20;
		}
		.canvasBack{
			padding: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 10;
		}
		.count-to{
			display: flex;
			align-items: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
	}
</style>

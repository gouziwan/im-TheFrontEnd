import { http } from "../Api/index.js"


export default {
	// 上传图片
	// 单体上传
	methods:{
		uploadMsgImg({filePath,fileType,success,fail,complete,formData,el}){
			let data = {
				url:http + '/upload/uploadMsgImg',
				filePath,
				fileType,
				name:'fileimg',
				success,
				fail:res=>{
					fail(res,el)
				},
				complete,
				formData
			}
			return uni.uploadFile(data)
		},
		
		uploadMsgImgArr({Arr,success,fail,complete,formData,callback}){
			Arr.forEach(async el=> {
				let uuid = Math.floor(Math.random()*100000000000000000) + Date.now()
				el.onid = uuid
				
				let types = el.type.split('/')[0];
				
				if(types === "image"){
					let result = this.uploadMsgImg({
						filePath:el.path,
						fileType:types,
						success,
						fail,
						complete,
						formData,
						el
					})
						
					callback && callback(result,el,2)
				}else if(types === "video"){
					formData = formData instanceof Object ?  formData : {};
					
					if(el.width == undefined || el.height == undefined){
						let {width ,height} = await this.getVideoInfoSynte(el.path);
						el.width  = width;
						el.height = height
					}	
					formData.width = el.width;
					formData.height = el.height
					let result = this.uploadVideo({
							filePath:el.path,
							fileType:types,
							success,
							fail,
							complete,
							formData,
							el
						})
						callback && callback(result,el,3)
					}				
				})
		},
		uploadVideo({filePath,fileType,success,fail,complete,formData,el}){
			let data = {
				url: http + '/upload/uploadVideo',
				filePath,
				fileType,
				name:'video',
				success,
				fail:res=>{
					fail(res,el)
				},
				complete,
				formData
			}
			
			return uni.uploadFile(data)
		},
		
		getVideoInfoSynte(path){
			return new Promise((resolve)=>{
				uni.getVideoInfo({
					src:path,
					success:res=>{
						resolve(res)
					},
					fail(){
						resolve()
					}
				})
			})
		}
	}
}
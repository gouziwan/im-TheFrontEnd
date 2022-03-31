export const ip = "localhost"

export const http  = `http://${ip}:3000`

export const img = `http://${ip}:3000/images/`

export const videoSrc = `http://${ip}:3000/video/`

function request(data){
	data.url = http + data.url
	return uni.request({...data})
}

// 用户的账号是否注册
export const accountRegistr = (account,success,fail)=> {
	request({
		url: "/user/accres",
		method:"POST",
		data:{
			account
		},
		success,
		fail
	})
}

// 用户邮箱注册
export const verifyEmail = (email,success,fail) => {
	request({
		url:"/user/email",
		data:{
			email
		},
		method:'POST',
		success,
		fail
	})
}

// 验证码发送 
export const  emailCode = (email,success,fail) => {
	request({
		url:"/user/sendEmaild",
		data:{
			email
		},
		method:'POST',
		success,
		fail
	})
}


// 用户注册
export const userRegister = (data,success,fail)=>{
	request({
		url:"/user/register",
		data,
		method:'POST',
		success,
		fail
	})
}

// 用户登录
export const userLogin = (data,success,fail)=>{
	request({
		url:"/user/login",
		data,
		method:'POST',
		success,
		fail
	})
}

// 获取用户登录信息
export const getUserInfo = (token,success,fail)=>{
	request({
		url:"/user/userInfo",
		data:{
			token
		},
		method:"POST",
		success,
		fail
	})
}


// 用户修改 昵称
export const modifyNickNames = (nickName,token,success,fail)=>{
	request({
		url:"/user/changingName",
		data:{
			name:nickName,
			token
		},
		method:"POST",
		success,
		fail
	})
}

// 用户修改个性签名
export const modifyingSignature = (sig,token,success,fail)=>{
	request({
		url:'/user/signature',
		data:{
			sig,
			token
		},
		method:"POST",
		success,
		fail
	})
}

// 修改性别

export const modifyTheGender = (sex,token,success,fail) => {
	request({
		url:'/user/upsex',
		data:{
			sex,
			token
		},
		method:'POST',
		success,
		fail
	})
}

// 修改生日
export const modifyTheBirthday = (birt,token,success,fail) => {
	request({
		url:'/user/upbirthday',
		data:{
			birt,
			token
		},
		method:'POST',
		success,
		fail
	})
}

// 修改
export const modifyThePhoneNumber = (phone,token,success,fail) =>{
	request({
		url:'/user/upPhone',
		data:{
			phone,token
		},
		success,
		fail,
		method:'POST'
	})
}

// 保存用户图片
export const downAvartImg = (name,success,fail) => {
	request({
		url:'/down/downImg?name='+name,
		method:'GET',
		success,
		fail
	})
}


// 上传用户头像
export const uploadUserAvatar = (url,token,success,fail) => {
	uni.uploadFile({
		url:http + '/upload/uploadImg',
		fileType:'image',
		filePath:url,
		name:'fileimg',
		formData:{
			token
		},
		success,
		fail
	})
}


// 搜索内容用户 id 或者 昵称
export const getSearchUserList = ({userid,content,offset = 0,list = 10,success,fail}) => {
	request({
		url:'/search/seacthUser',
		data:{
			userid,
			content,
			offset,
			list
		},
		method:'POST',
		success,
		fail
	})
}


// 发送好友申请
export const sendFriendRequest = ({userid,friendid,content,success,fail}) => {
	request({
		url:'/friend/addFriend',
		data:{
			userid,
			friendid,
			content
		},
		method:'POST',
		success,
		fail
	})
}
// 获取用户的好友申请列表
export const getFriendRequestRecord = (userid,success,fail) =>{
	request({
		url:'/friend/friendApplihistory',
		data:{
			userid
		},
		method:'POST',
		success,
		fail
	})
}

// 获取用的新的好友申请列表
export const getNewFriendTitleNumber = (userid,success,fail) => {
	request({
		url:'/friend/getNewFriendPrompts',
		data:{
			userid
		},
		method:'POST',
		success,
		fail
	})
}

// 同意好友的申请
export const greeAddFriendApplay = (userid,friendid,success,fail)=>{
	request({
		url:'/friend/agreeWithFriendRequests',
		data:{
			userid,
			friendid
		},
		method:'POST',
		success,
		fail
	})
}

// 拒绝添加好
export const rejectAddFriendApplay = (id,success,fail)=>{
	request({
		url:'/friend/rejectAddFriend',
		data:{
			id	
		},
		method:'POST',
		success,
		fail
	})
}

// 删除好友添加历史记录
export const deleteFriendRecord = (id,success,fail)=>{
	request({
		url:'/friend/deleteFriendRecord',
		data:{
			id	
		},
		method:'POST',
		success,
		fail
	})
}

// 获取好友列表
export const getFriendList = (userid,success,fail)=>{
	request({
		url:'/friend/getAddFriend',
		data:{
			userid	
		},
		method:'POST',
		success,
		fail
	})
}

// 获取用户信息
export const gainUserInfo = (userid,success,fail) => {
	request({
		url:'/user/getUserInfo',
		data:{
			userid,
		},
		method:'POST',
		success,
		fail
	})
}


// 是否为好友
export const getIsFriend = (userid,friendid,success,fail)=>{
	request({
		url:'/friend/isFriend',
		data:{
			userid,
			friendid
		},
		method:'POST',
		success,
		fail
	})
}

// 经纬度转地址
export const getLocation = (x,y,success,fail) => {
	const value = x+','+y
	request({
		url:'/city/getLocation',
		data:{
			value
		},
		success,
		fail
	})
}
// 
export const getSeachCityValue = (value,city,success,fail) => {
	request({
		url:'/city/seachCity',
		data:{
			value,
			city
		},
		success,
		fail
	})
}

// 获取用户信息
export const getUserAllMssage = (id,success,fail)=>{
	request({
		url:'/msg/allmsg',
		data:{
			id
		},
		success,
		fail,
		method:'POST'
	})
}


// 上传表情图片
export const uploadExpression = ({filePath,userid,success,fail})=>{
	uni.uploadFile({
		url:http + '/expression/uploadExpression',
		fileType:'image',
		filePath,
		success,
		fail,
		formData:{
			userid
		},
		name:'expression'
	})
}

// 获取表情包图片
export const getExpression = (userid,success,fail)=>{
	request({
		url:'/expression/getExpression',
		method:'POST',
		success,
		fail,
		data:{
			userid
		}
	})
}

// 删除表情包
 export const deleteExpression = (arr,success,fail) => {
	 request({
		 method:'POST',
		 url:'/expression/deleteExpression',
		 success,
		 fail,
		 data:{
			 arr
		 }
	 })
 }
 
 // 设置已读信息
 export const setMsgRead = (arr,success,fail) => {
	const id = JSON.stringify(arr)
	request({
		method:'POST',
		url:'/msg/setMsgRead',
		data:{
			id
		},
		fail,success
	})
 }
 
 // 退出登录
 export const logOut = (token,success,fail)=>{
	 request({
	 	method:'POST',
	 	url:'/user/logout',
	 	data:{
	 		token
	 	},
	 	fail:success,success
	 })
 }
 
 export const getUpdatePasswrodCode = (email,success,fail)=>{
 // 这个是获取修改密码的验证码
	 request({
	 	method:'POST',
	 	url:'/user/upSendEmaild',
	 	data:{
	 		email
	 	},
	 	fail,
		success
	 })
 }
 
 
 // 验证邮箱和账号是否一致
 export const verifyEmailAccounts = (account,email,success,fail)=>{
	 request({
	 	method:'POST',
	 	url:'/user/verifyEmailAccounts',
	 	data:{
	 		email,
			account
	 	},
	 	fail,
	 		success
	 })
 }
 
 // 验证修改密码的邮箱账号密码是否正确
 export const isCodeCrounted = (account,email,code,success,fail)=>{
	 request({
	 	method:'POST',
	 	url:'/user/isCodeCrounted',
	 	data:{
	 		email,
	 		account,
			code
	 	},
	 	fail,
	 	success
	 })
 }
 
 // 用户修改密码
 export const upUserPasswrold = (account,email,code,password,success,fail)=> {
	 request({
	 	method:'POST',
	 	url:'/user/upAccountPasswrold',
	 	data:{
	 		email,
	 		account,
	 		code,
			password
	 	},
	 	fail,
	 	success
	 })
 }
import {mapGetters,mapState} from "vuex"


export const avatarImg = {
	computed:{
		...mapGetters(['getAvataImg','getViewPortSize']),
		...mapState(['userInfo','token','innerHeight','userChar','unreadMsg']),
		
	}
}







const app = Vue.createApp({
    data(){
        return{
            username: null,
            password: null
        }
    },
    methods:{
        pass:function(event){
            console.log(this.username + ' ' + this.password);
        }
    }
})
app.mount('#login');
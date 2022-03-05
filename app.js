
const app = Vue.createApp({
    data(){
        return{
            firstName: null,
            lastName: null,
            email: null,
            picture: null
        }
    },
    methods:{
        async getUser(){
            const res = await fetch('https://randomuser.me/api');
            const {results} = await res.json()
            this.firstName = results[0].name.first
            this.lastName = results[0].name.last
            this.email = results[0].email
            this.picture = results[0].picture.large
        }
    },
    created(){
        this.$nextTick(function () {
            this.getUser()
        })
    },
});
app.mount('#app');
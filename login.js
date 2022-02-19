
const app = Vue.createApp({
    data(){
        return{
            username: null,
            password: null
        }
    },
    methods:{
        pass:function(event){
            if(this.username === 'BenasKc' && this.password==="Benas123")
            {
                alert("Login successful");
                const d = new Date();
                d.setTime(d.getTime() + (15*60*1000));
                let expires = d.toUTCString();
                document.location.reload(true);
                document.cookie = `login=true; expires=${expires};`;
            }
            else if(this.username === 'silumini' && this.password === "Arnas123"){
                alert("Login successful");
                const d = new Date();
                d.setTime(d.getTime() + (15*60*1000));
                let expires = "expires="+ d.toUTCString();
                document.location.reload(true);
                document.cookie = `login=true;expires=${expires};`;
            }
            else{
                alert("Login failed!");
                document.cookie = `login=false;`;
            }
        }
    }
})
app.mount('#login');
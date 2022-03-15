function create_Acc(urla, str, cb){
      
    let xhr = new XMLHttpRequest();

    xhr.open("POST", urla, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            cb(this.responseText);
        }
    };

    xhr.send(str);
}
const app = Vue.createApp({
    data(){
        return{
            username: null,
            password: null,
            email: null
        }
    },
    methods:{
        pass:function(event){
            create_Acc('/create', this.username + '|' + this.password + '|' + this.email, (item)=>{
                alert(item.replace('"', '').replace('"', ''));
            });
        }
    }
})
app.mount('#login');
function check_Acc(urla, str, cb){
      
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
            password: null
        }
    },
    methods:{
        pass:function(event){
            var items = [this.username.replace(/[|]/g, ""), this.password.replace(/[|]/g, "")];
            check_Acc('/checklogin',  JSON.stringify(items) , (item)=>{
                document.location.reload(true);
                document.cookie = `login=${item};`;
            })
            
        }
    }
})
app.mount('#login');
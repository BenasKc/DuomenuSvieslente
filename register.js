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
            name_of_organisation: null
        }
    },
    methods:{
        pass:function(event){
            var items = [this.username.replace(/[^A-Z0-9]/ig, "_"), this.password.replace(/[^A-Z0-9]/ig, "_"), this.name_of_organisation.replace(/[^A-Z0-9]/ig, "_")];
            create_Acc('/create',  JSON.stringify(items), (item)=>{
                alert(item.replace('"', '').replace('"', ''));
            });
        }
    }
})
app.mount('#login');
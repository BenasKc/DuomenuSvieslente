function fetch_log(urla, str, cb){
      
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
function getCookieValue(){  
    var item = document.cookie;
    item = item.split(';');
    for(var i = 0;i < item.length;i++){
        var temp = item[i].split('=');
        if(temp[0]==='login')return temp[1];
    }
    return '-1';
}
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
        fetch_prof: function(event){
            fetch_log('/fetch_profile', getCookieValue(), (item)=>{
                item = item.replace('"', '').replace('"', '');
                item = item.split('|');
                this.firstName = item[1];
                this.lastName = item[2];
                this.email = item[0];
            })
            
        },
        logoff : function(){
            document.cookies = 'login=-1';
            document.reload;
        }
    },
    created(){
        this.$nextTick(function () {
            this.fetch_prof();
        })
    },
});
app.mount('#app');
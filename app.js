function fetch_log(urla, str, cb){
      
    let xhr = new XMLHttpRequest();

    xhr.open("POST", urla, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            cb(this.responseText);
        }
    };
    console.log(str)
    xhr.send(str);
}
function getCookieValue(cb){  
    var item = document.cookie;
    item = item.split(';');
    var count = 0;
    for(var i = 0;i < item.length;i++){
        var temp = item[i].split('=');
        temp[0] = temp[0].replace(/\s/g, '');
        if(temp[0]==='login')cb( temp[1]);
        else count++;
        if(count === item.length)cb(  -1);
    }
}
const app = Vue.createApp({
    data(){
        return{
            name_of_org: null
        }
    },
    methods:{
        fetch_prof: function(event){
            getCookieValue((value)=>{
                fetch_log('/fetch_profile',  value, (item)=>{
                    item = JSON.parse(item)
                    this.name_of_org = item[0];
                })
            })
            
            
        }
    },
    created(){
        this.$nextTick(function () {
            this.fetch_prof();
            console.log('bound');
        })
    },
});
app.mount('#app');
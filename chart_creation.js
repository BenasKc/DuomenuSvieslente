var item2 = {
    title:'Atliktos užduotyas',
    categories_x:['Užduotys'],
    categories_y:'Darbų atlikta',    
    series: [{
        name: 'Atliktos užduotys',
        data: [
        {name: 'Jonas', y: 1},
        {name: 'Petras', y: 5},
        {name: 'Marius', y:3},
        {name: 'Urtė', y: 0},
        {name: 'Vilma', y:4}
        ]
    }]
}
function acquire_id(obj, cb){
    var itm = document.cookie.split(';');
    var count=0;
    for(var i = 0;i < itm.length;i++){
        var tmp = itm[i].split('=');
        tmp[0] = tmp[0].replace(/\s/g, '')
        if(tmp[0] === 'login'){
            obj.id = tmp[1].slice(1,-1);
            cb(obj)
        } else count++;
        if(count === tmp.length)cb(false)
    }
}
function send_Data(urla, obj, cb){
    acquire_id(obj, (object)=>{
        if(object === false){
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.open("POST", urla, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                cb(this.responseText);
            }
        };
        xhr.send(JSON.stringify(object));
    })
}
const prog = Vue.createApp({
    data(){
        return{
            username: null,
            password: null
        }
    },
    methods:{
        sendin_c: function(event){
            send_Data('/create_new_chart', (item2), (item)=>{
                alert(item.slice(1,-1));
            }) 
        }
    }
})
prog.mount('#chrbod');
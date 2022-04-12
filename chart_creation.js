var item2 = {
    title:'Atliktos užduotyss',
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
function send_Data(urla, obj, cb){
      
    let xhr = new XMLHttpRequest();

    var itm = document.cookie.split(';');
    for(var i = 0;i < itm.length;i++){
        var tmp = itm[i].split('=');
        if(tmp[0] === 'login'){
            obj.id = tmp[1].slice(1,-1);
        }
    }
    xhr.open("POST", urla, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            cb(this.responseText);
        }
    };

    xhr.send(JSON.stringify(obj));
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
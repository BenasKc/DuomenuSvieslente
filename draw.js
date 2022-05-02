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
var current_selection = null;
var prev = null;
var carcass_area, carcass_bar, carcass_line, carcass_pie;
function redeclare(){
    carcass_line = {
        title: {
            text: current_selection.title
        },
        yAxis: {
            title: {
                text: current_selection.categories_y
            }
        },
    
        xAxis: {
            categories: current_selection.categories_x
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
            }
        },
        series: current_selection.series,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    }
    carcass_area = {
        chart: {
            type: 'area'
        },
        title: {
            text: current_selection.title
        },
        xAxis: {
            categories: current_selection.categories_x
        },
        credits: {
            enabled: false
        },
        series: current_selection.series
    };
    carcass_bar = {
          chart: {
            type: 'column'
          },
          title: {
            text: current_selection.title
          },
          yAxis: {
            title: {
              text: current_selection.categories_y
            }
          },
          xAxis:{
              categories: current_selection.categories_x
          },
          plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: current_selection.series
    }
    carcass_pie = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: current_selection.title
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>'
                }
            }
        },
        series: current_selection.series
    }
}
function draw(option){
    if(option === 'Line'){
        const chart = Highcharts.chart('chart', carcass_line);
    }
    else if(option === 'Area'){
        const chart = Highcharts.chart('chart', carcass_area);
    }
    else if(option === 'Bar'){
        const chart = Highcharts.chart('chart', carcass_bar);
    }
    else if(option === 'Pie'){
        const chart = Highcharts.chart('chart', carcass_pie);
    }
}
const app = Vue.createApp({
    
    data(){
        var ds = [];
        var display = {
            selected_graph: null,
            selected_data: null,
            options: [],
            data_source: (ds)
            
        }
        return {
            name_of_org: null,
            usernm: null,
            display: display,
            charts: null,
            preferences: null,
            ids: null
        };
    },
    methods: {
        save_graph:function(event){
            getCookieValue((val)=>{
                for(var i = 0;i < this.display.data_source.length; i++){
                    if(this.display.data_source[i].text === this.display.selected_data){
                        fetch_log('/save_pref', JSON.stringify({session: val, id: this.ids[i], conf: this.display.selected_graph}), (itm)=>{

                        })
                        break;
                    }
                }
                
            })
        },
        onChange(event) {
            const isCorrect = (element) => element === this.display.selected_data;
            for(var i = 0;i < this.display.data_source.length; i++){
                if(this.display.data_source[i].text === this.display.selected_data){
                    current_selection = JSON.parse(this.charts[i]);
                    if(prev !== this.display.selected_data){
                        this.display.selected_graph = this.preferences[i];
                    }
                    prev = this.display.selected_data;
                    break;
                }
            }
            var linear = current_selection.categories_x.length < 2;
            if(linear){
                this.display.options = [
                    { text: 'Line', value: 'Line' },
                    { text: 'Bar', value: 'Bar' },
                    { text: 'Area', value: 'Area' },
                    { text: 'Pie', value: 'Pie'}
                  ];
            }
            else{
                this.display.options = [
                    { text: 'Line', value: 'Line' },
                    { text: 'Bar', value: 'Bar' },
                    { text: 'Area', value: 'Area' }
                  ];
                if(this.display.selected_graph === 'Pie')this.display.selected_graph = 'Line';
            }

            redeclare();
            draw(this.display.selected_graph);
        }
    },
    created(){
        getCookieValue((val)=>{
            fetch_log('/fetch_profile', val, (itm)=>{
                itm = JSON.parse(itm);
                this.name_of_org = itm[0];
                this.usernm = itm[1];
            })
            fetch_log('/fetch_charts', val, (itm)=>{
                var datas = JSON.parse(itm);
                var data_source_new = [];
                var charts = [];
                var preferences = [];
                var ids = [];
                for(var i = 0;i < datas.length;i++){
                    data_source_new.push({text:datas[i].Name_of_Chart, value:datas[i].Name_of_Chart});
                    charts.push(datas[i].Data_blob);
                    if(datas[i].Chart_config.length > 0){
                        preferences.push(JSON.parse(datas[i].Chart_config).selected_graph);
                    }
                    else preferences.push('Line');

                    ids.push(datas[i].ID_of_Chart);
                }
                this.display.data_source = data_source_new;
                this.preferences = preferences;
                this.ids = ids;
                this.charts = charts;
                //prev = this.display.selected_graph; 
                if(this.display.data_source.length > 0){
                    this.display.selected_data = this.display.data_source[0].text;
                    this.display.selected_graph = this.preferences[0];
                }
                current_selection = JSON.parse(this.charts[0]);
                var linear = current_selection.categories_x.length < 2;
                if(linear){
                    this.display.options = [
                        { text: 'Line', value: 'Line' },
                        { text: 'Bar', value: 'Bar' },
                        { text: 'Area', value: 'Area' },
                        { text: 'Pie', value: 'Pie'}
                      ];
                }
                else{
                    this.display.options = [
                        { text: 'Line', value: 'Line' },
                        { text: 'Bar', value: 'Bar' },
                        { text: 'Area', value: 'Area' }
                      ];
                    if(this.display.selected_graph === 'Pie')this.display.selected_graph = 'Line';
                }
                redeclare();
                draw(this.display.selected_graph);
                this.$forceUpdate();
            })
        });
        
    }
})
app.mount('#bodyy');
draw('Line');

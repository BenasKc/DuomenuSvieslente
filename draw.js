var item = {
    title:'Darbuotojų efektyvumas',
    categories_x:['Užduotys', 'Susitikimai', 'Pardavimai'],
    categories_y:'Darbų atlikta',    
    series: [{
        name: 'Jonas',
        data: [1,0,4]
    },{
        name: 'Petras',
        data: [5,7,3]
    },{
        name: 'Marius',
        data: [3,6,8]
    },{
        name: 'Urtė',
        data: [0,1,3]
    },{
        name: 'Vilma',
        data: [4,12,1]
    }]
}
var item2 = {
    title:'Atliktos užduotys',
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
var data = [item, item2];

var current_selection = data[0];
var data_names = [Object.keys({item})[0], Object.keys({item2})[0]];
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
redeclare();
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
        for(var i = 0;i < data.length;i++){
            var itm = {text:data[i].title, value:data_names[i]}
            ds.push(itm);
        }
        var display = {
            selected_graph: 'Line',
            selected_data: data_names[0],
            options: [
              { text: 'Line', value: 'Line' },
              { text: 'Bar', value: 'Bar' },
              { text: 'Area', value: 'Area' }
            ],
            data_source: (ds)
            
        }
        if(current_selection.categories_x.length < 2){
            display.options.push({text:'Pie', value:'Pie'});
        }
        return display;
    },
    methods: {
        onChange(event) {
            const isCorrect = (element) => element === this.selected_data;
            current_selection = data[(data_names.findIndex(isCorrect))];
            var linear = current_selection.categories_x.length < 2;
            if(linear){
                this.options = [
                    { text: 'Line', value: 'Line' },
                    { text: 'Bar', value: 'Bar' },
                    { text: 'Area', value: 'Area' },
                    { text: 'Pie', value: 'Pie'}
                  ];
            }
            else{
                this.options = [
                    { text: 'Line', value: 'Line' },
                    { text: 'Bar', value: 'Bar' },
                    { text: 'Area', value: 'Area' }
                  ];
                if(this.selected_graph === 'Pie')this.selected_graph = 'Line';
            }
            redeclare();
            draw(this.selected_graph);
        }
    }
})
app.mount('#bodyy');
draw('Line');

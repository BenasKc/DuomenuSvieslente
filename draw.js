document.addEventListener('DOMContentLoaded', function(){
    const chart = Highcharts.chart('container', {
        chart: {
            type:'bar'
        },
        title:{
            text:'Darbuotojų efektyvumas'
        },
        xAxis:{
            categories:['Užduotys', 'Susitikimai', 'Pardavimai']
        },
        yAxis:{
            title:{
                text:'Darbų atlikta'
            }
        },
        series: [{
            name: 'Jonas',
            data: [1,0,4]
        },{
            name: 'Petras',
            data: [5,7,3]
        }]
    });
});
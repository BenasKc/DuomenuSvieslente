document.addEventListener('DOMContentLoaded', function(){
    const chart = Highcharts.chart('container2', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type:'pie'
        },
        title:{
            text:'Darbuotojų efektyvumas'
        },
        plotoptions:{
            pie:{
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels:{
                    enabled: true,
                    format: '<b>{point.name}</b>'
                }
            }
        },
        series: [{
            name: 'Darbingumas',
            colorByPoint: true,
            data: [{
                name: 'Jonas',
                y: 1,
                sliced: true,
            }, {
                name: 'petras',
                y: 3,
            }]
        }]
    });
});
let ctx = document.getElementById('chart').getContext('2d');
ctx = document.getElementById('chart');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [0],
        datasets: [{
            label: 'Avg.Fitness value',
            datasets: [{ data: [0] }],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

/**
 * Updates chart canvas with new data values
 *
 * @param {number} value value of current avg. fitness function of generation
 * @param {number} generation current generation
 */
function updateChart(value, generation) {
    chart.data.datasets[0].data.push(value);
    chart.data.labels.push(generation);
    chart.update();
}

export { chart, updateChart }

export const resultsOptions = {
    indexAxis: 'y',
    elements: {
        bar: {
        }
    },
    layout: {
        padding: 0
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    scales: {
        y: {
            ticks: {
                color: 'rgb(127, 255, 212)',
                font: {
                    family: 'Orbitron'
                }
            },
            grid: {
                color: 'rgba(127, 255, 212, 0.5)',
                tickColor: '#00ffff',
                tickWidth: 2
            },
            border: {
                color: 'rgb(127, 255, 212)',
                width: 2
            }
        },
        x: {
            min: 0,
            max: 100,
            grid: {
                color: 'rgba(127, 255, 212, 0.5)',
                tickColor: '#00ffff',
                tickWidth: 2
            },
            ticks: {
                stepSize: 5,
                color: 'rgb(127, 255, 212)',
            },
            border: {
                color: 'rgb(127, 255, 212)',
                width: 2
            }
        },
    }
}
    
export const labels = ['DeepFake', 'Face2Face', 'FaceSwap', 'Neural Textures'];
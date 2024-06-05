//API COIN + updatePrices
function updatePrices() {
    fetch('https://rest.coinapi.io/v1/exchangerate/BTC/USD', {
        headers: {
            'X-CoinAPI-Key': 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'
        }
    })
    .then(response => response.json())
    .then(data => {
        const bitcoinPriceElement = document.getElementById('btc-price');
        bitcoinPriceElement.textContent = ` ${data.rate.toFixed(2)}`;
    })
    .catch(error => console.error('Erro:', error));

    fetch('https://rest.coinapi.io/v1/exchangerate/LTC/USD', {
        headers: {
            'X-CoinAPI-Key': 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'
        }
    })
    .then(response => response.json())
    .then(data => {
        const litecoinPriceElement = document.getElementById('ltc-price');
        litecoinPriceElement.textContent = ` ${data.rate.toFixed(2)}`;
    })
    .catch(error => console.error('Erro:', error));

    fetch('https://rest.coinapi.io/v1/exchangerate/ETH/USD', {
        headers: {
            'X-CoinAPI-Key': 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'
        }
    })
    .then(response => response.json())
    .then(data => {
        const ethereumPriceElement = document.getElementById('ether-price');
        ethereumPriceElement.textContent = ` ${data.rate.toFixed(2)}`;
    })
    .catch(error => console.error('Erro:', error));
}

setInterval(updatePrices, 1500);
updatePrices();

const marketDataApiUrl = 'https://rest.coinapi.io';
const apiKey = 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'; 

document.addEventListener('DOMContentLoaded', () => {
    const btcDiv = document.querySelector('.crypto-price.btc');
    const ltcDiv = document.querySelector('.crypto-price.ltc');
    const etherDiv = document.querySelector('.crypto-price.ether');
    
    btcDiv.addEventListener('click', () => displayChart('BTC'));
    ltcDiv.addEventListener('click', () => displayChart('LTC'));
    etherDiv.addEventListener('click', () => displayChart('ETH'));
});

async function displayChart(symbol) {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.style.display = 'block'; // 
    
    const data = await fetchMarketData(symbol);
    renderChart(data);
}

async function fetchMarketData(symbol) {
    const url = `${marketDataApiUrl}/v1/exchangerate/${symbol}/USD/history?period_id=1DAY&time_start=2022-01-01T00:00:00`;
    
    const response = await fetch(url, {
        headers: {
            'X-CoinAPI-Key': apiKey
        }
    });
    
    if (!response.ok) {
        console.error('Failed to fetch market data');
        return;
    }
    
    const data = await response.json();
    return data;
}

function renderChart(data) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    const labels = data.map(entry => entry.time_period_start.split('T')[0]);
    const prices = data.map(entry => entry.rate_close);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price (USD)',
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchCryptoPrices();

    setInterval(fetchCryptoPrices, 3000); // Atualiza os preços a cada 3 segundos
});

function fetchCryptoPrices() {
    const coinApiKey = 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'; 
    const coinApiUrl = 'https://rest.coinapi.io';
   
    fetch('https://api.coincap.io/v2/assets')
        .then(response => response.json())
        .then(data => {
            const btc = data.data.find(crypto => crypto.symbol === 'BTC');
            const ltc = data.data.find(crypto => crypto.symbol === 'LTC');
            const eth = data.data.find(crypto => crypto.symbol === 'ETH');

            document.getElementById('btc-price').textContent = parseFloat(btc.priceUsd).toFixed(2);
            document.getElementById('ltc-price').textContent = parseFloat(ltc.priceUsd).toFixed(2);
            document.getElementById('eth-price').textContent = parseFloat(eth.priceUsd).toFixed(2);

            // Atualiza gráfico
            updateChart(btc, ltc, eth);
        })
        .catch(error => console.error('Erro ao buscar preços das criptomoedas:', error));
}

function updateChart(btc, ltc, eth) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['BTC', 'LTC', 'ETH'],
            datasets: [{
                label: 'Preço em USD',
                data: [btc.priceUsd, ltc.priceUsd, eth.priceUsd],
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    document.getElementById('chart-container').style.display = 'block';
}

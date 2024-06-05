// Definição da URL da API e chave de acesso
const apiUrl = 'https://rest.coinapi.io/v1';
const apiKey = 'A87977FA-9FC3-4A03-8BC1-68EF634735AB';

// Função para buscar e atualizar os preços das moedas em uma determinada moeda base (USD ou BRL)
function updatePrices(baseCurrency) {
    // Mapeia as moedas desejadas e faz uma requisição para cada uma
    const currencies = ['BTC', 'LTC', 'ETH'];
    currencies.forEach(currency => {
        fetch(`${apiUrl}/exchangerate/${currency}/${baseCurrency}`, {
            headers: {
                'X-CoinAPI-Key': apiKey
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar os preços das moedas');
            }
            return response.json();
        })
        .then(data => {
            // Atualiza os elementos HTML com os novos preços
            const priceElement = document.getElementById(`${currency.toLowerCase()}-price`);
            const price = data.rate.toFixed(2);
            priceElement.textContent = `${baseCurrency === 'BRL' ? 'R$ ' : (baseCurrency === 'USD' ? '$' : '')}${price}`;
        })
        .catch(error => console.error('Erro:', error));
    });
}

// Função para iniciar o intervalo de atualização de preços
function startInterval(func) {
    return setInterval(func, 1500);
}

// Função para parar o intervalo de atualização de preços
function stopInterval(intervalID) {
    clearInterval(intervalID);
}

// Função para buscar o histórico de preços da criptomoeda
async function fetchCryptoHistory(crypto, startDate, endDate) {
    const response = await fetch(`${apiUrl}/exchangerate/${crypto}/USD/history?period_id=1DAY&time_start=${startDate}&time_end=${endDate}`, {
        headers: {
            'X-CoinAPI-Key': apiKey
        }
    });

    if (!response.ok) {
        console.error('Failed to fetch crypto history');
        return;
    }

    const data = await response.json();
    return data;
}

// Função para exibir o gráfico da criptomoeda selecionada
async function displayChart(currency) {
    const data = await fetchMarketData(currency);
    renderChart(data);
}

// Função para buscar dados de mercado da criptomoeda
async function fetchMarketData(currency) {
    const url = `${apiUrl}/exchangerate/BTC/${currency}/history?period_id=1DAY&time_start=2022-01-01T00:00:00`;
    
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

// Função para renderizar o gráfico
function renderChart(data) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    const labels = data.map(entry => entry.time_period_start.split('T')[0]);
    const prices = data.map(entry => entry.rate_close);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
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
                        text: 'Price'
                    }
                }
            }
        }
    });
}

// Função para atualizar os preços das criptomoedas
function updateCryptoPrices() {
    fetch(`${apiUrl}/exchangerate/BTC/USD`, { headers: { 'X-CoinAPI-Key': apiKey } })
        .then(response => response.json())
        .then(data => {
            const bitcoinPriceElement = document.getElementById('btc-price');
            bitcoinPriceElement.textContent = ` ${data.rate.toFixed(2)}`;
        })
        .catch(error => console.error('Erro:', error));

    fetch(`${apiUrl}/exchangerate/LTC/USD`, { headers: { 'X-CoinAPI-Key': apiKey } })
        .then(response => response.json())
        .then(data => {
            const litecoinPriceElement = document.getElementById('ltc-price');
            litecoinPriceElement.textContent = ` ${data.rate.toFixed(2)}`;
        })
        .catch(error => console.error('Erro:', error));

    fetch(`${apiUrl}/exchangerate/ETH/USD`, { headers: { 'X-CoinAPI-Key': apiKey } })
        .then(response => response.json())
        .then(data => {
            const ethereumPriceElement = document.getElementById('ether-price');
            ethereumPriceElement.textContent = ` ${data.rate.toFixed(2)}`;
        })
        .catch(error => console.error('Erro:', error));
}

// Atualiza os preços das criptomoedas a cada 1.5 segundos
setInterval(updateCryptoPrices, 1500);
updateCryptoPrices();

// Evento de clique para exibir o gráfico da criptomoeda
document.addEventListener('DOMContentLoaded', () => {
    const btcDiv = document.querySelector('.crypto-price.btc');
    const ltcDiv = document.querySelector('.crypto-price.ltc');
    const etherDiv = document.querySelector('.crypto-price.ether');
    
    btcDiv.addEventListener('click', () => displayChart('BTC'));
    ltcDiv.addEventListener('click', () => displayChart('LTC'));
    etherDiv.addEventListener('click', () => displayChart('ETH'));
});

// Evento de carregamento do DOM para buscar e atualizar os preços das criptomoedas
document.addEventListener('DOMContentLoaded', function () {
    fetchCryptoPrices();

    // Atualiza os preços a cada 3 segundos
    setInterval(fetchCryptoPrices, 3000);
});

// Função para buscar e atualizar os preços das criptomoedas
function fetchCryptoPrices() {
    fetch('https://api.coincap.io/v2/assets')
        .then(response => response.json())
        .then(data => {
            const btc = data.data.find(crypto => crypto.symbol === 'BTC');
            const ltc = data.data.find(crypto => crypto.symbol === 'LTC');
            const eth = data.data.find(crypto => crypto.symbol === 'ETH');

            document.getElementById('btc-price').textContent = parseFloat(btc.priceUsd).toFixed(2);
            document.getElementById('ltc-price').textContent = parseFloat(ltc.priceUsd).toFixed(2);
            document.getElementById('eth-price').textContent = parseFloat(eth.priceUsd).toFixed(2);

            // Atualiza o gráfico
            updateChart(btc, ltc, eth);
        })
        .catch(error => console.error('Erro ao buscar preços das criptomoedas:', error));
    }
    
    // Função para atualizar o gráfico com os preços das criptomoedas
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
    

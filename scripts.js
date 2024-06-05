const apiUrl = 'https://rest.coinapi.io/v1';
const apiKey = 'A87977FA-9FC3-4A03-8BC1-68EF634735AB';
const marketDataApiUrl = 'https://rest.coinapi.io';

document.addEventListener('DOMContentLoaded', function () {
    // Navegação entre seções
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.content').forEach(content => {
                content.style.display = 'none';
            });
            const section = document.querySelector(this.getAttribute('href'));
            section.style.display = 'block';
        });
    });

    // Evento de clique nos elementos .crypto-price
    document.querySelectorAll('.crypto-price').forEach(priceBox => {
        priceBox.addEventListener('click', function () {
            const crypto = this.getAttribute('data-crypto');
            showCryptoChart(crypto);
        });
    });

    // Evento de clique nos botões de atualização de preço
    document.getElementById('usd-button').addEventListener('click', () => updatePrices('USD'));
    document.getElementById('brl-button').addEventListener('click', () => updatePrices('BRL'));

    // Evento de scroll para o rodapé
    document.addEventListener('scroll', function () {
        const footer = document.getElementById('footer');
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) { // Ajuste para garantir a visibilidade do rodapé
            footer.style.visibility = 'visible';
            footer.style.opacity = '1';
        } else {
            footer.style.visibility = 'hidden';
            footer.style.opacity = '0';
        }
    });

    // Evento de carregamento do DOM para buscar e atualizar os preços das criptomoedas
    fetchCryptoPrices();
    setInterval(fetchCryptoPrices, 3000);
});

// Função para mostrar o gráfico da criptomoeda selecionada
async function showCryptoChart(crypto) {
    const title = document.getElementById('crypto-chart-title');
    title.textContent = `${crypto} Price Chart`;

    const ctx = document.getElementById('crypto-chart').getContext('2d');

    // Destruir o gráfico existente se houver
    if (window.cryptoChart) {
        window.cryptoChart.destroy();
    }

    // Obter dados dos últimos 7 dias
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const data = await fetchCryptoHistory(crypto, startDate.toISOString(), endDate.toISOString());

    if (data) {
        const labels = data.map(entry => entry.time_period_start.split('T')[0]);
        const prices = data.map(entry => entry.rate_close);

        window.cryptoChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${crypto} Price`,
                    data: prices,
                    backgroundColor: 'rgba(123, 104, 238, 0.2)',
                    borderColor: 'rgba(123, 104, 238, 1)',
                    borderWidth: 5
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

        document.getElementById('crypto-chart-card').style.display = 'block';
    } else {
        console.error('Failed to fetch crypto history');
    }
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

// Função para atualizar os preços das criptomoedas
function updatePrices(baseCurrency) {
    const currencies = ['BTC', 'LTC', 'ETH'];
    currencies.forEach(currency => {
        fetch(`${apiUrl}/exchangerate/${currency}/${baseCurrency}`, {
            headers: {
                'X-CoinAPI-Key': apiKey
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching currency prices');
            }
            return response.json();
        })
        .then(data => {
            const priceElement = document.getElementById(`${currency.toLowerCase()}-price`);
            const price = data.rate.toFixed(2);
            priceElement.textContent = `${baseCurrency === 'BRL' ? 'R$ ' : (baseCurrency === 'USD' ? '$' : '')}${price}`;
        })
        .catch(error => console.error('Error:', error));
    });
}

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

        // Exibe o contêiner do gráfico
        document.getElementById('chart-container').style.display = 'block';
    }
    
    // Atualize o evento de clique para exibir o gráfico da criptomoeda
document.addEventListener('DOMContentLoaded', () => {
    const btcDiv = document.querySelector('.crypto-price.btc');
    const ltcDiv = document.querySelector('.crypto-price.ltc');
    const etherDiv = document.querySelector('.crypto-price.ether');
    
    btcDiv.addEventListener('click', () => displayChart('BTC'));
    ltcDiv.addEventListener('click', () => displayChart('LTC'));
    etherDiv.addEventListener('click', () => displayChart('ETH'));
});

// Atualize a função para buscar e atualizar os preços das criptomoedas
async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coincap.io/v2/assets');
        if (!response.ok) {
            throw new Error('Erro ao buscar preços das criptomoedas');
        }
        const data = await response.json();
        const btc = data.data.find(crypto => crypto.symbol === 'BTC');
        const ltc = data.data.find(crypto => crypto.symbol === 'LTC');
        const eth = data.data.find(crypto => crypto.symbol === 'ETH');

        document.getElementById('btc-price').textContent = parseFloat(btc.priceUsd).toFixed(2);
        document.getElementById('ltc-price').textContent = parseFloat(ltc.priceUsd).toFixed(2);
        document.getElementById('eth-price').textContent = parseFloat(eth.priceUsd).toFixed(2);

        // Atualiza o gráfico
        updateChart(btc, ltc, eth);
    } catch (error) {
        console.error('Erro ao buscar preços das criptomoedas:', error);
    }
}

// Atualize a função para exibir o gráfico da criptomoeda selecionada
async function displayChart(currency) {
    try {
        const data = await fetchMarketData(currency);
        renderChart(data);
    } catch (error) {
        console.error('Erro ao exibir gráfico:', error);
    }
}

// Atualize a função para buscar dados de mercado da criptomoeda
async function fetchMarketData(currency) {
    try {
        const url = `${apiUrl}/exchangerate/BTC/${currency}/history?period_id=1DAY&time_start=2022-01-01T00:00:00`;
        const response = await fetch(url, {
            headers: {
                'X-CoinAPI-Key': apiKey
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar dados de mercado da criptomoeda');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados de mercado da criptomoeda:', error);
    }
}

    
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
    
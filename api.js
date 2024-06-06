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

// Event listeners para os botões de USD e BRL
document.getElementById('usd-button').addEventListener('click', () => {
    // Para o intervalo atual e inicia um novo para atualizar os preços em USD
    stopInterval(intervalID);
    intervalID = startInterval(() => updatePrices('USD'));
});

document.getElementById('brl-button').addEventListener('click', () => {
    // Para o intervalo atual e inicia um novo para atualizar os preços em BRL
    stopInterval(intervalID);
    intervalID = startInterval(() => updatePrices('BRL'));
});

// Inicia o intervalo de atualização de preços em USD por padrão
let intervalID = startInterval(() => updatePrices('USD'));


// Função para buscar o histórico de preços da criptomoeda
async function fetchCryptoHistory(crypto, startDate, endDate) {
    const response = await fetch(`https://rest.coinapi.io/v1/exchangerate/${crypto}/USD/history?period_id=1DAY&time_start=${startDate}&time_end=${endDate}`, {
        headers: {
            'X-CoinAPI-Key': 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'
        }
    });

    if (!response.ok) {
        console.error('Failed to fetch crypto history');
        return;
    }

    const data = await response.json();
    return data;
}

// Event listeners para os botões de USD e BRL
document.getElementById('usd-button').addEventListener('click', () => {
    // Para o intervalo atual e inicia um novo para atualizar os preços em USD
    stopInterval(intervalID);
    intervalID = startInterval(() => updatePrices('USD'));
    displayChart('USD'); // Atualiza o gráfico para exibir dados em USD
});

document.getElementById('brl-button').addEventListener('click', () => {
    // Para o intervalo atual e inicia um novo para atualizar os preços em BRL
    stopInterval(intervalID);
    intervalID = startInterval(() => updatePrices('BRL'));
    displayChart('BRL'); // Atualiza o gráfico para exibir dados em BRL
});

async function displayChart(currency) {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.style.display = 'block';
    
    const data = await fetchMarketData(currency);
    renderChart(data);
}

async function fetchMarketData(currency) {
    const url = `${marketDataApiUrl}/v1/exchangerate/BTC/${currency}/history?period_id=1DAY&time_start=2022-01-01T00:00:00`;
    
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
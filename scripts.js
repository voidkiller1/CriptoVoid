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


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

    //footer scroll
    document.addEventListener('scroll', function() {
        var footer = document.getElementById('footer');
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) { // Ajuste para garantir a visibilidade do rodapé
            footer.style.visibility = 'visible';
            footer.style.opacity = '1';
        } else {
            footer.style.visibility = 'hidden';
            footer.style.opacity = '0';
        }
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

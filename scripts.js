document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const contentSections = document.querySelectorAll(".content");

                contentSections.forEach(section => {
                    section.style.display = "none";
                });

                targetSection.style.display = "block";
            }
        });
    });

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
});

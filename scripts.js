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

    const mouseLight = document.createElement("div");
    mouseLight.classList.add("mouse-light");
    document.body.appendChild(mouseLight);

    document.addEventListener("mousemove", function (event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        mouseLight.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    fetch('https://rest.coinapi.io/v1/exchangerate/BTC/USD', {
        headers: {
            'X-CoinAPI-Key': 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'
        }
    })
    .then(response => response.json())
    .then(data => {
        const bitcoinPriceElement = document.getElementById('btc-price');
        bitcoinPriceElement.textContent = `R$ ${data.rate.toFixed(2)}`;
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
        litecoinPriceElement.textContent = `R$ ${data.rate.toFixed(2)}`;
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
        ethereumPriceElement.textContent = `R$ ${data.rate.toFixed(2)}`;
    })
    .catch(error => console.error('Erro:', error));
});

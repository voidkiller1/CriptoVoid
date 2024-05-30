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

    // Adiciona o elemento mouse-light ao corpo do documento
    const mouseLight = document.createElement("div");
    mouseLight.classList.add("mouse-light");
    document.body.appendChild(mouseLight);

    // Atualiza a posição do elemento mouse-light conforme o movimento do mouse
    document.addEventListener("mousemove", function (event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        mouseLight.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Faz a chamada à API CoinAPI
    fetch('https://rest.coinapi.io/v1/exchangerate/BTC/USD', {
        headers: {
            'X-CoinAPI-Key': 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Manipula os dados recebidos da API aqui
        console.log(data);
        // Por exemplo, você pode atualizar o conteúdo de algum elemento HTML com esses dados
        const bitcoinPriceElement = document.getElementById('btc-price');
        bitcoinPriceElement.textContent = `R$ ${data.rate.toFixed(2)}`; // Supondo que 'rate' seja a propriedade que contém o preço do Bitcoin em relação ao dólar
    })
    .catch(error => console.error('Erro:', error));

    fetch('https://rest.coinapi.io/v1/exchangerate/LTC/USD', {
        headers: {
            'X-CoinAPI-Key': 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Manipula os dados recebidos da API aqui
        console.log(data);
        // Por exemplo, você pode atualizar o conteúdo de algum elemento HTML com esses dados
        const litecoinPriceElement = document.getElementById('ltc-price');
        litecoinPriceElement.textContent = `R$ ${data.rate.toFixed(2)}`; // Supondo que 'rate' seja a propriedade que contém o preço do Litecoin em relação ao dólar
    })
    .catch(error => console.error('Erro:', error));

    fetch('https://rest.coinapi.io/v1/exchangerate/ETH/USD', {
        headers: {
            'X-CoinAPI-Key': 'A87977FA-9FC3-4A03-8BC1-68EF634735AB'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Manipula os dados recebidos da API aqui
        console.log(data);
        // Por exemplo, você pode atualizar o conteúdo de algum elemento HTML com esses dados
        const ethereumPriceElement = document.getElementById('ether-price');
        ethereumPriceElement.textContent = `R$ ${data.rate.toFixed(2)}`; // Supondo que 'rate' seja a propriedade que contém o preço do Ethereum em relação ao dólar
    })
    .catch(error => console.error('Erro:', error));
});

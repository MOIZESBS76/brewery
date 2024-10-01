// Seleciona elementos do DOM para manipulação
const breweryListElement = document.getElementById('breweryList'); // A lista desordenada onde as cervejarias serão exibidas
const detailsElement = document.getElementById('details'); // O elemento que mostrará os detalhes de uma cervejaria selecionada
const favoritesElement = document.getElementById('favorites'); // A lista desordenada que mostrará as cervejarias marcadas como favoritas
const breweryFilterElement = document.getElementById('breweryFilter'); // Campo de entrada que servirá para filtrar a lista de cervejarias

// Inicializa variáveis para armazenar dados
let allBreweries = []; // Armazena todas as cervejarias recebidas da API
let favorites = JSON.parse(localStorage.getItem('favoriteBreweries')) || []; // Recupera favoritos armazenados ou inicia com um array vazio

// Função para buscar as cervejarias usando a API Open Brewery DB
function fetchBreweries() {
    fetch("https://api.openbrewerydb.org/v1/breweries") // Realiza uma requisição à API de cervejarias
        .then(response => response.json()) // Converte a resposta da API para formato JSON
        .then(data => {
            allBreweries = data; // Armazena os dados obtidos na variável 'allBreweries'
            displayBreweries(allBreweries); // Chama a função para exibir todas as cervejarias na página
            displayFavorites(); // Chama a função para exibir as cervejarias favoritas
        })
        .catch(error => console.error('Erro ao obter cervejarias:', error)); // Loga um erro, caso ocorra, durante a requisição
}

// Função para exibir a lista de cervejarias
function displayBreweries(breweries) {
    breweryListElement.innerHTML = ''; // Limpa a lista atual antes de atualizá-la
    breweries.forEach(brewery => { // Percorre cada cervejaria obtida
        const li = document.createElement('li'); // Cria um elemento de lista para a cervejaria
        li.textContent = brewery.name; // Define o texto do item como o nome da cervejaria

        const button = document.createElement('button'); // Cria um botão para alternar favoritos
        updateButtonState(button, brewery); // Configura o texto e a ação do botão de acordo com o estado atual de favoritismo

        button.style.display = 'none'; // Inicialmente, esconde o botão do usuário

        li.onclick = () => {
            showDetails(brewery); // Mostra os detalhes da cervejaria selecionada
            toggleButtonVisibility(button); // Alterna a visibilidade do botão sempre que o item é clicado
        };

        li.appendChild(button); // Adiciona o botão ao item específico da lista
        breweryListElement.appendChild(li); // Adiciona o item à lista do DOM
    });
}

// Função para alternar a visibilidade de um botão
function toggleButtonVisibility(button) {
    if (button.style.display === 'none') { // Se o botão estiver oculto, faça-o aparecer
        button.style.display = 'inline';
    } else { // Se o botão estiver visível, faça-o desaparecer
        button.style.display = 'none';
    }
}

// Função para mostrar detalhes da cervejaria
function showDetails(brewery) {
    detailsElement.innerHTML = `
        <h2>${brewery.name}</h2>
        <p>Tipo: ${brewery.brewery_type}</p>
        <p>Localização: ${brewery.city}, ${brewery.state}</p>
        <p>Site: <a href="${brewery.website_url}" target="_blank">Visitar site</a></p>
    `; // Atualiza o conteúdo HTML para exibir os detalhes atuais da cervejaria
}

// Função para adicionar ou remover cerveja do armazenamento local e atualizar exibição
function toggleFavorite(brewery) {
    const isFavorite = favorites.some(fav => fav.id === brewery.id); // Verifica se a cervejaria já está entre os favoritos
    if (isFavorite) {
        favorites = favorites.filter(fav => fav.id !== brewery.id); // Remove dos favoritos filtrando por ID
    } else {
        favorites.push(brewery); // Adiciona a cervejaria aos favoritos
    }
    localStorage.setItem('favoriteBreweries', JSON.stringify(favorites)); // Atualiza o localStorage com a nova lista de favoritos
    displayBreweries(allBreweries); // Reatualiza a exibição de cervejarias
    displayFavorites(); // E os favoritos também
}

// Atualiza o texto e vinculação de eventos de um botão
function updateButtonState(button, brewery) {
    const isFavorite = favorites.some(fav => fav.id === brewery.id); // Checa se já é favorito
    button.textContent = isFavorite ? 'Remover Favorito' : 'Adicionar aos Favoritos'; // Define o texto do botão
    button.onclick = (event) => {
        event.stopPropagation(); // Impede o clique de propagar até o item da lista
        toggleFavorite(brewery); // Alterna o status de favorito
    };
}

// Função para exibir as cervejarias favoritas na lista
function displayFavorites() {
    favoritesElement.innerHTML = ''; // Limpa a lista de favoritos
    favorites.forEach(brewery => { // Percorre as cervejarias favoritas
        const li = document.createElement('li'); // Cria um item de lista para cada favorite
        li.textContent = brewery.name; // Define o nome da cervejaria como texto do item
        li.onclick = () => showDetails(brewery); // Mostra detalhes ao clicar

        const button = document.createElement('button'); // Cria um botão de remoção de favoritos
        button.textContent = 'Remover Favorito'; // Define o texto do botão
        button.onclick = (event) => {
            event.stopPropagation(); // Impede que o clique no botão afete o clique no item da lista
            toggleFavorite(brewery); // Remove a cervejaria da lista de favoritos
        };
        li.appendChild(button); // Anexa o botão ao item de lista
        favoritesElement.appendChild(li); // Adiciona o item ao DOM dos favoritos
    });
}

// Adiciona um ouvinte para o campo de filtro para realizar buscas
breweryFilterElement.addEventListener('input', (event) => {
    const searchQuery = event.target.value.toLowerCase(); // Obtém o valor do input e converte-o para minúsculas
    const filteredBreweries = allBreweries.filter(brewery =>
        brewery.name.toLowerCase().includes(searchQuery)); // Filtra as cervejarias onde o nome possui a query
    displayBreweries(filteredBreweries); // Exibe as cervejarias que atendem ao filtro
});

// Inicializa a busca de dados ao carregar a página
fetchBreweries();

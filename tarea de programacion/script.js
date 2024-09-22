const URL = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=9';
const BASE_URL_POKEMON = 'https://pokeapi.co/api/v2/pokemon/';

// Función para obtener y mostrar Pokémon en la galería
const getPokemons = async (url) => {
    const pokemonList = await fetch(url);
    const pokemonListJSON = await pokemonList.json();
    agregarFuncionalidadBotones(pokemonListJSON.next, pokemonListJSON.previous);

    const cardsContainer = document.querySelector('#pokemon-cards');
    cardsContainer.innerHTML = ''; // Limpiamos el contenedor antes de agregar nuevas tarjetas

    pokemonListJSON.results.forEach(async (pokemon) => {
        if (pokemon) {
            await setDataInCard(pokemon.url);
        }
    });
};

// Funcionalidad de los botones de paginación
const agregarFuncionalidadBotones = (URLnext, URLprevious) => {
    const btnAnterior = document.querySelector('.anterior');
    const btnSiguiente = document.querySelector('.siguiente');

    if (URLnext) {
        btnSiguiente.style.display = 'block';
        btnSiguiente.onclick = () => getPokemons(URLnext);
    } else {
        btnSiguiente.style.display = 'none';
    }

    if (URLprevious) {
        btnAnterior.style.display = 'block';
        btnAnterior.onclick = () => getPokemons(URLprevious);
    } else {
        btnAnterior.style.display = 'none';
    }
};

// Función para renderizar cada Pokémon en una tarjeta
const setDataInCard = async (urlData) => {
    try {
        const dataPokemon = await fetch(urlData);
        const dataPokemonJSON = await dataPokemon.json();

        const cardsContainer = document.querySelector('#pokemon-cards');

        const colDiv = document.createElement('div');
        colDiv.classList.add('col-md-4', 'animate__animated', 'animate__fadeInUp');

        const card = document.createElement('div');
        card.classList.add('card', 'mb-4');

        const img = document.createElement('img');
        img.src = dataPokemonJSON.sprites.front_default || 'https://via.placeholder.com/150';
        img.classList.add('card-img-top', 'pokemon-img-hover');
        img.alt = `Imagen de ${dataPokemonJSON.name}`;

        // Añadir evento de animación al hover
        img.addEventListener('mouseover', function () {
            img.classList.add('animate__animated', 'animate__pulse');
        });

        img.addEventListener('mouseout', function () {
            img.classList.remove('animate__animated', 'animate__pulse');
        });

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = dataPokemonJSON.name;

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = `Experiencia: ${dataPokemonJSON.base_experience}`;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(img);
        card.appendChild(cardBody);
        colDiv.appendChild(card);
        cardsContainer.appendChild(colDiv);

    } catch (error) {
        console.log('Error al cargar los datos del Pokémon:', error);
    }
};

// Función de búsqueda por nombre
const btnBuscar = document.querySelector('#btnBuscar');
btnBuscar.addEventListener('click', function () {
    const nombrePokemon = document.querySelector('#buscarPokemon').value.toLowerCase();
    if (nombrePokemon) {
        buscarPokemonPorNombre(nombrePokemon);
    }
});

const buscarPokemonPorNombre = async (nombrePokemon) => {
    try {
        const url = `${BASE_URL_POKEMON}${nombrePokemon}`;
        const dataPokemon = await fetch(url);
        if (!dataPokemon.ok) {
            throw new Error('No se encontró el Pokémon');
        }

        const cardsContainer = document.querySelector('#pokemon-cards');
        cardsContainer.innerHTML = ''; // Limpiamos el contenedor antes de agregar el Pokémon buscado

        await setDataInCard(url);

    } catch (error) {
        console.log('Error al buscar el Pokémon:', error);
        alert('No se encontró el Pokémon con ese nombre');
    }
};

// Cargar los primeros 20 Pokémon al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    getPokemons(URL);
});

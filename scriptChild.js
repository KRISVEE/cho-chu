$(document).ready(function () {
  console.log('Document is ready!');

  // Initialize the Leaflet map
  const map = L.map('world-map', {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
  }).setView([20, 0], 2);

  // Add a tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  console.log('World map initialized!');

  // Variables
  let totalChildCount = 0;
  const totalChildCountElement = document.getElementById('total-child-count');
  const countryListElement = document.getElementById('country-list');
  const countryCounts = {};

  // Fetch all countries from the REST Countries API
  let countries = [];
  let totalPopulation = 0;
  fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
      countries = data
        .map(country => ({
          code: country.cca2,
          name: country.name.common,
          flag: country.flags.png,
          latlng: country.latlng,
          population: country.population,
        }))
        .sort((a, b) => b.population - a.population);

      totalPopulation = countries.reduce((sum, country) => sum + country.population, 0);

      console.log('Countries fetched:', countries);
      console.log('Total population:', totalPopulation);

      // Load GeoJSON data for country outlines
      fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(geoJsonData => {
          L.geoJSON(geoJsonData, {
            style: {
              color: '#ddd',
              weight: 1,
              fillOpacity: 0.2,
            },
            onEachFeature: (feature, layer) => {
              layer.on('mouseover', () => {
                layer.setStyle({
                  color: '#ff0000',
                  weight: 2,
                });
                layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'top' }).openTooltip();
              });

              layer.on('mouseout', () => {
                layer.setStyle({
                  color: '#ddd',
                  weight: 1,
                });
                layer.closeTooltip();
              });
            },
          }).addTo(map);

          console.log('GeoJSON data loaded!');
        })
        .catch(error => console.error('Error fetching GeoJSON data:', error));

      updateCountryList();
    })
    .catch(error => console.error('Error fetching countries:', error));

  // Simulate real-time child births
  setInterval(() => {
    console.log('Simulating child births...');

    const numberOfBirths = Math.floor(Math.random() * 10) + 1;

    for (let i = 0; i < numberOfBirths; i++) {
      totalChildCount++;
      totalChildCountElement.textContent = totalChildCount;

      if (totalChildCount % 50 === 0) {
        const babyCrySound = document.getElementById('baby-cry-sound');
        babyCrySound.play();
        console.log('Baby cry sound played!');
      }

      const country = getCountryByPopulation();
      console.log('Selected country:', country);

      if (!countryCounts[country.code]) {
        countryCounts[country.code] = 1;
      } else {
        countryCounts[country.code]++;
      }

      // Fixed: Pass latitude and longitude as a single array
      const marker = L.marker([country.latlng[0], country.latlng[1]], {
        icon: L.divIcon({ className: 'blink-marker', html: '👶' }),
      }).addTo(map);

      setTimeout(() => {
        map.removeLayer(marker);
      }, 1000);
    }

    updateCountryList();
  }, 2000);

  // Helper function to get a country based on population
  function getCountryByPopulation() {
    const randomValue = Math.random() * totalPopulation;
    let cumulativePopulation = 0;
    for (const country of countries) {
      cumulativePopulation += country.population;
      if (randomValue <= cumulativePopulation) {
        return country;
      }
    }
  }

  // Function to update the country list
  function updateCountryList() {
    const sortedCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => ({
        code,
        count,
        ...countries.find(country => country.code === code),
      }));

    countryListElement.innerHTML = '';

    sortedCountries.forEach(({ code, count, name, flag }) => {
      const listItem = document.createElement('li');
      listItem.id = `country-${code}`;
      listItem.innerHTML = `
        <img src="${flag}" alt="${name}" width="30" height="20">
        <span>${name}: <span class="count">${count}</span></span>
      `;
      countryListElement.appendChild(listItem);
    });
  }

  // Reset button functionality
  document.getElementById('reset-button').addEventListener('click', () => {
    totalChildCount = 0;
    totalChildCountElement.textContent = totalChildCount;
    countryListElement.innerHTML = '';
    Object.keys(countryCounts).forEach(code => delete countryCounts[code]);
  });

  // Shuffle "You May Also Like" games
  const recommendedGames = [
    { name: 'Game 1', image: 'Images/BABYSHOWERPC.jpg', link: 'ChildBirth.html' },
    { name: 'Game 2', image: 'Images/Drawaperfectcircle.jpg', link: 'DrawCircle.html' },
    { name: 'Game 3', image: 'Images/Drawaperfetsquare.jpg', link: 'DrawSquare.html' },
    { name: 'Game 4', image: 'Images/logoGame.jpg', link: 'logoGame.html' },
  ];

  function shuffleGames() {
    const shuffledGames = recommendedGames.sort(() => Math.random() - 0.5);
    const gameList = document.querySelector('.game-list');
    gameList.innerHTML = '';
    shuffledGames.forEach(game => {
      const gameBanner = document.createElement('div');
      gameBanner.className = 'game-banner';
      gameBanner.onclick = () => window.location.href = game.link;
      gameBanner.innerHTML = `
        <img src="${game.image}" alt="${game.name}">
      `;
      gameList.appendChild(gameBanner);
    });
  }

  // Shuffle games on page load
  shuffleGames();
});
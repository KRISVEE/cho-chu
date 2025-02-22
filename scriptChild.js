$(document).ready(function () {
  console.log('Document is ready!'); // Debugging

  // Initialize the Leaflet map
  const map = L.map('world-map', {
    zoomControl: false, // Disable zoom controls
    scrollWheelZoom: false, // Disable zooming with the mouse wheel
    doubleClickZoom: false, // Disable zooming on double click
    dragging: false, // Disable panning
  }).setView([20, 0], 2); // Center the map and set zoom level

  // Add a tile layer (you can use OpenStreetMap or other tile providers)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  console.log('World map initialized!'); // Debugging

  // Variables
  let totalChildCount = 0;
  const totalChildCountElement = document.getElementById('total-child-count');
  const countryListElement = document.getElementById('country-list');

  // Object to track child counts for each country
  const countryCounts = {};

  // Fetch all countries from the REST Countries API
  let countries = [];
  let totalPopulation = 0;
  fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
      // Map and sort countries by population (descending)
      countries = data
        .map(country => ({
          code: country.cca2, // Country code (e.g., "IN" for India)
          name: country.name.common, // Country name
          flag: country.flags.png, // Country flag URL
          latlng: country.latlng, // Latitude and longitude
          population: country.population, // Population
        }))
        .sort((a, b) => b.population - a.population); // Sort by population (descending)

      // Calculate total population of all countries
      totalPopulation = countries.reduce((sum, country) => sum + country.population, 0);

      console.log('Countries fetched:', countries); // Debugging
      console.log('Total population:', totalPopulation); // Debugging

      // Load GeoJSON data for country outlines
      fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(geoJsonData => {
          // Add GeoJSON layer to the map
          L.geoJSON(geoJsonData, {
            style: {
              color: '#ddd', // Default border color
              weight: 1, // Border width
              fillOpacity: 0.2, // Fill opacity
            },
            onEachFeature: (feature, layer) => {
              // Add hover effects
              layer.on('mouseover', () => {
                layer.setStyle({
                  color: '#ff0000', // Highlight border color
                  weight: 2, // Highlight border width
                });
                layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'top' }).openTooltip();
              });

              layer.on('mouseout', () => {
                layer.setStyle({
                  color: '#ddd', // Reset border color
                  weight: 1, // Reset border width
                });
                layer.closeTooltip();
              });
            },
          }).addTo(map);

          console.log('GeoJSON data loaded!'); // Debugging
        })
        .catch(error => console.error('Error fetching GeoJSON data:', error));

      // Initialize the country list
      updateCountryList();
    })
    .catch(error => console.error('Error fetching countries:', error));

  // Simulate real-time child births
  setInterval(() => {
    console.log('Simulating child births...'); // Debugging

    // Randomize the number of births (e.g., between 1 and 10)
    const numberOfBirths = Math.floor(Math.random() * 10) + 1;

    // Simulate multiple births
    for (let i = 0; i < numberOfBirths; i++) {
      // Increment total child count
      totalChildCount++;
      totalChildCountElement.textContent = totalChildCount;

      // Play baby cry sound if child count is a multiple of 50
      if (totalChildCount % 50 === 0) {
        const babyCrySound = document.getElementById('baby-cry-sound');
        babyCrySound.play();
        console.log('Baby cry sound played!'); // Debugging
      }

      // Select a country based on population
      const country = getCountryByPopulation();
      console.log('Selected country:', country); // Debugging

      // Update the country's child count
      if (!countryCounts[country.code]) {
        countryCounts[country.code] = 1;
      } else {
        countryCounts[country.code]++;
      }

      // Add a baby emoji marker to the map
      const marker = L.marker([country.latlng[0], country.latlng[1]], {
        icon: L.divIcon({ className: 'blink-marker', html: '👶' }),
      }).addTo(map);

      setTimeout(() => {
        map.removeLayer(marker); // Remove the marker after 1 second
      }, 1000);
    }

    // Update the country list with sorted countries
    updateCountryList();
  }, 2000); // Simulate births every 2 seconds

  // Helper function to get a country based on population
  function getCountryByPopulation() {
    // Generate a random number between 0 and totalPopulation
    const randomValue = Math.random() * totalPopulation;

    // Find the country where the random value falls within its population range
    let cumulativePopulation = 0;
    for (const country of countries) {
      cumulativePopulation += country.population;
      if (randomValue <= cumulativePopulation) {
        return country;
      }
    }
  }

  // Function to update the country list with sorted countries
  function updateCountryList() {
    // Convert countryCounts to an array and sort by count in descending order
    const sortedCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
      .map(([code, count]) => ({
        code,
        count,
        ...countries.find(country => country.code === code),
      }));

    // Clear the existing country list
    countryListElement.innerHTML = '';

    // Add sorted countries to the list
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
    countryListElement.innerHTML = ''; // Clear the country list
    Object.keys(countryCounts).forEach(code => delete countryCounts[code]); // Reset country counts
  });

  // Shuffle "You May Also Like" games
  const recommendedGames = [
    { name: 'Game 1', image: 'game1.jpg', link: 'game1.html' },
    { name: 'Game 2', image: 'game2.jpg', link: 'game2.html' },
    { name: 'Game 3', image: 'game3.jpg', link: 'game3.html' },
    { name: 'Game 4', image: 'game4.jpg', link: 'game4.html' },
  ];

  function shuffleGames() {
    const shuffledGames = recommendedGames.sort(() => Math.random() - 0.5);
    const gameList = document.querySelector('.game-list');
    gameList.innerHTML = ''; // Clear existing games
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

  setTimeout(() => {
    map.removeLayer(marker); // Remove the marker after 1 second
  }, 1000);
});
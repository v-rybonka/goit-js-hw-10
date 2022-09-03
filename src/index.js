import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const { input, countryInfo, countryList } = refs;

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function cleanCountryList() {
  countryList.innerHTML = '';
}
function cleanCountryInfo() {
  countryInfo.innerHTML = '';
}

function onInputChange() {
  let inputValue = input.value.toLowerCase().trim();

  if (!inputValue) {
    Notify.info('Write the name of the country');
    cleanCountryList();
    cleanCountryInfo();
    return;
  }
  if (inputValue !== ' ') {
    fetchCountries(inputValue)
      .then(response => {
        if (!response.ok || response.status === 404) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(countries => {
        let listCountries = countries.length;

        if (listCountries > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
        if (listCountries >= 2 && listCountries <= 10) {
          Notify.success('success');
          cleanCountryInfo();
          renderCountryList(countries);
        }
        if (listCountries === 1) {
          cleanCountryList();
          renderCountryDiv(countries);
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        error;
        cleanCountryList();
        cleanCountryInfo();
      });
  }
}
function renderCountryList(countries) {
  countryList.innerHTML = countries
    .map(
      ({ flags, name }) =>
        `<li class="item"><img src="${flags.svg}" alt="${name.official}" width="60px" height="40px" class="flag">
      <p class="text"> ${name.official}</p></li>`
    )
    .join('');

  console.log(renderCountryList);
}

function renderCountryDiv(countries) {
  countryInfo.innerHTML = countries
    .map(
      ({ flags, name, capital, population, languages }) =>
        `<img src="${flags.svg}" alt="${
          name.official
        }" width="60px" height="40px" class="flag">
        <h1 class="country-name"> ${name.official}</h1>
        <p class="text"><span class="text-span">Capital:</span> ${capital}</p>
        <p class="text"><span class="text-span">Population:</span> ${population}</p>
        <p class="text"><span class="text-span">Languages:</span> ${Object.values(
          languages
        ).join(', ')}</p>`
    )
    .join('');
}

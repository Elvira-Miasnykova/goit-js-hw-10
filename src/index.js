import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

import NewsApiService from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const newsApiService = new NewsApiService();

const refs = {
    input: document.querySelector('#search-box'),
    countriesList: document.querySelector(".country-list"),
    countryInf: document.querySelector(".country-info"),
    
};

refs.input.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
    const inputValue = refs.input.value.trim();

  if (!inputValue) {
    refs.countriesList.innerHTML = "";
    refs.countryInf.innerHTML = "";
    return;
  }
    newsApiService.query = inputValue;
    newsApiService.fetchCountries().then(renderCountry);
 
}

//  if (inputValue.length >= 10)
//     Notify.warning("Too many matches found. Please enter a more specific name.");

function renderCountry(countries) {
  if (countries.length > 10) {
    Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  
  if (countries.length > 1 && countries.length < 10) {
    refs.countriesList.innerHTML = "";
    refs.countryInf.innerHTML = "";
    refs.countriesList.insertAdjacentHTML(
      'beforeend', markupCountryList(countries));
  }

  if (countries.length === 1) {
    refs.countriesList.innerHTML = "";
    refs.countryInf.innerHTML = "";
    refs.countryInf.insertAdjacentHTML(
      'beforeend', markupCountryInfo(countries));
  }
}

function markupCountryList(countries) {
  return countries.map((country) => {
    return `
          <div class ='country-info-container'>
                <img class='country-info__img' src='${country.flags.svg}' alt='{country.name.official}' width='40' height='35' />
                <span>${country.name.official}</span>
            </div>
           
      `;
  })
    .join("");
}

function markupCountryInfo(countries) {
  return countries.map((country) => {
    return `
          <div class ='country-info-container'>
                <img class='country-info__img' src='${country.flags.svg}' alt='${country.name.official}' width='60' height='40' />
                <span class='country-info__name'>${country.name.official}</span>
            </div>
            <p><span class='country-info__desc'>Capital: </span>${country.capital}</p>
            <p><span class='country-info__desc'>Population: </span>${country.population}</p>
            <p><span class='country-info__desc'>Languages: </span>${Object.values(country.languages)}</p>
          
      `;
  })
  .join("");
}


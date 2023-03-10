import './css/styles.css';
import { debounce } from 'debounce';
import { fetchCountries } from './fetchCountries';
import { numberWithSpaces } from './numberWithSpaces';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 500;
const ref = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
};

ref.input.addEventListener(
  'input',
  debounce(getCountryOnInput, DEBOUNCE_DELAY)
);

function getCountryOnInput() {
  ref.list.innerHTML = ' ';
  const countryName = ref.input.value.trim();

  if (!countryName) {
    ref.list.innerHTML = ' ';
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.status === 404) {
        Notify.failure('"Oops, there is no country with that name"');
        return;
      }

      if (data.length > 10) {
        Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );

        return;
      }
      generateMarkupList(data);
    })
    .catch(error => console.log(error));
}

function generateMarkupList(data) {
  console.log(data);
  if (data.length === 1) {
    const markup = data
      .map(
        ({ flags, name: countryName, capital, population, languages }) =>
          `  <li class="singlCountryInfo">
           <div><img src=" ${flags.svg}" alt="" width="200"></div>
                <ul>
                  <li><p class="title countryInfoText">${countryName}</p></li>
                  <li><p class="countryInfoText"> Capital: ${capital}</p></li>
                  <li><p class="countryInfoText"> Population: ${numberWithSpaces(
                    population
                  )}</p></li> 
                   <li><p class="countryInfoText">Language:  ${languages.map(
                     item => item.name
                   )}</p></li> 
                </ul>
            </li>`
      )
      .join('');

    ref.list.innerHTML = markup;
  }

  if (data.length > 1 && data.length <= 10) {
    const markup = data
      .map(
        ({ flags, name: countryName }) =>
          `<li> 
          <div class="country-wrapper" > <img src=" ${flags.svg}" alt="" width="100"> <span class="countryInfoText"> ${countryName}</span></div>
        </li>`
      )
      .join('');

    ref.list.innerHTML = markup;
  }
}

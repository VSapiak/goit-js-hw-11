import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const input = document.getElementById('search-form');
const button = document.querySelector('button[type="submit"]');
const loadBtn = document.querySelector('.btn-load');

const gallery = document.querySelector('.gallery');

let value;
let page = 1;
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '35985992-d8d84e240343ff0a838f12f6c';

form.addEventListener('input', inputSearch);
input.addEventListener('submit', submitSearch);
loadBtn.addEventListener('click', loadButton);

// Функція яка приховує loadBtn коли очищається form
function inputSearch(e) {
  value = e.target.value;
  if (value.length < 1) {
    gallery.innerHTML = '';
    loadBtn.classList.add('hidden');
  }
}

function submitSearch(e) {
  e.preventDefault();
  const url = `${BASE_URL}?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  gallery.innerHTML = '';

  fetch(url)
    .then(r => r.json())
    .then(cards => {
      if (cards.total === 0) {
        loadBtn.classList.add('hidden');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${cards.totalHits} images.`);
        bildloadButton(cards);
        loadBtn.classList.remove('hidden');
      }
    })
    .catch(error => console.log(error));
}

function loadButton() {
  page += 1;
  const url = `${BASE_URL}?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  fetch(url)
    .then(r => r.json())
    .then(card => {
      if (card.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (card.hits.length === card.totalHits) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        console.log(card);
        bildloadButton(card);
        loadBtn.classList.remove('hidden');
      }
    })
    .catch(error => console.log(error));
}

function bildloadButton(cards) {
  const markup = cards.hits
    .map(hit => {
      return `
        <div class='all-cards'>
          <div class="photo-card">
            <a href="${hit.largeImageURL}" class="lightbox">
              <img src='${hit.webformatURL}' alt="${hit.tags}" loading="lazy" />
            </a>
            <div class="info">
              <p class="info-item">
                <b>Вподобань: </b>
                <br>
                ${hit.likes}
              </p>
              <p class="info-item">
                <b>Переглядів: </b>
                <br>
                ${hit.views}
              </p>
              <p class="info-item">
                <b>Коментарів: </b>
                <br>
                ${hit.comments}
              </p>
              <p class="info-item">
                <b>Завантажень: </b>
                <br>
                ${hit.downloads}
              </p>
            </div>
          </div>
        </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.lightbox');
  lightbox.refresh();
}

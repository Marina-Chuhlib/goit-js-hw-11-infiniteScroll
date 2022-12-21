import './css/styles.css';
import { GalleryApiService } from './api-service';

import { getGalleryMarkup } from './getGalleryMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryApiService = new GalleryApiService();

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

let response = [];

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const render = () => {
  const gallery = response.hits.map(getGalleryMarkup);
  galleryRef.insertAdjacentHTML('beforeend', gallery.join(''));
};

const resetGallery = () => {
  galleryRef.innerHTML = '';
};

const onSearch = e => {
  e.preventDefault();

  resetGallery();

  const form = e.currentTarget;
  galleryApiService.value = form.elements.searchQuery.value.trim();

  if (galleryApiService.value === '') {
    // observer.unobserve(document.getElementById('#sentinel'));
    return messageNotify();
  }

  galleryApiService.resetPage();
  createImgPage();
};

formRef.addEventListener('submit', onSearch);

async function createImgPage() {
  try {
    response = await galleryApiService.getPictures();

    if (response.totalHits === 0) {
      formRef.reset();
      messageNotify();
      return;
    }

    render();

    Notify.success(`Hooray! We found ${response.totalHits} images.`);

    simpleLightbox.refresh();
  } catch (error) {
    console.log(error.message);
    messageNotify();
  }
}

async function createMoreImgPage() {
  try {
    response = await galleryApiService.getPictures();

    const amount = response.totalHits / galleryApiService.perPages;

    if (amount < galleryApiService.pages) {
      formRef.reset();
      Notify.failure(
        "We're sorry,but you've reached the end of search results."
      );
      observer.unobserve(document.getElementById('#sentinel'));
      return;
    }

    smoothScrollPage();

    render();
    simpleLightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

function inObserver(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && galleryApiService.value !== '') {
      createMoreImgPage();
    }
  });
}

const intersectionObserver = new IntersectionObserver(inObserver, {
  rootMargin: '150px',
});

intersectionObserver.observe(document.querySelector('#sentinel'));

function smoothScrollPage() {
  const { height: cardHeight } =
    galleryRef.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function messageNotify() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

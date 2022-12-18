import './css/styles.css';

import { getPictures } from './getPictures';
import { getGalleryMarkup } from './getGalleryMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

let response = [];
let inputValue = '';
const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
export let page = 1;
export const perPage = 40;

const render = () => {
  const gallery = response.data.hits.map(getGalleryMarkup);
  galleryRef.insertAdjacentHTML('beforeend', gallery.join(''));
};

const resetGallery = () => {
  galleryRef.innerHTML = '';
};

const onSearch = e => {
  e.preventDefault();

  resetGallery();

  page = 1;

  const form = e.currentTarget;
  inputValue = form.elements.searchQuery.value.trim();

  if (!inputValue) {
    return messageNotify();
  }

  async function createImgPage() {
    try {
      response = await getPictures(inputValue);

      await render();

      if (response.data.totalHits === 0) {
        formRef.reset();
        return messageNotify();
      }

      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);

      simpleLightbox.refresh();
    } catch (error) {
      console.log(error.message);
      messageNotify();
    }
  }
  createImgPage();
};

formRef.addEventListener('submit', onSearch);

function inObserver(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && inputValue !== '') {
      page += 1;

      async function createImgPage() {
        try {
          response = await getPictures(inputValue);

          await render();
          smoothScrollPage();
          simpleLightbox.refresh();

          const amount = response.data.totalHits / perPage;

          if (amount < page) {
            observer.unobserve(document.getElementById('#sentinel'));
            formRef.reset();
            Notify.failure(
              "We're sorry,but you've reached the end of search results."
            );
            return;
          }
        } catch (error) {
          console.log(error.message);
          messageNotify();
        }
      }
      createImgPage();
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

import './css/styles.css';
import axios from 'axios';
import { getPictures } from './getPictures';
import { getGalleryMarkup } from './getGalleryMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');

// const { height: cardHeight } =
// document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

loadMoreBtnRef.setAttribute('hidden', true);

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

  // getPictures(inputValue)
  //   .then(({ data }) => {
  //     response = data.hits;

  //     // response.length
  //     if (data.totalHits === 0) {
  //       formRef.reset();
  //       return messageNotify();
  //     }

  //     Notify.success(`Hooray! We found ${data.totalHits} images.`);

  //     // window.scrollBy({
  //     //   top: cardHeight * 2,
  //     //   behavior: 'smooth',
  //     // });

  //     render();

  //     loadMoreBtnRef.removeAttribute('hidden');

  //     simpleLightbox.refresh();
  //   })
  //   .catch(error => {
  //     messageNotify();
  //   });

  // loadMoreBtnRef.setAttribute('hidden', true);

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
      loadMoreBtnRef.removeAttribute('hidden');
    } catch (error) {
      console.log(error.message);
      messageNotify();
    }
  }
  createImgPage();
};

formRef.addEventListener('submit', onSearch);

const onLoadMore = e => {
  page += 1;

  async function createImgPage() {
    try {
      response = await getPictures(inputValue);

      await render();
      simpleLightbox.refresh();

      const amount = Math.ceil(response.data.totalHits / perPage);

      if (amount < page) {
        loadMoreBtnRef.setAttribute('hidden', true);
        formRef.reset();
        Notify.failure(
          "We're sorry,but you've reached the end of search results."
        );
      }
    } catch (error) {
      console.log(error.message);
      messageNotify();
    }
  }
  createImgPage();

  // getPictures(inputValue)
  //   .then(({ data }) => {
  //     response = data.hits;

  //     render();

  //     simpleLightbox.refresh();

  //     const amount = data.totalHits / perPage;
  //     if (amount < page) {
  //       loadMoreBtnRef.setAttribute('hidden', true);
  //       formRef.reset();
  //       Notify.failure(
  //         "We're sorry,but you've reached the end of search results."
  //       );
  //     }
  //   })
  //   .catch(error => {
  //     messageNotify();
  //   });
};

loadMoreBtnRef.addEventListener('click', onLoadMore);

function messageNotify() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

import './css/styles.css';
import { getPictures } from './getPictures';
import { getGalleryMarkup } from './getGalleryMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');
// console.log(formRef);

let inputValue = [];
export let page = 1;
export const perPage = 5;

const render = () => {
  const gallery = inputValue.map(getGalleryMarkup);

  galleryRef.innerHTML = '';
  galleryRef.insertAdjacentHTML('beforeend', gallery.join(''));
};

const onSearch = e => {
  e.preventDefault();

  const form = e.currentTarget;
  inputValue = form.elements.searchQuery.value.trim();

  if (!inputValue) {
    return messageNotify();
  }

  getPictures(inputValue)
    .then(({ data }) => {
      inputValue = data.hits;
      // perPage = data.totalHits;
      // console.log(response.data);
      // console.log(page);

      if (inputValue.length === 0) {
        return messageNotify();
      }

      render();

      new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
      });

      SimpleLightbox.refresh();
    })
    .catch(error => {
      [];
    });
};

render();

formRef.addEventListener('submit', onSearch);

function messageNotify() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

const onLoadMore = e => {
  page += 1;

  getPictures(inputValue)
    .then(({ data }) => {
      inputValue = data.hits;

      // page = data.totalHits;
      // console.log(response.data);
      // console.log(page);

      const gallery = inputValue.map(getGalleryMarkup);

      galleryRef.insertAdjacentHTML('beforeend', gallery.join(''));

      new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
      });
    })
    .catch(error => {
      [];
    });
};

loadMoreBtnRef.addEventListener('click', onLoadMore);

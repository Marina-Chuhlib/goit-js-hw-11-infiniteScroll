import axios from 'axios';

const API_URL = 'https://pixabay.com/api/';
const KEY = '31925489-f049a5b460fb8a2a8423fe357';

export class GalleryApiService {
  constructor() {
    this.inputValue = '';
    this.page = 1;
    this.perPage = 40;
  }

  async getPictures() {
    try {
      const response = await axios.get(
        `${API_URL}?key=${KEY}&q=${this.inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`
      );
      this.page += 1;

      return await response.data;
    } catch (error) {
      throw new Error('Error', error.message);
    }
  }

  resetPage() {
    this.page = 1;
  }

  get value() {
    return this.inputValue;
  }
  set value(newValue) {
    this.inputValue = newValue;
  }

  get pages() {
    return this.page;
  }

  get perPages() {
    return this.perPage;
  }
}

export const getGalleryMarkup = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) => {
  return `<a class="gallery__link" href= '${largeImageURL}' "large-image.jpg">
  <div class="photo-card">
  <img class ="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> <span class ="info-item__value">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views:</b> <span class ="info-item__value">${views}</span> 
    </p>
    <p class="info-item">
      <b>Comments:</b><span class ="info-item__value">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads:</b><span class ="info-item__value">${downloads}</span> 
    </p>
  </div> </div></a>
    `;
};

import View from './View.js';
import icons from 'url:../../img/icons.svg';

export class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your search! Please Try Again ;)';
  _successMessage = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data
      .map(
        result => `
    <li class="preview">
          <a class="preview__link ${
            result.id === id ? 'preview__link--active' : ''
          }" href="#${result.id}">
            <figure class="preview__fig">
              <img src="${result.image}" alt="Test" crossorigin/>
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${result.title}</h4>
              <p class="preview__publisher">${result.publisher}</p>
              
            </div>
          </a>
        </li>
    `
      )
      .join('');
  }
}
export default new ResultsView();

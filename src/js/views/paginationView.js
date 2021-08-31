import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    //event delegation to propagate the event to the buttons
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    //getting the number of pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //console.log(numPages);

    //page 1,and there are other pages(current page no is 1 and the total number of pages is greater than 1)
    if (currentPage === 1 && numPages > 1) {
      return `
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    //last page(current page no is equal to the total number of pages)
    if (currentPage === numPages && numPages > 1) {
      return `
         <button data-goto="${
           currentPage - 1
         }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
      `;
    }
    //someother page
    if (currentPage < numPages) {
      return `
         <button data-goto="${
           currentPage - 1
         } "class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
    //page 1,and there are no other pages
    return '';
  }
}
export default new PaginationView();

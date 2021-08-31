import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @returns {string} A markup string is returned
   * @this {Object} View instance
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    //inserting the markup
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();

    //creating a new DOM element using 'newMarkup' virtually which resides in the memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElement = Array.from(newDOM.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      //updating the changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    //clearing any initial html markup
    this._parentElement.innerHTML = '';
  }

  renderspinner() {
    const markup = `
         <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
         <div class="error">
            <div>
              <svg>
                <use href="src/img/${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._successMessage) {
    const markup = `
         <div class="message">
            <div>
              <svg>
                <use href="src/img/${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
            </div>
            `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

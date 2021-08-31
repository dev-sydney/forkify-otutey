import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
//////////////////////////////////////////////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    //getting the hash from the url search bar
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderspinner();
    //1. Update results view to mark selected elements
    resultsView.update(model.getSearchResultsPage());
    //2. updating the bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //3. Loading the recipe
    await model.loadRecipe(id);

    //4.Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderspinner();
    //1) getting the search query
    const query = searchView.getQuery();
    if (!query) return;
    //2) loading the search query
    await model.loadSearchResults(query);
    model.state.search.page = 1;
    searchView.clearInput();

    //3) rendering the all searched results
    //resultsView.render(model.state.search.results);

    //rendering some of the searched results
    resultsView.render(model.getSearchResultsPage());

    //4) rendering the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (gtp) {
  //1) rendering the NEW all searched results
  resultsView.render(model.getSearchResultsPage(gtp));

  //2) rendering the NEW pagination buttons
  paginationView.render(model.state.search);
  //console.log('pag control');
};

const controlServings = function (newServings) {
  //1) update the recipe servings in the state
  model.updateServings(newServings);

  //2) update the recipe view by overwriting whatever is in the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //Adding / removing a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.removeBookmark(model.state.recipe.id);
  }

  //Updating the recipe View
  recipeView.update(model.state.recipe);

  //Rendering the bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //uploading a new recipe
    await model.uploadRecipe(newRecipe);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView._addHandlerUpload(controlAddRecipe);
  console.log('Welcome back!');
  alert('HACKED');
};

init();
// const testArr = ['a, b', 'd,e'];
// console.log(testArr.split(','));

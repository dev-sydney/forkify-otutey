import { API_URL, KEY } from './config.js';
import { getJSON, sendJSON } from './helper.js';
//this state is needed for storing all the data
export const state = {
  //object to store just one recipe in
  recipe: {},
  //object to store all the searched recipes in
  search: {
    query: '',
    results: [],
    resultsPerPage: 10,
    page: 1,
  },
  bookmarks: [],
};

//responsible for fetching data from the forkify API
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    //extracting the recipe object from the data object using destructuring
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceURL: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    console.log(recipe);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};
/////////////////The Search For-Recipe Feature//////////////////////
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9

  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt = oldQt * newServing/ oldServings 2 * 4/8 = 4

    state.recipe.servings = newServings;
  });
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Adding a bookmark
  state.bookmarks.push(recipe);

  //marking current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};
export const removeBookmark = function (id) {
  //Deleting the bookmark by finding its index position first
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //marking the current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmarks();
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};
init();
console.log(state.bookmarks);

export const uploadRecipe = async function (newRecipe) {
  try {
    //converting the parameter into an array
    console.log(Object.entries(newRecipe));

    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredients format! Please use the correct format :)'
          );

        const [quantity, unit, desciption] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, desciption };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}?=key${KEY}`, recipe);
    console.log(data);
    //console.log(recipe);
  } catch (err) {
    throw err;
  }
};
//sourceurl

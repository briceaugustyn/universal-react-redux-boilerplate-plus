import { combineReducers } from 'redux'
import fetch from 'isomorphic-fetch'

/*
  Action Types as consts. Be sure to namespace to avoid conflicts.
*/
const FETCH_ARTICLES_REQUEST = 'blog/FETCH_ARTICLES_REQUEST'
const FETCH_ARTICLES_SUCCESS = 'blog/FETCH_ARTICLES_SUCCESS'
const FETCH_ARTICLES_FAILURE = 'blog/FETCH_ARTICLES_FAILURE'

const FETCH_ARTICLE_REQUEST = 'blog/FETCH_ARTICLE_REQUEST'
const FETCH_ARTICLE_SUCCESS = 'blog/FETCH_ARTICLE_SUCCESS'
const FETCH_ARTICLE_FAILURE = 'blog/FETCH_ARTICLE_FAILURE'



/*
  REDUCERS (the data responsible for updating the Redux store)
  all reducers are fired off when an action is dispatched. It's up to you to determine what data to return based on the action.type.
*/
const articles = (state = [], action) => {
  switch (action.type) {
  case FETCH_ARTICLES_SUCCESS:
    return action.response
  }

  return state
}
const article = (state = null, action) => {
  switch (action.type) {
  case FETCH_ARTICLE_REQUEST:
    return 'loading'
  case FETCH_ARTICLE_SUCCESS:
    return action.response
  case FETCH_ARTICLE_FAILURE:
    return null
  }

  return state
}

/*

If adding new reducers and new data to the state:
  - Be sure to update "mapStateToProps" in App.js so that data in 'this.props.redux' is correctly sent from App to child components and reflects the actual data in the Redux store.
  - The key in App.js should reflect the same key in combineReducers(), ex App.js : `yourSliceOfState: state.blog.yourSliceOfState`

const exampleReducer = (state="This is the default state", action) => {
  return state
}

*/



/*
  ACTION CREATOR (creates actions)
*/
const fetchAction = (url, types) => dispatch => {
  const [REQUEST, SUCCESS, FAILURE] = types

  if (__SERVER__) {
    url = `http://localhost:3000${ url }`
  }

  dispatch({
    type: REQUEST
  })
  // get the response from the API end-point, trigger success or fail if Error
  return fetch(url)
    .then(
      response => response.json()
    )
    .then(
      response => dispatch({
        type: SUCCESS,
        response
      }),
      error => dispatch({
        type: FAILURE,
        message: error.message
      })
    )
}



/*
  ACTION CREATORs - fires off fetchAction which in turn triggers the "Actions" (actions get "dispatched")
*/
export const fetchArticles = () => fetchAction(
  '/api/articles',
  [FETCH_ARTICLES_REQUEST, FETCH_ARTICLES_SUCCESS, FETCH_ARTICLES_FAILURE]
)

export const fetchArticle = slug => fetchAction(
  `/api/articles/${ slug }`,
  [FETCH_ARTICLE_REQUEST, FETCH_ARTICLE_SUCCESS, FETCH_ARTICLE_FAILURE]
)



/*
  EXAMPLE: a simple action (no action creator needed.)
  say, trigger from a component, when a user sumbits form
*/
/*export const simpleAction__addToMessageBoard = (username, category, theMessage) => {
    return {
        type: ADD_MESSAGE_TO_BOARD,
        username: username,
        category: category,
        theMessage: theMessage
    }
}
*/


/*
  Combines reducer functions together, to manage a specific slice of the state.
  In this case, these 2 reducers are combined and placed in another "combineReducers()" method in the root at "src/reducer.js"
*/
const reducer = combineReducers({
  articles,
  article,
  // yourSliceOfState: exampleReducer
})

export default reducer

import { createStore, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import rootReducer from './rootReducr'
// import storage from 'redux-persist/lib/storage'
const storage = typeof window !== 'undefined' ? {
  getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key: string, value: string) => Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(window.localStorage.removeItem(key)),
} : {
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, _value: string) => Promise.resolve(),
  removeItem: (_key: string) => Promise.resolve(),
};


const persistConfig = {
    key: 'root',
    storage
}
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const persistedReducer = persistReducer<any, any>(persistConfig, rootReducer);
const middleware: any = [thunk]
const composeEnhancers = typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
let store = createStore<any, any>(persistedReducer, composeEnhancers(applyMiddleware(...middleware)))
let persistor = persistStore(store);
export { store, persistor }

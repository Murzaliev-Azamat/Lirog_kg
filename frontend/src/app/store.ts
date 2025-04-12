// Это файл настройки глобального хранилища Redux
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { promotionsReducer } from '../store/promotionsSlice';
import { companiesReducer } from '../store/companiesSlice';
import { categoriesReducer } from '../store/categoriesSlice';
import { filterReducer } from '../store/filterSlice';
import { searchReducer } from '../store/searchSlice';
import { usersReducer } from '../pages/users/usersSlise';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';

const usersPersistConfig = {
  key: 'shop:users',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  promotions: promotionsReducer,
  companies: companiesReducer,
  categories: categoriesReducer,
  filter: filterReducer,
  search: searchReducer,
  users: persistReducer(usersPersistConfig, usersReducer),
});
// Главный(root) reducer (должен принимать предыдущие состояние state и действия action)
// rootReducer запускается не только при создании store, но также и при вызове dispatch(значение попадает в action редьюсера)

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
}); // store - глобальное хранилище, в которое передается rootReducer и функция в rootReduser сразу запускается

export const persistor = persistStore(store);

// export const store = configureStore({
//   reducer: {
//     promotions: promotionsReducer,
//     companies: companiesReducer,
//     categories: categoriesReducer,
//     filter: filterReducer,
//     search: searchReducer,
//   },
// });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/*  Также мы можем подключить подписку на каждое изменение состояния
...
const store = legacy_createStore(rootReducer);

store.subscribe(() => {
  console.log('[Subscription]: ', store.getState());
});
...

Теперь если мы запустим наш код, то увидим как стейт меняется всякий раз при вызове действий (экшнов):

before: { counter: 0 }
[Subscription]:  { counter: 1 }
[Subscription]:  { counter: 11 }
after: { counter: 11 }
*/

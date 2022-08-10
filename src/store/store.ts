import {combineReducers, configureStore} from "@reduxjs/toolkit";
import authReducer from './reducers/AuthReducer'
import catalogReducer from './reducers/CatalogReducer'

const rootReducer = combineReducers({
    authReducer,
    catalogReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import authReducer from './reducers/AuthReducer'
import catalogReducer from './reducers/CatalogReducer'
import kitReducer from './reducers/KitReducer'

const rootReducer = combineReducers({
    authReducer,
    catalogReducer,
    kitReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
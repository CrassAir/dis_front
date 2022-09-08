import {combineReducers, configureStore} from "@reduxjs/toolkit";
import authReducer from './reducers/AuthReducer'
import catalogReducer from './reducers/CatalogReducer'
import kitReducer from './reducers/KitReducer'
import defectReducer from './reducers/DefectReducer'

const rootReducer = combineReducers({
    authReducer,
    catalogReducer,
    kitReducer,
    defectReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
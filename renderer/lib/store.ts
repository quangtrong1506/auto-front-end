import { configureStore } from '@reduxjs/toolkit';
import filesReducer from './features/file';
import { foldersMiddleware } from './redux-middleware';
export const store = configureStore({
	reducer: {
		files: filesReducer
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(foldersMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

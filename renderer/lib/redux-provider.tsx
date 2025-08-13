'use client';

import { Provider } from 'react-redux';
import { store } from './store';

interface ReduxProviderPropsInterface {
	children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderPropsInterface) {
	return <Provider store={store}>{children}</Provider>;
}

'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { RootLayout } from '../components/layouts';
import ReduxProvider from '../lib/redux-provider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Fragment>
			<Head>
				<title>Auto Remote Front-end</title>
			</Head>
			<ReduxProvider>
				<RootLayout>
					<Component {...pageProps} />
				</RootLayout>
			</ReduxProvider>
		</Fragment>
	);
}

export default MyApp;

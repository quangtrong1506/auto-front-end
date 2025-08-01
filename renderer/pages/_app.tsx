'use client';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Fragment>
			<Head>
				<title>Live Wallpaper for Windows</title>
			</Head>
			<div className="relative h-svh w-full">
				<Component {...pageProps} />
			</div>
		</Fragment>
	);
}

export default MyApp;

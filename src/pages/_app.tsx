import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import MongoDB from '@/server/lib/Mongoose';
import { Provider } from 'react-redux';
import { store } from '@/store';

import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { Web3ModalProvider } from '@/lib/Web3ModalLayout';

MongoDB.connect();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Provider store={store}>
        <Head>
          <title>Golden Cobra - $GOCO</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/main.png" />
        </Head>
        <Web3ModalProvider>
          <Component {...pageProps} />
        </Web3ModalProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
          style={{
            width: 'auto',
            minWidth: '300px',
          }}
        />
      </Provider>
    </Fragment>
  );
}

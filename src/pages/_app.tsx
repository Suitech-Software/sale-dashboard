import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import MongoDB from '@/server/lib/Mongoose';

import 'react-toastify/dist/ReactToastify.css';

MongoDB.connect();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Component {...pageProps} />;
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
    </Fragment>
  );
}

import Head from 'next/head'
import '../styles/globals.css'

function Web3lib({ Component, pageProps }) {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1" />
      <meta name="description" content="Web3lib - Seamlessly Connecting Web2.0 to Web3" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    </Head>
      <Component {...pageProps} />
  </>
}

export default Web3lib

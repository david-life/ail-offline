import "../styles/Header.module.css"; // Import global CSS here
import "../styles/globals.css"; // Any other global styles

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

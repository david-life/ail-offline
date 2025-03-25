import Link from "next/link"; // Import Link for navigation
import Image from "next/image";
import styles from "../styles/Header.module.css"; // Correct import for CSS Modules


// Header Component (Default Export)
export default function header() {
  return (
   <header className={styles.header}>
     {/* Logo that links to the home page */}
     <div className={styles.logo}>
       <Link href="/">
         <div className="logoContainer">
           <Image
             src="/images/1.png"
             alt="Logo"
             layout="intrinsic"
             width={80}
             height={40}
           />
         </div>

       </Link>
     </div>

  {/* Navigation */}
  <nav className={styles.nav}>
    <ul className={styles.navList}>
      <li className={`${styles.navItem} ${styles.active}`}>Documentation</li>
      <li className={styles.navItem}>Learn</li>
      <li className={styles.navItem}>Examples</li>
      <li className={styles.navItem}>Start</li>
    </ul>
  </nav>

  {/* Login Button */}
  <div className={styles.login}>
    <button className={styles.loginButton}>Login</button>
  </div>
</header>
  );
}
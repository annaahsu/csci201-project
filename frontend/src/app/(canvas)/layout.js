'use client';

import { Gothic_A1 } from "next/font/google";
import ButtonLink from "@/components/ButtonLink/ButtonLink";
import "../globals.css";
import styles from "./styles.module.css";
import {useEffect, useState} from "react";

const gothic = Gothic_A1({ weight: ["400", "900"], subsets: ["latin"] });

// export const metadata = {
//   title: "CANVAS",
//   description: "Your next collaborative art space",
// };

export default function CanvasRootLayout({ children }) {

  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    setIsSignedIn(localStorage.getItem('token') !== null);
  }, []);


  const handleLogOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }


  return (
    <html lang="en">
      <body className={`${gothic.className} ${styles.body}`}>
        <nav className={styles.nav}>
          <h1>CANVAS</h1>
          <div className={styles.navLinks}>
            {
              !isSignedIn
                ? <ButtonLink href={'/login'}>Log In</ButtonLink>
                : <div className={'button'} onClick={handleLogOut}>Log out</div>
            }
          </div>
        </nav>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}

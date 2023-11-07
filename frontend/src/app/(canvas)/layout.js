import { Gothic_A1 } from "next/font/google";
import ButtonLink from "@/components/ButtonLink/ButtonLink";
import "../globals.css";
import styles from "./styles.module.css";

const gothic = Gothic_A1({ weight: ["400", "900"], subsets: ["latin"] });

export const metadata = {
  title: "CANVAS",
  description: "Your next collaborative art space",
};

export default function CanvasRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${gothic.className} ${styles.body}`}>
        <nav className={styles.nav}>
          <h1>CANVAS</h1>
          <div className={styles.navLinks}>
            <ButtonLink href="/canvas">Canvas</ButtonLink>
            <ButtonLink href="/profile">Profile</ButtonLink>
          </div>
        </nav>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}

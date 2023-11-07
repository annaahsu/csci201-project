import { Gothic_A1 } from "next/font/google";
import "../globals.css";
import styles from "./styles.module.css";

const gothic = Gothic_A1({ weight: ["400", "900"], subsets: ["latin"] });

export const metadata = {
  title: "CANVAS",
  description: "Your next collaborative art space",
};

export default function AuthRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={gothic.className}>
        <main className={styles.main}>
          <h1>CANVAS</h1>
          {children}
        </main>
      </body>
    </html>
  );
}

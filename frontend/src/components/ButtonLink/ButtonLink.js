import Link from "next/link";
import styles from "./ButtonLink.module.css";

export default function ButtonLink({ href, children }) {
  return (
    <Link className={styles.button} href={href}>
      {children}
    </Link>
  );
}

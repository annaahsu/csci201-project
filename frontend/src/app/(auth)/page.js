import Button from "@/components/ButtonLink/ButtonLink";
import styles from "./styles.module.css";

export default function HomePage() {
  return (
    <div className={styles.content}>
      <p className={styles.text}>
        Welcome to CANVAS, where you&apos;ll highlight your artistic journey.
      </p>
      <div className={styles.buttons}>
        <Button href="/login">Login</Button>
        <Button href="/signup">Signup</Button>
      </div>
    </div>
  );
}

import Button from "@/components/Button/Button";
import styles from "../styles.module.css";

export default function LoginPage() {
  return (
    <div className={styles.content}>
      <p className={styles.text}>Welcome. Please log in.</p>
      <div className={styles.buttons}>
        <Button href="/login">Login</Button>
      </div>
    </div>
  );
}

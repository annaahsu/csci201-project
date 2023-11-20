import Link from "next/link";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import styles from "../styles.module.css";

export default function LoginPage() {
  return (
    <div className={styles.content}>
      <p className={styles.text}>Welcome. Please log in.</p>
      <form id="login" method="get" action="/canvas">
        <div className={styles.form}>
          <Input required placeholder="Username" name="username" />
          <Input
            required
            type="password"
            placeholder="Password"
            name="password"
          />
        </div>
      </form>
      <div className={styles.buttons}>
        <Button type="submit" form="login">
          Login
        </Button>
      </div>
      <p className={styles.small}>
        New member?{" "}
        <Link href="/signup" className={styles.smalllink}>
          Create an account
        </Link>{" "}
        or{" "}
        <Link href="/canvas" className={styles.smalllink}>
          continue as guest
        </Link>
        .
      </p>
    </div>
  );
}

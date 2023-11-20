import Button from "@/components/Button/Button";
import styles from "../styles.module.css";
import Input from "@/components/Input/Input";

export default function LoginPage() {
  return (
    <div className={styles.content}>
      <p className={styles.text}>Welcome. Please log in.</p>
      <form id="login" method="get" action="/canvas">
        <div className={styles.form}>
          <Input required placeholder="Username" name="username"></Input>
          <Input
            required
            type="password"
            placeholder="Password"
            name="password"
          ></Input>
        </div>
      </form>
      <div className={styles.buttons}>
        <Button type="submit" form="login">
          Login
        </Button>
      </div>
      <p className={styles.small}>
        New member?{" "}
        <span>
          <a href="/signup" className={styles.smalllink}>
            Create an account
          </a>
        </span>{" "}
        or{" "}
        <span>
          <a href="/canvas" className={styles.smalllink}>
            continue as guest
          </a>
        </span>
      </p>
    </div>
  );
}

import Link from "next/link";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import styles from "../styles.module.css";

export default function SignupPage() {
  return (
    <div className={styles.content}>
      <p className={styles.text}>Create your free account.</p>
      <form id="signup" method="get" action="/canvas">
        <div className={styles.form}>
          <Input required placeholder="First name" name="fname" />
          <Input required placeholder="Last name" name="lname" />
          <Input required placeholder="Username" name="uname" />
          <Input
            required
            pattern="@[a-z0-9.\-]+\.[a-z]"
            type="email"
            placeholder="Email"
            name="email"
          />
          <Input required type="password" placeholder="Password" name="pw" />
          <Input
            required
            type="password"
            placeholder="Confirm password"
            name="confirmpw"
          />
        </div>
      </form>
      <div className={styles.buttons}>
        <Button type="submit" form="signup">
          Sign Up
        </Button>
      </div>
      <p className={styles.small}>
        Already have an account?{" "}
        <Link href="/login" className={styles.smalllink}>
          Log in
        </Link>
        .
        <br /> Don&apos;t want to sign up?{" "}
        <Link href="/canvas" className={styles.smalllink}>
          continue as guest
        </Link>
        .
      </p>
    </div>
  );
}

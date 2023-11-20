import Button from "@/components/Button/Button";
import styles from "../styles.module.css";
import Input from "@/components/Input/Input";

export default function SignupPage() {
  return (
    <div className={styles.content}>
      <p className={styles.text}>Create your free account.</p>
      <form id="signup" method="get" action="/canvas">
      <div className={styles.content}>
      <Input required placeholder="First name" name="fname"></Input>
      <Input required placeholder="Last name" name="lname"></Input>
      <Input required placeholder="Username" name="uname"></Input>
      <Input required pattern="@[a-z0-9.\-]+\.[a-z]" type="email" placeholder="Email" name="email"></Input>
      <Input required type="password" placeholder="Password" name="pw"></Input>
      <Input required type="password" placeholder="Confirm password" name="confirmpw"></Input>
      </div>
      </form>
      <div className={styles.buttons}>
        <Button type="submit" form="signup">Sign Up</Button>
      </div>
      <p className={styles.small}>Already have an account? <span><a href="/login" className={styles.smalllink}>Log in.</a></span><br/> Don't want to sign up? <span><a href="/canvas" className={styles.smalllink}>continue as guest</a></span></p>
    </div>
  );
}

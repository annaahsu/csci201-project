import styles from "./Input.module.css";

export default function Input({ children, ...props }) {
  return <input className={styles.input} {...props} />;
}

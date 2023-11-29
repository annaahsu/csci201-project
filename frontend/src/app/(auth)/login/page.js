// indicate this program is a client entry so "useState" can be used
'use client'
// 3 lines from https://stackoverflow.com/questions/23929432/submit-form-in-reactjs-using-button-element
import Link from "next/link";
import { useState } from 'react';
import Button from "@/components/Button/Button";
import styles from "../styles.module.css";
import Input from "@/components/Input/Input";

export default function LoginPage() {

    // declaring variables in the function that will be used for each field in the signup form
    const [username, recordingUsername] = useState("");
    const [password, recordingPassword] = useState("");

    // function for fetching from and responding to the backend
    async function loginFunc(event) {
        event.preventDefault();
        console.log({ username, password });
        var url = new URL("https://canvas-websocket.jamm.es/auth/login");
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        if (response.status === 401) {
            console.log('Wrong credentials!');
            document.getElementById("warning_message").innerHTML = '<p style="font-size: 12px">Incorrect Credentials, please try again.</p>';
            return;
        }
        else if (response.status !== 200) {
            console.error('Unhandled error');
            console.error(await response.text());
            return;
        }

        document.getElementById("warning_message").innerHTML = "";
        const token = await response.text();
        console.log(token);
        localStorage.setItem('token', token);
        window.location.href = '/canvas';
    }

    return (
        <div className={styles.content}>
            <p className={styles.text}>Welcome. Please log in.</p>
            <form id="login" onSubmit={loginFunc}>
                <div className={styles.content}>
                    <Input required type="text" placeholder="Username" name="username" value={username} onChange={(event) => recordingUsername(event.target.value)} ></Input>
                    <Input required type="password" placeholder="Password" name="password" value={password} onChange={(event) => recordingPassword(event.target.value)}></Input>
                </div>
            </form>
            <div id="warning_message" style={{ color: "red" }}></div>
            <Button type="submit" form="login">Login</Button>
            <p className={styles.small}>New member? <Link href="/signup" className={styles.smalllink}>Create an account</Link> or <Link href="/canvas" className={styles.smalllink}>continue as guest</Link>.</p>
        </div>
    );
}

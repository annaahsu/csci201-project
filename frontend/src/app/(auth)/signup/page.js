// indicate this program is a client entry so "useState" can be used
'use client'
// 3 lines from https://stackoverflow.com/questions/23929432/submit-form-in-reactjs-using-button-element
import React, { useState } from 'react';
import Button from "@/components/Button/Button";
import styles from "../styles.module.css";
import Input from "@/components/Input/Input";

export default function SignupPage() {

    // declaring variables in the function that will be used for each field in the signup form
    const [fname, recordingFname] = useState("");
    const [lname, recordingLname] = useState("");
    const [uname, recordingUname] = useState("");
    const [email, recordingEmail] = useState("");
    const [password, recordingPassword] = useState("");
    const [confirmPassword, recordingConfirmPassword] = useState("");

    // function for fetching from and responding to the backend
    async function signupFunc(event) {
        event.preventDefault();
        console.log({ fname, lname, uname, email, password, confirmPassword });
        var url = new URL("http://localhost:8080/signup");
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ fname, lname, uname, email, password, confirmPassword })
        });

        if (response.status === 403) {
            console.log('Passwords do not match!');
            document.getElementById("warning_message").innerHTML = '<p style="font-size: 12px">Passwords do not match, please try again.</p>';
            return;
        }
        else if (response.status === 404) {
            console.log('Username already in use');
            document.getElementById("warning_message").innerHTML = '<p style="font-size: 12px">User already exists, please try again.</p>';
            return;
        }
        else if (response.status !== 200) {
            console.error('Unhandled error');
            console.error(await response.text());
            return;
        }

        document.getElementById("warning_message").innerHTML = "";
        window.location.href = 'http://localhost:3000/canvas';


        // Old code
        // var params = { fname:  fname , lname:  lname , uname:  uname , email:  email , password:  password , confirmPassword:  confirmPassword };
        // url.search = new URLSearchParams(params).toString();
        // console.log(url);
        // console.log(params);
        // fetch(url)
        //   .then(response => {
        //     if (!response.ok) {
        //       throw new Error('Network response was not ok');
        //     }
        //     return response.text();
        //   })
        //   .then((text) => {
        //     // Handle the received JSON data
        //     console.log("here's the text");
        //     console.log(text); // Check if data is received correctly
        //     // Update HTML or perform other operations with the data
        //     //console.log(request.getContextPath() + '/lists.html')
        //     // window.location.href = request.getContextPath() + '/lists.html';
        //     if (text == "Successfully signed up! You can now draw on the canvas!") {
        //       document.getElementById("warning_message").innerHTML = "";
        //       window.location.href = request, getContextPath() + '/canvas';
        //     }
        //     if (text == "Passwords do not match!") {
        //       document.getElementById("warning_message").innerHTML = '<p style="font-size: 12px">Passwords do not match, please try again.</p>';
        //     } else if (text == "Username is already in use.") {
        //       document.getElementById("warning_message").innerHTML = '<p style="font-size: 12px">User already exists, please try again.</p>';
        //     } else {
        //       document.getElementById("warning_message").innerHTML = '<p style="font-size: 12px">Sign up error.</p>';
        //     }
        //   })
        //   .catch(error => console.error('Error fetching data:', error));
        // console.log("im here!");
    }

    return (
        <div className={styles.content}>
            <p className={styles.text}>Create your free account.</p>
            <form id="signup" onSubmit={signupFunc}>
                <div className={styles.content}>
                    <Input required placeholder="First name" name="fname" value={fname} onChange={(event) => recordingFname(event.target.value)}></Input>
                    <Input required placeholder="Last name" name="lname" value={lname} onChange={(event) => recordingLname(event.target.value)}></Input>
                    <Input required placeholder="Username" name="uname" value={uname} onChange={(event) => recordingUname(event.target.value)}></Input>
                    <Input required type="email" placeholder="Email" name="email" value={email} onChange={(event) => recordingEmail(event.target.value)}></Input>
                    <Input required type="password" placeholder="Password" name="password" value={password} onChange={(event) => recordingPassword(event.target.value)}></Input>
                    <Input required type="password" placeholder="Confirm password" name="confirmpassword" value={confirmPassword} onChange={(event) => recordingConfirmPassword(event.target.value)}></Input>
                </div>
            </form>
            <div id="warning_message" style={{ color: "red" }}></div>
            <Button type="submit" form="signup">Sign Up</Button>
            <p className={styles.small}>Already have an account? <span><a href="/login" className={styles.smalllink}>Log in.</a></span><br /> Don't want to sign up? <span><a href="/canvas" className={styles.smalllink}>continue as guest</a></span></p>
        </div>
    );
}

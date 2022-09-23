import React, { useState } from "react";
import Input from "./form-component/Input";
import { useRouter } from "next/router";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const submitHandler = (e: any) => {
    e.preventDefault();

    let err = [];
    if (password === "") err.push("password");

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());

    setErrors(err);
    console.log(err);

    if (err.length > 0) return false;

    console.log(payload);
  };
  return (
    <div className="flex justify-center p-5 mt-10">
      <form onSubmit={submitHandler} className="flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Signup</h1>

        <Input
          name="username"
          title="Username"
          type="text"
          handleChange={(e: any) => setUsername(e.target.value)}
        />
        <Input
          name="email"
          title="Email"
          type="email"
          handleChange={(e: any) => setEmail(e.target.value)}
        />
        <Input
          name="password"
          title="Password"
          type="password"
          handleChange={(e: any) => setPassword(e.target.value)}
        />
        <Input
          name="confirm"
          title="Confirm Password"
          type="password"
          handleChange={(e: any) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="btn-primary mt-10">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Login;

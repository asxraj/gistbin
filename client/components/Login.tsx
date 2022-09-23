import React, { useState } from "react";
import Input from "./form-component/Input";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: any) => {
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
    <div className="flex justify-center items-center p-5 mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Login</h1>
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

        <button type="submit" className="btn-primary mt-8 outline-none">
          Continue
        </button>
      </form>
    </div>
  );
};

export default Signup;

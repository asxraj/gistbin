import React from "react";
import Input from "./form-component/Input";
import { useRouter } from "next/router";

const Login = () => {
  const submitHandler = () => {};
  return (
    <div className="flex justify-center p-5 mt-20">
      <form onSubmit={submitHandler} className="flex flex-col">
        <Input name="username" title="Username" type="text" />
        <Input name="email" title="Email" type="email" />
        <Input name="password" title="Password" type="password" />
        <Input name="confirm" title="Confirm Password" type="password" />

        <button
          type="submit"
          className="border-2 border-white px-5 py-2 rounded-lg mt-10"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Login;

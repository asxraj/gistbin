import React from "react";
import Input from "./form-component/Input";

const Signup = () => {
  const submitHandler = () => {};
  return (
    <div className="flex justify-center p-5 mt-20">
      <form onSubmit={submitHandler} className="flex flex-col">
        <Input name="email" title="Email" type="email" />
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

export default Signup;

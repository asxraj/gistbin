import React, { useState } from "react";
import Input from "./form-component/Input";
import { useRouter } from "next/router";

interface error {
  username?: string;
  email?: string;
  password?: string;
}

const defaultError = { password: "", email: "", username: "" };

const Login = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<error>(defaultError);
  const router = useRouter();

  const submitHandler = (e: any) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    console.log(payload);

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload, null, 2),
      headers: headers,
    };

    fetch("http://localhost:4000/v1/users/create", requestOptions)
      .then((res) => {
        if (res.status === 201 || res.status === 422) {
          return res.json();
        }
        return new Error("Something wrong happened");
      })
      .then((data: any) => {
        if (data.error) {
          setErrors(data.error);
        } else if (data.user) {
          console.log(data.user);
          setErrors({});
          router.push("/login");
        }
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <div className="flex justify-center p-5 mt-10">
      <form onSubmit={submitHandler} className="flex flex-col">
        {success && (
          <div className="p-3 bg-green-400 flex justify-center mb-5">
            <h1 className="text-lg font-bold">Successfully signed in</h1>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-10">Signup</h1>

        <Input
          name="username"
          title="Username"
          type="text"
          hasError={errors?.username ? true : false}
          errorMsg={errors?.username}
        />
        <Input
          name="email"
          title="Email"
          type="email"
          hasError={errors?.email ? true : false}
          errorMsg={errors?.email}
        />
        <Input
          name="password"
          title="Password"
          type="password"
          hasError={errors?.password ? true : false}
          errorMsg={errors?.password}
        />
        <Input
          name="confirm"
          title="Confirm Password"
          type="password"
          hasError={errors?.password ? true : false}
          errorMsg={errors?.password}
        />

        <button type="submit" className="btn-primary mt-10">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Login;

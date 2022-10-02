import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import { useRouter } from "next/router";
import Input from "../components/form-component/Input";

import { FormErrors } from "../utils/types";
import { UserContext } from "../context/UserContext";
import { REACT_API_URL } from "../utils/constants";

export default function Signup() {
  const { jwt } = useContext(UserContext);
  const [errors, setErrors] = useState<FormErrors>();
  const router = useRouter();

  useEffect(() => {
    if (jwt !== "") {
      router.push("/");
    }
  }, [jwt, router]);

  const submitHandler = (e: any) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());

    let err;
    if (!payload.username) {
      err = { username: "must be provided" };
    }
    if (!payload.email) {
      err = { ...err, email: "must be provided" };
    }

    if (payload.confirm != payload.password) {
      err = { ...err, password: "passwords does not match" };
    }
    if (err) {
      setErrors(err);
      return;
    }

    delete payload.confirm;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: headers,
    };

    console.log(payload);

    fetch(`${REACT_API_URL}/v1/users/create`, requestOptions)
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
          setErrors({});
          router.push("/login");
        }
      })
      .catch((err) => console.log(err.message));
    e.target.reset();
  };

  return (
    <Section>
      <Head>
        <title>Gistbin | Signup</title>
        <meta name="description" content="Gistbin project made by asxraj" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex justify-center p-5 mt-10">
        <form onSubmit={submitHandler} className="flex flex-col">
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
    </Section>
  );
}

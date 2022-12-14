import React, { useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

import Head from "next/head";
import Navbar from "../components/Navbar";
import Input from "../components/form-component/Input";

import Section from "../components/Section";
import { useRouter } from "next/router";
import { FormErrors } from "../utils/types";
import { REACT_API_URL } from "../utils/constants";

export default function Login() {
  const { jwt, setJwt, setUser } = useContext(UserContext);
  const [errors, setErrors] = useState<FormErrors>();
  const router = useRouter();

  useEffect(() => {
    if (jwt !== "") {
      router.push("/");
    }
  }, [jwt, router]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());

    let err;
    if (!payload.email) {
      err = { email: "must be provided" };
    }

    if (!payload.password) {
      err = { ...err, password: "must be provided" };
    }
    if (err) {
      setErrors(err);
      return;
    }
    console.log(payload);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload, null, 2),
      headers: headers,
    };

    fetch(`${REACT_API_URL}/v1/users/login`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then((data: any) => {
        console.log(data);

        if (data.error) {
          setErrors(data.error);
        } else if (data.token) {
          setJwt(data.token);
          localStorage.setItem("jwt", data.token);
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/");
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <Section>
      <Head>
        <title>Gistbin | Login</title>
        <meta name="description" content="Gistbin project made by asxraj" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex justify-center items-center p-5 mt-10">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h1 className="text-2xl font-bold mb-10">Login</h1>
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
          <button type="submit" className="btn-primary mt-8 outline-none">
            Continue
          </button>
        </form>
      </div>
    </Section>
  );
}

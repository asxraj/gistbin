import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../../components/Navbar";
import Section from "../../../components/Section";
import { UserContext } from "../../../context/UserContext";
import { IGistbin } from "../../../utils/types";
import { REACT_API_URL } from "../../../utils/utils";

const EditGistbin = () => {
  const { jwt, user } = useContext(UserContext);
  const [gistbin, setGistbin] = useState<IGistbin>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    fetch(`${REACT_API_URL}/v1/gistbin/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.gistbin) {
          if (data.gistbin.user_id !== user?.id) {
            router.push("/login");
          }
          setGistbin(data.gistbin);
          setIsLoaded(true);
        }
      });
  }, [id, router, user?.id]);

  const handleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;

    setErrors([]);
    setGistbin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = (e: any) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (jwt) {
      headers.append("Authorization", "Bearer " + jwt);
    }

    const requestOptions = {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: headers,
    };

    fetch(`${REACT_API_URL}/v1/gistbin/edit/${id}`, requestOptions)
      .then((response: Response) => {
        return response.json();
      })
      .then((data: any) => {
        if (data.error) {
          setErrors(data.error);
          return;
        } else {
          router.push(`/gistbin/${id}`);
        }
        return;
      })
      .catch((err: Error) => console.log(err));
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <Section>
      <Head>
        <title>{`Gistbin | Edit ${id}`}</title>
        <meta name="description" content="Gistbin project made by asxraj" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {jwt && (
        <div className="flex flex-col w-[100%] xl:w-[70%] mx-auto justify-center p-5">
          <form onSubmit={submitHandler} className="flex flex-col">
            <h1 className="text-xl font-semibold mb-2 tracking-wide text-gray-300">
              Edit Gist
            </h1>
            <textarea
              value={gistbin?.content}
              onChange={handleChange}
              name="content"
              className={`resize-none w-[100%] h-[350px] p-2 focus:outline-none bg-darkgray caret-white text-gray-300 mb-2 rounded-md ${
                errors?.content && "border-2 border-red-400"
              }`}
              placeholder={errors?.content && errors?.content}
            ></textarea>
            <h1 className="mb-1 text-md font-semibold tracking-wide">
              Optional Settings
            </h1>
            <hr className="opacity-50" />
            {/* Title */}
            <div className="flex items-center justify-between w-[100%] sm:w-[70%] xl:w-[60%]  mt-5">
              <label
                htmlFor="title"
                className="text-sm tracking-wide text-gray-300"
              >
                Title:
              </label>
              <input
                value={gistbin?.title}
                onChange={handleChange}
                type="text"
                name="title"
                className={`p-2 focus:outline-none caret-white bg-darkgray text-gray-300 text-sm w-[70%] rounded-md ${
                  errors?.title && "border-2 border-red-400"
                }`}
                placeholder={errors?.title && errors.title}
              />
            </div>
            {/* Category */}
            <div className="flex items-center justify-between w-[100%] sm:w-[70%] xl:w-[60%]  mt-5">
              <label
                htmlFor="category"
                className="text-sm tracking-wide text-gray-300"
              >
                Category:
              </label>
              <select
                value={gistbin?.category}
                onChange={handleChange}
                name="category"
                id="category"
                className="p-2 focus:outline-none caret-white bg-darkgray text-gray-300 text-sm w-[70%] cursor-pointer rounded-md"
              >
                <option value="None">None</option>
                <option value="Coding">Coding</option>
                <option value="Cryptocurrency">Cryptocurrency</option>
                <option value="Finance">Finance</option>
                <option value="Food">Food</option>
                <option value="Gaming">Gaming</option>
                <option value="Movies">Movies</option>
              </select>
            </div>
            {/* Expires */}
            <div className="flex items-center justify-between w-[100%] sm:w-[70%] xl:w-[60%]  mt-5">
              <label
                htmlFor="title"
                className="text-sm tracking-wide text-gray-300"
              >
                Add time:
              </label>
              <select
                name="expires"
                className="p-2 focus:outline-none caret-white bg-darkgray text-gray-300 text-sm w-[70%] cursor-pointer rounded-md"
              >
                <option value={0}>{"Don't Change"}</option>
                <option value={10}>10 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={1440}>1 Day</option>
                <option value={10080}>1 Week</option>
                <option value={525600}>1 Year</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary mt-10 w-fit text-gray-300"
            >
              Create New Gistbin
            </button>
          </form>
        </div>
      )}
    </Section>
  );
};

export default EditGistbin;

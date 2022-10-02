import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { UserContext } from "../context/UserContext";
import { REACT_API_URL } from "../utils/constants";

interface error {
  title: string;
  content: string;
}

const Gistbin = () => {
  const [errors, setErrors] = useState<error>();
  const { jwt } = useContext(UserContext);
  const router = useRouter();

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
      method: "POST",
      body: JSON.stringify(payload, null, 2),
      headers: headers,
    };

    fetch(`${REACT_API_URL}/v1/gistbin/create`, requestOptions)
      .then((response: Response) => {
        return response.json();
      })
      .then((data: any) => {
        if (data.error) {
          setErrors(data.error);
        } else if (data.gistbin) {
          router.push(`/gistbin/${data.gistbin.id}`);
        }
      })
      .catch((err: Error) => console.log(err));
  };

  return (
    <div className="flex flex-col w-[100%] xl:w-[70%] mx-auto justify-center p-5">
      <form onSubmit={submitHandler} className="flex flex-col">
        <h1 className="text-xl font-semibold mb-2 tracking-wide text-gray-300">
          New Gist
        </h1>
        <textarea
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
            Expires:
          </label>
          <select
            name="expires"
            className="p-2 focus:outline-none caret-white bg-darkgray text-gray-300 text-sm w-[70%] cursor-pointer rounded-md"
          >
            <option value={10}>10 Minutes</option>
            <option value={60}>1 Hour</option>
            <option value={1440}>1 Day</option>
            <option value={10080}>1 Week</option>
            <option value={525600}>1 Year</option>
          </select>
        </div>
        <button type="submit" className="btn-primary mt-10 w-fit text-gray-300">
          Create New Gistbin
        </button>
      </form>
      {jwt === "" && (
        <div className="flex items-center gap-2 mt-10 border-2 border-gray-500 rounded-md p-2">
          <HiOutlineInformationCircle className="w-6 h-6 text-blue-500" />
          <p className="text-[0.8rem]">
            You are currently not logged in, this means you can not edit or
            delete anything you paste.{" "}
            <span className="text-blue-300">
              <Link href="/signup">Sign Up</Link>
            </span>{" "}
            or{" "}
            <span className="text-blue-300">
              <Link href="/login">Login</Link>
            </span>{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default Gistbin;

import React, { useState } from "react";

const Gistbin = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const submitHandler = (e: any) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const payload = Object.fromEntries(data.entries());

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload, null, 2),
    };

    fetch("http://localhost:4000/v1/create", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));

    console.log(payload);
  };

  return (
    <div className="flex justify-center p-5">
      <form onSubmit={submitHandler} className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-5 tracking-wide">
          New Gistbin
        </h1>
        <textarea
          name="content"
          onChange={(e: any) => setContent(e.target.value)}
          className="resize-none w-[700px] h-[300px] p-2 focus:outline-none caret-slate-900 text-slate-900 mb-6"
        ></textarea>
        <h1 className="mb-4 text-lg font-semibold tracking-wide">
          Optional Settings
        </h1>
        <hr />
        <div className="flex items-center justify-between w-[50%] mt-5">
          <label htmlFor="title" className="text-sm">
            Title
          </label>
          <input
            type="text"
            name="title"
            onChange={(e: any) => setTitle(e.target.value)}
            className="p-1 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[200px]"
          />
        </div>
        <div className="flex items-center justify-between w-[50%] mt-5">
          <label htmlFor="category" className="text-sm">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="p-1 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[200px] cursor-pointer"
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
        <div className="flex items-center justify-between w-[50%] mt-5">
          <label htmlFor="title" className="text-sm">
            Expires
          </label>
          <select
            name="expires"
            className="p-1 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[200px] cursor-pointer"
          >
            <option value={10}>10 Minutes</option>
            <option value={60}>1 Hour</option>
            <option value={1440}>1 Day</option>
            <option value={10080}>1 Week</option>
            <option value={525600}>1 Year</option>
          </select>
        </div>
        {/* <div className="flex items-center justify-between w-[50%] mt-5">
          <label htmlFor="title" className="text-sm">
            Password
          </label>
          <input
            type="text"
            className="p-1 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[200px]"
          />
        </div> */}

        <button type="submit" className="btn-primary mt-10">
          Create New Gistbin
        </button>
      </form>
    </div>
  );
};

export default Gistbin;

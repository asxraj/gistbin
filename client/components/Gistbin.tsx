import React from "react";

const Gistbin = () => {
  const submitHandler = (e: any) => {
    e.preventDefault();

    console.log("form was submitted");
  };

  return (
    <div className="flex justify-center p-5">
      <form onSubmit={submitHandler} className="flex flex-col">
        <h1 className="text-xl font-semibold mb-6">New Gistbin</h1>
        <textarea
          name="gistbin"
          id="gistbin"
          className="resize-none w-[700px] h-[300px] p-2 focus:outline-none caret-slate-900 text-slate-900 my-6"
        ></textarea>
        <h1 className="mb-4 text-xl font-semibold">Optional Settings</h1>
        <hr />
        <div className="flex items-center justify-between w-[50%] mt-10">
          <label htmlFor="title" className="text-sm">
            Gistbin Expiration
          </label>
          <select
            name="expiration"
            id="expiration"
            className="p-1 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[200px] cursor-pointer"
          >
            <option value="<None">None</option>
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
            Gistbin Name
          </label>
          <input
            type="text"
            className="p-1 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[200px]"
          />
        </div>
        <div className="flex items-center justify-between w-[50%] mt-5">
          <label htmlFor="title" className="text-sm">
            Gistbin Expiration
          </label>
          <select
            name="expiration"
            id="expiration"
            className="p-1 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[200px] cursor-pointer"
          >
            <option value="Never">Never</option>
            <option value="10">10 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="1440">1 Day</option>
            <option value="10080">1 Week</option>
            <option value="525600">1 Year</option>
          </select>
        </div>
        <div className="flex items-center justify-between w-[50%] mt-5">
          <label htmlFor="title" className="text-sm">
            Password
          </label>
          <input
            type="text"
            className="p-1 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[200px]"
          />
        </div>

        <button
          type="submit"
          className="border-2 border-white px-5 py-2 rounded-lg mt-10"
        >
          Create New Gistbin
        </button>
      </form>
    </div>
  );
};

export default Gistbin;

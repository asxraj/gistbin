import React from "react";

const Gistbin = () => {
  return (
    <div className="flex justify-center bg-blue-500">
      <form className="flex flex-col justify-center items-center">
        <label htmlFor="description">New Gistbin</label>
        <input type="text" />
        <textarea name="gistbin" id="gistbin" cols={30} rows={10}></textarea>
      </form>
    </div>
  );
};

export default Gistbin;

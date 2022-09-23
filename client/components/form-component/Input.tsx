import React from "react";

const Input = ({
  name,
  title,
  type,
  handleChange,
}: {
  name: string;
  title: string;
  type: string;
  handleChange: any;
}) => {
  return (
    <div className={`flex flex-col`}>
      <label htmlFor={name} className="text-xl font-semibold my-5">
        {title}:
      </label>
      <input
        type={type}
        name={name}
        onChange={handleChange}
        className="p-3 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[500px]"
      />
    </div>
  );
};

export default Input;

import React from "react";

const Input = ({
  name,
  title,
  type,
  errorMsg,
  hasError,
}: {
  name: string;
  title: string;
  type: string;
  errorMsg: string | undefined;
  hasError: boolean | undefined;
}) => {
  return (
    <div className={`flex flex-col`}>
      <div className="flex items-center gap-4">
        <label htmlFor={name} className="text-xl font-semibold my-5">
          {title}:
        </label>
        <label className="text-xs text-red-400 opacity-75">{errorMsg}</label>
      </div>
      <input
        type={type}
        name={name}
        className={`p-3 focus:outline-none caret-slate-900 text-slate-900 text-sm w-[500px] rounded-sm ${
          hasError ? "border-2 border-red-400" : ""
        }`}
      />
    </div>
  );
};

export default Input;

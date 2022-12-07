import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasError?: string;
}

export default function InputField({
  label,
  hasError,
  type,
  ...props
}: InputFieldProps) {
  return (
    <div className="flex flex-col mb-4 w-full items-start">
      {type === "checkbox" ? (
        <div className="flex w-full">
          {label && (
            <label className="text-sm text-white font-bold mb-2 italic">
              {label}
            </label>
          )}
          <input
            className="w-12 mb-2 p-3 text-black rounded-md border-solid border-2 border-slate-200 text-sm font-bold text-white focus:border-black"
            type={type}
            {...props}
          />
        </div>
      ) : (
        <>
          {label && (
            <label className="text-sm text-white font-bold mb-2 italic">
              {label}
            </label>
          )}
          <input
            type={type}
            className="w-full mb-2 p-3 text-black rounded-md border-solid border-2 border-slate-200 text-sm font-bold text-white focus:border-black"
            {...props}
          />
        </>
      )}
      {hasError && <p className="text-sm text-red-600">{hasError}</p>}
    </div>
  );
}

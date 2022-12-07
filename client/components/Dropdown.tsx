import React, { forwardRef, MutableRefObject } from "react";

type DropdownProps = {
  children: JSX.Element | JSX.Element[];
};

const Dropdown = ({ children }: DropdownProps, ref: MutableRefObject<any>) => {
  return (
    <div
      className="absolute left-0 top-20 h-32 w-full bg-slate-800 rounded-md shadow-2xl flex flex-col items-center"
      ref={ref}
    >
      <div className="absolute h-full w-full p-2.5 text-white flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};

export default forwardRef(Dropdown);

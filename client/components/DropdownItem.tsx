import React from "react";
import { IconType } from "react-icons";

type DropDownItemProps = {
  children: JSX.Element | JSX.Element[];
  onClick?: () => void;
};

export default function DropdownItem({ children, onClick }: DropDownItemProps) {
  return (
    <div
      className="flex mb-2 p-2 justify-between rounded-md cursor-pointer hover:bg-slate-500 active:bg-slate-600 focus:outline-none focus:ring focus:ring-violet-300"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

import React, { forwardRef, useEffect } from "react";

type ModalProps = {
  onToggle: () => void;
  children: JSX.Element | JSX.Element[];
};

const Modal = ({ onToggle, children }: ModalProps) => {
  return (
    <>
      <div
        onClick={() => onToggle()}
        className="z-10 absolute h-full w-full top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/60 flex flex-col items-center justify-center"
      />

      <div className="z-20 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="flex flex-col w-96 bg-zinc-700 mx-auto p-4 rounded-md">
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;

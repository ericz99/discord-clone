import React from "react";
import Button from "./Button";
import Modal from "./Modal";

export default function DeleteServerModal({ onToggle, onClick }) {
  return (
    <Modal onToggle={onToggle}>
      <div className="flex justify-center">
        <p className="py-4 text-white text-center">
          Are you sure you want to delete this server?
        </p>
      </div>

      <div className="flex flex-col">
        <Button
          type="submit"
          className="bg-red-600 w-full font-xs p-2.5 text-white mx-auto rounded-md font-bold"
          onClick={onClick}
        >
          Delete Server
        </Button>
      </div>
    </Modal>
  );
}

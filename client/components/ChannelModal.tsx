import React from "react";
import Button from "./Button";
import InputField from "./InputField";
import Modal from "./Modal";

export default function ChannelModal({
  onToggle,
  onSubmit,
  onChange,
  inputs,
  errors,
}) {
  return (
    <Modal onToggle={onToggle}>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <InputField
          label="Channel Name"
          type="text"
          name="name"
          placeholder="Awesome Channel"
          onChange={onChange}
          value={inputs.name || ""}
          hasError={errors.name || ""}
          required
        />

        <Button
          type="submit"
          className="bg-lime-600 w-full font-xs p-2.5 text-white mx-auto rounded-md font-bold"
        >
          Create Channel
        </Button>
      </form>
    </Modal>
  );
}

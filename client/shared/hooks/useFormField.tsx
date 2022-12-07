import React, { useEffect, useState } from "react";
import { InputHookProps } from "../types";

export default function useFormField() {
  const [inputs, setInputs] = useState<InputHookProps>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (selectedOption, action) => {
    let values: string[] = [];

    for (const opt of selectedOption) {
      values.push(opt.value);
    }

    setInputs((prev) => ({
      ...prev,
      [action.name]: values,
    }));
  };

  const clearInputs = () => {
    setInputs({});
  };

  return {
    inputs,
    handleChange,
    clearInputs,
    handleSelectChange,
  };
}

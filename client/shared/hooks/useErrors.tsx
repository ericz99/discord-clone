import { GraphQLError } from "graphql/error";
import { useState, useEffect } from "react";
import { ErrorHookProps } from "../types";

export default function useErrors() {
  const [errors, setErrors] = useState<ErrorHookProps>({});

  const formatErrors = (errors: readonly GraphQLError[]) => {
    for (const e of errors) {
      const { error } = e as any;
      const { formattedErrors } = error;
      for (const err of formattedErrors) {
        const { path, message } = err;
        // # set all errors
        setErrors((prev) => ({
          ...prev,
          [path]: message,
        }));
      }
    }
  };

  return {
    errors,
    setErrors,
    formatErrors,
  };
}

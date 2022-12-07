import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { InputField, Button } from "../components";
import { useFormField, useErrors } from "../shared/hooks";

import { useRegisterUserMutation } from "../shared/generated/schema";

import { ensureSignIn } from "../shared/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { errors, setErrors, formatErrors } = useErrors();
  const { handleChange, inputs } = useFormField();
  const [registerUser, { loading }] = useRegisterUserMutation({
    errorPolicy: "all",
  });

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password } = inputs;

    // # execute mutation
    const { errors } = await registerUser({
      variables: {
        username,
        email,
        password,
      },
    });

    if (!loading && errors) {
      formatErrors(errors);
    } else {
      // # clear errors
      setErrors({});
      // # push to ogin
      router.push("/login?success=true");
    }
  };

  return (
    <div className="bg-slate-900 h-full flex items-center justify-center">
      <div className="container mx-auto flex items-center justify-center">
        <div className="min-w-full lg:min-w-[33%] md:min-w-[75%] lg:mx-12">
          <form className="flex flex-col px-8" onSubmit={handleSubmitForm}>
            <InputField
              label="Username"
              type="text"
              name="username"
              placeholder="AwesomeUserName"
              value={inputs.username ?? ""}
              hasError={errors.username || ""}
              onChange={(e) => handleChange(e)}
              required
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="test@yahoo.com"
              value={inputs.email ?? ""}
              hasError={errors.email || ""}
              onChange={(e) => handleChange(e)}
              required
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={inputs.password ?? ""}
              hasError={errors.password || ""}
              onChange={(e) => handleChange(e)}
              required
            />

            <div className="mb-5 flex justify-end">
              <Link href="/login" className="font-xs text-white font-bold">
                Already have an account?
              </Link>
            </div>

            <Button
              type="submit"
              className="bg-lime-600 w-full font-xs p-2.5 text-white mx-auto rounded-md font-bold"
            >
              Register Now
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  return ensureSignIn(req);
}

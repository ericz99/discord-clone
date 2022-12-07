import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AiOutlinePlus, AiFillMessage } from "react-icons/ai";
import { BiExit } from "react-icons/bi";

import Button from "../Button";
import InputField from "../InputField";
import Modal from "../Modal";

import {
  useCreateServerMutation,
  useGetServersQuery,
  UserJoinedDocument,
  UserRemovedDocument,
  GetServersDocument,
} from "../../shared/generated/schema";

import { useErrors, useFormField } from "../../shared/hooks";

export default function SidebarContainer() {
  const router = useRouter();
  const { errors, setErrors, formatErrors } = useErrors();
  const { handleChange, inputs, clearInputs } = useFormField();
  const [createServerToggle, setToggle] = useState<boolean>(false);
  const [createServer] = useCreateServerMutation({
    errorPolicy: "all",
  });

  const { loading, data, subscribeToMore } = useGetServersQuery({
    errorPolicy: "all",
  });

  useEffect(() => {
    // # listen to subscription query on update
    const unsub = subscribeToMore({
      document: UserJoinedDocument,
      updateQuery: (prev, { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        const newFeedItem = subscriptionData.data.userJoined;

        return {
          ...prev,
          allServers: [...prev.allServers, newFeedItem],
        };
      },
    });

    return () => {
      // clean up after subscribe
      unsub();
    };
  }, [subscribeToMore]);

  useEffect(() => {
    // # listen to subscription query on update
    const unsub = subscribeToMore({
      document: UserRemovedDocument,
      updateQuery: (prev, { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        const deletedItem = subscriptionData.data.userRemoved;

        return {
          ...prev,
          allServers: prev.allServers.filter((s) => s.id !== deletedItem.id),
        };
      },
    });

    return () => {
      // clean up after subscribe
      unsub();
    };
  }, [subscribeToMore]);

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // # execute mutation
    const { errors, data } = await createServer({
      variables: {
        name: inputs.name,
        ...inputs,
      },
      refetchQueries: [
        {
          query: GetServersDocument,
        },
      ],
    });

    if (!loading && errors) {
      formatErrors(errors);
    } else {
      // # clear errors
      setErrors({});
      // # push to ogin
      router.push({
        pathname: "/channels/[serverId]",
        query: {
          serverId: data.createServer.server.id,
        },
      });
      // # close form
      setToggle(false);
      // # clear form
      clearInputs();
    }
  };

  return (
    <div className="overflow-y-auto w-24 flex flex-col border-r-2 border-indigo-500 p-2 items-center">
      <ul className="flex flex-col mt-4">
        <li className="mb-4 h-16 w-16 text-white rounded-full bg-slate-900 flex items-center justify-center cursor-pointer">
          <Link
            href="/channels/dm"
            className="h-full w-full flex items-center justify-center"
          >
            <AiFillMessage size={28} />
          </Link>
        </li>

        {!loading &&
          data &&
          data.allServers.map((d) => (
            <li
              className="mb-4 text-white h-16 w-16 rounded-full flex items-center justify-center cursor-pointer bg-slate-900"
              key={d.id}
            >
              <Link
                href={`/channels/${d.id}`}
                className="h-full w-full flex items-center justify-center"
              >
                <span className="text-lg font-bold">
                  {d.name[0].toUpperCase()}
                </span>
              </Link>
            </li>
          ))}

        <li
          className="mb-4 h-16 w-16 text-white rounded-full bg-slate-900 flex items-center justify-center cursor-pointer"
          onClick={() => setToggle(true)}
        >
          <AiOutlinePlus size={28} />
        </li>

        <li
          className="mb-4 h-16 w-16 text-white rounded-full bg-slate-900 flex items-center justify-center cursor-pointer"
          onClick={() => {
            router.push("/logout");
          }}
        >
          <BiExit size={28} />
        </li>
      </ul>

      {createServerToggle && (
        <Modal onToggle={() => setToggle((prev) => !prev)}>
          <form className="flex flex-col" onSubmit={handleSubmitForm}>
            <InputField
              label="Server Name"
              type="text"
              name="name"
              placeholder="AwesomeServerName"
              onChange={(e) => handleChange(e)}
              value={inputs.name || ""}
              hasError={errors.name || ""}
              required
            />

            <Button
              type="submit"
              className="bg-lime-600 w-full font-xs p-2.5 text-white mx-auto rounded-md font-bold"
            >
              Create Server
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/router";

import { useGetUsersQuery } from "../../shared/generated/schema";

export default function DMContainer() {
  const router = useRouter();

  const { data, loading } = useGetUsersQuery({
    errorPolicy: "all",
  });

  return (
    <div
      className={`w-1/5 flex flex-col bg-slate-900 ${
        loading ? "justify-center items-center" : ""
      }`}
    >
      {!loading ? (
        <>
          <div className="relative mb-4 flex justify-between p-4 border-b-2 border-gray-500 bg-slate-900">
            <span className="font-md text-white font-bold">Direct Message</span>
          </div>

          <div className="container mx-auto">
            <ul className="flex flex-col p-4 overflow-y-auto h-full">
              {data.getUsers.map((user) => (
                <li
                  className={`flex justify-between items-center mb-2 cursor-pointer rounded-md hover:bg-slate-500 active:bg-slate-600 focus:outline-none focus:ring focus:ring-violet-300 ${
                    router.asPath == `/channels/dm/${user.id}`
                      ? "bg-red-300"
                      : ""
                  }`}
                  key={user.id}
                >
                  <Link href={`/channels/dm/${user.id}`} className="flex-1 p-2">
                    <p className="font-xs text-zinc-100">
                      <span>{user.username}</span>

                      <span className="ml-2 text-xs text-gray-300">
                        {user.discriminator}
                      </span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <BeatLoader color="#36d7b7" size={24} loading={loading} />
      )}
    </div>
  );
}

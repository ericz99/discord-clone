import React from "react";

import {
  GetServerDataDocument,
  GetUsersDocument,
} from "../shared/generated/schema";

import Button from "./Button";
import Modal from "./Modal";

export default function AddMemberModal({
  onToggle,
  data,
  serverData,
  addMember,
}) {
  return (
    <Modal onToggle={onToggle}>
      <div className="relative mb-4 flex justify-between p-2 border-b-2 border-gray-500">
        <span className="font-md text-white font-bold">Invite Users</span>
      </div>
      <ul className="flex flex-col">
        {data.getUsers.map((u) => {
          if (!u.servers.find((s) => s.id === serverData.getServer.id)) {
            return (
              <li
                key={u.id}
                className="flex items-center justify-between p-2 my-2 cursor-pointer rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-violet-300"
              >
                <span className="text-white">
                  {u.username} {u.discriminator}
                </span>

                <Button
                  type="button"
                  className="text-sm text-white border-solid border-green-500 rounded-md border-2 py-2 px-4 hover:bg-green-900"
                  onClick={() =>
                    addMember({
                      variables: {
                        id: u.id,
                        serverId: serverData.getServer.id,
                      },
                      refetchQueries: [
                        {
                          query: GetServerDataDocument,
                          variables: {
                            id: serverData.getServer.id,
                          },
                        },
                        {
                          query: GetUsersDocument,
                        },
                      ],
                    })
                  }
                >
                  Invite
                </Button>
              </li>
            );
          }
        })}
      </ul>
    </Modal>
  );
}

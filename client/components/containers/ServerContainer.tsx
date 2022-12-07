import React, { useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
} from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/router";

import Button from "../Button";

import {
  useGetServerDataQuery,
  useCreateChannelMutation,
  useDeleteChannelMutation,
  useGetUsersQuery,
  useRemoveMemberMutation,
  useAddMemberMutation,
  useDeleteServerMutation,
  ChannelCreatedDocument,
  ChannelDeletedDocument,
  GetServerDataDocument,
  GetServersDocument,
} from "../../shared/generated/schema";

import { useErrors, useFormField } from "../../shared/hooks";
import Link from "next/link";
import AddMemberModal from "../AddMemberModal";
import RemoveMemberModal from "../RemoveMemberModal";
import { JWTAccessTokenPayload } from "../../shared/types";
import ChannelModal from "../ChannelModal";
import DeleteServerModal from "../DeleteServerModal";

type ChannelContainerProps = {
  serverId?: string;
  loggedInUser: JWTAccessTokenPayload;
};

export default function ServerContainer({
  serverId,
  loggedInUser,
}: ChannelContainerProps) {
  const router = useRouter();
  const { errors, setErrors, formatErrors } = useErrors();
  const { handleChange, inputs, clearInputs } = useFormField();
  const [channelModal, setChannelModal] = useState<boolean>(false);
  const [addMemberModalToggle, setAddMemberToggle] = useState<boolean>(false);
  const [deleteServerModalToggle, setDeleteServerToggle] =
    useState<boolean>(false);
  const [removeMemberModalToggle, setRemoveMemberToggle] =
    useState<boolean>(false);

  const [createChannel] = useCreateChannelMutation({
    errorPolicy: "all",
  });

  const [addMember] = useAddMemberMutation({
    errorPolicy: "all",
  });

  const [removeMember] = useRemoveMemberMutation({
    errorPolicy: "all",
  });

  const [deleteChannel] = useDeleteChannelMutation({
    errorPolicy: "all",
  });

  const [deleteServer] = useDeleteServerMutation({
    errorPolicy: "all",
  });

  const { data, loading, error, subscribeToMore } = useGetServerDataQuery({
    errorPolicy: "all",
    variables: {
      id: serverId,
    },
  });

  const { data: dataUsers } = useGetUsersQuery({
    errorPolicy: "all",
  });

  useEffect(() => {
    // # listen to subscription query on update
    const unsub = subscribeToMore({
      document: ChannelCreatedDocument,
      variables: {
        serverId: serverId,
      },
      updateQuery: (prev, { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        const newFeedItem = subscriptionData.data.channelCreated;

        return {
          ...prev,
          getServer: {
            ...prev.getServer,
            channels: [...prev.getServer.channels, newFeedItem],
          },
        };
      },
    });

    return () => {
      // clean up after subscribe
      unsub();
    };
  }, [serverId, subscribeToMore]);

  useEffect(() => {
    // # listen to subscription query on update
    const unsub = subscribeToMore({
      document: ChannelDeletedDocument,
      variables: {
        serverId: serverId,
      },
      updateQuery: (prev, { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        const deletedItem = subscriptionData.data.channelDeleted;

        return {
          ...prev,
          getServer: {
            ...prev.getServer,
            channels: prev.getServer.channels.filter(
              (m) => m.id !== deletedItem.id
            ),
          },
        };
      },
    });

    return () => {
      // clean up after subscribe
      unsub();
    };
  }, [serverId, subscribeToMore]);

  useEffect(() => {
    if (error) {
      const result = error.graphQLErrors[0] as any;
      if (result.error.code == "FAILED_TO_FETCH_SERVER") {
        router.push("/channels");
      }
    }
  }, [error, router]);

  const handleSubmitChannelForm = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const { name } = inputs;

    // # execute mutation
    const { errors } = await createChannel({
      variables: {
        name,
        serverId,
      },
    });

    if (!loading && errors) {
      formatErrors(errors);
    } else {
      onToggleCloseModal();
    }
  };

  const onToggleModal = () => {
    setChannelModal(true);
  };

  const onToggleCloseModal = () => {
    setChannelModal(false);
    clearInputs();
    setErrors({});
  };

  return (
    <div
      className={`w-1/5 h-full flex flex-col bg-slate-900 ${
        loading ? "justify-center items-center" : ""
      }`}
    >
      {!loading && data ? (
        <>
          <div className="relative mb-4 flex justify-between p-4 border-b-2 border-gray-500 bg-slate-900">
            <span className="font-md text-white font-bold">
              {data.getServer.name}
            </span>
          </div>

          <div className="container mx-auto h-full">
            <ul className="flex flex-col p-4 overflow-y-auto h-full">
              {data.getServer.channels.map((channel) => (
                <li
                  className={`flex justify-between items-center mb-2 cursor-pointer rounded-md hover:bg-slate-500 active:bg-slate-600 focus:outline-none focus:ring focus:ring-violet-300 ${
                    router.asPath == `/channels/${serverId}/${channel.id}`
                      ? "bg-red-300"
                      : ""
                  }`}
                  key={channel.id}
                >
                  <Link
                    href={`/channels/${serverId}/${channel.id}`}
                    className="flex-1 p-2"
                  >
                    <p className="font-xs text-zinc-100"># {channel.name}</p>
                  </Link>

                  <div className="flex p-2">
                    <Button
                      type="button"
                      className="hover:bg-slate-700 rounded-full text-white p-2"
                      onClick={() =>
                        deleteChannel({
                          variables: {
                            deleteChannelId: channel.id,
                            serverId,
                          },
                          refetchQueries: [
                            {
                              query: GetServerDataDocument,
                              variables: {
                                id: serverId,
                              },
                            },
                          ],
                        })
                      }
                    >
                      <BiTrash size={16} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <ul className="flex flex-col p-4">
            <li
              className="flex justify-between mb-4 cursor-pointer text-white"
              onClick={() => onToggleModal()}
            >
              <span className="font-xs font-bold text-zinc-100">
                Create Channel
              </span>
              <AiOutlinePlus size={18} />
            </li>
            <li
              className="flex justify-between mb-4 cursor-pointer text-white"
              onClick={() => setAddMemberToggle((prev) => !prev)}
            >
              <span className="font-xs font-bold text-zinc-100">Add User</span>
              <AiOutlineUserAdd size={18} />
            </li>
            <li
              className="flex justify-between mb-4 cursor-pointer text-white"
              onClick={() => setRemoveMemberToggle((prev) => !prev)}
            >
              <span className="font-xs font-bold text-zinc-100">
                Remove User
              </span>
              <AiOutlineUserDelete size={18} />
            </li>
            <li
              className={`flex justify-between cursor-pointer text-white ${
                data.getServer.owner.id !== loggedInUser.id
                  ? "cursor-not-allowed"
                  : ""
              }`}
              onClick={() => setDeleteServerToggle((prev) => !prev)}
            >
              <span className="font-xs font-bold text-red-700">
                Delete Server
              </span>
              <BiTrash size={18} />
            </li>
          </ul>
        </>
      ) : (
        <BeatLoader color="#36d7b7" size={24} loading={loading} />
      )}

      {channelModal && (
        <ChannelModal
          inputs={inputs}
          errors={errors}
          onChange={(e) => handleChange(e)}
          onToggle={() => onToggleCloseModal()}
          onSubmit={handleSubmitChannelForm}
        />
      )}

      {addMemberModalToggle && (
        <AddMemberModal
          data={dataUsers}
          onToggle={() => setAddMemberToggle((prev) => !prev)}
          serverData={data}
          addMember={addMember}
        />
      )}

      {removeMemberModalToggle && (
        <RemoveMemberModal
          data={dataUsers}
          onToggle={() => setRemoveMemberToggle((prev) => !prev)}
          serverData={data}
          removeMember={removeMember}
        />
      )}

      {deleteServerModalToggle && (
        <DeleteServerModal
          onToggle={() => setDeleteServerToggle((prev) => !prev)}
          onClick={() => {
            if (data.getServer.owner.id === loggedInUser.id) {
              // # delete server
              deleteServer({
                variables: {
                  deleteServerId: data.getServer.id,
                },
                refetchQueries: [
                  {
                    query: GetServersDocument,
                  },
                ],
              });

              // # redirect user back to channels
              router.push("/channels");
            }
          }}
        />
      )}
    </div>
  );
}

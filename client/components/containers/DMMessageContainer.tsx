import React, { useEffect, useState, useRef } from "react";

import {
  useGetDmMessageQuery,
  useCreateDMessageMutation,
  MessageDmCreatedDocument,
  GetDmMessageDocument,
} from "../../shared/generated/schema";

import InputField from "../InputField";
import { useFormField } from "../../shared/hooks";
import Message from "../Message";

type DMMessageContainerProps = {
  userId?: string;
};

export default function DMMessageContainer({
  userId,
}: DMMessageContainerProps) {
  const scrollToBottomRef = useRef(null);
  const scrollRef = useRef(null);
  const [scrollHeightCache, setScrollHeight] = useState<number>(0);
  const [isMounted, setMount] = useState<boolean>(false);
  const [hasMoreItems, setMoreItems] = useState<boolean>(true);
  const { handleChange, inputs, clearInputs } = useFormField();
  const [createMessage] = useCreateDMessageMutation();
  const { subscribeToMore, loading, data, fetchMore } = useGetDmMessageQuery({
    variables: {
      senderId: userId,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    // # listen to subscription query on update
    const unsub = subscribeToMore({
      document: MessageDmCreatedDocument,
      variables: {
        senderId: userId,
      },
      updateQuery: (prev, { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        const newFeedItem = subscriptionData.data.messageDMCreated;

        return {
          ...prev,
          getDMMessages: [newFeedItem, ...prev.getDMMessages],
        };
      },
    });

    return () => {
      // clean up after subscribe
      unsub();
    };
  }, [userId, subscribeToMore]);

  const handleScroll = () => {
    if (data) {
      if (
        scrollRef.current &&
        scrollRef.current.scrollTop <= 0 &&
        hasMoreItems &&
        data.getDMMessages.length >= 35
      ) {
        console.log("scrolled to top");
        setScrollHeight(scrollRef.current.scrollHeight);
        fetchMore({
          variables: {
            senderId: userId,
            cursor: data.getDMMessages[data.getDMMessages.length - 1].id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }

            if (fetchMoreResult.getDMMessages.length < 35) {
              console.log("done");
              setMoreItems(false);
            }

            return {
              ...prev,
              getDMMessages: [
                ...prev.getDMMessages,
                ...fetchMoreResult.getDMMessages,
              ],
            };
          },
        });
      }
    }
  };

  useEffect(() => {
    if (data && !isMounted) {
      setMount(true);
      scrollToBottomRef.current.scrollIntoView();
    }
  }, [data, isMounted]);

  useEffect(() => {
    if (scrollRef && scrollRef.current && data && hasMoreItems) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight - scrollHeightCache;
    }
  }, [data, hasMoreItems, scrollHeightCache]);

  return (
    <div className="relative flex-1 flex flex-col h-full w-full p-4">
      <div
        onScroll={handleScroll}
        ref={scrollRef}
        className="flex-1 flex flex-col overflow-y-auto h-full w-full my-6"
      >
        {!loading && data.getDMMessages ? (
          data.getDMMessages
            .slice()
            .reverse()
            .map((m) => <Message message={m} />)
        ) : (
          <div>...loading</div>
        )}

        <div ref={scrollToBottomRef} />
      </div>

      <div className="flex">
        <InputField
          type="text"
          name="body"
          placeholder="Message Here"
          value={inputs.body ?? ""}
          onChange={(e) => handleChange(e)}
          onKeyDown={async (e) => {
            if (e.key == "Enter") {
              if (!inputs || !inputs.body) {
                return;
              }

              await createMessage({
                variables: {
                  receiverId: userId,
                  body: inputs.body,
                },
                refetchQueries: [
                  {
                    query: GetDmMessageDocument,
                    variables: {
                      senderId: userId,
                    },
                  },
                ],
              });

              // # clear inputs
              clearInputs();

              // # to the bottom
              scrollToBottomRef.current.scrollIntoView();
            }
          }}
          min="1"
          max="250"
          required
        />
      </div>
    </div>
  );
}

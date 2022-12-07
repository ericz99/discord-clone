import React, { useEffect, useState, useRef } from "react";

import {
  MessageCreatedDocument,
  useGetMessageQuery,
  useCreateMessageMutation,
} from "../../shared/generated/schema";

import InputField from "../InputField";
import { useFormField } from "../../shared/hooks";
import Message from "../Message";

type MessageContainerProps = {
  channelId?: string;
};

export default function MessageContainer({ channelId }: MessageContainerProps) {
  const scrollToBottomRef = useRef(null);
  const scrollRef = useRef(null);
  const [scrollHeightCache, setScrollHeight] = useState<number>(0);
  const [isMounted, setMount] = useState<boolean>(false);
  const [hasMoreItems, setMoreItems] = useState<boolean>(true);
  const { handleChange, inputs, clearInputs } = useFormField();
  const [createMessage] = useCreateMessageMutation();
  const { subscribeToMore, loading, data, fetchMore } = useGetMessageQuery({
    variables: {
      channelId,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    // # listen to subscription query on update
    const unsub = subscribeToMore({
      document: MessageCreatedDocument,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData }: any) => {
        if (!subscriptionData.data) return prev;
        const newFeedItem = subscriptionData.data.messageCreated;

        return {
          ...prev,
          messages: [newFeedItem, ...prev.messages],
        };
      },
    });

    return () => {
      // clean up after subscribe
      unsub();
    };
  }, [channelId, subscribeToMore]);

  const handleScroll = () => {
    if (data) {
      if (
        scrollRef.current &&
        scrollRef.current.scrollTop <= 0 &&
        hasMoreItems &&
        data.messages.length >= 35
      ) {
        console.log("scrolled to top");
        setScrollHeight(scrollRef.current.scrollHeight);
        fetchMore({
          variables: {
            channelId,
            cursor: data.messages[data.messages.length - 1].id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }

            if (fetchMoreResult.messages.length < 35) {
              console.log("done");
              setMoreItems(false);
            }

            return {
              ...prev,
              messages: [...prev.messages, ...fetchMoreResult.messages],
            };
          },
        });
      }
    }
  };

  // useEffect(() => {
  //   if (channelId) {
  //     console.log("new channel selected reset");
  //     setMount(false);
  //     setMoreItems(true);
  //     scrollToBottomRef.current.scrollIntoView();
  //   }
  // }, [channelId]);

  useEffect(() => {
    if (data && !isMounted) {
      setMount(true);
      scrollToBottomRef.current.scrollIntoView();
    }
  }, [data, isMounted]);

  useEffect(() => {
    if (scrollRef && scrollRef.current && data) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight - scrollHeightCache;
    }
  }, [data, scrollHeightCache]);

  return (
    <div className="relative flex-1 flex flex-col h-full w-full p-4">
      <div
        onScroll={handleScroll}
        ref={scrollRef}
        className="flex-1 flex flex-col overflow-y-auto h-full w-full my-6"
      >
        {!loading && data.messages ? (
          data.messages
            .slice()
            .reverse()
            .map((m) => <Message message={m} key={m.id} />)
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
                  channelId,
                  body: inputs.body,
                },
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

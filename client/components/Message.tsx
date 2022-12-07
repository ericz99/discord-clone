import React from "react";

export default function Message({ message }) {
  return (
    <div
      key={`message_${message.id}`}
      className="flex flex-col text-white py-4"
    >
      <div className="flex mb-2">
        <p className="text-sm font-black">
          {message.user ? message.user.username : message.sender.username}
        </p>
        <p className="ml-4 text-xs text-gray-600">
          {new Date(Number(message.createdAt)).toLocaleString()}
        </p>
      </div>

      <p className="text-xs	font-semibold leading-loose">{message.body}</p>
    </div>
  );
}

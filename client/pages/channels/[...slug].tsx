import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  MessageContainer,
  ServerContainer,
  SidebarContainer,
} from "../../components";
import { checkUserAuth, setAccessToken } from "../../shared/auth";

export default function ServerPath({ access_token, loggedInUser }) {
  const router = useRouter();
  const slug = (router.query.slug as string[]) || [];
  const serverSelected = slug[0] ?? null;
  const channelSelected = slug[1] ?? null;

  useEffect(() => {
    if (access_token) {
      setAccessToken(access_token);
    }
  }, [access_token]);

  return (
    <>
      {serverSelected && (
        <ServerContainer serverId={slug[0]} loggedInUser={loggedInUser} />
      )}
      {channelSelected && <MessageContainer channelId={slug[1]} />}
    </>
  );
}

ServerPath.getLayout = function getLayout(page) {
  return (
    <div className="flex h-full w-full relative bg-slate-800">
      <SidebarContainer />
      {page}
    </div>
  );
};

// This gets called on every request
export async function getServerSideProps({ req }) {
  return checkUserAuth(req);
}

import React, { useEffect } from "react";
import { DMContainer, SidebarContainer } from "../../../components";
import { checkUserAuth, setAccessToken } from "../../../shared/auth";

export default function DMChannel({ access_token }) {
  useEffect(() => {
    if (access_token) {
      setAccessToken(access_token);
    }
  }, [access_token]);

  return (
    <>
      <DMContainer />
    </>
  );
}

DMChannel.getLayout = function getLayout(page) {
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

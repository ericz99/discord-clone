import React, { useEffect } from "react";

import { SidebarContainer } from "../../components";

import { checkUserAuth, setAccessToken } from "../../shared/auth";

const ChannelsPage = ({ access_token }) => {
  useEffect(() => {
    if (access_token) {
      setAccessToken(access_token);
    }
  }, [access_token]);

  return (
    <div className="flex h-full w-full relative bg-slate-800">
      <SidebarContainer />
    </div>
  );
};

// This gets called on every request
export async function getServerSideProps({ req }) {
  return checkUserAuth(req);
}

export default ChannelsPage;

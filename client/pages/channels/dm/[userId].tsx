import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  DMContainer,
  SidebarContainer,
  DMMessageContainer,
} from "../../../components";
import { checkUserAuth, setAccessToken } from "../../../shared/auth";

export default function DMUser({ access_token }) {
  const router = useRouter();
  const { userId } = router.query as any;

  useEffect(() => {
    if (access_token) {
      setAccessToken(access_token);
    }
  }, [access_token]);

  return (
    <>
      <DMMessageContainer userId={userId} />
    </>
  );
}

DMUser.getLayout = function getLayout(page) {
  return (
    <div className="flex h-full w-full relative bg-slate-800">
      <SidebarContainer />
      <DMContainer />
      {page}
    </div>
  );
};

// This gets called on every request
export async function getServerSideProps({ req }) {
  return checkUserAuth(req);
}

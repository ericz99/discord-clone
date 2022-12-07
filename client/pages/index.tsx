import { useEffect } from "react";
import { useRouter } from "next/router";

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/") router.push("/register");
  }, [router]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello World</h1>
      <a href="/api/users">View Users</a>
    </div>
  );
}

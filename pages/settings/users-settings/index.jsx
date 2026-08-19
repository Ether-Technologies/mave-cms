import { useEffect } from "react";
import { useRouter } from "next/router";

export default function UsersSettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/users");
  }, [router]);

  return null;
}

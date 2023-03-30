import { useRouter } from "next/router";

import AdminUserProfile from "@/components/admin-user-profile";

export default function UserProfileManager() {
  const router = useRouter();
  const { username } = router.query;
  if (!username) {
    return;
  }
  return (
    <>
      <AdminUserProfile username={username as string} />
    </>
  );
}

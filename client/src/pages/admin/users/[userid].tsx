import { useRouter, NextRouter } from "next/router";

import AdminUserProfile from "@/components/admin-user-profile";

export default function UserProfileManager(): void | React.ReactElement {
  const router: NextRouter = useRouter();
  const { userid } = router.query;
  if (!userid) {
    return;
  }
  return (
    <>
      <AdminUserProfile id={userid as unknown as number} />
    </>
  );
}

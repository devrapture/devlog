import { Suspense } from "react";
import ProfileClient from "./profile-client";

export const metadata = {
  title: "Profile",
};
const ProfilePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileClient />
    </Suspense>
  );
};

export default ProfilePage;

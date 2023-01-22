import { signOut, useSession } from "next-auth/react";

const Profile = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      {sessionData && sessionData?.user?.image && (
        <button onClick={() => signOut()}>
          <img
            className="h-10 w-10 rounded-full"
            src={sessionData.user?.image}
          />
        </button>
      )}
    </>
  );
};

export default Profile;

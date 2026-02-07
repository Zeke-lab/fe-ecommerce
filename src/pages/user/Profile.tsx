import { useAuthStore, selectAuth } from '@/services/zustand/authStore';

const Profile = () => {
  const user = useAuthStore(selectAuth);

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
};

export default Profile;

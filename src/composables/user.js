const userData = () => JSON.parse(localStorage.getItem("userData"));

const userType = () => {
  const parsedUserData = userData();
  if (parsedUserData) return parsedUserData.type;
  return null;
};

const userName = () => {
  const parsedUserData = userData();
  if (parsedUserData) return parsedUserData.username;
  return null;
};
const userEmail = () => {
  const parsedUserData = userData();
  if (parsedUserData) return parsedUserData.email;
  return null;
};
const accessToken = () => localStorage.getItem("accessToken");

export function useUser() {
  return {
    userData,
    userType,
    userName,
    userEmail,
    accessToken,
  };
}

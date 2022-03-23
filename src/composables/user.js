const userData = () => JSON.parse(localStorage.getItem("userData"));
const userType = () => userData().type;
const userName = () => userData().username;
const userEmail = () => userData().email;
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

export const updateUserProfile = (users, currentUser, { name, password }) => {
  const updatedUser = { ...currentUser, name };
  const updatedUsers = users.map((user) =>
    user.email === currentUser.email ? { ...user, name, password: password || user.password } : user
  );

  return { updatedUser, updatedUsers };
};

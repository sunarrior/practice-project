// import { dataSource } from "../data-source";
import User from "../entity/User";
import { dataSource } from "../config/data-source.config";

const userRepos = dataSource.getRepository(User);

const createUser = async (userData: {
  [index: string]: string;
}): Promise<void> => {
  const user = new User();
  user.role = userData.role;
  user.fullName = userData.fullName;
  user.username = userData.username;
  user.email = userData.email;
  user.password = userData.password;
  await userRepos.save(user);
};

const getAllUsers = async (): Promise<User[]> => {
  const result = await userRepos.find();
  return result;
};

const getUserByAttrb = async (data: {
  [index: string]: string | number;
}): Promise<User | null> => {
  const result = await userRepos.findOneBy(data);
  return result;
};

const updateUserData = async (
  userid: number,
  data: {
    [index: string]: string | number | boolean | null;
  }
): Promise<void> => {
  await userRepos.update(userid, data);
};

const deleteUser = async (user: User): Promise<void> => {
  await userRepos.remove(user);
};

export default {
  createUser,
  getAllUsers,
  getUserByAttrb,
  updateUserData,
  deleteUser,
};

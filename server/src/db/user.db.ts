import { Repository } from "typeorm";

import User from "../entity/User";
import { dataSource } from "../config/data-source.config";

const userRepos: Repository<User> = dataSource.getRepository(User);

const createUser = async (user: User): Promise<User> => {
  const result: User = await userRepos.save(user);
  return result;
};

const getAllUsers = async (): Promise<User[]> => {
  const result: User[] = await userRepos.find();
  return result;
};

const getUserById = async (userid: number): Promise<User | null> => {
  const result: User | null = await userRepos.findOneBy({ id: userid });
  return result;
};

const getUserByUsername = async (username: string): Promise<User | null> => {
  const result: User | null = await userRepos.findOneBy({ username });
  return result;
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  const result: User | null = await userRepos.findOneBy({ email });
  return result;
};

const updateUserData = async (userid: number, user: User): Promise<void> => {
  await userRepos.update(userid, user);
};

const deleteUser = async (user: User): Promise<void> => {
  await userRepos.remove(user);
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserData,
  deleteUser,
};

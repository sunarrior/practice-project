/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import User from "@/components/user";
import UserTable from "@/components/user-table";
import API from "@/config/axios.config";

function UserList({
  data,
  handleDeleteUser,
  handleBlockUser,
}: {
  data: any;
  handleDeleteUser: (userid: number) => Promise<void>;
  handleBlockUser: (username: string, isBlocked: boolean) => Promise<void>;
}): React.ReactElement {
  const userList = data.map((user: any) => (
    <User
      key={user.id}
      userid={user.id}
      username={user.username}
      email={user.email}
      createdAt={new Date(user.createdAt).toLocaleString()}
      role={user.role}
      status={user.status}
      isBlocked={user.isBlocked}
      url={`http://localhost:3000/admin/user/${user.username}`}
      handleDeleteUser={handleDeleteUser}
      handleBlockUser={handleBlockUser}
    />
  ));
  return <>{userList}</>;
}

export default function UserListManager(): React.ReactElement {
  const [userList, setUserList] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState("AscCreatedDay");

  useEffect(() => {
    (async () => {
      try {
        const userObj = JSON.parse(localStorage.getItem("_uob") as any);
        if (!userObj) {
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${userObj?.access_token}`,
          },
        };
        const result = await API.get("/user/all", config);
        const sortUserList = result.data.userList.sort((o1: any, o2: any) => {
          if (sortOption === "DesCreatedDay") {
            return o2.createdAt - o1.createdAt;
          }
          return o1.createdAt - o2.createdAt;
        });
        setUserList(sortUserList);
      } catch (error) {
        // do something
      }
    })();
  }, [sortOption]);

  function handleSortOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortOption(e.target.value);
  }

  async function handleDeleteUser(userid: number): Promise<any> {
    const userObj = JSON.parse(localStorage.getItem("_uob") as any);
    if (!userObj) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userObj?.access_token}`,
      },
    };
    const result = await API.delete(`/user/${userid}`, config);
    if (result.data.status.localeCompare("failed") === 0) {
      return toast(result.data.msg, { autoClose: 3000, type: "error" });
    }
    const newUserList: any[] = userList.filter(
      (user: any) => user.id !== userid
    );
    toast(result.data.msg, { autoClose: 3000, type: "success" });
    setUserList(newUserList);
  }

  async function handleBlockUser(
    username: string,
    isBlocked: boolean
  ): Promise<any> {
    const userObj = JSON.parse(localStorage.getItem("_uob") as any);
    if (!userObj) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userObj?.access_token}`,
      },
    };
    const data = {
      isBlocked: !isBlocked,
    };
    const result = await API.put(`/user/${username}`, data, config);
    if (result.data.status.localeCompare("failed") === 0) {
      return toast(result.data.msg, { autoClose: 3000, type: "error" });
    }
    const newUserList = userList.map((user: any) => {
      if (user.username === username) {
        return { ...user, isBlocked: !isBlocked };
      }
      return user;
    });
    toast(result.data.msg, { autoClose: 3000, type: "success" });
    setUserList(newUserList);
  }

  return (
    <>
      <div className="my-14">
        <div className="mx-10 mb-2 w-1/4">
          <select
            id="sort-option"
            className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={handleSortOptionChange}
          >
            <option value="AscOrderDay" defaultValue="AscOrderDay">
              Ascending by created day
            </option>
            <option value="DescOrderDay">Descending by created day</option>
          </select>
        </div>
        <UserTable>
          {userList ? (
            <UserList
              data={userList}
              handleDeleteUser={handleDeleteUser}
              handleBlockUser={handleBlockUser}
            />
          ) : null}
        </UserTable>
      </div>
    </>
  );
}

import React, { useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { UserData } from "@/interface/UserData";
import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";
import UserRow from "@/components/user-row";
import UserTable from "@/components/user-table";
import API from "@/config/axios.config";

function UserList({
  data,
  handleDeleteUser,
  handleBlockUser,
}: {
  data: UserData[];
  handleDeleteUser: (userid: number) => Promise<void>;
  handleBlockUser: (userid: number, isBlocked: boolean) => Promise<void>;
}): React.ReactElement {
  const userList = data.map((user: any) => (
    <UserRow
      key={user.id}
      userid={user.id}
      username={user.username}
      email={user.email}
      createdAt={new Date(user.createdAt).toLocaleString()}
      role={user.role}
      status={user.status ? "active" : "inactive"}
      isBlocked={user.isBlocked}
      url={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/admin/users/${user.id}`}
      handleDeleteUser={handleDeleteUser}
      handleBlockUser={handleBlockUser}
    />
  ));
  return <>{userList}</>;
}

export default function UserListManager(): React.ReactElement {
  const [userList, setUserList] = useState<UserData[]>([]);
  const [sortOption, setSortOption] = useState("AscCreatedDay");

  useEffect((): void => {
    (async (): Promise<void> => {
      try {
        const userObj: UserObjectLS = JSON.parse(
          localStorage.getItem("_uob") as any
        );
        if (!userObj) {
          return;
        }
        const config: ApiConfig = {
          headers: {
            Authorization: `Bearer ${userObj?.access_token}`,
          },
        };
        const result: AxiosResponse = await API.get("/user/admin", config);
        const sortUserList: UserData[] = result.data.userList.sort(
          (o1: UserData, o2: UserData) => {
            if (sortOption === "DesCreatedDay") {
              return (o2.createdAt as any) - (o1.createdAt as any);
            }
            return (o1.createdAt as any) - (o2.createdAt as any);
          }
        );
        setUserList(sortUserList);
      } catch (error: any) {
        toast(error.response?.data?.msg || error.message, {
          type: "error",
          autoClose: 3000,
        });
      }
    })();
  }, [sortOption]);

  function handleSortOptionChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    setSortOption(e.target.value);
  }

  async function handleDeleteUser(userid: number): Promise<any> {
    try {
      const userObj: UserObjectLS = JSON.parse(
        localStorage.getItem("_uob") as any
      );
      if (!userObj) {
        return;
      }
      const config: ApiConfig = {
        headers: {
          Authorization: `Bearer ${userObj?.access_token}`,
        },
      };
      const result: AxiosResponse = await API.delete(
        `/user/admin/${userid}`,
        config
      );
      const newUserList: UserData[] = userList.filter(
        (user: UserData) => user.id !== userid
      );
      toast(result.data.msg, { autoClose: 3000, type: "success" });
      setUserList(newUserList);
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
    }
  }

  async function handleBlockUser(
    userid: number,
    isBlocked: boolean
  ): Promise<any> {
    try {
      const userObj: UserObjectLS = JSON.parse(
        localStorage.getItem("_uob") as any
      );
      if (!userObj) {
        return;
      }
      const config: ApiConfig = {
        headers: {
          Authorization: `Bearer ${userObj?.access_token}`,
        },
      };
      const data: UserData = {
        isBlocked: !isBlocked,
      };
      const result: AxiosResponse = await API.put(
        `/user/admin/${userid}/block`,
        data,
        config
      );
      const newUserList: UserData[] = userList.map((user: any) => {
        if (user.id === userid) {
          return { ...user, isBlocked: !isBlocked };
        }
        return user;
      });
      toast(result.data.msg, { autoClose: 3000, type: "success" });
      setUserList(newUserList);
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
    }
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

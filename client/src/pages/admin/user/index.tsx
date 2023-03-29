import React, { useState, useEffect } from "react";

import User from "@/components/user";
import UserTable from "@/components/user-table";
import API from "@/config/axios.config";

function UserList({ data }: { data: any }): React.ReactElement {
  const userList = data.map((user: any) => (
    <User
      key={user.id}
      userid={user.id}
      username={user.username}
      email={user.email}
      createdAt={new Date(user.createdAt).toLocaleString()}
      role={user.role}
      url={`http://localhost:3000/admin/user/${user.id}`}
    />
  ));
  return <>{userList}</>;
}

export default function UserListManager(): React.ReactElement {
  const [userList, setUserList] = useState("");
  const [sortOption, setSortOption] = useState("AscCreatedDay");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
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
        <UserTable>{userList ? <UserList data={userList} /> : null}</UserTable>
      </div>
    </>
  );
}

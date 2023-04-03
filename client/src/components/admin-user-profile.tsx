import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import API from "@/config/axios.config";
import ButtonEdit from "@/components/button-edit";
import { getYYYYMMDDString } from "@/utils/format.util";

type ProfileType = {
  username?: string;
  email: string;
  createdAt?: string;
  role?: string;
  status?: string;
  fullName: string;
  phone: string;
  dob: string;
  gender: boolean;
  deliveryAddress: string;
  avatarUrl: string;
};

const profileDefault: ProfileType = {
  username: "",
  email: "",
  createdAt: getYYYYMMDDString(),
  role: "",
  status: "",
  fullName: "",
  phone: "",
  dob: getYYYYMMDDString(),
  gender: true,
  deliveryAddress: "",
  avatarUrl: "",
};

export default function Profile({
  username,
}: {
  username: string;
}): React.ReactElement {
  const router = useRouter();
  const [profile, setProfile] = useState(profileDefault);
  const [isEdit, setIsEdit] = useState(false);
  const [isUploadAvatar, setIsUploadAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadProgess, setUploadProgess] = useState(0);

  useEffect(() => {
    (async () => {
      const userObj = JSON.parse(localStorage.getItem("_uob") as any);
      if (!userObj) {
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${userObj?.access_token}`,
        },
      };
      const result = await API.get(`/user/${username}`, config);
      setProfile({
        username: result.data.userData.username || "",
        email: result.data.userData.email ? result.data.userData.email : "",
        createdAt:
          new Date(result.data.userData.createdAt).toLocaleString() || "",
        role: result.data.userData.role || "",
        status: result.data.userData.status || "",
        fullName: result.data.userData.fullName
          ? result.data.userData.fullName
          : "",
        phone: result.data.userData.phone ? result.data.userData.phone : "",
        dob: result.data.userData.dob
          ? result.data.userData.dob.substring(0, 10)
          : getYYYYMMDDString(),
        gender: result.data.userData.gender ? result.data.userData.gender : "",
        deliveryAddress: result.data.userData.deliveryAddress
          ? result.data.userData.deliveryAddress
          : "",
        avatarUrl: result.data.userData.avatarUrl
          ? result.data.userData.avatarUrl
          : "",
      });
    })();
  }, [isUploadAvatar, username]);

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setProfile({ ...profile, email: e.target.value });
  }

  function handleFullnameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setProfile({ ...profile, fullName: e.target.value });
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setProfile({ ...profile, phone: e.target.value });
  }

  function handleDOBChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setProfile({ ...profile, dob: e.target.value });
  }

  function handleGenderChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.value === "true") {
      return setProfile({ ...profile, gender: true });
    }
    setProfile({ ...profile, gender: false });
  }

  function handleDeliveryAddressChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setProfile({ ...profile, deliveryAddress: e.target.value });
  }

  function handleEdit(): void {
    setIsEdit(true);
  }

  function handleCancle(): void {
    setIsEdit(false);
  }

  async function handleSubmitInfo(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> {
    e.preventDefault();
    const data: ProfileType = { ...profile };
    delete data.username;
    delete data.createdAt;
    delete data.role;
    delete data.status;

    const userObj = JSON.parse(localStorage.getItem("_uob") as any);
    if (!userObj) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userObj?.access_token}`,
      },
    };
    const result = await API.put(`/user/${username}`, data, config);
    if (result.data.status === "failed") {
      // do something
      return router.reload();
    }
    setIsEdit(false);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    // e.preventDefault();
    if (e.target.files === null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    setIsUploadAvatar(true);
    e.target.value = "";
  }

  async function handleImageUpload(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> {
    e.preventDefault();
    const userObj = JSON.parse(localStorage.getItem("_uob") as any);
    if (!userObj) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userObj?.access_token}`,
      },
      onUploadProgress: (progressEvent: any) => {
        const { loaded, total } = progressEvent;
        const percent: number = Math.floor((loaded * 100) / total);
        setUploadProgess(percent);
      },
    };
    const data = { filePath: avatarPreview };
    const result = await API.post(
      `/user/${userObj?.username}/avatar`,
      data,
      config
    );
    if (result.data.status === "failed") {
      // do something
      return router.reload();
    }
    setProfile({ ...profile, avatarUrl: avatarPreview });
    setAvatarPreview("");
    setIsUploadAvatar(false);
    setUploadProgess(0);
  }

  function handleCancelUploadAvatar(): void {
    setAvatarPreview("");
    setIsUploadAvatar(false);
  }

  function imageChange(): string {
    if (avatarPreview !== "") {
      return avatarPreview;
    }
    if (profile.avatarUrl !== "") {
      return profile.avatarUrl;
    }
    return "/blank-image.jpg";
  }

  return (
    <>
      <div className="py-14 container max-w-3xl mx-auto">
        <div className="box-border h-auto w-auto p-4 border-4 rounded-xl bg-orange-400">
          <div className="relative">
            <div className="absolute top-0 right-0">
              <ButtonEdit
                isEdit={isEdit}
                onEdit={handleEdit}
                onCancel={handleCancle}
              ></ButtonEdit>
            </div>
          </div>
          <p className="text-center text-4xl font-bold text-neutral-500 mt-4 mb-5">
            User Profile
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="container">
              <div className="h-60">
                <Image
                  className="mt-4 object-cover h-56 w-96 rounded-2xl bg-white"
                  src={imageChange() as unknown as string}
                  alt="image"
                  width={500}
                  height={500}
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full">
                <div
                  className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                  style={{ width: `${uploadProgess}%` }}
                  hidden={!isEdit || !isUploadAvatar || uploadProgess === 0}
                >
                  {" "}
                  {uploadProgess}%
                </div>
              </div>
              <div className="grid place-items-center mt-2">
                <form
                  encType="multipart/form-data"
                  className="grid place-items-center"
                  id="upload-avatar-form"
                  onSubmit={handleImageUpload}
                >
                  <div
                    className="relative flex justify-center h-11 rounded-md cursor-pointer bg-purple-500 hover:bg-purple-400"
                    hidden={!isEdit}
                  >
                    <input
                      className="z-20 opacity-0 w-full cursor-pointer"
                      type="file"
                      onChange={handleImageChange}
                      hidden={!isEdit}
                    />
                    <span className="absolute grid place-content-center h-full w-full">
                      <p className="font-bold text-white" hidden={!isEdit}>
                        Upload Avatar
                      </p>
                    </span>
                  </div>
                </form>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    className="px-6 py-2 border rounded-md bg-green-500 hover:bg-green-400 text-white font-bold"
                    type="submit"
                    form="upload-avatar-form"
                    hidden={!isEdit || !isUploadAvatar}
                  >
                    Save
                  </button>
                  <button
                    className="px-6 py-2 border rounded-md bg-red-500 hover:bg-red-400 text-white font-bold"
                    onClick={handleCancelUploadAvatar}
                    hidden={!isEdit || !isUploadAvatar}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div className="ml-3">
              <form
                className="w-full max-w-md mx-auto my-3"
                id="profile-form"
                onSubmit={handleSubmitInfo}
              >
                <div className="mb-2">
                  <label className="font-bold" htmlFor="inline-full-name">
                    - Username -
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 disabled:bg-gray-300"
                    id="inline-full-name"
                    type="text"
                    placeholder="username"
                    value={profile.username}
                    disabled={true}
                  />
                </div>
                <div className="mb-2">
                  <label className="font-bold" htmlFor="inline-full-name">
                    - Email -
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 disabled:bg-gray-300"
                    id="inline-email"
                    type="email"
                    placeholder="email"
                    value={profile.email}
                    onChange={handleEmailChange}
                    required
                    disabled={!isEdit}
                  />
                </div>
                <div className="mb-2">
                  <label className="font-bold" htmlFor="inline-full-name">
                    - Created At -
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 disabled:bg-gray-300"
                    id="inline-email"
                    type="text"
                    placeholder="created at"
                    value={profile.createdAt}
                    required
                    disabled={true}
                  />
                </div>
                <div className="mb-2">
                  <label className="font-bold" htmlFor="inline-full-name">
                    - Role -
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 disabled:bg-gray-300"
                    id="inline-email"
                    type="text"
                    placeholder="role"
                    value={profile.role}
                    required
                    disabled={true}
                  />
                </div>
                <div className="mb-2">
                  <label className="font-bold" htmlFor="inline-full-name">
                    - Status -
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 disabled:bg-gray-300"
                    id="inline-email"
                    type="text"
                    placeholder="status"
                    value={profile.status}
                    required
                    disabled={true}
                  />
                </div>
                <div className="mb-2">
                  <label className="font-bold" htmlFor="inline-full-name">
                    - Full Name -
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 disabled:bg-gray-300"
                    id="inline-full-name"
                    type="text"
                    placeholder="full name"
                    value={profile.fullName}
                    onChange={handleFullnameChange}
                    disabled={!isEdit}
                  />
                </div>
                <div className="mb-2">
                  <label className="font-bold" htmlFor="inline-full-name">
                    - Phone Number -
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 disabled:bg-gray-300"
                    id="inline-phone"
                    type="text"
                    placeholder="phone"
                    value={profile.phone}
                    onChange={handlePhoneChange}
                    disabled={!isEdit}
                  />
                </div>
                <div className="mb-2">
                  <label className="font-bold" htmlFor="inline-full-name">
                    - Date Of Birth -
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 uppercase leading-tight focus:outline-none focus:bg-white focus:border-purple-500 disabled:bg-gray-300"
                    id="inline-dob"
                    type="date"
                    value={profile.dob}
                    onChange={handleDOBChange}
                    required
                    disabled={!isEdit}
                  />
                </div>
                <div className="flex mb-2 font-bold tetx-lg">
                  Gender:
                  <div>
                    <input
                      className="relative float-left mt-1 ml-4 h-4 w-4 hover:cursor-pointer disabled:bg-gray-300"
                      id="male-radio"
                      type="radio"
                      name="gender-option"
                      value="true"
                      onChange={handleGenderChange}
                      checked={profile.gender === true}
                      disabled={!isEdit}
                    />
                    <label
                      className="ml-1 hover:cursor-pointer"
                      htmlFor="male-radio"
                    >
                      Male
                    </label>
                  </div>
                  <div>
                    <input
                      className=" relative float-left mt-1 ml-4 h-4 w-4 hover:cursor-pointer disabled:bg-gray-300"
                      id="female-radio"
                      type="radio"
                      name="gender-option"
                      value="false"
                      onChange={handleGenderChange}
                      checked={profile.gender === false}
                      disabled={!isEdit}
                    />
                    <label
                      className="ml-1 hover:cursor-pointer"
                      htmlFor="female-radio"
                    >
                      Female
                    </label>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="font-bold" htmlFor="inline-full-name">
                    - Delivery Address -
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 disabled:bg-gray-300"
                    id="inline-delivery-address"
                    type="text"
                    placeholder="delivery address"
                    value={profile.deliveryAddress}
                    onChange={handleDeliveryAddressChange}
                    disabled={!isEdit}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

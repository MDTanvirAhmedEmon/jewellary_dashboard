import { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { IoCameraOutline } from "react-icons/io5";
import { PasswordTab } from "./PasswordTab";
import Navigate from "../../Navigate";
import { useGetProfileQuery, useUpdateProfileMutation } from "../redux/api/userApi";





const Profile = () => {

  const [activeTab, setActiveTab] = useState("1");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [form] = Form.useForm();
  const [image, setImage] = useState();
  const { data: profile } = useGetProfileQuery()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });
    }
  }, [profile, form]);

  const onEditProfile = async (values) => {
    const data = new FormData();
    if (image) data.append("photo", image);
    data.append("name", values.name);
    data.append("phone", values.phone);
    try {
      const response = await updateProfile(data).unwrap();
      console.log(response)
      message.success(response.message);

    } catch (error) {
      message.error(error.data.message);

      console.log(error);
    }
  };


  const tabItems = [
    {
      key: "1",
      label: "Edit Profile",
      content: (
        <Form onFinish={onEditProfile} layout="vertical" form={form}>
          <Form.Item name="name" label="Name">
            <Input
              style={{ padding: "9px", borderRadius: "0px" }}
              placeholder="Enter name"
              rules={[{ required: true, message: "Please write a Email" }]}
            />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input
              disabled
              style={{ padding: "9px", borderRadius: "0px" }}
              placeholder="Enter Email"
              rules={[{ required: true, message: "Please write a Email" }]}
            />
          </Form.Item>

          <Form.Item name="phone" label="Phone Number">
            <Input
              style={{ padding: "9px", borderRadius: "0px" }}
              placeholder="Enter Phone Number"
              rules={[{ required: true, message: "Please write a Number" }]}
            />
          </Form.Item>

          <button
            type="primary"
            className="w-full bg-black text-white py-2"
          >
            {isLoading ? "Loading..." : "Update"}
          </button>
        </Form>
      ),
    },
    {
      key: "2",
      label: "Change Password",
      content: <PasswordTab />,
    },
  ];

  return (
    <div className="p-3 bg-white">
      <Navigate title={'Profile'}></Navigate>
      <div className="">
        <div className="max-w-xl mx-auto mt-8 rounded-lg p-6 ">
          {/* Profile Picture Section */}
          <div className="text-center mb-6">
            <div className="relative w-[140px] h-[124px] mx-auto">
              <input
                type="file"
                onChange={handleImageChange}
                id="img"
                style={{ display: "none" }}
              />
              <img
                style={{ width: 140, height: 140, borderRadius: "100%" }}
                src={`${image
                    ? URL.createObjectURL(image)
                    : `${profile?.photo_url}`
                  }`}
                alt="Admin Profile"
              />
              {activeTab === "1" && (
                <label
                  htmlFor="img"
                  className="absolute top-[80px] -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                >
                  <IoCameraOutline className="text-black " />
                </label>
              )}
            </div>

            <p className="text-lg font-semibold mt-4">
              {profile?.name}
            </p>
          </div>

          {/* Custom Tabs Section */}
          <div className="mb-4">
            <div className="flex space-x-6 justify-center mb-4">
              {tabItems.map((item) => (
                <button
                  key={item.key}
                  className={`py-2 font-medium ${activeTab === item.key
                      ? "border-b border-black text-black"
                      : "text-black hover:text-[#02111E]"
                    }`}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div>{tabItems.find((item) => item.key === activeTab)?.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

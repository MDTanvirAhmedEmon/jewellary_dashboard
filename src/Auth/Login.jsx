import { Checkbox, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../page/redux/features/auth/authSlice";
import { useLoginAdminMutation } from "../page/redux/api/userApi";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  const onFinish = async (values) => {
    loginAdmin(values)
      .unwrap()
      .then((payload) => {

        console.log(payload?.role);
        if (payload?.role === "admin") {
          dispatch(setToken(payload?.accessToken));
          message.success(payload?.message);
          navigate("/");
        }
        else {
          message.error("Only Admin Can LogIn🥹")
        }

      })
      .catch((error) => {
        console.error("Login error:", error);
        message.error(error?.data?.message);
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-[600px] bg-white rounded-lg shadow-lg p-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Login to Account</h2>
          <p className="text-gray-600 mb-6">Please enter your email and password to continue</p>
        </div>
        <Form
          name="login"
          initialValues={{ remember_me: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input your Email!" }, { type: "email", message: "Invalid Email!" }]}
          >
            <Input placeholder="Enter your Email" className="w-full px-4 py-2 border rounded" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" className="w-full px-4 py-2 border rounded" />
          </Form.Item>

          <div className="flex items-center justify-between mb-4">
            <Form.Item name="remember_me" valuePropName="checked" noStyle>
              <Checkbox className="text-gray-700">Remember me</Checkbox>
            </Form.Item>
            <Link to="/forgetpassword" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
          </div>

          <Form.Item>
            <button disabled={isLoading} type="submit" className="w-full py-2 bg-black text-white rounded hover:bg-gray-800">
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

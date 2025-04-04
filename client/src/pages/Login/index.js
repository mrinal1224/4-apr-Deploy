import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../api/users";

function Login() {
  // call localhoit:5000/api/users/login
  const navigate = useNavigate();
  const onFinish = async (value) => {
    try {
      const response = await LoginUser(value);
      if (response.success) {
        console.log(response.message);
        message.success(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");
      } else {
        console.log(response.message);
        message.error(response.message);
      }
    } catch (err) {
      console.log(err);
      message.error(err.message);
    }
  };
  return (
    <>
      <main className="App-header">
        <h1>Login to Book My Show</h1>
        <section className="mw-500 text-center px-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              htmlFor="email"
              name="email"
              className="d-block"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input id="email" type="text" placeholder="Enter Your Email" />
            </Form.Item>
            <Form.Item
              label="Password"
              htmlFor="password"
              name="password"
              className="d-block"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input
                id="password"
                type="password"
                placeholder="Enter Your Password"
              />
            </Form.Item>
            <Form.Item className="d-block">
              <Button
                type="primary"
                block
                htmlType="submit"
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <div>
            <p>
              {" "}
              New User ? <Link to="/register">Register</Link>
            </p>
            <p>
              Forgot Password ? <Link to="/forget">Cick Here</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Login;

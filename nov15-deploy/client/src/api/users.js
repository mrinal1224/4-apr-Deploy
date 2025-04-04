import { axiosInstance } from "./";

// register a new user

export const RegisterUser = async (value) => {
  try {
    const response = await axiosInstance.post("api/users/register", value); // call localhost:8082/api/users/register
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const LoginUser = async (value) => {
  try {
    const response = await axiosInstance.post("api/users/login", value); // call localhost:8082/api/users/login
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("api/users/get-current-user");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const ForgetPassword = async (value) => {
  try {
    const response = await axiosInstance.patch(
      "api/users/forgetpassword",
      value
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const ResetPassword = async (value, id) => {
  try {
    const response = await axiosInstance.patch(
      `api/users/resetpassword/${id}`,
      value
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

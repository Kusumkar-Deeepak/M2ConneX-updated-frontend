import React, { useContext } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ApiConfig from "../../utils/ApiConfig";
import AuthContext from "../../authContext";
import { ToastContainer, toast } from "react-toastify";
import EyeOpen from "./EyeOpen";
import EyeClose from "./EyeClose";
import student from "../../assets/student.svg";
import alumni from "../../assets/alumni.svg";
import faculty from "../../assets/faculty.svg";

import login_image from "../../assets/login.jpg";

export default function Login() {
  const { setAuth } = useContext(AuthContext);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please fill all the fields", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    const data = {
      email: email,
      password: password,
    };
    console.log(data);
    console.log(ApiConfig.login);
    axios
      .post(ApiConfig.login, data)
      .then((res) => {
        console.log(res);
        if (res.data.tokens.access) {
          var decoded = jwtDecode(res.data.tokens.access);
          const userId = decoded.user_id;
          localStorage.setItem("accessToken", res.data.tokens.access);
          localStorage.setItem("refreshToken", res.data.tokens.refresh);
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          setAuth({
            login: true,
            role: role,
            userId: userId,
            email: res.data.email,
            tokens: res.data.tokens,
          });
          navigate("/");
          toast.success("Login Successful", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else if (res.status === 401 || res.status === 400) {
          console.log("error");
          toast.error("Invalid Credentials", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.detail, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };
  return (
    <div className="flex flex-row w-full py-4">
      <div className="w-1/2 p-5 max-lg:hidden">
        <img src={login_image} className="max-w-md" />
      </div>
      <div className="w-[50%] flex flex-col items-start justify-center max-[950px]:items-center max-[950px]:w-full">
        <form
          className="w-[80%] flex flex-col items-center justify-center border-[#dedede] rounded-md border border-gray max-[950px]:w-[90%] max-[950px]:mt-8"
          onSubmit={handleSubmit}
        >
          <h1 className="font-bold text-2xl mt-8">Login</h1>
          {/* <div className="w-full type-selector flex flex-col items-center ">
            <p className="font-medium text-sm text-[#30363D] mb-2">
              Select login type
            </p>
            <div className="w-[90%] cards flex flex-row justify-between">
              <div
                className={
                  "card w-32 h-40 px-8 rounded overflow-hidden border-gray border-[1px] flex flex-col justify-center items-center hover:cursor-pointer " +
                  (role === "Student" ? "border-[2.2px] border-primary" : "")
                }
                onClick={() => {
                  setRole("Student");
                }}
              >
                <img className="max-w-32" src={student} alt="student" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl">Student</div>
                </div>
              </div>

              <div
                className={
                  "card w-32 h-40 px-8 rounded overflow-hidden border-gray border-[1px] flex justify-center items-center flex-col hover:cursor-pointer " +
                  (role === "Alumni" ? "border-[2.2px] border-primary" : "")
                }
                onClick={() => {
                  setRole("Alumni");
                }}
              >
                <img className="w-32" src={alumni} alt="alumni" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl">Alumni</div>
                </div>
              </div>

              <div
                className={
                  "card w-32 h-40 px-8 rounded overflow-hidden border-gray border-[1px] flex justify-center items-center flex-col hover:cursor-pointer " +
                  (role === "Staff" ? "border-[2.2px] border-primary" : "")
                }
                onClick={() => {
                  setRole("Staff");
                }}
              >
                <img className="w-32" src={faculty} alt="alumni" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl">Staff</div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="lg:w-full w-full h-[15rem] mt-4 gap-y-6 flex flex-col justify-center items-center ">
            <input
              type="text"
              placeholder="Email"
              className="border-2 border-gray outline-none rounded w-[90%] px-2 py-2"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div className="border-2 border-gray outline-none w-[90%] px-2 py-2 rounded flex items-center">
              <input
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border-none outline-none"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {isShowPassword ? (
                <EyeOpen onClick={handleShowPassword} />
              ) : (
                <EyeClose onClick={handleShowPassword} />
              )}
            </div>
            <button
              type="submit"
              className="bg-white text-primary px-4 py-2 rounded-lg w-32 font-bold border border-gray hover:bg-primary hover:text-white transition-all duration-300"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
          <hr className="w-[90%] my-2" />
          <div className="flex flex-row justify-center items-center my-8">
            <p className="text-sm">Don't have an account?</p>
            <p
              className="text-sm text-primary ml-4 hover:cursor-pointer"
              onClick={() => {
                navigate("/register");
                window.location.reload();
              }}
            >
              Register
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

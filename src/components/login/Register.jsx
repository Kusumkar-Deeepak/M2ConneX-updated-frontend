import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ApiConfig from "../../utils/ApiConfig";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../authContext";
import EyeOpen from "./EyeOpen";
import EyeClose from "./EyeClose";
import student from "../../assets/student.svg";
import alumni from "../../assets/alumni.svg";
import faculty from "../../assets/faculty.svg";
import register_image from "../../assets/register.jpg";

export default function Register() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    batch: "",
    password: "",
    confirm_password: "",
    privilege: "Student",
    department: "1",
    enrollmentYear: "",
    passingOutYear: "",
    college: "",
    otp: "",
  });

  const { setAuth } = useContext(AuthContext);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const [emailError, setEmailError] = useState(false);

  const register = () => {
    if (data.password !== data.confirm_password) {
      // alert("Passwords do not match");
      toast.error("Passwords do not match", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    axios
      .post(ApiConfig.register, data)
      .then((res) => {
        if (res.status === 201) {
          toast.success("OTP Sent Successfully", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setPage(2);
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err, {
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

  const verifyOTP = () => {
    axios
      .post(ApiConfig.verifyOTP, { email: data.email, otp: data.otp })
      .then((res) => {
        if (res.status === 200) {
          toast.success("OTP verified", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          axios
            .post(ApiConfig.login, {
              email: data.email,
              password: data.password,
            })
            .then((response) => {
              console.log("response");
              if (response.data.tokens.access) {
                var decoded = jwtDecode(response.data.tokens.access);
                const userId = decoded.user_id;
                localStorage.setItem(
                  "accessToken",
                  response.data.tokens.access
                );
                localStorage.setItem(
                  "refreshToken",
                  response.data.tokens.refresh
                );
                localStorage.setItem("role", data.privilege);
                localStorage.setItem("userId", userId);
                navigate("/");
                setAuth({
                  login: true,
                  role: data.privilege,
                  userId: userId,
                  email: res.data.email,
                  tokens: res.data.tokens,
                });

                toast.success("Registered Successfully!", {
                  position: "bottom-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              } else {
                toast.error("Invalid Credentials!", {
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
            });
        } else {
          console.log(res);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err, {
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

  const handleBack = () => {
    if (page === 3 || page === 4 || page === 2) {
      setPage(1);
    } else {
      setPage(0);
    }
  };

  return (
    <div className="flex flex-row w-full py-4">
      {page != 0 ? (
        <div>
          <button className="self-start ml-4" onClick={handleBack}>
            <svg className="h-14" viewBox="0 0 512 512">
              <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " />
            </svg>
          </button>
        </div>
      ) : (
        <></>
      )}

      <div
        className={
          "inputs flex flex-col items-center justify-center w-full " +
          (page == 0 ? "pt-16" : "pt-8")
        }
      >
        {page == 0 ? (
          <>
            <div className="w-full cards flex flex-row justify-evenly ">
              <div
                className={
                  "card w-32 h-40 px-8 rounded overflow-hidden border-gray border-[1px] flex justify-center items-center flex-col hover:cursor-pointer " +
                  (data.privilege === "Student"
                    ? "border-[2.2px] border-primary"
                    : "")
                }
                onClick={() => {
                  setData({ ...data, privilege: "Student" });
                }}
              >
                <img className="w-32" src={student} alt="student" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">Student</div>
                </div>
              </div>

              <div
                className={
                  "card w-32 h-40 px-8 rounded overflow-hidden border-gray border-[1px] flex justify-center items-center flex-col hover:cursor-pointer " +
                  (data.privilege === "Alumni"
                    ? "border-[2.2px] border-primary"
                    : "")
                }
                onClick={() => {
                  setData({ ...data, privilege: "Alumni" });
                }}
              >
                <img className="w-32" src={alumni} alt="alumni" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">Alumni</div>
                </div>
              </div>

              <div
                className={
                  "card w-32 h-40 px-8 rounded overflow-hidden border-gray border-[1px] flex justify-center items-center flex-col hover:cursor-pointer " +
                  (data.privilege === "Staff"
                    ? "border-[2.2px] border-primary"
                    : "")
                }
                onClick={() => {
                  setData({ ...data, privilege: "Staff" });
                }}
              >
                <img className="w-32" src={faculty} alt="staff" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">Staff</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full lg:w-full gap-y-8 border-[#dedede] rounded-md">
              <div className="flex flex-row justify-between w-[80%] mt-4">
                <input
                  required
                  type="text"
                  placeholder="First Name"
                  className=" w-full p-2 mr-2 border-2 border-gray outline-none rounded"
                  value={data.firstName}
                  onChange={(value) => {
                    setData({ ...data, firstName: value.target.value });
                  }}
                />
                <input
                  required
                  type="text"
                  placeholder="Last Name"
                  className="border-2 border-gray outline-none rounded w-full p-2 ml-2"
                  value={data.lastName}
                  onChange={(value) => {
                    setData({ ...data, lastName: value.target.value });
                  }}
                />
              </div>
              <input
                required
                type="email"
                placeholder="Email"
                className={
                  "border-2 rounded w-[80%] p-2 " +
                  (emailError
                    ? "border-red outline-red"
                    : "border-[green] outline-[green]")
                }
                value={data.email}
                onChange={(value) => {
                  if (!validateEmail(value.target.value)) {
                    setEmailError(true);
                  } else {
                    setEmailError(false);
                  }
                  setData({ ...data, email: value.target.value });
                }}
              />

              <button
                className="bg-blue text-white px-4 py-2 rounded-lg my-4 w-32 font-bold"
                onClick={() => {
                  if (!validateEmail(data.email)) {
                    toast.error("Invalid email", {
                      position: "bottom-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    return;
                  }

                  if (
                    data.lastName.length === 0 ||
                    data.firstName.length === 0
                  ) {
                    toast.error("First or Last Name or cannot be empty", {
                      position: "bottom-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    return;
                  }

                  axios
                    .get(ApiConfig.checkEmail + "?email=" + data.email)
                    .then((res) => {
                      if (res.data.exists) {
                        toast.error("Email already exists", {
                          position: "bottom-center",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });
                      } else {
                        setPage(1);
                      }
                    });
                }}
              >
                Next
              </button>
            </div>
          </>
        ) : page == 1 && data.privilege == "Student" ? (
          <>
            <div className="student-fields flex flex-col w-full items-center">
              Enter details for student
              <input
                required
                type="text"
                placeholder="Batch"
                className="border-2 border-black w-[60%] p-1 mt-4"
                value={data.batch}
                onChange={(value) => {
                  setData({ ...data, batch: value.target.value });
                }}
              />
              <select
                required
                name="department"
                id="department"
                className="border-2 border-black w-[60%] p-1 mt-8"
                onChange={(value) => {
                  setData({ ...data, department: value.target.value });
                }}
              >
                <option value="1">Computer Engineering</option>
                <option value="2">Mechanical Engineering</option>
                <option value="3">
                  Electronics & Telecommunication Engineering
                </option>
                <option value="4">Electrical Engineering</option>
                <option value="5">Information Technology</option>
                <option value="6">
                  Artificial Intelligence & Data Science
                </option>
                <option value="7">First Year Engineering</option>
                <option value="8">MBA</option>
              </select>
              <div className="flex flex-col w-full items-center mt-4">
                <label htmlFor="enrollment" className="w-[60%]">
                  Enrollment Year
                </label>
                <input
                  required
                  type="date"
                  id="enrollment"
                  value={data.enrollmentYear}
                  placeholder="Enrollment Year"
                  className="border-2 border-black w-[60%] p-1"
                  onChange={(value) => {
                    setData({ ...data, enrollmentYear: value.target.value });
                  }}
                />
              </div>
              <div className="flex flex-col w-full items-center mt-4">
                <label htmlFor="passout" className="w-[60%]">
                  Passing out Year
                </label>
                <input
                  required
                  type="date"
                  id="passout"
                  value={data.passingOutYear}
                  placeholder="Pass out Year"
                  className="border-2 border-black w-[60%] p-1"
                  onChange={(value) => {
                    setData({ ...data, passingOutYear: value.target.value });
                  }}
                />
              </div>
              <input
                required
                type="password"
                placeholder="Password"
                className="border-2 border-black w-[60%] p-1 mt-8"
                value={data.password}
                onChange={(value) => {
                  setData({ ...data, password: value.target.value });
                }}
                onBlur={(value) => {
                  if (value.target.value.length < 8) {
                    toast.error("Password must be atleast 8 characters", {
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
                }}
              />
              <input
                required
                type="password"
                placeholder="Confirm Password"
                className="border-2 border-black w-[60%] p-1 mt-8"
                value={data.confirm_password}
                onChange={(value) => {
                  setData({ ...data, confirm_password: value.target.value });
                }}
                onBlur={(value) => {
                  if (value.target.value.length < 8) {
                    toast.error("Password must be atleast 8 characters", {
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
                }}
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg mt-16 w-32 font-bold"
                onClick={() => {
                  register("student");
                }}
              >
                Register
              </button>
            </div>
          </>
        ) : page == 1 && data.privilege == "Alumni" ? (
          <>
            <div className="alumni fields flex flex-col items-center justify-center w-full">
              Enter details for alumni
              <input
                required
                type="text"
                placeholder="Batch"
                className="border-2 border-black w-[60%] p-1 mt-8"
                value={data.batch}
                onChange={(value) => {
                  setData({ ...data, batch: value.target.value });
                }}
              />
              <select
                required
                name="department"
                id="department"
                className="border-2 border-black w-[60%] p-1 mt-8"
                onChange={(value) => {
                  setData({ ...data, department: value.target.value });
                }}
              >
                <option value="1">Computer Engineering</option>
                <option value="2">Mechanical Engineering</option>
                <option value="3">
                  Electronics & Telecommunication Engineering
                </option>
                <option value="4">Electrical Engineering</option>
                <option value="5">Information Technology</option>
                <option value="6">
                  Artificial Intelligence & Data Science
                </option>
                <option value="7">First Year Engineering</option>
                <option value="8">MBA</option>
              </select>
              <div className="flex flex-col w-full items-center mt-4">
                <label htmlFor="enrollment" className="w-[60%]">
                  Enrollment Year
                </label>
                <input
                  required
                  type="date"
                  id="enrollment"
                  value={data.enrollmentYear}
                  placeholder="Enrollment Year"
                  className="border-2 border-black w-[60%] p-1"
                  onChange={(value) => {
                    setData({ ...data, enrollmentYear: value.target.value });
                  }}
                />
              </div>
              <div className="flex flex-col w-full items-center mt-4">
                <label htmlFor="passout" className="w-[60%]">
                  Passing out Year
                </label>
                <input
                  required
                  type="date"
                  id="passout"
                  value={data.passingOutYear}
                  placeholder="Pass out Year"
                  className="border-2 border-black w-[60%] p-1"
                  onChange={(value) => {
                    setData({ ...data, passingOutYear: value.target.value });
                  }}
                />
              </div>
              <div className="border-2 border-black w-[60%] p-1 mt-8 flex">
                <input
                  type={isShowPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border-none outline-none"
                  value={data.password}
                  onChange={(value) => {
                    setData({ ...data, password: value.target.value });
                  }}
                />
                {isShowPassword ? (
                  <EyeOpen onClick={handleShowPassword} />
                ) : (
                  <EyeClose onClick={handleShowPassword} />
                )}
              </div>
              <div className="border-2 border-black w-[60%] p-1 mt-8 flex">
                <input
                  type={isShowPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full border-none outline-none"
                  value={data.confirm_password}
                  onChange={(value) => {
                    setData({ ...data, confirm_password: value.target.value });
                  }}
                />
                {isShowPassword ? (
                  <EyeOpen onClick={handleShowPassword} />
                ) : (
                  <EyeClose onClick={handleShowPassword} />
                )}
              </div>
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg mt-16 w-32 font-bold"
                onClick={() => {
                  register("alumni");
                }}
              >
                Register
              </button>
            </div>
          </>
        ) : page == 1 && data.privilege == "Staff" ? (
          <>
            <div className="faculty-fields flex flex-col items-center justify-center w-full">
              Enter details for faculty
              <input
                required
                type="text"
                placeholder="College"
                className="border-2 border-black w-[60%] p-1 mt-8"
                value={data.college}
                onChange={(value) => {
                  setData({ ...data, college: value.target.value });
                }}
              />
              <div className="border-2 border-black w-[60%] p-1 mt-8 flex items-center">
                <input
                  type={isShowPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border-none outline-none"
                  value={data.password}
                  onChange={(value) => {
                    setData({ ...data, password: value.target.value });
                  }}
                />
                {isShowPassword ? (
                  <EyeOpen onClick={handleShowPassword} />
                ) : (
                  <EyeClose onClick={handleShowPassword} />
                )}
              </div>
              <div className="border-2 border-black w-[60%] p-1 mt-8 flex items-center">
                <input
                  type={isShowPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full border-none outline-none"
                  value={data.confirm_password}
                  onChange={(value) => {
                    setData({ ...data, confirm_password: value.target.value });
                  }}
                />
                {isShowPassword ? (
                  <EyeOpen onClick={handleShowPassword} />
                ) : (
                  <EyeClose onClick={handleShowPassword} />
                )}
              </div>
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg mt-16 w-32 font-bold"
                onClick={() => {
                  register("faculty");
                }}
              >
                Register
              </button>
            </div>
          </>
        ) : page == 2 ? (
          // OTP page
          <div className="otp flex flex-col items-center justify-center w-full">
            <input
              type="text"
              placeholder="OTP"
              className="border-2 border-black w-[60%] p-1 mt-8"
              value={data.otp}
              onChange={(value) => {
                setData({ ...data, otp: value.target.value });
              }}
            />
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg mt-16 w-32 font-bold"
              onClick={() => {
                verifyOTP();
              }}
            >
              Register
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <ToastContainer />
      <div className="w-1/2 p-5 max-lg:hidden">
        <img src={register_image} className="max-w-md" />
      </div>
    </div>
  );
}

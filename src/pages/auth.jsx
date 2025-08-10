import { useState } from "react";
import Login from "../components/login/Login";
import Register from "../components/login/Register";

export default function Auth({ stateVar = "login" }) {
  const [state, setState] = useState(stateVar);

  return (
    <>
      <div className="flex flex-col mb-16">
        <div className="flex flex-row items-center justify-center">
          <button
            className={
              "px-4 py-2 w-full transition-all duration-300 " +
              (state === "login"
                ? "text-white shadow-xl drop-shadow-xl"
                : "bg-white text-black shadow-sm")
            }
            style={
              state === "login"
                ? {
                    background: "linear-gradient(to right, #2563eb, #60a5fa)",
                  }
                : {}
            }
            onClick={() => {
              setState("login");
            }}
          >
            Login
          </button>
          <button
            className={
              "px-4 py-2 w-full transition-all duration-300 " +
              (state === "register"
                ? "text-white shadow-xl drop-shadow-xl"
                : "bg-white text-black shadow-sm")
            }
            style={
              state === "register"
                ? {
                    background: "linear-gradient(to right, #2563eb, #60a5fa)",
                  }
                : {}
            }
            onClick={() => {
              setState("register");
            }}
          >
            Register
          </button>
        </div>
        <div className="component-holder">
          {state === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </>
  );
}

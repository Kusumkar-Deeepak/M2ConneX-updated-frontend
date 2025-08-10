import React from "react";
import InstagramIcon from "../assets/instagram.png";
import LinkedInIcon from "../assets/linkedin.png";
import GmailIcon from "../assets/gmail.png";
import MmcoeLogo from "../assets/mmcoe_logo.png";
const Footer = () => {
  return (
    <>
      <footer className="w-full shadow-3xl flex items-center justify-center mt-auto">
        <div
          className="flex gap-x-4 w-full p-4 items-center"
          style={{
            background: "linear-gradient(to right, #2563eb, #60a5fa)",
          }}
        >
          <img
            src={MmcoeLogo}
            alt="MMCOE Logo"
            className="w-[3rem] h-[3rem] md:w-[6rem] md:h-[6rem]"
          />
          <div className="text-justify text-white px-4 md:block hidden text-[0.8rem]">
            <h1 className="text-2xl font-bold">
              Marathwada Mitra Mandal's College of Engineering
            </h1>
            <p className="my-2">
              (Approved by AICTE New Delhi, Recognized by DTE Maharashtra and
              affiliated to Savitribai Phule Pune University) Accredited by NBA
              ( Mechanical and Electrical Departments){" "}
            </p>
            <p className="text-white">Accredited with 'A++' Grade by NAAC</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-x-4">
              <a href="https://www.instagram.com/code_mmcoe">
                <img
                  src={InstagramIcon}
                  className="w-[1.4rem] md:w-[2rem]"
                  alt=""
                />
              </a>
              <a href="mailto:team_code@mmcoe.edu.in">
                <img
                  src={GmailIcon}
                  className="w-[1.4rem] md:w-[2rem]"
                  alt=""
                />
              </a>
              <a href="https://www.linkedin.com/company/75646530/">
                <img
                  src={LinkedInIcon}
                  className="w-[1.4rem] md:w-[2rem]"
                  alt=""
                />
              </a>
            </div>
            <p className="text-[0.68rem] md:text-[0.8rem] text-white text-center">
              Website Designed and Developed by C.O.D.E MMCOE
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

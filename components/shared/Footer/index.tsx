import { APP_NAME } from "@/lib/constants";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t p-5 flex-center">
      {currentYear}&copy; {APP_NAME} All rights are reserverd
    </footer>
  );
};

export default Footer;

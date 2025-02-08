import React from "react";
import Menu from "./Menu";
import LogoBox from "./LogoBox";

const Header = () => {
  return (
    <header className="border-b">
      <div className="wrapper flex-between">
        <LogoBox />
        <Menu />
      </div>
    </header>
  );
};

export default Header;

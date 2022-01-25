import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Footer = ({children}:Props) => (
  <footer className="footer" style={{backgroundColor:"rgb(232, 240, 254)"}}>
    {children}
  </footer>
)

export default Footer;
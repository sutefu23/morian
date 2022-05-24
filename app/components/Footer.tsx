import React, { ReactNode } from "react";

interface Props {
  children: ReactNode
  height?: number|string
}

const Footer = ({height, children}:Props) => (
  <footer className="footer" style={{backgroundColor:"rgb(232, 240, 254)",height:height}}>
    {children}
  </footer>
)

export default Footer;
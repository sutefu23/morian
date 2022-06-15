import React from 'react'
interface Props {
  children: React.ReactNode;
}
const NoSsr = ({children}:Props) => {
  return <>{children}</>
}

export default NoSsr
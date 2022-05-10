import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text
} from "@chakra-ui/react"
import  Link from "next/link"
export type Link = {
  name: string
  path?: string
}
const breadcrumbs = ({links}:{links: Link[]}) => {
  const breadLinks = [
    {name: 'TOP', path:'/'},
    ...links
  ]
  return (
    <Breadcrumb 
    fontWeight='medium'
    fontSize='sm'
    ml="5"
    pb="3"
    >
      {breadLinks.length > 0 &&
        breadLinks.map((link,i) => (
          <BreadcrumbItem key={i}
          >
            {link.path?
            <BreadcrumbLink 
              as={Link}
              href={link?.path}
            >{link.name}</BreadcrumbLink>
            :
            <Text className='current'>{link.name}</Text>
            }
          
          </BreadcrumbItem>
        )
        )
      }
    </Breadcrumb>
  )
}

breadcrumbs.propTypes = {}

export default breadcrumbs
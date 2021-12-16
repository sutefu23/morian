import { useAspidaQuery } from '@aspida/react-query'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { apiClient } from '~/utils/apiClient'
import router, { useRouter } from 'next/router'
import Dialog from '~/components/feedback/dialog'

interface Link {
  key: number|string
  name: string
  path?: string
  children?: Link[] 
}

interface Props {
  onClose: () => void
  isOpen: boolean
}


const Sidebar = ({ onClose }: Props) => {
  const { data: species, error : speciesErr } = useAspidaQuery(apiClient.master.species)
  const { data: itemTypes, error: itemTypeErr } = useAspidaQuery(apiClient.master.itemType)
  const { isOpen, onOpen } = useDisclosure()

  if (speciesErr) return <Dialog title="エラー" message={speciesErr}/>
  if (itemTypeErr) return <Dialog title="エラー" message={itemTypeErr}/>

  if (!species?.length || !itemTypes?.length) return <div>loading...</div>

  const itemLinks: Link[] = itemTypes.map(i => {
    const childLinks : Link[] = species.map(s => (
      {
        key: s.id,
        name: s.name,
        path: `/item/${i.id}/species/${s.id}`,
      }
    ))
    return {
      key: i.id,
      name: i.name,
      path: "",
      children: childLinks
    }
  })
  const mainLinks:Link[] = [
    {
      key: "listItem",
      name: "商品一覧",
      children: itemLinks,
    },
    {
      key: "registerItem",
      name: "在庫新規登録",
      path: "item/register"
    },
    {
      key: "issueItem",
      name: "発注",
      path: "item/issue"
    },
    {
      key: "handhi",
      name: "ハンディ操作",
      path: "item/handhi"
    },
    {
      key: "reports",
      name: "帳票",
      children : [
        {
          key: "printBarCode",
          name: "バーコード印刷",
          path: "print/barcode"
        },
      ]
    },
  ]

  const ButtonLinks = (props: {links: Link[]}) => 
    (<React.Fragment>
      {props.links.map(link => (
        !link.children?
        <Button mt="1" onClick={() => {link.path && router.push(link.path)}} w="100%" key={link.key}>
          {link.name}
        </Button>
        :
        <Accordion allowToggle>
          <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
              {link.name}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
            {link.children &&
            <AccordionPanel pb={4}>
              <ButtonLinks links={link.children}></ButtonLinks>
            </AccordionPanel>
            }
          </AccordionItem>
        </Accordion>
      ))
      }
    </React.Fragment>
    )
  return (
    <Drawer
    isOpen={true}
    placement='left'
    onClose={onClose}
  >
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>メニュー</DrawerHeader>

      <DrawerBody>
        <Box>
        <ButtonLinks links={mainLinks}></ButtonLinks>
      </Box>
      </DrawerBody>


    </DrawerContent>
  </Drawer>

  )
}

export default Sidebar

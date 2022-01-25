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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
} from '@chakra-ui/react'
import React from 'react'
import { apiClient } from '~/utils/apiClient'
import router from 'next/router'
import StatusBar from '~/components/feedback/statusBar'
import useSidebar from '~/hooks/useSidebar'
interface Link {
  key: number|string
  name: string
  path?: string
  children?: Link[] 
}


const Sidebar = () => {
  const { data: itemTypes, error: itemTypeErr } = useAspidaQuery(apiClient.master.itemType)
  const { data: species, error : speciesErr } = useAspidaQuery(apiClient.master.species)

  const { isOpen, setIsOpen } = useSidebar()
  if (itemTypeErr) return <StatusBar status="error" message="商品の取得に失敗しました。"/>
  if (speciesErr) return <StatusBar status="error" message="樹種の取得に失敗しました。"/>

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
      path: "/item/register"
    },
    {
      key: "issueItem",
      name: "発注",
      path: "/item/issue"
    },
    {
      key: "handhi",
      name: "ハンディ操作",
      path: "/item/handhi"
    },
    {
      key: "reports",
      name: "帳票",
      children : [
        {
          key: "printBarCode",
          name: "バーコード印刷",
          path: "/print/barcode"
        },
      ]
    },
  ]
  const ButtonLinks = (props: {links: Link[]}) => 
    (<React.Fragment>
      {props.links.map(link => (
        !link.children?
        <Button
        mt="1" 
        w="100%"
        bgColor="transparent"
        border="solid 2px #eee"
        key={link.key}
        onClick={() => {link.path && router.push(link.path)}}>
          {link.name}
        </Button>
        :
        <Accordion allowToggle
          defaultIndex={
            link.key==='listItem'?0:-1
          }
          key={link.key}
        >
          <AccordionItem>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
              <Heading as="h3" size="sm">{link.name}</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
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
    isOpen={isOpen}
    placement='left'
    onClose={() => setIsOpen(false)}
  >
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton
        onClick={() => setIsOpen(false)}
      />
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
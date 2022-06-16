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
  Link,
} from '@chakra-ui/react'
import React from 'react'
import { apiClient } from '~/utils/apiClient'
import NextLink from "next/link"
import StatusBar from '~/components/feedback/statusBar'
import useSidebar from '~/hooks/useSidebar'
import { masterTypes } from '~/pages/master/[masterType]'

export type Link = {
  key: number|string
  name: string
  path?: string
  event?: () => void
  children?: Link[] 
}|undefined

const Sidebar = () => {
  const { data: itemTypes, error: itemTypeErr } = useAspidaQuery(apiClient.master.itemType)
  const { data: species, error : speciesErr } = useAspidaQuery(apiClient.master.species)
  const { data: existItemGroup, error : existItemGroupErr } = useAspidaQuery(apiClient.itemList.existGroups)

  const { isOpen, setIsOpen } = useSidebar()
  if (itemTypeErr) return <StatusBar status="error" message="商品の取得に失敗しました。"/>
  if (speciesErr) return <StatusBar status="error" message="樹種の取得に失敗しました。"/>
  if (existItemGroupErr) return <StatusBar status="error" message="商品グループの取得に失敗しました。"/>

  if (!species?.length || !itemTypes?.length) return <div>loading...</div>
  const itemLinks: Link[] = itemTypes.map(item => {
    const woodSpecies = existItemGroup?.filter(group => group.itemTypeId === item.id).map(i => i.woodSpeciesId)
    if(!woodSpecies) return
    const childLinks : Link[] = woodSpecies.map(id => {
      const specie = species.find((s) => s.id === id)
      if(!specie) return
      return {
        key: specie.id,
        name: specie.name,
        path: `/item/${item.id}/species/${specie.id}`,
      }  
    })
    return {
      key: item.id,
      name: item.name,
      path: "",
      children: childLinks
    }
  })
  const mainLinks:Link[] = [
    {
      key: "top",
      name: "TOP",
      path: "/"
    },
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
      key: "handy",
      name: "ハンディターミナル",
      path: "/handy",
    },
    {
      key: "barcode",
      name: "バーコード印刷",
      path: "/pdf"
    },
    {
      key: "reports",
      name: "帳票出力",
      path: "/report",
    },
    {
      key: "supplier",
      name: "仕入先設定",
      path: "/master/supplier",
    },
    {
      key: "users",
      name: "ユーザー設定",
      path: "/master/user",
    },
    {
      key:"master",
      name: "マスタ設定",
      children: [
        {
          key: "itemType",
          name: "材種",
          path: "/master/itemType",
        },
      ...masterTypes.map(master => (
        {
          key:master.key,
          name:master.name,
          path: `/master/${master.key}`
        }
      )),
      {
        key: "deliveryPlace",
        name: "出荷場所",
        path: "/master/deliveryPlace",
      },    
      ]
    },    
  ]
  const ButtonLinks = (props: {links: Link[]}) => 
    (<>
      {props.links.map(link => {
        if(!link) return <></>
        return (
        !link?.children ?
        <NextLink
        key={link?.key}
        href={link.path!}
        >
        <Button
        mt="1" 
        w="100%"
        pt="2"
        display="inline-block"
        textAlign="center"
        cursor="pointer"
        bgColor="transparent"
        border="solid 2px #eee"
        key={link.key}
        as="a"
        >
          {link.name}
        </Button>
        </NextLink>
        :
        <Accordion allowToggle
          defaultIndex={
            link?.key==='listItem'?0:-1
          }
          key={link?.key}
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
        )
      })
      }
    </>
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

import { Button, Table, Thead, Tbody,Tr, Th, Td, TableContainer } from "@chakra-ui/react"
import React from "react"
import Dialog from "~/components/feedback/dialog"
import type { Template } from "~/hooks/useIssue"

type Prop = {
  onDecide: (template:Template)=> void
  onRemove: (index: number)=> void
  templates: Template[]
  onClose : () => void
  isOpen: boolean
}


const TemplateModal = ({onDecide, onRemove, templates, isOpen, onClose}: Prop)=>{

  return (<Dialog 
  size="2xl"
  title="テンプレート選択"
  onClose={onClose}
  isOpen={isOpen}
  button1={{
    text:"閉じる",
    color:"blue",
  }}
  >
<TableContainer>
  <Table variant='striped'>
    <Thead>
      <Tr>
        <Th>テンプレート名</Th>
        <Th>選択</Th>
        <Th>削除</Th>
      </Tr>
    </Thead>
    <Tbody>
      {
        templates.map((template, index)=>(
          <Tr key={index}>
          <Td>{template.key}</Td>
          <Td>
          <Button
           bgColor="green.200"
            onClick={(e)=>{
              e.preventDefault()
              onDecide(template)
            }}
            >
          選択
        </Button>
        </Td>
        <Td>
        <Button
           bgColor="red.100"
            onClick={()=>{
              if(confirm("削除しますか")){
                onRemove(index)
              }
            }}
          >
          削除
        </Button>
        </Td>
        </Tr>  
        ))
      }
    </Tbody>
  </Table>
</TableContainer>
</Dialog>)
}

export default TemplateModal
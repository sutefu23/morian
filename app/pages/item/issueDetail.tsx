import {
  Table,
  Tr,
  Th,
  Td,
  useDisclosure,
} from "@chakra-ui/react"
import { IssueItemProps, IssueProps } from "~/server/domain/entity/issue"

type Props = {
  issue: IssueProps
  item: IssueItemProps
}
const IssueDetail = ({issue, item}:Props) => {
  return (
    <Table variant="striped" colorScheme="gray">
    <Tr><Th>管理</Th><Td>{issue.managedId}</Td></Tr>
    <Tr><Th>発注日</Th><Td>{issue.date}</Td></Tr>
    <Tr><Th>発注者</Th><Td>{issue.userName}</Td></Tr>
    <Tr><Th>仕入先</Th><Td>{issue.supplierName} </Td></Tr>
    <Tr><Th>仕入先担当者</Th><Td>{issue.supplierManagerName} </Td></Tr>
    <Tr><Th>入荷予定日</Th><Td>{issue.expectDeliveryDate} </Td></Tr>
    <Tr><Th>入荷場所</Th><Td>{issue.deliveryPlaceName}</Td></Tr>
    <Tr><Th>入荷住所</Th><Td>{issue.deliveryAddress} </Td></Tr>
    <Tr><Th>受取担当者</Th><Td>{issue.receiveingStaff} </Td></Tr>
    <Tr><Th>発注備考</Th><Td>{issue.issueNote}</Td></Tr>
    <Tr><Th>内部備考</Th><Td>{issue.innerNote}</Td></Tr>
    <Tr><Th>材種</Th><Td>{item.itemTypeName}</Td></Tr>
    <Tr><Th>樹種</Th><Td>{item.woodSpeciesName} </Td></Tr>
    <Tr><Th>仕様</Th><Td>{item.spec}</Td></Tr>
    <Tr><Th>製造元</Th><Td>{item.manufacturer}</Td></Tr>
    <Tr><Th>グレード</Th><Td>{item.gradeName} </Td></Tr>
    <Tr><Th> 寸法</Th><Td>{item.length}{(item.thickness)?`*${item.thickness}`:""}{(item.width)?`*${item.width}`:""}</Td></Tr>
    <Tr><Th> 入数</Th><Td>{item.packageCount}</Td></Tr>
    <Tr><Th> 原価単位数量</Th><Td>{item.costPackageCount}</Td></Tr>
    <Tr><Th> 数量</Th><Td>{item.count} {item.unitName}</Td></Tr>
    <Tr><Th> 入荷予定日</Th><Td>{item.arrivalExpectedDate} </Td></Tr>
    <Tr><Th> 原価</Th><Td>{item.cost} {item.costUnitName}</Td></Tr>
    </Table>
  )
}
export default IssueDetail
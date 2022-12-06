import { useCallback } from 'react'
import { IssueItemProps, IssueProps } from '$/domain/entity/issue'
import { Units } from '~/server/domain/init/master'
import { apiClient } from '~/utils/apiClient'
import { DeepPartial } from '~/types/DeepPartial.spec'
import { Decimal } from 'decimal.js'
import produce from 'immer'
import dayjs from 'dayjs'
import ExcelJS from 'exceljs'
import stream from 'stream'
import { atom, useRecoilState, useResetRecoilState, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom: persistAtomSaveData } = recoilPersist({
  key: 'recoil-persist-save-data',
  storage: typeof window === 'undefined' ? undefined : sessionStorage
})

const { persistAtom: persistAtomTemplate } = recoilPersist({
  key: 'recoil-persist-template-data',
  storage: typeof window === 'undefined' ? undefined : sessionStorage
})

export type EditIssueData = DeepPartial<IssueProps>
export type EditIssueItemData = DeepPartial<IssueItemProps>

export type Template = {
  key: string
  data: EditIssueData
}
const defaultItemData = {
  itemTypeName: '',
  itemTypeId: undefined,
  woodSpeciesName: '',
  woodSpeciesId: undefined,
  spec: '', //仕様
  manufacturer: '', //製造元
  gradeName: '',
  gradeId: undefined,
  length: '', // 寸法（長さ）
  width: undefined, // 寸法（幅）
  thickness: undefined, // 寸法（厚）
  packageCount: undefined, // 入数
  costPackageCount: undefined, // 原価単位数量
  count: undefined, // 在庫数量
  unitName: '', // 単位
  unitId: undefined,
  cost: undefined,
  costUnitName: '', // 原価単位
  costUnitId: undefined,
  isStored: false
}

export const defaultData = {
  managedId: '',
  date: new Date(),
  userId: undefined,
  userName: '',
  supplierId: undefined,
  supplierName: '',
  supplierManagerName: '',
  expectDeliveryDate: '',
  deliveryPlaceId: undefined,
  deliveryPlaceName: '',
  deliveryAddress: '',
  receiveingStaff: '',
  issueNote: '',
  innerNote: '',
  issueItems: [defaultItemData]
}

const demoData = {
  managedId: '220210-0001-001',
  date: new Date('2022-2-10'),
  userId: 1,
  userName: '森庵充久',
  supplierId: 1,
  supplierName: '北材商事',
  supplierManagerName: '足立',
  expectDeliveryDate: '2月上旬',
  deliveryPlaceId: 1,
  deliveryPlaceName: '本社入れ',
  deliveryAddress: '',
  issueNote: '納品書を1枚入れてください。',
  innerNote: 'キズアリ。2月中旬予定',
  receiveingStaff: '田中',
  issueItems: [
    {
      itemTypeName: '集成材',
      itemTypeId: 1,
      woodSpeciesName: '桧',
      woodSpeciesId: 1,
      spec: 'ウレタン塗装', //仕様
      manufacturer: '四川工場', //製造元
      gradeName: 'Aグレード',
      gradeId: 1,
      length: '2000', // 寸法（長さ）
      width: 200, // 寸法（幅）
      thickness: 25, // 寸法（厚）
      packageCount: new Decimal(10), // 入数
      costPackageCount: new Decimal(10), // 原価単位数量
      count: new Decimal(1), // 在庫数量
      unitName: '㎥', // 単位
      unitId: 1,
      cost: new Decimal(10000),
      costUnitName: '㎥', // 原価単位
      costUnitId: 1,
      isStored: false
    },
    {
      itemTypeName: 'フローリング',
      itemTypeId: 2,
      woodSpeciesName: '杉',
      woodSpeciesId: 18,
      spec: '',
      manufacturer: '',
      gradeName: '上小無節',
      gradeId: 12,
      length: '1820',
      width: 90,
      thickness: 15,
      packageCount: '10',
      costPackageCount: '0.48',
      count: '60',
      unitName: '',
      unitId: 2,
      cost: '10000',
      costUnitName: '坪',
      costUnitId: 5,
      isStored: false
    }
  ]
}

const issueDataAtom = atom<EditIssueData>({
  key: 'issueDataAtom',
  default: defaultData
})

const issueSaveDataAtom = atom<EditIssueData>({
  //一時保存用
  key: 'issueSaveDataAtom',
  default: defaultData,
  effects_UNSTABLE: [persistAtomSaveData]
})

const issueTemplatesAtom = atom<Template[]>({
  //テンプレート保存用
  key: 'issueTemplatesAtom',
  default: [],
  effects_UNSTABLE: [persistAtomTemplate]
})

const editModeAtom = atom<'create' | 'update'>({
  key: 'editModeAtom',
  default: 'create'
})

const issueSelector = selector({
  key: 'issueSelector',
  get: ({ get }) => get(issueDataAtom),
  set: ({ set, get }, newValue) => {
    if (get(editModeAtom) == 'create') {
      set(issueSaveDataAtom, newValue)
    }
    set(issueDataAtom, newValue)
  }
})

const useIssue = () => {
  const [issueData, setIssueData] = useRecoilState<EditIssueData>(issueSelector)
  const [issueSaveData, setIssueSaveData] =
    useRecoilState<EditIssueData>(issueSaveDataAtom)
  const [templates, setTemplates] = useRecoilState(issueTemplatesAtom)
  const [editMode, setEditMode] = useRecoilState(editModeAtom)
  const resetIssueData = useResetRecoilState(issueDataAtom)
  const resetSaveIssue = useResetRecoilState(issueSaveDataAtom)

  const updateField = useCallback(
    <K extends keyof EditIssueData>(key: K, val: EditIssueData[K]): void => {
      setIssueData({ ...issueData, [key]: val })
    },
    [issueData]
  )

  const addItemData = useCallback(() => {
    if (issueData.issueItems?.length === 14) {
      alert('1伝票14明細までです。\n別伝票として起こしてください。')
      return
    }
    const newItems = produce(issueData.issueItems, (draft) => {
      draft?.push(defaultItemData)
    })
    setIssueData({ ...issueData, ...{ issueItems: newItems } })
  }, [issueData.issueItems])

  const deleteItemData = useCallback(
    (deleteIndex: number) => {
      const newItems = issueData.issueItems?.filter((_, i) => i !== deleteIndex)
      setIssueData({ ...issueData, ...{ issueItems: newItems } })
    },
    [issueData.issueItems]
  )

  const copyItemLine = useCallback(
    (copyIndex: number) => {
      if (!issueData?.issueItems) return

      const newItem = issueData?.issueItems[copyIndex]

      if (newItem === undefined) return

      const newItems = produce(issueData.issueItems, (draft) => {
        draft?.push(newItem)
      })

      setIssueData({ ...issueData, ...{ issueItems: newItems } })
    },
    [issueData.issueItems]
  )

  const pushTemplate = useCallback(
    (template: Template) => {
      const newTemplates = produce(templates, (draft) => {
        draft?.push(template)
      })
      setTemplates(newTemplates)
    },
    [setTemplates, templates]
  )

  const removeTemplates = useCallback(
    (index: number) => {
      const newTemplates = templates.filter((_, i) => i !== index)
      setTemplates(newTemplates)
    },
    [setTemplates, templates]
  )

  const updateItemField = useCallback(
    <K extends keyof EditIssueItemData>(
      index: number,
      key: K,
      val: EditIssueItemData[K]
    ): void => {
      if (issueData.issueItems) {
        const newItem = { ...issueData.issueItems[index], ...{ [key]: val } }
        const newItems = Object.assign([], issueData.issueItems, {
          [index]: newItem
        })
        setIssueData({ ...issueData, ...{ issueItems: newItems } })
      }
    },
    [issueData.issueItems]
  )

  const calcCostPackageCount = useCallback(
    (issueItem?: EditIssueItemData) => {
      if (
        issueItem?.costUnitId &&
        issueItem.width &&
        issueItem.thickness &&
        issueItem.packageCount
      ) {
        const { width, length, thickness, packageCount } = issueItem
        if (length === '乱尺' || !length) return

        const unit = Units.find((u) => u.id === issueItem.costUnitId)?.name
        const costPackageCount = (() => {
          Decimal.set({ precision: 2, rounding: Decimal.ROUND_HALF_UP })
          const thousand = new Decimal(1000)
          const tubo = new Decimal(3.3)
          const dWidth = new Decimal(width)
          const dLength = new Decimal(length)
          const dThickness = new Decimal(thickness)
          const dPackageCount = new Decimal(String(packageCount))
          switch (unit) {
            case '㎥': // 幅/1000*長さ/1000*厚み/1000
              return dWidth
                .dividedBy(thousand)
                .mul(dLength.dividedBy(thousand))
                .mul(dThickness.dividedBy(thousand))
            case '平米': // 幅/1000*長さ/1000
              return dWidth
                .dividedBy(thousand)
                .mul(dLength.dividedBy(thousand))
                .mul(dPackageCount)
            case '坪': // 幅/1000*長さ/1000/3.3
              return dWidth
                .dividedBy(thousand)
                .mul(dLength.dividedBy(thousand))
                .mul(dPackageCount)
                .dividedBy(tubo)

            default:
              break
          }
        })()
        return costPackageCount
      }
    },
    [issueData.issueItems]
  )

  const costPerUnit = useCallback(
    //最小単位当たりの原価
    (issueItem) => {
      if (!issueItem?.cost || !issueItem?.costPackageCount) return 0
      return Number(issueItem.cost) * Number(issueItem.costPackageCount)
    },
    []
  )

  const totalPrice = useCallback(
    (issueItem: DeepPartial<IssueItemProps>) => {
      if (!issueItem?.count) return 0
      const perUnit = costPerUnit(issueItem)
      return perUnit * Number(issueItem?.count)
    },
    [costPerUnit]
  )

  const checkValidIssue = (issue: EditIssueData | undefined) => {
    if (issue === undefined) {
      return
    }
    const { date, supplierId, deliveryPlaceId } = issue
    if (!date) {
      alert('発注日は必須です。')
      return null
    }
    if (!supplierId) {
      alert('仕入先は必須です。')
      return null
    }
    if (!deliveryPlaceId) {
      alert('納入場所は必須です。')
      return null
    }
    if (issue.issueItems === undefined || issue.issueItems.length === 0) {
      alert('明細が存在しません')
      return null
    }

    for (let i = 0; i < issue.issueItems?.length; i++) {
      const item = issue.issueItems[i]
      if (!checkValidItem(item)) {
        alert(`${i + 1}番目の明細に未入力項目があります。`)
        return null
      }
    }

    return issue
  }

  const checkValidItem = (item: EditIssueItemData | undefined) => {
    if (!item) {
      console.error('checkValidIssue data is null')
      return null
    }

    const { itemTypeId, woodSpeciesId, length } = item
    if (!itemTypeId) {
      alert('分類は必須です。')
      return null
    }
    if (!woodSpeciesId) {
      alert('樹種は必須です。')
      return null
    }

    const validLength = checkValidLength(length)

    if (!validLength) {
      alert('長さは必須です。')
      console.error('checkValidIssue validLength is null')
      return null
    }

    const { width, thickness } = item
    if (!width || !thickness) {
      console.error('checkValidIssue width or thickness is null')
      return null
    }
    if (!width) {
      alert('幅は必須です。')
      return null
    }
    if (!thickness) {
      alert('厚みは必須です。')
      return null
    }

    const { packageCount, count, unitId, costPackageCount, cost, costUnitId } =
      item

    if (!packageCount) {
      alert('入数は必須です。')
      return null
    }
    if (!count) {
      alert('数量は必須です。')
      return null
    }
    if (!unitId) {
      alert('単位は必須です。')
      return null
    }
    if (!costPackageCount) {
      alert('原価単位数量は必須です。')
      return null
    }
    if (!cost) {
      alert('原価単位数量は必須です。')
      return null
    }
    if (!costUnitId) {
      alert('原価単位は必須です。')
      return null
    }
    return {
      ...item,
      itemTypeId,
      woodSpeciesId,
      thickness,
      length: validLength,
      width,
      packageCount,
      count,
      unitId,
      costPackageCount,
      cost,
      costUnitId
    }
  }
  const checkValidLength = (length: unknown): string | '乱尺' | null => {
    if (isFinite(Number(length))) {
      return String(length)
    }

    if (typeof length === 'string' && length === '乱尺') {
      return '乱尺'
    }
    alert('長さは数字もしくは乱尺という文字列のみ許容します')
    return null
  }

  const useDemo = () => {
    setIssueData(demoData)
  }

  const downloadOrderSheet = async () => {
    if (!issueData.id) return
    if (!issueData.issueItems) return

    const workbook = new ExcelJS.Workbook()
    const resp = await fetch(new Request('/files/template.xlsx'))
    const buff = await resp.arrayBuffer()
    const buffer = Buffer.from(buff)
    const readStream = new stream.PassThrough()
    readStream.end(buffer)
    const wb = await workbook.xlsx.read(readStream)
    const sheet = wb.getWorksheet('発注書')
    //const copySheet = wb.addWorksheet("Sheet")
    //copySheet.model = template.model
    //copySheet.name = "THE REAL ID"

    //ヘッダー部
    if (issueData.date) {
      sheet.getCell('B1').value = dayjs(issueData.date as Date).format(
        'YYYY年MM月DD日'
      )
    }
    sheet.getCell('P1').value = issueData.managedId
    sheet.getCell('A3').value = issueData.supplierName
    sheet.getCell('C5').value = issueData.supplierManagerName
    sheet.getCell('O7').value = issueData.userName

    //フッター部
    sheet.getCell('C24').value = issueData.issueNote
    sheet.getCell('C25').value = issueData.deliveryPlaceName
    sheet.getCell('G25').value = issueData.deliveryAddress
    sheet.getCell('M25').value = issueData.expectDeliveryDate
    sheet.getCell('D27').value = issueData.receiveingStaff

    //明細部
    issueData.issueItems.map((item, indx) => {
      const row = indx + 10
      sheet.getCell(`A${row}`).value = item.woodSpeciesName
      sheet.getCell(`C${row}`).value = item.itemTypeName
      sheet.getCell(`E${row}`).value = item.gradeName
      sheet.getCell(`F${row}`).value = item.spec
      sheet.getCell(`G${row}`).value = item.manufacturer
      sheet.getCell(`H${row}`).value = `${item.length}`
      sheet.getCell(`I${row}`).value = `${item.thickness}`
      sheet.getCell(`J${row}`).value = `${item.width}`
      sheet.getCell(`K${row}`).value = `${String(item.packageCount)}` // 入数
      sheet.getCell(`M${row}`).value = `${Number(item.cost).toYenFormat()} / ${
        item.costUnitName
      }` // 単価
      sheet.getCell(`N${row}`).value = `${item.count} ${item.unitName}` // 数量
      sheet.getCell(`P${row}`).value = totalPrice(item)
    })

    const uint8Array = await wb.xlsx.writeBuffer()
    const blob = new Blob([uint8Array], { type: 'application/octet-binary' })
    const url = window.URL.createObjectURL(blob)
    // aタグを生成
    const a = document.createElement('a')
    a.href = url
    a.download = `発注書${dayjs(issueData.date as Date).format('YYMMDD')}.xlsx`
    // aタグをクリックさせます
    a.click()
    // ダウンロード後は不要なのでaタグを除去
    a.remove()
  }

  const updateIssue = useCallback(async () => {
    const updateIssueData = checkValidIssue(issueData)
    if (!updateIssueData) {
      console.error('updateIssueData is not valid')
      return
    }
    if (!issueData.id) {
      alert('データのID情報が見つかりません')
      return
    }
    await apiClient.issue.patch({
      body: {
        id: issueData.id,
        body: issueData as IssueProps
      }
    })

    alert('更新しました')
    return
  }, [issueData])

  const postIssue = useCallback(async () => {
    const postIssueData = checkValidIssue(issueData)
    if (!postIssueData) {
      console.error('postIssueData is not valid')
      return
    }
    console.log(postIssueData)
    const { body } = await apiClient.issue.post({
      body: postIssueData as IssueProps
    })
    if (body instanceof Error) {
      return
    }

    alert('登録しました')
    resetSaveIssue()
    return body
  }, [issueData])

  return {
    issueData, //発注データ
    setIssueData, // 発注データセット
    issueSaveData, // 保存データ（新規作成時のみ自動保存）
    editMode, // 編集モード（新規作成｜編集）
    setEditMode, // 編集モードセット
    templates, // テンプレート
    pushTemplate, // テンプレート追加
    removeTemplates, //
    setIssueSaveData,
    resetSaveIssue,
    resetIssueData,
    updateField,
    updateItemField,
    addItemData,
    deleteItemData,
    copyItemLine,
    calcCostPackageCount,
    costPerUnit,
    totalPrice,
    postIssue,
    updateIssue,
    downloadOrderSheet,
    useDemo
  }
}

export default useIssue

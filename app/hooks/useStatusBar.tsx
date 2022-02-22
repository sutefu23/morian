import { useEffect, useMemo, useState, useRef } from "react";
import type {
  AlertStatus
} from '@chakra-ui/react'
import StatusBar from "~/components/feedback/statusBar";

import { atom , selector } from 'recoil'

type StatusBarPropType = {status: AlertStatus, message: string}

const statusBarPropsAtom = atom<StatusBarPropType[]>({
  key: 'statusBarPropsAtom',
  default: [],
});

// const myApiValueSelector = selector<StatusBarPropType[]>({
//   key: 'statusBarPropsSelector',
//   get: ({get}) => {
//     const currValue = get(statusBarPropsAtom)
//   },
//   set: ({set, get}, newValue) => {
//     const oldValue = get(statusBarPropsAtom)
//     set(statusBarPropsAtom, [...oldValue, newValue])
//   }
// })

export const useStatusBar = (props: StatusBarPropType) => {
  const { status, message } = props;
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  

  const handleOnRequestClose = useRef((force = false) => setIsOpen(force)).current;

  const Status = useMemo(() => {
      isOpen && (
      <StatusBar status={status} message={message}/>
    )

  }, [isOpen, handleOnRequestClose, status, message])

  return {
    Status,
    setIsOpen
  };
};
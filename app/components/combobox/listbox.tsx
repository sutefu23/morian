/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react'
import type { AriaListBoxOptions } from '@react-aria/listbox'
import type { Node, LoadingState } from '@react-types/shared'
import type { ListState } from 'react-stately'
import { useListBox, useOption } from 'react-aria'
import { CheckIcon } from '@chakra-ui/icons'
import { Box, List, ListItem, Spinner } from '@chakra-ui/react'

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>
  state: ListState<unknown>
  loadingState?: LoadingState
  onLoadMore?: () => void
}

interface OptionProps {
  item: Node<unknown>
  state: ListState<unknown>
}

export function ListBox(props: ListBoxProps) {
  const ref = React.useRef<HTMLUListElement>(null)
  const { listBoxRef = ref, state } = props
  const { listBoxProps } = useListBox(props, state, listBoxRef)

  const onScroll = (e: React.UIEvent) => {
    const scrollOffset = e.currentTarget.scrollHeight - e.currentTarget.clientHeight * 2
    if (e.currentTarget.scrollTop > scrollOffset && props.onLoadMore) {
      props.onLoadMore()
    }
  }

  return (
    <List {...listBoxProps} ref={listBoxRef} overflow="auto" maxHeight="300" my="1" display="flex" flexDirection="column" onScroll={onScroll}>
      {[...state.collection].map((item) => (
        <Option key={item.key} item={item} state={state} />
      ))}
      {props.loadingState === 'loadingMore' && (
        // Display a spinner at the bottom of the list if we're loading more.
        // role="option" is required for valid ARIA semantics since
        // we're inside a role="listbox".
        <Box role="option" pt="4" pb="2" display="flex" justifyContent="center">
          <Spinner color="blue.400" size="sm" />
        </Box>
      )}
    </List>
  )
}

function Option({ item, state }: OptionProps) {
  const ref = React.useRef<HTMLLIElement>(null)
  const { optionProps, isSelected, isFocused } = useOption(
    {
      key: item.key
    },
    state,
    ref
  )

  return (
    <ListItem {...optionProps} as="li" ref={ref} px="2" py="2" background={isFocused ? 'blue.50' : 'white'} color={isFocused ? 'blue.700' : 'gray.700'} fontWeight={isSelected ? 'bold' : 'normal'} cursor="default" display="flex" alignItems="center" justifyContent="space-between">
      {item.rendered}
      {isSelected && <CheckIcon />}
    </ListItem>
  )
}

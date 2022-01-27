import React, {useCallback} from "react";
import type { ComboBoxProps } from "@react-types/combobox";
import type { LoadingState } from "@react-types/shared";
import { useComboBoxState } from "react-stately";
import { useComboBox, useFilter } from "react-aria";
import { Search2Icon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputRightElement,
  Box,
  Spinner,
  InputLeftElement
} from "@chakra-ui/react";

import { ListBox } from "./listbox";
import { Popover } from "./popover";

export { Item, Section } from "react-stately";

interface AutocompleteProps<T> extends ComboBoxProps<T> {
  loadingState?: LoadingState;
  onLoadMore?: () => void;
}

export function Autocomplete<T extends Record<string, unknown>>(props: AutocompleteProps<T>) {
  const { contains } = useFilter({ sensitivity: "base" });
  const state = useComboBoxState({ ...props, defaultFilter: contains });
  
  const keyEnter = useCallback((e:React.KeyboardEvent) =>{
    if (e.key === "Enter" && props.inputValue && props.onInputChange){ 
      props.onInputChange(props.inputValue)
    }
  },[props.inputValue, props.onInputChange])

  const inputRef = React.useRef(null);
  const listBoxRef = React.useRef(null);
  const popoverRef = React.useRef(null);

  const { inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      listBoxRef,
      popoverRef
    },
    state,
  );

  return (
    <Box display="inline-block" position="relative">
      {/* <FormLabel {...labelProps}>{props.label}</FormLabel> */}
      <InputGroup>
        <InputLeftElement>
          <Search2Icon color="gray.500" />
        </InputLeftElement>
        <Input {...inputProps} ref={inputRef} size="md"
        onKeyPress={(e) => keyEnter(e)}/>
        <InputRightElement>
          {props.loadingState === "loading" ||
          props.loadingState === "filtering" ? (
            <Spinner color="blue.400" size="sm" />
          ) : null}
        </InputRightElement>
      </InputGroup>
      {state.isOpen && (
        <Popover
          popoverRef={popoverRef}
          isOpen={state.isOpen}
          onClose={state.close}
        >
          <ListBox
            {...listBoxProps}
            listBoxRef={listBoxRef}
            state={state}
            loadingState={props.loadingState}
            onLoadMore={props.onLoadMore}
          />
        </Popover>
      )}
    </Box>
  );
}

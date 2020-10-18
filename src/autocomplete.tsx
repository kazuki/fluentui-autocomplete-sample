import React, { useRef, useState } from 'react';
import { CommandButton, Callout, TextField, mergeStyleSets, getTheme } from '@fluentui/react';
import { useId } from '@uifabric/react-hooks';

export interface IAutoCompleteProps<T> {
  defaultValue?: T;
  items: T[];
  onGetText?: (item: T) => string;
  onRenderItem?: (item: T) => JSX.Element;
  onRenderListFooter?: () => JSX.Element;
  onCalloutLayerMounted?: () => void;
  onCalloutDismiss?: () => void;
  onCalloutPositioned?: () => void;
  onSearch?: (newValue: string) => void;
  onChange?: (item?: T) => void;
  noOptionsText?: string;
  useFilter?: boolean;
}

interface IState<T> {
  calloutVisible: boolean;
  searchText?: string;
  selectedItemText?: string;
  selectedItem?: T;
}

export function AutoComplete<T>(props: IAutoCompleteProps<T>) {
  const {
    defaultValue,
    items: originalItems,
    onGetText = _getText,
    onRenderItem,
    onRenderListFooter,
    onCalloutLayerMounted,
    onCalloutDismiss,
    onCalloutPositioned,
    onSearch,
    onChange: invokeOnChange,
    noOptionsText = 'No options',
    useFilter = true,
  } = props;
  const id = useId();
  const [state, setState] = useState<IState<T>>({
    calloutVisible: false,
    selectedItem: defaultValue,
    selectedItemText: defaultValue && onGetText(defaultValue),
  });
  const refContainer = useRef<HTMLDivElement>(null);

  const onBlur = (x: any) => {
    if (x?.relatedTarget?.id?.startsWith(`${id}-`)) return;
    const tmp = {...state, calloutVisible: false, searchText: undefined};
    if (state.searchText != null && state.searchText !== state.selectedItemText) {
      tmp.selectedItem = tmp.selectedItemText = undefined;
      if (invokeOnChange)
        invokeOnChange();
    }
    setState(tmp);
  };
  const onClick = (item?: T) => {
    const text = item ? onGetText(item) : undefined;
    setState({...state, calloutVisible: false, searchText: undefined,
              selectedItemText: text, selectedItem: item});
    if (state.selectedItem !== item && invokeOnChange)
      invokeOnChange(item);
  };
  const onChange = (_: any, newValue?: string) => {
    setState({...state, calloutVisible: true, searchText: newValue});
    if (onSearch && newValue != null)
      onSearch(newValue);
  };
  let items = originalItems;
  const filterText = state.searchText != null ? state.searchText : state.selectedItemText;
  if (useFilter && filterText)
    items = originalItems.filter((item) => onGetText(item).includes(filterText));

  return (
    <>
      <div id={id} className={classNames.containerArea} ref={refContainer}>
        <TextField
          id={`${id}-textfield`}
          iconProps={{ iconName: 'ChevronDown' }}
          defaultValue={defaultValue && onGetText(defaultValue)}
          onClick={() => setState({...state, calloutVisible: true})}
          onChange={onChange}
          onBlur={onBlur}
          value={state.searchText !== undefined ? state.searchText : state.selectedItemText || ''}
        />
      </div>
      {state.calloutVisible && (
        <Callout
          id={`${id}-callout`}
          target={`.${classNames.containerArea}`}
          isBeakVisible={false}
          calloutWidth={refContainer.current?.clientWidth || 0}
          directionalHintFixed={true}
          onLayerMounted={onCalloutLayerMounted}
          onDismiss={onCalloutDismiss}
          onPositioned={onCalloutPositioned}
        >
          {items.map((item, idx) => {
            const key = (item as any).key || idx.toString();
            return (
              <CommandButton
                id={`${id}-options-${key}`}
                key={key}
                role="option"
                className={classNames.dropDownItem}
                onClick={() => onClick(item)}
                styles={dropDownItemButtonStyles}
              >{onRenderItem ? onRenderItem(item) : (item as any).text}</CommandButton>
            );
          })}
          {items.length === 0 && <div className={classNames.noOptionsText} onClick={() => onClick()}>{noOptionsText}</div>}
          {onRenderListFooter && onRenderListFooter()}
        </Callout>
      )}
    </>
  );
}

function _getText<T>(item: T): string {
  return (item as any).text || '';
}

const { semanticColors } = getTheme();
const classNames = mergeStyleSets({
  containerArea: {
  },
  dropDownItem: {
    display: 'flex',
    width: '100%',
    selectors: {
      ':hover': {
        backgroundColor: semanticColors.menuItemBackgroundHovered,
      },
    }
  },
  noOptionsText: {
    height: '40px',
    padding: '0px 10px',
    display: 'flex',
    alignItems: 'center',
  },
});
const dropDownItemButtonStyles = {
  flexContainer: {
    width: '100%',
  },
}

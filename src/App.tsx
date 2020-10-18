import React, { useRef, useCallback } from 'react';
import { mergeStyleSets, getTheme } from '@fluentui/react';
import { AutoComplete } from './autocomplete';

interface IItem {
  key: string;
  text: string;
  count: number;
}

const items: IItem[] = [
  { key: '0', text: 'Foo', count: 11123 },
  { key: '1', text: 'Bar', count: 2344 },
  { key: '2', text: 'Hoge', count: 341 },
  { key: '3', text: 'Fuga', count: 123 },
  { key: '4', text: 'awopifjaowiejfoawiejfaowiejfaowiejfaowiejfaoiwfejaoiwfjaoiwejfaoiwefjaoiwjefaoweifjawefawef', count: 64 },
  { key: '5', text: 'AAAAA', count: 1 },
  { key: '6', text: 'BBBBB', count: 0 },
  { key: '7', text: 'CCCCC', count: 0 },
  { key: '8', text: 'DDDDD', count: 0 },
  { key: '9', text: 'EEEEE', count: 0 },
];
const onRenderItem = (item: IItem): JSX.Element => {
  return (
    <>
      <div className={classNames.dropDownItem1}>{item.text}</div>
      <div className={classNames.dropDownItem2}>{item.count}</div>
    </>
  );
};

function App() {
  const refFooter = useRef<HTMLDivElement>(null);
  const refFooterDummy = useRef<HTMLDivElement>(null);
  const onRenderListFooter = useCallback((): JSX.Element => {
    return (
      <>
        <div className={classNames.dropDownFooterDummy} ref={refFooterDummy}></div>
        <div className={classNames.dropDownFooter} ref={refFooter}>
          <div>検索中とか...表示できる</div>
          <div>(ほげほげ)</div>
        </div>
      </>
    );
  }, []);
  const resizeHack = useCallback(() => {
    if (refFooter.current && refFooterDummy.current)
      refFooter.current.style.width = refFooterDummy.current.clientWidth + 'px';
  }, []);

  return (
    <div style={{ maxWidth: '480px', margin: '3em'}}>
      <AutoComplete
        items={items}
        onRenderItem={onRenderItem}
        onRenderListFooter={onRenderListFooter}
        onCalloutLayerMounted={resizeHack}
        onCalloutPositioned={resizeHack}
      />
    </div>
  );
}

const { palette } = getTheme();
const classNames = mergeStyleSets({
  dropDownItem1: {
    textAlign: 'left',
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: '5px',
  },
  dropDownItem2: {
    paddingLeft: '10px',
    paddingRight: '5px',
  },
  dropDownFooterDummy: {
    height: '32px',
  },
  dropDownFooter: {
    position: 'fixed',
    bottom: 0,
    height: '32px',
    display: 'flex',
    fontSize: '80%',
    backgroundColor: palette.neutralQuaternaryAlt,
    alignItems: 'center',
    selectors: {
      'div:first-child': {
        paddingLeft: '10px',
        flexGrow: 1,
      },
      'div:last-child': {
        paddingRight: '8px',
      },
    }
  },
});

export default App;

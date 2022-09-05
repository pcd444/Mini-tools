import React,{useState} from 'react';
import { AddColAfter, AddColBefore, DeleteRow, AddRowAfter,AddRowBefore, DeleteCol } from './TableFunctions';
import './App.css';

import {useHistory} from './useHistory'

// Here are the action types
const START = 'START';
const WILDCARD = "WILDCARD";
const WRITETEXT = 'WRITETEXT';
const WRITETEXTWHITESPACE = "WRITETEXTWHITESPACE";
const DELETETEXT = "DELETETEXT";
const ADDROW = 'ADDROW';
const ADDCOL = 'ADDCOL';
const REMOVEROW = 'REMOVEROW';
const REMOVECOL = 'REMOVECOL';

function App() {
  const [rows, setRows, undoHistory, redoHistory] = useHistory([['a', 'b'],['c', 'd']]);
  const [prevAction, setPrevAction] = useState(START);
  const colcount = rows[0].length;
  const rowcount = rows.length;
  function createTextEditCallback(row){
    return function (col){
      return(function(e){
        console.log(e);
        setRows(prev=>{
          prev = structuredClone(prev)
          prev[row][col] = e.target.value;
          return prev;
        }, false)
    })
    }
  }
  function colDeleteCallbackFactory(col){
    if(colcount === 1)
      return 
    return(function(){
      setRows(prev=>DeleteCol(prev,col));
    })
  }
  function rowDeleteCallbackFactory(row){
    if(rowcount === 1)
      return
    return(function(){
      setRows(prev=>DeleteRow(prev,row));
    })
  }
  function addColAfterFactory(col){
    return(function(){
      setRows(prev=>AddColAfter(prev,col))
    })
  }
  function addColBeforeFactory(col){
    return(function(){
      setRows(prev=>AddColBefore(prev,col))
    })
  }
  function addRowAfterFactory(row){
    return(function(){
      setRows(prev=>AddRowAfter(prev,row))
    })
  }
  function addRowBeforeFactory(row){
    return(function(){
      setRows(prev=>AddRowBefore(prev,row))
    })
  }

  const mutateColProps = {addColAfterFactory,addColBeforeFactory,colDeleteCallbackFactory};
  const mutateRowProps = {addRowAfterFactory,addRowBeforeFactory,rowDeleteCallbackFactory};
  const colCount = rows[0].length;

  return (
    <div className="App">
      <button onClick={undoHistory}>undo</button>
      <button onClick={redoHistory}>redo</button>
      <button onClick={e=>{navigator.clipboard.writeText(ArrayTableToMD(rows))}}>Copy MD to clipboard</button>
      <table>
        <tbody>
          <TopRowButtons mutateColProps = {mutateColProps} count ={colCount}/>
          {rows.map((v,i) => <TableRow key={i} strs = {v} v={createTextEditCallback(i)} row={i} mutateRowProps={mutateRowProps}/>)}
        </tbody>
      </table>
    </div>
  );
}

function TopRowButtons(props){
  const count = props.count;
  const rangeArray = new Array(count).fill(null).map((_,i)=>i);
  return <tr><td></td>{rangeArray.map(v=><TopRowButton col={v} key={v} callbacks ={props.mutateColProps}></TopRowButton>)}</tr>
}

function TopRowButton(props){
  const col = props.col;
  return <td><button onClick={props.callbacks.addColBeforeFactory(col)}>+</button><button onClick={props.callbacks.colDeleteCallbackFactory(col)}>-</button><button onClick={props.callbacks.addColAfterFactory(col)}>+</button></td>
}

function SideColButton(props){
  const {addRowAfterFactory,addRowBeforeFactory,rowDeleteCallbackFactory} = props.callbacks;
  const row = props.row;
  return(
     <td>
      <button onClick={addRowBeforeFactory(row)}>+</button>
      <br/>
      <button onClick={rowDeleteCallbackFactory(row)}>-</button>
      <br/>
      <button onClick={addRowAfterFactory(row)}>+</button>
    </td>
  )
}

function TableRow(props){
  let strs = props.strs;
  let vv = props.v;
  return <tr><SideColButton row = {props.row} callbacks = {props.mutateRowProps}/>{strs.map((v,i)=><td key={i}><input type='text' value={v} onChange={vv(i)}></input></td>)}</tr>
}

function ArrayTableToMD(rows){
  const colCount = rows[0].length;
  rows = rows.map(v=>v.join('|'));
  const firstRow = rows;
  const otherRows = rows.splice(1);
  const spacerRow = Array(colCount).fill('-').join('|')
  return [firstRow,spacerRow,...otherRows].join('\n');
}

export default App;

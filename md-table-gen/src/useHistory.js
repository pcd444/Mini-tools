import {useState} from "react";
function fixArguments(args){
    if(args.length === 1)
        return [[args[0]],0];
    else
        return [args[0],args[1]];
}

function useHistory(){
    const [initialHistory, initialIndex] = fixArguments(arguments);
    let [historyObject, setHistoryObject] = useState({history:initialHistory,index:initialIndex});
    function undoHistory(){
        if(historyObject.index === 0)
            return false;
        else{
            setHistoryObject(prev=>{
                return {history:prev.history,index:prev.index - 1}
            });
            return true;
        }
    }
    function redoHistory(){
        if(historyObject.index === historyObject.history.length - 1)
            return false;
        else{
            setHistoryObject(prev=>{
                return {history:prev.history,index:prev.index + 1}
            });
            return true;
        }
    }
    function setHistory(input){
        if(typeof input === "function"){
            const functionInput = input;
            setHistoryObject(prev=>{
                prev = structuredClone(prev)
                const newEntry = functionInput(prev.history[prev.index]);
                prev.history.splice(prev.index + 1);
                prev.history.push(newEntry);
                prev.index += 1;
                return({
                    history: prev.history,
                    index: prev.index
                });
            })
        }
        else{
            setHistoryObject(prev=>{
                prev = structuredClone(prev)
                const newEntry = input;
                prev.history.splice(prev.index + 1);
                prev.history.push(newEntry);
                prev.index += 1;
                return({
                    history: prev.history,
                    index: prev.index
                });
            });
        }
    }
    const currHistoryEntry = historyObject.history[historyObject.index];
    return [currHistoryEntry,setHistory,undoHistory,redoHistory];
}

export {useHistory}
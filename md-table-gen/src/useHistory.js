import {useState} from "react";
function fixArguments(args){
    if(args.length === 1)
        return [[args[0]],0];
    else
        return [args[0],args[1]];
}

function useHistory(){
    // Fix args
    const [initialHistory, initialIndex] = fixArguments(arguments);
    // Hooks
    let [historyObject, setHistoryObject] = useState({history:initialHistory,index:initialIndex});
    // Helper functions
    
    // API functions
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
    function setHistory(input, shouldMakeNewEntry){
        if(shouldMakeNewEntry === undefined)
            shouldMakeNewEntry = true;
        if(historyObject.index === 0)
            shouldMakeNewEntry = true;
        if(typeof input === "function"){
            const functionInput = input;
            if(shouldMakeNewEntry){
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
                });
            }
            else{
                setHistoryObject(prev=>{
                    prev = structuredClone(prev);
                    const editedEntry = functionInput(prev.history[prev.index]);
                    prev.history[prev.index] = editedEntry;
                    prev.history.splice(prev.index + 1);
                    return({
                        history: prev.history,
                        index: prev.index
                    });
                });
            }
        }
        else{
            const inputEntry = input;
            if(shouldMakeNewEntry){
                setHistoryObject(prev=>{
                    const newEntry = inputEntry;
                    prev = structuredClone(prev)
                    prev.history.splice(prev.index + 1);
                    prev.history.push(newEntry);
                    prev.index += 1;
                    return({
                        history: prev.history,
                        index: prev.index
                    });
                });
            }
            else{
                setHistoryObject(prev=>{
                    const updatedEntry = inputEntry;
                    prev = structuredClone(prev)
                    prev.history.splice(prev.index + 1);
                    prev.history[prev.index] = updatedEntry;
                    return({
                        history: prev.history,
                        index: prev.index
                    })
                });
            }
        }
    }
    // Return
    const currHistoryEntry = historyObject.history[historyObject.index];
    return [currHistoryEntry,setHistory,undoHistory,redoHistory];
}

export {useHistory}
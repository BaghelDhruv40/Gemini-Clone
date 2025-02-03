import { createContext } from "react";
import run from "../config/gemini";
import { useState } from "react";
export const Context=createContext();

const ContextProvider=(props)=>{
    const [input,setInput]=useState("");
    const [recentPrompt,setRecentPrompt]=useState("");
    const [previousPrompt,setPreviousPrompt]=useState([]);
    const [showResult,setShowResult]=useState(false);
    const [loading,setLoading]=useState(false);
    const [resultData,setResultData]=useState("");

    const delayPara=(index,nextWord)=>{
        setTimeout(()=>{
            setResultData(prev=>prev+nextWord);
        },index*75);
    }
    const newChat=()=>{
        setLoading(false);
        setShowResult(false);
    }
    const onSent=async(prompt)=>{
        setLoading(true);
        setResultData("");
        setShowResult(true);
        let response;
        if(prompt!==undefined){
            response=await run(prompt);
            setRecentPrompt(prompt);
        }
        else{
            setPreviousPrompt(prev=>[...prev,input]);
            setRecentPrompt(input);
            response=await run(input);
        }

        let responseArray=response.split("**");
        let newResponse="";
        for(let i=0; i<responseArray.length; i++){
            if (i%2==0){
                newResponse+=responseArray[i];
            }
            else{
                newResponse+="<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2=newResponse.split("*").join("<br/>");
        // setResultData(newResponse2);
        let newResponseArray=newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length; i++){
            delayPara(i,newResponseArray[i]+" ");
        }
        setLoading(false);
        setInput("");
    }
    // onSent("what is react js")

    const contextValue={
        previousPrompt,
        setPreviousPrompt,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
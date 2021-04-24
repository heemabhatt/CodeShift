import React = require("react");
import { errorStyles } from "./style/Search-styles";

export function isEmptyString(str?:string){
    if(str === null || str ===undefined || str.length===0 ){
        return true;
    }
    return false;
}

export function isNullObject(obj?:any)
{
    if(obj === null || obj === undefined)
    {
        return true;
    }
    return false;
}

export function showError(error:string)
{
    console.log(`An error occurred: ${error}`);
    alert(`An error occurred: ${error}`);
}

export function logInformation(message:any)
{
    console.log(message);
   alert(message);
}

export function ErrorMessage(props: any) {
    return (
  //TODO: Style
      <div id="CeoSearchError"   >
        {props.message}
      </div>
    );
  }  

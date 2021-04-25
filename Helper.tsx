import { FontSizes, FontWeights, MessageBar, MessageBarType } from "@fluentui/react";
import React = require("react");

export function isEmptyString(str?: string) {
  if (str === null || str === undefined || str.length === 0) {
    return true;
  }
  return false;
}

export function isNullObject(obj?: any) {
  if (obj === null || obj === undefined) {
    return true;
  }
  return false;
}

export function showError(error: string) {
  console.log(`An error occurred: ${error}`);
 // alert(`An error occurred: ${error}`);
}

export function logInformation(message: any) {
  console.log(message);
 // alert(message);
}

export function ErrorMessage(props: any) {
  const divStyle = {
    color: "rgb(191, 9, 0)",
    display:"flex",
    FontSizes: FontSizes.size14,
    FontWeights:FontWeights.regular,
    marginRight:"auto"
  };
  return (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      dismissButtonAriaLabel="Close" 
      style={divStyle}  >
      {props.message}

    </MessageBar>

  );
}

/*
export function ErrorMessage(props: any) {
return (
  <div id="CeoSearchError" style={errorStyles}  >
    {props.message}
  </div>
);
}  */

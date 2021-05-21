import { FontSizes, FontWeights, MessageBar, MessageBarType } from "@fluentui/react";
import React = require("react");

export function isEmptyString(str: string | null) {
  if (str === null || str === undefined || str.length === 0) {
    return true;
  }
  return false;
}

export function isEmptyStringProperty(str?: ComponentFramework.PropertyTypes.StringProperty) {
  if (str === null || str === undefined) {
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

export function logInformation(message: any) {
  console.log(message);
}

export function IsValidCEOInput(ceoUserId: string, ceoCompanyId: string) {
  if (isEmptyString(ceoUserId) || isEmptyString(ceoCompanyId)) {
    return "Please enter valid CEO Company ID and/or CEO User ID.";
  }

  const userIdLength = ceoUserId.length;
  const companyIdLength = ceoCompanyId.length;

  if (companyIdLength < 3 || companyIdLength > 20 || userIdLength > 12) {
    return "The CEO Company ID should be between 3 and 20 character and/or CEO User ID should be maximum of 12 characters. Please verify and reenter";
  }

  var regExp = /^[A-Za-z0-9]+$/;
  console.log("validate user id: " + ceoUserId.match(regExp));
  console.log("validate company id: " + ceoCompanyId.match(regExp));

  if (!ceoUserId.match(regExp) || !ceoCompanyId.match(regExp)) {
    return "The CEO User ID and/or CEO Company ID is invalid. Please verify and reenter.";
  }

  return "";
}

export function ErrorMessage(props: any) {
  const divStyle = {
    color: "rgb(191, 9, 0)",
    display: "flex",
    FontSizes: FontSizes.size14,
    FontWeights: FontWeights.regular,
    marginRight: "auto",
    WhiteSpace:"normal"
      };
  return (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={true}
      dismissButtonAriaLabel="Close"
      style={divStyle}  >
      {props.message}

    </MessageBar>
  );
}

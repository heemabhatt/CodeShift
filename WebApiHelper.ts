import * as Helper from './Helper';
export interface IUserInfo {
    userGuid: string,
    userFullName: string
}
const CEOUSERID_ENTITY = "wfsv_ceouser";
const CEOCOMPANYID_ENTITY = "wfsv_ceocompany";
const CONTACT_ENTITY = "contact";
const COMPANY_ENTITY = "account";
class whoAmIRequest {
    constructor() { }
}
interface whoAmIRequest {
    getMetadata(): any;
};

export async function retrieveCeoUser(userId: string, companyId: string, context: any) {

    // USE FOR MCS-COLLAB
    const filter = `?$filter=(wfsv_ceouseridname%20eq%20%27${userId}%27)&$select=wfsv_ceouseridname,wfsv_ceouserid&$expand=wfsv_ceocompanyid($select=wfsv_wcisclientid,wfsv_ceocompanyid,wfsv_ceocompanyname;$filter=wfsv_ceocompanyname%20eq%20%27${companyId}%27;$expand=wfsv_companyid($select=name)),wfsv_contactid($select=contactid,fullname,telephone1,emailaddress1)`;

    //USE FOR WF
    //const filter = `?$filter=(wfsv_ceouseridname%20eq%20%27${userId}%27)&$select=wfsv_ceouseridname,wfsv_ceouserid&$expand=wfsv_ceocompanyid($select=wfsv_wcisclientid,wfsv_ceocompanyid,wfsv_ceocompanyname;$filter=wfsv_ceocompanyname%20eq%20%27${companyId}%27;$expand=wfsv_company($select=name)),wfsv_contactid($select=contactid,fullname,telephone1,emailaddress1)`; 

    const result = await context.webAPI.retrieveMultipleRecords(CEOUSERID_ENTITY, filter);
    let ceoUserResult = [];
    if (result.entities.length > 0) {
        for (let i = 0; i < result.entities.length; i++) {
            if (!Helper.isNullObject(result.entities[i].wfsv_ceocompanyid)) {
                ceoUserResult.push(result.entities[i]);
            }
        }
    }

    return ceoUserResult;
}

export async function createCEOUserRecord(ceoUserId:any,ceoCompanyId:any,seasResult: any, sebsResult: any, userInfo: any, context: any) {

    let resultStatus = {
        status: "", //success or failure
        outputValue: "", //result of generated CEOUser if success
        errorMessage: "" //detailed error message in case of failure
    };

     //Create Account/Company
     console.log("Creating company...");
     const companyID = await createCompany(seasResult, context);
 
     if (Helper.isEmptyString(companyID)) {
         resultStatus = {
             status: "failure", //success or failure
             outputValue: "", //result of generated CEOUser if success
             errorMessage: "Cannot Crate New Company Using SEAS Result" //detailed error message in case of failure
         };
         return resultStatus;
     }
     
    //Create Contact
    console.log("Creating contact...");
    const contactID = await createContact(companyID,seasResult, sebsResult, userInfo, context);

    if (Helper.isEmptyString(contactID)) {
        resultStatus = {
            status: "failure", //success or failure
            outputValue: "", //result of generated CEOUser if success
            errorMessage: "Cannot Crate New Contact Using SEBS Result" //detailed error message in case of failure
        };
        return resultStatus;
    }

   

    //Create CEO Company
    console.log("Creating CEO company...");
    const ceoCompanyID = await createCeoCompany(ceoCompanyId, companyID, seasResult, userInfo, context);

    if (Helper.isEmptyString(ceoCompanyID)) {
        resultStatus = {
            status: "failure", //success or failure
            outputValue: "", //result of generated CEOUser if success
            errorMessage: "Cannot Crate New CEO Company Using SEAS Result" //detailed error message in case of failure
        };
        return resultStatus;
    }

    //Create CEO USER
    console.log("Creating CEO user...");
    const ceoUserID = await createCeoUser(ceoUserId,ceoCompanyID, contactID, seasResult, sebsResult, userInfo, context);
    if (Helper.isEmptyString(ceoUserID)) {
        resultStatus = {
            status: "failure", //success or failure
            outputValue: "", //result of generated CEOUser if success
            errorMessage: "Cannot Crate New CEO User Using SEAS Result" //detailed error message in case of failure
        };
        return resultStatus;
    }

    const output = {
        CEOCompanyID: sebsResult.CEOCompanyId,
        CEOUserID: sebsResult.CEOUserId,
        CompanyID: companyID, // WF : company
        CompanyName: sebsResult.AccountName, // WF : company
        ContactID: contactID,
        ContactName: sebsResult.FirstName + " " + sebsResult.LastName
    };
    console.log("output: " + JSON.stringify(output));
    resultStatus = {
        status: "success", //success or failure
        outputValue: JSON.stringify(output), //result of generated CEOUser if success
        errorMessage: "" //detailed error message in case of failure
    };
    return resultStatus;
}

export async function createCompany(seasResult: any, context: any) {
    const accountData = {
        name: seasResult.CompanyName, 
        //wfsv_importsource = new OptionSetValue(809660001); //WGPR,
        address1_line1: seasResult.Address1Line1,
        address1_city: seasResult.Address1City,
        address1_stateorprovince: seasResult.Address1State,
        address1_country: seasResult.Address1Country,
        address1_postalcode: seasResult.Address1ZipCode,
        //wfsv_sorflag : false
    };
    const accountRecord = await context.webAPI.createRecord(COMPANY_ENTITY, accountData);

    if (accountRecord && accountRecord.id) {
        console.log("Company ID:" + accountRecord.id);
        return accountRecord.id;
    }
    return "";
}

export async function createContact(companyID:any,seasResult:any, sebsResult: any, userInfo: IUserInfo, context: any) {
    const contactData = {
        "lastname": sebsResult.LastName,
        "firstname": sebsResult.FirstName,
        "parentcustomerid_account@OData.Community.Display.V1.FormattedValue": seasResult.CompanyName,
        "parentcustomerid_account@odata.bind": `/accounts(${companyID})`,
        "emailaddress1": sebsResult.Email,
        "telephone1": sebsResult.PhoneNumber || sebsResult.MobileNumber,
        "ownerid@odata.bind": `/systemusers(${userInfo.userGuid})`
    };
    const contactRecord = await context.webAPI.createRecord(CONTACT_ENTITY, contactData);
    if (contactRecord && contactRecord.id) {
        console.log("Contact ID:" + contactRecord.id);
        return contactRecord.id;
    }
    return "";
}

//TODO: Use SEAS Result for company name, change field name to match WF field name
export async function createCeoCompany(ceoCompanyId:any,accountRecordID: any, seasResult: any, userInfo: any, context: any) {
    const ceoCompanyData = {
        "wfsv_companyid@odata.bind": `/accounts(${accountRecordID})`,
        "wfsv_companyid@OData.Community.Display.V1.FormattedValue": seasResult.CompanyName,
        "wfsv_wcisclientid": "",
        "wfsv_source": "WGPR",
        "wfsv_ceocompanyname": ceoCompanyId,
        "statuscode": 1,
        "statecode": 0,
        "ownerid@odata.bind": `/systemusers(${userInfo.userGuid})`,
        "ownerid@OData.Community.Display.V1.FormattedValue": `${userInfo.userFullName}`
    };
    const ceoCompanyRecord = await context.webAPI.createRecord(CEOCOMPANYID_ENTITY, ceoCompanyData);
    if (ceoCompanyRecord && ceoCompanyRecord.id) {
        console.log("CEO Company ID:" + ceoCompanyRecord.id);
        return ceoCompanyRecord.id;
    }
    return "";
}

export async function createCeoUser(ceoUserId:any, accountRecordID: any, contactRecordID: any, seasResult: any, sebsResult: any, userInfo: any, context: any) {
    const ceoUserData = {
        "wfsv_ceocompanyid@odata.bind": "/wfsv_ceocompanies(" + accountRecordID + ")",
        "wfsv_ceocompanyid@OData.Community.Display.V1.FormattedValue": seasResult.CompanyName, 
        "wfsv_contactid@odata.bind": "/contacts(" + contactRecordID + ")",
        "wfsv_contactid@OData.Community.Display.V1.FormattedValue": sebsResult.FullName,
        "wfsv_ceouseridname":ceoUserId,
        "ownerid@odata.bind": `/systemusers(${userInfo.userGuid})`,
        "ownerid@OData.Community.Display.V1.FormattedValue": `${userInfo.userFullName}`
    };

    const ceoUserRecord = await context.webAPI.createRecord(CEOUSERID_ENTITY, ceoUserData);
    if (ceoUserRecord && ceoUserRecord.id) {
        console.log("CEO User ID:" + ceoUserRecord.id);
        return ceoUserRecord.id;
    }
    return ceoUserRecord.id;
}

export async function getUserInfo(context: any) {
    let userInfo: IUserInfo = {
        userFullName: "",
        userGuid: ""
    };
    try {

        whoAmIRequest.prototype.getMetadata = function () {
            return {
                boundParameter: null,
                parameterTypes: {},
                operationType: 1, // This is a function. Use '0' for actions and '2' for CRUD
                operationName: "WhoAmI"
            };
        };

        let response: any = await (context.webAPI as any).execute(new whoAmIRequest())
        if (response.ok) {
            let responseBody: any = await response.json()

            if (!Helper.isNullObject(responseBody) && !Helper.isEmptyString(responseBody.UserId)) {
                const result = await context.webAPI.retrieveRecord("systemuser", responseBody.UserId, "?$select=fullname");

                userInfo = {
                    userFullName: result.fullname,
                    userGuid: responseBody.UserId
                };
            }
        }
        return userInfo;
    }
    catch (e) {
        console.error(e);
    }
}

export function generateOutput(result: any) {
    console.log("Insidete generateOutput: " + JSON.stringify(result));
    if (Helper.isNullObject(result) ||
        Helper.isNullObject(result.wfsv_ceocompanyid)) {
        Helper.showError("Invalid result or CEO company details");
        return "";
    }
    if (Helper.isNullObject(result.wfsv_ceocompanyid.wfsv_companyid)) //WF : Company
    {
        Helper.showError("Invalid result or company details");
        return "";
    }
    if (Helper.isNullObject(result.wfsv_contactid)) {
        Helper.showError("Invalid contact details");
        return "";
    }

    if (!Helper.isNullObject(result) &&
        !Helper.isNullObject(result.wfsv_ceocompanyid) &&
        !Helper.isEmptyString(result.wfsv_ceocompanyid.wfsv_ceocompanyname) &&
        !Helper.isNullObject(result.wfsv_ceocompanyid.wfsv_ceocompanyid) &&
        !Helper.isNullObject(result.wfsv_ceocompanyid.wfsv_companyid) && // WF : company
        !Helper.isEmptyString(result.wfsv_ceocompanyid.wfsv_companyid.name) && // WF : company
        !Helper.isEmptyString(result.wfsv_ceocompanyid.wfsv_companyid.accountid) && // WF : company
        !Helper.isNullObject(result.wfsv_contactid)) {
        const output = JSON.stringify({
            CEOCompanyID: result.wfsv_ceocompanyid.wfsv_ceocompanyname,
            CEOUserID: result.wfsv_ceouseridname,
            CompanyID: result.wfsv_ceocompanyid.wfsv_companyid.accountid, // WF : company
            CompanyName: result.wfsv_ceocompanyid.wfsv_companyid.name, // WF : company
            ContactID: result.wfsv_contactid.contactid,
            ContactName: result.wfsv_contactid.fullname
        });

        Helper.logInformation(`Json Output:  ${output}  `);
        return output;
    }
    else {
        return "";
    }
}

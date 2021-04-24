import * as Helper from './Helper';
export interface IUserInfo {
    userGuid: string,
    userFullName: string
}
const CEOUSERID_ENTITY = "wfsv_ceouser";
const CEOCOMPANYID_ENTITY = "";
const CONTACT_ENTITY = "";
const COMPANY_ENTITY = "";
class whoAmIRequest {
    constructor() { }
}
interface whoAmIRequest {
    getMetadata(): any;
};

export async function retrieveCeoUser(userId: string, companyId: string, context: any) {
    //workind for mcs-collab and wf
    const filter=`?$filter=(wfsv_ceouseridname%20eq%20%27${userId}%27)&$select=wfsv_ceouseridname,wfsv_ceouserid&$expand=wfsv_ceocompanyid($select=wfsv_wcisclientid,wfsv_ceocompanyid,wfsv_ceocompanyname;$filter=wfsv_ceocompanyname%20eq%20%27${companyId}%27;$expand=wfsv_companyid($select=name)),wfsv_contactid($select=contactid,fullname,mobilephone,emailaddress1)`;
    const result = await context.webAPI.retrieveMultipleRecords(CEOUSERID_ENTITY, filter);
    console.log("Result Count: " + result.entities.length);

    return result;
    //${url}/wfsv_ceousers?$filter=(wfsv_ceouseridname%20eq%20%27${userId}%27)&$select=wfsv_ceouseridname,wfsv_ceouserid&$expand=wfsv_ceocompanyid($select=wfsv_ceocompanyid,wfsv_ceocompanyname;$filter=wfsv_ceocompanyname%20eq%20%27${companyId}%27;$expand=wfsv_companyid($select=name)),wfsv_contactid($select=contactid,fullname)
}

export function createContact(contactData: any, context: any) {
    return "";
}

export function createCompany(companyData: any, context: any) {
    return "";
}

export function createCeoCompany(ceoCompanyData: any, context: any) {
    return "";
}

export function createCeoUser(ceoUserData: any, context: any) {
    return "";
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

export function generateOutput(result:any)
{
    console.log("Insidete generateOutput");
  if (!Helper.isNullObject(result) &&
  !Helper.isNullObject(result.wfsv_ceocompanyid) &&
  !Helper.isEmptyString(result.wfsv_ceocompanyid.wfsv_ceocompanyname) &&
  !Helper.isNullObject(result.wfsv_ceocompanyid.wfsv_ceocompanyid) &&
  !Helper.isNullObject(result.wfsv_ceocompanyid.wfsv_companyid) &&
  !Helper.isEmptyString(result.wfsv_ceocompanyid.wfsv_companyid.name) &&
  !Helper.isEmptyString(result.wfsv_ceocompanyid.wfsv_companyid.accountid) &&
  !Helper.isNullObject(result.wfsv_contactid) &&
  !Helper.isEmptyString(result.wfsv_contactid.contactid) &&
  !Helper.isEmptyString(result.wfsv_contactid.fullname)) {

    const output = JSON.stringify({
    CEOCompanyID: result.wfsv_ceocompanyid.wfsv_ceocompanyname,
    CEOUserID: result.wfsv_ceouseridname,
    CompanyID: result.wfsv_ceocompanyid.wfsv_companyid.accountid,
    CompanyName: result.wfsv_ceocompanyid.wfsv_companyid.name,
    ContactID:result.wfsv_contactid.contactid,
    ContactName: result.wfsv_contactid.fullname
  });  

 Helper.logInformation(`Json Output:  ${output}  `);
 return output;
}
else{
    return "";
}
}

function getAccountData(seasResult: any) {
    //create new account using company details
    const accountData = {
      name: seasResult.companyName,
      //wfsv_importsource = new OptionSetValue(809660001); //WGPR,
      address1_line1: seasResult.address1_line1,
      address1_city: seasResult.address1_city,
      address1_stateorprovince: seasResult.address1_stateorprovince,
      address1_country: seasResult.address1_country,
      address1_postalcode: seasResult.address1_postalcode,
      //wfsv_sorflag : false
    };
    return accountData;
  }
  
  function getCompanyData(seasResult: any, accountRecord: any) {
  
    if (accountRecord != null && accountRecord.id != null) {
      const companyData = {
        wfsv_companyid: { "@odata.type": "Microsoft.Dynamics.CRM.account", "accountid": accountRecord.id },
        wfsv_source: "WGPR",
        wfsv_ceocompanyname: seasResult.companyName,
        wfsv_wcisclientid: ""
      };
    }
    const companyData = {
      wfsv_source: "WGPR",
      wfsv_ceocompanyname: seasResult.companyName,
      wfsv_wcisclientid: ""
    };
  
    return companyData;
  }
  
  function getContactData(sebsResult: any) {
    const contactData = {
      "lastname": sebsResult.lastname,
      "firstname": sebsResult.firstname,
      "emailaddress1": sebsResult.email,
      "mobilephone": sebsResult.mobile || sebsResult.phonenumber,
      "ownerid@odata.bind": "/systemusers(994ca259-ad82-eb11-a812-000d3a3b2f58)" //use WhoAmI() method result here
    };
    return contactData;
  }
  function getCeoUserData(seasResult: any, accountId: string) {
    const ceoUserData = {
      "wfsv_source": "WGPR",
      "wfsv_ceocompanyname": seasResult.companyName,
      "wfsv_wcisclientid": "",
      "wfsv_companyid@OData.Community.Display.V1.FormattedValue": seasResult.companyName,
      "wfsv_companyid@odata.bind": "/accounts(" + accountId + ")"
    };
    return ceoUserData;
  }

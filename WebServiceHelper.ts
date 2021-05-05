
export async function callSeasService(companyId: string) {
    console.log("Inside SEAS Service...");
    if (companyId !== undefined && companyId.includes("company")) {
        const seasResult = {
            companyName: "SEAS-COMPANY" + Math.round(1000 * Math.random()).toString(),
            address1_line1: "companyInfo.AddressLine1",
            address1_city: "companyInfo.City",
            address1_stateorprovince: "companyInfo.State",
            address1_country: "companyInfo.Country",
            address1_postalcode: "companyInfo.ZipCode",
            wfsv_sorflag: false
        };
        return seasResult;
    }
}

export async function callSebsService(userId: string) {
    console.log("Inside SEBS Service...");
    let s1;
    const sebsResult1 = {
        firstname: "sebsFirstName",
        lastname: "sebsLastName",
        email: "sebsemail@sebs.com",
        phonenumber: "121212",
        mobilenumber: "123-456-7890"
    };
    if (userId !== undefined && userId.includes("user")) {
        s1 = {
            "@odata.context": "https://wfdeveloper0056.crm.dynamics.com/api/data/v9.1/$metadata#Microsoft.Dynamics.CRM.wfsv_CEOUserIdSearchResponse",
            "ContactsInfo": "{\"ContactsOOPView\":[{\"AccountName\":\"WQA CCER5 COMPANY B\",\"Accountid\":\"\",\"BankID\":\"1838\",\"CEOCompanyId\":\"WQAC5B\",\"CEOUserId\":\"REA01401\",\"CompanyName\":\"WQA CCER5 COMPANY B\",\"ContactType\":\"External\",\"Contactid\":\"\",\"Email\":\"Derek.Byington@msn.ie\",\"FinancialAccountid\":\"\",\"FirstName\":\"An\",\"LastName\":\"Gunn\",\"Level1\":\"37474\",\"Level2\":\"\",\"Phone\":\"\",\"Role\":\"OOPView\",\"Status\":\"\"},{\"AccountName\":\"WQA CCER5 COMPANY B\",\"Accountid\":\"\",\"BankID\":\"1838\",\"CEOCompanyId\":\"WQAC5B\",\"CEOUserId\":\"REA01401\",\"CompanyName\":\"WQA CCER5 COMPANY B\",\"ContactType\":\"External\",\"Contactid\":\"\",\"Email\":\"Derek.Byington@msn.ie\",\"FinancialAccountid\":\"\",\"FirstName\":\"An\",\"LastName\":\"Gunn\",\"Level1\":\"37474\",\"Level2\":\"10035\",\"Phone\":\"\",\"Role\":\"OOPView\",\"Status\":\"\"},{\"AccountName\":\"WQA CCER5 COMPANY B\",\"Accountid\":\"\",\"BankID\":\"1838\",\"CEOCompanyId\":\"WQAC5B\",\"CEOUserId\":\"REA01401\",\"CompanyName\":\"WQA CCER5 COMPANY B\",\"ContactType\":\"External\",\"Contactid\":\"\",\"Email\":\"Derek.Byington@msn.ie\",\"FinancialAccountid\":\"\",\"FirstName\":\"An\",\"LastName\":\"Gunn\",\"Level1\":\"37474\",\"Level2\":\"37475\",\"Phone\":\"\",\"Role\":\"OOPView\",\"Status\":\"\"}]}"
        };
    }
    else {
        s1 = {
            "@odata.context": "https://wfdeveloper0056.crm.dynamics.com/api/data/v9.1/$metadata#Microsoft.Dynamics.CRM.wfsv_CEOUserIdSearchResponse",
            "ContactsInfo": "{\"ContactsOOPView\":[{\"AccountName\":null,\"Accountid\":\"\",\"BankID\":null,\"CEOCompanyId\":null,\"CEOUserId\":null,\"CompanyName\":null,\"ContactType\":\"External\",\"Contactid\":\"\",\"Email\":null,\"FinancialAccountid\":\"\",\"FirstName\":null,\"LastName\":null,\"Level1\":null,\"Level2\":null,\"Phone\":null,\"Role\":\"OOPView\",\"Status\":\"\"}]}"
        };
    }
    const s2 = JSON.parse(s1.ContactsInfo);
    if( s2 && s2.ContactsOOPView && s2.ContactsOOPView.length >0)
    {
        const sebsResult= s2.ContactsOOPView[0];
        if(isValidSEBSResult(sebsResult))
        {
            console.log("SEBS RESULT inside function: " + JSON.stringify(sebsResult));
            return sebsResult;
        }
    }
    return "";
}

export function isValidSEBSResult(sebsResult:any)
{
    if(sebsResult && sebsResult.AccountName && sebsResult.LastName)
    {
        return true;
    }
    return false;
}

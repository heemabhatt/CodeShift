export async function callSeasService(companyId: string, context: any) {
    const seasResultJson = "{\"CompanyName\":\"WQA CCER5 COMPANY B\",\"Address1Line1\":\"300 Park Ave. Suite 14001\",\"Address1City\":\"Minneapolis\",\"Address1State\":\"CA\",\"Address1Country\":\"US\",\"Address1ZipCode\":\"43555\"}";
    const seasResult = JSON.parse(seasResultJson);
    if(isValidSEASResult(seasResult))
    {
        console.log("SEAS RESULT inside function: " + JSON.stringify(seasResult));
        return seasResult;
    }
    
    return ""; 
}

export async function callSebsService(ceoCompanyId: string,ceoUserId: string, context: any) {
    const sebsResultJson = "{\"FirstName\":\"Uesr\",\"MiddleInitial\":\"A\",\"LastName\":\"One\",\"FullName\":\"Uesr A One\",\"Email\":\"userone@wells.com\",\"PhoneNumber\":\"232344\",\"MobileNumber\":\"\",\"UserStatus\":\"ACTIVE\"}" ; 
    const sebsResult = JSON.parse(sebsResultJson);
    if(isValidSEBSResult(sebsResult))
    {
        console.log("SEBS RESULT inside function: " + JSON.stringify(sebsResult));
        return sebsResult;
    }
    
    return ""; 
}

export function isValidSEBSResult(sebsResult:any)
{
    if(sebsResult && sebsResult.LastName && sebsResult.FullName)//TODO: Add more mandatory fields in condition
    {
        return true;
    }
    return false;
}

export function isValidSEASResult(seasResult:any)
{
    if(seasResult && seasResult.CompanyName ) //TODO: Add more mandatory fields in condition
    {
        return true;
    }
    return false;
}

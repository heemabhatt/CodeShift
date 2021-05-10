
export async function callSeasService(ceoCompanyId: string, context: any) {
    console.log("Inside SEAS Service...");
    let actionName = "wfsv_CEOCompanyIdSearch"; 
    const apiUrl = getAPIUrl(context, actionName);
    let seasResult:string;
    callAction(apiUrl, ceoCompanyId, "Calling SEAS Service...").then(
        (response: string) => {
          let result = JSON.parse(JSON.parse(response).Response);
              if(result.Status == "success"){
                seasResult= result.Base64; //TODO: replace with output parameter name Base64
              }
          },
          (error) => {

          });
  }


export const  callAction = (apiUrl: string, jsonParameters: string, progressMessage: string) : Promise<any> => {
    let request = new XMLHttpRequest();

    return new Promise(function (resolve, reject) {
        request.open("POST", apiUrl , true); // for CRM
        request.onload = function () {
             if (request.status >= 200 && request.status < 300){
                resolve(request.response);
             }
            else
            {
                reject(`${apiUrl} failed`);
            }
        };

        request.onerror = function () { 
            reject(`${apiUrl} failed`); 
        }

        request.onabort = function () {
            reject(`${apiUrl} aborted`); 
        }

        request.setRequestHeader("OData-MaxVersion", "4.0");
        request.setRequestHeader("OData-Version", "4.0");
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        request.send(jsonParameters);
    });
} 

export async function callSebsService(ceoCompanyId: string,ceoUserId: string, context: any) {
    console.log("Inside SEBS Service...");
    let actionName = "wfsv_CEOUserIdSearch"; 
    const apiUrl = getAPIUrl(context, actionName);
    let sebsResult:string;
    let jsonParameters =  JSON.stringify({
        ceoCompanyId:ceoCompanyId,
        ceoUserId:ceoUserId
    });
    callAction(apiUrl, jsonParameters, "Calling SEBS Service...").then(
        (response: string) => {
          let result = JSON.parse(JSON.parse(response).Response);
              if(result.Status == "success"){
                sebsResult= result.Base64; //replace with output parameter name Base64
              }
          },
          (error) => {

          });
}

export function isValidSEBSResult(sebsResult:any)
{
    if(sebsResult && sebsResult.AccountName && sebsResult.LastName)
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

export function getAPIUrl(context:any, actionName:string) {
    return context.page.getClientUrl() + actionName;
}

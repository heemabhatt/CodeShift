const SEAS_ACTION ="wfsv_CEOCompanyIdSearch";
const SEBS_ACTION = "wfsv_CEOUserIdSearch";

export interface IWebServiceResult{
    result:any,
    message: string
}

export function getAPIUrl(context: any, actionName: string) {
    return context.page.getClientUrl() + "/api/data/v9.1/"+ actionName;
}

export async function callSeasService(ceoCompanyId: string, context: any) {
    console.log("Inside SEAS Service...");
    const apiUrl = getAPIUrl(context, SEAS_ACTION);
    
    const seasInput = JSON.stringify({
        CEOCompanyId:ceoCompanyId
    });

    let seasResponse : IWebServiceResult= {
        message:"",
        result:""
    };
 
    callAction(apiUrl, seasInput).then(
        (response: string) => {
            if( isValidSEASResponse(response)){
                let result = JSON.parse(response);  
                 
                if(result.CEOCompanyIdDetails.SAESResultDetails && result.CEOCompanyIdDetails.SAESResultDetails.CompanyName) //TODO: validate required fields
                {
                    seasResponse.result = result.CEOCompanyIdDetails.SAESResultDetails
                }
                else{
                    seasResponse.message = "No Result Found From SEAS Call."
                }
            }
            else{
                seasResponse.result ="",
                seasResponse.message = "Invalid result from SEAS."
            }
        },
        (error) => {
            seasResponse.result ="",
            seasResponse.message = "An Error Occurred returning result from SEAS :"+error
        });
        return seasResponse;
}

export function isValidSEASResponse(response:any)
{
    if(response && response.ResponseStatus && response.ResponseStatus === "Success" &&  response.CEOCompanyIdDetails) 
    {
        return true;
    }
    return false;
}

export async function callSebsService(ceoCompanyId: string, ceoUserId: string, context: any) {
    console.log("Inside SEBS Service...");
    const apiUrl = getAPIUrl(context, SEBS_ACTION);

    let sebsInput = JSON.stringify({
        CEOCompanyId: ceoCompanyId,
        CEOUserId: ceoUserId
    });

    let sebsResponse : IWebServiceResult= {
        message:"",
        result:""
    };

    callAction(apiUrl, sebsInput).then(
        (response: string) => {
            if( isValidSEBSResponse(response)){
                let result = JSON.parse(response);  
                 
                if(result.CEOCompanyIdDetails.SEBSResultDetails && result.CEOUserIdDetails.SEBSResultDetails.LastName) //TODO: validate required fields
                {
                    sebsResponse.result = result.CEOUserIdDetails.SEBSResultDetails
                }
                else{
                    sebsResponse.message = "No Result Found From SEBS Call."
                }
            }
            else{
                sebsResponse.result ="",
                sebsResponse.message = "Invalid result from SEBS."
            }
        },
        (error) => {
            sebsResponse.result ="",
            sebsResponse.message = "An Error Occurred returning result from SEBS :"+error
        });

        return sebsResponse;
}

export function isValidSEBSResponse(response:any)
{
    if(response && response.ResponseStatus && response.ResponseStatus === "Success" &&  response.CEOUserIdDetails) 
    {
        return true;
    }
    return false;
}

export const callAction = (apiUrl: string, jsonParameters: string): Promise<any> => {
    let request = new XMLHttpRequest();

    return new Promise(function (resolve, reject) {
        request.open("POST", apiUrl, true); // for CRM
        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                resolve(request.response);
            }
            else {
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

export function callSeasService(companyId: string) {
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

export function callSebsService(userId: string) {
    if (userId !== undefined && userId.includes("user")) {
        const sebsResult = {
            firstname: "sebsFirstName",
            lastname: "sebsLastName",
            userstatus: "sebsUserStatus",
            email: "sebsemail@sebs.com",
            phonenumber: "121212",
            mobilenumber: "123-456-7890"
        };

        return sebsResult;
    }
}

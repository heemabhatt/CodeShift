this.test = function (executionContext) {
    const formContext = executionContext.getFormContext();
    var status = "";
    var ceoSearchResult = formContext.getAttribute("wfsv_ceosearch").getValue();

    if (ceoSearchResult === null || ceoSearchResult === undefined) {
        status = "Error: No result found";
        alert(status);
        return;
    }
    console.log("Raw ceoSearchResult: "+ ceoSearchResult);
    var ceoSearchResultObj = JSON.parse(ceoSearchResult);
    if (ceoSearchResultObj === null || ceoSearchResultObj === undefined
        || ceoSearchResultObj.ceoSearch === null || ceoSearchResultObj.ceoSearch === undefined ) {
        status = "Error: Result does not contain ceoSearch field. ";
        alert(status);
        return;
    }

    alert("CEO Search Result:  " + ceoSearchResultObj.ceoSearch);
    formContext.getAttribute("wfsv_ceosearch").setValue(ceoSearchResultObj.ceoSearch);
    status = "Success";
}

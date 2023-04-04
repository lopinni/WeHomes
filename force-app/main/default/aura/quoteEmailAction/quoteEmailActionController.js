({
    handleClickFromLwc : function (cmp, event, helper) {
        var title = $A.get("$Label.c.Success");
        var message = $A.get("$Label.c.Offer_Sent");
        var resultsToast = $A.get("e.force:showToast"); 
        resultsToast.setParams({ 
            "title": title, 
            "message": message,
            "type": 'success'
        }); 
        resultsToast.fire(); 
        $A.get("e.force:closeQuickAction").fire();
    }
})

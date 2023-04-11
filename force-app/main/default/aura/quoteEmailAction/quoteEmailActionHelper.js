({
    fireEmailSuccessToast : function() {
        var title = $A.get("$Label.c.Success");
        var message = $A.get("$Label.c.Offer_Sent");
        var resultsToast = $A.get("e.force:showToast"); 
        resultsToast.setParams({ 
            "title": title, 
            "message": message,
            "type": 'success'
        }); 
        resultsToast.fire(); 
    },

    fireEmailErrorToast : function() {
        var title = $A.get("$Label.c.Error");
        var message = $A.get("$Label.c.Offer_Email_Error");
        var resultsToast = $A.get("e.force:showToast"); 
        resultsToast.setParams({ 
            "title": title, 
            "message": message,
            "type": 'error'
        }); 
        resultsToast.fire(); 
    }
})

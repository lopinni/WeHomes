({
    sendDataToDeflect : function(event) {
        var appEvent = $A.get("e.selfService:caseCreateFieldChange");
        appEvent.setParams({
            "modifiedField": "Subject",
            "modifiedFieldValue": event.getSource().get("v.value")
        });
        appEvent.fire();
    },

    showSuccessMessage : function() {
        var toastEvent = $A.get("e.force:showToast");
        var toastTitle = $A.get("$Label.c.Success");
        var toastMessage = $A.get("$Label.c.Case_created_successfully");
        toastEvent.setParams({
            "title": toastTitle,
            "message": toastMessage,
            "type": "success"
        });
        toastEvent.fire();
    }
})
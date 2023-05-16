({
    itemsChange : function(component, event, helper) {           
        var appEvent = $A.get("e.selfService:caseCreateFieldChange");
        appEvent.setParams({
            "modifiedField": "Subject",
            "modifiedFieldValue": event.getSource().get("v.value")
        });
        appEvent.fire();
    },

    handleSuccess : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "The record has been updated successfully.",
            "type": "success"
        });
        toastEvent.fire();
        component.find("updateCaseChannel").publish();
    }
})

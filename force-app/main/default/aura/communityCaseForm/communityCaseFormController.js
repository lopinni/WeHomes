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
        helper.showSuccessMessage();
        component.find("updateCaseChannel").publish();
    }
})

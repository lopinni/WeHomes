({
    doInit : function(component, event, helper) {
        setTimeout(() => {
            component.set('v.loading', !component.get('v.loading'));
        }, 1000);
    },

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

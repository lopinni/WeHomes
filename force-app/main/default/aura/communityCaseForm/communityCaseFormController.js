({
    doInit : function(component, event, helper) {
        component.set('v.loading', !component.get('v.loading'));
    },

    itemsChange : function(component, event, helper) {           
        helper.sendDataToDeflect(event);
    },

    handleSuccess : function(component, event, helper) {
        helper.showSuccessMessage();
        component.find("updateCaseChannel").publish();
    }
})

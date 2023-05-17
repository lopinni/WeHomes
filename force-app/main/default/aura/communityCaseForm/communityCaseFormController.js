({
    doInit : function(component, event, helper) {
        setTimeout(() => {
            component.set('v.loading', !component.get('v.loading'));
        }, 1000);
    },

    itemsChange : function(component, event, helper) {           
        helper.sendDataToDeflect(event);
    },

    handleSuccess : function(component, event, helper) {
        helper.showSuccessMessage();
        component.find("updateCaseChannel").publish();
    }
})

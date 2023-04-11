({
    handleSuccess : function (cmp, event, helper) {
        helper.fireEmailSuccessToast();
        $A.get("e.force:closeQuickAction").fire();
    },

    handleClose : function (cmp, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },

    handleFail : function (cmp, event, helper) {
        helper.fireEmailErrorToast();
        $A.get("e.force:closeQuickAction").fire();
    },
})

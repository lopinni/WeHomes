({
    handleClickFromLwc : function (cmp, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    }
})

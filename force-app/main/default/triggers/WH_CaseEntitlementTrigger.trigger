trigger WH_CaseEntitlementTrigger on Case (before insert) {
    WH_CaseEntitlementHelper helper = new WH_CaseEntitlementHelper();
    helper.assignEntitlementProcess(Trigger.new);
}
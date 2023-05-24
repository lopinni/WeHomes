trigger WH_CaseEntitlementTrigger on Case (after insert) {
    WH_CaseEntitlementHelper helper = new WH_CaseEntitlementHelper();
    helper.configureAssignmentAndEntitlement(Trigger.new);
}
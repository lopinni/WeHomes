public without sharing class WH_CaseEntitlementHelper {

    private static final String ENTITLEMENT_NAME = 'Sample Entitlement';

    public void configureAssignmentAndEntitlement(List<Case> cases) {
        Entitlement entitlement = [
            SELECT Id FROM Entitlement WHERE Name =: ENTITLEMENT_NAME
        ][0];
        Set<Id> setCaseIds = new Set<Id>();
        for(Case c : cases) {
            setCaseIds.add(c.Id);
        }
        List<Case> updatedCases = new List<Case>();
        Database.DMLOptions options = new Database.DMLOptions();
        options.AssignmentRuleHeader.useDefaultRule = true;
        for(Case c : [SELECT Id FROM Case WHERE Id IN: setCaseIds]) {
            c.EntitlementId = entitlement.Id;
            c.setOptions(options);
            updatedCases.add(c);
        }
        update updatedCases;
    }

}
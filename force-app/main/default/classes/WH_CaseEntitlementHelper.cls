public without sharing class WH_CaseEntitlementHelper {

    private static final String ENTITLEMENT_NAME = 'Sample Entitlement';

    public void assignEntitlementProcess(List<Case> cases) {
        Entitlement entitlement = [
            SELECT Id, AssetId FROM Entitlement WHERE Name =: ENTITLEMENT_NAME
        ][0];
        for(Case c : cases){
            c.EntitlementId = entitlement.Id;
        }
    }

}
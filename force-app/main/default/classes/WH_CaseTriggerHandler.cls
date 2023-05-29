public with sharing class WH_CaseTriggerHandler {

    public void beforeInsert(List<SObject> newRecords) {

    }

    public void beforeUpdate(List<SObject> oldRecords, List<SObject> newRecords, Map<ID, SObject> oldRecordMap, Map<ID, SObject> newRecordMap) {

    }

    public void beforeDelete(List<SObject> oldRecords, Map<ID, SObject> oldRecordMap) {

    }

    public void afterInsert(List<SObject> newRecords, Map<ID, SObject> newRecordMap) {
        WH_CaseEntitlementHelper helper = new WH_CaseEntitlementHelper();
        helper.configureAssignmentAndEntitlement(Trigger.new);
    }

    public void afterUpdate(List<SObject> oldRecords, List<SObject> newRecords, Map<ID, SObject> oldRecordMap, Map<ID, SObject> newRecordMap) {

    }

    public void afterDelete(List<SObject> oldRecords, Map<ID, SObject> oldRecordMap) {

    }

    public void afterUndelete(List<SObject> newRecords, Map<ID, SObject> newRecordMap) {

    }

}
public with sharing class WH_TranscriptionHandler {
    public void beforeInsert(List<SObject> newRecords) {

    }

    public void beforeUpdate(List<SObject> oldRecords, List<SObject> newRecords, Map<ID, SObject> oldRecordMap, Map<ID, SObject> newRecordMap) {

    }

    public void beforeDelete(List<SObject> oldRecords, Map<ID, SObject> oldRecordMap) {

    }

    public void afterInsert(List<SObject> newRecords, Map<ID, SObject> newRecordMap) {

    }

    public void afterUpdate(List<SObject> oldRecords, List<SObject> newRecords, Map<ID, SObject> oldRecordMap, Map<ID, SObject> newRecordMap) {
        WH_TranscriptEmailSender sender = new WH_TranscriptEmailSender();
        sender.send(newRecords);
    }

    public void afterDelete(List<SObject> oldRecords, Map<ID, SObject> oldRecordMap) {

    }

    public void afterUndelete(List<SObject> newRecords, Map<ID, SObject> newRecordMap) {

    }
}
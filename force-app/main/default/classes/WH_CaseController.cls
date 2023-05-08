public without sharing class WH_CaseController {

    @AuraEnabled(cacheable=true)
    public static List<Case> getCases() {
        try {
            return [
                SELECT
                    CaseNumber,
                    Status,
                    Subject,
                    CreatedDate,
                    ClosedDate,
                    Show_Case__c
                FROM Case
                WITH SECURITY_ENFORCED
                ORDER BY CaseNumber DESC
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
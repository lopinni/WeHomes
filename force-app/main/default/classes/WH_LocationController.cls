public with sharing class WH_LocationController {
    
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getVersionFiles(String recordId){
        try {
            return [
                SELECT
                    Id,
                    Title,
                    ContentDocumentId,
                    FileType, 
                    ContentSize,
                    FileExtension,
                    VersionNumber,
                    CreatedDate,
                    VersionData,
                    FirstPublishLocationId
                FROM ContentVersion
                WHERE FirstPublishLocationId =:recordId
                WITH SECURITY_ENFORCED
                ORDER BY CreatedDate DESC
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getURL(String recordId){
        try {
            return [
                SELECT
                    DisplayUrl
                FROM Product2
                WHERE Id =:recordId
                WITH SECURITY_ENFORCED
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
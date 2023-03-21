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

    @AuraEnabled
    public static void updateMainImage(String recordId, String url){
        try {
            Product2 product = [
                SELECT
                    DisplayUrl
                FROM Product2
                WHERE Id =:recordId
                WITH SECURITY_ENFORCED
            ];
            product.DisplayUrl = url;
            update product;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteFile(String id){
        try {
            ContentVersion version = [
                SELECT ContentDocumentId
                FROM ContentVersion
                WHERE Id =:id
                WITH SECURITY_ENFORCED
            ];
            ContentDocument document = [
                SELECT Id
                FROM ContentDocument
                WHERE Id =:version.ContentDocumentId
                WITH SECURITY_ENFORCED
            ];
            delete document;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(
                String name,
                String city,
                String street,
                String country, 
                String paginationLimit, 
                String paginationOffset
            ){
        String query = 'SELECT Id, Name FROM Product2 WHERE Name != null ';
        if(name != '' && name != null) {
            query += 'AND Name LIKE \'%' + name + '%\' ';
        }
        if(city != '' && city != null) {
            query += 'AND City__c LIKE \'%' + city + '%\' ';
        }
        if(street != '' && street != null) {
            query += 'AND Street__c LIKE \'%' + street + '%\' ';
        }
        if(country != '' && country != null) {
            query += 'AND Country__c LIKE \'%' + country + '%\' ';
        }
        query += 'LIMIT ' + paginationLimit + ' OFFSET ' + paginationOffset;
        System.debug(query);
        try {
            List<Product2> products = Database.query(query);
            return products;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
public with sharing class WH_LocationController {
    
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getVersionFiles(String recordId) {
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
    public static List<Product2> getURL(String recordId) {
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
    public static void updateMainImage(String recordId, String url) {
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
    public static void deleteFile(String id) {
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
                String numberOfFloors,
                String numberOfMeetingRooms,
                String numberOfKitchens,
                String numberOfParkingSpaces,
                Boolean openPlanOffice
            ) {
        String query = 'SELECT Id, Name, DisplayUrl FROM Product2 WHERE Name != null ';
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
        if(numberOfFloors != '' && numberOfFloors != null) {
            query += 'AND Number_of_floors__c = ' + numberOfFloors + ' ';
        }
        if(numberOfMeetingRooms != '' && numberOfMeetingRooms != null) {
            query += 'AND Number_of_meeting_rooms__c = ' + numberOfMeetingRooms + ' ';
        }
        if(numberOfKitchens != '' && numberOfKitchens != null) {
            query += 'AND Number_of_kitchens__c = ' + numberOfKitchens + ' ';
        }
        if(numberOfParkingSpaces != '' && numberOfParkingSpaces != null) {
            query += 'AND Parking_spaces__c = ' + numberOfParkingSpaces + ' ';
        }
        if(openPlanOffice == true) {
            query += 'AND Open_plan_office__c = ' + openPlanOffice + ' ';
        }
        System.debug(query);
        try {
            List<Product2> products = Database.query(query);
            if(!products.isEmpty()) {
                System.debug(products[0]);
                return products;
            } else {
                return new List<Product2>();
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
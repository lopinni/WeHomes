public without sharing class WH_ReservationController {

    @AuraEnabled(cacheable=true)
    public static AuthSession getLoggedInStatus() {
        return [SELECT IsCurrent FROM AuthSession ORDER BY IsCurrent DESC LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static User getOfficeAgentInfo(String productId) {
        Product2 product = [SELECT Office_Agent__c FROM Product2 WHERE Id =: productId][0];
        return [
            SELECT 
                FirstName,
                LastName,
                FullPhotoUrl
            FROM User
            WHERE Id =: product.Office_Agent__c
        ];
    }

}
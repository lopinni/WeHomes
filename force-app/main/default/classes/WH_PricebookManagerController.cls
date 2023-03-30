public with sharing class WH_PricebookManagerController {

    private static final String BUSINESS_PRICEBOOK_TYPE = 'Business Premise PB';
    private static final String APARTMENT_PRICEBOOK_TYPE = 'Apartment PB';
    private static final String BUSINESS_PRODUCT_TYPE = 'Business Premises';
    private static final String APARTMENT_PRODUCT_TYPE = 'Apartments';

    @AuraEnabled(Cacheable=true)
    public static List<Pricebook2> getPricebooks(){     
        return [
            SELECT Id, Name, Description, IsActive, IsStandard, StartDate__c, EndDate__c, TypeInfo__c FROM Pricebook2
        ];
    }

    @AuraEnabled
    public static List<PricebookEntry> getStandardPBEs(){     
        return [
            SELECT Id, ProductName__c, ProductType__c, UnitPrice FROM PricebookEntry
            WHERE Pricebook2Id IN (
                SELECT Id FROM Pricebook2 WHERE IsStandard = true
            )
        ];
    }

    @AuraEnabled
    public static List<PricebookEntry> getPBEsById(String Id){     
        return [
            SELECT Id, ProductName__c, ProductType__c, UnitPrice FROM PricebookEntry
            WHERE Pricebook2Id =: Id
        ];
    }

    @AuraEnabled
    public static List<Product2> getProductsByType(String type, String pricebookId){
        String typeToSearch;
        if(type == BUSINESS_PRICEBOOK_TYPE) {
            typeToSearch = BUSINESS_PRODUCT_TYPE;
        } else if(type == APARTMENT_PRICEBOOK_TYPE) {
            typeToSearch = APARTMENT_PRODUCT_TYPE;
        } else {
            return [SELECT Id, Name FROM Product2];
        }
        return [
            SELECT Id, Name
            FROM Product2
            WHERE RecordType.Name =: typeToSearch
            AND Id NOT IN (
                SELECT Product2Id 
                FROM PricebookEntry 
                WHERE Pricebook2Id =: pricebookId
            ) 
        ];
    }

    @AuraEnabled(Cacheable=true)
    public static RecordType getProductRecordTypeByName(String Name){     
        return [
            SELECT Id FROM RecordType WHERE Name =: Name
        ];
    }

    @AuraEnabled
    public static void insertProductsToPriceBook(String priceBookId, List<Product2> products){
        List<PricebookEntry> priceBookEntries = new List<PricebookEntry>();
        for(Product2 product : products) {
            priceBookEntries.add(new PricebookEntry(
                Product2Id = product.Id, Pricebook2Id = priceBookId, UnitPrice = 0
            ));
        }
        try {
            insert priceBookEntries;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updatePriceBookEntries(Integer discount, List<PricebookEntry> entries){
        Double percentage = discount * 0.01;
        for(PricebookEntry pbe : entries) {
            pbe.UnitPrice = (pbe.UnitPrice - (pbe.UnitPrice * percentage)).setScale(2);
        }
        try {
            update entries;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
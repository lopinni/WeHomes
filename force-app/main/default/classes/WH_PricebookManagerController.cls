public with sharing class WH_PricebookManagerController {

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

    @AuraEnabled(Cacheable=true)
    public static List<Product2> getAllProducts(){
        List<Product2> product2s = [
            SELECT Id, Name, RecordType.Name, DisplayUrl, IsActive, Family, ( SELECT UnitPrice, IsActive FROM PricebookEntries )
            FROM Product2
            WHERE RecordType.Name != null
        ];
        return product2s;
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
            pbe.UnitPrice = pbe.UnitPrice - (pbe.UnitPrice * percentage);
        }
        try {
            update entries;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
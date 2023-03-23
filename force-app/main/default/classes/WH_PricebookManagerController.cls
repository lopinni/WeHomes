public with sharing class WH_PricebookManagerController {

    @AuraEnabled(Cacheable=true)
    public static List<Pricebook2> getPricebooks(){     
        return [
            SELECT ID, Name, Description, IsActive, IsStandard FROM Pricebook2
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

}
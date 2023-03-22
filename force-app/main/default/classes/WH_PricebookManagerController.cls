public with sharing class WH_PricebookManagerController {

    @AuraEnabled(Cacheable=true)
    public static List<Pricebook2> getPricebooks(){     
        return [SELECT ID ,Name,IsActive,IsStandard FROM Pricebook2];
    }

    @AuraEnabled(Cacheable=true)
    public static List<Product2> getAllProducts(){
        List<Product2> product2s = [
                SELECT Id, Name, Family,DisplayUrl, IsActive, (SELECT UnitPrice,IsActive FROM PricebookEntries)
                FROM Product2
        ];
        return product2s;
    }

}
public with sharing class WH_ActivePricebookBatch implements Database.Batchable<SObject>, Database.Stateful{

    private final String query = 'SELECT Id, IsActive, StartDate__c, EndDate__c FROM Pricebook2 WHERE IsActive = true AND IsStandard = false';

    public Database.QueryLocator start(Database.BatchableContext context) {
        return Database.getQueryLocator(query);
    }


    public void execute(Database.BatchableContext context, List<Pricebook2> pricebooks) {
        Date today = date.today();
        for(Pricebook2 pricebook : pricebooks){
            if(pricebook.EndDate__c < today || pricebook.StartDate__c > today){
                pricebook.IsActive = false;
            }
            if(pricebook.StartDate__c < today && pricebook.EndDate__c > today){
                pricebook.IsActive = true;
            }
        }
        update pricebooks;
    }

    public void finish(Database.BatchableContext param1) { }

}
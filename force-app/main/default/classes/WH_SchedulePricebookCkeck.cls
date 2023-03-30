public with sharing class WH_SchedulePricebookCkeck implements Schedulable {
    
    public void execute(SchedulableContext sc) {
        WH_ActivePricebookBatch pricebookCkecker = new WH_ActivePricebookBatch();
        Database.executeBatch(pricebookCkecker, 2);
    }

}
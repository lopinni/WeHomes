trigger HM_ContractTrigger on Contract__c (before insert, before update) {
    HM_ContractHandler contractHandler = new HM_ContractHandler();
    contractHandler.checkContractOverlap(Trigger.new);
}
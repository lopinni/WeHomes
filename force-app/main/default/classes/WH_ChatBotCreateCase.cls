public class WH_ChatBotCreateCase {  
 
    public class Output { 
     
        @InvocableVariable(required=true)
        public Id newCaseId;

    } 
     
    public class Input { 
     
        @InvocableVariable(required=true) 
        public String description;

        @InvocableVariable(required=true) 
        public String type; 

        @InvocableVariable(required=true) 
        public String subject;
         
    } 
 
    @InvocableMethod(label='Create Case') 
    public static List<Output> fetchCaseStatus(List<Input> listCaseInputs) { 
     
        List<Output> outputs = new List<Output>(); 
        Output objOutput = new Output();
        
        return outputs; 
     
    } 
 
}
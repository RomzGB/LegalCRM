function addContract(clientName){
    let postResSuccess
    let trimmedClientName = clientName.replace(/\s/g,'')
    let contractTitle =  $(`#${trimmedClientName}ContractTitleInput`).val()
   $.post('/contracts/addContract', {clientName, contractTitle}, (data)=>{
       if(data)
        postResSuccess = true
       //window.location.replace("http://localhost:5000/success")
    })
        $(`#divOf${trimmedClientName}`).empty()
        addContractInputFields(clientName)
        setTimeout(()=>{
            displayContracts(clientName)
            
        }, 500)
        
    
}

function addContractInputFields(clientName){
    let trimmedClientName = clientName.replace(/\s/g,'')
    let placeholder = $(`#${trimmedClientName}ContractTitleInput`).attr('placeholder')
    if(!placeholder){
        let contractTitleInput = $("<input>", {     //create fields for adding additional contracts for this client
            type: "text",
            id: trimmedClientName + "ContractTitleInput",
            placeholder: "הכנס כותרת חוזה"
        })

        let addContractButton = $("<button/>", {
           id:  trimmedClientName + "AddContractButton",
           class: 'btn btn-outline-info',
           text: "הוסף חוזה חדש",
           click: function(){
               addContract(clientName)
           }
        })
        $(`#divOf${trimmedClientName}`).append([contractTitleInput, addContractButton, `<br id="lineAfter${trimmedClientName}">`])
    }
    else{
        $(`#divOf${trimmedClientName}`).empty()
    }
}


function displayContracts(clientName){
    let trimmedClientName = clientName.replace(/\s/g,'')
    //retrieve information about contracts for a specific client from mongoDB
        let placeholder = $(`#${trimmedClientName}ContractTitleInput`).attr('placeholder')
        if(placeholder){
        $.post('/contracts/displayContracts', {clientName}, (data)=>{

            data.forEach((element)=>{
                if(element.name){
                let deleteContractButton = $("<button/>", {
                    id: `deleteContract${element._id}`,
                    class: 'btn btn-warning', 
                    click: function(){
                        deleteContract(element._id, element.name, clientName)
                    },
                })
                let trashIconClass = $("<i/>", {
                    class: "fas fa-trash"
                })
                let contractTitleButton = $("<button/>", {
                    id: element._id,
                    class: 'btn btn-info',
                    text: element.name,
                    'data-clientname': `${clientName}`,
                    'data-contractname': element.name,
                    click: function(){
                        addAssignmentInputFields(clientName, element._id),
                        displayAssignments(clientName, element._id)
                    }
                })
                
                let contractDiv = $("<div/>", {
                    id: `divOf${element._id}`
                })
                $(`#lineAfter${trimmedClientName}`).after(deleteContractButton, contractTitleButton, "<br>", contractDiv)
                $(`#deleteContract${element._id}`).append(trashIconClass)
                }
                let clientNameAttr = $(`#${trimmedClientName}`).data('clientname')
                })
                displayedContracts = true
                })
                displayedContracts = true}
                else{
                $(`#divOf${trimmedClientName}`).empty()
                displayedContracts = false}
}


function deleteContract(contractID, contractName, clientName){
        let deleteAssignment = confirm(` למחוק את החוזה ${contractName}`, "confirm")
        if(deleteAssignment){
        let trimmedClientName = clientName.replace(/\s/g,'')
        $.post('/contracts/deleteContract', {clientName, contractID}, (data)=>{
            //alert(data)
        })
        setTimeout(()=>{
            $(`#divOf${trimmedClientName}`).empty()
            addContractInputFields(clientName)
            displayContracts(clientName)
        }, 500)}
    }
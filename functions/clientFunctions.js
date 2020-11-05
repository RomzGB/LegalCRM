function addClient() {
    let clientName = $("#addClientName").val()
    $.post('/clients/newClient', {clientName}, (data) => {
        if (data) {
            $("#clientList").empty()
            displayClients()
        }
    })
}

function displayClients() {
    $.post('/clients/displayClients', {}, (data) => {
        data.forEach((element, index) => {
            let trimmedClientName = element.name.replace(/\s/g, '')
            let deleteClientbutton = $("<button/>", {
                id: `deleteClient${element._id}`,
                class: 'btn btn-warning',
                click: function () {
                    deleteClient(element.name)
                },
            })
            let trashIconClass = $("<i/>", {
                class: "fas fa-trash"
            })
            let clientName = $("<button/>", {
                id: trimmedClientName,
                type: 'button',
                class: 'btn btn-primary',
                'data-clientname': `${element.name}`,
                click: function () {
                    addContractInputFields(element.name)
                    displayContracts(element.name)
                },
                text: element.name
            })
            let clientDiv = $("<div/>", {
                id: `divOf${trimmedClientName}`
            })
            $("#clientList").append(deleteClientbutton, clientName, clientDiv, "<br>")
            $(`#deleteClient${element._id}`).append(trashIconClass)
        });
    })
}

function deleteClient(clientName){
    let deleteClient = confirm(`למחוק לקוח ${clientName}`)
    if(deleteClient)
    $.post('/clients/deleteClient', {clientName}, (data) => {
        //alert(data)
        $(`#clientList`).empty()
        displayClients()
    })
}
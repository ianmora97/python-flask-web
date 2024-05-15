function init(event){
    bringData();
    onModalsOpen();
    onUserUpdate();
    onUserAdd();
    onUserDelete();
}
async function onUserDelete(){
    $("#deleteUser").on('click', async function(){
        const id = $("#idmodal-label").html();
        const {data: response} = await axios.delete(`/api/users/${id}`);
        if(response){
            reloadTable();
            bringData();
            $("#modaledit").modal('hide');
        }
    });
}
async function onUserAdd(){
    $("#addUser").on('click', async function(){
        const name = $("#addname").val();
        const username = $("#addusername").val();
        const email = $("#addemail").val();
        const password = $("#addpassword").val();

        const data = {
            name,
            username,
            email,
            password
        }
        const {data: response} = await axios.post(`/api/users`, data);
        if(response){
            reloadTable();
            bringData();
            $("#modaladd").modal('hide');
        }
    });
}

async function onUserUpdate(){
    $("#updateUser").on('click', async function(){
        const name = $("#editname").val();
        const username = $("#editusername").val();
        const email = $("#editemail").val();
        const id = $("#idmodal-label").html();
        const password = $("#editpassword").val();

        const data = {
            name,
            username,
            email,
            password,
            id
        }
        const {data: response} = await axios.put(`/api/users/${id}`, data);
        if(response){
            reloadTable();
            bringData();
            $("#modaledit").modal('hide');
        }
    });
}



function onModalsOpen(){
    $('#modaledit').on('show.bs.modal', async function (event) {
        const button = $(event.relatedTarget);
        const id = button.data('bs-id');

        $("#idmodal-label").html(id)
        
        const {data} = await axios.get(`/api/users/${id}`);
        $("#editname").val(data.name);
        $("#editusername").val(data.username);
        $("#editemail").val(data.email);
    });
}

async function bringData(){
    const {data} = await axios.get('/api/users');
    addData(data);
}

function addData(data){
    $("#tbody").empty();
    data.forEach((e,i) => {
        showData(e);
    });
    createDataTables();
}

function showData(data){
    $("#tbody").append(`
        <tr>
            <td>${data.id}</td>
            <td>${data.name}</td>
            <td>${data.username}</td>
            <td>${data.email}</td>
            <td>***********</td>
            <td aria-label="edit" class="d-flex justify-content-center">
                <button class="btn btn-primary btn-sm"
                data-bs-toggle="modal" data-bs-target="#modaledit"
                data-bs-id="${data.id}">
                    <i class="fa-solid fa-edit"></i>
                </butt>
            </td>
        </tr>
    `);
}
function reloadTable(){
    const table = $("#table").DataTable();
    table.destroy();
    $("#tbody").empty();
}
function createDataTables(){
    $("#table").DataTable({
        responsive: true,
        select: false,
        keys: false,
        order: [[ 1, "asc" ]],
        scrollCollapse: false,
        responsive: {
            details: {
                type: 'column',
                target: 'tr',
                renderer: function ( api, rowIdx, columns ) {
                    var data = $.map( columns, function ( col, i ) {
                        return col.hidden ?`
                                <tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
                                    <td class="fw-bold">${col.title}:</td>
                                    <td>${col.data}</td>
                                </tr>
                                `:'';
                    } ).join('');
                    return data ?
                        $('<table/>').append( data ) :
                        false;
                }
            },
        }
    });
    const table = $("#table").DataTable();
    $('#info').html('');
    $('#length').html('');
    $('#pagination').html('');
    $('#table_info').appendTo('#info');
    $('#table_length').appendTo('#length');
    $('#table_paginate').appendTo('#pagination');
    $('#table_filter').html('');

    $("#table_length label select").addClass("mx-2");

    $('.buttons-page-length').appendTo('#length');

    $('.buttons-page-length').removeClass("btn-secondary").addClass("btn-white-onlyicon h-100");
    
    $('#table_paginate').appendTo('#pagination');

    $('#barraBuscar').on('keyup', function(){
        let val = $(this).val();
        var table = $("#table").DataTable();
        table.search(val).draw();
    });
}
document.addEventListener('DOMContentLoaded', init);
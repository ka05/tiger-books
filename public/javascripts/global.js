// Userlist data array for filling in info box


// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    // populateTable();
    ko.applyBindings(userInfo, document.getElementById('userInfoCont'));
});

function User(_data){
    this.id = _data._id;
    this.username = _data.username;
    this.email = _data.email;
}   

var userInfo = {
    userList : ko.observableArray(),
    getUsers  : function(){
        
        $.getJSON( '/users/userlist', function( data ) {
            $.each(data, function(){
                userInfo.userList.push(new User(this));
            });
        });
    },
    getUser : function(item, e){
        console.log(e.target);
        $.getJSON( '/users/user/' + e.target.getAttribute("data-id"), function( data ) {
            $.each(data, function(){
                userInfo.userList.push(new User(this));
            });
        });
    },
    removeUser : function(){

    }
    // this.userList = userList;
};

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

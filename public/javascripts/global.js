// Userlist data array for filling in info box


// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    // populateTable();
    ko.applyBindings(userInfo, document.getElementById('userInfoCont'));
});

function User(_data){
  this.id = _data._id;
  this.uid = _data.uid;
  this.username = _data.username;
  this.email = _data.email;
}   

function UserData(_data){
  this.uid = _data.uid;
  this.username = _data.username;
  this.email = _data.email;
  this.fullname = _data.fullname;
  this.age = _data.email;
  this.location = _data.location;
  this.gender = _data.gender;

}

var userInfo = {
    userList : ko.observableArray(),
    currUser : ko.observable(
      new UserData({
          "uid":"",
          "username":"",
          "email":"",
          "fullname":"",
          "age":"",
          "location":"",
          "gender":""
      })
    ),
    getUsers  : function(){
        
      $.getJSON( '/users/userlist', function( data ) {
        userInfo.userList.removeAll();
        $.each(data, function(){
          userInfo.userList.push(new User(this));
        });
      });
    },
    getUser : function(item, e){
      $.getJSON( '/users/userlist/' + e.target.parentNode.getAttribute("data-id"),
        function (data) {
          userInfo.currUser(new UserData(data));
        }
      );
    },
    addUser: function(item, e){
      // Super basic validation - increase errorCount variable if any fields are blank
      var errorCount = 0;
      $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
      });

      // Check and make sure errorCount's still at zero
      if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
          'username': $('#addUser fieldset input#inputUserName').val(),
          'uid': $('#addUser fieldset input#inputUID').val(),
          'email': $('#addUser fieldset input#inputUserEmail').val(),
          'fullname': $('#addUser fieldset input#inputUserFullname').val(),
          'age': $('#addUser fieldset input#inputUserAge').val(),
          'location': $('#addUser fieldset input#inputUserLocation').val(),
          'gender': $('#addUser fieldset input#inputUserGender').val()
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
          type: 'POST',
          data: newUser,
          url: '/users/adduser',
          dataType: 'JSON'
        }).done(function( response ) {

          // Check for successful (blank) response
          if (response.msg === '') {

            // Clear the form inputs
            $('#addUser fieldset input').val('');

            // Update the table
            userInfo.getUsers();

          }
          else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

          }
        });
      }
      else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
      }
    },
    removeUser : function(item, e){
      $.ajax({
        type: 'DELETE',
        url: '/users/deleteuser/' + e.target.parentNode.getAttribute("data-id")
      }).done(function( res ) {

        // Check for a successful (blank) response
        if (res.msg === '') {
          // get all users again refresh essentially
          userInfo.getUsers();
        }
        else {
          alert('Error: ' + res.msg);
        }

      });
    }
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

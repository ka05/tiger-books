// Userlist data array for filling in info box


// DOM Ready =============================================================
$(document).ready(function() {

  ko.applyBindings(userInfo, document.getElementById('userInfoCont'));
  // hack to get selects working - stupid materialize
  $('select').material_select();

});

function User(_data){
  this.id = _data._id;
  this.uid = _data.uid;
  this.fullname = _data.fullname;
  this.email = _data.email;
  this.rating = _data.rating;
  this.profileImg = _data.profileImg;
  this.bannerImg = _data.bannerImg;
  this.sBooks = _data.sBooks; // selling books
  this.bBooks = _data.bBooks; // buying books
}

function UserData(_data){
  this.uid = _data.uid;
  this.fullname = _data.fullname;
  this.email = _data.email;
  this.rating = _data.rating;
  this.profileImg = _data.profileImg;
}

function Book(_data){
  this.id = _data._id;
  this.uid = _data.uid;
  this.isbn = _data.isbn;
  this.title = _data.title;
  this.edition = _data.edition;
  this.description = _data.description;
  this.isharcover = _data.isharcover;
  this.quality = _data.quality;
}

function BookData(_data){
  this.uid = _data.uid;
  this.isbn = _data.isbn;
  this.title = _data.title;
  this.edition = _data.edition;
  this.description = _data.description;
  this.isharcover = _data.isharcover;
  this.quality = _data.quality;
}

var userInfo = {
    userList : ko.observableArray(),
    bookList : ko.observableArray(),
    bodyTmpl : ko.observable("blank-tmpl"),
    loginBodyTmpl : ko.observable("blank-tmpl"),
    currUser : ko.observable(
      new UserData({
        "uid":"",
        "fullname":"",
        "email":"",
        "rating":""
      })
    ),
    currBoook : ko.observable(
      new BookData({
        "uid":"",
        "fullname":"",
        "email":"",
        "rating":""
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
    getBooks  : function(){

      $.getJSON( '/books/booklist', function( data ) {
        userInfo.bookList.removeAll();
        $.each(data, function(){
          userInfo.bookList.push(new Book(this));

        });
        console.log(userInfo.bookList());
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
          'uid': $('#addUser fieldset input#inputUID').val(),
          'fullname': $('#addUser fieldset input#inputUserFullname').val(),
          'email': $('#addUser fieldset input#inputUserEmail').val(),
          'rating': $('#addUser fieldset input#inputUserRating').val()
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
    addBook: function(item, e){
      // Super basic validation - increase errorCount variable if any fields are blank
      var errorCount = 0;
      $('#addBook input').each(function(index, val) {
        if($(this).attr('id') != "inputBookHardcover"){
          if($(this).val() === '') { errorCount++; }
        }
      });

      // Check and make sure errorCount's still at zero
      if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newBook = {
          'uid': userInfo.currUser().uid,
          'isbn': $('#addBook fieldset input#inputBookISBN').val(),
          'title': $('#addBook fieldset input#inputBookTitle').val(),
          'edition': $('#addBook fieldset input#inputBookEdition').val(),
          'description': $('#addBook fieldset input#inputBookDesc').val(),
          'quality': $('#addBook fieldset select#inputBookQual').val(),
          'isharcover': $('#addBook fieldset input#inputBookHardcover').is(':checked')
        };



        // Use AJAX to post the object to our adduser service
        $.ajax({
          type: 'POST',
          data: newBook,
          url: '/books/addbook',
          dataType: 'JSON'
        }).done(function( response ) {

          // Check for successful (blank) response
          if (response.msg === '') {

            // Clear the form inputs
            $('#addBook fieldset input').val('');

            // Update the table
            userInfo.getBooks();

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
  /**
   * Store these for books
   *
   * ISBN
   * title
   * edition
   * isHardcover
   * description
   * qualityID
   * ownerID
   */

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
    },
    changeMainView : function(data, event){
      // show main view based on "data-view-name" attribute
      var tmplName = event.target.getAttribute("data-view-name");
      userInfo.bodyTmpl(tmplName);
      userInfo.setActiveTab(event.target);

      if(tmplName == "profile"){
        $('ul.tabs').tabs();
        $('#user-banner').css("background-image", "url('media/sunrise_simone.png')");
        $('#img-cont').html("");
        $('#img-cont').css("background-image", "url('media/profile.png')");
      }
      if(tmplName == "login"){
        userInfo.loginBodyTmpl("login-body");
      }
    },
    editAccount : function(){
      // show modal allowing to change
      // UID
      // Email
      // Phone num
      // Upload a photo - or use mycourses photo??
    },
    setActiveTab : function(_ele){
      $('#nav-mobile').find('li').each(function(){
        $(this).removeClass("active");
      });
      _ele.parentNode.className = "active";
    },
    login : function () {
      // grab some basic validation code from another project to save time

    },
    signUp : function(){
      // show different form
      userInfo.loginBodyTmpl("signup-body");
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

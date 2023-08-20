// Used(https://learn.jquery.com/using-jquery-core) and (https://materializecss.com) documentations as reference.
$(document).ready(function () {

  var userBtn = $('#userBtn');
  var userDropdown = $('#userDropdown');
  var modal = $('.modal');
  var select = $('select');
  var profileType = $('#profileType');
  var profileTypeForm = $('#profileTypeForm');
  var profileTypeBtn = $('#profileTypeBtn');
  var profileTypeModal = $('#profileTypeModal');
  // Used(https://learn.jquery.com/using-jquery-core/selecting-elements/) as reference.
  var actualLoginBtn = $('#actualLoginBtn');
  var username = $('#username');
  var password = $('#password');
  var loginBtn = $('#loginBtn');
  var loginModal = $('#loginModal');
  var loginError = $('#loginError');
  var signupBtn = $('#signupBtn');
  var signupForm = $('#signupForm');
  var signupModal = $('#signupModal');
  var signupUsername = $('#signupUsername');
  var signupEmail = $('#signupEmail');
  var signupPassword = $('#signupPassword');
  var signupConfirmPassword = $('#signupConfirmPassword');
  var errorMsg = $('#errorMsg');
  var errorMsgText = $('#errorMsgText');
  var displayUsername = $('#displayUsername');
  var displayProfileType = $('#displayProfileType');
  var userProfile = $('#userProfile');
  var logoutBtn = $('#logoutBtn');
  var users = JSON.parse(localStorage.getItem('users')) || [];

  // Initialize dropdown, modals and select
  userBtn.dropdown();
  modal.modal();
  select.formSelect();

  //giving users a fresh start when they try again.
  loginModal.on('close', function () {
    loginError.hide();
  });

  var openProfileTypeModal = function () {
    profileTypeModal.modal('open');
  };

  var newProfileType = function () {

    var selectedProfile = profileType.val();
    localStorage.setItem('profileType', selectedProfile);

  };

  var openLoginModal = function () {
    loginModal.modal('open');
  };

  window.attemptLogin = function () {

    loginError.hide();
    var loginUsername = username.val();
    var loginPassword = password.val();

    var userExists = users.some(function(user) {
        return user.username === loginUsername && user.password === loginPassword;
    });

    if (userExists) {
      localStorage.setItem('isLoggedin', 'true');
      localStorage.setItem('username', loginUsername);
      localStorage.setItem('password', loginPassword);
      newProfileType();
      displayUserProfile();
      //using the jQuery method for closing modals with Materialize CSS.
      loginModal.modal('close');
    } else {
      loginError.show();
    }
  };

  actualLoginBtn.click(function () {
    attemptLogin();
  });

  var openSignupModal = function () {
    signupModal.modal('open');
  };

  var signupValidation = function (event) {
    event.preventDefault();

    var signupUsernameValue = signupUsername.val();
    var signupEmailValue = signupEmail.val();
    var signupPasswordValue = signupPassword.val();
    var signupConfirmPasswordValue = signupConfirmPassword.val();
    newProfileType();

    //email validation regex from (https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript)
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(signupEmailValue)) {
      showError('Invalid email address');
      return;
    }

    if (signupPasswordValue.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }

    if (signupPasswordValue !== signupConfirmPasswordValue) {
      showError('Passwords do not match');
      return;
    }

    var newUser = {
      username: signupUsernameValue,
      email: signupEmailValue,
      password: signupPasswordValue,
      profileType: localStorage.getItem('profileType') || 'Not Selected'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    //closing the modal and resetting the form.
    signupModal.modal('close');
    signupForm[0].reset();
    displayUserProfile();

  };

  var displayUserProfile = function () {

    var storedUsername = localStorage.getItem('username');
    var storedProfileType = localStorage.getItem('profileType') || 'Not Selected';
    var isLoggedin = localStorage.getItem('isLoggedin') === 'true';

    if (isLoggedin && storedUsername) {
      displayUsername.text(storedUsername);
      displayProfileType.text(storedProfileType);
      userProfile.show();
    } else {
      userProfile.hide();
    }

  };

  // Checking if the user is logged in and displaying the appropriate buttons.
  if (localStorage.getItem('isLoggedin') === 'true') {
    profileType.show();
    loginBtn.hide();
    signupBtn.hide();
  } else {
    profileType.hide();
    loginBtn.show();
    signupBtn.show();
  }

  var logoutUser = function () {
    localStorage.setItem('isLoggedin', 'false');
    location.reload();
  };

  //Helper function for showing error messages.
  var showError = function (errorMessage) {
    errorMsgText.text(errorMessage);
    //using the jQuery method for opening modals with Materialize CSS
    errorMsg.modal('open');
  };

  profileTypeBtn.on('click', openProfileTypeModal);
  profileType.change(newProfileType);
  loginBtn.on('click', openLoginModal);
  signupBtn.on('click', openSignupModal);
  signupForm.submit(signupValidation);
  displayUserProfile();
  logoutBtn.on('click', logoutUser);

});
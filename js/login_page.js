const login_form = document.querySelector('.login--form');
const email_field = document.querySelector('#email_txt');
const pass_field = document.querySelector('#password_txt');
const check_box = document.querySelector('#exampleCheck1');
const login_error_box = document.querySelector('#error--submit-msg--login--form');

// To Save Details of LoggedIn Account
const accLogin = function(account_obj){
    localStorage.setItem('loginAcc',JSON.stringify(account_obj));
    window.location.href='../pages/covid-portal.html';    
};
// To Save Details for Remember On Account
const rememberAccount = function(account_obj){
    localStorage.setItem('saved_account',JSON.stringify(account_obj));
};

// A function To Run on Page Load and Load Saved Accounts If Present
const onpageLoad = function(){
    let saved_acc_obj = (localStorage.getItem('saved_account')) ;
    saved_acc_obj = saved_acc_obj ? JSON.parse(saved_acc_obj) : ''; 
    if(!saved_acc_obj) return;
    email_field.value = saved_acc_obj.loginMail;
    pass_field.value  = saved_acc_obj.loginPassword;
    check_box.setAttribute('checked','');
};
onpageLoad();

// To check whether Entered Password Matches for The Account
const pass_n_Email_Match = function(emailID,password){
    let account_array = JSON.parse(localStorage.getItem('account_detail'));
    if(!account_array) return false;
    return account_array.some((user,index) => {
      if(user.emailID.toLowerCase()===emailID.toLowerCase() && user.oncePass===password){return true};
    });

};

// Email Field Validation on Blur Event
email_field.addEventListener('blur',function(){
    let mail_ID = this.value;
    if(email_validator(mail_ID)){
        isValid_Adder(this);
    }else isInvalid_Adder(this);
});

// On Submit the Login Form
login_form.addEventListener('submit',function(e){
    e.preventDefault();
    let form_data_arr = [...new FormData(this)];
    let form_details = Object.fromEntries(form_data_arr);
    if(emailIDexists(form_details.loginMail)){
        let user_valid = pass_n_Email_Match(form_details.loginMail,form_details.loginPassword);
        if(user_valid){
            accLogin(form_details); // To Login and Save Details
            if(!form_details.remember) return; // If user checked Remember Me
            rememberAccount(form_details); // To Remember The User
        }else{
            error_render(login_error_box,'Try to Enter Right Password');
        };

    }else{
        error_render(login_error_box,"Email Isn't Registered Yet");
    };

});
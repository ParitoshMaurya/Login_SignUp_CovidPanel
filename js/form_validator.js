//  Name Validator 
const name_validator = function (name_input) {
    let name_pattern = /^[A-Za-z]{3,15}$/;
    let name_inp = name_input.trim();
    if (name_pattern.test(name_inp)) return true;
    else return false;
  };

// Password Validator 
const password_validator = function (pass_to_check) {
    let pass_pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9@!#?]{8,20}$/;
    if (pass_pattern.test(pass_to_check)) return true;
    else return false;
  };
const confirm_password_validator = function(confirm_password){
    let first_pass_value = first_password.value;
    if(first_pass_value === confirm_password) return true;
    else return false;
  }
  
  // Email Validator 
const email_validator  = function(email_ID){
    const mail_ID = email_ID.trim();
    let mail_pattern = /^[A-Za-z]{1}[A-Za-z._0-9]{3,}@[A_Za-z]{3,}[.]{1}[A-Za-z.]{2,6}$/;
    if(mail_pattern.test(mail_ID))return true;
    else return false;
  };
  
  // A function to Validate the entered DOB 
const DOB_Validator = function(dob_input){
    const input_date_milliseconds = Date.parse(dob_input);
    const current_age = (Date.now() - input_date_milliseconds)/1000/60/60/24/365;
    if(current_age>=18) return true;
    else return false;
  };

// A function to check mail ID Exists or Not 
const emailIDexists = function(emailID){
    let account_array = JSON.parse(localStorage.getItem('account_detail'));
    if(!account_array) return false;
    return account_array.some((user,index) => {
      if(user.emailID.toLowerCase()===emailID.toLowerCase()){return true}
    })
  }
  
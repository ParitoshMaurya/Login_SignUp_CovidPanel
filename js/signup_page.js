const next_btn = document.querySelector('#form--1--btn');
const first_form = document.querySelector('.signup_page_form_1');
const second_form = document.querySelector('.signup_page_form_2');
const email_input = document.querySelector('#email_ID');
const D_O_B_input = document.querySelector('#date_of_birth');
const first_name_input = document.querySelector('#first_name');
const last_name_input  = document.querySelector('#last_name');
const first_password = document.querySelector('#password_first');
const confirm_password = document.querySelector('#confirm_password');
const address_input = document.getElementById('address_input');
const pincode_input = document.querySelector('#pincode_input');
const error_box_form_1 = document.querySelector('#error--submit-msg--form--1');
const error_box_form_2 = document.querySelector('#error--submit-msg--form--2');
const register_form_error_box = document.querySelector('#error--submit-msg--register--form');
let account_obj;

// To Save the Signed Up Details In Local Storage
const LocalStorageSaver = function(acc_obj){
  if(localStorage.getItem('account_detail')==null){
    let account_array = [];
    account_array.push(acc_obj);
    localStorage.setItem('account_detail',JSON.stringify(account_array));
 }else{
     let account_array = JSON.parse(localStorage.getItem('account_detail'));
     account_array.push(acc_obj);
     localStorage.setItem('account_detail',JSON.stringify(account_array));
}};




// Blur Events Validation For Forms ------------------------------------------

let input_arr =[first_name_input,last_name_input];
input_arr.forEach(name=>{
  name.addEventListener('blur',function(){
    let name_value = this.value;
    if(name_validator(name_value)){
      isValid_Adder(this);
    }else{
      isInvalid_Adder(this);
    };
  });
});


email_input.addEventListener('blur',function(){
  let email_ID_input = this.value;
  if(email_validator(email_ID_input)){
    isValid_Adder(this);
  }else{
    isInvalid_Adder(this);
  };
});

D_O_B_input.addEventListener('blur',function(){
  if(DOB_Validator(D_O_B_input.value)){
    isValid_Adder(this);
  }else{
    isInvalid_Adder(this);
    };
});

first_password.addEventListener('blur',function(){
  let pass_value = this.value;
  if(password_validator(pass_value)) isValid_Adder(this);
  else isInvalid_Adder(this);
});

confirm_password.addEventListener('blur',function(){
  let confirm_pass_value = this.value;
  if(confirm_password_validator(confirm_pass_value)) isValid_Adder(this);
  else isInvalid_Adder(this);
});

// ----------------------------------------------------------------------
let emailExistsFlag ;
const first_form_validator = function(details_obj){
  emailExistsFlag = false;
  if(!name_validator(details_obj.firstName)) return false;
  if(!name_validator(details_obj.lastName)) return false;
  if(!DOB_Validator(details_obj.dateOfBirth)) return false;
  if(!email_validator(details_obj.emailID)) return false;
  if(emailIDexists(details_obj.emailID)){ //If Mail Already Exists
    isInvalid_Adder(email_input);
    emailExistsFlag=true
    error_render(error_box_form_1,'This Mail Already Exists');
    return false;
  };
  if(!password_validator(details_obj.oncePass)) return false;
  if(!confirm_password_validator(details_obj.confirmPass)) return false;
  return true;
};

first_form.addEventListener('submit',function(e){
    e.preventDefault();
    const form_details_Arr = [...new FormData(this)];
    const form_details = Object.fromEntries(form_details_Arr);
    if(first_form_validator(form_details)){
      account_obj = Object.assign(form_details);
      // To Slide To Second Form of SignUp Page
      this.style.transform = "translateX(-100%)";
      second_form.style.transform = "translateX(-100%)";
    }else{
      if(!emailExistsFlag) error_render(error_box_form_1,'Please Fill The Form Carefully');
    };
});



// ------------ intlTelInput JavaScript  ------------------------------------
let input = document.querySelector("#mobile_number"),
errorMsg = document.querySelector("#error-msg"),
validMsg = document.querySelector("#valid-msg");

let errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

let iti = intlTelInput(input, {
    initialCountry:"in",
    utilsScript:'https://intl-tel-input.com/node_modules/intl-tel-input/build/js/utils.js?21'
});

let reset = function() {
    input.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
    validMsg.classList.add("hide");
};
  
  // on blur: validate
input.addEventListener('blur', function() {
  reset();
  if (input.value.trim()) {
    if (iti.isValidNumber()) {
      validMsg.classList.remove("hide");
    } else {
      input.classList.add("error");
      let errorCode = iti.getValidationError();
      errorMsg.innerHTML = errorMap[errorCode];
      errorMsg.classList.remove("hide");
    };
  };
});
  
  // on keyup / change flag: reset
input.addEventListener('change', reset);
input.addEventListener('keyup', reset);



// ------------------------- Photo Upload JS -----------------
let loadFile = function (event) {
  let image = document.getElementById('profile_pic_show');
  image.src = URL.createObjectURL(event.target.files[0]);
};

// ------- Auto Complete Address JS-------------------------------
let autocomplete;
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(address_input, { types: ["geocode"] });
  autocomplete.setFields(["address_component"]);
  autocomplete.addListener("place_changed", fillInAddress);
};

// To Fill The Pincde If Available 
function fillInAddress(){
  const place = autocomplete.getPlace();
  let zip_code;
  place.address_components.forEach((elem,index)=>{
    if (elem.types.includes('postal_code')) zip_code = elem.short_name;
  });
  pincode_input.value = '';
  if(!zip_code) return;
  pincode_input.value = zip_code;
  pincode_input.removeAttribute('disabled');
};
// Function to Make the Address Search Near The GeoLocation 
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy,
      });
      autocomplete.setBounds(circle.getBounds());
    });
  };
};

//-------------------------------------------------------------

// A Function To Validate Details Of Second Form
const second_form_validator = function(detail_obj){
  if(!iti.isValidNumber()) return false; 
  if(detail_obj.addressInfo.length<4) return false;
  return true;
};

// Event Listener on Second Form Submit
second_form.addEventListener('submit',function(e){
  e.preventDefault();
  const form_details_Arr = [...new FormData(this)];
  const form_details = Object.fromEntries(form_details_Arr);
  if (second_form_validator(form_details)) {
    Object.assign(account_obj,form_details);
    LocalStorageSaver(account_obj);
    error_render(register_form_error_box,'Registered Successfully',account_obj.firstName,'success');
    second_form.style.transform = "translateX(-200%)";
    setTimeout(()=>{
      error_render(register_form_error_box,'Redirecting To Login Page',account_obj.firstName,'success')
      setTimeout(()=>{
        window.location.href = '../pages/login.html';
      },3000);
    },2000)

  }else{ 
   error_render(error_box_form_2,'Please Fill the Form Carefully', account_obj.firstName);
  }
});


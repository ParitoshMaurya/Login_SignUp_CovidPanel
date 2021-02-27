// To add Bootstrap class is-valid to input tags 
const isValid_Adder = function(HTMLElement){
    HTMLElement.classList.remove('is-invalid');
    HTMLElement.classList.add('is-valid');
};
  // To add Bootstrap class is-invalid to input tags 
const isInvalid_Adder = function(HTMLElement){
    HTMLElement.classList.remove('is-valid');
    HTMLElement.classList.add('is-invalid');
};


// To Render The Error 
const error_render = function(form_box, message, name = 'User',type = "warning"){
    form_box.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show animate__animated animate__zoomInUp" role="alert">
                <strong>Hey ${name}!</strong> ${message}.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;
}
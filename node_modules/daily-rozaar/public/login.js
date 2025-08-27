document.getElementById('customerlogin').addEventListener('submit', function (event) {
event.preventDefault();

const customerPhoneNumber = document.getElementById('customerPhoneNumber').value;
const customerpassword = document.getElementById('customerpassword').value;

fetch('/customerloginaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerPhoneNumber, customerpassword })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        window.location.href = data.redirectUrl;
    } else {
        
        document.getElementById('loginerror').style.display = 'block';
        document.getElementById('submitButton').style.marginTop="20px";
    }
})
.catch(err => console.error('Error:', err));
});


document.getElementById('workerlogin').addEventListener('submit', function (event) {
    event.preventDefault();

    const workerPhoneNumber = document.getElementById('workerPhoneNumber').value;
    const workerpassword = document.getElementById('workerpassword').value;
    const dob = document.getElementById('dob').value;
    fetch('/workerloginaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerPhoneNumber, workerpassword,dob})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirectUrl;
        } else {
            
            document.getElementById('workerloginerror').style.display = 'block';
            document.getElementById('submitButton').style.marginTop="20px";
        }
    })
    .catch(err => console.error('Error:', err));
});



function moveSlider(activeId) {
        const workerForm = document.getElementById('workerFormdiv');
        const customerForm = document.getElementById('customerFormdiv');
        const slider = document.querySelector('.slider');

        if (activeId === 'worker') {
            workerForm.style.display = 'block';
            customerForm.style.display = 'none';
            slider.style.transform = 'translateX(0)';
        } else if (activeId === 'customer') {
            workerForm.style.display = 'none';
            customerForm.style.display = 'block';
            slider.style.transform = 'translateX(100%)';
        }

        // Update button active state
        document.querySelectorAll('.toggle-group .btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`label[for="${activeId}"]`).classList.add('active');
    }

function checkWorkerFormValidity() {
    const dobInput = document.getElementById('dob');
    const workerPhoneNumber=document.getElementById('workerPhoneNumber');
    const workerpassword=document.getElementById('workerpassword');
    const workerlogin=document.getElementById('workerloginbutton');

    const isValid   =   dobInput.classList.contains('is-valid') &&
                        workerPhoneNumber.classList.contains('is-valid') &&
                        workerpassword.classList.contains('is-valid');
            
                        workerlogin.disabled = !isValid; 

}
function checkcustomerFormValidity() {
    const customerPhoneNumber=document.getElementById('customerPhoneNumber');
    const customerpassword=document.getElementById('customerpassword');
    const customerlogin=document.getElementById('customerloginbutton');

    const isValid   =   customerPhoneNumber.classList.contains('is-valid') &&
                        customerpassword.classList.contains('is-valid');
            
                        customerlogin.disabled = !isValid; 

}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('dob').addEventListener('blur', function() {
        validateDOB();
        checkWorkerFormValidity();
    });
    document.getElementById('workerPhoneNumber').addEventListener('blur', function() {
        validatePhoneNumber('workerPhoneNumber', 'workerPhoneError');
        checkWorkerFormValidity();
    });
    document.getElementById('workerpassword').addEventListener('blur', function() {
        validateWorkerPassword();
        checkWorkerFormValidity();
    });


    document.getElementById('customerpassword').addEventListener('blur', function() {
        validatePassword();
        checkcustomerFormValidity();
    });

    document.getElementById('customerPhoneNumber').addEventListener('blur', function() {
        validatePhoneNumber('customerPhoneNumber', 'customerPhoneError');
        checkcustomerFormValidity();
    });
    // checkWorkerFormValidity();
    // checkcustomerFormValidity();
});

document.addEventListener("DOMContentLoaded", function () {
    const languageSelect = document.getElementById("languageSelect");
    const savedLanguage = localStorage.getItem("language") || "en";
    languageSelect.value = savedLanguage;
    function switchLanguage() {
        const selectedLanguage = languageSelect.value;
        localStorage.setItem("language", selectedLanguage);
        const elements = document.querySelectorAll("[data-en]");
        elements.forEach(function (element) {
            element.textContent = element.getAttribute(`data-${selectedLanguage}`);
            element.placeholder = element.getAttribute(`data-${selectedLanguage}`);
        });
    }
    switchLanguage();
    languageSelect.addEventListener("change", function () {
        console.log("Language selected:", languageSelect.value);
        switchLanguage();
    });
});


function validatePhoneNumber(inputId, errorId) {
    const phoneInput = document.getElementById(inputId);
    const phoneError = document.getElementById(errorId);
    const phoneNumber = phoneInput.value;

    const phonePattern = /^[5-9][0-9]{9}$/;

    if (phoneNumber.length !== 10) {
        phoneError.style.display = 'block'; 
        phoneInput.classList.add('is-invalid'); 
        phoneInput.classList.remove('is-valid'); 
    } else if (!phonePattern.test(phoneNumber)) {
        phoneError.style.display = 'block'; 
        phoneInput.classList.add('is-invalid'); 
        phoneInput.classList.remove('is-valid'); 
    } else {
        phoneError.style.display = 'none';
        phoneInput.classList.remove('is-invalid'); 
        phoneInput.classList.add('is-valid'); 
    }
    checkWorkerFormValidity();
    checkcustomerFormValidity();
}

document.getElementById('workerPhoneNumber').addEventListener('blur', () => validatePhoneNumber('workerPhoneNumber', 'workerPhoneError'));
document.getElementById('customerPhoneNumber').addEventListener('blur', () => validatePhoneNumber('customerPhoneNumber', 'customerPhoneError'));


function validateDOB() {
const dobInput = document.getElementById('dob');
const dobError = document.getElementById('dobError');
const dobValue = dobInput.value;

if (dobValue) {

    const currentDate = new Date();
    const dob = new Date(dobValue);
    
    let age = currentDate.getFullYear() - dob.getFullYear();
    const m = currentDate.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
        age--; 
    }

    if (age < 18) {
        dobError.style.display = 'block'; 
        dobInput.classList.add('is-invalid'); 
        dobInput.classList.remove('is-valid'); 
    } else {
        dobError.style.display = 'none'; 
        dobInput.classList.add('is-valid'); 
        dobInput.classList.remove('is-invalid'); 
    }
} else {
    
    dobInput.classList.remove('is-invalid', 'is-valid'); 
    dobError.style.display = 'none'; 
}
checkWorkerFormValidity();
}

document.getElementById('dob').addEventListener('blur', validateDOB); 
document.getElementById('dob').addEventListener('input', validateDOB); 


function validateWorkerPassword() {
const passwordInput = document.getElementById('workerpassword');
const passwordError = document.getElementById('workerpassworderror');
const passwordValue = passwordInput.value;

const passwordPattern = /^\d{12}$/;

if (!passwordPattern.test(passwordValue)) {
    passwordError.style.display = 'block';
    passwordInput.classList.add('is-invalid'); 
    passwordInput.classList.remove('is-valid'); 
} else {
    passwordError.style.display = 'none'; 
    passwordInput.classList.remove('is-invalid'); 
    passwordInput.classList.add('is-valid'); 
}
checkWorkerFormValidity();
}
document.getElementById('workerpassword').addEventListener('change', validateWorkerPassword);

function validatePassword() {
const Customerpasswordinput = document.getElementById('customerpassword');
const passwordError = document.getElementById('customerpassworderror');
const password = Customerpasswordinput.value;

// Password validation regex
const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;

if (!passwordPattern.test(password)) {
    passwordError.style.display = 'block'; 
    Customerpasswordinput.classList.add('is-invalid'); 
    Customerpasswordinput.classList.remove('is-valid'); 
} else {
    passwordError.style.display = 'none'; 
    Customerpasswordinput.classList.remove('is-invalid'); 
    Customerpasswordinput.classList.add('is-valid'); 
}
checkcustomerFormValidity();
}

document.getElementById('customerpassword').addEventListener('change', validatePassword);

function togglecustomereye() {
    const passwordField = document.getElementById('customerpassword');
    const eyeIcon = document.getElementById('eye-icon-customer');
    if (passwordField.type === 'password') {
        passwordField.type = 'text'; 
        eyeIcon.classList.remove('bi-eye');
        eyeIcon.classList.add('bi-eye-slash'); 
    } else {
        passwordField.type = 'password'; 
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
    }
}
document.getElementById('toggle-password-customer').addEventListener('click', togglecustomereye);
function toggleworkereye() {
    const workerpasswordfield=document.getElementById('workerpassword');
    const eyeIcon = document.getElementById('eye-icon-worker');

    if (workerpasswordfield.type === 'password') {
        workerpasswordfield.type= 'text';
        eyeIcon.classList.remove('bi-eye');
        eyeIcon.classList.add('bi-eye-slash'); 
    } else {
        workerpasswordfield.type = 'password';
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
    }
}
document.getElementById('toggle-password-worker').addEventListener('click', toggleworkereye);

function setupPasswordToggle(toggleId, inputId, iconId) {
    const toggle = document.getElementById(toggleId);
    const icon = document.getElementById(iconId);
    const input = document.getElementById(inputId);

    if (toggle && icon && input) {
      toggle.addEventListener('click', function () {
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.remove('bi-eye');
          icon.classList.add('bi-eye-slash');
        } else {
          input.type = 'password';
          icon.classList.remove('bi-eye-slash');
          icon.classList.add('bi-eye');
        }
      });
    }
  }
  function validateNewPassword() {
    const Customerpasswordinput = document.getElementById('customernewpassword');
    const passwordError = document.getElementById('customernewpassworderror');
    const password = Customerpasswordinput.value;
    
    // Password validation regex
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;
    
    if (!passwordPattern.test(password)) {
        passwordError.style.display = 'block'; 
        Customerpasswordinput.classList.add('is-invalid'); 
        Customerpasswordinput.classList.remove('is-valid'); 
    } else {
        passwordError.style.display = 'none'; 
        Customerpasswordinput.classList.remove('is-invalid'); 
        Customerpasswordinput.classList.add('is-valid'); 
    }
    checkPasswordValidity();
    }

  document.addEventListener("DOMContentLoaded", function () {
    setupPasswordToggle('toggle-password-customer-new', 'customernewpassword', 'eye-icon-customer-new');
    setupPasswordToggle('toggle-password-customer-new', 'confirmcustomernewpassword', 'eye-icon-customer-new');
    document.getElementById('customernewpassword').addEventListener('blur', validateNewPassword);
  });
  document.addEventListener('DOMContentLoaded', function () {
    const newPassword = document.getElementById('customernewpassword');
    const confirmPassword = document.getElementById('confirmcustomernewpassword');
    const errorDiv = document.getElementById('confirmcustomerpassworderror');

    function validatePasswordMatch() {
        if (newPassword.value !== confirmPassword.value) {
            errorDiv.style.display = 'block';
            Customerpasswordinput.classList.add('is-invalid'); 
            Customerpasswordinput.classList.remove('is-valid'); 
        } else {
            errorDiv.style.display = 'none';
            confirmPassword.classList.remove('is-invalid'); 
            confirmPassword.classList.add('is-valid'); 
        }
        checkPasswordValidity();
    }
    confirmPassword.addEventListener('blur', validatePasswordMatch);
});

function checkPasswordValidity() {
    const newPassword = document.getElementById('customernewpassword');
    const confirmPassword = document.getElementById('confirmcustomernewpassword');
    const passwordupdatebutton=document.getElementById('passwordupdatebutton');

    const isValid   =   newPassword.classList.contains('is-valid') &&
                        confirmPassword.classList.contains('is-valid');
            
                        passwordupdatebutton.disabled = !isValid; 

}

document.getElementById("forgetcustomerpassword").addEventListener("submit", async function (e) {
    e.preventDefault();

    const phone = document.getElementById("PhoneNumbercustomer").value;
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("customernewpassword").value;

    const response = await fetch("/forgetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            PhoneNumbercustomer: phone,
            email: email,
            customernewpassword: newPassword
        }),
    });

    const result = await response.json();

    if (result.success) {
        // Close current modal
        const modalEl = document.getElementById("Forgetpassword");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        document.getElementById("forgetcustomerpassword").reset();
        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById("updatedsuccessfully"));
        successModal.show();
        setTimeout(() => {
            successModal.hide();
          }, 1500);
    } else {
        document.getElementById("passwordupdateerror").style.display = "block";
        document.getElementById("passwordupdateerror").innerText = result.message || "Something went wrong";
    }
});

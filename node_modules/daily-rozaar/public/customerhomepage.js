let isEditing = false;
          
document.addEventListener('DOMContentLoaded', function() {
    fetch('/customerprofile')
        .then(response => response.json())
        .then(data => {
            console.log('Profile data:', data);
            document.getElementById('fullName').value = data.fullName;
            document.getElementById('phoneNumber').value = data.phoneNumber;
            document.getElementById('email').value = data.email;
            document.getElementById('zip').value = data.zip;
            document.getElementById('state').value = data.state;
            document.getElementById('city').value = data.city;
            console.log('Subdivision:', data.subdivision);  

            const subdivisionElement = document.getElementById('subdivision');


            if (data.subdivision) {
                subdivisionElement.innerHTML = `<option selected>${data.subdivision}</option>`;
            }
            document.getElementById('address1').value = data.address1;
            document.getElementById('imagePreview').src = data.profileImage;
        })
        .catch(err => console.error('Error fetching profile:', err));
        document.getElementById('cancelButton').addEventListener('click',function(e){
          e.preventDefault();
          toggleEditMode(false);
          removeValidClasses(['fullName', 'phoneNumber', 'email', 'zip', 'address1','subdivision','state','city']);
          const buttonArea=document.getElementById("buttonArea");
          buttonArea.className = buttonArea.className.replace('col-sm-6', 'col-sm-12');
          const imageerror=document.getElementById('imageError');
          imageerror.style.display="none";
        });

        document.getElementById('editBut').addEventListener('click', function(e) {
            e.preventDefault();
            toggleEditMode(true);  
            markFieldValid('fullName');
            markFieldValid('phoneNumber');
            markFieldValid('email');
            markFieldValid('zip');
            markFieldValid('address1');
            markFieldValid('subdivision');
            markFieldValid('city');
            markFieldValid('state');
            checkFormValidity();

        });
      document.querySelectorAll('#customerform input, #customerform select').forEach(field => {
        field.addEventListener('input', () => {
          hasChanges = true;
        });
        field.addEventListener('change', () => {
          hasChanges = true;
        });
      });

      document.getElementById('customerform').addEventListener('submit', function(e) {
          e.preventDefault();

          if (isEditing) {
            if (!hasChanges) {
              alert('No changes were made. Please update your details before saving.  कोई बदलाव नहीं किया गया। कृपया सहेजने से पहले अपना विवरण अपडेट करें।');
              return;
            }
              const phoneNumber = document.getElementById('phoneNumber').value;
              const email = document.getElementById('email').value;
              const formData = new FormData(this); 

                fetch('/updateDetails', {
                    method: 'POST',
                    body: formData  
                })
              .then(response => response.json())
              .then(data => {
                  if (data.status === 'existingPhone') {
                      document.getElementById('phoneexistError').style.display = 'block';
                  } else if (data.status === 'existingEmail') {
                      document.getElementById('emailexistError').style.display = 'block';
                  } else if (data.status === 'success') {
                      toggleEditMode(false);  
                      hasChanges = false;
                      removeValidClasses(['fullName', 'phoneNumber', 'email', 'zip', 'address1','subdivision','state','city']);
                      const successModal = new bootstrap.Modal(document.getElementById('updatedsuccessfully'));
                        successModal.show();
                        setTimeout(() => {
                          successModal.hide();
                        }, 1500);
                  }
              })
              .catch(err => console.error('Error updating details:', err));
          }
      });

    function removeValidClasses(fieldIds) {
      fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.classList.remove('is-valid');
      });
    }
    function markFieldValid(fieldId) {
      const field = document.getElementById(fieldId);
      field.classList.add('is-valid');
      field.classList.remove('is-invalid');
    }

    function toggleEditMode(enable) {
        const formFields = document.querySelectorAll("#customerform input, #customerform select");
        const submitButton = document.getElementById('submitButton');
        const cancelButton = document.getElementById('cancelButton');
        const imageUploadInput = document.getElementById("imageUploadInput");
        const uploadHint = document.getElementById("uploadHint");
        const buttonArea=document.getElementById("buttonArea");

        formFields.forEach(input => {
            input.disabled = !enable;  
        });

        
        submitButton.style.display=enable ? "block" : "none";
        cancelButton.style.display=enable ? "block" : "none";
        cancelButton.style.marginTop=enable ? "40px" : "0px";
        submitButton.style.marginTop=enable ? "40px" : "0px";
        buttonArea.className = buttonArea.className.replace('col-sm-12', 'col-sm-6');
        imageUploadInput.disabled = !enable;
        uploadHint.style.display = enable ? "block" : "none"; 
          
        isEditing = enable;  
    }


    const imagePreview = document.getElementById("imagePreview");
    const previewContainer = document.querySelector(".preview-container");

    previewContainer.addEventListener("mouseenter", () => {
        if (isEditing) {
          uploadHint.style.opacity = 1;
            imagePreview.style.filter = "brightness(50%)";
            imagePreview.style.backgroundColor = "black";
        }
    });

    previewContainer.addEventListener("mouseleave", () => {
        if (isEditing) {
          uploadHint.style.opacity = 0;

            imagePreview.style.filter = "brightness(100%)";
            imagePreview.style.backgroundColor = "transparent";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const descriptionInput = document.getElementById("posting_description");
  const imageInput = document.getElementById("uploadpostingimage");
  const submitButton = document.querySelector(".PostingSubmitButton");
  const errorDiv = document.getElementById("postimageerror");
  const uploadText = document.getElementById("UploadText");
  const uploadedText = document.getElementById("uploadedText");
  const filelabel = document.querySelector(".post-file-label");
  const filelabelicon = document.querySelector(".bi-image");

  function validateForm() {
      const hasDescription = descriptionInput.value.trim().length > 0;
      const hasValidImage = imageInput.files.length > 0 && imageInput.files[0].size <= 5 * 1024 * 1024; // 5MB
      const hasImageTooBig = imageInput.files.length > 0 && imageInput.files[0].size > 5 * 1024 * 1024;

      if (hasImageTooBig) {
          errorDiv.style.display = "block";
      } else {
          errorDiv.style.display = "none";
      }

      submitButton.disabled = !(hasDescription || hasValidImage) || hasImageTooBig;
  }

  descriptionInput.addEventListener("input", validateForm);
  imageInput.addEventListener("change", function () {
      if (imageInput.files && imageInput.files[0]) {
          const file = imageInput.files[0];

          if (file.size <= 5 * 1024 * 1024) {
              uploadText.style.display = 'none';
              uploadedText.style.display = 'block';
              filelabel.style.backgroundColor = "#67ae6e";
              filelabel.style.borderColor = '';
              filelabelicon.style.color = "white";
              filelabel.style.color = 'white';
          } else {
              uploadedText.style.display = 'none';
              uploadText.style.display = 'block';
              filelabel.style.backgroundColor = "#f8d7da";
              filelabel.setAttribute('style', filelabel.getAttribute('style') + '; border: 1px solid red !important;');
              filelabelicon.style.color = "red";
              filelabel.style.color = 'red';
          }
      }

      validateForm();
  });

  submitButton.disabled = true;
});

document.querySelector('.logout-button').addEventListener('click', function(e) {
  e.preventDefault();

  fetch('/logout', { method: 'GET' })
      .then(response => {
          if (response.ok) {
              window.location.href = '/login.html';  
          } else {
              console.error('Logout failed');
          }
      })
      .catch(err => console.error('Logout failed:', err));
});


document.addEventListener("DOMContentLoaded", function () {

  
  const serviceCategory = document.getElementById("servicecategory");
  const profileShow = document.getElementById("profileshow");
  const backButton = document.getElementById("backbutton");

  profileShow.style.display = "none";

  const categoryCards = document.querySelectorAll("#servicecategory .card");
  categoryCards.forEach((card) => {
    card.addEventListener("click", function () {
      const category = card.id;
      loadProfiles(category);
      serviceCategory.style.display = "none";
      profileShow.style.display = "block";
    });
  });

  backButton.addEventListener("click", function () {
    profileShow.style.display = "none";
    serviceCategory.style.display = "block";
  });
  const socket = io();
  let workerStatuses = {};
  
  setInterval(() => {
    socket.emit('requestStatusUpdate');
  }, 3000);
  // When receiving the initial bulk online workers list
  socket.on('bulkStatusUpdate', (onlineWorkerIds) => {
      onlineWorkerIds.forEach(workerid => {
      workerStatuses[workerid] = true;
      updateStatusIndicator(workerid, true); 
      updateStatusIndicator2(workerid, isOnline);
       });
  });
  socket.on("worker-status-update", (data) => {
    workerStatuses[data.workerId] = data.isOnline;
  });
  
  // Real-time updates for single workers
  socket.on('statusUpdate', (workerid, isOnline) => {
    workerStatuses[workerid] = isOnline;
    updateStatusIndicator(workerid, isOnline);
    updateStatusIndicator2(workerid, isOnline);
  });
  
  // Reusable function to update UI
  function updateStatusIndicator(workerid, isOnline) {
    const viewrequests=document.getElementById('viewallrequests');
    const profileDiv = viewrequests.querySelector(`#profilediv-${workerid}`);
    if (profileDiv) {
      const statusElement = profileDiv.querySelector('.online-offline-status');
      if (statusElement) {
        statusElement.style.backgroundColor = isOnline ? '#72d82d' : 'rgb(238, 0, 0)';
      }
    }
  }
  
  function updateStatusIndicator2(workerid, isOnline) {
    const profileshow=document.getElementById('profileshow');
    const profileDiv = profileshow.querySelector(`#profilediv-${workerid}`);
    if (profileDiv) {
      const statusElement = profileDiv.querySelector('.online-offline-status');
      if (statusElement) {
        statusElement.style.backgroundColor = isOnline ? '#72d82d' : 'rgb(238, 0, 0)';
      }
    }
  }

  function loadProfiles(category,sortOption=null) {
  const currentLanguage = document.getElementById("languageSelect").value;
  const translations = {
    labour: { en: "Labour", hi: "श्रमिक" },
    mistri: { en: "Mistri", hi: "मिस्त्री" },
    electrician: { en: "Electrician", hi: "इलेक्ट्रिशियन" },
    plumber: { en: "Plumber", hi: "प्लंबर" },
    painter: { en: "Painter", hi: "पेंटर" },
    carpenter: { en: "Carpenter", hi: "कारपेंटर" },
  };

  fetch(`/profiles?category=${category}&sort=${sortOption || ""}`)
    .then((res) => res.json())
    .then((data) => {
      const headingElement = document.querySelector(".h2.text-center");
      
      headingElement.setAttribute("data-category", category); 

      headingElement.setAttribute(
        "data-en",
        `${translations[category].en}'s Profiles in Your location`
      );
      headingElement.setAttribute(
        "data-hi",
        `यह आपके स्थान पर ${translations[category].hi} प्रोफ़ाइल है`
      );
      const currentLanguage = localStorage.getItem("language") || "en";
      headingElement.textContent = headingElement.getAttribute(
        `data-${currentLanguage}`
      );
      

      const profileRow = document.querySelector(".profileshowrow");
      profileRow.innerHTML = ""; 
      if (data.length === 0) {
        // No profiles found
        profileRow.innerHTML = `<p class="noprofilestatus" data-en="No profile in your location" data-hi="आपके स्थान पर कोई प्रोफ़ाइल नहीं है">No profile</p>`;
      } else {
        // let profilesMap = {};

        
        data.forEach((profile) => {
        //   if (!profilesMap[profile.workerid]) {
        //     profilesMap[profile.workerid] = profile;
        //   } else {
        //     if (new Date(profile.requestDate) > new Date(profilesMap[profile.workerid].requestDate)) {
        //       profilesMap[profile.workerid] = profile;
        //     }
        //   }
        // });
        
        
        // Object.values(profilesMap).forEach((profile) => {
          const isOnline = workerStatuses[profile.workerid] || false;
          let status = "";
          if (profile.status === "accepted") {
            status = `
              <p
                 data-en="Accepted" 
                 data-hi="स्वीकार" 
                 class="acceptedstatus"></p>`;
          } else if (profile.status === "pending") {
            status = `
              <p 
                 data-en="Pending" 
                 data-hi="लंबित" 
                 class="pendingstatus"></p>`;
          } else {
            status = `
              <p class="nostatus">&nbsp;</p>`;
          }
          
          const profileDiv = `
            <div class="col-3 profilebox" id="profilediv-${profile.workerid}">
              <div class="row co-12">
                <div class="col-5 profileboximgdiv d-flex">
                  <img src="${profile.image}"  alt="${profile.fullName}">
                </div>
                <div class="col-7">
                  <div class="col-12 row">
                    <div class="col-10" style="padding:0px !important">
                    <p class="workernaming" style="margin-bottom:5px;color:white">${profile.fullName}</p>
                    </div>
                    <div class="col-2" >
                        <span class="online-offline-status" style="background-color: ${isOnline ? '#72d82d' : 'rgb(238, 0, 0)'}"></span>
                    </div>
                  </div>
                  <div class="col-12 row text-start">
                  ${status}
                  </div>
                  <div class="col-12 ratingandchargediv row justify-content-between">
                    <div class="col-5 d-flex align-items-center">
                      <i class="bi bi-star-fill"></i>
                      <p class="mb-0 ms-1">${profile.average_rating}</p>
                    </div>
                    <div class="col-6 d-flex align-items-center">
                      <i class="bi bi-cash-stack"></i>
                      <p class="mb-0 ms-1 servicecharge">₹${profile.servicecharge}</p>
                    </div>
                  </div>
                </div>
              </div>  
                <div class="col-12">
                  <button type="button" class="btn viewprofile" data-hi="प्रोफ़ाइल देखें" data-en="View Profile" data-bs-toggle="modal" data-bs-target="#profileviewmodal" data-id="${profile.workerid}"></button>
                </div>
              
            </div>`;

          profileRow.insertAdjacentHTML("beforeend", profileDiv);
        });
      }
      function updateButtonText() {
        const buttons = document.querySelectorAll('.viewprofile'); 
        buttons.forEach((btn) => {
            const textElement = btn.querySelector('span') || btn;  
            textElement.textContent = textElement.getAttribute(`data-${currentLanguage}`);
        });
      }
      updateButtonText();
      function updateStatusText() {
        const currentLanguage = localStorage.getItem("language") || "en"; // default to English
        const statusElements = document.querySelectorAll('.acceptedstatus, .pendingstatus, .noprofilestatus');
        
        statusElements.forEach((element) => {
          element.textContent = element.getAttribute(`data-${currentLanguage}`);
        });
      }
      updateStatusText();
      

      document.querySelectorAll(".viewprofile").forEach((btn) =>
        btn.addEventListener("click", function () {
          const workerId = btn.getAttribute("data-id");
          loadProfileDetails(workerId);
        })
      );
    });
    document.getElementById("sorting").addEventListener("change", function () {
      const selectedSort = this.value;
      localStorage.setItem("selectedsort",selectedSort);
      const category = document.querySelector(".h2.text-center").getAttribute("data-category"); 
      console.log("Show category",category);
      loadProfiles(category, selectedSort);
    });
}

function loadrequests() {
  fetch(`/loadrequests`)
    .then((res) => res.json())
    .then((data) => {
      const currentLanguage = localStorage.getItem("language") || "en";
      const profileRow = document.querySelector(".viewrequestrow");
      profileRow.innerHTML = ""; 
      if (data.length === 0) {
        // No profiles found
        profileRow.innerHTML = `<p class="noprofilestatus" data-en="No Requests" data-hi="कोई अनुरोध नहीं"></p>`;
      } else {
        profileRow.innerHTML = `<p class="noprofilestatus" style="color:black" data-en="View All Requests" data-hi="सभी अनुरोध देखें"></p><hr>`;


        
        data.forEach((profile) => {
          const isOnline = workerStatuses[profile.workerid] || false;
          const alreadyRated = profile.alreadyRated == 1 ? true : false;

          let ratingButtonAttrs = '';
          let ratingButtonClasses = 'ratingbutton';

          if (profile.status !== 'accepted' || alreadyRated) {
            ratingButtonAttrs = 'disabled';
          }
          if (alreadyRated) {
            ratingButtonClasses += ' rated-success';
          }
          let status = "";
          if (profile.status === "accepted") {
            status = `
              <p
                 data-en="Accepted" 
                 data-hi="स्वीकार" 
                 class="acceptedstatus"></p>`;
          } else if (profile.status === "pending") {
            status = `
              <p 
                 data-en="Pending" 
                 data-hi="लंबित" 
                 class="pendingstatus"></p>`;
          } else if (profile.status === "completed") {
            status = `
              <p 
                 data-en="Finished" 
                 data-hi="समाप्त" 
                 class="completedstatus"></p>`;
          }
          else {
            status = `
              <p class="nostatus">&nbsp;</p>`;
          }
          function getHindiOccupation(english) {
            const map = {
              "Labour": "श्रमिक",
              "Plumber": "प्लंबर",
              "Electrician": "इलेक्ट्रिशियन",
              "Painter": "पेंटर",
              "Mistri": "मिस्त्री",
              "Carpenter": "कारपेंटर"
            };
            return map[english] || english;
          }
          
          const profileDiv = `
            <div class="col-3 profilebox" id="profilediv-${profile.workerid}">
              <div class="row co-12">
                <div class="col-5 profileboximgdiv d-flex">
                  <img src="${profile.image}"  alt="${profile.fullName}">
                </div>
                <div class="col-7">
                  <div class="col-12 row">
                    <div class="col-10" style="padding:0px !important">
                    <p class="workernaming" style="margin-bottom:5px;color:white">${profile.fullName}</p>
                    </div>
                    <div class="col-2" >
                       <span class="online-offline-status" style="background-color: ${isOnline ? '#72d82d' : 'rgb(238, 0, 0)'};display:${profile.status==='completed'?'none !important':'block'}"></span>
                    </div>
                  </div>
                  <div class="col-12 row justify-content-between">
                  ${status}
                  <p class="occupation-text" data-en="${profile.occupation}" data-hi="${getHindiOccupation(profile.occupation)}">${currentLanguage === 'hi' ? getHindiOccupation(profile.occupation) : profile.occupation}</p>
                  </div>
                  <div class="col-12 ratingandchargediv row justify-content-between">
                    <div class="col-5">

                      <button type="button" 
                              class="${ratingButtonClasses}" 
                              data-bs-toggle="modal" 
                              data-bs-target="#ratingModal" 
                              data-workerid="${profile.workerid}"
                              data-requestid="${profile.requestid}" 
                              ${ratingButtonAttrs}>
                        <i class="bi bi-star-fill"></i>
                        <span class="ms-2" 
                              data-en="${alreadyRated ? 'Rated' : 'Rate'}" 
                              data-hi="${alreadyRated ? 'रेटेड' : 'रेट'}">
                          ${currentLanguage === 'hi' ? (alreadyRated ? 'रेटेड' : 'रेट') : (alreadyRated ? 'Rated' : 'Rate')}
                        </span>
                      </button>
                     </div>
                    <div class="col-6 d-flex align-items-center">
                      <i class="bi bi-cash-stack"></i>
                      <p class="mb-0 ms-1 servicecharge">₹${profile.servicecharge}</p>
                    </div>
                  </div>
                </div>
              </div>  
                <div class="col-12">
                  <button type="button" class="btn viewprofile" data-hi="प्रोफ़ाइल देखें" data-en="View Profile" data-bs-toggle="modal" data-bs-target="#profileviewmodal" data-id="${profile.workerid}"></button>
                </div>
              
            </div>`;

          profileRow.insertAdjacentHTML("beforeend", profileDiv);
        });
      }
      function updateButtonText() {
        const buttons = document.querySelectorAll('.viewprofile,.ratingbutton'); 
        buttons.forEach((btn) => {
            const textElement = btn.querySelector('span') || btn;  
            textElement.textContent = textElement.getAttribute(`data-${currentLanguage}`);
        });
      }
      updateButtonText();
      function updateStatusText() {
        const currentLanguage = localStorage.getItem("language") || "en"; // default to English
        const statusElements = document.querySelectorAll('.acceptedstatus, .pendingstatus, .noprofilestatus, .completedstatus');
        
        statusElements.forEach((element) => {
          element.textContent = element.getAttribute(`data-${currentLanguage}`);
        });
      }
      updateStatusText();
      

      document.querySelectorAll(".viewprofile").forEach((btn) =>
        btn.addEventListener("click", function () {
          const workerId = btn.getAttribute("data-id");
          loadProfileDetails(workerId);
        })
      );
    });
}
loadrequests();


  const stars = document.querySelectorAll('.star-rating .star');
  let selectedRating = 0;

  stars.forEach((star) => {
    star.addEventListener('mouseover', () => {
      const value = parseInt(star.getAttribute('data-value'));
      updateStars(value);
    });

    star.addEventListener('mouseout', () => {
      updateStars(selectedRating);
    });

    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-value'));
      updateStars(selectedRating);
    });
  });
  function updateStars(rating) {
    stars.forEach((star) => {
      const value = parseInt(star.getAttribute('data-value'));
      star.classList.toggle('hovered', value <= rating);
      star.classList.toggle('selected', value <= rating);
    });
  }
  
  const submitBtn = document.getElementById('submitRatingBtn');
  const ratingModal = document.getElementById('ratingModal');
  
  // Triggered right before modal is shown
  ratingModal.addEventListener('show.bs.modal', (event) => {
    const triggerButton = event.relatedTarget; // This is the .ratingbutton
  
    if (triggerButton) {
      const workerId = triggerButton.getAttribute('data-workerid');
      const requestId = triggerButton.getAttribute('data-requestid');
  
      // Set the data attributes on the submit button
      submitBtn.setAttribute('data-workerid', workerId);
      submitBtn.setAttribute('data-requestid', requestId);
    }
  });
  
    
  
  

  submitBtn.addEventListener('click', () => {
    if (selectedRating === 0) {
      alert('Please select a rating ,कृपया रेटिंग चुनें ');
      return;
    }
  
    // You need to get the workerid and requestid from the button that opened the modal
    const workerId = submitBtn.getAttribute('data-workerid');
    const requestId = submitBtn.getAttribute('data-requestid');
  
    if (!workerId || !requestId) {
      alert('Worker info not found');
      return;
    }
    
    fetch('/submitrating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workerid: workerId,
        requestid: requestId,
        rating: selectedRating
      })
      
    })
    
    .then(res => res.json())
    .then(response => {
      if (response.message === "Rating saved successfully") {
        console.log(response); 
        selectedRating = 0;
        updateStars(0);
        const modalEl = bootstrap.Modal.getInstance(document.getElementById('ratingModal'));
        modalEl.hide();
        const successModal = new bootstrap.Modal(document.getElementById('Ratedsuccessfully'));
        successModal.show();

        const ratingButtons = document.querySelectorAll(`[data-workerid="${workerId}"][data-requestid="${requestId}"]`);
        ratingButtons.forEach(btn => {
          btn.disabled = true;
          btn.classList.add('rated-success'); 
          const span = btn.querySelector('span');
          if (span) {
            span.setAttribute("data-en", "Rated");
            span.setAttribute("data-hi", "रेटेड");
            span.textContent = span.getAttribute(`data-${localStorage.getItem("language") || "en"}`);
          }
        });
        setTimeout(() => {
          successModal.hide();
        }, 3000);
        const selectedSort=localStorage.getItem("selectedsort");
        loadProfiles(category,selectedSort);
      } else {
        // alert('Failed to submit rating');
      }
    })
    .catch(err => {
      console.error(err);
      // alert('Error submitting rating');
    });
  });

  

function loadProfileDetails(workerId) {
  fetch(`/worker/${workerId}`)
    .then((res) => res.json())
    .then((profile) => {
      document.querySelector("#profileviewmodal img").src = profile.image;
      const tableBody = document.querySelector("#profileviewmodal table tbody");
      tableBody.innerHTML = `
        <tr>
          <th scope="row" data-en="NAME" data-hi="नाम">NAME</th>
          <td>${profile.fullName}</td>
        </tr>
        <tr>
          <th scope="row" data-en="Phone Number" data-hi="फ़ोन नंबर">Phone Number</th>
          <td>${profile.phoneNumber}</td>
        </tr>
        <tr>
          <th scope="row" data-en="Address" data-hi="पता">Address</th>
          <td>${profile.address}</td>
        </tr>`;
      const currentLanguage = localStorage.getItem("language") || "en";
      tableBody.querySelectorAll("th").forEach((th) => {
        th.textContent = th.getAttribute(`data-${currentLanguage}`);
      });

      const contactBtn = document.querySelector(".contactbutton");
      contactBtn.addEventListener("click", () => {
        const phoneLink = `tel:${profile.phoneNumber}`;
        window.location.href = phoneLink;
      });

      const sendRequestBtn = document.querySelector(".sendrequest");
      const cancelrequestbtn = document.querySelector(".cancelrequest");
      const acceptedrequestbtn = document.querySelector(".acceptedrequest");
      sendRequestBtn.workerId = profile.workerid;
      cancelrequestbtn.workerId = profile.workerid;
      acceptedrequestbtn.workerId = profile.workerid;

      checkRequestStatus(profile.workerid);


      if (!sendRequestBtn.hasEventListener) {
          sendRequestBtn.addEventListener("click", function () {
              const workerId = this.workerId;
              if (workerId) {
                  fetch(`/sendRequests/${workerId}`, { method: "POST" })
                      .then((res) => res.json())
                      .then((data) => {
                          if (data.success) {
                              this.style.display = "none";
                              cancelrequestbtn.style.display = "block";
                              const currentCategory = document.querySelector(".h2.text-center").getAttribute("data-category");
                              const selectedSort=localStorage.getItem("selectedsort");
                              loadProfiles(currentCategory,selectedSort);
                              loadrequests();
                          }
                      })
                      .catch((err) => console.error("Error sending request:", err));
                      
              }
              
          });
          
          sendRequestBtn.hasEventListener = true;
      }
        
      if (!cancelrequestbtn.hasEventListener) {
            cancelrequestbtn.addEventListener("click", function () {
                const workerId = this.workerId;  
                console.log("Cancel Request Worker ID: ", workerId);
                if (workerId) {
                    fetch(`/cancelRequests/${workerId}`, { method: "POST" })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.success) {
                                cancelrequestbtn.style.display = "none";
                                sendRequestBtn.style.display = "block";
                                const currentCategory = document.querySelector(".h2.text-center").getAttribute("data-category");
                                const selectedSort=localStorage.getItem("selectedsort");
                                loadProfiles(currentCategory,selectedSort);
                                loadrequests();
                            }
                        })
                        .catch((err) => console.error("Error canceling request:", err));
                }
            });
            cancelrequestbtn.hasEventListener = true;  
        }
      });
}
function checkRequestStatus(workerId) {
fetch(`/checkRequestStatus/${workerId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const status = data.requestStatus;
            const sendRequestButton = document.querySelector(".sendrequest");
            const cancelRequestButton = document.querySelector(".cancelrequest");
            const acceptedRequestButton = document.querySelector(".acceptedrequest");

            if (status === 'pending') {
                sendRequestButton.style.display = "none";
                cancelRequestButton.style.display = "inline-block";
                acceptedRequestButton.style.display = "none";
            } else if (status === 'accepted') {
                sendRequestButton.style.display = "none";
                cancelRequestButton.style.display = "none";
                acceptedRequestButton.style.display = "inline-block";
            } else {
                sendRequestButton.style.display = "inline-block";
                cancelRequestButton.style.display = "none";
                acceptedRequestButton.style.display = "none";
            }
        }
    })
    .catch(error => console.error('Error checking request status:', error));
}

document.getElementById('postingform').addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch('/posting', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      this.reset();
      loadMyPosts(); // Refresh post list
    }
  });
});

function loadMyPosts() {
  fetch('/getmyposts')
    .then(res => res.json())
    .then(posts => {
      const container = document.querySelector('.ViewPosting');
      const nopoststatus=document.getElementById('nopoststatus');
      if(posts.length===0)
      {
        nopoststatus.style.display="block";
        return;
      }
      else{
        nopoststatus.style.display="none";
      container.innerHTML = '';
      posts.forEach(post => {
        const postDate = new Date(post.date);
        const formattedDate = `${String(postDate.getDate()).padStart(2, '0')}-${String(postDate.getMonth() + 1).padStart(2, '0')}-${postDate.getFullYear()}`;
        const postBox = document.createElement('div');
        postBox.className = 'col-sm-11 PostingBox';
        let postImg = post.postimage 
          ? `<div class="col-12" style="display: flex;">
              <img src="/image/post_images/${post.postimage}" class="img-fluid posting_image" alt="...">
             </div>` 
          : '';
        postBox.innerHTML = `
          <div class="row">  
            <div class="col-sm-12" style="margin: auto;margin-top: 20px;">
              <div class="row flex-nowrap">
                <div class="col-auto">
                  <img src="${post.profileImage}" class="img-thumbnail" alt="...">
                </div>
                <div class="col">
                  <p style="float: left;"><span>${post.fullName}</span> <br>
                    <span class="dateofposting">${formattedDate}</span></p>
                </div>
                <div class="col-auto">
                  <button class="custom-close-btn" data-id="${post.post_id}" data-img="${post.postimage}" style="float:margin-right: 10px;">&times;</button>
                </div>
              </div>
            </div>
            <div class="col-auto">
              <p style="font-size: 0.9rem;padding: 20px">${post.description}</p>
            </div>
            ${postImg}
          </div>`;
        container.appendChild(postBox);
      });
    }
      document.querySelectorAll('.custom-close-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          if (confirm('Are you sure you want to delete this post? "क्या आप वाकई इस पोस्ट को हटाना चाहते हैं?"')) {
            fetch('/deletepost', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                post_id: this.dataset.id,
                postimage: this.dataset.img
              })
            })
            .then(res => res.json())
            .then(data => {
              if (data.success) 
                container.innerHTML = '';
                loadMyPosts();
            });
          }
        });
      });
    });
}
loadMyPosts();
          // Ensure modal updates when language is switched
document.getElementById("languageSelect").addEventListener("change", () => {
  const currentLanguage = localStorage.getItem("language") || "en";
  updateButtonText();
  updateStatusText(); 
  const headingElement = document.querySelector(".h2.text-center");
  document.querySelectorAll("#profileviewmodal table th").forEach((th) => {
    th.textContent = th.getAttribute(`data-${currentLanguage}`);
  });
  headingElement.textContent = headingElement.getAttribute(
    `data-${currentLanguage}`
  );
});

});


function checkFormValidity() {
  const fullName = document.getElementById('fullName');
  const phoneNumber = document.getElementById('phoneNumber');
  const email = document.getElementById('email');
  const zipElement = document.getElementById('zip');
  const subdivisionSelect = document.getElementById("subdivision");
  const submitButton = document.getElementById("submitButton");
  const Address = document.getElementById('address1');


  const isValid = fullName.classList.contains('is-valid') &&
                  phoneNumber.classList.contains('is-valid') &&
                  email.classList.contains('is-valid') &&
                  zipElement.classList.contains('is-valid') &&
                  Address.classList.contains('is-valid') &&
                  subdivisionSelect.value !== 'Choose Subdivision ▼';
                          
                  console.log("Form Valid: ", isValid);
          submitButton.disabled = !isValid; 
}


document.addEventListener("DOMContentLoaded", function() {

    const zipElement = document.getElementById("zip");
    const zipErrorElement = document.getElementById("zipError");
    const subdivisionSelect = document.getElementById("subdivision");
    const cityElement = document.getElementById("city");
    const stateElement = document.getElementById("state");
    
    zipElement.addEventListener("blur", function() {
        const pinCode = zipElement.value;
        if (pinCode.length === 6 && /^\d{6}$/.test(pinCode)) {
            zipElement.classList.add("is-valid");
            zipElement.classList.remove("is-invalid");
            fetchCityState(pinCode);
        } else {
            zipElement.classList.add("is-invalid");
            zipElement.classList.remove("is-valid");
            resetCityStateFields();
            showErrorMessage(zipErrorElement);
        }
        checkFormValidity(); 
    });

    zipElement.addEventListener("input", function() {
        const pinCode = zipElement.value;
        if (pinCode.length !== 6 || !/^\d{6}$/.test(pinCode)) {
            zipElement.classList.remove("is-valid");
            zipElement.classList.add("is-invalid");
            resetCityStateFields();
        }
        checkFormValidity(); 
    });
    
    function fetchCityState(pinCode) {
const apiUrl = `https://api.postalpincode.in/pincode/${pinCode}`;

zipErrorElement.style.display = "none"; 

$.get(apiUrl, function(data) {
    if (data && data[0]?.Status === "Success") {
        const postOffices = data[0].PostOffice;
        subdivisionSelect.innerHTML = postOffices.length > 1 
            ? `<option disabled selected>Choose Subdivision ▼</option>` 
            : '';

        const existingSubdivision = document.getElementById('subdivision').value;

        postOffices.forEach((office) => {
            const option = document.createElement("option");
            option.textContent = office.Name;
            subdivisionSelect.appendChild(option);
        });

        cityElement.value = postOffices[0].District;
        stateElement.value = postOffices[0].State;
        if (!existingSubdivision || existingSubdivision === 'Choose Subdivision ▼') {
            subdivisionSelect.value = existingSubdivision || postOffices[0].Name;
        }

        subdivisionSelect.readOnly = postOffices.length <= 1;
        checkFormValidity(); 
    } else {
        showErrorMessage(zipErrorElement);
    }
}).fail(() => showErrorMessage(zipErrorElement));
}


    
function showErrorMessage(errorElement) {
    const selectedLanguage = document.getElementById("languageSelect").value;
    const errorMessage = selectedLanguage === "hi"
        ? errorElement.getAttribute("data-hi")
        : errorElement.getAttribute("data-en");

    errorElement.textContent = errorMessage;
    errorElement.style.display = "block";
}

    
function resetCityStateFields() {
    cityElement.value = '';
    stateElement.value = '';
    subdivisionSelect.innerHTML = '';
    checkFormValidity(); 
}
    
document.getElementById("customerform").addEventListener("submit", function(event) {
    if (!subdivisionSelect.value || subdivisionSelect.value === "Choose Subdivision ▼") {
        event.preventDefault();
        alert("Please select a subdivision!");
    }
});


document.getElementById('fullName').addEventListener('load', function() {
    validateFullName();
    checkFormValidity();
});

document.getElementById('phoneNumber').addEventListener('load', function() {
    validatePhoneNumber();
    checkFormValidity();
});

document.getElementById('address1').addEventListener('load', function() {
    validateAddress();
    checkFormValidity();
});
document.getElementById('email').addEventListener('load', function() {
    validateEmail(this);
    checkFormValidity();
});

document.getElementById('subdivision').addEventListener('change', function() {
    checkFormValidity();
});
    
    checkFormValidity();
});
function moveSlider(activeId) {
  const servicecategory = document.getElementById('servicecategory');
  const viewallrequests = document.getElementById('viewallrequests');
  const profileshow=document.getElementById('profileshow');
  const slider = document.querySelector('.slider');
  // viewallrequests.style.display='none';
  if (activeId === 'Service') {
    servicecategory.style.display = 'block';
    viewallrequests.style.display = 'none';
    profileshow.style.display='none';
      slider.style.transform = 'translateX(0)';
  } else if (activeId === 'Requests') {
    servicecategory.style.display = 'none';
      viewallrequests.style.display = 'block';
      profileshow.style.display='none';
      slider.style.transform = 'translateX(100%)';
  }

  // Update button active state
  document.querySelectorAll('.toggle-group .btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`label[for="${activeId}"]`).classList.add('active');
}
window.addEventListener('DOMContentLoaded', () => {
  const selectedToggle = document.querySelector('input[name="toggle"]:checked');
  if (selectedToggle) {
    moveSlider(selectedToggle.id);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const serviceSection = document.getElementById("service");
  const profileSection = document.getElementById("profile");
  const postingSection = document.getElementById("posting");
  const navLinks = document.querySelectorAll(".nav-link");

  // Function to activate the clicked section
  function activateSection(activeSection) {
    // Hide all sections first
    serviceSection.style.display = "none";
    profileSection.style.display = "none";
    postingSection.style.display = "none";
    
    // Remove active and bg-black classes from all nav links
    navLinks.forEach(link => link.classList.remove("active", "bg-black"));

    // Show the active section
    activeSection.style.display = "block";

    // Add active and bg-black classes to the clicked nav link
    const activeLink = document.querySelector(`.nav-link[data-en="${activeSection.id.charAt(0).toUpperCase() + activeSection.id.slice(1)}"]`);
    activeLink.classList.add("active", "bg-black");

    // Store the active section in localStorage
    localStorage.setItem("activeSection", activeSection.id);
  }

  // When a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      
      const sectionId = link.dataset.en.toLowerCase();
      const activeSection = document.getElementById(sectionId);
      activateSection(activeSection);
    });
  });

  // Check if there's an active section stored in localStorage
  const savedSection = localStorage.getItem("activeSection");

  if (savedSection) {
    const activeSection = document.getElementById(savedSection);
    if (activeSection) {
      // Activate the saved section on page load
      activateSection(activeSection);
    }
  } else {
    // Default to service section if no section is saved
    activateSection(serviceSection);
  }

  // Handle logout by clearing localStorage and resetting to Service section
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", function () {
      // Clear localStorage when user logs out
      localStorage.removeItem("activeSection");

      // Reset to the Service section after logout
      activateSection(serviceSection);
    });
  }
});



document.addEventListener("DOMContentLoaded", function () {
    const languageSelect = document.getElementById("languageSelect");

    const savedLanguage = localStorage.getItem("language") || "en";
    const posting_description=document.getElementById("posting_description");
    languageSelect.value = savedLanguage;

    function switchLanguage() {
        const selectedLanguage = languageSelect.value;

        localStorage.setItem("language", selectedLanguage);

        const elements = document.querySelectorAll("[data-en]");
        // elements.forEach(function (element) {
        //     element.textContent = element.getAttribute(`data-${selectedLanguage}`);
        //     element.placeholder = element.getAttribute(`data-${selectedLanguage}`);
        // });
        elements.forEach(function (element) {
          const translation = element.getAttribute(`data-${selectedLanguage}`);
  
          if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
              element.placeholder = translation;
          } else {
              element.textContent = translation;
          }
      });
    }
    switchLanguage();

    languageSelect.addEventListener("change", function () {
        console.log("Language selected:", languageSelect.value);
        switchLanguage();
    });
});

document.addEventListener("DOMContentLoaded", function() {
  const imagePreview = document.getElementById("imagePreview");
  const imageUploadInput = document.getElementById("imageUploadInput");
  const uploadHint = document.getElementById("uploadHint");
  const imageError = document.getElementById("imageError");
  imageError.style.display="none";
  imagePreview.addEventListener("click", () => {
  imageUploadInput.click();
  });

  imageUploadInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
      if (file.size > 500 * 1024) {
          imageError.style.display = "inline-block";
          return;
      }
      imageError.style.display = "none"; 
      const reader = new FileReader();
      reader.onload = function(e) {
          imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
      window.uploadedImageFile = file;
  }
  });
});

function validatePhoneNumber() {
    const phoneInput = document.getElementById('phoneNumber');
    const phoneError = document.getElementById('phoneError');
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
    checkFormValidity(); 
}

const phoneInput = document.getElementById('phoneNumber');
phoneInput.addEventListener('blur', validatePhoneNumber);

function validateFullName() {
    const nameInput = document.getElementById('fullName');
    const fullNameError = document.getElementById('fullNameError');
    const fullName = nameInput.value;

    if (fullName.startsWith(" ")) {
        fullNameError.style.display = 'block'; 
        nameInput.classList.add('is-invalid'); 
        nameInput.classList.remove('is-valid'); 
    } else {
        fullNameError.style.display = 'none';
        nameInput.classList.remove('is-invalid'); 
        nameInput.classList.add('is-valid'); 
    }
    checkFormValidity(); 
}
document.getElementById('fullName').addEventListener('input', validateFullName);

function validateAddress() {
    const addressInput = document.getElementById('address1');
    const addressError = document.getElementById('addressError');
    const Address = addressInput.value;

    if (Address.startsWith(" ")) {
        addressError.style.display = 'block'; 
        addressInput.classList.add('is-invalid'); 
        addressInput.classList.remove('is-valid'); 
    } else {
        addressError.style.display = 'none';
        addressInput.classList.remove('is-invalid'); 
        addressInput.classList.add('is-valid'); 
    }
    checkFormValidity(); 
}
document.getElementById('address1').addEventListener('input', validateAddress);

function validateEmail() {
    const email = document.getElementById('email').value;
    const emailError = document.getElementById('emailError');
    const emailInput = document.getElementById('email');

    // Regular expression for validating email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Check if the email is valid
    if (emailRegex.test(email)) {
        emailError.style.display = 'none'; // Hide error if valid
        emailInput.classList.remove('is-invalid'); // Remove 'invalid' class
        emailInput.classList.add('is-valid'); // Add 'valid' class
    } else {
        emailError.style.display = 'block'; // Show error if invalid
        emailInput.classList.remove('is-valid'); // Remove 'valid' class
        emailInput.classList.add('is-invalid'); // Add 'invalid' class
    }
    checkFormValidity(); 
}
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', validateEmail);

$('.my-select').selectpicker();
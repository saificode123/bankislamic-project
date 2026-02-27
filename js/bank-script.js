// =========================================================================
// BANKISLAMI DIGITAL ONBOARDING - COMPLETE UNIFIED SCRIPT
// Features: Multi-step Navigation, Figma Tags, Inline Camera, Verification
// =========================================================================

// ==========================================
// 1. MULTI-STEP NAVIGATION & PROGRESS BAR LOGIC
// ==========================================
// Defined globally so inline onclick="goToStep(x)" works perfectly
window.goToStep = function(targetStepNumber) {
    // A. Hide all pages, then show the target page
    document.querySelectorAll('.step-page').forEach(page => {
        page.classList.remove('active-page');
        page.style.display = 'none'; // Force hide
    });
    
    const targetPage = document.getElementById(`page-${targetStepNumber}`);
    if (targetPage) {
        targetPage.classList.add('active-page');
        targetPage.style.display = 'block'; // Force show
    }

    // B. Update the Progress Indicator Colors & Lines
    const steps = document.querySelectorAll('.progress-step');
    
    steps.forEach((stepEl, index) => {
        const stepIndex = index + 1; // Array is 0-indexed, steps are 1-indexed
        const connector = stepEl.querySelector('.step-connector');
        const circle = stepEl.querySelector('.step-circle');

        // Clear all old color classes
        stepEl.classList.remove('completed', 'active', 'pending');
        if (connector) connector.classList.remove('completed', 'active', 'pending');
        if (circle) circle.classList.remove('completed', 'active', 'pending');

        // Apply new classes based on the current step
        if (stepIndex < targetStepNumber) {
            // PAST STEPS: Turn Green (Completed)
            stepEl.classList.add('completed');
            if (connector) connector.classList.add('completed');
            if (circle) circle.classList.add('completed');
            
        } else if (stepIndex === targetStepNumber) {
            // CURRENT STEP: Active (Gradient/White border)
            stepEl.classList.add('active');
            if (connector) connector.classList.add('active');
            if (circle) circle.classList.add('active');
            
        } else {
            // FUTURE STEPS: Pending (Faded Blue)
            stepEl.classList.add('pending');
            if (connector) connector.classList.add('pending');
            if (circle) circle.classList.add('pending');
        }
    });

    // ==========================================
    // INTERACTIVE MAP LOGIC (Leaflet.js)
    // ==========================================
    let branchMap;
    let mapMarker;

    // Define coordinates for branches (Latitude, Longitude)
    const branchCoordinates = {
        "Johar Chowrangi Branch, Karachi": [24.9132, 67.1309],
        "Tariq Road Branch, Karachi": [24.8736, 67.0592],
        "Clifton Branch, Karachi": [24.8197, 67.0270],
        "Blue Area Branch, Islamabad": [33.7144, 73.0649],
        "Gulberg Branch, Lahore": [31.5210, 74.3486],
        "default": [24.8607, 67.0011] // Default view: Karachi
    };

    function initInteractiveMap() {
        const mapDiv = document.getElementById('interactiveMap');
        if (!mapDiv) return;

        // Initialize map and set default view to Karachi
        branchMap = L.map('interactiveMap').setView(branchCoordinates['default'], 11);

        // Add free OpenStreetMap tiles (The visual map layer)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(branchMap);

        // Add the initial marker
        mapMarker = L.marker(branchCoordinates['default']).addTo(branchMap)
            .bindPopup('<b>BankIslami</b><br>Select a branch to see location.')
            .openPopup();
    }

    // Function to dynamically move the map when a branch is selected
    window.updateMapLocation = function(branchName) {
        if (!branchMap) return;
        
        // Find coordinates or default to Karachi if not found
        const coords = branchCoordinates[branchName] || branchCoordinates['default'];
        
        // Smoothly fly to the new branch location
        branchMap.flyTo(coords, 15, {
            animate: true,
            duration: 1.5
        });
        
        // Move the pin and update the text
        mapMarker.setLatLng(coords)
            .bindPopup(`<b>BankIslami</b><br>${branchName}`)
            .openPopup();
    };

    // Initialize the map when the page loads
    initInteractiveMap();

    // C. Update Mobile Header Text automatically
    const mobileStepText = document.getElementById('mobileStepText');
    if (mobileStepText && steps[targetStepNumber - 1]) {
        const activeLabel = steps[targetStepNumber - 1].querySelector('.step-label').textContent.trim();
        mobileStepText.textContent = `${targetStepNumber}/${steps.length}: ${activeLabel}`;
    }

    // D. Scroll user smoothly back to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


document.addEventListener('DOMContentLoaded', () => {

    // Initialize the progress bar to Step 1 when the page loads
    window.goToStep(1);

    // ==========================================
    // 2. CHECKBOX & MAIN 'NEXT' BUTTON LOGIC
    // ==========================================
    const check = document.getElementById('acknowledgeCheck');
    const nextBtn = document.getElementById('nextBtn');
    
    if (check && nextBtn) {
        // Enforce the initial disabled state based on checkbox
        nextBtn.disabled = !check.checked;
        
        // Listen for checkbox changes to enable/disable button
        check.addEventListener('change', (e) => {
            nextBtn.disabled = !e.target.checked;
        });

        // Make the Next button actually transition to Page 2
        nextBtn.addEventListener('click', () => {
            if (!nextBtn.disabled) {
                window.goToStep(2);
            }
        });
    }

    // ==========================================
    // 3. ACCOUNT TYPE SELECTION
    // ==========================================
    const accountButtons = document.querySelectorAll(".account-type-btn");
    const featuresBox = document.getElementById("accountFeaturesBox");

    const accountFeatures = {
        "islami-asaan-digital-current": ["Free - Cheque-Book will be provided", "Free - Internet facility", "Free - SMS Alerts facility", "Free - Mobile Banking app", "Free - E-Statement service"],
        "islami-asaan-digital-savings": ["Profit calculated monthly", "ATM card facility", "Internet & Mobile banking", "SMS Alerts (on request)"],
        "islami-asaan-digital-sahulat": ["No minimum balance required", "ATM Debit Card available", "SMS Alerts", "E-Statement service"],
        "islami-bachat": ["Monthly profit", "SMS alerts", "Cheque Book facility", "E-Statement"],
        "islami-sahulat": ["No charges on account opening", "ATM facility", "SMS Alerts", "Free Internet Banking"],
        "islami-premium-saving": ["Special saving profit rates", "Free SMS alerts", "Internet Banking", "Mobile App"],
        "islami-current": ["Cheque book", "Internet banking", "SMS alerts", "Debit card facility"],
        "islami-asaan-digital-remittance": ["Remittance-friendly account", "Free SMS Alerts", "Free Mobile Banking", "Easy withdrawal options"],
        "islami-asaan-digital-remittance-2": ["Easy Remittance", "Low charges", "Mobile App", "SMS Alerts"],
        "islami-freelancer-digital": ["Freelancer Incoming Payments", "Instant Debit Card", "Internet Banking", "Free SMS Alerts"],
        "islami-mashal-asaan-remunerative": ["High remunerative benefits", "Internet banking", "SMS Alerts", "Cheque Book"]
    };

    accountButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            accountButtons.forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            const list = accountFeatures[btn.dataset.account];
            if (featuresBox && list) {
                featuresBox.innerHTML = list.map(item => `
                    <div class="feature-item">
                        <span class="checkmark"><img src="assets/check-2.png" class="feature-checkmark-icon" alt=""></span>
                        <span>${item}</span>
                    </div>
                `).join("");
            }
        });
    });

    const goWithAccount = document.getElementById('goWithSelectedAccountBtn');
    if (goWithAccount) {
        goWithAccount.onclick = () => {
            const next = document.querySelector('.city-select-section');
            if (next) next.scrollIntoView({ behavior: 'smooth' });
        };
    }

    // ==========================================
    // 4. AUTOCOMPLETE & FIGMA MULTI-SELECT TAGS
    // ==========================================
    const pakistanCities = [
        "Abbottabad", "Attock", "Bahawalpur", "Bannu", "Bhakkar", "Burewala", "Chaman", "Charsadda", "Chiniot", "Chishtian", 
        "Chitral", "Dadu", "Daska", "Dera Ghazi Khan", "Dera Ismail Khan", "Faisalabad", "Ghotki", "Gojra", "Gujranwala", "Gujrat", 
        "Gwadar", "Hafizabad", "Haripur", "Hub", "Hyderabad", "Islamabad", "Jacobabad", "Jhang", "Jhelum", "Kamalia", "Kamoke", 
        "Karachi", "Kasur", "Khairpur", "Khanewal", "Khanpur", "Khushab", "Khuzdar", "Kohat", "Kot Adu", "Kotli", "Lahore", "Larkana", 
        "Mandi Bahauddin", "Mansehra", "Mardan", "Mianwali", "Mingora", "Mirpur", "Mirpur Khas", "Multan", "Muridke", "Muzaffarabad", 
        "Muzaffargarh", "Nawabshah", "Nowshera", "Okara", "Pakpattan", "Peshawar", "Quetta", "Rahim Yar Khan", "Rawalpindi", 
        "Sadiqabad", "Sahiwal", "Sargodha", "Sheikhupura", "Shikarpur", "Sialkot", "Skardu", "Sukkur", "Swabi", "Vehari", "Wah Cantonment"
    ];

    const bankIslamiBranches = [
        "Johar Chowrangi Branch, Karachi", "Tariq Road Branch, Karachi", "Clifton Branch, Karachi", "DHA Phase 4 Branch, Karachi", 
        "Saddar Branch, Karachi", "Shahrah-e-Faisal Branch, Karachi", "Gulshan-e-Iqbal Branch, Karachi", "North Nazimabad Branch, Karachi", 
        "Blue Area Branch, Islamabad", "F-8 Markaz Branch, Islamabad", "F-11 Markaz Branch, Islamabad", "G-9 Markaz Branch, Islamabad", 
        "Main Boulevard Gulberg Branch, Lahore", "DHA Phase 5 Branch, Lahore", "Johar Town Branch, Lahore", "WAPDA Town Branch, Lahore", 
        "Saddar Branch, Rawalpindi", "Bahria Town Branch, Rawalpindi", "Kotwali Road Branch, Faisalabad", "Abdali Road Branch, Multan", 
        "Auto Bhan Road Branch, Hyderabad", "University Road Branch, Peshawar", "Jinnah Road Branch, Quetta", "Military Road Branch, Sukkur"
    ];

    function setupAutocomplete(inputId, dropdownId, wrapperSelector, dataList, tagClass, type) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        const wrapper = input ? input.closest(wrapperSelector) : null;

        if (!input || !dropdown || !wrapper) return;

        // Dynamic typing filter
        input.addEventListener('input', function() {
            const val = this.value.trim();
            dropdown.innerHTML = ''; 
            if (!val) { dropdown.style.display = 'none'; return; }

            const matches = dataList.filter(item => item.toLowerCase().includes(val.toLowerCase())).slice(0, 15);
            
            if (matches.length > 0) {
                matches.forEach(match => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'city-dropdown-item';
                    
                    // Highlight the typed text & add the Figma '+' icon
                    const regex = new RegExp(`(${val})`, 'gi');
                    const highlightedText = match.replace(regex, "<strong style='color: #3ED1A6;'>$1</strong>");
                    itemDiv.innerHTML = `<span>${highlightedText}</span> <span class="dropdown-add-icon">+</span>`;

                    // Handle selection
                    itemDiv.addEventListener('click', function() {
                        addTagWithPrefix(wrapper, input, match, tagClass, type);
                        dropdown.style.display = 'none';
                        input.value = ''; // Clear input field after selection
                        input.focus(); // Keep cursor in the box
                    });
                    dropdown.appendChild(itemDiv);
                });
                dropdown.style.display = 'block';
            } else {
                dropdown.innerHTML = '<div class="city-dropdown-item" style="color:rgba(255,255,255,0.5)">No results</div>';
                dropdown.style.display = 'block';
            }
        });

        // Re-open dropdown if input is focused and has text
        input.addEventListener('focus', function() {
            if (this.value.trim()) input.dispatchEvent(new Event('input'));
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== input && e.target !== dropdown) dropdown.style.display = 'none';
        });
    }

    function addTagWithPrefix(wrapper, inputElement, text, tagClass, type) {
        // Prevent duplicate tags
        const existingTags = Array.from(wrapper.querySelectorAll('.city-tag-label')).map(el => el.textContent);
        if(existingTags.includes(text)) return;

        // Create a flex container to hold the Prefix Text and the Blue Pill
        const tagGroup = document.createElement('div');
        tagGroup.style.display = 'inline-flex';
        tagGroup.style.alignItems = 'center';
        tagGroup.style.gap = '10px';
        tagGroup.className = 'selected-tag-group';

        // Format the Prefix exactly like Figma (Kar | OR Johar Chorangi | )
        let prefixText = "";
        if (type === 'city') {
            prefixText = text.substring(0, 3) + " |"; // First 3 letters
        } else if (type === 'branch') {
            let bName = text.split(',')[0].trim(); // Removes City Name
            if(bName.toLowerCase().endsWith(' branch')) {
                bName = bName.substring(0, bName.length - 7); // Removes " Branch"
            }
            prefixText = bName + " |";
        }

        // Add the plain text Prefix
        const prefixSpan = document.createElement('span');
        prefixSpan.style.color = 'rgba(255, 255, 255, 0.7)';
        prefixSpan.style.fontSize = '16px';
        prefixSpan.style.fontFamily = "'Inter', Arial, sans-serif";
        prefixSpan.textContent = prefixText;

        // Add the Blue Tag Pill
        const tagSpan = document.createElement('span');
        tagSpan.className = tagClass;
        
        // Exact Figma styling: Pill with text and green '×' circle
        tagSpan.innerHTML = `
            <span class="city-tag-label">${text}</span>
            <button type="button" class="city-tag-action" style="font-weight: bold;">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        `;
        
        // Remove tag function
        tagSpan.querySelector('button').onclick = () => {
            tagGroup.remove(); // Removes both the tag and its prefix text
            // Restore placeholder if all tags are removed
            if(wrapper.querySelectorAll('.' + tagClass).length === 0) {
                inputElement.placeholder = inputElement.dataset.placeholder;
            }
        };
        
        tagGroup.appendChild(prefixSpan);
        tagGroup.appendChild(tagSpan);

        // Hide placeholder when tags are present to keep it clean
        if(!inputElement.dataset.placeholder) {
            inputElement.dataset.placeholder = inputElement.placeholder;
        }
        inputElement.placeholder = ''; 
        
        // Insert the group BEFORE the input cursor so it pushes the typing text to the right
        wrapper.insertBefore(tagGroup, inputElement);

        // Inside addTagWithPrefix function, right at the bottom add:
    if (type === 'branch') {
        window.updateMapLocation(text);
    }
    }

    // Initialize the logic for City and Branch
    setupAutocomplete('cityTagInput', 'cityDropdown', '.city-tag-input-wrapper', pakistanCities, 'city-tag', 'city');
    setupAutocomplete('branchTagInput', 'branchDropdown', '.branch-tag-input-wrapper', bankIslamiBranches, 'branch-tag', 'branch');

    // ==========================================
    // 5. INLINE CAMERA LOGIC
    // ==========================================
    const openCamBtn = document.getElementById('openCameraBtnMain') || document.getElementById('openCameraBtn');
    const capturePhotoBtn = document.getElementById('capturePhotoBtnMain') || document.getElementById('capturePhotoBtn');
    const liveVideo = document.getElementById('inlineVideo') || document.getElementById('liveVideo');
    const livePhotoPreviewImg = document.getElementById('inlinePhotoPreview') || document.getElementById('livePhotoPreviewImg');
    const inlineCanvas = document.getElementById('inlineCanvas') || document.createElement('canvas');
    let stream = null;

    if (openCamBtn && liveVideo) {
        openCamBtn.onclick = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                liveVideo.srcObject = stream;
                liveVideo.style.display = 'block';
                livePhotoPreviewImg.style.display = 'none';
            } catch (e) { alert('Camera access denied. Please check permissions.'); }
        };
    }

    if (capturePhotoBtn && liveVideo) {
        capturePhotoBtn.onclick = () => {
            if (!stream) return alert("Please click 'Open Camera' first.");
            const ctx = inlineCanvas.getContext('2d');
            inlineCanvas.width = liveVideo.videoWidth || 640;
            inlineCanvas.height = liveVideo.videoHeight || 480;
            ctx.drawImage(liveVideo, 0, 0);
            livePhotoPreviewImg.src = inlineCanvas.toDataURL('image/png');
            livePhotoPreviewImg.style.display = 'block';
            liveVideo.style.display = 'none';
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        };
    }

    // ==========================================
    // 6. CNIC UPLOADS & DATE OF BIRTH
    // ==========================================
    function handleUpload(id, preview) {
        const input = document.getElementById(id);
        const circle = document.querySelector(preview);
        if (input && circle) {
            input.onchange = (e) => {
                if(e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => circle.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
                    reader.readAsDataURL(e.target.files[0]);
                }
            };
        }
    }
    handleUpload('cnicFront', 'label[for="cnicFront"] .cnic-upload-icon');
    handleUpload('cnicBack', 'label[for="cnicBack"] .cnic-upload-icon');

    const dob = document.getElementById('dateOfBirth');
    const dobWrapper = document.querySelector('.date-of-birth-input-wrapper');
    if (dob && dobWrapper) {
        dobWrapper.onclick = () => { if(dob.showPicker) dob.showPicker(); };
        dob.onchange = (e) => {
            const age = new Date().getFullYear() - new Date(e.target.value).getFullYear();
            if (age < 18) { alert('You must be at least 18 years old.'); e.target.value = ''; }
        };
    }
});
// NOTE: goToStep and nextBtn wiring are handled above inside window.goToStep and DOMContentLoaded.

// Account Type Selection
document.addEventListener('DOMContentLoaded', () => {
    // Mobile header: keep step text in sync with active progress step
    function updateMobileStepText() {
        const mobileStepText = document.getElementById('mobileStepText');
        const steps = document.querySelectorAll('.progress-step');
        const activeStep = document.querySelector('.progress-step.active');
        if (mobileStepText && steps.length && activeStep) {
            const stepNum = Array.from(steps).indexOf(activeStep) + 1;
            const label = activeStep.querySelector('.step-label');
            const labelText = label ? label.textContent.trim() : '';
            mobileStepText.textContent = stepNum + '/' + steps.length + ': ' + labelText;
        }
    }
    updateMobileStepText();

    const accountTypeButtons = document.querySelectorAll('.account-type-btn');

    accountTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from all buttons
            accountTypeButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            // Add selected class to clicked button
            button.classList.add('selected');
        });
    });

    // Currency selection
    const currencyButtons = document.querySelectorAll('.currency-btn');
    currencyButtons.forEach(button => {
        button.addEventListener('click', () => {
            currencyButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // City tag input: resize width so separator + tag stay left-aligned after typed text
    const cityTagInput = document.getElementById('cityTagInput');
    if (cityTagInput) {
        function resizeCityInput() {
            const len = Math.max((cityTagInput.value || '').length, 1);
            cityTagInput.style.width = len + 1 + 'ch';
        }
        resizeCityInput();
        cityTagInput.addEventListener('input', resizeCityInput);
        cityTagInput.addEventListener('focus', resizeCityInput);
    }

    const branchTagInput = document.getElementById('branchTagInput');
    if (branchTagInput) {
        function resizeBranchInput() {
            const len = Math.max((branchTagInput.value || '').length, 1);
            branchTagInput.style.width = len + 1 + 'ch';
        }
        resizeBranchInput();
        branchTagInput.addEventListener('input', resizeBranchInput);
        branchTagInput.addEventListener('focus', resizeBranchInput);
    }

    // Go with selected account button
    const goWithAccountBtn = document.getElementById('goWithAccount');
    if (goWithAccountBtn) {
        goWithAccountBtn.addEventListener('click', () => {
            const selectedAccount = document.querySelector('.account-type-btn.selected');
            if (selectedAccount) {
                alert(`Proceeding with: ${selectedAccount.querySelector('.account-name').textContent}`);
                // Scroll to next section
                document.querySelector('.form-section:nth-of-type(2)').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // City and Branch Selection
    const citySelect = document.getElementById('citySelect');
    const branchSelect = document.getElementById('branchSelect');
    const branchMap = document.getElementById('branchMap');

    // Update branch options based on city
    const branchOptions = {
        karachi: [
            { value: 'junaid-chorangi', text: 'Junaid Chorangi | Junaid Chorangi Branch' },
            { value: 'jinnah-road', text: 'Jinnah Road Branch' },
            { value: 'gulshan', text: 'Gulshan Branch' },
            { value: 'clifton', text: 'Clifton Branch' }
        ],
        lahore: [
            { value: 'mall-road', text: 'Mall Road Branch' },
            { value: 'defence', text: 'Defence Branch' },
            { value: 'model-town', text: 'Model Town Branch' }
        ],
        islamabad: [
            { value: 'f-7', text: 'F-7 Markaz Branch' },
            { value: 'blue-area', text: 'Blue Area Branch' }
        ],
        faisalabad: [
            { value: 'd-ground', text: 'D-Ground Branch' }
        ],
        rawalpindi: [
            { value: 'saddar', text: 'Saddar Branch' }
        ]
    };

    citySelect.addEventListener('change', (e) => {
        const selectedCity = e.target.value;
        branchSelect.innerHTML = '';

        if (branchOptions[selectedCity]) {
            branchOptions[selectedCity].forEach(branch => {
                const option = document.createElement('option');
                option.value = branch.value;
                option.textContent = branch.text;
                branchSelect.appendChild(option);
            });
        }
        updateMap();
    });

    branchSelect.addEventListener('change', () => {
        updateMap();
    });

    function updateMap() {
        const selectedBranch = branchSelect.options[branchSelect.selectedIndex].text;
        branchMap.innerHTML = `
            <p>Map view of selected branch location</p>
            <div class="map-marker">📍</div>
            <p style="margin-top: 20px; font-size: 14px;">${selectedBranch}</p>
        `;
    }

    // Initialize map
    updateMap();

    // File Upload Handlers
    const cnicFrontInput = document.getElementById('cnicFront');
    const cnicBackInput = document.getElementById('cnicBack');
    const livePictureInput = document.getElementById('livePicture');
    const cnicFrontPreview = document.getElementById('cnicFrontPreview');
    const cnicBackPreview = document.getElementById('cnicBackPreview');
    const livePicturePreview = document.getElementById('livePicturePreview');

    function handleFileUpload(input, preview) {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        preview.innerHTML = `<img src="${event.target.result}" alt="Uploaded image">`;
                        preview.classList.add('has-image');
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please upload an image file');
                }
            }
        });
    }

    handleFileUpload(cnicFrontInput, cnicFrontPreview);
    handleFileUpload(cnicBackInput, cnicBackPreview);
    handleFileUpload(livePictureInput, livePicturePreview);

    // Camera Modal
    const cameraModal = document.getElementById('cameraModal');
    const openCameraBtn = document.getElementById('openCamera');
    const captureBtn = document.getElementById('captureBtn');
    const closeCameraModal = document.getElementById('closeCameraModal');
    const capturePhotoBtn = document.getElementById('capturePhoto');
    const videoElement = document.getElementById('videoElement');
    const canvasElement = document.getElementById('canvasElement');
    let stream = null;

    // Open camera modal
    if (capturePhotoBtn) {
        capturePhotoBtn.addEventListener('click', () => {
            cameraModal.classList.add('active');
        });
    }

    // Open camera
    if (openCameraBtn) {
        openCameraBtn.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });
                videoElement.srcObject = stream;
                openCameraBtn.style.display = 'none';
                captureBtn.style.display = 'block';
            } catch (error) {
                console.error('Error accessing camera:', error);
                alert('Unable to access camera. Please check permissions or use file upload instead.');
            }
        });
    }

    // Capture photo
    if (captureBtn) {
        captureBtn.addEventListener('click', () => {
            const context = canvasElement.getContext('2d');
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            context.drawImage(videoElement, 0, 0);

            // Convert to image
            const imageData = canvasElement.toDataURL('image/png');
            livePicturePreview.innerHTML = `<img src="${imageData}" alt="Captured photo">`;
            livePicturePreview.classList.add('has-image');

            // Stop camera
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // Close modal
            cameraModal.classList.remove('active');
            openCameraBtn.style.display = 'block';
            captureBtn.style.display = 'none';
        });
    }

    // Close camera modal
    if (closeCameraModal) {
        closeCameraModal.addEventListener('click', () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            cameraModal.classList.remove('active');
            openCameraBtn.style.display = 'block';
            captureBtn.style.display = 'none';
        });
    }

    // Close modal on outside click
    cameraModal.addEventListener('click', (e) => {
        if (e.target === cameraModal) {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            cameraModal.classList.remove('active');
            openCameraBtn.style.display = 'block';
            captureBtn.style.display = 'none';
        }
    });

    // Acknowledgment Checkbox
    const acknowledgeCheck = document.getElementById('acknowledgeCheck');
    const nextBtn = document.getElementById('nextBtn');

    if (acknowledgeCheck && nextBtn) {
        acknowledgeCheck.addEventListener('change', (e) => {
            nextBtn.disabled = !e.target.checked;
        });
    }

    // Form Validation and Next Button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Validate form
            const monthlyIncome = document.getElementById('monthlyIncome').value;
            const fundsProvider = document.getElementById('fundsProvider').value;
            const dateOfBirth = document.getElementById('dateOfBirth').value;
            const hasCnicFront = cnicFrontPreview.classList.contains('has-image');
            const hasCnicBack = cnicBackPreview.classList.contains('has-image');
            const hasLivePicture = livePicturePreview.classList.contains('has-image');

            let errors = [];

            if (!monthlyIncome) {
                errors.push('Monthly income is required');
            }
            if (!fundsProvider) {
                errors.push('Funds provider name is required');
            }
            if (!dateOfBirth) {
                errors.push('Date of birth is required');
            }
            if (!hasCnicFront) {
                errors.push('CNIC front image is required');
            }
            if (!hasCnicBack) {
                errors.push('CNIC back image is required');
            }
            if (!hasLivePicture) {
                errors.push('Live picture is required');
            }

            if (errors.length > 0) {
                alert('Please complete all required fields:\n' + errors.join('\n'));
            } else {
                alert('Form submitted successfully! (This is a demo)');
                // Here you would typically submit the form data to a server
            }
        });
    }

    // --- Date of Birth Handlers ---
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    const dobWrapper = document.querySelector('.date-of-birth-input-wrapper');

    if (dateOfBirthInput) {
        // 1. Agar icon pe click ho toh input trigger karein
        dobWrapper.addEventListener('click', () => {
            dateOfBirthInput.showPicker(); // modern browsers ke liye native picker open karta hai
        });

        // 2. Validation: Age must be 18+
        dateOfBirthInput.addEventListener('change', (e) => {
            const birthDate = new Date(e.target.value);
            const today = new Date();

            // Age calculation logic
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 18) {
                alert('Aapki umar 18 saal se kam hai. Account kholnay ke liye 18+ hona zaroori hai.');
                e.target.value = ''; // Input clear kar dein
            } else {
                console.log("Age verified: " + age);

            }
        });
    }

    // Smooth scroll for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log('BankIslami Digital Onboarding form loaded successfully!');
});




const cityInput = document.getElementById("cityTagInput");
const dropdown = document.getElementById("cityDropdown");
const selectedCity = document.getElementById("selectedCityLabel");

let pakistanCities = [];

// 1️⃣ Load Pakistan cities properly
fetch("https://countriesnow.space/api/v0.1/countries")
    .then(res => res.json())
    .then(data => {
        const pak = data.data.find(c => c.country === "Pakistan");
        pakistanCities = pak ? pak.cities : [];

        console.log("Pakistan Cities Loaded:", pakistanCities); // Debug
    })
    .catch(error => console.error("City API Error:", error));


// 2️⃣ Show dropdown while typing
cityInput.addEventListener("input", () => {
    const val = cityInput.value.toLowerCase();
    dropdown.innerHTML = "";

    if (!val) {
        dropdown.style.display = "none";
        return;
    }

    // Filter Pakistan cities
    const filtered = pakistanCities.filter(city =>
        city.toLowerCase().includes(val)
    );

    if (filtered.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    // Show filtered results
    filtered.forEach(city => {
        const item = document.createElement("div");
        item.className = "city-dropdown-item";
        item.textContent = city;

        item.onclick = () => {
            cityInput.value = city;
            selectedCity.textContent = city;
            dropdown.style.display = "none";
        };

        dropdown.appendChild(item);
    });

    dropdown.style.display = "block";
});


// 3️⃣ Click outside closes dropdown
document.addEventListener("click", (e) => {
    if (!e.target.closest(".city-tag-input-wrapper")) {
        dropdown.style.display = "none";
    }
});






cityInput.addEventListener("input", () => {
    const val = cityInput.value.toLowerCase();
    dropdown.innerHTML = "";

    if (!val) {
        dropdown.style.display = "none";
        return;
    }

    const filtered = pakistanCities.filter(city =>
        city.toLowerCase().includes(val)
    );

    if (filtered.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    filtered.forEach(city => {
        const item = document.createElement("div");
        item.className = "city-dropdown-item";
        item.textContent = city;

        item.onclick = () => {
            cityInput.value = city;
            selectedCity.textContent = city;
            dropdown.style.display = "none";
        };

        dropdown.appendChild(item);
    });

    dropdown.style.display = "block";
});





// SELECT ALL BUTTONS
const accountButtons = document.querySelectorAll(".account-type-btn");

// FEATURE BOX
const featuresBox = document.getElementById("accountFeaturesBox");

// MAP OF FEATURES FOR EACH ACCOUNT
const accountFeatures = {
    "islami-asaan-digital-current": [
        "Free - Cheque-Book will be provided",
        "Free - Internet facility",
        "Free - SMS Alerts facility",
        "Free - Mobile Banking app",
        "Free - E-Statement service"
    ],
    "islami-asaan-digital-savings": [
        "Profit calculated monthly",
        "ATM card facility",
        "Internet & Mobile banking",
        "SMS Alerts (on request)"
    ],
    "islami-asaan-digital-sahulat": [
        "No minimum balance required",
        "ATM Debit Card available",
        "SMS Alerts",
        "E-Statement service"
    ],
    "islami-bachat": [
        "Monthly profit",
        "SMS alerts",
        "Cheque Book facility",
        "E-Statement"
    ],
    "islami-sahulat": [
        "No charges on account opening",
        "ATM facility",
        "SMS Alerts",
        "Free Internet Banking"
    ],
    "islami-premium-saving": [
        "Special saving profit rates",
        "Free SMS alerts",
        "Internet Banking",
        "Mobile App"
    ],
    "islami-current": [
        "Cheque book",
        "Internet banking",
        "SMS alerts",
        "Debit card facility"
    ],
    "islami-asaan-digital-remittance": [
        "Remittance-friendly account",
        "Free SMS Alerts",
        "Free Mobile Banking",
        "Easy withdrawal options"
    ],
    "islami-asaan-digital-remittance-2": [
        "Easy Remittance",
        "Low charges",
        "Mobile App",
        "SMS Alerts"
    ],
    "islami-freelancer-digital": [
        "Freelancer Incoming Payments",
        "Instant Debit Card",
        "Internet Banking",
        "Free SMS Alerts"
    ],
    "islami-mashal-asaan-remunerative": [
        "High remunerative benefits",
        "Internet banking",
        "SMS Alerts",
        "Cheque Book"
    ]
};


// HANDLE BUTTON CLICK
accountButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // 1️⃣ Remove "selected" class from all
        accountButtons.forEach(b => b.classList.remove("selected"));

        // 2️⃣ Add "selected" to clicked one
        btn.classList.add("selected");

        // 3️⃣ Get account ID
        const accID = btn.dataset.account;

        // 4️⃣ Get that account's features
        const list = accountFeatures[accID];

        // 5️⃣ Build new HTML for features
        featuresBox.innerHTML = list.map(item => `
            <div class="feature-item">
                <span class="checkmark">
                    <img src="assets/check-2.png" class="feature-checkmark-icon" alt="">
                </span>
                <span>${item}</span>
            </div>
        `).join("");

    });
});







const branchInput = document.getElementById("branchTagInput");
const branchDropdown = document.getElementById("branchDropdown");
const selectedBranchLabel = document.getElementById("selectedBranchLabel");
const branchMapImg = document.getElementById("branchMapImg");

// Branches list (replace with real branch names + map images if you have)
const branches = [
    { name: "Johar Chorangi Branch", map: "assets/map.png" },
    { name: "Gulshan-e-Iqbal Branch", map: "assets/map.png" },
    { name: "Clifton Branch", map: "assets/map.png" },
    { name: "PECHS Branch", map: "assets/map.png" },
    { name: "Model Town Branch", map: "assets/map.png" },
    { name: "F-7 Markaz Branch", map: "assets/map.png" }
];

// Input typing
branchInput.addEventListener("input", () => {
    const val = branchInput.value.toLowerCase();
    branchDropdown.innerHTML = "";

    if (!val) {
        branchDropdown.style.display = "none";
        return;
    }

    const filtered = branches.filter(b => b.name.toLowerCase().includes(val));

    if (filtered.length === 0) {
        branchDropdown.style.display = "none";
        return;
    }

    filtered.forEach(branch => {
        const item = document.createElement("div");
        item.className = "city-dropdown-item";
        item.textContent = branch.name;

        item.onclick = () => {
            branchInput.value = branch.name;
            selectedBranchLabel.textContent = branch.name;

            // Map update
            branchMapImg.src = branch.map;

            branchDropdown.style.display = "none";
        };

        branchDropdown.appendChild(item);
    });

    branchDropdown.style.display = "block";
});

// Click outside to close dropdown
document.addEventListener("click", (e) => {
    if (!e.target.closest(".branch-tag-input-wrapper")) {
        branchDropdown.style.display = "none";
    }
});


















/* ================================
   Simple Google-like Search Dropdown
   Perfect for City Selection
================================== */

(function () {

    const cityInput = document.getElementById("cityTagInput");
    const cityDropdown = document.getElementById("cityDropdown");
    
    // Complete list of Pakistani cities
    const citiesList = [
        "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpur Khas",
        "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot",
        "Bahawalpur", "Sargodha", "Sheikhupura", "Rahim Yar Khan", "Jhang",
        "Peshawar", "Mardan", "Abbottabad", "Mingora", "Kohat", "Bannu",
        "Quetta", "Turbat", "Khuzdar", "Chaman", "Gwadar",
        "Islamabad", "Kamoke", "Kamokey", "Kamchar",
        "Muzaffarabad", "Mirpur", "Gilgit", "Skardu"
    ];

    // Store selected cities
    let selectedCities = [];

    if (cityInput && cityDropdown) {

        // Search function - shows results as you type
        cityInput.addEventListener("input", function (e) {
            const searchText = e.target.value.toLowerCase().trim();
            
            if (searchText === "") {
                cityDropdown.style.display = "none";
                return;
            }

            // Filter cities
            const matchedCities = citiesList.filter(city => 
                city.toLowerCase().includes(searchText)
            ).slice(0, 5); // Only top 5 results

            // Create dropdown
            if (matchedCities.length > 0) {
                cityDropdown.innerHTML = matchedCities.map(city => {
                    const isSelected = selectedCities.includes(city);
                    return `
                        <div class="city-item" data-city="${city}">
                            ${city} ${isSelected ? '✓' : ''}
                        </div>
                    `;
                }).join('');
                cityDropdown.style.display = "block";
            } else {
                cityDropdown.innerHTML = '<div class="city-item no-result">No cities found</div>';
                cityDropdown.style.display = "block";
            }
        });

        // Click on item to select
        cityDropdown.addEventListener("click", function (e) {
            const item = e.target.closest('.city-item');
            if (item && !item.classList.contains('no-result')) {
                const cityName = item.dataset.city;
                
                // Toggle selection (add if not already selected)
                if (!selectedCities.includes(cityName)) {
                    selectedCities.push(cityName);
                } else {
                    // Optional: Remove if already selected (uncomment if you want this feature)
                    // selectedCities = selectedCities.filter(c => c !== cityName);
                }
                
                // Update input field with selected cities (comma separated)
                cityInput.value = selectedCities.join(', ');
                
                // Close dropdown after selection
                cityDropdown.style.display = "none";
                
                // Clear input text for next search
                // cityInput.value = ''; // Uncomment if you want to clear after selection
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function (e) {
            if (!cityInput.contains(e.target) && !cityDropdown.contains(e.target)) {
                cityDropdown.style.display = "none";
            }
        });

        // Enter key selects first item
        cityInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                const firstItem = cityDropdown.querySelector('.city-item:not(.no-result)');
                if (firstItem) {
                    firstItem.click();
                }
            }
        });

        // Show dropdown on focus if there's text
        cityInput.addEventListener("focus", function () {
            if (cityInput.value.length > 0) {
                const searchText = cityInput.value.toLowerCase().trim();
                const matchedCities = citiesList.filter(city => 
                    city.toLowerCase().includes(searchText)
                ).slice(0, 5);
                
                if (matchedCities.length > 0) {
                    cityDropdown.innerHTML = matchedCities.map(city => {
                        const isSelected = selectedCities.includes(city);
                        return `
                            <div class="city-item" data-city="${city}">
                                ${city} ${isSelected ? '✓' : ''}
                            </div>
                        `;
                    }).join('');
                    cityDropdown.style.display = "block";
                }
            }
        });

        // Add clean styles with black text
        const style = document.createElement('style');
        style.textContent = `
            #cityDropdown {
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                max-height: 200px;
                overflow-y: auto;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                position: absolute;
                width: 100%;
                z-index: 1000;
            }
            .city-item {
                padding: 10px 15px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
                color: #000000;  /* Black text color */
                font-size: 14px;
                font-family: Arial, sans-serif;
            }
            .city-item:last-child {
                border-bottom: none;
            }
            .city-item:hover {
                background: #f5f5f5;
                color: #000000;  /* Keep black on hover */
            }
            .no-result {
                color: #666666;  /* Dark gray for no results */
                font-style: italic;
                background: #fafafa;
            }
            .no-result:hover {
                background: #fafafa;
                color: #666666;
            }
        `;
        document.head.appendChild(style);

        // Optional: Add wrapper for absolute positioning if needed
        if (cityDropdown.style.position !== 'absolute') {
            cityDropdown.style.position = 'absolute';
        }
    }

})();
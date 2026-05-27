// CivicLens AI / NammaFix - Connected Client Core Javascript

// --- PERSISTENT STATE ENGINE ---
let complaintsDB = [
  {
    id: 1001,
    title: "Sewer Overflow & Drainage Blockage",
    description: "Sewage water overflow is flooding the main road street corners, causing immense bad odor and breeding mosquitoes. Kids are unable to walk to the local bus stop.",
    category: "drainage_blockage",
    reported_by: "Sugantharaj T",
    reporter_uid: "citizen_1",
    latitude: 11.0180,
    longitude: 76.9640,
    address: "Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012",
    landmarks: "Opposite Joyalukkas Jewellers",
    before_image_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
    after_image_url: null,
    severity_score: 8,
    priority_score: 135,
    status: "in_progress",
    is_duplicate: false,
    parent_complaint_id: null,
    is_emergency: true,
    assigned_department: "Storm Water & Drainage Board",
    assigned_worker_id: "Worker-Drain-Kovai-04",
    reported_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    votes: ["citizen_2", "citizen_3"],
    timeline: [
      { officer: "System Auto-Router", comment: "Auto-routed to Storm Water & Drainage Board based on YOLO classification.", date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
      { officer: "K. Balakrishnan, Assistant Engineer", comment: "Site inspected. Drainage pump dispatch request sent. Cleansing will start tomorrow early morning.", date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 1002,
    title: "Massive Pothole Crater on Gandhipuram Flyover",
    description: "Extremely deep pothole that can easily throw off 2-wheeler riders during night time. Highly hazardous. It is located exactly near the ramp down of the flyover.",
    category: "pothole",
    reported_by: "Kavin Kumar",
    reporter_uid: "citizen_2",
    latitude: 11.0168,
    longitude: 76.9558,
    address: "Avinashi Road, Gandhipuram, Coimbatore, Tamil Nadu 641012",
    landmarks: "Near Gandhipuram Flyover",
    before_image_url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
    after_image_url: null,
    severity_score: 9,
    priority_score: 185,
    status: "reported",
    is_duplicate: false,
    parent_complaint_id: null,
    is_emergency: true,
    assigned_department: "Roads & Highways Department",
    assigned_worker_id: null,
    reported_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    votes: ["citizen_1"],
    timeline: [
      { officer: "System Auto-Router", comment: "Auto-routed to Roads & Highways Department based on YOLO defect classification. Marked EMERGENCY due to critical depth and location.", date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 1003,
    title: "Illegal Garbage Dumping Yard",
    description: "Unauthorized plastic and organic waste heaps piled up over the walking lane. Stinks horribly. Pedestrians are forced to walk on the high-speed vehicle lanes.",
    category: "garbage_dumping",
    reported_by: "Priya Sharma",
    reporter_uid: "citizen_3",
    latitude: 11.0264,
    longitude: 77.0012,
    address: "Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004",
    landmarks: "Next to Nilgiris Supermarket",
    before_image_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
    after_image_url: null,
    severity_score: 6,
    priority_score: 72,
    status: "reported",
    is_duplicate: false,
    parent_complaint_id: null,
    is_emergency: false,
    assigned_department: "Sanitation & Solid Waste Department",
    assigned_worker_id: null,
    reported_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    votes: [],
    timeline: [
      { officer: "System Auto-Router", comment: "Auto-routed to Sanitation & Solid Waste Department based on YOLO image detection.", date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 1004,
    title: "Broken Streetlights Near School",
    description: "Entire stretch of streetlights are inactive since 3 days, making the road pitch black and unsafe for children during evening tutorials.",
    category: "broken_streetlight",
    reported_by: "Sugantharaj T",
    reporter_uid: "citizen_1",
    latitude: 11.0115,
    longitude: 76.9460,
    address: "DB Road, RS Puram, Coimbatore, Tamil Nadu 641002",
    landmarks: "Opposite RS Puram Secondary School",
    before_image_url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80",
    after_image_url: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80",
    severity_score: 5,
    priority_score: 110,
    status: "resolved",
    is_duplicate: false,
    parent_complaint_id: null,
    is_emergency: false,
    assigned_department: "Electricity & Public Lighting Department",
    assigned_worker_id: "Worker-Electric-08",
    reported_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    votes: ["citizen_2", "citizen_3", "officer_1"],
    timeline: [
      { officer: "System Auto-Router", comment: "Auto-routed to Electricity & Public Lighting Department.", date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
      { officer: "Worker-Electric-08", comment: "Bulbs and broken circuits replaced. Uploaded resolution proof.", date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { officer: "Municipal Verification Desk", comment: "Resolution proof reviewed and the ticket was closed.", date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() }
    ]
  }
];

// Active User
let currentUser = {
  uid: "citizen_1",
  name: "Sugantharaj T",
  reputation: 320,
  isVerified: true
};

// Global handles
let selectedPortal = "";
let currentView = "splash";
let currentCitizenFeedFilter = "trending";
let selectedGovTicket = null;
let mapCitizen = null;
let mapGov = null;
let mapGovPins = [];
let citizenPinMarker = null;
let chartEfficiency = null;
let selectedLocation = {
  lat: 11.0168,
  lng: 76.9558,
  address: "Coimbatore",
  source: "default"
};

// Speech Recognition Hook
let recognition = null;
let isRecording = false;

// Simulated camera presets
const mockPresets = {
  pothole: {
    url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
    title: "Large pothole crater",
    desc: "Huge crater near the center road line. Deep risk for vehicles.",
    category: "pothole",
    severity: 8,
    emerg: true
  },
  garbage: {
    url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
    title: "Heavy trash pile on pavement",
    desc: "Illegal garbage bags piled up right in front of the market.",
    category: "garbage_dumping",
    severity: 6,
    emerg: false
  },
  flooding: {
    url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
    title: "Severe water overlap",
    desc: "Storm water blocked. Water is up to ankle height on the main pathway.",
    category: "water_stagnation",
    severity: 7,
    emerg: true
  },
  streetlight: {
    url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80",
    title: "Dark streetlight row",
    desc: "3 streetlights are broken. Very dark and feels unsafe.",
    category: "broken_streetlight",
    severity: 5,
    emerg: false
  }
};
let activeMockPreset = null;
let selectedIssueMeta = {
  category: "damaged_road",
  severity: 5,
  emerg: false
};
let selectedProofPhoto = null;

// Audio context synthesis (premium sound interactions)
let audioCtx = null;
function playSound(type) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'success') {
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'click') {
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'ping') {
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    // Fail silently if audio blocked
  }
}

// --- PORTAL NAVIGATION GATEWAYS ---
function enterPortal(portal) {
  playSound('success');
  selectedPortal = portal;
  document.getElementById("portal-gateway").classList.add("hidden");
  document.getElementById("project-about-page").classList.add("hidden");
  
  if (portal === 'citizen') {
    document.getElementById("citizen-portal").classList.remove("hidden");
    startCitizenFlow();
  } else {
    document.getElementById("government-portal").classList.remove("hidden");
    startGovernmentFlow();
  }
}

function exitPortal() {
  playSound('click');
  document.getElementById("citizen-portal").classList.add("hidden");
  document.getElementById("government-portal").classList.add("hidden");
  document.getElementById("project-about-page").classList.add("hidden");
  document.getElementById("portal-gateway").classList.remove("hidden");
  selectedPortal = "";
  
  // Reset maps
  if (mapCitizen) { mapCitizen.remove(); mapCitizen = null; citizenPinMarker = null; }
  if (mapGov) { mapGov.remove(); mapGov = null; }
}

function openAboutPage() {
  playSound('click');
  document.getElementById("portal-gateway").classList.add("hidden");
  document.getElementById("citizen-portal").classList.add("hidden");
  document.getElementById("government-portal").classList.add("hidden");
  document.getElementById("project-about-page").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeAboutPage() {
  playSound('click');
  document.getElementById("project-about-page").classList.add("hidden");
  document.getElementById("portal-gateway").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- CITIZEN PORTAL WORKFLOWS ---
function startCitizenFlow() {
  // Splash Screen Simulation
  setView('splash');
  setTimeout(() => {
    document.getElementById("citizen-splash").classList.add("translate-y-full");
    setTimeout(() => {
      document.getElementById("citizen-splash").style.display = "none";
      // Auto register / login
      setView('home');
    }, 700);
  }, 1800);
}

function setView(view) {
  currentView = view;
  playSound('click');

  // Hide all panels
  document.getElementById("citizen-login").classList.add("hidden");
  document.getElementById("citizen-home").classList.add("hidden");
  document.getElementById("citizen-report").classList.add("hidden");
  document.getElementById("citizen-detail").classList.add("hidden");

  // Reset tab button colors
  document.getElementById("nav-btn-home").className = "flex flex-col items-center gap-1 text-gray-500";
  document.getElementById("nav-btn-alerts").className = "flex flex-col items-center gap-1 text-gray-500 relative";

  if (view === 'login') {
    document.getElementById("citizen-login").classList.remove("hidden");
  } else if (view === 'home') {
    document.getElementById("citizen-home").classList.remove("hidden");
    document.getElementById("nav-btn-home").className = "flex flex-col items-center gap-1 text-red-500";
    renderCitizenFeed();
  } else if (view === 'report') {
    document.getElementById("citizen-report").classList.remove("hidden");
    setTimeout(initCitizenMap, 200);
  } else if (view === 'detail') {
    document.getElementById("citizen-detail").classList.remove("hidden");
  }
}

// Render Social Feed
function renderCitizenFeed() {
  const container = document.getElementById("citizen-feed-container");
  container.innerHTML = "";

  let list = [...complaintsDB];

  // Sorting logics
  if (currentCitizenFeedFilter === 'trending') {
    // Sort by: emergency first, then votes score, then date
    list.sort((a, b) => b.votes.length - a.votes.length);
  } else if (currentCitizenFeedFilter === 'recent') {
    list.sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at));
  } else if (currentCitizenFeedFilter === 'my') {
    list = list.filter(c => c.reporter_uid === currentUser.uid);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center">
        <i class="fa-solid fa-folder-open text-gray-600 text-3xl mb-2"></i>
        <p class="text-xs text-gray-400">No active reports in this segment.</p>
      </div>
    `;
    return;
  }

  list.forEach(c => {
    const isVoted = c.votes.includes(currentUser.uid);
    const voteColor = isVoted ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-gray-400 hover:text-gray-200 bg-gray-800/40 border-gray-700/50";
    
    // Status Badge colors
    let statusClass = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    if (c.status === 'in_progress') statusClass = "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    if (c.status === 'resolved') statusClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

    const card = document.createElement("div");
    card.className = "glassmorphism rounded-2xl p-4 border border-gray-800/60 relative overflow-hidden transition-all hover:scale-[1.01]";
    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase ${c.is_emergency ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-gray-800 text-gray-400'}">
            ${c.category.replace('_', ' ')}
          </span>
          ${c.is_duplicate ? '<span class="px-2 py-0.5 rounded text-[8px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-bold uppercase"><i class="fa-solid fa-copy text-[6px] mr-1"></i> Duplicate Alert</span>' : ''}
        </div>
        <span class="text-[9px] font-semibold rounded-full px-2.5 py-0.5 ${statusClass} uppercase font-mono">${c.status.replace('_', ' ')}</span>
      </div>

      <h4 onclick="showCitizenTicketDetail(${c.id})" class="font-bold text-sm text-gray-100 hover:text-red-400 cursor-pointer transition-colors">${c.title}</h4>
      <p class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">${c.description}</p>

      <div class="h-28 rounded-xl overflow-hidden mt-3 bg-gray-900 border border-gray-800 cursor-pointer relative" onclick="showCitizenTicketDetail(${c.id})">
        ${reportImageMarkup(c)}
        ${c.status === 'resolved' ? '<div class="absolute inset-0 bg-emerald-950/60 backdrop-blur-[1px] flex items-center justify-center text-xs font-bold text-emerald-300 uppercase tracking-widest"><i class="fa-solid fa-circle-check mr-1.5"></i> Cleaned & Verified</div>' : ''}
      </div>

      <div class="mt-3.5 flex items-center justify-between text-[11px] pt-3 border-t border-gray-800/60">
        <span class="text-gray-500 font-mono"><i class="fa-regular fa-clock text-[9px] mr-1"></i> ${new Date(c.reported_at).toLocaleDateString()}</span>
        
        <div class="flex items-center gap-2">
          <!-- Me Too Upvote Button -->
          <button onclick="voteMeToo(${c.id}, event)" class="px-2.5 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1.5 transition-all ${voteColor}">
            <i class="fa-solid fa-fire-flame-curved"></i> Affected Me Too (${c.votes.length})
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterCitizenFeed(tab) {
  currentCitizenFeedFilter = tab;
  
  document.getElementById("tab-trending").className = "flex-1 py-3 text-xs font-bold text-gray-400 hover:text-white transition-colors";
  document.getElementById("tab-recent").className = "flex-1 py-3 text-xs font-bold text-gray-400 hover:text-white transition-colors";
  document.getElementById("tab-my").className = "flex-1 py-3 text-xs font-bold text-gray-400 hover:text-white transition-colors";

  document.getElementById(`tab-${tab}`).className = "flex-1 py-3 text-xs font-bold text-red-400 border-b-2 border-red-500";
  
  renderCitizenFeed();
}

// Upvote complaints
function voteMeToo(id, event) {
  if (event) event.stopPropagation();
  playSound('click');

  const comp = complaintsDB.find(c => c.id === id);
  if (!comp) return;

  const userIdx = comp.votes.indexOf(currentUser.uid);
  if (userIdx !== -1) {
    comp.votes.splice(userIdx, 1);
    comp.priority_score = Math.max(0, comp.priority_score - 10);
  } else {
    comp.votes.push(currentUser.uid);
    comp.priority_score += 10;
    triggerNotification("Upvote persistance", `Affected Me Too support added for TICKET #${id}. Ranked priority increased!`);
  }

  renderCitizenFeed();
  if (currentView === 'detail' && selectedGovTicket && selectedGovTicket.id === id) {
    showCitizenTicketDetail(id);
  }

  // Live persistent connection to government dashboard elements!
  if (selectedGovTicket && selectedGovTicket.id === id) {
    selectedGovTicket = { ...comp };
    renderGovResolver();
  }
  syncGovQueue();
}

// Live speech-to-text simulation using browser Web Speech API
function toggleVoiceReporting() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    // Fallback typing mock for browser compatibility
    playSound('ping');
    const mockPhrases = [
      "Heavy rainwater stagnated at Velachery near the local temple. The drain is full of garbage blocking the flow.",
      "Extremely deep potholes near Gandhipuram junction causing absolute slow motion traffic in Coimbatore.",
      "Broken streetlight near the nursery school, street is pitch dark and dangerous."
    ];
    let phrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
    let textDesc = document.getElementById("report-desc");
    
    document.getElementById("stt-status").innerText = "Simulating Tamil/English speech...";
    let i = 0;
    textDesc.value = "";
    
    let interval = setInterval(() => {
      if (i < phrase.length) {
        textDesc.value += phrase[i];
        i++;
      } else {
        clearInterval(interval);
        document.getElementById("stt-status").innerText = "Voice recognized successfully!";
        playSound('success');
      }
    }, 20);
    return;
  }

  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN'; // Indian accent focus

    recognition.onstart = () => {
      isRecording = true;
      playSound('ping');
      document.getElementById("mic-icon-pulse").style.display = "block";
      document.getElementById("mic-icon-idle").style.display = "none";
      document.getElementById("stt-status").innerText = "Listening now... Speak details";
      document.getElementById("stt-btn-icon").className = "fa-solid fa-microphone-lines text-red-500 animate-pulse";
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById("report-desc").value = transcript;
      document.getElementById("stt-status").innerText = "Voice transcribed successfully!";
      playSound('success');
    };

    recognition.onerror = () => {
      document.getElementById("stt-status").innerText = "Speech error. Try again.";
    };

    recognition.onend = () => {
      isRecording = false;
      document.getElementById("mic-icon-pulse").style.display = "none";
      document.getElementById("mic-icon-idle").style.display = "block";
      document.getElementById("stt-btn-icon").className = "fa-solid fa-microphone text-red-500";
    };
  }

  if (isRecording) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

function openPhotoPicker() {
  document.getElementById("photo-file-input").click();
}

function handlePhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    activeMockPreset = {
      url: reader.result,
      title: "",
      desc: "",
      category: selectedIssueMeta.category,
      severity: selectedIssueMeta.severity,
      emerg: selectedIssueMeta.emerg,
      customUpload: true
    };

    document.getElementById("preview-image").src = activeMockPreset.url;
    document.getElementById("preview-image").classList.remove("hidden");
    document.getElementById("clear-image-btn").classList.remove("hidden");
    document.getElementById("upload-prompt").classList.add("hidden");
    if (file.name && !document.getElementById("report-title").value.trim()) {
      document.getElementById("report-title").value = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    }
    triggerNotification("Photo added", "This uploaded photo will be used as the report image.");
  };
  reader.readAsDataURL(file);
}

function selectIssueType(type) {
  playSound('click');
  const meta = mockPresets[type];
  if (!meta) return;

  selectedIssueMeta = {
    category: meta.category,
    severity: meta.severity,
    emerg: meta.emerg
  };

  if (activeMockPreset) {
    activeMockPreset.category = meta.category;
    activeMockPreset.severity = meta.severity;
    activeMockPreset.emerg = meta.emerg;
  }

  // Populate title & description without replacing the user's uploaded photo.
  document.getElementById("report-title").value = meta.title;
  document.getElementById("report-desc").value = meta.desc;
  triggerNotification("Issue type selected", `${meta.category.replace('_', ' ')} will be used for routing.`);
}

// Backward-compatible wrapper for older inline handlers.
function selectMockImage(type) {
  selectIssueType(type);
}

function clearSelectedImage(e) {
  if (e) e.stopPropagation();
  playSound('click');
  activeMockPreset = null;
  document.getElementById("preview-image").src = "";
  document.getElementById("preview-image").classList.add("hidden");
  document.getElementById("clear-image-btn").classList.add("hidden");
  document.getElementById("upload-prompt").classList.remove("hidden");
  const fileInput = document.getElementById("photo-file-input");
  if (fileInput) fileInput.value = "";
}

function reportImageSrc(report) {
  if (!report || !report.before_image_url) return "";
  if (report.is_user_uploaded_image || report.before_image_url.startsWith("data:") || report.before_image_url.startsWith("blob:")) {
    return report.before_image_url;
  }
  return "";
}

function reportImageMarkup(report, heightClass = "h-full") {
  const src = reportImageSrc(report);
  if (src) {
    return `<img src="${src}" alt="Citizen uploaded issue photo" class="w-full ${heightClass} object-cover">`;
  }

  return `
    <div class="w-full ${heightClass} flex flex-col items-center justify-center bg-gray-900 text-gray-500">
      <i class="fa-solid fa-image text-2xl mb-2"></i>
      <span class="text-[10px] font-bold uppercase tracking-wider">No citizen photo uploaded</span>
    </div>
  `;
}

function proofImageSrc(report) {
  if (!report || !report.after_image_url) return "";
  if (report.is_officer_uploaded_after_image || report.after_image_url.startsWith("data:") || report.after_image_url.startsWith("blob:")) {
    return report.after_image_url;
  }
  return "";
}

function proofImageMarkup(report, heightClass = "h-full") {
  const src = proofImageSrc(report);
  if (src) {
    return `<img src="${src}" alt="Officer uploaded completion proof" class="w-full ${heightClass} object-cover">`;
  }

  return `
    <div class="w-full ${heightClass} flex flex-col items-center justify-center bg-gray-900 text-gray-500">
      <i class="fa-solid fa-image text-2xl mb-2"></i>
      <span class="text-[10px] font-bold uppercase tracking-wider">No completion photo uploaded</span>
    </div>
  `;
}

function updateSelectedLocation(lat, lng, address, source) {
  selectedLocation = {
    lat,
    lng,
    address: address || selectedLocation.address || "Selected location, Coimbatore",
    source: source || "pin"
  };

  document.getElementById("coords-text").innerText = `${selectedLocation.address} · ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  const manualInput = document.getElementById("manual-location");
  if (manualInput && address) manualInput.value = address;

  if (citizenPinMarker) {
    citizenPinMarker.setLatLng([lat, lng]);
  }

  if (mapCitizen) {
    mapCitizen.setView([lat, lng], Math.max(mapCitizen.getZoom(), 15));
  }
}

function requestCitizenLocation() {
  if (!navigator.geolocation) {
    triggerNotification("Location unavailable", "Your browser does not support live location. Type the area or move the pin.");
    return;
  }

  document.getElementById("coords-text").innerText = "Requesting live location...";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      updateSelectedLocation(lat, lng, "Current location", "gps");
      triggerNotification("Location found", "The pin has been moved to your current location.");
    },
    () => {
      document.getElementById("coords-text").innerText = "Live location blocked. Type location or drag the pin.";
      triggerNotification("Location permission blocked", "Type your location or drag the map pin before submitting.");
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

function useManualLocation() {
  const manual = document.getElementById("manual-location").value.trim();
  if (!manual) {
    triggerNotification("Location needed", "Type a street, landmark, or area first.");
    return;
  }

  updateSelectedLocation(selectedLocation.lat, selectedLocation.lng, manual, "manual");
  triggerNotification("Location saved", "Your typed location will be submitted with the report.");
}

// Initialize Leaflet Map on reporting screen
function initCitizenMap() {
  const container = document.getElementById("cit-map-container");
  if (mapCitizen) return;

  // Center on the last known citizen location.
  mapCitizen = L.map(container, {
    zoomControl: false,
    attributionControl: false
  }).setView([selectedLocation.lat, selectedLocation.lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapCitizen);

  // Add draggable marker
  citizenPinMarker = L.marker([selectedLocation.lat, selectedLocation.lng], { draggable: true }).addTo(mapCitizen);

  citizenPinMarker.on('dragend', function (e) {
    playSound('click');
    let position = citizenPinMarker.getLatLng();
    updateSelectedLocation(position.lat, position.lng, "Pinned location", "pin");
  });

  updateSelectedLocation(selectedLocation.lat, selectedLocation.lng, selectedLocation.address, selectedLocation.source);
  requestCitizenLocation();
}

// Submit issue and create the report.
function submitIssue() {
  const title = document.getElementById("report-title").value.trim();
  const desc = document.getElementById("report-desc").value.trim();
  const manualLocation = document.getElementById("manual-location").value.trim();
  
  if (!title || !desc || !activeMockPreset) {
    alert("Please upload a photo, title, and description first.");
    return;
  }

  if (!activeMockPreset.customUpload) {
    alert("Please upload the actual issue photo. Demo images are not used for submitted reports.");
    return;
  }

  if (manualLocation) {
    updateSelectedLocation(selectedLocation.lat, selectedLocation.lng, manualLocation, "manual");
  }

  const reportPhoto = { ...activeMockPreset };

  playSound('click');
  
  // Show AI Scanning Screen Overlay
  document.getElementById("scanning-img").src = reportPhoto.url;
  document.getElementById("ai-scanning-overlay").classList.remove("hidden");
  document.getElementById("ai-bbox").style.display = "none";
  ["log-step-1", "log-step-2", "log-step-3"].forEach((id, index) => {
    const item = document.getElementById(id);
    item.innerText = index === 0 ? "Checking photo..." : index === 1 ? "Reading issue details..." : "Checking nearby reports...";
    item.classList.toggle("opacity-30", index !== 0);
  });

  // Animate scan laser
  let line = document.getElementById("scan-line");
  line.style.top = "0%";
  
  let steps = [
    { el: "log-step-1", text: "Photo attached", delay: 800 },
    { el: "log-step-2", text: "Issue details checked", delay: 1800 },
    { el: "log-step-3", text: "Nearby reports checked", delay: 2800 }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      let item = document.getElementById(step.el);
      item.innerText = step.text;
      item.classList.remove("opacity-30");
      playSound('click');
      
      if (step.el === 'log-step-2') {
        // Show a simple classification marker on the preview.
        let box = document.getElementById("ai-bbox");
        box.style.display = "block";
        box.style.top = "20%";
        box.style.left = "15%";
        box.style.width = "70%";
        box.style.height = "55%";
        document.getElementById("ai-class-lbl").innerText = `${reportPhoto.category.replace('_', ' ').toUpperCase()}`;
      }
    }, step.delay);
  });

  // Finish processing
  setTimeout(() => {
    playSound('success');
    document.getElementById("ai-scanning-overlay").classList.add("hidden");
    
    // Hide Bounding Box
    document.getElementById("ai-bbox").style.display = "none";
    
    // Core details creation
    const latlng = citizenPinMarker ? citizenPinMarker.getLatLng() : { lat: selectedLocation.lat, lng: selectedLocation.lng };
    
    // Check if new report matches any existing coordinate nearby (simulated dup detection!)
    let isDup = false;
    let parentId = null;
    complaintsDB.forEach(c => {
      let d = calculateDistance(latlng.lat, latlng.lng, c.latitude, c.longitude);
      if (d <= 60 && c.category === reportPhoto.category && c.status !== 'resolved') {
        isDup = true;
        parentId = c.id;
      }
    });

    // Auto routing department lookup
    const routingMap = {
      pothole: "Roads & Highways Department",
      damaged_road: "Roads & Highways Department",
      garbage_dumping: "Sanitation & Solid Waste Department",
      broken_streetlight: "Electricity & Public Lighting Department",
      water_stagnation: "Storm Water & Drainage Board",
      drainage_blockage: "Storm Water & Drainage Board"
    };
    const dept = routingMap[reportPhoto.category] || "General Municipal Administration";

    // Priority math
    let score = reportPhoto.severity * 12;
    if (reportPhoto.emerg) score += 50;

    const newTicketId = complaintsDB.length + 1001;
    const newComplaint = {
      id: newTicketId,
      title: title,
      description: desc,
      category: reportPhoto.category,
      reported_by: currentUser.name,
      reporter_uid: currentUser.uid,
      latitude: latlng.lat,
      longitude: latlng.lng,
      address: selectedLocation.address || "Selected location, Coimbatore",
      landmarks: selectedLocation.source === "manual" ? selectedLocation.address : "Pinned on citizen map",
      before_image_url: reportPhoto.url,
      is_user_uploaded_image: true,
      after_image_url: null,
      severity_score: reportPhoto.severity,
      priority_score: score,
      status: "reported",
      is_duplicate: isDup,
      parent_complaint_id: parentId,
      is_emergency: reportPhoto.emerg,
      assigned_department: dept,
      assigned_worker_id: null,
      reported_at: new Date().toISOString(),
      votes: [],
      timeline: [
        { officer: "Routing Desk", comment: `Sent to ${dept} after checking the report details and location.`, date: new Date().toISOString() }
      ]
    };

    if (isDup) {
      // Find parent, increase vote rating support
      let parent = complaintsDB.find(c => c.id === parentId);
      if (parent) {
        parent.votes.push(currentUser.uid);
        parent.priority_score += 15;
        parent.timeline.push({
          officer: "Report Desk",
          comment: `Nearby matching report added by ${currentUser.name}. Support count and priority were updated.`,
          date: new Date().toISOString()
        });
      }
    }

    complaintsDB.unshift(newComplaint);
    
    // Reputational score increments
    currentUser.reputation += 15;
    document.getElementById("cit-repute-score").innerText = currentUser.reputation;

    // Reset inputs
    document.getElementById("report-title").value = "";
    document.getElementById("report-desc").value = "";
    document.getElementById("manual-location").value = "";
    clearSelectedImage();

    // Trigger Notification
    triggerNotification(
      "Report submitted", 
      `Ticket #${newTicketId} created and sent to ${dept}.`
    );
    
    // Navigate home
    setView('home');

    // Live broadcast alerts to Government control center!
    syncGovQueue();

  }, 4200);
}

// Show specific ticket detail timeline
function showCitizenTicketDetail(id) {
  const c = complaintsDB.find(item => item.id === id);
  if (!c) return;

  selectedGovTicket = { ...c };
  setView('detail');

  document.getElementById("detail-ticket-id").innerText = `ID: ${c.id}`;
  
  const container = document.getElementById("detail-container");
  container.innerHTML = "";

  // Banners for before/after comparison if resolved
  let resolvedSliderHtml = "";
  if (c.status === 'resolved') {
    resolvedSliderHtml = `
      <div>
        <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Before & after verification</label>
        <div class="grid grid-cols-2 gap-2.5">
          <div class="h-28 rounded-lg overflow-hidden border border-gray-800 bg-gray-900 relative">
            ${reportImageMarkup(c)}
            <span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/70 rounded text-[7px] text-gray-300 font-bold uppercase tracking-wider">Before</span>
          </div>
          <div class="h-28 rounded-lg overflow-hidden border border-emerald-800 bg-gray-900 relative">
            ${proofImageMarkup(c)}
            <span class="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-emerald-950/70 rounded text-[7px] text-emerald-400 font-bold uppercase tracking-wider">After (Repaired)</span>
          </div>
        </div>
      </div>
    `;
  } else {
    resolvedSliderHtml = `
      <div class="h-36 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 relative">
        ${reportImageMarkup(c)}
      </div>
    `;
  }

  // Create timeline html
  let timelineItemsHtml = "";
  c.timeline.forEach(log => {
    timelineItemsHtml += `
      <div class="relative pl-5 border-l border-gray-800">
        <span class="absolute -left-1.5 top-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-cyberDark"></span>
        <h5 class="text-xs font-bold text-gray-200">${log.officer}</h5>
        <p class="text-[10px] text-gray-400 leading-normal mt-0.5">${log.comment}</p>
        <span class="text-[8px] font-mono text-gray-600 block mt-1">${new Date(log.date).toLocaleTimeString()}</span>
      </div>
    `;
  });

  let statusClass = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  if (c.status === 'in_progress') statusClass = "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
  if (c.status === 'resolved') statusClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

  container.innerHTML = `
    <!-- Top Details -->
    <div>
      <div class="flex items-center gap-2 mb-2">
        <span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-gray-800 text-gray-400">${c.category.replace('_', ' ')}</span>
        <span class="text-[9px] font-semibold rounded-full px-2.5 py-0.5 ${statusClass} uppercase font-mono">${c.status.replace('_', ' ')}</span>
      </div>
      <h3 class="text-xl font-bold text-gray-100 leading-tight">${c.title}</h3>
      <p class="text-xs text-gray-400 mt-1"><i class="fa-solid fa-location-dot text-red-500 text-[10px] mr-1"></i> ${c.address}</p>
    </div>

    <!-- Image display -->
    ${resolvedSliderHtml}

    <!-- Description -->
    <div>
      <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Issue Details</label>
      <p class="text-xs text-gray-300 leading-relaxed bg-gray-800/20 border border-gray-800/80 p-3 rounded-xl">${c.description}</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-3">
      <div class="glassmorphism p-3 rounded-xl border border-gray-800/60 text-center">
        <div class="text-lg font-extrabold text-red-400">${c.severity_score}/10</div>
        <div class="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Severity</div>
      </div>
      <div class="glassmorphism p-3 rounded-xl border border-gray-800/60 text-center">
        <div class="text-lg font-extrabold text-purple-400">${c.priority_score}</div>
        <div class="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Priority score</div>
      </div>
    </div>

    <!-- Official Actions Timeline -->
    <div class="space-y-4 pt-4 border-t border-gray-800/80">
      <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest"><i class="fa-solid fa-route mr-1"></i> Remediation Timeline</h4>
      <div class="space-y-4">
        ${timelineItemsHtml}
      </div>
    </div>
  `;
}

// Simulated dynamic alerting pushes
function triggerNotification(title, desc) {
  playSound('ping');
  const banner = document.getElementById("custom-alert-banner");
  document.getElementById("custom-alert-title").innerText = title;
  document.getElementById("custom-alert-desc").innerText = desc;
  
  banner.classList.remove("-translate-y-24", "opacity-0");
  
  // Auto hide in 5 seconds
  setTimeout(dismissNotification, 5000);
}

function dismissNotification() {
  const banner = document.getElementById("custom-alert-banner");
  banner.classList.add("-translate-y-24", "opacity-0");
}


// --- GOVERNMENT ADMIN PORTAL WORKFLOWS ---
function startGovernmentFlow() {
  // Seeding clock
  const pad = (n) => n < 10 ? '0' + n : n;
  let d = new Date();
  document.getElementById("gov-clock").innerText = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

  // Build/Sync Queues
  syncGovQueue();
  
  // Set up Map
  setTimeout(initGovMap, 300);
}

// Sync active queue lists
function syncGovQueue() {
  const queueContainer = document.getElementById("gov-priority-queue");
  if (!queueContainer) return;

  queueContainer.innerHTML = "";

  // Sort complaintsDB: Priority score descending
  let list = [...complaintsDB];

  // Filtering logs
  const filterCat = document.getElementById("gov-filter-category") ? document.getElementById("gov-filter-category").value : "all";
  const filterStatus = document.getElementById("gov-filter-status") ? document.getElementById("gov-filter-status").value : "all";

  if (filterCat !== 'all') {
    list = list.filter(c => c.category === filterCat);
  }
  if (filterStatus !== 'all') {
    list = list.filter(c => c.status === filterStatus);
  }

  // Update counts label
  document.getElementById("gov-queue-count").innerText = `Active Queue: ${list.length} Tickets`;

  if (list.length === 0) {
    queueContainer.innerHTML = `
      <div class="py-8 text-center text-gray-500 text-xs">
        <i class="fa-solid fa-box-open text-xl mb-1.5"></i>
        <p>No complaints match filters.</p>
      </div>
    `;
    return;
  }

  list.forEach(c => {
    let statusClass = "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (c.status === 'in_progress') statusClass = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    if (c.status === 'resolved') statusClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

    const card = document.createElement("button");
    card.onclick = () => selectGovComplaint(c.id);
    card.className = "w-full text-left p-3.5 rounded-xl border border-gray-800 bg-gray-900/60 hover:bg-[#121827] hover:border-purple-500/40 transition-all flex items-center justify-between gap-4";
    
    // Border highlights for emergencies
    if (c.is_emergency && c.status !== 'resolved') {
      card.className += " border-l-4 border-l-red-500";
    }

    card.innerHTML = `
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 flex-wrap mb-1">
          <span class="text-[8px] font-bold text-gray-500 font-mono">TICKET #${c.id}</span>
          ${c.is_emergency && c.status !== 'resolved' ? '<span class="text-[8px] font-bold text-red-400 bg-red-500/10 px-1 rounded">EMERGENCY</span>' : ''}
          <span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase ${statusClass} uppercase font-mono">${c.status}</span>
        </div>
        <h5 class="font-bold text-xs text-gray-200 truncate">${c.title}</h5>
        <p class="text-[10px] text-gray-400 truncate mt-0.5"><i class="fa-solid fa-location-dot text-red-500 mr-0.5"></i> ${c.address}</p>
      </div>

      <div class="text-right">
        <span class="block text-xs font-extrabold text-purple-400 font-mono">${c.priority_score}</span>
        <span class="text-[8px] text-gray-500 font-bold uppercase tracking-wider font-mono">Priority</span>
      </div>
    `;
    queueContainer.appendChild(card);
  });

  // Re-sync map pins
  syncGovMapPins();
}

function filterGovDashboard() {
  playSound('click');
  syncGovQueue();
}

// Select a specific complaint in government workflow
function selectGovComplaint(id) {
  playSound('click');
  const c = complaintsDB.find(item => item.id === id);
  if (!c) return;

  selectedGovTicket = c;
  
  // Hide no selection pane
  document.getElementById("gov-no-selection").classList.add("hidden");
  document.getElementById("gov-resolver-workspace").classList.remove("hidden");

  // Populate data
  document.getElementById("gov-txt-title").innerText = c.title;
  document.getElementById("gov-txt-address").innerText = c.address;
  document.getElementById("gov-txt-desc").innerText = `"${c.description}"`;
  document.getElementById("gov-txt-reporter").innerText = c.reported_by;
  document.getElementById("gov-lbl-ticket").innerText = `TICKET #${c.id}`;
  document.getElementById("gov-lbl-category").innerText = c.category.replace('_', ' ');
  
  // Images
  const beforeImage = document.getElementById("gov-img-before");
  const beforeImageFallback = document.getElementById("gov-img-before-fallback");
  const beforeSrc = reportImageSrc(c);
  if (beforeSrc) {
    beforeImage.src = beforeSrc;
    beforeImage.alt = "Citizen uploaded issue photo";
    beforeImage.classList.remove("hidden");
    beforeImageFallback.classList.add("hidden");
  } else {
    beforeImage.removeAttribute("src");
    beforeImage.classList.add("hidden");
    beforeImageFallback.classList.remove("hidden");
  }

  // Severity stats
  document.getElementById("gov-stat-severity").innerText = `${c.severity_score} / 10`;
  document.getElementById("gov-bar-severity").style.width = `${c.severity_score * 10}%`;
  
  document.getElementById("gov-stat-votes").innerText = `${c.votes.length} Citizens supported`;
  document.getElementById("gov-stat-dept").innerText = c.assigned_department;
  document.getElementById("gov-stat-priority").innerText = `${c.priority_score} Rank Score`;
  
  // Duplicate info
  document.getElementById("gov-stat-duplicate").innerText = c.is_duplicate ? `Linked Parent: #${c.parent_complaint_id}` : "No spatial overlap";

  // Emergency banner
  if (c.is_emergency) {
    document.getElementById("gov-lbl-emerg").style.display = "inline-block";
  } else {
    document.getElementById("gov-lbl-emerg").style.display = "none";
  }

  renderGovResolver();

  // Focus map on ticket coordinate
  if (mapGov) {
    mapGov.setView([c.latitude, c.longitude], 16);
  }
}

// Helper to render current active status blocks
function renderGovResolver() {
  const c = selectedGovTicket;
  if (!c) return;

  // Status Badge
  const statusBadge = document.getElementById("gov-badge-status");
  statusBadge.innerText = c.status.replace('_', ' ');
  
  let badgeColor = "bg-blue-500/15 text-blue-400 border border-blue-500/20";
  if (c.status === 'in_progress') badgeColor = "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
  if (c.status === 'resolved') badgeColor = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
  
  statusBadge.className = `px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${badgeColor}`;

  // Form panels toggle
  document.getElementById("dispatch-form").classList.add("hidden");
  document.getElementById("resolution-proof-form").classList.add("hidden");
  document.getElementById("resolution-verified-msg").classList.add("hidden");

  if (c.status === 'reported') {
    document.getElementById("dispatch-form").classList.remove("hidden");
  } else if (c.status === 'assigned' || c.status === 'in_progress') {
    document.getElementById("resolution-proof-form").classList.remove("hidden");
    
    // Clear proof uploads preview
    document.getElementById("proof-preview").src = "";
    document.getElementById("proof-preview").classList.add("hidden");
    document.getElementById("proof-prompt").classList.remove("hidden");
    selectedProofPhoto = null;
    const proofFileInput = document.getElementById("proof-file-input");
    if (proofFileInput) proofFileInput.value = "";
  } else if (c.status === 'resolved') {
    document.getElementById("resolution-verified-msg").classList.remove("hidden");
  }
}

// Action Dispatch worker
function dispatchWorker() {
  playSound('success');
  const c = selectedGovTicket;
  if (!c) return;

  const wSelect = document.getElementById("worker-dispatch");
  const worker = wSelect.value;
  const dept = c.assigned_department;

  c.assigned_worker_id = worker;
  c.status = "in_progress"; // shift status

  // Push updates log
  c.timeline.push({
    officer: "Municipal Dispatcher",
    comment: `Crew dispatched under AE Leader: ${worker}. Remediation work is officially IN PROGRESS.`,
    date: new Date().toISOString()
  });

  // Trigger Notifications
  triggerNotification(
    "Work Crew Dispatched", 
    `AE supervisor crew ${worker} dispatched to South Usman Road corridor for TICKET #${c.id}.`
  );

  // Sync boards
  syncGovQueue();
  renderGovResolver();
}

function openProofPhotoPicker() {
  document.getElementById("proof-file-input").click();
}

function handleProofPhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    selectedProofPhoto = reader.result;
    document.getElementById("proof-preview").src = selectedProofPhoto;
    document.getElementById("proof-preview").classList.remove("hidden");
    document.getElementById("proof-prompt").classList.add("hidden");
    triggerNotification("Proof photo added", "The uploaded completion photo is ready for verification.");
  };
  reader.readAsDataURL(file);
}

// Run before/after verification.
function runAIResolutionVerification() {
  if (!selectedProofPhoto) {
    alert("Please upload the completed work photo from the device first.");
    return;
  }

  playSound('click');
  const c = selectedGovTicket;
  if (!c) return;

  // Run mock processing delays
  triggerNotification("Verification started", "Checking the completion photo against the original report.");

  setTimeout(() => {
    playSound('success');
    c.status = "resolved";
    c.after_image_url = selectedProofPhoto;
    c.is_officer_uploaded_after_image = true;
    
    c.timeline.push({
      officer: "Municipal Verification Desk",
      comment: "Completion proof uploaded and verified. Ticket closed as resolved.",
      date: new Date().toISOString()
    });

    triggerNotification(
      "Resolution verified", 
      `Ticket #${c.id} closed and marked resolved.`
    );

    // Sync boards
    syncGovQueue();
    renderGovResolver();

  }, 3000);
}

// Init leafet map on government dashboard
function initGovMap() {
  const container = document.getElementById("gov-map-element");
  if (mapGov) return;

  // Center on Gandhipuram Coimbatore
  mapGov = L.map(container, {
    zoomControl: true,
    attributionControl: false
  }).setView([11.0168, 76.9558], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapGov);

  syncGovMapPins();
}

// Populate map pins
function syncGovMapPins() {
  if (!mapGov) return;

  // Clear existing pins
  mapGovPins.forEach(p => mapGov.removeLayer(p));
  mapGovPins = [];

  // Generate customized colored pins
  complaintsDB.forEach(c => {
    // Determine pin color based on status
    let pinColor = "#3b82f6"; // blue
    if (c.status === 'in_progress') pinColor = "#eab308"; // yellow
    if (c.status === 'resolved') pinColor = "#10b981"; // emerald

    // Customized dot marker
    let icon = L.divIcon({
      html: `<div style="background-color: ${pinColor}; border: 2.5px solid #080b13; box-shadow: 0 4px 10px rgba(0,0,0,0.5); width: 14px; height: 14px; border-radius: 50%" class="float-element"></div>`,
      className: 'custom-leaflet-marker',
      iconSize: [14, 14]
    });

    let marker = L.marker([c.latitude, c.longitude], { icon: icon }).addTo(mapGov);
    
    // Popup binding
    marker.bindPopup(`
      <div style="font-family: 'Inter', sans-serif; color: #f3f4f6; background-color: #0b0f19; padding: 4px">
        <h6 style="margin: 0; font-weight: bold; font-size: 11px">${c.title}</h6>
        <p style="margin: 3px 0 0 0; font-size: 9px; color: #9ca3af"><i class="fa-solid fa-compass"></i> ${c.assigned_department}</p>
        <button onclick="selectGovComplaint(${c.id})" style="background-color: #7c3aed; color: white; border: none; font-size: 8px; font-weight: bold; margin-top: 6px; padding: 3px 8px; border-radius: 4px; cursor: pointer; width: 100%">Resolve Workspace</button>
      </div>
    `, {
      closeButton: false,
      className: 'dark-leaflet-popup'
    });

    mapGovPins.push(marker);
  });
}


// --- UTILITY MATH FUNCTIONS ---
function calculateDistance(lat1, lon1, lat2, lon2) {
  let R = 6371000; // meters
  let dLat = (lat2 - lat1) * Math.PI / 180;
  let dLon = (lon2 - lon1) * Math.PI / 180;
  let a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}


// Vercel page routing support
window.addEventListener("DOMContentLoaded",()=>{
 const p=new URLSearchParams(window.location.search).get("portal");
 if(p==="citizen"||p==="government"){ setTimeout(()=>enterPortal(p),100);}
});

const mockDoctors = [
  { id: 'd1', name: 'Dr. Aisha Rahman', initials: 'AR', specialty: 'General Physician', rating: 4.8, slots: ['Nov 1, 9:00 AM', 'Nov 1, 10:00 AM', 'Nov 1, 2:00 PM'] },
  { id: 'd2', name: 'Dr. Rohit Mehta', initials: 'RM', specialty: 'ENT Specialist', rating: 4.6, slots: ['Nov 2, 11:00 AM', 'Nov 2, 3:00 PM'] },
  { id: 'd3', name: 'Dr. Maria Gomez', initials: 'MG', specialty: 'Psychiatrist', rating: 4.9, slots: ['Nov 3, 9:30 AM', 'Nov 3, 1:00 PM'] },
  { id: 'd4', name: 'Dr. James Chen', initials: 'JC', specialty: 'Cardiologist', rating: 4.7, slots: ['Nov 4, 10:00 AM', 'Nov 4, 4:00 PM'] }
]

const mockPharmacy = [
  { id: 'p1', name: 'Cough Relief Syrup', conditionTags: ['cold', 'cough', 'flu'], price: 5.99, verified: true },
  { id: 'p2', name: 'Paracetamol 500mg', conditionTags: ['fever', 'headache', 'cold'], price: 3.49, verified: true },
  { id: 'p3', name: 'Antihistamine Tablets', conditionTags: ['allergy', 'cold'], price: 6.99, verified: true },
  { id: 'p4', name: 'Electrolyte Drink Mix', conditionTags: ['dehydration', 'flu'], price: 4.50, verified: true },
  { id: 'p5', name: 'Vitamin C Tablets', conditionTags: ['immunity', 'cold'], price: 7.99, verified: true },
  { id: 'p6', name: 'Throat Lozenges', conditionTags: ['cold', 'cough'], price: 2.99, verified: true }
]

const mockCommunity = [
  { id: 't1', topic: 'Cold & Flu', icon: '🤧', posts: [
    { user: 'Sarah M.', text: 'Warm lemon water with honey really helped me recover faster!', time: '2 hours ago' },
    { user: 'Mike D.', text: 'Rest is key. I took 3 days off and felt much better.', time: '5 hours ago' }
  ]},
  { id: 't2', topic: 'Diabetes Support', icon: '💉', posts: [
    { user: 'Linda P.', text: 'Managing blood sugar while traveling can be tough. I always pack extra snacks.', time: '1 day ago' }
  ]},
  { id: 't3', topic: 'Mental Health', icon: '🧠', posts: [
    { user: 'Alex K.', text: 'Daily meditation has been a game changer for my anxiety.', time: '3 hours ago' },
    { user: 'Emma R.', text: 'Talking to a therapist helped me understand my triggers better.', time: '1 day ago' }
  ]},
  { id: 't4', topic: 'Heart Health', icon: '❤️', posts: [
    { user: 'Tom B.', text: '30 minutes of walking daily improved my cardiovascular health significantly.', time: '6 hours ago' }
  ]},
  { id: 't5', topic: 'Nutrition & Diet', icon: '🥗', posts: [
    { user: 'Rachel P.', text: 'Meal prepping on Sundays has helped me eat healthier throughout the week.', time: '4 hours ago' },
    { user: 'David L.', text: 'Switching to whole grains made a huge difference in my energy levels.', time: '1 day ago' }
  ]},
  { id: 't6', topic: 'Pregnancy & Parenting', icon: '👶', posts: [
    { user: 'Anna K.', text: 'First trimester was tough but ginger tea helped with nausea!', time: '6 hours ago' }
  ]},
  { id: 't7', topic: 'Fitness & Exercise', icon: '💪', posts: [
    { user: 'Mark T.', text: 'Started with 10 minutes a day and now up to 45 minutes. Consistency is key!', time: '3 hours ago' },
    { user: 'Lisa W.', text: 'Yoga has been amazing for my back pain.', time: '8 hours ago' }
  ]},
  { id: 't8', topic: 'Sleep & Insomnia', icon: '😴', posts: [
    { user: 'Chris M.', text: 'Keeping a consistent sleep schedule helped me fall asleep faster.', time: '5 hours ago' }
  ]},
  { id: 't9', topic: 'Chronic Pain', icon: '🩹', posts: [
    { user: 'Jennifer S.', text: 'Physical therapy exercises have been a lifesaver for my joint pain.', time: '2 days ago' }
  ]},
  { id: 't10', topic: 'Allergies & Asthma', icon: '🤧', posts: [
    { user: 'Paul R.', text: 'Air purifier in the bedroom made a noticeable difference.', time: '1 day ago' }
  ]},
  { id: 't11', topic: 'Cancer Support', icon: '🎗️', posts: [
    { user: 'Maria G.', text: 'Support groups helped me feel less alone during treatment.', time: '3 days ago' }
  ]},
  { id: 't12', topic: 'Skin Care', icon: '✨', posts: [
    { user: 'Sophie B.', text: 'Sunscreen every day has improved my skin so much!', time: '1 day ago' }
  ]}
]

let cart = []
let healthHistory = {}
let currentUser = null
let currentDoctor = null
let activeMeetings = []

document.getElementById('loginBtn').addEventListener('click', () => {
  document.getElementById('authModal').classList.remove('hidden')
})

document.getElementById('authClose').addEventListener('click', () => {
  document.getElementById('authModal').classList.add('hidden')
})

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'))
    tab.classList.add('active')
    document.getElementById(tab.dataset.tab + 'Form').classList.add('active')
  })
})

document.getElementById('loginSubmit').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim()
  const password = document.getElementById('loginPassword').value.trim()
  
  if (!email || !password) {
    showNotification('Please fill in all fields', 'error')
    return
  }
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password)
    const user = userCredential.user
    
    // FIRST: Check if this is a doctor account
    let doctorDoc = await db.collection('doctors').where('email', '==', email).get()
    
    if (!doctorDoc.empty) {
      // This is a doctor! Load doctor profile
      const docData = doctorDoc.docs[0].data()
      const docId = doctorDoc.docs[0].id
      
      currentDoctor = {
        id: docId,
        email: docData.email,
        name: docData.name,
        specialty: docData.specialty,
        license: docData.license
      }
      
      updateDoctorUI()
      document.getElementById('authModal').classList.add('hidden')
      showNotification(`Welcome Dr. ${docData.name.split(' ').pop()}!`, 'success')
      switchView('doctorDashboard')
      renderDoctorAppointments()
      return
    }
    
    // SECOND: Check if user has isDoctor flag
    const userDoc = await db.collection('users').doc(user.uid).get()
    const userData = userDoc.data()
    
    if (userData?.isDoctor === true) {
      // Has isDoctor flag, try to load doctor profile
      doctorDoc = await db.collection('doctors').where('email', '==', email).get()
      
      if (!doctorDoc.empty) {
        const docData = doctorDoc.docs[0].data()
        const docId = doctorDoc.docs[0].id
        
        currentDoctor = {
          id: docId,
          email: docData.email,
          name: docData.name,
          specialty: docData.specialty,
          license: docData.license
        }
        
        updateDoctorUI()
        document.getElementById('authModal').classList.add('hidden')
        showNotification(`Welcome Dr. ${docData.name.split(' ').pop()}!`, 'success')
        switchView('doctorDashboard')
        renderDoctorAppointments()
        return
      }
    }
    
    // THIRD: Regular patient login
    currentUser = {
      email: user.email,
      uid: user.uid,
      name: userData?.name || user.email.split('@')[0],
      patientId: userData?.patientId || 'N/A'
    }
    
    updateAuthUI()
    document.getElementById('authModal').classList.add('hidden')
    showNotification(`Welcome back, ${currentUser.name}!`, 'success')
    
    await loadCommunities()
    loadUserData()
  } catch (error) {
    showNotification(error.message, 'error')
  }
})

document.getElementById('signupSubmit').addEventListener('click', async () => {
  const name = document.getElementById('signupName').value.trim()
  const email = document.getElementById('signupEmail').value.trim()
  const password = document.getElementById('signupPassword').value.trim()
  
  if (!name || !email || !password) {
    showNotification('Please fill in all fields', 'error')
    return
  }
  
  if (password.length < 6) {
    showNotification('Password must be at least 6 characters', 'error')
    return
  }
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password)
    const user = userCredential.user
    
    const patientId = generatePatientID()
    
    await db.collection('users').doc(user.uid).set({
      name: name,
      email: email,
      patientId: patientId,
      joinedCommunities: [],
      createdAt: new Date().toISOString()
    })
    
    currentUser = {
      email: user.email,
      uid: user.uid,
      name: name,
      patientId: patientId
    }
    
    joinedCommunities = []
    
    updateAuthUI()
    document.getElementById('authModal').classList.add('hidden')
    showNotification(`Welcome to SmartCare+, ${name}! Your Patient ID: ${patientId}`, 'success')
  } catch (error) {
    showNotification(error.message, 'error')
  }
})

function generatePatientID() {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return 'PT' + timestamp.slice(-6) + random
}

function updateAuthUI() {
  const authSection = document.getElementById('authSection')
  
  if (currentDoctor) {
    updateDoctorUI()
    return
  }
  
  if (currentUser) {
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    authSection.innerHTML = `
      <div class="user-info" onclick="switchView('profile')" style="cursor: pointer;">
        <div class="user-avatar">${initials}</div>
        <span class="user-name">${currentUser.name}</span>
      </div>
    `
    
    updateProfileUI()
  } else {
    authSection.innerHTML = '<button class="btn btn-secondary" id="loginBtn">Login</button>'
    document.getElementById('loginBtn').addEventListener('click', () => {
      document.getElementById('authModal').classList.remove('hidden')
    })
  }
}

async function logout() {
  try {
    await auth.signOut()
    currentUser = null
    currentDoctor = null
    joinedCommunities = []
    healthHistory = {}
    activeMeetings = []
    updateAuthUI()
    showNotification('Logged out successfully', 'info')
    switchView('hero')
  } catch (error) {
    showNotification(error.message, 'error')
  }
}

async function loadUserData() {
  if (!currentUser) return
  
  try {
    const historyDoc = await db.collection('healthHistory').doc(currentUser.uid).get()
    if (historyDoc.exists) {
      healthHistory[currentUser.email] = historyDoc.data().events || []
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
}

async function saveUserData() {
  if (!currentUser) return
  
  try {
    await db.collection('healthHistory').doc(currentUser.uid).set({
      events: healthHistory[currentUser.email] || [],
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      // Auto-detect doctor by email
      const doctorDoc = await db.collection('doctors').where('email', '==', user.email).get()
      if (!doctorDoc.empty) {
        const docData = doctorDoc.docs[0].data()
        const docId = doctorDoc.docs[0].id
        currentDoctor = {
          id: docId,
          email: docData.email,
          name: docData.name,
          specialty: docData.specialty,
          license: docData.license
        }
        updateDoctorUI()
        switchView('doctorDashboard')
        renderDoctorAppointments()
      } else {
        // Fall back to patient
        const userDoc = await db.collection('users').doc(user.uid).get()
        const userData = userDoc.data()
        currentUser = {
          email: user.email,
          uid: user.uid,
          name: userData?.name || user.email.split('@')[0],
          patientId: userData?.patientId || 'N/A'
        }
        updateAuthUI()
        await loadCommunities()
        loadUserData()
      }
    } catch (e) {
      console.error('Auth state handling error:', e)
      updateAuthUI()
    }
  } else {
    currentUser = null
    currentDoctor = null
    joinedCommunities = []
    updateAuthUI()
  }
})

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden')
  }, 1000)
  
  renderDoctors()
  renderPharmacy()
  renderCart()
  renderCommunity()
  
  const mobileToggle = document.getElementById('mobileToggle')
  const navMenu = document.getElementById('navMenu')
  
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active')
    navMenu.classList.toggle('active')
  })
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active')
      navMenu.classList.remove('active')
    })
  })
  
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'))
      document.querySelectorAll('.profile-tab-content').forEach(c => c.classList.remove('active'))
      
      tab.classList.add('active')
      const tabName = tab.dataset.tab
      document.getElementById(tabName + 'Tab').classList.add('active')
      
      if (tabName === 'history') renderProfileHistory()
      if (tabName === 'communities') renderUserCommunities()
      if (tabName === 'appointments') renderUserAppointments()
    })
  })
  
  const photoUpload = document.getElementById('photoUpload')
  if (photoUpload) {
    photoUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0]
      if (!file || !currentUser) return
      
      const reader = new FileReader()
      reader.onload = async (event) => {
        const photoURL = event.target.result
        
        try {
          await db.collection('users').doc(currentUser.uid).update({
            photoURL: photoURL
          })
          
          document.getElementById('profileAvatar').innerHTML = `<img src="${photoURL}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">`
          showNotification('Profile photo updated!', 'success')
        } catch (error) {
          showNotification('Failed to update photo: ' + error.message, 'error')
        }
      }
      reader.readAsDataURL(file)
    })
  }
  
  const profileLogoutBtn = document.getElementById('profileLogoutBtn')
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', logout)
  }
  // Meeting modal close and deep link open
  const meetingClose = document.getElementById('meetingClose')
  if (meetingClose) {
    meetingClose.addEventListener('click', () => closeMeetingModal())
  }
  // Open meeting if deep-linked
  const params = new URLSearchParams(window.location.search)
  if (params.get('meeting')) {
    openMeetingById(params.get('meeting'))
  }
})

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const view = link.dataset.view
    switchView(view)
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'))
    link.classList.add('active')
  })
})

document.querySelectorAll('[data-nav]').forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.nav
    switchView(view)
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'))
    document.querySelector(`[data-view="${view}"]`).classList.add('active')
  })
})

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active')
    v.classList.add('hidden')
  })
  const target = document.getElementById(viewId)
  if (target) {
    target.classList.remove('hidden')
    target.classList.add('active')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

document.getElementById('checkBtn').addEventListener('click', () => {
  const symptoms = document.getElementById('symptoms').value.trim()
  const patientId = document.getElementById('patientId').value.trim() || 'Guest'
  
  if (!symptoms) {
    showNotification('Please describe your symptoms', 'error')
    return
  }
  
  const analysis = analyzeSymptoms(symptoms)
  renderResult(analysis, patientId)
  
  healthHistory[patientId] = healthHistory[patientId] || []
  healthHistory[patientId].push({
    action: 'symptom-check',
    time: new Date().toISOString(),
    payload: { symptoms, analysis }
  })
  
  if (currentUser) {
    saveUserData()
  }
  
  showNotification('Symptom analysis complete!', 'success')
})

function analyzeSymptoms(text) {
  const s = text.toLowerCase()
  const conditions = []
  
  if (/cough|sore throat|sneeze|runny nose|congestion/.test(s)) {
    conditions.push({ cond: 'Common Cold', score: 0.92, tags: ['cold', 'cough', 'flu'] })
  }
  if (/fever|temperature|hot|chills|shiver/.test(s)) {
    conditions.push({ cond: 'Fever / Flu', score: 0.88, tags: ['fever', 'flu'] })
  }
  if (/headache|migraine|head pain/.test(s)) {
    conditions.push({ cond: 'Tension Headache', score: 0.72, tags: ['headache'] })
  }
  if (/anxiety|sad|depressed|stress|worry/.test(s)) {
    conditions.push({ cond: 'Anxiety / Stress', score: 0.65, tags: ['mental'] })
  }
  if (/allerg|itch|sneez|watery eyes/.test(s)) {
    conditions.push({ cond: 'Allergic Rhinitis', score: 0.78, tags: ['allergy'] })
  }
  if (/stomach|nausea|vomit|diarrhea/.test(s)) {
    conditions.push({ cond: 'Gastroenteritis', score: 0.70, tags: ['stomach'] })
  }
  
  if (conditions.length === 0) {
    conditions.push({ cond: 'Non-specific symptoms', score: 0.30, tags: [] })
  }
  
  conditions.sort((a, b) => b.score - a.score)
  const primary = conditions[0]
  const confidence = primary.score
  
  return { primary, others: conditions.slice(1), confidence }
}

function renderResult(analysis, patientId) {
  const container = document.getElementById('result')
  container.innerHTML = ''
  
  const card = document.createElement('div')
  card.className = 'result-card'
  
  if (analysis.confidence > 0.75) {
    card.className += ' confidence-high'
  } else if (analysis.confidence > 0.4) {
    card.className += ' confidence-medium'
  } else {
    card.className += ' confidence-low'
  }
  
  const header = document.createElement('div')
  header.className = 'result-header'
  
  const title = document.createElement('h3')
  title.className = 'result-title'
  title.textContent = analysis.primary.cond
  
  const badge = document.createElement('span')
  badge.className = 'confidence-badge'
  const percent = Math.round(analysis.confidence * 100)
  badge.textContent = `${percent}% Confidence`
  
  if (analysis.confidence > 0.75) {
    badge.className += ' badge-high'
  } else if (analysis.confidence > 0.4) {
    badge.className += ' badge-medium'
  } else {
    badge.className += ' badge-low'
  }
  
  header.appendChild(title)
  header.appendChild(badge)
  card.appendChild(header)
  
  if (analysis.confidence > 0.75) {
    const description = document.createElement('p')
    description.style.marginBottom = '20px'
    description.textContent = 'High confidence prediction. We recommend these over-the-counter medications:'
    card.appendChild(description)
    
    const meds = mockPharmacy.filter(p => 
      p.conditionTags.some(tag => analysis.primary.tags.includes(tag))
    )
    
    const grid = document.createElement('div')
    grid.className = 'medicine-grid'
    
    meds.slice(0, 3).forEach(med => {
      const item = document.createElement('div')
      item.className = 'medicine-item'
      item.innerHTML = `
        <div class="medicine-info">
          <h4>${med.name}</h4>
          <span class="medicine-price">$${med.price.toFixed(2)}</span>
        </div>
        <button class="btn btn-primary" onclick="addToCart('${med.id}')">Add to Cart</button>
      `
      grid.appendChild(item)
    })
    
    card.appendChild(grid)
    
    const communityBtn = document.createElement('button')
    communityBtn.className = 'btn btn-secondary'
    communityBtn.style.marginTop = '20px'
    communityBtn.textContent = 'Join Cold & Flu Community'
    communityBtn.onclick = () => switchView('community')
    card.appendChild(communityBtn)
    
  } else if (analysis.confidence > 0.4) {
    const description = document.createElement('p')
    description.style.marginBottom = '20px'
    description.textContent = 'Moderate confidence. We suggest these lifestyle tips and community support:'
    card.appendChild(description)
    
    const tips = [
      'Stay well-hydrated with water and electrolyte drinks',
      'Get adequate rest and avoid strenuous activities',
      'Use over-the-counter pain relievers as needed',
      'Monitor symptoms and seek medical help if they worsen'
    ]
    
    const list = document.createElement('ul')
    list.className = 'tip-list'
    tips.forEach(tip => {
      const li = document.createElement('li')
      li.textContent = tip
      list.appendChild(li)
    })
    card.appendChild(list)
    
    const btnContainer = document.createElement('div')
    btnContainer.style.display = 'flex'
    btnContainer.style.gap = '12px'
    btnContainer.style.marginTop = '20px'
    
    const communityBtn = document.createElement('button')
    communityBtn.className = 'btn btn-primary'
    communityBtn.textContent = 'Visit Community'
    communityBtn.onclick = () => switchView('community')
    
    const pharmacyBtn = document.createElement('button')
    pharmacyBtn.className = 'btn btn-secondary'
    pharmacyBtn.textContent = 'Browse Pharmacy'
    pharmacyBtn.onclick = () => switchView('pharmacy')
    
    btnContainer.appendChild(communityBtn)
    btnContainer.appendChild(pharmacyBtn)
    card.appendChild(btnContainer)
    
  } else {
    const description = document.createElement('p')
    description.style.marginBottom = '20px'
    description.innerHTML = '<strong>Low confidence.</strong> Your symptoms may require professional evaluation. We recommend consulting with a doctor.'
    card.appendChild(description)
    
    const doctorBtn = document.createElement('button')
    doctorBtn.className = 'btn btn-primary'
    doctorBtn.textContent = 'Book a Doctor Appointment'
    doctorBtn.onclick = () => switchView('doctors')
    card.appendChild(doctorBtn)
  }
  
  container.appendChild(card)
}

function addToCart(productId) {
  const product = mockPharmacy.find(p => p.id === productId)
  if (!product) return
  
  const existing = cart.find(item => item.id === productId)
  if (existing) {
    existing.qty += 1
  } else {
    cart.push({ ...product, qty: 1, addedAt: new Date().toISOString() })
  }
  
  if (currentUser) {
    const patientId = currentUser.email
    healthHistory[patientId] = healthHistory[patientId] || []
    healthHistory[patientId].push({
      action: 'pharmacy',
      time: new Date().toISOString(),
      payload: { productId, productName: product.name }
    })
  }
  
  renderCart()
  showNotification(`${product.name} added to cart!`, 'success')
}

async function renderDoctors() {
  const container = document.getElementById('doctorsList')
  container.innerHTML = ''
  
  let bookedSlots = {}
  
  try {
    const appointments = await db.collection('appointments').get()
    appointments.forEach(doc => {
      const apt = doc.data()
      if (!bookedSlots[apt.doctorId]) {
        bookedSlots[apt.doctorId] = []
      }
      bookedSlots[apt.doctorId].push(apt.slot)
    })
  } catch (error) {
    console.error('Error loading booked slots:', error)
  }
  
  // Load real doctors from Firestore
  try {
    const doctorsSnapshot = await db.collection('doctors').get()
    
    if (doctorsSnapshot.empty) {
      container.innerHTML = '<div class="empty-state"><p>No doctors available at the moment.</p></div>'
      return
    }
    
    doctorsSnapshot.forEach(doc => {
      const doctor = doc.data()
      const doctorId = doc.id
      
      const card = document.createElement('div')
      card.className = 'doctor-card'
      
      // Generate default slots for each doctor
      const defaultSlots = [
        'Nov 1, 9:00 AM',
        'Nov 1, 10:00 AM',
        'Nov 1, 2:00 PM',
        'Nov 2, 11:00 AM',
        'Nov 2, 3:00 PM'
      ]
      
      const availableSlots = defaultSlots.filter(slot => {
        return !bookedSlots[doctorId] || !bookedSlots[doctorId].includes(slot)
      })
      
      const slotsHTML = availableSlots.length > 0 
        ? availableSlots.map(slot => `<span class="slot" onclick="selectSlot('${doctorId}', '${slot}')">${slot}</span>`).join('')
        : '<span style="color: var(--gray); font-size: 14px;">No slots available</span>'
      
      const initials = doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()
      
      card.innerHTML = `
        <div class="doctor-header">
          <div class="doctor-avatar">${initials}</div>
          <div class="doctor-info">
            <h3>${doctor.name}</h3>
            <div class="doctor-specialty">${doctor.specialty}</div>
            <div class="doctor-rating">★ 4.8</div>
          </div>
        </div>
        <div class="doctor-slots">
          <span class="slot-label">Select a Time Slot</span>
          <div class="slots" id="slots-${doctorId}">
            ${slotsHTML}
          </div>
        </div>
        <button class="btn btn-primary" onclick="bookDoctor('${doctorId}', '${doctor.name}', '${doctor.specialty}')" ${availableSlots.length === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Book Appointment</button>
      `
      
      container.appendChild(card)
    })
  } catch (error) {
    console.error('Error loading doctors:', error)
    container.innerHTML = '<div class="empty-state"><p>Error loading doctors. Please try again.</p></div>'
  }
}

let selectedSlots = {}

function selectSlot(doctorId, slot) {
  document.querySelectorAll(`#slots-${doctorId} .slot`).forEach(s => s.classList.remove('selected'))
  event.target.classList.add('selected')
  selectedSlots[doctorId] = slot
}

async function bookDoctor(doctorId, doctorName, doctorSpecialty) {
  if (!currentUser) {
    showNotification('Please login to book an appointment', 'error')
    switchView('hero')
    return
  }
  
  const slot = selectedSlots[doctorId]
  if (!slot) {
    showNotification('Please select a time slot first', 'error')
    return
  }
  
  try {
    const appointmentDate = new Date(slot).toDateString()
    
    const existingAppointment = await db.collection('appointments')
      .where('doctorId', '==', doctorId)
      .where('slot', '==', slot)
      .get()
    
    if (!existingAppointment.empty) {
      showNotification('This slot is already booked. Please select another.', 'error')
      return
    }
    
    const userAppointment = await db.collection('appointments')
      .where('patientId', '==', currentUser.uid)
      .where('doctorId', '==', doctorId)
      .where('date', '==', appointmentDate)
      .get()
    
    if (!userAppointment.empty) {
      showNotification('You already have an appointment with this doctor today.', 'error')
      return
    }
    
    await db.collection('appointments').add({
      doctorId: doctorId,
      doctorName: doctorName,
      doctorSpecialty: doctorSpecialty,
      patientId: currentUser.uid,
      patientName: currentUser.name,
      patientEmail: currentUser.email,
      slot: slot,
      date: appointmentDate,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    })
    
    const patientId = currentUser.email
    healthHistory[patientId] = healthHistory[patientId] || []
    healthHistory[patientId].push({
      action: 'book-appointment',
      time: new Date().toISOString(),
      payload: { doctorId, doctorName, patientName: currentUser.name, slot }
    })
    
    await saveUserData()
    
    showNotification(`Appointment booked with ${doctorName} for ${slot}!`, 'success')
    delete selectedSlots[doctorId]
    renderDoctors()
  } catch (error) {
    showNotification('Failed to book appointment: ' + error.message, 'error')
  }
}

function renderPharmacy() {
  const container = document.getElementById('pharmacyList')
  container.innerHTML = ''
  
  mockPharmacy.forEach(product => {
    const card = document.createElement('div')
    card.className = 'product-card'
    
    card.innerHTML = `
      <div style="display: flex; align-items: center;">
        <div class="product-icon">💊</div>
        <div class="product-details">
          <h4>${product.name}</h4>
          <div class="product-tags">
            ${product.conditionTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="product-actions">
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="btn btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    `
    
    container.appendChild(card)
  })
}

function renderCart() {
  const container = document.getElementById('cart')
  
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty">Your cart is empty</div>'
    return
  }
  
  container.innerHTML = ''
  
  cart.forEach(item => {
    const cartItem = document.createElement('div')
    cartItem.className = 'cart-item'
    cartItem.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 600;">${item.name}</div>
          <div style="font-size: 14px; color: var(--gray);">Qty: ${item.qty} × $${item.price.toFixed(2)}</div>
        </div>
        <div style="font-weight: 700; color: var(--teal);">$${(item.qty * item.price).toFixed(2)}</div>
      </div>
    `
    container.appendChild(cartItem)
  })
  
  const total = cart.reduce((sum, item) => sum + (item.qty * item.price), 0)
  const totalDiv = document.createElement('div')
  totalDiv.style.marginTop = '20px'
  totalDiv.style.paddingTop = '20px'
  totalDiv.style.borderTop = '2px solid var(--gray-light)'
  totalDiv.innerHTML = `
    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700;">
      <span>Total</span>
      <span style="color: var(--primary);">$${total.toFixed(2)}</span>
    </div>
    <button class="btn btn-primary" style="width: 100%; margin-top: 16px;" onclick="checkout()">Checkout</button>
  `
  container.appendChild(totalDiv)
}

async function checkout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'error')
    return
  }
  
  const total = cart.reduce((sum, item) => sum + (item.qty * item.price), 0)
  
  showNotification('Order placed successfully! 🎉', 'success')
  
  if (currentUser) {
    const patientId = currentUser.email
    healthHistory[patientId] = healthHistory[patientId] || []
    healthHistory[patientId].push({
      action: 'checkout',
      time: new Date().toISOString(),
      payload: { items: cart.length, total: total.toFixed(2), products: cart.map(c => c.name) }
    })
    await saveUserData()
  }
  
  cart = []
  renderCart()
}

let joinedCommunities = []

async function loadCommunities() {
  try {
    if (currentUser) {
      const userDoc = await db.collection('users').doc(currentUser.uid).get()
      joinedCommunities = userDoc.data()?.joinedCommunities || []
    }
  } catch (error) {
    console.error('Error loading communities:', error)
  }
}

async function renderCommunity() {
  const container = document.getElementById('topics')
  container.innerHTML = ''
  
  for (const topic of mockCommunity) {
    const card = document.createElement('div')
    const isJoined = joinedCommunities.includes(topic.id)
    card.className = `topic-card ${isJoined ? 'joined' : ''}`
    
    let memberCount = 150
    try {
      const communityDoc = await db.collection('communities').doc(topic.id).get()
      if (communityDoc.exists) {
        memberCount = communityDoc.data().members || 150
        topic.posts = communityDoc.data().posts || topic.posts
      }
    } catch (error) {
      console.error('Error loading community data:', error)
    }
    
    const header = document.createElement('div')
    header.className = 'topic-header'
    header.innerHTML = `
      <div class="topic-info">
        <div class="topic-icon">${topic.icon}</div>
        <div class="topic-details">
          <h3 class="topic-title">${topic.topic}</h3>
          <div class="topic-stats">
            <span>👥 ${memberCount} members</span>
            <span>•</span>
            <span>💬 ${topic.posts.length} posts</span>
          </div>
        </div>
      </div>
      <div class="topic-actions">
        <button class="join-btn ${isJoined ? 'joined' : ''}" onclick="toggleJoin('${topic.id}')">
          ${isJoined ? '✓ Joined' : '+ Join'}
        </button>
      </div>
    `
    card.appendChild(header)
    
    if (isJoined) {
      const posts = document.createElement('div')
      posts.className = 'posts'
      
      topic.posts.slice(0, 5).forEach(post => {
        const postDiv = document.createElement('div')
        postDiv.className = 'post'
        postDiv.innerHTML = `
          <div class="post-user">${post.user}</div>
          <div class="post-text">${post.text}</div>
          <div class="post-time">${post.time}</div>
        `
        posts.appendChild(postDiv)
      })
      
      card.appendChild(posts)
      
      const inputDiv = document.createElement('div')
      inputDiv.className = 'post-input'
      inputDiv.innerHTML = `
        <input type="text" placeholder="Share your experience..." id="post-${topic.id}">
        <button class="btn btn-primary" onclick="addPost('${topic.id}')">Post</button>
      `
      card.appendChild(inputDiv)
    }
    
    container.appendChild(card)
  }
}

async function toggleJoin(topicId) {
  if (!currentUser) {
    showNotification('Please login to join communities', 'error')
    return
  }
  
  const isJoined = joinedCommunities.includes(topicId)
  
  try {
    if (isJoined) {
      joinedCommunities = joinedCommunities.filter(id => id !== topicId)
      await db.collection('users').doc(currentUser.uid).update({
        joinedCommunities: joinedCommunities
      })
      
      const communityDoc = await db.collection('communities').doc(topicId).get()
      if (communityDoc.exists) {
        const currentMembers = communityDoc.data().members || 150
        await db.collection('communities').doc(topicId).update({
          members: Math.max(0, currentMembers - 1)
        })
      }
      
      showNotification('Left community', 'success')
    } else {
      joinedCommunities.push(topicId)
      await db.collection('users').doc(currentUser.uid).update({
        joinedCommunities: joinedCommunities
      })
      
      const communityDoc = await db.collection('communities').doc(topicId).get()
      if (communityDoc.exists) {
        const currentMembers = communityDoc.data().members || 150
        await db.collection('communities').doc(topicId).update({
          members: currentMembers + 1
        })
      } else {
        await db.collection('communities').doc(topicId).set({
          id: topicId,
          members: 151,
          posts: mockCommunity.find(t => t.id === topicId).posts
        })
      }
      
      showNotification('Joined community!', 'success')
    }
    
    renderCommunity()
  } catch (error) {
    showNotification('Failed to update community: ' + error.message, 'error')
  }
}

async function addPost(topicId) {
  const input = document.getElementById(`post-${topicId}`)
  const text = input.value.trim()
  
  if (!text) {
    showNotification('Please enter a message', 'error')
    return
  }
  
  if (!currentUser) {
    showNotification('Please login to post in the community', 'error')
    return
  }
  
  try {
    const topic = mockCommunity.find(t => t.id === topicId)
    const newPost = {
      user: currentUser.name || 'You',
      text: text,
      time: 'Just now',
      timestamp: new Date().toISOString()
    }
    
    topic.posts.unshift(newPost)
    
    const communityDoc = await db.collection('communities').doc(topicId).get()
    if (communityDoc.exists) {
      await db.collection('communities').doc(topicId).update({
        posts: firebase.firestore.FieldValue.arrayUnion(newPost)
      })
    } else {
      await db.collection('communities').doc(topicId).set({
        id: topicId,
        members: 150,
        posts: [newPost]
      })
    }
    
    const patientId = currentUser.email
    healthHistory[patientId] = healthHistory[patientId] || []
    healthHistory[patientId].push({
      action: 'community-post',
      time: new Date().toISOString(),
      payload: { topicId, topic: topic.topic, text }
    })
    
    await saveUserData()
    
    input.value = ''
    renderCommunity()
    showNotification('Post added successfully!', 'success')
  } catch (error) {
    showNotification('Failed to post: ' + error.message, 'error')
  }
}

function searchCommunities() {
  const searchTerm = document.getElementById('communitySearch').value.toLowerCase()
  
  if (!searchTerm) {
    renderCommunity()
    return
  }
  
  const container = document.getElementById('topics')
  const cards = container.querySelectorAll('.topic-card')
  
  cards.forEach(card => {
    const title = card.querySelector('.topic-title').textContent.toLowerCase()
    if (title.includes(searchTerm)) {
      card.style.display = 'block'
    } else {
      card.style.display = 'none'
    }
  })
}

document.getElementById('loadTrack').addEventListener('click', () => {
  let trackerId = document.getElementById('trackerId').value.trim()
  
  if (!trackerId && currentUser) {
    trackerId = currentUser.email
  }
  
  if (!trackerId) {
    showNotification('Please enter a Patient ID or login to view your history', 'info')
    return
  }
  
  renderHistory(trackerId)
  showNotification('History loaded!', 'success')
})

function renderHistory(patientId) {
  const container = document.getElementById('history')
  const userHistory = healthHistory[patientId] || []
  
  if (userHistory.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: var(--gray); padding: 40px;">No activity history found for this patient ID. Start using the app to track your health journey!</div>'
    return
  }
  
  container.innerHTML = ''
  
  userHistory.slice().reverse().forEach(item => {
    const timelineItem = document.createElement('div')
    timelineItem.className = 'timeline-item'
    
    const action = document.createElement('div')
    action.className = 'timeline-action'
    action.textContent = item.action.replace(/-/g, ' ')
    
    const time = document.createElement('div')
    time.className = 'timeline-time'
    time.textContent = new Date(item.time).toLocaleString()
    
    const details = document.createElement('div')
    details.className = 'timeline-details'
    details.textContent = JSON.stringify(item.payload, null, 2)
    
    timelineItem.appendChild(action)
    timelineItem.appendChild(time)
    timelineItem.appendChild(details)
    
    container.appendChild(timelineItem)
  })
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications')
  
  const notif = document.createElement('div')
  notif.className = `notification ${type}`
  notif.textContent = message
  
  container.appendChild(notif)
  
  setTimeout(() => {
    notif.style.animation = 'slideInRight 0.4s ease reverse'
    setTimeout(() => notif.remove(), 400)
  }, 3000)
}

async function updateProfileUI() {
  if (!currentUser) {
    document.getElementById('profileName').textContent = 'Guest User'
    document.getElementById('profilePatientId').textContent = 'N/A'
    document.getElementById('profileEmail').textContent = 'Not logged in'
    document.getElementById('profileJoinDate').textContent = 'N/A'
    document.getElementById('profileLogoutBtn').style.display = 'none'
    return
  }
  
  document.getElementById('profileName').textContent = currentUser.name
  document.getElementById('profilePatientId').textContent = currentUser.patientId || 'N/A'
  document.getElementById('profileEmail').textContent = currentUser.email
  document.getElementById('profileLogoutBtn').style.display = 'block'
  
  const userDoc = await db.collection('users').doc(currentUser.uid).get()
  const userData = userDoc.data()
  
  if (userData?.createdAt) {
    const date = new Date(userData.createdAt)
    document.getElementById('profileJoinDate').textContent = date.toLocaleDateString()
  }
  
  if (userData?.photoURL) {
    document.getElementById('profileAvatar').innerHTML = `<img src="${userData.photoURL}" alt="Profile">`
  } else {
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    document.getElementById('profileAvatar').textContent = initials
  }
  
  renderProfileHistory()
  renderUserCommunities()
  renderUserAppointments()
}

function renderProfileHistory() {
  const container = document.getElementById('profileTimeline')
  const patientId = currentUser?.email
  
  if (!patientId || !healthHistory[patientId] || healthHistory[patientId].length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No health history yet. Start by checking symptoms or booking appointments!</p></div>'
    return
  }
  
  container.innerHTML = ''
  const events = healthHistory[patientId].slice().reverse()
  
  events.forEach(event => {
    const item = document.createElement('div')
    item.className = 'timeline-item'
    
    const icon = document.createElement('div')
    icon.className = 'timeline-icon'
    
    let iconText = '📋'
    let title = 'Activity'
    let details = ''
    
    if (event.action === 'symptom-check') {
      iconText = '🔍'
      title = 'Symptom Check'
      details = `Checked symptoms: ${event.payload.symptoms}`
    } else if (event.action === 'book-appointment') {
      iconText = '👨‍⚕️'
      title = 'Appointment Booked'
      details = `${event.payload.doctorName} - ${event.payload.slot}`
    } else if (event.action === 'pharmacy') {
      iconText = '💊'
      title = 'Added to Cart'
      details = event.payload.productName
    } else if (event.action === 'community-post') {
      iconText = '💬'
      title = 'Community Post'
      details = `${event.payload.topic}: "${event.payload.text}"`
    }
    
    icon.textContent = iconText
    item.appendChild(icon)
    
    const content = document.createElement('div')
    content.className = 'timeline-content'
    
    const titleDiv = document.createElement('div')
    titleDiv.className = 'timeline-title'
    titleDiv.textContent = title
    content.appendChild(titleDiv)
    
    const detailsDiv = document.createElement('div')
    detailsDiv.className = 'timeline-details'
    detailsDiv.textContent = details
    content.appendChild(detailsDiv)
    
    const timeDiv = document.createElement('div')
    timeDiv.className = 'timeline-time'
    timeDiv.textContent = new Date(event.time).toLocaleString()
    content.appendChild(timeDiv)
    
    item.appendChild(content)
    container.appendChild(item)
  })
}

async function renderUserCommunities() {
  const container = document.getElementById('userCommunities')
  
  if (!currentUser || joinedCommunities.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>You haven\'t joined any communities yet. Visit the Community page to join!</p></div>'
    return
  }
  
  container.innerHTML = ''
  
  joinedCommunities.forEach(async (communityId) => {
    const topic = mockCommunity.find(t => t.id === communityId)
    if (!topic) return
    
    const card = document.createElement('div')
    card.className = 'topic-card'
    card.style.marginBottom = '16px'
    card.innerHTML = `
      <div class="topic-header">
        <div class="topic-info">
          <div class="topic-icon">${topic.icon}</div>
          <div class="topic-details">
            <h3 class="topic-title">${topic.topic}</h3>
          </div>
        </div>
      </div>
    `
    container.appendChild(card)
  })
}

async function renderUserAppointments() {
  const container = document.getElementById('userAppointments')
  
  if (!currentUser) {
    container.innerHTML = '<div class="empty-state"><p>No appointments booked yet.</p></div>'
    return
  }
  
  try {
    const appointments = await db.collection('appointments')
      .where('patientId', '==', currentUser.uid)
      .get()
    
    if (appointments.empty) {
      container.innerHTML = '<div class="empty-state"><p>No appointments booked yet.</p></div>'
      return
    }
    
    container.innerHTML = ''
    
    const aptList = []
    appointments.forEach(doc => {
      aptList.push({ id: doc.id, ...doc.data() })
    })
    
    aptList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    aptList.forEach(apt => {
      const card = document.createElement('div')
      card.className = 'timeline-item'
      card.style.marginBottom = '16px'
      card.innerHTML = `
        <div class="timeline-icon">👨‍⚕️</div>
        <div class="timeline-content">
          <div class="timeline-title">${apt.doctorName}</div>
          <div class="timeline-details">${apt.slot}</div>
          <div class="timeline-time">${new Date(apt.createdAt).toLocaleDateString()}</div>
          <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background: ${apt.status === 'confirmed' ? '#28a745' : '#ffc107'}; color: white; border-radius: 6px; font-size: 12px; font-weight: 600;">${apt.status}</span>
          ${apt.status === 'confirmed' ? `<div style="margin-top:10px; display: flex; gap: 8px;">
            <button class="btn btn-secondary" style="padding:6px 10px; font-size:12px" onclick="cancelUserAppointment('${apt.id}')">Cancel</button>
            ${apt.meetingLink ? `<button class="btn btn-primary" style="padding:6px 10px; font-size:12px" onclick="openMeetingById('${apt.meetingId}')">Join Meeting</button>` : ''}
          </div>` : ''}
        </div>
      `
      container.appendChild(card)
    })
  } catch (error) {
    console.error('Error loading appointments:', error)
    container.innerHTML = '<div class="empty-state"><p>Error loading appointments.</p></div>'
  }
}

function showRequestCommunity() {
  if (!currentUser) {
    showNotification('Please login to request a community', 'error')
    return
  }
  document.getElementById('requestCommunityModal').classList.remove('hidden')
}

function closeRequestCommunity() {
  document.getElementById('requestCommunityModal').classList.add('hidden')
}

let selectedIconValue = '🏥'

function selectIcon(icon) {
  selectedIconValue = icon
  document.getElementById('selectedIcon').value = icon
  
  document.querySelectorAll('.icon-option').forEach(btn => btn.classList.remove('selected'))
  event.target.classList.add('selected')
}

async function submitCommunityRequest() {
  const name = document.getElementById('requestCommunityName').value.trim()
  const desc = document.getElementById('requestCommunityDesc').value.trim()
  const icon = selectedIconValue
  
  if (!name || !desc) {
    showNotification('Please fill in all fields', 'error')
    return
  }
  
  if (!currentUser) {
    showNotification('Please login to submit a request', 'error')
    return
  }
  
  try {
    await db.collection('communityRequests').add({
      name: name,
      description: desc,
      icon: icon,
      requestedBy: currentUser.uid,
      requestedByName: currentUser.name,
      requestedByEmail: currentUser.email,
      status: 'pending',
      createdAt: new Date().toISOString()
    })
    
    showNotification('Community request submitted! We\'ll review it soon.', 'success')
    closeRequestCommunity()
    
    document.getElementById('requestCommunityName').value = ''
    document.getElementById('requestCommunityDesc').value = ''
  } catch (error) {
    showNotification('Failed to submit request: ' + error.message, 'error')
  }
}

async function exportHealthData() {
  if (!currentUser) {
    showNotification('Please login to export data', 'error')
    return
  }
  
  const data = {
    user: currentUser,
    healthHistory: healthHistory[currentUser.email] || [],
    joinedCommunities: joinedCommunities,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `smartcare-health-data-${currentUser.patientId}.json`
  a.click()
  
  showNotification('Health data exported successfully!', 'success')
}

async function deleteAccount() {
  if (!currentUser) return
  
  const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
  
  if (!confirm) return
  
  const password = window.prompt('Please enter your password to confirm account deletion:')
  
  if (!password) {
    showNotification('Account deletion cancelled', 'info')
    return
  }
  
  try {
    const credential = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      password
    )
    
    await auth.currentUser.reauthenticateWithCredential(credential)
    
    await db.collection('users').doc(currentUser.uid).delete()
    
    const appointments = await db.collection('appointments')
      .where('patientId', '==', currentUser.uid)
      .get()
    
    const batch = db.batch()
    appointments.forEach(doc => {
      batch.delete(doc.ref)
    })
    await batch.commit()
    
    await auth.currentUser.delete()
    
    currentUser = null
    joinedCommunities = []
    healthHistory = {}
    
    showNotification('Account deleted successfully', 'success')
    updateAuthUI()
    switchView('hero')
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      showNotification('Incorrect password. Account deletion cancelled.', 'error')
    } else {
      showNotification('Failed to delete account: ' + error.message, 'error')
    }
  }
}

function updateDoctorUI() {
  const authSection = document.getElementById('authSection')
  
  if (currentDoctor) {
    const initials = currentDoctor.name.split(' ').map(n => n[0]).join('').toUpperCase()
    authSection.innerHTML = `
      <div class="user-info" onclick="switchView('doctorDashboard')" style="cursor: pointer;">
        <div class="user-avatar" style="background: linear-gradient(135deg, #28a745, #20c997);">${initials}</div>
        <span class="user-name">${currentDoctor.name}</span>
      </div>
    `
    
    document.getElementById('doctorName').textContent = currentDoctor.name
    document.getElementById('doctorSpecialty').textContent = currentDoctor.specialty
    document.getElementById('doctorEmailDisplay').textContent = currentDoctor.email
    document.getElementById('doctorLicense').textContent = currentDoctor.license
    
    document.getElementById('doctorLogoutBtn').onclick = async () => {
      await auth.signOut()
      currentDoctor = null
      updateAuthUI()
      switchView('hero')
      showNotification('Logged out successfully', 'info')
    }
  }
}

async function renderDoctorAppointments() {
  const container = document.getElementById('doctorAppointmentsList')
  
  if (!currentDoctor) {
    container.innerHTML = '<div class="empty-state"><p>Please log in as a doctor.</p></div>'
    return
  }
  
  try {
    // Get appointments for THIS doctor's ID (not specialty)
    const appointments = await db.collection('appointments')
      .where('doctorId', '==', currentDoctor.id)
      .where('status', '==', 'confirmed')
      .get()
    
    if (appointments.empty) {
      container.innerHTML = '<div class="empty-state"><p>No appointments scheduled yet.</p></div>'
      return
    }
    
    container.innerHTML = ''
    
    const aptList = []
    appointments.forEach(doc => {
      aptList.push({ id: doc.id, ...doc.data() })
    })
    
    aptList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    aptList.forEach(apt => {
      const card = document.createElement('div')
      card.className = 'timeline-item'
      card.style.marginBottom = '16px'
      card.innerHTML = `
        <div class="timeline-icon">👤</div>
        <div class="timeline-content">
          <div class="timeline-title">${apt.patientName}</div>
          <div class="timeline-details">
            <div>📅 ${apt.slot}</div>
            <div>📧 ${apt.patientEmail}</div>
            <div>🆔 Patient ID: ${apt.patientId}</div>
          </div>
          <div class="timeline-time">${new Date(apt.createdAt).toLocaleDateString()}</div>
          <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="startMeetingForAppointment('${apt.id}', '${apt.patientName}', '${apt.patientEmail}')">Start Meeting</button>
            <button class="btn btn-secondary" onclick="viewPatientHistory('${apt.patientId}', '${apt.patientEmail}')">View History</button>
            <button class="btn btn-secondary" onclick="addPatientHistory('${apt.patientId}')">Add History</button>
            <button class="btn btn-danger" style="background:#dc3545" onclick="cancelDoctorAppointment('${apt.id}')">Cancel</button>
            ${apt.meetingId ? `<button class="btn btn-secondary" onclick="deleteMeeting('${apt.meetingId}','${apt.id}')">End Meeting</button>` : ''}
          </div>
        </div>
      `
      container.appendChild(card)
    })
  } catch (error) {
    console.error('Error loading doctor appointments:', error)
    container.innerHTML = '<div class="empty-state"><p>Error loading appointments.</p></div>'
  }
}

async function viewPatientHistory(patientId, patientEmail) {
  try {
    let docRef = db.collection('healthHistory').doc(patientId)
    let userDoc = await docRef.get()
    // Fallback to email-keyed docs for legacy data
    if (!userDoc.exists && patientEmail) {
      userDoc = await db.collection('healthHistory').doc(patientEmail).get()
    }
    
    if (!userDoc.exists) {
      showNotification('No health history found for this patient', 'info')
      return
    }
    
    const history = userDoc.data().events || []
    
    let historyHTML = `<div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h3 style="margin:0;">Patient History</h3>
        <div>
          <button class="btn btn-secondary" onclick="addPatientHistory('${patientId}')">+ Add History</button>
        </div>
      </div>
      <div style="color: var(--gray); margin: 6px 0 14px;">${patientEmail ? `Email: ${patientEmail} • ` : ''}ID: ${patientId}</div>
      <div class="timeline">`
    
    history.slice().reverse().forEach(event => {
      let icon = '📋'
      let title = 'Activity'
      
      if (event.action === 'symptom-check') icon = '🔍'
      else if (event.action === 'book-appointment') icon = '👨‍⚕️'
      else if (event.action === 'pharmacy') icon = '💊'
      else if (event.action === 'checkout') icon = '🛒'
      else if (event.action === 'doctor-note') icon = '🩺'
      
      historyHTML += `
        <div class="timeline-item">
          <div class="timeline-icon">${icon}</div>
          <div class="timeline-content">
            <div class="timeline-title">${(event.payload && event.payload.title) ? event.payload.title : event.action}</div>
            <div class="timeline-time">${new Date(event.time).toLocaleString()}</div>
            ${event.payload && event.payload.notes ? `<div class=\"timeline-details\">${event.payload.notes}</div>` : ''}
          </div>
        </div>
      `
    })
    
    historyHTML += '</div>'
    
    document.getElementById('doctorPatientsTab').innerHTML = historyHTML
    document.querySelector('[data-tab="doctorPatients"]').click()
  } catch (error) {
    showNotification('Error loading patient history: ' + error.message, 'error')
  }
}

// Doctor adds a history entry for a patient (by patient UID)
async function addPatientHistory(patientId) {
  if (!currentDoctor) {
    showNotification('Only doctors can add patient history', 'error')
    return
  }
  try {
    const title = prompt('Add history title (e.g., Diagnosis, Prescription, Follow-up):')
    if (!title) {
      showNotification('Cancelled: no title provided', 'info')
      return
    }
    const notes = prompt('Enter details/notes:')
    if (!notes) {
      showNotification('Cancelled: no details provided', 'info')
      return
    }
    const event = {
      action: 'doctor-note',
      time: new Date().toISOString(),
      payload: {
        title,
        notes,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name
      }
    }
    const ref = db.collection('healthHistory').doc(patientId)
    const docSnap = await ref.get()
    if (docSnap.exists) {
      const events = docSnap.data().events || []
      events.push(event)
      await ref.set({ events, updatedAt: new Date().toISOString() })
    } else {
      await ref.set({ events: [event], updatedAt: new Date().toISOString() })
    }
    showNotification('History added for patient', 'success')
    // Refresh the patient history view if open
    viewPatientHistory(patientId)
  } catch (e) {
    showNotification('Failed to add history: ' + e.message, 'error')
  }
}

function createMeeting() {
  const meetingId = 'meet-' + Math.random().toString(36).substr(2, 9)
  const meetingLink = `${location.origin}${location.pathname}?meeting=${meetingId}`
  
  const meeting = {
    id: meetingId,
    doctor: currentDoctor.name,
    link: meetingLink,
    createdAt: new Date().toISOString(),
    participants: []
  }
  
  activeMeetings.push(meeting)
  
  db.collection('meetings').doc(meetingId).set(meeting)
  
  renderMeetings()
  showNotification('Meeting room created! Share the link with your patient.', 'success')
}

async function startMeetingForAppointment(appointmentId, patientName, patientEmail) {
  const meetingId = 'meet-' + Math.random().toString(36).substr(2, 9)
  const meetingLink = `${location.origin}${location.pathname}?meeting=${meetingId}`
  
  const meeting = {
    id: meetingId,
    doctor: currentDoctor.name,
    patient: patientName,
    patientEmail: patientEmail,
    appointmentId: appointmentId,
    link: meetingLink,
    status: 'active',
    createdAt: new Date().toISOString()
  }
  
  try {
    await db.collection('meetings').doc(meetingId).set(meeting)
    
    await db.collection('appointments').doc(appointmentId).update({
      meetingLink: meetingLink,
      meetingId: meetingId,
      meetingStatus: 'active'
    })
    
    activeMeetings.push(meeting)
    renderMeetings()
    
    const confirmOpen = confirm(`Meeting created for ${patientName}!\n\nMeeting Link: ${meetingLink}\n\nClick OK to open the meeting.`)
    if (confirmOpen) {
      openMeetingById(meetingId)
    }
    
    showNotification('Meeting started! Share link with patient.', 'success')
  } catch (error) {
    showNotification('Error starting meeting: ' + error.message, 'error')
  }
}

function renderMeetings() {
  const container = document.getElementById('meetingsList')
  
  if (activeMeetings.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No active meetings</p></div>'
    return
  }
  
  container.innerHTML = ''
  
  activeMeetings.forEach(meeting => {
    const card = document.createElement('div')
    card.className = 'timeline-item'
    card.style.marginBottom = '16px'
    card.innerHTML = `
      <div class="timeline-icon">📹</div>
      <div class="timeline-content">
        <div class="timeline-title">${meeting.patient || 'General Consultation'}</div>
        <div class="timeline-details">
          <div>🔗 <a href="${meeting.link}" target="_self" style="color: var(--primary);">${meeting.link}</a></div>
          <div style="margin-top: 8px;">
            <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${meeting.link}'); showNotification('Link copied!', 'success')" style="font-size: 12px; padding: 6px 12px;">Copy Link</button>
            <button class="btn btn-primary" onclick="openMeetingById('${meeting.id}')" style="font-size: 12px; padding: 6px 12px; margin-left: 8px;">Join</button>
            <button class="btn btn-danger" onclick="deleteMeeting('${meeting.id}','${meeting.appointmentId || ''}')" style="font-size: 12px; padding: 6px 12px; margin-left: 8px; background: #dc3545;">End</button>
          </div>
        </div>
      </div>
    `
    container.appendChild(card)
  })
}

// Open meeting modal with Jitsi embed
function openMeetingById(meetingId) {
  const frame = document.getElementById('meetingFrame')
  if (!frame) return
  const room = `SmartCare-${meetingId}`
  frame.src = `https://meet.jit.si/${room}`
  document.getElementById('meetingModal').classList.remove('hidden')
}

function closeMeetingModal() {
  const frame = document.getElementById('meetingFrame')
  if (frame) frame.src = ''
  document.getElementById('meetingModal').classList.add('hidden')
}

async function deleteMeeting(meetingId, appointmentId) {
  try {
    await db.collection('meetings').doc(meetingId).delete()
    if (appointmentId) {
      await db.collection('appointments').doc(appointmentId).update({
        meetingLink: firebase.firestore.FieldValue.delete(),
        meetingId: firebase.firestore.FieldValue.delete(),
        meetingStatus: 'ended'
      })
    }
    activeMeetings = activeMeetings.filter(m => m.id !== meetingId)
    renderMeetings()
    showNotification('Meeting ended.', 'success')
  } catch (e) {
    showNotification('Failed to end meeting: ' + e.message, 'error')
  }
}

// Cancel appointment as patient
async function cancelUserAppointment(appointmentId) {
  try {
    await db.collection('appointments').doc(appointmentId).update({ status: 'cancelled' })
    showNotification('Appointment cancelled', 'success')
    renderUserAppointments()
    renderDoctors()
  } catch (e) {
    showNotification('Failed to cancel: ' + e.message, 'error')
  }
}

// Cancel appointment as doctor
async function cancelDoctorAppointment(appointmentId) {
  try {
    await db.collection('appointments').doc(appointmentId).update({ status: 'cancelled' })
    showNotification('Appointment cancelled', 'success')
    renderDoctorAppointments()
    renderDoctors()
  } catch (e) {
    showNotification('Failed to cancel: ' + e.message, 'error')
  }
}

document.querySelectorAll('[data-tab]').forEach(tab => {
  if (tab.dataset.tab.startsWith('doctor')) {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'))
      document.querySelectorAll('.profile-tab-content').forEach(c => c.classList.remove('active'))
      
      tab.classList.add('active')
      const tabName = tab.dataset.tab
      document.getElementById(tabName + 'Tab').classList.add('active')
      
      if (tabName === 'doctorAppointments') renderDoctorAppointments()
      if (tabName === 'doctorMeetings') renderMeetings()
    })
  }
})


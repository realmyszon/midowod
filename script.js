// select DOM
const givenInput = document.getElementById('givenName');
const familyInput = document.getElementById('familyName');
const countrySelect = document.getElementById('country');
const dobInput = document.getElementById('dob');
const idInput = document.getElementById('idNumber');
const photoInput = document.getElementById('photoInput');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');

const displayGiven = document.getElementById('displayGiven');
const displayFamily = document.getElementById('displayFamily');
const displayCountry = document.getElementById('displayCountry');
const displayDob = document.getElementById('displayDob');
const displayId = document.getElementById('displayId');
const photoPreview = document.getElementById('photoPreview');
const flagEl = document.getElementById('flag');

const STORAGE_KEY = 'mdowod_demo_v1';

// flag SVGs as data URLs
const FLAGS = {
  PL: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="200" y="0" fill="%23ffffff"/><rect width="600" height="200" y="200" fill="%23dc143c"/></svg>',
  UZ: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="%23007A3D"/><rect width="600" height="280" y="60" fill="%23ffffff"/><rect width="600" height="220" y="90" fill="%23007A3D"/><g transform="translate(70,120) scale(0.9)"><circle cx="60" cy="40" r="12" fill="%23fff"/><path d="M90 30 a20 20 0 1 0 0.0001 0" fill="%23fff"/></g></svg>'
};

// format date dd.mm.yyyy
function formatDateISOToPolish(iso){
  if(!iso) return '';
  const d = new Date(iso);
  if(isNaN(d)) return iso;
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yy = d.getFullYear();
  return `${dd}.${mm}.${yy}`;
}

// load state
function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return;
  try{
    const s = JSON.parse(raw);
    givenInput.value = s.givenName || '';
    familyInput.value = s.familyName || '';
    countrySelect.value = s.country || 'PL';
    dobInput.value = s.dob || '';
    idInput.value = s.idNumber || '';
    if(s.photoData) photoPreview.src = s.photoData;
    else photoPreview.src = photoPreview.src; // keep default
    renderPreview();
  }catch(e){ console.warn('load error', e) }
}

// save state
function saveState(){
  const data = {
    givenName: givenInput.value,
    familyName: familyInput.value,
    country: countrySelect.value,
    dob: dobInput.value,
    idNumber: idInput.value,
    photoData: photoPreview.src
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderPreview();
  alert('Dane zapisane lokalnie (localStorage).');
}

// reset
function resetState(){
  localStorage.removeItem(STORAGE_KEY);
  // reset fields
  givenInput.value = '';
  familyInput.value = '';
  countrySelect.value = 'PL';
  dobInput.value = '';
  idInput.value = '';
  // reset photo to default (keeps the shipped sample image)
  photoPreview.src = '/mnt/data/B7F0AF9D-9E59-4995-8C55-D338B1BDDED0.jpeg';
  renderPreview();
}

// render preview
function renderPreview(){
  displayGiven.textContent = (givenInput.value || 'IMIĘ').toUpperCase();
  displayFamily.textContent = (familyInput.value || 'NAZWISKO').toUpperCase();
  displayCountry.textContent = countrySelect.value === 'PL' ? 'POLSKIE' : 'UZBEKISTAN';
  displayDob.textContent = dobInput.value ? formatDateISOToPolish(dobInput.value) : '';
  displayId.textContent = idInput.value || '';
  flagEl.style.backgroundImage = `url("${FLAGS[countrySelect.value] || FLAGS.PL}")`;
}

// handle photo input
photoInput.addEventListener('change', (ev)=>{
  const f = ev.target.files && ev.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    photoPreview.src = reader.result;
  };
  reader.readAsDataURL(f);
});

// bindings
saveBtn.addEventListener('click', saveState);
resetBtn.addEventListener('click', ()=>{
  if(confirm('Na pewno zresetować zapisane dane?')) resetState();
});

// immediate render when typing
[givenInput,familyInput,countrySelect,dobInput,idInput].forEach(el=>{
  el.addEventListener('input', renderPreview);
  el.addEventListener('change', renderPreview);
});

// initial
loadState();
renderPreview();

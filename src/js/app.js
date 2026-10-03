const PROFILE_KEY='portfolio_forge_profile'; const THEME_KEY='portfolio_forge_theme';

const DEMO={
  name:'Demo Creator',email:'demo@portfolio.dev',password:'Portfolio123!',
  bio:'Student / creator turning ideas into practical projects.',
  school:'Your School',college:'Your College',currentStudy:'Your Current Degree',nextGoal:'Build and publish more real-world projects.',
  skills:['HTML5','Tailwind CSS','JavaScript','Git'],
  projects:[
    {title:'Portfolio Website',status:'completed',description:'A responsive portfolio built with HTML, Tailwind CSS and JavaScript.',tech:['HTML5','Tailwind CSS','JavaScript']},
    {title:'AI Mini Project',status:'progress',description:'An ongoing project where I am applying machine learning concepts.',tech:['Python','AI','Git']},
    {title:'Next Idea',status:'idea',description:'A future experiment I want to turn into a complete portfolio project.',tech:['AI','Design']}
  ],
  photo:'../../assets/avatar-placeholder.svg'
};

function getProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'null')}catch{return null}}
function normalizeProfile(p){
  if(!p)return null;
  if(!Array.isArray(p.skills))p.skills=[];
  if(!Array.isArray(p.projects)){
    const completed=Math.max(0,Number(p.completed)||0), progress=Math.max(0,Number(p.inProgress)||0);
    p.projects=[];
    for(let i=0;i<completed;i++)p.projects.push({title:`Completed Project ${i+1}`,status:'completed',description:'Add a description for this project.',tech:[]});
    for(let i=0;i<progress;i++)p.projects.push({title:`Project in Progress ${i+1}`,status:'progress',description:'Add what you are currently building.',tech:[]});
  }
  p.projects=p.projects.map(x=>({title:x.title||'Untitled Project',status:['completed','progress','idea'].includes(x.status)?x.status:'completed',description:x.description||'',tech:Array.isArray(x.tech)?x.tech:[]}));
  p.completed=p.projects.filter(x=>x.status==='completed').length;
  p.inProgress=p.projects.filter(x=>x.status==='progress').length;
  if(!p.nextGoal)p.nextGoal='Add your next learning or career goal.';
  return p;
}
function setProfile(p){localStorage.setItem(PROFILE_KEY,JSON.stringify(normalizeProfile(p)))} 
function deleteProfile(){localStorage.removeItem(PROFILE_KEY)}
function esc(v){const d=document.createElement('div');d.textContent=v??'';return d.innerHTML}
function page(){return document.body.dataset.page||''}
function path(n){return page()==='home'?`src/pages/${n}.html`:`../pages/${n}.html`}
function home(){return page()==='home'?'index.html':'../../index.html'}
function avatarPath(){return page()==='home'?'assets/avatar-placeholder.svg':'../../assets/avatar-placeholder.svg'}
function toast(t){const x=document.createElement('div');x.className='toast';x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),2500)}
function themeApply(t){document.body.classList.toggle('dark',t==='dark');const b=document.getElementById('themeToggle');if(b){b.textContent=t==='dark'?'☀':'☾';b.title=t==='dark'?'Switch to light mode':'Switch to dark mode'}}
function initTheme(){themeApply(localStorage.getItem(THEME_KEY)||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));document.getElementById('themeToggle')?.addEventListener('click',()=>{const n=document.body.classList.contains('dark')?'light':'dark';localStorage.setItem(THEME_KEY,n);themeApply(n)})}

function renderNav(){
 const el=document.getElementById('app-nav');if(!el)return;
 const p=page(),profile=getProfile();
 const links=[['index.html','Home','home'],['about.html','About','about'],['contact.html','Contact','contact'],['signin.html','Sign In','signin'],['signup.html','Sign Up','signup']];
 el.innerHTML=`<header class="site-nav"><nav class="nav-inner" id="navInner"><a class="brand" href="${home()}"><span class="brand-mark">PF</span><span class="brand-copy">PortfolioForge<small>WEB TECHNOLOGIES</small></span></a><button class="mobile-btn" id="mobileBtn">☰</button><div class="nav-links">${links.map(([h,l,k])=>{const href=k==='home'?(p==='home'?'index.html':'../../index.html'):(p==='home'?`src/pages/${h}`:`../pages/${h}`);return `<a href="${href}" class="${p===k?'active':''}">${l}</a>`}).join('')}</div><div class="nav-actions"><button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode">☾</button>${profile?'<button class="btn btn-primary nav-cta" id="editProfileBtn">Edit Portfolio</button>':`<a class="btn btn-primary nav-cta" href="${path('signup')}">Build yours</a>`}</div></nav></header>`;
 document.getElementById('mobileBtn')?.addEventListener('click',()=>document.getElementById('navInner').classList.toggle('nav-open'));
 document.getElementById('editProfileBtn')?.addEventListener('click',openModal);
}

function renderFooter(){
 const el=document.getElementById('app-footer');if(!el)return;
 el.innerHTML=`<footer class="site-footer"><div class="footer-grid"><div><div class="brand"><span class="brand-mark">PF</span><span class="brand-copy text-white">PortfolioForge<small>FIVE-PAGE PROJECT</small></span></div><p class="mt-4 max-w-sm">A bold student portfolio maker built with HTML5, Tailwind CSS and JavaScript for Web Technologies Assignment 01.</p><div class="footer-social"><a class="social-btn" href="https://github.com/" target="_blank">GH</a><a class="social-btn" href="https://www.linkedin.com/" target="_blank">in</a><a class="social-btn" href="mailto:hello@portfolioforge.dev">@</a></div></div><div><h3>Navigate</h3><a class="footer-link" href="${home()}">Home</a><a class="footer-link" href="${path('about')}">About</a><a class="footer-link" href="${path('contact')}">Contact</a><a class="footer-link" href="${path('signin')}">Sign In</a><a class="footer-link" href="${path('signup')}">Sign Up</a></div><div><h3>Contact</h3><a class="footer-link" href="mailto:hello@portfolioforge.dev">hello@portfolioforge.dev</a><a class="footer-link" href="tel:+923000000000">+92 300 000 0000</a><p>Lahore, Pakistan</p></div></div><div class="footer-bottom">© 2026 PortfolioForge • Web Technologies Assignment 01</div></footer>`
}

function showStatus(id,text,type=''){const el=document.getElementById(id);if(el){el.textContent=text;el.className=`form-status ${type}`}}

function projectRow(x,i){
 return `<div class="crud-row project-edit-row" data-index="${i}">
   <div class="crud-main">
     <input class="crud-title project-title" value="${esc(x.title)}" placeholder="Project title">
     <select class="project-status-input"><option value="completed" ${x.status==='completed'?'selected':''}>Completed</option><option value="progress" ${x.status==='progress'?'selected':''}>In progress</option><option value="idea" ${x.status==='idea'?'selected':''}>Next idea</option></select>
     <textarea class="project-description" rows="2" placeholder="What did you build?">${esc(x.description)}</textarea>
     <input class="project-tech" value="${esc((x.tech||[]).join(', '))}" placeholder="Technology: Python, SQL, Git">
   </div>
   <button type="button" class="crud-delete delete-project" title="Delete project">Delete</button>
 </div>`
}
function skillRow(s,i){
 return `<div class="crud-row skill-edit-row" data-index="${i}"><input class="skill-input" value="${esc(s)}" placeholder="Skill name"><button type="button" class="crud-delete delete-skill">Delete</button></div>`
}

function openModal(){
 const p=normalizeProfile(getProfile());if(!p)return;
 let m=document.getElementById('profileModal');
 if(!m){
  m=document.createElement('div');m.id='profileModal';m.className='modal-backdrop';
  m.innerHTML=`<section class="profile-modal profile-modal-large">
   <div class="profile-modal-head"><div><span class="eyebrow">PORTFOLIO MAKER</span><h2>Edit your portfolio</h2><p class="modal-subtitle">Add, edit or delete your actual projects, skills and education.</p></div><button class="close-btn" id="closeProfile">✕</button></div>
   <div class="photo-row"><img id="photoPreview" class="photo-preview"><div><strong>Profile photo</strong><p class="text-xs text-slate-500 mt-1">Upload a new image.</p><input id="profilePhoto" type="file" accept="image/*" class="mt-2 text-xs"></div></div>
   <form id="profileForm" class="form-grid">
    <div class="crud-section wide"><div class="crud-section-head"><div><span class="tiny-label">PROFILE</span><h3>Personal details</h3></div></div>
      <div class="form-grid inner-grid"><label>Full name *<input id="editName" required></label><label>Email *<input id="editEmail" type="email" required></label><label class="wide">Bio<textarea id="editBio" rows="3" maxlength="160"></textarea></label></div>
    </div>
    <div class="crud-section wide"><div class="crud-section-head"><div><span class="tiny-label">EDUCATION</span><h3>Learning timeline</h3></div></div>
      <div class="form-grid inner-grid"><label>School<input id="editSchool"></label><label>College<input id="editCollege"></label><label>Current study<input id="editCurrent"></label><label>Next goal<input id="editNext"></label></div>
    </div>
    <div class="crud-section wide"><div class="crud-section-head"><div><span class="tiny-label">SKILLS</span><h3>Your skills</h3></div><button type="button" class="btn btn-small" id="addSkillBtn">+ Add skill</button></div><div id="skillsEditor"></div></div>
    <div class="crud-section wide"><div class="crud-section-head"><div><span class="tiny-label">PROJECTS</span><h3>Your projects</h3></div><button type="button" class="btn btn-small" id="addProjectBtn">+ Add project</button></div><div id="projectsEditor"></div></div>
    <div class="wide form-status" id="profileStatus"></div>
    <div class="wide modal-actions"><button type="button" class="btn btn-ghost" id="cancelProfile">Cancel</button><button type="button" class="btn delete-profile-danger" id="deleteProfileBtn">Delete profile</button><button type="submit" class="btn btn-primary">Save all changes ✓</button></div>
   </form>
  </section>`;
  document.body.appendChild(m);
  document.getElementById('closeProfile').onclick=closeModal;
  document.getElementById('cancelProfile').onclick=closeModal;
  m.onclick=e=>{if(e.target===m)closeModal()};
  document.getElementById('deleteProfileBtn').onclick=()=>{if(confirm('Delete your entire portfolio profile? This cannot be undone.')){deleteProfile();closeModal();renderNav();updateProfileUI();toast('Portfolio deleted.')}};
  document.getElementById('profilePhoto').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>document.getElementById('photoPreview').src=r.result;r.readAsDataURL(f)};
  document.getElementById('addSkillBtn').onclick=()=>{document.getElementById('skillsEditor').insertAdjacentHTML('beforeend',skillRow('',document.querySelectorAll('.skill-edit-row').length));bindCrudButtons()};
  document.getElementById('addProjectBtn').onclick=()=>{document.getElementById('projectsEditor').insertAdjacentHTML('beforeend',projectRow({title:'',status:'completed',description:'',tech:[]},document.querySelectorAll('.project-edit-row').length));bindCrudButtons()};
  document.getElementById('profileForm').onsubmit=saveProfileFromModal;
 }
 document.getElementById('editName').value=p.name||'';
 document.getElementById('editEmail').value=p.email||'';
 document.getElementById('editSchool').value=p.school||'';
 document.getElementById('editCollege').value=p.college||'';
 document.getElementById('editCurrent').value=p.currentStudy||'';
 document.getElementById('editNext').value=p.nextGoal||'';
 document.getElementById('editBio').value=p.bio||'';
 document.getElementById('photoPreview').src=p.photo||avatarPath();
 document.getElementById('skillsEditor').innerHTML=(p.skills||[]).map(skillRow).join('');
 document.getElementById('projectsEditor').innerHTML=(p.projects||[]).map(projectRow).join('');
 document.getElementById('profileStatus').textContent='';
 bindCrudButtons();
 m.classList.add('open');
}

function bindCrudButtons(){
 document.querySelectorAll('.delete-skill').forEach(b=>b.onclick=()=>b.closest('.skill-edit-row')?.remove());
 document.querySelectorAll('.delete-project').forEach(b=>b.onclick=()=>b.closest('.project-edit-row')?.remove());
}
function saveProfileFromModal(e){
 e.preventDefault();
 const old=normalizeProfile(getProfile())||{};
 const email=document.getElementById('editEmail').value.trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return showStatus('profileStatus','Please use a valid email.','error');
 const skills=[...document.querySelectorAll('.skill-input')].map(x=>x.value.trim()).filter(Boolean);
 const projects=[...document.querySelectorAll('.project-edit-row')].map(row=>({
   title:row.querySelector('.project-title').value.trim(),
   status:row.querySelector('.project-status-input').value,
   description:row.querySelector('.project-description').value.trim(),
   tech:row.querySelector('.project-tech').value.split(',').map(x=>x.trim()).filter(Boolean)
 })).filter(x=>x.title);
 const pr={...old,name:document.getElementById('editName').value.trim(),email,school:document.getElementById('editSchool').value.trim(),college:document.getElementById('editCollege').value.trim(),currentStudy:document.getElementById('editCurrent').value.trim(),nextGoal:document.getElementById('editNext').value.trim(),bio:document.getElementById('editBio').value.trim(),skills,projects,photo:document.getElementById('photoPreview').src};
 setProfile(pr);closeModal();renderNav();updateProfileUI();toast('Portfolio updated — changes saved!');
}

function closeModal(){document.getElementById('profileModal')?.classList.remove('open')}

function renderProjects(){
 const p=normalizeProfile(getProfile());const box=document.getElementById('dynamicProjects');if(!box||!p)return;
 box.innerHTML=(p.projects||[]).map((x,i)=>`<article class="project-card reveal"><span class="project-status ${x.status==='completed'?'done':x.status==='progress'?'progress':'idea'}">${x.status==='completed'?'COMPLETED':x.status==='progress'?'IN PROGRESS':'NEXT IDEA'}</span><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><div class="project-meta">${(x.tech||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div></article>`).join('')||'<p class="empty-state">No projects yet. Sign in and click Edit Portfolio to add one.</p>';
}
function renderSkills(){
 const p=normalizeProfile(getProfile());const box=document.getElementById('dynamicSkills');if(!box||!p)return;
 box.innerHTML=(p.skills||[]).map((s,i)=>`<span class="skill-pill ${i%5===0?'skill-lg':''} ${i%4===0?'skill-accent':''}">${esc(s)}</span>`).join('')||'<span class="empty-state">No skills added yet.</span>';
}

function updateProfileUI(){
 const p=normalizeProfile(getProfile());
 renderProjects();renderSkills();
 if(!p)return;
 setProfile(p);
 document.getElementById('heroName')?.replaceChildren(document.createTextNode(p.name||'Your Name'));
 if(document.getElementById('heroBio'))document.getElementById('heroBio').textContent=p.bio||'Write a one-line story about what you build.';
 if(document.getElementById('heroAvatar'))document.getElementById('heroAvatar').src=p.photo||'assets/avatar-placeholder.svg';
 [['heroProjects',p.completed],['heroSkills',p.skills.length],['statCompleted',p.completed],['statProgress',p.inProgress],['statSkills',p.skills.length]].forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=String(v??0).padStart(2,'0')});
 if(document.getElementById('aboutSchool'))document.getElementById('aboutSchool').textContent=p.school||'Secondary School';
 if(document.getElementById('aboutCollege'))document.getElementById('aboutCollege').textContent=p.college||'College / Intermediate';
 if(document.getElementById('aboutCurrent'))document.getElementById('aboutCurrent').textContent=p.currentStudy||'Current Study';
 if(document.getElementById('aboutNext'))document.getElementById('aboutNext').textContent=p.nextGoal||'Next Goal';
 const eb=document.getElementById('homeEditBtn'),bb=document.getElementById('homeBuildBtn');if(eb&&bb){eb.classList.remove('hidden');bb.classList.add('hidden');eb.onclick=openModal}
}

function score(v){let n=0;if(v.length>=8)n++;if(/[A-Z]/.test(v))n++;if(/[0-9]/.test(v))n++;if(/[^A-Za-z0-9]/.test(v))n++;return n}

function initAuth(){
 const sign=document.getElementById('signinForm');
 if(sign){
  const pass=document.getElementById('signinPassword');
  pass.oninput=()=>{const s=score(pass.value);const e=document.getElementById('passwordHint');e.textContent='Password strength: '+(s<2?'Weak':s<3?'Okay':s<4?'Good':'Strong')};
  document.querySelectorAll('.password-toggle').forEach(b=>b.onclick=()=>{const f=document.getElementById(b.dataset.target);const show=f.type==='password';f.type=show?'text':'password';b.textContent=show?'Hide':'Show'});
  sign.onsubmit=e=>{e.preventDefault();const email=document.getElementById('signinEmail').value.trim().toLowerCase(),pw=pass.value;const p=getProfile();const ok=(email==='demo@portfolio.dev'&&pw==='Portfolio123!')||(p&&p.email===email&&p.password===pw);if(!ok)return showStatus('signinStatus','Email or password is incorrect.','error');if(email==='demo@portfolio.dev'&&!p)setProfile({...DEMO,skills:[...DEMO.skills],projects:DEMO.projects.map(x=>({...x,tech:[...x.tech]}))});showStatus('signinStatus','Signed in. Opening your portfolio…','success');setTimeout(()=>location.href='../../index.html',450)}
 }
 const up=document.getElementById('signupForm');
 if(up){
  const pass=document.getElementById('signupPassword');
  pass.oninput=()=>{const bar=document.getElementById('signupMeterBar'),s=score(pass.value);bar.style.width=`${s*25}%`;bar.style.background=s<2?'#d05656':s<3?'#e3bb50':'#36d174'};
  up.onsubmit=e=>{e.preventDefault();const name=document.getElementById('signupName').value.trim(),email=document.getElementById('signupEmail').value.trim().toLowerCase(),p1=pass.value,p2=document.getElementById('signupConfirm').value;if(name.length<2)return showStatus('signupStatus','Enter your name.','error');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return showStatus('signupStatus','Enter a valid email address.','error');if(p1.length<8)return showStatus('signupStatus','Password needs at least 8 characters.','error');if(p1!==p2)return showStatus('signupStatus','Passwords do not match.','error');if(email==='demo@portfolio.dev')return showStatus('signupStatus','That demo email is reserved.','error');setProfile({name,email,password:p1,bio:document.getElementById('signupBio').value.trim(),school:'',college:'',currentStudy:'',nextGoal:'',projects:[],skills:['HTML5','Tailwind CSS','JavaScript'],photo:'../../assets/avatar-placeholder.svg'});showStatus('signupStatus','Profile created. Opening your portfolio…','success');setTimeout(()=>location.href='../../index.html',600)}
 }
}

function initContact(){const f=document.getElementById('contactForm');if(!f)return;f.onsubmit=e=>{if((f.action||'').includes('YOUR_FORMSPREE_ID')){e.preventDefault();showStatus('contactStatus','Form is ready, but you must replace YOUR_FORMSPREE_ID with your real Formspree endpoint before submission.','error')}}}
function magneticButtons(){document.querySelectorAll('.magnetic').forEach(b=>b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.06}px,${(e.clientY-r.top-r.height/2)*.06}px)`;b.addEventListener('mouseleave',()=>b.style.transform='',{once:true})}))}
document.addEventListener('DOMContentLoaded',()=>{renderNav();renderFooter();initTheme();initAuth();initContact();updateProfileUI();magneticButtons()});


/* FORMspree AJAX integration */
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const submitButton = contactForm.querySelector('button[type="submit"], input[type="submit"]');
  let status = document.getElementById('form-status');

  if (!status) {
    status = document.createElement('div');
    status.id = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    contactForm.appendChild(status);
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
    }

    status.textContent = '';
    status.className = 'form-status';

    try {
      const response = await fetch('https://formspree.io/f/mbglnqje', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.textContent = 'Message sent successfully! Thank you for contacting me.';
        status.classList.add('success');
        contactForm.reset();
      } else {
        let message = 'Unable to send your message. Please try again.';
        try {
          const data = await response.json();
          if (data && data.errors && data.errors.length) {
            message = data.errors.map(error => error.message).join(' ');
          }
        } catch (_) {}
        status.textContent = message;
        status.classList.add('error');
      }
    } catch (error) {
      status.textContent = 'Network error. Please check your connection and try again.';
      status.classList.add('error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || 'Send Message';
      }
    }
  });
});

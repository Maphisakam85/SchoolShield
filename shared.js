const state=JSON.parse(localStorage.getItem('ssdb')||'null')||{
  visitors:[
    {id:'VIS001',name:'Thabo Nkosi',type:'Parent',host:'Lerato Nkosi',purpose:'Meeting',status:'Inside',date:new Date().toISOString().slice(0,10),checkin:'07:42'},
    {id:'VIS002',name:'Sarah Bennett',type:'Guardian',host:'Mia Bennett',purpose:'Collection',status:'Checked Out',date:new Date().toISOString().slice(0,10),checkin:'08:10',checkout:'09:05'}
  ],
  incidents:[
    {id:'INC001',category:'Access Control',priority:'High',location:'Main Gate',status:'Open',date:new Date().toISOString().slice(0,10),reported:'S. Dlamini'}
  ],
  learners:[{id:'L001',name:'Lerato Nkosi',grade:'4',class:'4B'}],
  staff:[{id:'S001',name:'Ms Molefe',role:'Teacher'}],
  notifications:[{title:'Visitor access requires attention',status:'Unread'}],
  audit:[]
};

function save(){localStorage.setItem('ssdb',JSON.stringify(state))}
function toast(t){let e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)}

const pages=[
  {name:'Dashboard',href:'dashboard.html'},
  {name:'Leadership',href:'leadership.html'},
  {name:'Visitors',href:'visitors.html'},
  {name:'Incidents',href:'incidents.html'},
  {name:'Notifications',href:'notifications.html'},
  {name:'Learners',href:'learners.html'},
  {name:'Parents',href:'parents.html'},
  {name:'Staff',href:'staff.html'},
  {name:'Security Officers',href:'security-officers.html'},
  {name:'Reports',href:'reports.html'},
  {name:'Audit Trail',href:'audit-trail.html'},
  {name:'Settings',href:'settings.html'}
];

function layout(active, html) {
  document.getElementById('app').innerHTML = `
    <div class="layout">
      <aside class="side">
        <div class="brand">🛡 SchoolShield<span>Greenfield Primary School</span></div>
        <nav class="nav" aria-label="Primary navigation">
          ${pages.map((page) => `<a class="${page.name === active ? 'active' : ''}" href="${page.href}">${page.name}</a>`).join('')}
        </nav>
      </aside>
      <main class="main">
        <header class="top">
          <div class="page-title"><span class="eyebrow">School safety</span><strong>${active}</strong></div>
          <div class="user-menu" aria-label="Signed in user"><span aria-hidden="true">🔔</span><span aria-hidden="true">⚙️</span><strong>Ms. N. Mokoena</strong></div>
        </header>
        <section class="content">${html}</section>
      </main>
    </div>`;
}

function visitorTable(){
  return `<table><tr><th>ID</th><th>Visitor</th><th>Host</th><th>Status</th><th>Action</th></tr>${state.visitors.map(v=>`<tr><td>${v.id}</td><td>${v.name}</td><td>${v.host}</td><td><span class='badge ${v.status==='Inside'?'inside':'out'}'>${v.status}</span></td><td>${v.status==='Inside'?`<button class='btn gray' onclick="checkout('${v.id}')">Check out</button>`:'—'}</td></tr>`).join('')}</table>`;
}

function checkout(id){
  let v=state.visitors.find(x=>x.id==id);
  v.status='Checked Out';
  v.checkout=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  state.audit.unshift({action:'Visitor checked out',time:new Date().toLocaleString()});
  save();
  toast('Visitor checked out');
  setTimeout(()=>location.reload(),300);
}

function addVisitor(e){
  e.preventDefault();
  let f=new FormData(e.target);
  state.visitors.unshift({id:f.get('id'),name:f.get('name'),type:f.get('type'),host:f.get('host'),purpose:f.get('purpose'),status:'Inside',date:new Date().toISOString().slice(0,10),checkin:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})});
  state.audit.unshift({action:'Visitor registered',time:new Date().toLocaleString()});
  save();
  location.href='visitors.html';
}

function addIncident(e){
  e.preventDefault();
  let f=new FormData(e.target);
  state.incidents.unshift({id:'INC'+Date.now().toString().slice(-4),category:f.get('category'),priority:f.get('priority'),location:f.get('location'),reported:f.get('reported'),status:'Open',date:new Date().toISOString().slice(0,10)});
  state.notifications.unshift({title:'New incident reported',status:'Unread'});
  state.audit.unshift({action:'Incident created',time:new Date().toLocaleString()});
  save();
  location.href='incidents.html';
}

function addLearner(e){
  e.preventDefault();
  let f=new FormData(e.target);
  state.learners.push({id:f.get('id'),name:f.get('name'),grade:f.get('grade'),class:f.get('class')});
  save();
  location.href='learners.html';
}

function addStaff(e){
  e.preventDefault();
  let f=new FormData(e.target);
  state.staff.push({id:f.get('id'),name:f.get('name'),role:f.get('role')});
  save();
  location.href='staff.html';
}

function markRead(){
  state.notifications.forEach(n=>n.status='Read');
  save();
  toast('Notifications updated');
  setTimeout(()=>location.reload(),300);
}

function emergency(){
  document.body.insertAdjacentHTML('beforeend',`<div class='modalbg' id='m'><div class='modal'><h2>Emergency Alert</h2><p>This will create a high priority emergency notification.</p><input id='loc' placeholder='Location' value='Main Gate' style='width:100%;padding:10px;margin:8px 0'><textarea id='msg' style='width:100%;height:90px'>Emergency assistance required.</textarea><br><br><button class='btn gray' onclick="document.getElementById('m').remove()">Cancel</button> <button class='btn red' onclick='sendEmergency()'>Send Alert</button></div></div>`);
}
function sendEmergency(){
  state.notifications.unshift({title:'EMERGENCY ALERT',status:'Unread'});
  state.audit.unshift({action:'Emergency alert sent',time:new Date().toLocaleString()});
  save();
  document.getElementById('m').remove();
  toast('Emergency alert sent');
}

function qrScan(){toast('QR Scan successful: Thabo Nkosi')}

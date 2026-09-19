const C = window.DXN_CONFIG || {};
const ready = Boolean(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);
const db = ready && window.supabase ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;

let lang = localStorage.getItem("dxn_lang") || "ar";
let member = null;
let isAdmin = false;
let trainingCache = [];
let taskCache = [];

const tr = {
  ar: {
    login:"تسجيل الدخول", register:"إنشاء حساب", name:"الاسم الكامل", age:"العمر",
    wa:"رقم WhatsApp", id:"رقم عضوية DXN", email:"البريد الإلكتروني", password:"كلمة المرور",
    city:"المدينة", goal:"ما هدفك الأساسي من الانضمام؟", time:"ما الوقت الذي يمكنك تخصيصه بانتظام لتطوير مشروعك؟",
    learn:"ما الذي تريد أن تتعلمه أولًا؟", ready:"هل أنت مستعد لتطبيق ما تتعلمه؟", start:"متى تستطيع البدء؟",
    contact:"ما أفضل وقت للتواصل معك عبر WhatsApp؟", enter:"دخول", create:"إنشاء الحساب",
    switchReg:"إنشاء حساب جديد", switchLogin:"لدي حساب بالفعل", welcome:"مرحبًا بك في DXN START 🇲🇷",
    intro:"هذا النموذج يساعدنا على معرفة هدفك واحتياجاتك حتى نوجهك إلى التدريب والخطوات المناسبة لك.",
    training:"التدريب", tasks:"المهام", points:"النقاط", progress:"التقدم", profile:"ملفي", admin:"المسؤول",
    save:"حفظ", done:"تم الإنجاز", open:"فتح", logout:"خروج", config:"إعدادات الاتصال غير مكتملة.",
    success:"تم الحفظ بنجاح", no:"لا توجد بيانات.", search:"بحث بالاسم / العضوية / WhatsApp / المدينة",
    confirm:"تم إنشاء الحساب. يرجى تأكيد بريدك الإلكتروني ثم تسجيل الدخول.", active:"نشط", followup:"يحتاج متابعة",
    inactive:"غير متفاعل", completed:"مكتمل", members:"الأعضاء", newMembers:"جدد", started:"بدأوا التدريب",
    today:"متابعة اليوم", send:"WhatsApp", adminTitle:"لوحة تحكم المسؤول",
    adminIntro:"إدارة الأعضاء والتدريب والمهام والرسائل والمتابعة من مكان واحد.",
    overview:"نظرة عامة", memberList:"الأعضاء", content:"المحتوى التدريبي", tasksAdmin:"المهام",
    messages:"الرسائل الجاهزة", followups:"المتابعة", refresh:"تحديث", edit:"تعديل", remove:"محو",
    add:"إضافة", cancel:"إلغاء", titleAr:"العنوان بالعربية", titleFr:"العنوان بالفرنسية",
    descAr:"الوصف بالعربية", descFr:"الوصف بالفرنسية", video:"رابط الفيديو", pdf:"رابط PDF",
    order:"الترتيب", published:"منشور", saveChanges:"حفظ التعديل", addTraining:"إضافة التدريب",
    taskTitleAr:"عنوان المهمة بالعربية", taskTitleFr:"عنوان المهمة بالفرنسية", day:"اليوم", taskPoints:"النقاط",
    activeTask:"المهمة مفعلة", messageName:"اسم الرسالة", bodyAr:"نص الرسالة بالعربية", bodyFr:"نص الرسالة بالفرنسية",
    followAt:"موعد المتابعة", channel:"القناة", notes:"ملاحظات", status:"الحالة", newFollow:"متابعة جديدة",
    details:"التفاصيل", noVideo:"لا يوجد فيديو", noPdf:"لا يوجد PDF", watch:"مشاهدة الفيديو",
    openPdf:"فتح المادة PDF", finish:"إتمام التدريب +10 نقاط", trainingContent:"محتوى التدريب", trainingLocked:"🔒 أكمل التدريب السابق أولًا", startTraining:"ابدأ التدريب", learningSummary:"ملخص ما استفدت منه", learningSummaryHint:"اكتب باختصار أهم ما تعلمته وما الذي ستطبقه بعد هذا التدريب.", videoNotFinished:"يجب إكمال الفيديو قبل إرسال الملخص.", videoProgress:"تقدم الفيديو", speedLimit:"السرعة القصوى 1.5×", videoCompleted:"تم إكمال الفيديو ✓",
    changeStatus:"تغيير الحالة", addFollowup:"إضافة متابعة", saveMember:"حفظ العضو", adminOnly:"للمسؤول فقط",
    confirmDelete:"هل تريد محو هذا العنصر؟", error:"حدث خطأ", memberSaved:"تم تحديث العضو",
    taskSaved:"تم تحديث المهمة", messageSaved:"تم تحديث الرسالة", followSaved:"تم حفظ المتابعة",
    all:"الكل", completedTraining:"تدريبات مكتملة", inactiveLong:"غير متفاعل", start90:"90 يوم",
    goal90:"هدف 90 يوم", startDate:"تاريخ البداية", currentDay:"اليوم الحالي", active90:"نشط في 90 يوم", taskReport:"تقرير المهمة", reportPrompt:"اكتب باختصار ما أنجزته في هذه المهمة، وما النتيجة التي وصلت إليها أو ما الخطوة التالية.", sendReport:"إرسال التقرير", reportSent:"تم إرسال التقرير وتسجيل إنجاز المهمة.", reportRequired:"التقرير مطلوب", reports:"تقارير المهام", reportText:"نص التقرير"
  },
  fr: {
    login:"Connexion", register:"Créer un compte", name:"Nom complet", age:"Âge", wa:"Numéro WhatsApp",
    id:"Numéro de membre DXN", email:"Adresse e-mail", password:"Mot de passe", city:"Ville",
    goal:"Quel est votre objectif principal ?", time:"Quel temps pouvez-vous consacrer régulièrement ?",
    learn:"Que souhaitez-vous apprendre en premier ?", ready:"Êtes-vous prêt(e) à appliquer ce que vous apprenez ?",
    start:"Quand pouvez-vous commencer ?", contact:"Meilleur moment pour WhatsApp ?", enter:"Connexion",
    create:"Créer le compte", switchReg:"Créer un nouveau compte", switchLogin:"J’ai déjà un compte",
    welcome:"Bienvenue dans DXN START 🇲🇷", intro:"Ce formulaire nous aide à connaître votre objectif et vos besoins.",
    training:"Formation", tasks:"Tâches", points:"Points", progress:"Progression", profile:"Mon profil", admin:"Administration",
    save:"Enregistrer", done:"Terminé", open:"Ouvrir", logout:"Déconnexion", config:"Configuration incomplète.",
    success:"Enregistré", no:"Aucune donnée.", search:"Rechercher par nom / membre / WhatsApp / ville",
    confirm:"Compte créé. Vérifiez votre e-mail puis connectez-vous.", active:"Actif", followup:"À suivre", inactive:"Inactif",
    completed:"Terminé", members:"Membres", newMembers:"Nouveaux", started:"Formation commencée", today:"À suivre aujourd’hui",
    send:"WhatsApp", adminTitle:"Tableau de bord administrateur", adminIntro:"Gérer membres, formations, tâches, messages et suivi.",
    overview:"Vue générale", memberList:"Membres", content:"Formations", tasksAdmin:"Tâches", messages:"Messages", followups:"Suivi",
    refresh:"Actualiser", edit:"Modifier", remove:"Supprimer", add:"Ajouter", cancel:"Annuler", titleAr:"Titre arabe",
    titleFr:"Titre français", descAr:"Description arabe", descFr:"Description française", video:"Lien vidéo", pdf:"Lien PDF",
    order:"Ordre", published:"Publié", saveChanges:"Enregistrer", addTraining:"Ajouter la formation", taskTitleAr:"Titre arabe",
    taskTitleFr:"Titre français", day:"Jour", taskPoints:"Points", activeTask:"Tâche active", messageName:"Nom du message",
    bodyAr:"Texte arabe", bodyFr:"Texte français", followAt:"Date du suivi", channel:"Canal", notes:"Notes", status:"Statut",
    newFollow:"Nouveau suivi", details:"Détails", noVideo:"Pas de vidéo", noPdf:"Pas de PDF", watch:"Voir la vidéo",
    openPdf:"Ouvrir le PDF", finish:"Terminer la formation +10 points", trainingContent:"Contenu de la formation", trainingLocked:"🔒 Terminez d’abord la formation précédente", startTraining:"Commencer la formation", learningSummary:"Résumé de ce que vous avez appris", learningSummaryHint:"Écrivez brièvement ce que vous avez appris et ce que vous allez appliquer.", videoNotFinished:"Vous devez terminer la vidéo avant d’envoyer le résumé.", videoProgress:"Progression vidéo", speedLimit:"Vitesse maximale 1,5×", videoCompleted:"Vidéo terminée ✓",
    changeStatus:"Changer le statut", addFollowup:"Ajouter un suivi", saveMember:"Enregistrer le membre", adminOnly:"Administrateur seulement",
    confirmDelete:"Supprimer cet élément ?", error:"Une erreur est survenue", memberSaved:"Membre mis à jour", taskSaved:"Tâche mise à jour",
    messageSaved:"Message mis à jour", followSaved:"Suivi enregistré", all:"Tous", completedTraining:"Formations terminées",
    inactiveLong:"Inactifs", start90:"90 jours", goal90:"Objectif 90 jours", startDate:"Date de début", currentDay:"Jour actuel", active90:"Actif 90 jours", taskReport:"Rapport de tâche", reportPrompt:"Qu’avez-vous réalisé dans cette tâche ? Écrivez brièvement l’action, le résultat ou la prochaine étape.", sendReport:"Envoyer le rapport", reportSent:"Rapport envoyé et tâche enregistrée.", reportRequired:"Rapport requis", reports:"Rapports des tâches", reportText:"Texte du rapport"
  }
};

const opts = {
  goal:[["استخدام المنتجات","Utiliser les produits"],["دخل إضافي","Avoir un revenu supplémentaire"],["بناء مشروع","Construire un business"],["بناء فريق وقيادة","Construire une équipe et développer le leadership"],["ما زلت أستكشف الفرصة","Je découvre encore l’opportunité"]],
  time:[["أقل من 30 دقيقة يوميًا","Moins de 30 minutes par jour"],["30 دقيقة إلى ساعة يوميًا","30 minutes à 1 heure par jour"],["ساعة إلى ساعتين يوميًا","1 à 2 heures par jour"],["أكثر من ساعتين يوميًا","Plus de 2 heures par jour"],["حسب وقتي وظروفي","Selon mes disponibilités"]],
  learn:[["فهم البزنس","Comprendre le business"],["المنتجات","Les produits"],["كيفية الاستقطاب","Comment prospecter"],["كيفية تقديم الفرصة","Comment présenter l’opportunité"],["التسويق عبر الهاتف ووسائل التواصل","Marketing par téléphone et réseaux sociaux"],["أريد أن أتعلم كل شيء خطوة بخطوة","Je veux tout apprendre étape par étape"]],
  ready:[["نعم، مستعد","Oui, je suis prêt(e)"],["أحتاج بعض الوقت","J’ai besoin d’un peu de temps"],["لست متأكدًا بعد","Je ne suis pas encore sûr(e)"]],
  start:[["اليوم","Aujourd’hui"],["خلال هذا الأسبوع","Cette semaine"],["خلال هذا الشهر","Ce mois-ci"],["لاحقًا","Plus tard"]],
  contact:[["صباحًا","Le matin"],["ظهرًا","À midi"],["مساءً","Le soir"],["أي وقت","À tout moment"]]
};

const T=k=>(tr[lang]&&tr[lang][k])||k;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const errText=e=>e?.message||T("error");
function toast(message){const e=document.querySelector("#toast");if(!e)return;e.textContent=message;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2600);}
function setLang(){lang=lang==="ar"?"fr":"ar";localStorage.setItem("dxn_lang",lang);render();}
function selectField(key,value=""){return `<select id="${key}"><option value="">—</option>${opts[key].map(x=>`<option value="${esc(x[0])}" ${value===x[0]?"selected":""}>${esc(lang==="ar"?x[0]:x[1])}</option>`).join("")}</select>`;}
function button(text,cls="btn"){return `<button class="${cls}">${esc(text)}</button>`;}

function auth(mode="login",message=""){
  document.querySelector("#logoutBtn").classList.add("hidden");
  document.querySelector("#screen").innerHTML=`<div class="container"><div class="card form"><div class="center"><h2>${T(mode)}</h2><p class="muted">${T("welcome")}<br>${T("intro")}</p>${message?`<p class="pill">${esc(message)}</p>`:""}</div>
  ${mode==="register"?`<div class="field"><label>${T("name")}</label><input id="name" required></div><div class="field"><label>${T("age")}</label><input id="age" type="number" min="13" max="100" required></div><div class="field"><label>${T("wa")}</label><input id="wa" required></div><div class="field"><label>${T("id")}</label><input id="dxnid" required></div><div class="field"><label>${T("city")}</label><input id="city"></div><div class="field"><label>${T("goal")}</label>${selectField("goal")}</div><div class="field"><label>${T("time")}</label>${selectField("time")}</div><div class="field"><label>${T("learn")}</label>${selectField("learn")}</div><div class="field"><label>${T("ready")}</label>${selectField("ready")}</div><div class="field"><label>${T("start")}</label>${selectField("start")}</div><div class="field"><label>${T("contact")}</label>${selectField("contact")}</div>`:""}
  <div class="field"><label>${T("email")}</label><input id="email" type="email" required></div><div class="field"><label>${T("password")}</label><input id="password" type="password" minlength="6" required></div>
  <button id="submit" class="btn">${mode==="login"?T("enter"):T("create")}</button><div class="center small" style="margin-top:13px"><button id="switch" class="btn alt">${mode==="login"?T("switchReg"):T("switchLogin")}</button></div></div></div>`;
  document.querySelector("#switch").onclick=()=>auth(mode==="login"?"register":"login");
  document.querySelector("#submit").onclick=async()=>{
    if(!db){toast(T("config"));return;}
    const email=document.querySelector("#email").value.trim();const password=document.querySelector("#password").value;
    if(!email||!password){toast(lang==="ar"?"يرجى إكمال البريد وكلمة المرور":"Veuillez compléter l’e-mail et le mot de passe");return;}
    try{
      if(mode==="login"){const {error}=await db.auth.signInWithPassword({email,password});if(error)throw error;await boot();return;}
      const payload={full_name:document.querySelector("#name").value.trim(),age:Number(document.querySelector("#age").value),whatsapp:document.querySelector("#wa").value.trim(),dxn_member_id:document.querySelector("#dxnid").value.trim(),city:document.querySelector("#city").value.trim(),goal:document.querySelector("#goal").value,daily_time:document.querySelector("#time").value,language:lang,support_need:document.querySelector("#learn").value,commitment:document.querySelector("#ready").value,training_attendance:document.querySelector("#start").value};
      if(!payload.full_name||!payload.age||!payload.whatsapp||!payload.dxn_member_id){toast(lang==="ar"?"يرجى إكمال البيانات الأساسية":"Veuillez compléter les données obligatoires");return;}
      const {data,error}=await db.auth.signUp({email,password,options:{data:payload}});if(error)throw error;
      if(data.session)await boot();else{auth("login",T("confirm"));toast(T("confirm"));}
    }catch(e){toast(errText(e));}
  };
}

async function boot(){
  if(!db){auth();return;}
  let session=null;
  try{const result=await Promise.race([db.auth.getSession(),new Promise((_,reject)=>setTimeout(()=>reject(new Error("Supabase connection timeout")),8000))]);session=result?.data?.session||null;}catch(e){auth("login",errText(e));return;}
  if(!session){auth();return;}
  document.querySelector("#logoutBtn").classList.remove("hidden");
  const [{data:m,error:me},{data:a,error:ae}]=await Promise.all([db.from("dxn_start_members").select("*").eq("auth_user_id",session.user.id).maybeSingle(),db.from("dxn_start_admins").select("user_id").eq("user_id",session.user.id).maybeSingle()]);
  if(me){toast(errText(me));return;} if(ae){toast(errText(ae));return;}
  member=m;isAdmin=Boolean(a); if(!member){await db.auth.signOut();auth("login",lang==="ar"?"لم يتم العثور على ملف العضو":"Profil membre introuvable");return;} if(isAdmin){renderAdminOnly();return;} await dashboard();
}

function renderAdminOnly(){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  const b=document.querySelector("#langBtn");
  if(b)b.textContent=lang==="ar"?"FR":"AR";
  document.querySelector("#logoutBtn").classList.remove("hidden");
  const screen=document.querySelector("#screen");
  screen.innerHTML='<div class="container"><div id="adminOnlyPanel"></div></div>';
  adminPanel(screen.querySelector("#adminOnlyPanel"));
}

async function dashboard(){
  if(!member){auth();return;}
  const [{data:ts},{data:ps},{data:pts},{data:tc},{data:td}]=await Promise.all([
    db.from("dxn_start_training").select("id").eq("is_published",true),db.from("dxn_start_progress").select("training_id,completed").eq("member_id",member.id),db.from("dxn_start_points").select("points").eq("member_id",member.id),db.from("dxn_start_task_completions").select("task_id").eq("member_id",member.id),db.from("dxn_start_tasks").select("id").eq("is_active",true)
  ]);
  const total=(ts||[]).length,done=(ps||[]).filter(x=>x.completed).length,pct=total?Math.round(done*100/total):0,totalPts=(pts||[]).reduce((s,x)=>s+(Number(x.points)||0),0);
  document.querySelector("#screen").innerHTML=`<div class="container"><section class="hero"><h1>${T("welcome")}</h1><p>${esc(member.full_name)}</p></section><div class="grid"><div class="card">${T("points")}<div class="stat">${totalPts}</div></div><div class="card">${T("progress")}<div class="stat">${pct}%</div><div class="progress"><i style="width:${pct}%"></i></div></div><div class="card">${T("training")}<div class="stat">${done}/${total}</div></div><div class="card">${T("tasks")}<div class="stat">${(tc||[]).length}/${(td||[]).length}</div></div></div>
  <div class="tabs"><button class="tab active" data-x="training">${T("training")}</button><button class="tab" data-x="tasks">${T("tasks")}</button><button class="tab" data-x="profile">${T("profile")}</button>${isAdmin?`<button class="tab" data-x="admin">${T("admin")}</button>`:""}</div><div id="panel"></div></div>`;
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");loadTab(b.dataset.x);});
  loadTab("training");
}

async function loadTab(type){
  const panel=document.querySelector("#panel");if(!panel)return;
  if(type==="training"){
    const [{data:list,error:e1},{data:progress,error:e2}]=await Promise.all([db.from("dxn_start_training").select("*").eq("is_published",true).order("sort_order"),db.from("dxn_start_progress").select("training_id,completed").eq("member_id",member.id)]);
    if(e1||e2){panel.innerHTML=`<div class="card">${esc(errText(e1||e2))}</div>`;return;}
    trainingCache=list||[];const done=new Set((progress||[]).filter(x=>x.completed).map(x=>x.training_id));
    panel.innerHTML=`<div class="list">${trainingCache.map((q,i)=>{
      const unlocked=i===0 || done.has(trainingCache[i-1].id); const isDone=done.has(q.id);
      return `<div class="item" style="opacity:${unlocked||isDone?1:.65}"><div class="row between"><b>${i+1}. ${esc(lang==="ar"?q.title_ar:q.title_fr)}</b>${isDone?`<span class="pill">✓ ${T("done")}</span>`:(!unlocked?`<span class="pill">🔒</span>`:"")}</div><p class="small muted">${esc(lang==="ar"?q.description_ar:q.description_fr)}</p><div class="row">${isDone?`<button class="btn alt" disabled>${T("done")}</button>`:unlocked?`<button class="btn" data-open-training="${q.id}">📖 ${T("startTraining")}</button>`:`<button class="btn alt" disabled>${T("trainingLocked")}</button>`}</div></div>`;
    }).join("")||T("no")}</div>`;
    panel.querySelectorAll("[data-open-training]").forEach(b=>b.onclick=()=>openTraining(b.dataset.openTraining));return;
  }
  if(type==="tasks"){
    const [{data:list,error:e1},{data:completed,error:e2}]=await Promise.all([db.from("dxn_start_tasks").select("*").eq("is_active",true).order("day_number"),db.from("dxn_start_task_completions").select("task_id").eq("member_id",member.id)]);
    if(e1||e2){panel.innerHTML=`<div class="card">${esc(errText(e1||e2))}</div>`;return;}taskCache=list||[];const done=new Set((completed||[]).map(x=>x.task_id));
    panel.innerHTML=`<div class="list">${taskCache.map(q=>`<div class="item"><div class="row between"><b>${esc(lang==="ar"?q.title_ar:q.title_fr)}</b><span class="pill">+${Number(q.points)||0}</span></div><p class="small muted">${esc(lang==="ar"?q.description_ar:q.description_fr)}</p>${!done.has(q.id)?`<p class="small pill">📝 ${T("reportRequired")}</p>`:""}<button class="btn alt" data-finish-task="${q.id}">${done.has(q.id)?T("done"):(lang==="ar"?T("taskReport"):"Rapport")}</button></div>`).join("")||T("no")}</div>`;
    panel.querySelectorAll("[data-finish-task]").forEach(b=>b.onclick=()=>finishTask(b.dataset.finishTask));return;
  }
  if(type==="profile"){
    panel.innerHTML=`<div class="card"><h3>${T("profile")}</h3><p><b>${T("name")}:</b> ${esc(member.full_name)}</p><p><b>${T("age")}:</b> ${esc(member.age||"—")}</p><p><b>${T("wa")}:</b> ${esc(member.whatsapp)}</p><p><b>${T("id")}:</b> ${esc(member.dxn_member_id)}</p><p><b>${T("city")}:</b> ${esc(member.city||"—")}</p><div class="field"><label>${T("goal")}</label>${selectField("goal",member.goal||"")}</div><div class="field"><label>${T("time")}</label>${selectField("time",member.daily_time||"")}</div><button class="btn" onclick="saveProfile()">${T("save")}</button></div>`;return;
  }
  if(type==="admin"&&isAdmin)await adminPanel(panel);
}

let ytApiPromise=null;
function loadYouTubeApi(){
  if(window.YT&&window.YT.Player)return Promise.resolve();
  if(ytApiPromise)return ytApiPromise;
  ytApiPromise=new Promise(resolve=>{
    const prev=window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady=()=>{if(typeof prev==="function")prev();resolve();};
    const s=document.createElement("script");s.src="https://www.youtube.com/iframe_api";s.async=true;document.head.appendChild(s);
  });
  return ytApiPromise;
}

async function openTraining(id){
  const q=trainingCache.find(x=>x.id===id);if(!q)return;
  const index=trainingCache.findIndex(x=>x.id===id);
  if(index>0){
    const prevId=trainingCache[index-1].id;
    const {data:prev}=await db.from("dxn_start_progress").select("completed").eq("member_id",member.id).eq("training_id",prevId).maybeSingle();
    if(!prev?.completed){toast(T("trainingLocked"));return;}
  }
  const title=lang==="ar"?q.title_ar:q.title_fr, description=lang==="ar"?q.description_ar:q.description_fr;
  const content=lang==="ar"?q.content_ar:"", keyPoints=lang==="ar"?q.key_points_ar:"", action=lang==="ar"?q.action_ar:"", reflection=lang==="ar"?q.reflection_ar:"", sourceNote=lang==="ar"?q.source_note_ar:"";
  const modal=document.createElement("div");modal.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:9999;padding:16px;overflow:auto";
  const card=document.createElement("div");card.style.cssText="max-width:820px;margin:25px auto;background:#fff;border-radius:20px;padding:20px;direction:"+(lang==="ar"?"rtl":"ltr");
  const close=document.createElement("button");close.className="btn alt";close.textContent="✕";close.onclick=()=>modal.remove();card.appendChild(close);
  const h=document.createElement("h2");h.textContent=title;card.appendChild(h);const intro=document.createElement("p");intro.textContent=description||"";intro.className="muted";intro.style.lineHeight="1.9";card.appendChild(intro);
  if(content){const box=document.createElement("div");box.className="card";box.style.cssText="margin-top:14px;line-height:2;font-size:16px";content.split("\n").forEach(line=>{const p=document.createElement("p");p.textContent=line;box.appendChild(p);});card.appendChild(box);}
  if(keyPoints){const box=document.createElement("div");box.className="card";box.style.marginTop="14px";const h3=document.createElement("h3");h3.textContent=lang==="ar"?"أهم ما يجب أن تتذكر":"Points clés";box.appendChild(h3);keyPoints.split("\n").forEach(line=>{const p=document.createElement("p");p.textContent=line;box.appendChild(p);});card.appendChild(box);}
  let videoCompleted=!q.video_url, watchedSeconds=0, durationSeconds=0, player=null, lastTime=null, timer=null;
  const videoStatus=document.createElement("div");videoStatus.className="pill";videoStatus.style.marginTop="12px";videoStatus.textContent=q.video_url?T("videoProgress")+": 0% · "+T("speedLimit"):"";
  if(q.video_url){
    const box=document.createElement("div");box.style.marginTop="14px";const vh=document.createElement("h3");vh.textContent="🎥 "+(lang==="ar"?"الفيديو":"Vidéo");box.appendChild(vh);
    const yt=q.video_url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^?&/]+)/i);
    if(yt){
      const holder=document.createElement("div");holder.id="yt-player-"+Date.now();holder.style.cssText="width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden";box.appendChild(holder);box.appendChild(videoStatus);card.appendChild(box);
      await loadYouTubeApi();
      player=new YT.Player(holder.id,{videoId:yt[1],playerVars:{controls:1,rel:0,playsinline:1,enablejsapi:1,origin:location.origin},events:{
        onReady:e=>{durationSeconds=e.target.getDuration()||0;e.target.setPlaybackRate(1);},
        onPlaybackRateChange:e=>{if(Number(e.data)>1.5){e.target.setPlaybackRate(1.5);toast(T("speedLimit"));}},
        onStateChange:e=>{if(e.data===YT.PlayerState.PLAYING)lastTime=e.target.getCurrentTime();if(e.data===YT.PlayerState.ENDED){videoCompleted=true;watchedSeconds=Math.max(watchedSeconds,durationSeconds);videoStatus.textContent=T("videoCompleted")+" · "+T("speedLimit");}}
      }});
      timer=setInterval(()=>{if(!player||!player.getPlayerState)return;const state=player.getPlayerState(),now=player.getCurrentTime()||0;durationSeconds=player.getDuration()||durationSeconds;if(state===YT.PlayerState.PLAYING){if(lastTime!==null){const delta=now-lastTime;if(delta>0&&delta<=2.5)watchedSeconds+=delta;}lastTime=now;}else lastTime=null;const pct=durationSeconds?Math.min(100,Math.round(watchedSeconds/durationSeconds*100)):0;if(!videoCompleted)videoStatus.textContent=T("videoProgress")+": "+pct+"% · "+T("speedLimit");},500);
    }else{const a=document.createElement("a");a.className="btn";a.target="_blank";a.rel="noopener";a.href=q.video_url;a.textContent=T("watch");box.appendChild(a);const note=document.createElement("p");note.className="small muted";note.textContent=lang==="ar"?"افتح الفيديو وشاهده كاملًا ثم ارجع لإرسال الملخص.":"Regardez la vidéo entièrement puis revenez envoyer le résumé.";box.appendChild(note);card.appendChild(box);}
  }else{const p2=document.createElement("p");p2.className="muted small";p2.textContent=T("noVideo");card.appendChild(p2);}
  if(q.pdf_url){const a=document.createElement("a");a.className="btn alt";a.target="_blank";a.rel="noopener";a.href=q.pdf_url;a.textContent="📄 "+T("openPdf");a.style.marginTop="12px";card.appendChild(a);}
  if(action){const box=document.createElement("div");box.className="card";box.style.marginTop="14px";const h3=document.createElement("h3");h3.textContent=lang==="ar"?"✅ مهمتك العملية":"✅ Action";box.appendChild(h3);const p=document.createElement("p");p.textContent=action;p.style.lineHeight="1.9";box.appendChild(p);card.appendChild(box);}
  if(reflection){const box=document.createElement("div");box.className="card";box.style.marginTop="14px";const h3=document.createElement("h3");h3.textContent=lang==="ar"?"🧠 سؤال للتفكير":"🧠 Réflexion";box.appendChild(h3);const p=document.createElement("p");p.textContent=reflection;p.style.lineHeight="1.9";box.appendChild(p);card.appendChild(box);}
  if(sourceNote){const p=document.createElement("p");p.className="small muted";p.style.marginTop="14px";p.textContent=sourceNote;card.appendChild(p);}
  const reportBox=document.createElement("div");reportBox.className="card";reportBox.style.marginTop="14px";const rh=document.createElement("h3");rh.textContent="📝 "+T("learningSummary");reportBox.appendChild(rh);const hint=document.createElement("p");hint.className="muted small";hint.textContent=T("learningSummaryHint");reportBox.appendChild(hint);const ta=document.createElement("textarea");ta.rows=6;ta.placeholder=T("learningSummaryHint");ta.style.cssText="width:100%;box-sizing:border-box;padding:12px;border:1px solid #ccd6df;border-radius:12px;line-height:1.8";reportBox.appendChild(ta);
  const videoWarn=document.createElement("p");videoWarn.className="small muted";videoWarn.textContent=q.video_url?T("videoNotFinished"):"";reportBox.appendChild(videoWarn);
  const done=document.createElement("button");done.className="btn";done.style.marginTop="12px";done.textContent=T("finish");done.disabled=Boolean(q.video_url);reportBox.appendChild(done);card.appendChild(reportBox);
  done.onclick=async()=>{const text=ta.value.trim();if(text.length<10){toast(lang==="ar"?"اكتب ملخصًا من 10 أحرف على الأقل":"Écrivez un résumé d’au moins 10 caractères");return;}if(q.video_url&&!videoCompleted){toast(T("videoNotFinished"));return;}done.disabled=true;await finishTraining(id,text,videoCompleted,watchedSeconds,durationSeconds,modal,done);};
  modal.appendChild(card);document.body.appendChild(modal);modal.addEventListener("click",e=>{if(e.target===modal)close.click();});
  const cleanup=()=>{if(timer)clearInterval(timer);try{player&&player.destroy&&player.destroy();}catch(_){} };
  const oldRemove=modal.remove.bind(modal);modal.remove=()=>{cleanup();oldRemove();};
}

async function finishTraining(id,reportText,videoCompleted=false,watchedSeconds=0,durationSeconds=0,modal=null,buttonEl=null){
  const {error}=await db.rpc("dxn_start_complete_training",{p_training_id:id,p_report_text:reportText,p_video_completed:videoCompleted,p_watched_seconds:watchedSeconds,p_duration_seconds:durationSeconds});
  if(error){if(buttonEl)buttonEl.disabled=false;toast(errText(error));return;}if(modal)modal.remove();toast(T("success"));dashboard();
}
window.finishTraining=finishTraining;window.openTraining=openTraining;

function finishTask(id){
  const q=taskCache.find(x=>x.id===id);if(!q)return;
  showTaskReportModal(q);
}
function showTaskReportModal(q){
  const modal=document.createElement("div");modal.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:9999;padding:16px;overflow:auto";
  const card=document.createElement("div");card.style.cssText="max-width:680px;margin:35px auto;background:#fff;border-radius:20px;padding:20px;direction:"+(lang==="ar"?"rtl":"ltr");
  const close=document.createElement("button");close.className="btn alt";close.textContent="✕";close.onclick=()=>modal.remove();card.appendChild(close);
  const h=document.createElement("h2");h.textContent=lang==="ar"?q.title_ar:q.title_fr;card.appendChild(h);
  const p=document.createElement("p");p.className="muted";p.textContent=lang==="ar"?(q.report_prompt_ar||T("reportPrompt")):(q.report_prompt_fr||T("reportPrompt"));p.style.lineHeight="1.9";card.appendChild(p);
  const ta=document.createElement("textarea");ta.rows=8;ta.placeholder=lang==="ar"?"اكتب تقريرك هنا...":"Écrivez votre rapport ici...";ta.style.cssText="width:100%;margin-top:10px;padding:12px;border:1px solid #ccd6df;border-radius:12px;box-sizing:border-box;line-height:1.8";card.appendChild(ta);
  const send=document.createElement("button");send.className="btn";send.style.marginTop="12px";send.textContent=T("sendReport");send.onclick=async()=>{const text=ta.value.trim();if(text.length<5){toast(lang==="ar"?"اكتب تقريرًا قصيرًا على الأقل":"Écrivez au moins un court rapport");return;}send.disabled=true;await submitTaskReport(q.id,text,modal,send);};card.appendChild(send);
  modal.appendChild(card);document.body.appendChild(modal);modal.addEventListener("click",e=>{if(e.target===modal)modal.remove();});
}
async function submitTaskReport(id,text,modal,send){
  const {error}=await db.rpc("dxn_start_submit_task_report",{p_task_id:id,p_report_text:text});
  if(error){if(send)send.disabled=false;toast(errText(error));return;}
  if(modal)modal.remove();toast(T("reportSent"));dashboard();
}
window.finishTask=finishTask;

async function saveProfile(){const {error}=await db.from("dxn_start_members").update({goal:document.querySelector("#goal").value,daily_time:document.querySelector("#time").value}).eq("id",member.id);if(error){toast(errText(error));return;}member.goal=document.querySelector("#goal").value;member.daily_time=document.querySelector("#time").value;toast(T("success"));dashboard();}
window.saveProfile=saveProfile;

function adminNav(panel){return `<div class="tabs" id="adminTabs"><button class="tab active" data-admin="overview">${T("overview")}</button><button class="tab" data-admin="members">${T("memberList")}</button><button class="tab" data-admin="training">${T("content")}</button><button class="tab" data-admin="tasks">${T("tasksAdmin")}</button><button class="tab" data-admin="reports">${T("reports")}</button><button class="tab" data-admin="messages">${T("messages")}</button><button class="tab" data-admin="followups">${T("followups")}</button></div><div id="adminBody" style="margin-top:14px"></div>`;}

async function adminPanel(panel){
  panel.innerHTML=`<div class="card"><h2>${T("adminTitle")}</h2><p class="muted">${T("adminIntro")}</p>${adminNav(panel)}</div>`;
  const body=panel.querySelector("#adminBody");const tabs=panel.querySelectorAll("[data-admin]");tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.remove("active"));b.classList.add("active");adminSection(b.dataset.admin,body);});await adminSection("overview",body);
}

async function adminSection(type,body){
  if(!isAdmin){body.innerHTML=`<div class="card">${T("adminOnly")}</div>`;return;}
  if(type==="overview"){
    const [{data:m},{data:t},{data:p},{data:f},{data:d}]=await Promise.all([db.from("dxn_start_members").select("id,status,created_at"),db.from("dxn_start_training").select("id,is_published"),db.from("dxn_start_progress").select("id,completed"),db.from("dxn_start_followups").select("id,status,followup_at"),db.from("dxn_start_90day").select("id,active")]);
    const all=m||[];body.innerHTML=`<div class="grid"><div class="card">${T("members")}<div class="stat">${all.length}</div></div><div class="card">${T("newMembers")}<div class="stat">${all.filter(x=>x.status==="new").length}</div></div><div class="card">${T("active")}<div class="stat">${all.filter(x=>x.status==="active").length}</div></div><div class="card">${T("followups")}<div class="stat">${all.filter(x=>x.status==="needs_followup").length}</div></div><div class="card">${T("content")}<div class="stat">${(t||[]).filter(x=>x.is_published).length}</div></div><div class="card">${T("completedTraining")}<div class="stat">${(p||[]).filter(x=>x.completed).length}</div></div><div class="card">${T("today")}<div class="stat">${(f||[]).filter(x=>x.status==="pending").length}</div></div><div class="card">${T("start90")}<div class="stat">${(d||[]).filter(x=>x.active).length}</div></div></div>`;return;
  }
  if(type==="members"){await adminMembers(body);return;}
  if(type==="training"){await adminTraining(body);return;}
  if(type==="tasks"){await adminTasks(body);return;}
  if(type==="reports"){await adminReports(body);return;}
  if(type==="messages"){await adminMessages(body);return;}
  if(type==="followups"){await adminFollowups(body);return;}
}

async function adminMembers(body){
  const {data,error}=await db.from("dxn_start_members").select("*").order("created_at",{ascending:false});if(error){body.innerHTML=`<div class="card">${esc(errText(error))}</div>`;return;}const all=data||[];
  body.innerHTML=`<div class="card"><input id="adminSearch" style="width:100%;padding:12px;border:1px solid #ccd6df;border-radius:10px" placeholder="${T("search")}"><div id="adminMembers" class="list" style="margin-top:12px"></div></div>`;const list=body.querySelector("#adminMembers");
  const draw=()=>{const q=(body.querySelector("#adminSearch").value||"").toLowerCase();const rows=all.filter(x=>[x.full_name,x.dxn_member_id,x.whatsapp,x.city,x.status].join(" ").toLowerCase().includes(q));list.innerHTML=rows.map(x=>`<div class="item"><div class="row between"><b>${esc(x.full_name)}</b><span class="pill">${esc(x.status)}</span></div><div class="small muted">${esc(x.dxn_member_id||"—")} · ${esc(x.whatsapp||"—")} · ${esc(x.city||"—")}</div><div class="row" style="margin-top:8px"><button class="btn alt" data-member="${x.id}">${T("details")}</button>${x.whatsapp?`<a class="btn" target="_blank" rel="noopener" href="https://wa.me/${String(x.whatsapp).replace(/\D/g,"")}">${T("send")}</a>`:""}</div></div>`).join("")||T("no");list.querySelectorAll("[data-member]").forEach(b=>b.onclick=()=>memberEditor(b.dataset.member,all,body));};body.querySelector("#adminSearch").oninput=draw;draw();
}

function memberEditor(id,all,body){const x=all.find(z=>z.id===id);if(!x)return;const card=document.createElement("div");card.className="card";card.style.marginTop="12px";card.innerHTML=`<h3>${T("details")}: ${esc(x.full_name)}</h3><div class="field"><label>${T("name")}</label><input id="mname" value="${esc(x.full_name)}"></div><div class="field"><label>${T("age")}</label><input id="mage" type="number" min="13" max="100" value="${Number(x.age)||""}"></div><div class="field"><label>${T("wa")}</label><input id="mwa" value="${esc(x.whatsapp||"")}"></div><div class="field"><label>${T("id")}</label><input id="mid" value="${esc(x.dxn_member_id||"")}"></div><div class="field"><label>${T("city")}</label><input id="mcity" value="${esc(x.city||"")}"></div><div class="field"><label>${T("status")}</label><select id="mstatus"><option value="new">new</option><option value="active">active</option><option value="needs_followup">needs_followup</option><option value="inactive">inactive</option><option value="completed">completed</option></select></div><div class="field"><label>${T("notes")}</label><textarea id="mnotes" rows="4">${esc(x.notes||"")}</textarea></div><div class="row"><button class="btn" id="saveM">${T("saveMember")}</button><button class="btn alt" id="cancelM">${T("cancel")}</button></div>`;body.prepend(card);card.querySelector("#mstatus").value=x.status||"new";card.querySelector("#cancelM").onclick=()=>card.remove();card.querySelector("#saveM").onclick=async()=>{const payload={full_name:card.querySelector("#mname").value.trim(),age:Number(card.querySelector("#mage").value)||null,whatsapp:card.querySelector("#mwa").value.trim(),dxn_member_id:card.querySelector("#mid").value.trim(),city:card.querySelector("#mcity").value.trim(),status:card.querySelector("#mstatus").value,notes:card.querySelector("#mnotes").value.trim()};const {error}=await db.from("dxn_start_members").update(payload).eq("id",id);if(error){toast(errText(error));return;}toast(T("memberSaved"));adminMembers(body);};}

async function adminTraining(body){
  const {data,error}=await db.from("dxn_start_training").select("*").order("sort_order");if(error){body.innerHTML=`<div class="card">${esc(errText(error))}</div>`;return;}const rows=data||[];
  body.innerHTML=`<button class="btn" id="addTraining">+ ${T("addTraining")}</button><div id="trainingList" class="list" style="margin-top:12px"></div>`;const list=body.querySelector("#trainingList");
  const form=(x={},isNew=false)=>{const d=document.createElement("div");d.className="card";d.style.marginBottom="12px";d.innerHTML=`<div class="field"><label>${T("titleAr")}</label><input data-f="title_ar" value="${esc(x.title_ar||"")}"></div><div class="field"><label>${T("titleFr")}</label><input data-f="title_fr" value="${esc(x.title_fr||"")}"></div><div class="field"><label>${T("descAr")}</label><textarea data-f="description_ar" rows="3">${esc(x.description_ar||"")}</textarea></div><div class="field"><label>${T("descFr")}</label><textarea data-f="description_fr" rows="3">${esc(x.description_fr||"")}</textarea></div><div class="field"><label>المحتوى الكامل بالعربية</label><textarea data-f="content_ar" rows="7">${esc(x.content_ar||"")}</textarea></div><div class="field"><label>أهم النقاط</label><textarea data-f="key_points_ar" rows="4">${esc(x.key_points_ar||"")}</textarea></div><div class="field"><label>المهمة العملية</label><textarea data-f="action_ar" rows="4">${esc(x.action_ar||"")}</textarea></div><div class="field"><label>سؤال التفكير</label><textarea data-f="reflection_ar" rows="3">${esc(x.reflection_ar||"")}</textarea></div><div class="field"><label>المصدر / الملاحظة</label><textarea data-f="source_note_ar" rows="2">${esc(x.source_note_ar||"")}</textarea></div><div class="field"><label>مدة التدريب بالدقائق</label><input data-f="estimated_minutes" type="number" min="1" value="${Number(x.estimated_minutes)||15}"></div><div class="field"><label>${T("video")}</label><input data-f="video_url" value="${esc(x.video_url||"")}" placeholder="https://..."></div><div class="field"><label>${T("pdf")}</label><input data-f="pdf_url" value="${esc(x.pdf_url||"")}" placeholder="https://..."></div><div class="field"><label>${T("order")}</label><input data-f="sort_order" type="number" value="${Number(x.sort_order)||0}"></div><label><input data-f="is_published" type="checkbox" ${x.is_published!==false?"checked":""}> ${T("published")}</label><div class="row" style="margin-top:10px"><button class="btn" data-save>${isNew?T("addTraining"):T("saveChanges")}</button>${!isNew?`<button class="btn alt" data-delete>${T("remove")}</button>`:`<button class="btn alt" data-cancel>${T("cancel")}</button>`}</div>`;d.querySelector("[data-save]").onclick=async()=>{const p={title_ar:d.querySelector('[data-f="title_ar"]').value.trim(),title_fr:d.querySelector('[data-f="title_fr"]').value.trim(),description_ar:d.querySelector('[data-f="description_ar"]').value.trim(),description_fr:d.querySelector('[data-f="description_fr"]').value.trim(),content_ar:d.querySelector('[data-f="content_ar"]').value.trim(),key_points_ar:d.querySelector('[data-f="key_points_ar"]').value.trim(),action_ar:d.querySelector('[data-f="action_ar"]').value.trim(),reflection_ar:d.querySelector('[data-f="reflection_ar"]').value.trim(),source_note_ar:d.querySelector('[data-f="source_note_ar"]').value.trim(),estimated_minutes:Number(d.querySelector('[data-f="estimated_minutes"]').value)||15,video_url:d.querySelector('[data-f="video_url"]').value.trim()||null,pdf_url:d.querySelector('[data-f="pdf_url"]').value.trim()||null,sort_order:Number(d.querySelector('[data-f="sort_order"]').value)||0,is_published:d.querySelector('[data-f="is_published"]').checked};if(!p.title_ar||!p.title_fr){toast(lang==="ar"?"يرجى كتابة العنوانين":"Veuillez renseigner les deux titres");return;}const r=isNew?await db.from("dxn_start_training").insert(p):await db.from("dxn_start_training").update(p).eq("id",x.id);if(r.error){toast(errText(r.error));return;}toast(T("success"));adminTraining(body);};if(!isNew)d.querySelector("[data-delete]").onclick=async()=>{if(!confirm(T("confirmDelete")))return;const pr=await db.from("dxn_start_progress").delete().eq("training_id",x.id);if(pr.error){toast(errText(pr.error));return;}const r=await db.from("dxn_start_training").delete().eq("id",x.id);if(r.error){toast(errText(r.error));return;}toast(T("success"));adminTraining(body);};if(isNew)d.querySelector("[data-cancel]").onclick=()=>d.remove();return d;};
  const render=()=>{list.innerHTML="";rows.forEach(x=>list.appendChild(form(x)));};render();body.querySelector("#addTraining").onclick=()=>list.prepend(form({},true));
}

async function adminTasks(body){
  const {data,error}=await db.from("dxn_start_tasks").select("*").order("day_number");if(error){body.innerHTML=`<div class="card">${esc(errText(error))}</div>`;return;}const rows=data||[];
  body.innerHTML=`<button class="btn" id="addTask">+ ${T("add")}</button><div id="taskList" class="list" style="margin-top:12px"></div>`;const list=body.querySelector("#taskList");
  const form=(x={},isNew=false)=>{const d=document.createElement("div");d.className="card";d.style.marginBottom="12px";d.innerHTML=`<div class="field"><label>${T("taskTitleAr")}</label><input data-f="title_ar" value="${esc(x.title_ar||"")}"></div><div class="field"><label>${T("taskTitleFr")}</label><input data-f="title_fr" value="${esc(x.title_fr||"")}"></div><div class="field"><label>${T("descAr")}</label><textarea data-f="description_ar" rows="2">${esc(x.description_ar||"")}</textarea></div><div class="field"><label>${T("descFr")}</label><textarea data-f="description_fr" rows="2">${esc(x.description_fr||"")}</textarea></div><div class="field"><label>${T("day")}</label><input data-f="day_number" type="number" min="1" value="${Number(x.day_number)||1}"></div><div class="field"><label>${T("taskPoints")}</label><input data-f="points" type="number" min="0" value="${Number(x.points)||0}"></div><div class="field"><label>${T("reportPrompt")}</label><textarea data-f="report_prompt_ar" rows="3">${esc(x.report_prompt_ar||"")}</textarea></div><div class="field"><label>Report prompt FR</label><textarea data-f="report_prompt_fr" rows="3">${esc(x.report_prompt_fr||"")}</textarea></div><label><input data-f="report_required" type="checkbox" ${x.report_required!==false?"checked":""}> ${T("reportRequired")}</label><label><input data-f="is_active" type="checkbox" ${x.is_active!==false?"checked":""}> ${T("activeTask")}</label><div class="row" style="margin-top:10px"><button class="btn" data-save>${isNew?T("add"):T("saveChanges")}</button><button class="btn alt" data-delete>${T("remove")}</button></div>`;d.querySelector("[data-save]").onclick=async()=>{const p={title_ar:d.querySelector('[data-f="title_ar"]').value.trim(),title_fr:d.querySelector('[data-f="title_fr"]').value.trim(),description_ar:d.querySelector('[data-f="description_ar"]').value.trim(),description_fr:d.querySelector('[data-f="description_fr"]').value.trim(),day_number:Number(d.querySelector('[data-f="day_number"]').value)||1,points:Number(d.querySelector('[data-f="points"]').value)||0,report_prompt_ar:d.querySelector('[data-f="report_prompt_ar"]').value.trim(),report_prompt_fr:d.querySelector('[data-f="report_prompt_fr"]').value.trim(),report_required:d.querySelector('[data-f="report_required"]').checked,is_active:d.querySelector('[data-f="is_active"]').checked};if(!p.title_ar||!p.title_fr){toast(lang==="ar"?"يرجى كتابة العنوانين":"Veuillez renseigner les deux titres");return;}const r=isNew?await db.from("dxn_start_tasks").insert(p):await db.from("dxn_start_tasks").update(p).eq("id",x.id);if(r.error){toast(errText(r.error));return;}toast(T("taskSaved"));adminTasks(body);};d.querySelector("[data-delete]").onclick=async()=>{if(!x.id){d.remove();return;}if(!confirm(T("confirmDelete")))return;const cr=await db.from("dxn_start_task_completions").delete().eq("task_id",x.id);if(cr.error){toast(errText(cr.error));return;}const r=await db.from("dxn_start_tasks").delete().eq("id",x.id);if(r.error){toast(errText(r.error));return;}adminTasks(body);};return d;};rows.forEach(x=>list.appendChild(form(x)));body.querySelector("#addTask").onclick=()=>list.prepend(form({title_ar:"مهمة جديدة",title_fr:"Nouvelle tâche",day_number:1,points:10,is_active:true},true));
}

async function adminReports(body){
  const [{data:tasks,error:e1},{data:training,error:e2}]=await Promise.all([
    db.from("dxn_start_task_reports").select("id,member_id,task_id,report_text,status,admin_note,submitted_at,reviewed_at,dxn_start_members(full_name,dxn_member_id,whatsapp),dxn_start_tasks(title_ar,title_fr,points)").order("submitted_at",{ascending:false}),
    db.from("dxn_start_training_reports").select("id,member_id,training_id,report_text,video_completed,watched_seconds,duration_seconds,submitted_at,dxn_start_members(full_name,dxn_member_id,whatsapp),dxn_start_training(title_ar,title_fr)").order("submitted_at",{ascending:false})
  ]);
  if(e1||e2){body.innerHTML=`<div class="card">${esc(errText(e1||e2))}</div>`;return;}
  const taskRows=tasks||[], trainingRows=training||[];
  body.innerHTML=`<div class="card"><h3>📝 ${lang==="ar"?"تقارير المهام":"Rapports des tâches"}</h3><div class="list">${taskRows.map(x=>`<div class="item"><div class="row between"><b>${esc(x.dxn_start_members?.full_name||"عضو")}</b><span class="pill">${esc(x.status||"submitted")}</span></div><p><b>${esc(lang==="ar"?x.dxn_start_tasks?.title_ar:x.dxn_start_tasks?.title_fr)}</b> · +${Number(x.dxn_start_tasks?.points)||0}</p><p class="small muted">${esc(x.submitted_at||"")}</p><div class="card" style="margin-top:8px;line-height:1.9">${esc(x.report_text)}</div><p class="small">${esc(x.admin_note||"")}</p></div>`).join("")||T("no")}</div></div>
  <div class="card" style="margin-top:14px"><h3>🎓 ${lang==="ar"?"ملخصات التدريب":"Résumés des formations"}</h3><div class="list">${trainingRows.map(x=>{const pct=x.duration_seconds?Math.min(100,Math.round(Number(x.watched_seconds||0)/Number(x.duration_seconds)*100)):100;return `<div class="item"><div class="row between"><b>${esc(x.dxn_start_members?.full_name||"عضو")}</b><span class="pill">${x.video_completed?"✓":"—"} ${pct}%</span></div><p><b>${esc(lang==="ar"?x.dxn_start_training?.title_ar:x.dxn_start_training?.title_fr)}</b></p><p class="small muted">${esc(x.submitted_at||"")}</p><div class="card" style="margin-top:8px;line-height:1.9">${esc(x.report_text)}</div></div>`;}).join("")||T("no")}</div></div>`;
}
async function adminMessages(body){
  const {data,error}=await db.from("dxn_start_message_templates").select("*").order("created_at",{ascending:false});if(error){body.innerHTML=`<div class="card">${esc(errText(error))}</div>`;return;}const rows=data||[];
  body.innerHTML=`<button class="btn" id="addMsg">+ ${T("add")}</button><div id="msgList" class="list" style="margin-top:12px"></div>`;const list=body.querySelector("#msgList");
  const form=(x={},isNew=false)=>{const d=document.createElement("div");d.className="card";d.style.marginBottom="12px";d.innerHTML=`<div class="field"><label>${T("messageName")}</label><input data-f="name" value="${esc(x.name||"")}"></div><div class="field"><label>${T("bodyAr")}</label><textarea data-f="body_ar" rows="4">${esc(x.body_ar||"")}</textarea></div><div class="field"><label>${T("bodyFr")}</label><textarea data-f="body_fr" rows="4">${esc(x.body_fr||"")}</textarea></div><label><input data-f="active" type="checkbox" ${x.active!==false?"checked":""}> ${T("active")}</label><div class="row" style="margin-top:10px"><button class="btn" data-save>${isNew?T("add"):T("saveChanges")}</button><button class="btn alt" data-delete>${T("remove")}</button></div>`;d.querySelector("[data-save]").onclick=async()=>{const p={name:d.querySelector('[data-f="name"]').value.trim(),body_ar:d.querySelector('[data-f="body_ar"]').value.trim(),body_fr:d.querySelector('[data-f="body_fr"]').value.trim(),active:d.querySelector('[data-f="active"]').checked};if(!p.name){toast(lang==="ar"?"يرجى كتابة اسم الرسالة":"Veuillez renseigner le nom");return;}const r=isNew?await db.from("dxn_start_message_templates").insert(p):await db.from("dxn_start_message_templates").update(p).eq("id",x.id);if(r.error){toast(errText(r.error));return;}toast(T("messageSaved"));adminMessages(body);};d.querySelector("[data-delete]").onclick=async()=>{if(!x.id){d.remove();return;}if(!confirm(T("confirmDelete")))return;const r=await db.from("dxn_start_message_templates").delete().eq("id",x.id);if(r.error){toast(errText(r.error));return;}adminMessages(body);};return d;};rows.forEach(x=>list.appendChild(form(x)));body.querySelector("#addMsg").onclick=()=>list.prepend(form({name:"رسالة جديدة",body_ar:"",body_fr:"",active:true},true));
}

async function adminFollowups(body){
  const {data,error}=await db.from("dxn_start_followups").select("id,member_id,followup_at,channel,status,notes,message_template_id,dxn_start_members(full_name,whatsapp)").order("followup_at",{ascending:true});
  if(error){body.innerHTML=`<div class="card">${esc(errText(error))}</div>`;return;}
  const rows=data||[];
  body.innerHTML=`<button class="btn" id="addFollow">+ ${T("addFollowup")}</button><div id="followList" class="list" style="margin-top:12px"></div>`;
  const list=body.querySelector("#followList");
  list.innerHTML=rows.map(x=>`<div class="item"><div class="row between"><b>${esc(x.dxn_start_members?.full_name||"عضو")}</b><span class="pill">${esc(x.status||"pending")}</span></div><p class="small muted">${esc(x.followup_at||"")} · ${esc(x.channel||"")}</p><p>${esc(x.notes||"")}</p><div class="row">${x.dxn_start_members?.whatsapp?`<a class="btn" target="_blank" rel="noopener" href="https://wa.me/${String(x.dxn_start_members.whatsapp).replace(/\D/g,"")}">${T("send")}</a>`:""}<button class="btn alt" data-edit-follow="${x.id}">${T("edit")}</button><button class="btn alt" data-done="${x.id}">${T("done")}</button><button class="btn alt" data-del-follow="${x.id}">${T("remove")}</button></div></div>`).join("")||T("no");
  list.querySelectorAll("[data-done]").forEach(b=>b.onclick=async()=>{const r=await db.from("dxn_start_followups").update({status:"done"}).eq("id",b.dataset.done);if(r.error)toast(errText(r.error));else{toast(T("followSaved"));adminFollowups(body);}});
  list.querySelectorAll("[data-del-follow]").forEach(b=>b.onclick=async()=>{if(!confirm(T("confirmDelete")))return;const r=await db.from("dxn_start_followups").delete().eq("id",b.dataset.delFollow);if(r.error)toast(errText(r.error));else{toast(T("success"));adminFollowups(body);}});
  list.querySelectorAll("[data-edit-follow]").forEach(b=>b.onclick=()=>editFollowup(b.dataset.editFollow,rows,body));
  body.querySelector("#addFollow").onclick=()=>followupEditor(body);
}

async function editFollowup(id,rows,body){
  const x=rows.find(z=>z.id===id);if(!x)return;
  const card=document.createElement("div");card.className="card";card.style.marginBottom="12px";
  const members=(await db.from("dxn_start_members").select("id,full_name,whatsapp").order("full_name")).data||[];
  card.innerHTML=`<h3>${T("edit")}</h3><div class="field"><label>${T("memberList")}</label><select id="fm">${members.map(m=>`<option value="${m.id}">${esc(m.full_name)} — ${esc(m.whatsapp||"")}</option>`).join("")}</select></div><div class="field"><label>${T("followAt")}</label><input id="fa" type="datetime-local"></div><div class="field"><label>${T("channel")}</label><select id="fc"><option value="whatsapp">WhatsApp</option><option value="phone">Phone</option><option value="platform">Platform</option></select></div><div class="field"><label>${T("status")}</label><select id="fs"><option value="pending">pending</option><option value="done">done</option><option value="cancelled">cancelled</option></select></div><div class="field"><label>${T("notes")}</label><textarea id="fn" rows="3">${esc(x.notes||"")}</textarea></div><div class="row"><button class="btn" id="saveEF">${T("save")}</button><button class="btn alt" id="cancelEF">${T("cancel")}</button></div>`;
  body.prepend(card);card.querySelector("#fm").value=x.member_id;card.querySelector("#fc").value=x.channel||"whatsapp";card.querySelector("#fs").value=x.status||"pending";
  const dt=new Date(x.followup_at);if(!Number.isNaN(dt.getTime())){const pad=n=>String(n).padStart(2,"0");card.querySelector("#fa").value=dt.getFullYear()+"-"+pad(dt.getMonth()+1)+"-"+pad(dt.getDate())+"T"+pad(dt.getHours())+":"+pad(dt.getMinutes());}
  card.querySelector("#cancelEF").onclick=()=>card.remove();card.querySelector("#saveEF").onclick=async()=>{const raw=card.querySelector("#fa").value;if(!raw){toast(lang==="ar"?"اختر الموعد":"Choisissez la date");return;}const r=await db.from("dxn_start_followups").update({member_id:card.querySelector("#fm").value,followup_at:new Date(raw).toISOString(),channel:card.querySelector("#fc").value,status:card.querySelector("#fs").value,notes:card.querySelector("#fn").value.trim()}).eq("id",id);if(r.error){toast(errText(r.error));return;}toast(T("followSaved"));adminFollowups(body);};
}

async function followupEditor(body){
  const {data:members,error}=await db.from("dxn_start_members").select("id,full_name,whatsapp").order("full_name");if(error){toast(errText(error));return;}const card=document.createElement("div");card.className="card";card.style.marginBottom="12px";card.innerHTML=`<h3>${T("newFollow")}</h3><div class="field"><label>${T("memberList")}</label><select id="fm">${(members||[]).map(x=>`<option value="${x.id}">${esc(x.full_name)} — ${esc(x.whatsapp||"")}</option>`).join("")}</select></div><div class="field"><label>${T("followAt")}</label><input id="fa" type="datetime-local"></div><div class="field"><label>${T("channel")}</label><select id="fc"><option value="whatsapp">WhatsApp</option><option value="phone">Phone</option><option value="platform">Platform</option></select></div><div class="field"><label>${T("notes")}</label><textarea id="fn" rows="3"></textarea></div><div class="row"><button class="btn" id="saveF">${T("save")}</button><button class="btn alt" id="cancelF">${T("cancel")}</button></div>`;body.prepend(card);card.querySelector("#cancelF").onclick=()=>card.remove();card.querySelector("#saveF").onclick=async()=>{const p={member_id:card.querySelector("#fm").value,followup_at:new Date(card.querySelector("#fa").value).toISOString(),channel:card.querySelector("#fc").value,status:"pending",notes:card.querySelector("#fn").value.trim()};if(!p.member_id||!card.querySelector("#fa").value){toast(lang==="ar"?"اختر العضو والموعد":"Choisissez le membre et la date");return;}const r=await db.from("dxn_start_followups").insert(p);if(r.error){toast(errText(r.error));return;}toast(T("followSaved"));adminFollowups(body);};
}

function render(){document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";const b=document.querySelector("#langBtn");if(b)b.textContent=lang==="ar"?"FR":"AR";if(member){if(isAdmin)renderAdminOnly();else dashboard();}else auth();}

document.querySelector("#langBtn").onclick=setLang;
document.querySelector("#logoutBtn").onclick=async()=>{if(db)await db.auth.signOut();member=null;isAdmin=false;render();};
if(db)db.auth.onAuthStateChange(()=>setTimeout(boot,0));
boot();

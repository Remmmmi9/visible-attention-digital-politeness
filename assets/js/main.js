
document.querySelectorAll('.nav-group > button').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const group = btn.parentElement;
    document.querySelectorAll('.nav-group').forEach(g=>{ if(g!==group) g.classList.remove('open'); });
    group.classList.toggle('open');
    btn.setAttribute('aria-expanded', group.classList.contains('open'));
  });
});

document.addEventListener('click', (e)=>{
  if(!e.target.closest('.nav-group')){
    document.querySelectorAll('.nav-group').forEach(g=>g.classList.remove('open'));
  }
});

let topZ = 10;
document.querySelectorAll('.draggable').forEach(card=>{
  card.tabIndex = 0;
  let isDown = false, startX = 0, startY = 0, left = 0, top = 0, moved = false;
  function bring(){ card.style.zIndex = ++topZ; }
  card.addEventListener('pointerdown', e=>{
    isDown = true; moved = false; bring();
    const rect = card.getBoundingClientRect();
    const parent = card.parentElement.getBoundingClientRect();
    left = rect.left - parent.left; top = rect.top - parent.top;
    startX = e.clientX; startY = e.clientY;
    card.setPointerCapture(e.pointerId);
  });
  card.addEventListener('pointermove', e=>{
    if(!isDown) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if(Math.abs(dx)+Math.abs(dy)>4) moved = true;
    card.style.left = left + dx + 'px';
    card.style.top = top + dy + 'px';
  });
  card.addEventListener('pointerup', e=>{ isDown = false; });
  card.addEventListener('click', e=>{
    bring();
    if(!moved && e.detail >= 2) window.location.href = card.dataset.link;
  });
  card.addEventListener('keydown', e=>{
    if(e.key === 'Enter') window.location.href = card.dataset.link;
  });
});

const form = document.querySelector('.feedback-form');
if(form){
  const input = form.querySelector('input');
  const wall = document.querySelector('.thought-wall');
  form.querySelector('button').addEventListener('click', ()=>{
    const val = input.value.trim();
    if(!val) return;
    const d = document.createElement('div');
    d.textContent = `“${val}”`;
    wall.prepend(d);
    input.value = '';
  });
}


/* Digital Map interaction */
const mapSpaces = {
  whatsapp: {
    number: "01",
    title: "WhatsApp",
    subtitle: "Fast, visible, task-based",
    body: [
      "WhatsApp often feels like a fast-paced space for me, especially in group work, society communication and practical tasks.",
      "The strongest feeling it gives me is visibility. Read receipts, timestamps and short replies all make me aware that other people may know I have seen the message, and may also notice when I reply.",
      "Because of this, even when I am still checking information or thinking about how to say something in English, I often feel that I should respond first. On the surface, WhatsApp is just a chat tool, but in group work or practical communication, it can also carry responsibility and reply pressure."
    ],
    tags: ["attention", "delay", "responsibility", "reply timing"]
  },
  wechat: {
    number: "02",
    title: "WeChat",
    subtitle: "Familiar, emotional, flexible",
    body: [
      "WeChat feels more familiar to me, and closer to everyday communication. It is connected to family, close friends and more relaxed conversations.",
      "In this space, I care more about emotional expression. Tone can be softened through stickers, voice messages, emojis, or small explanations such as “I was busy just now” or “I only just saw this”. For me, WeChat is not completely pressure-free, but it gives more space to show warmth, repair relationships and maintain closeness."
    ],
    tags: ["closeness", "care", "emotion", "relationship maintenance"]
  },
  email: {
    number: "03",
    title: "Email",
    subtitle: "Formal, careful, structured",
    body: [
      "Email automatically makes me slower and more careful.",
      "Every time I write an email, I pay more attention to how I start, how I organise the information, whether my tone is polite, and whether the ending feels appropriate. It is not like a chat app where I can send a quick sentence. It feels more like a formal message that needs to be carefully structured.",
      "In this space, I care more about whether I sound clear, reasonable and professional. It makes me realise that communication is not only about sending information, but also about presenting my attitude and ability."
    ],
    tags: ["clarity", "politeness", "organisation"]
  },
  teams: {
    number: "04",
    title: "Teams / OneDrive",
    subtitle: "Contribution, responsibility, progress",
    body: [
      "Collaborative platforms such as Teams, OneDrive and shared documents are not only communication tools. They also record project progress and individual contribution.",
      "Uploads, comments, edits and file versions all make group work visible. In these spaces, communication is closely connected to responsibility.",
      "Because of this, I become more aware of my own role in the group. These platforms show me that contribution in group work is not always abstract. It can become visible through versions, comments and files."
    ],
    tags: ["progress", "contribution", "responsibility", "teamwork"]
  },
  social: {
    number: "05",
    title: "Social Media",
    subtitle: "Curated self, light interaction, visibility",
    body: [
      "Public or semi-public platforms such as Instagram, Red, Weibo and TikTok make me more aware of self-presentation. Likes, short comments, images and captions create a lighter but still visible form of interaction.",
      "In these spaces, I am not always communicating directly with one person. I am also choosing what kind of version of myself I want others to see. Even a small post, a like, a comment or an image can become part of how other people understand me."
    ],
    tags: ["taste", "identity", "lifestyle"]
  }
};

const mapNodes = document.querySelectorAll(".map-node");
const mapPanel = document.querySelector(".map-info-panel");
if (mapNodes.length && mapPanel) {
  const numberEl = mapPanel.querySelector(".panel-number");
  const titleEl = mapPanel.querySelector("h2");
  const subtitleEl = mapPanel.querySelector(".panel-subtitle");
  const bodyEl = mapPanel.querySelector(".panel-body");
  const tagsEl = mapPanel.querySelector(".visible-tags");

  function updateMapPanel(key) {
    const data = mapSpaces[key];
    if (!data) return;
    mapNodes.forEach(node => node.classList.toggle("active", node.dataset.space === key));
    numberEl.textContent = data.number;
    titleEl.textContent = data.title;
    subtitleEl.textContent = data.subtitle;
    bodyEl.innerHTML = data.body.map(item => `<p>${item}</p>`).join("");
    tagsEl.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join("");
  }

  mapNodes.forEach(node => node.addEventListener("click", () => updateMapPanel(node.dataset.space)));
}


/* Close Reading emoji pop notes */
const emojiButtons = document.querySelectorAll(".emoji-pop");
const emojiNote = document.querySelector(".emoji-note");
if (emojiButtons.length && emojiNote) {
  emojiButtons.forEach((button) => {
    button.addEventListener("click", () => {
      emojiButtons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      emojiNote.innerHTML = `<strong>${button.textContent}</strong><p>${button.dataset.note}</p>`;
    });
  });
}

// اردو ڈیٹا
const lyricsData = [
    { id: 1, title: "تو ہی مالک", category: "Hamd", sub: "حمد", preview: "تو ہی مالک، تو ہی رب العزت...", fullLyrics: "تو ہی مالک، تو ہی رب العزت\nبخش دے ہم کو اپنی رحمت\nہر گناہوں سے پاک کر دے\nیا الٰہی مجھ کو راہ پہ چل دے" },
    { id: 2, title: "وحدانی تیری", category: "Hamd", sub: "حمد", preview: "وحدانی تیری جلوہ گر، کوئی نہیں تیرے سوا...", fullLyrics: "وحدانی تیری جلوہ گر، کوئی نہیں تیرے سوا\nہر ذرے پہ تیرا نام، تو ہی اول تو ہی دعا" },
    { id: 3, title: "تاجدارِ حرم", category: "Naat", sub: "نعت شریف", preview: "تاجدارِ حرم، نورِ چشمِ عالم...", fullLyrics: "تاجدارِ حرم، نورِ چشمِ عالم\nتیرے در سے نہیں جاتا کوئی خالی حرم\nدو جہاں کی امانت ہے سرِ تاجِ نبی..." },
    { id: 4, title: "بسم اللہ کر لیا", category: "Naat", sub: "نعت", preview: "بسم اللہ کر لیا، تجھ پہ اے روضۂ پاک...", fullLyrics: "بسم اللہ کر لیا، تجھ پہ اے روضۂ پاک\nمیں نے یوں سر کو جھکا لیا، مل گیا رب کا پیاک" },
    { id: 5, title: "میرے خواجہ", category: "Manqabat", sub: "منقبت", preview: "میرے خواجہ، دل کا سہارا...", fullLyrics: "میرے خواجہ، دل کا سہارا، تو ہی میرا ہے پتا\nدر تیرے پہ آیا لاچار، خواجہ میرا دل ہے فنا" },
    { id: 6, title: "شاہِ مدینہ", category: "Manqabat", sub: "منقبت", preview: "شاہِ مدینہ، شفیعِ مجرمین...", fullLyrics: "شاہِ مدینہ، شفیعِ مجرمین\nتو ہی سہارا ہے ہر مومن کے دل کا" },
    { id: 7, title: "چاند سے پیارا احمد میرا", category: "Nazam", sub: "نظم", preview: "چاند سے پیارا احمد میرا نبی...", fullLyrics: "چاند سے پیارا احمد میرا نبی\nتو ہی ہے میری جان کی دوا" },
    { id: 8, title: "رات کی تنہائی میں", category: "Nazam", sub: "نظم", preview: "رات کی تنہائی میں یاد تمہاری آئی...", fullLyrics: "رات کی تنہائی میں یاد تمہاری آئی\nدل میں محبت کی لو جلائی" },
    { id: 9, title: "الٰہی تو ہی رحمان", category: "Dua", sub: "دعا", preview: "الٰہی تو ہی رحمان، بخش دے مجھ کو...", fullLyrics: "الٰہی تو ہی رحمان، بخش دے مجھ کو\nمیری لاچاری کو تو ہی ہے جاننے والا" }
];

const categories = [
    { key: "Hamd", name: "حمد", icon: "fas fa-star-and-crescent" },
    { key: "Naat", name: "نعت", icon: "fas fa-feather-alt" },
    { key: "Manqabat", name: "منقبت", icon: "fas fa-hand-sparkles" },
    { key: "Nazam", name: "نظم", icon: "fas fa-pen-fancy" },
    { key: "Dua", name: "دعا", icon: "fas fa-hands-praying" }
];

// ---------- Views Count ----------
function getViews() {
    const views = localStorage.getItem("lyricsViews");
    return views ? JSON.parse(views) : {};
}
function saveViews(views) {
    localStorage.setItem("lyricsViews", JSON.stringify(views));
}
function incrementView(lyricId) {
    let views = getViews();
    views[lyricId] = (views[lyricId] || 0) + 1;
    saveViews(views);
}
function getMostViewed(limit = 5) {
    const views = getViews();
    const items = [];
    for (let id in views) {
        const lyric = lyricsData.find(l => l.id == id);
        if (lyric) items.push({ ...lyric, count: views[id] });
    }
    items.sort((a,b) => b.count - a.count);
    return items.slice(0, limit);
}

// ---------- State Persistence ----------
let currentView = "categories";
let activeCategory = null;
let searchTerm = "";
let selectedLyric = null;

function saveState() {
    localStorage.setItem("appState", JSON.stringify({
        currentView, activeCategory, searchTerm,
        selectedLyricId: selectedLyric ? selectedLyric.id : null
    }));
}
function loadState() {
    const saved = localStorage.getItem("appState");
    if (!saved) return;
    try {
        const s = JSON.parse(saved);
        currentView = s.currentView;
        activeCategory = s.activeCategory;
        searchTerm = s.searchTerm || "";
        if (s.selectedLyricId) selectedLyric = lyricsData.find(l => l.id === s.selectedLyricId);
        else selectedLyric = null;
    } catch(e) {}
}

// Helper functions
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
function matchesSearch(item, term) {
    if (!term.trim()) return true;
    const lt = term.toLowerCase();
    return item.title.toLowerCase().includes(lt) || item.sub.toLowerCase().includes(lt) ||
           item.preview.toLowerCase().includes(lt) || item.fullLyrics.toLowerCase().includes(lt);
}
function highlightText(text, term) {
    if (!term.trim()) return escapeHtml(text);
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark style="background:#ffe6b3; padding:0 2px; border-radius:4px;">$1</mark>');
}
async function shareLyric(lyric) {
    const shareText = `${lyric.title}\n${lyric.sub}\n\n${lyric.fullLyrics.substring(0, 500)}${lyric.fullLyrics.length > 500 ? '...' : ''}`;
    if (navigator.share) {
        try { await navigator.share({ title: lyric.title, text: shareText }); } 
        catch(e) { if (e.name !== 'AbortError') copyToClipboard(shareText); }
    } else copyToClipboard(shareText);
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showToast("📋 کاپی ہو گئی!")).catch(() => showToast("❌ کاپی نہیں ہو سکی۔"));
}
function showToast(msg) {
    let t = document.querySelector('.toast-msg');
    if (t) t.remove();
    t = document.createElement('div');
    t.className = 'toast-msg';
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

const container = document.getElementById("dynamicContent");

function renderMostViewed() {
    const most = getMostViewed(5);
    if (most.length === 0) {
        return `<div class="trending-section"><div class="trending-title"><i class="fas fa-fire"></i> سب سے زیادہ دیکھے گئے</div><div style="padding:0.5rem 0; font-size:0.8rem; color:#8aa08a;">✨ ابھی کوئی کلام نہیں دیکھا گیا۔ کوئی بھی کلام کھولیں، یہاں دکھے گا۔</div></div>`;
    }
    let html = `<div class="trending-section"><div class="trending-title"><i class="fas fa-fire"></i> سب سے زیادہ دیکھے گئے</div><div class="trending-scroll">`;
    most.forEach(item => {
        html += `<div class="trending-card" data-id="${item.id}"><div class="title">${escapeHtml(item.title)}</div><div class="views"><i class="fas fa-eye"></i> ${item.count}</div></div>`;
    });
    html += `</div></div>`;
    return html;
}

function renderCategories() {
    let html = renderMostViewed();
    html += `<div class="categories-grid">`;
    categories.forEach(cat => {
        html += `<div class="category-card" data-cat-key="${cat.key}"><div class="category-icon"><i class="${cat.icon}"></i></div><div class="category-name">${cat.name}</div></div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            activeCategory = card.getAttribute("data-cat-key");
            currentView = "lyricsList";
            searchTerm = "";
            saveState();
            renderLyricsList();
        });
    });
    document.querySelectorAll(".trending-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = parseInt(card.getAttribute("data-id"));
            selectedLyric = lyricsData.find(l => l.id === id);
            if (selectedLyric) {
                currentView = "detail";
                saveState();
                renderDetailView();
            }
        });
    });
}

function renderLyricsList() {
    const catObj = categories.find(c => c.key === activeCategory);
    const catName = catObj ? catObj.name : activeCategory;
    let html = `
        <div class="top-bar">
            <button class="back-btn" id="backToCategoriesBtn"><i class="fas fa-arrow-right"></i> تمام زمرہ جات</button>
            <div class="search-box"><i class="fas fa-search"></i><input type="text" id="searchInput" placeholder="${catName} میں تلاش کریں..." value="${escapeHtml(searchTerm)}"></div>
        </div>
        <div id="lyricsListContainer" class="lyrics-list"></div>
    `;
    container.innerHTML = html;
    const updateList = () => {
        const listDiv = document.getElementById("lyricsListContainer");
        if (!listDiv) return;
        let filtered = lyricsData.filter(l => l.category === activeCategory && matchesSearch(l, searchTerm));
        if (filtered.length === 0) {
            listDiv.innerHTML = `<div class="no-results"><i class="fas fa-quran"></i> کوئی کلام نہیں ملا 😔</div>`;
        } else {
            let cards = "";
            filtered.forEach(lyric => {
                let preview = searchTerm.trim() ? highlightText(lyric.preview, searchTerm) : escapeHtml(lyric.preview);
                cards += `<div class="lyric-card" data-id="${lyric.id}"><div class="card-title"><i class="fas fa-quran"></i><span>${escapeHtml(lyric.title)}</span></div><div class="card-sub"><span><i class="fas fa-tag"></i> ${escapeHtml(lyric.sub)}</span></div><div class="preview-text">“${preview}”</div></div>`;
            });
            listDiv.innerHTML = cards;
            document.querySelectorAll(".lyric-card").forEach(card => {
                card.addEventListener("click", () => {
                    const id = parseInt(card.getAttribute("data-id"));
                    selectedLyric = lyricsData.find(l => l.id === id);
                    if (selectedLyric) {
                        currentView = "detail";
                        saveState();
                        renderDetailView();
                    }
                });
            });
        }
    };
    updateList();
    document.getElementById("backToCategoriesBtn")?.addEventListener("click", () => {
        currentView = "categories";
        activeCategory = null;
        searchTerm = "";
        saveState();
        renderCategories();
    });
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchTerm = e.target.value;
            saveState();
            updateList();
        });
    }
}

function renderDetailView() {
    if (!selectedLyric) {
        currentView = "categories";
        saveState();
        renderCategories();
        return;
    }
    incrementView(selectedLyric.id);
    const html = `
        <div class="top-bar" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <button class="back-btn" id="backFromDetailBtn"><i class="fas fa-arrow-right"></i> واپس</button>
            <button class="share-btn" id="shareDetailBtn"><i class="fas fa-share-alt"></i> شیئر کریں</button>
        </div>
        <div class="detail-container">
            <div class="detail-title">${escapeHtml(selectedLyric.title)}</div>
            <div class="detail-sub">${escapeHtml(selectedLyric.sub)}</div>
            <div class="detail-content">${escapeHtml(selectedLyric.fullLyrics)}</div>
        </div>
    `;
    container.innerHTML = html;
    document.getElementById("backFromDetailBtn")?.addEventListener("click", () => {
        currentView = "lyricsList";
        saveState();
        renderLyricsList();
    });
    document.getElementById("shareDetailBtn")?.addEventListener("click", () => {
        shareLyric(selectedLyric);
    });
}

// شروع
loadState();
if (currentView === "categories") renderCategories();
else if (currentView === "lyricsList" && activeCategory) renderLyricsList();
else if (currentView === "detail" && selectedLyric) renderDetailView();
else { currentView = "categories"; renderCategories(); }

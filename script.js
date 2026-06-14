// ---------- اردو ڈیٹا (اب tags بھی شامل) ----------
const lyricsData = [
    { id: 1, title: "تو ہی مالک", category: "Hamd", sub: "حمد", preview: "تو ہی مالک، تو ہی رب العزت...", fullLyrics: "تو ہی مالک، تو ہی رب العزت\nبخش دے ہم کو اپنی رحمت\nہر گناہوں سے پاک کر دے\nیا الٰہی مجھ کو راہ پہ چل دے", tags: ["توحید", "اللہ", "رحمت"] },
    { id: 2, title: "وحدانی تیری", category: "Hamd", sub: "حمد", preview: "وحدانی تیری جلوہ گر، کوئی نہیں تیرے سوا...", fullLyrics: "وحدانی تیری جلوہ گر، کوئی نہیں تیرے سوا\nہر ذرے پہ تیرا نام، تو ہی اول تو ہی دعا", tags: ["توحید", "اللہ"] },
    { id: 3, title: "تاجدارِ حرم", category: "Naat", sub: "نعت شریف", preview: "تاجدارِ حرم، نورِ چشمِ عالم...", fullLyrics: "تاجدارِ حرم، نورِ چشمِ عالم\nتیرے در سے نہیں جاتا کوئی خالی حرم\nدو جہاں کی امانت ہے سرِ تاجِ نبی...", tags: ["نعت", "رسول اللہ", "مدینہ"] },
    { id: 4, title: "بسم اللہ کر لیا", category: "Naat", sub: "نعت", preview: "بسم اللہ کر لیا، تجھ پہ اے روضۂ پاک...", fullLyrics: "بسم اللہ کر لیا، تجھ پہ اے روضۂ پاک\nمیں نے یوں سر کو جھکا لیا، مل گیا رب کا پیاک", tags: ["نعت", "بسم اللہ", "مدینہ"] },
    { id: 5, title: "میرے خواجہ", category: "Manqabat", sub: "منقبت", preview: "میرے خواجہ، دل کا سہارا...", fullLyrics: "میرے خواجہ، دل کا سہارا، تو ہی میرا ہے پتا\nدر تیرے پہ آیا لاچار، خواجہ میرا دل ہے فنا", tags: ["منقبت", "خواجہ غریب نواز", "اجمیر"] },
    { id: 6, title: "شاہِ مدینہ", category: "Manqabat", sub: "منقبت", preview: "شاہِ مدینہ، شفیعِ مجرمین...", fullLyrics: "شاہِ مدینہ، شفیعِ مجرمین\nتو ہی سہارا ہے ہر مومن کے دل کا", tags: ["منقبت", "مدینہ", "رسول اللہ"] },
    { id: 7, title: "چاند سے پیارا احمد میرا", category: "Nazam", sub: "نظم", preview: "چاند سے پیارا احمد میرا نبی...", fullLyrics: "چاند سے پیارا احمد میرا نبی\nتو ہی ہے میری جان کی دوا", tags: ["نظم", "نعت", "رسول اللہ"] },
    { id: 8, title: "رات کی تنہائی میں", category: "Nazam", sub: "نظم", preview: "رات کی تنہائی میں یاد تمہاری آئی...", fullLyrics: "رات کی تنہائی میں یاد تمہاری آئی\nدل میں محبت کی لو جلائی", tags: ["نظم", "محبت", "رسول اللہ"] },
    { id: 9, title: "الٰہی تو ہی رحمان", category: "Dua", sub: "دعا", preview: "الٰہی تو ہی رحمان، بخش دے مجھ کو...", fullLyrics: "الٰہی تو ہی رحمان، بخش دے مجھ کو\nمیری لاچاری کو تو ہی ہے جاننے والا", tags: ["دعا", "اللہ", "رحمت"] }
];

const categories = [
    { key: "Hamd", name: "حمد", icon: "fas fa-star-and-crescent" },
    { key: "Naat", name: "نعت", icon: "fas fa-feather-alt" },
    { key: "Manqabat", name: "منقبت", icon: "fas fa-hand-sparkles" },
    { key: "Nazam", name: "نظم", icon: "fas fa-pen-fancy" },
    { key: "Dua", name: "دعا", icon: "fas fa-hands-praying" }
];

// ---------- Favorites ----------
function getFavorites() {
    const fav = localStorage.getItem("favorites");
    return fav ? JSON.parse(fav) : [];
}
function saveFavorites(fav) {
    localStorage.setItem("favorites", JSON.stringify(fav));
}
function toggleFavorite(lyricId) {
    let fav = getFavorites();
    if (fav.includes(lyricId)) {
        fav = fav.filter(id => id !== lyricId);
    } else {
        fav.push(lyricId);
    }
    saveFavorites(fav);
    return fav.includes(lyricId);
}
function isFavorite(lyricId) {
    return getFavorites().includes(lyricId);
}
function getFavoriteLyrics() {
    const favIds = getFavorites();
    return lyricsData.filter(l => favIds.includes(l.id));
}

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
let activeTag = null;  // for tag view

function saveState() {
    localStorage.setItem("appState", JSON.stringify({
        currentView, activeCategory, searchTerm, activeTag,
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
        activeTag = s.activeTag || null;
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

// Render functions
function renderMostViewed() {
    const most = getMostViewed(5);
    if (most.length === 0) {
        return `<div class="trending-section"><div class="trending-title"><i class="fas fa-fire"></i> سب سے زیادہ دیکھے گئے</div><div style="padding:0.5rem 0; font-size:0.8rem; color:#8aa08a;">✨ ابھی کوئی کلام نہیں دیکھا گیا۔</div></div>`;
    }
    let html = `<div class="trending-section"><div class="trending-title"><i class="fas fa-fire"></i> سب سے زیادہ دیکھے گئے</div><div class="trending-scroll">`;
    most.forEach(item => {
        html += `<div class="trending-card" data-id="${item.id}"><div class="title">${escapeHtml(item.title)}</div><div class="views"><i class="fas fa-eye"></i> ${item.count}</div></div>`;
    });
    html += `</div></div>`;
    return html;
}

function renderFavoritesSection() {
    const favLyrics = getFavoriteLyrics();
    if (favLyrics.length === 0) return '';
    let html = `<div class="trending-section" style="border-top:1px solid #ecefeb;"><div class="trending-title"><i class="fas fa-heart" style="color:#e74c3c;"></i> آپ کے پسندیدہ کلام</div><div class="trending-scroll">`;
    favLyrics.forEach(item => {
        html += `<div class="trending-card fav-card" data-id="${item.id}"><div class="title">${escapeHtml(item.title)}</div></div>`;
    });
    html += `</div></div>`;
    return html;
}

function renderCategories() {
    let html = renderMostViewed();
    html += renderFavoritesSection();
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
            activeTag = null;
            saveState();
            renderLyricsList();
        });
    });
    document.querySelectorAll(".trending-card, .fav-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = parseInt(card.getAttribute("data-id"));
            selectedLyric = lyricsData.find(l => l.id === id);
            if (selectedLyric) {
                currentView = "detail";
                activeTag = null;
                saveState();
                renderDetailView();
            }
        });
    });
}

function renderTagView(tag) {
    activeTag = tag;
    const filtered = lyricsData.filter(l => l.tags && l.tags.includes(tag));
    let html = `
        <div class="top-bar">
            <button class="back-btn" id="backToHomeBtn"><i class="fas fa-arrow-right"></i> تمام زمرہ جات</button>
            <div style="padding:0.5rem 0; font-weight:500;">ٹیگ: #${escapeHtml(tag)} (${filtered.length} کلام)</div>
        </div>
        <div class="lyrics-list">
    `;
    if (filtered.length === 0) {
        html += `<div class="no-results">کوئی کلام نہیں ملا</div>`;
    } else {
        filtered.forEach(lyric => {
            html += renderLyricCard(lyric);
        });
    }
    html += `</div>`;
    container.innerHTML = html;
    document.getElementById("backToHomeBtn")?.addEventListener("click", () => {
        currentView = "categories";
        activeCategory = null;
        activeTag = null;
        searchTerm = "";
        saveState();
        renderCategories();
    });
    attachCardEvents();
    attachTagEvents(); // for tags inside cards
    attachFavEvents();
}

function renderLyricCard(lyric) {
    const favClass = isFavorite(lyric.id) ? 'active' : '';
    const tagsHtml = lyric.tags ? lyric.tags.map(t => `<span class="tag-badge" data-tag="${t}">#${escapeHtml(t)}</span>`).join('') : '';
    return `
        <div class="lyric-card" data-id="${lyric.id}">
            <div class="card-fav"><button class="fav-btn ${favClass}" data-id="${lyric.id}"><i class="fas fa-heart"></i></button></div>
            <div class="card-title"><i class="fas fa-quran"></i><span>${escapeHtml(lyric.title)}</span></div>
            <div class="card-sub"><span><i class="fas fa-tag"></i> ${escapeHtml(lyric.sub)}</span></div>
            <div class="preview-text">“${escapeHtml(lyric.preview)}”</div>
            ${tagsHtml ? `<div class="tags-container">${tagsHtml}</div>` : ''}
        </div>
    `;
}

function attachCardEvents() {
    document.querySelectorAll(".lyric-card").forEach(card => {
        const id = parseInt(card.getAttribute("data-id"));
        card.addEventListener("click", (e) => {
            if (e.target.closest('.fav-btn')) return; // prevent opening detail when clicking fav
            selectedLyric = lyricsData.find(l => l.id === id);
            if (selectedLyric) {
                currentView = "detail";
                saveState();
                renderDetailView();
            }
        });
    });
}
function attachTagEvents() {
    document.querySelectorAll(".tag-badge").forEach(tagEl => {
        tagEl.addEventListener("click", (e) => {
            e.stopPropagation();
            const tag = tagEl.getAttribute("data-tag");
            if (tag) {
                currentView = "tagView";
                activeTag = tag;
                saveState();
                renderTagView(tag);
            }
        });
    });
}
function attachFavEvents() {
    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute("data-id"));
            const isNowFav = toggleFavorite(id);
            if (isNowFav) btn.classList.add("active");
            else btn.classList.remove("active");
            showToast(isNowFav ? "پسندیدہ میں شامل کیا" : "پسندیدہ سے ہٹایا");
            // Refresh current view if needed (for favorites section update)
            if (currentView === "categories") renderCategories();
            else if (currentView === "tagView") renderTagView(activeTag);
            else if (currentView === "lyricsList") renderLyricsList(); // refresh list to update fav buttons
            else if (currentView === "detail") renderDetailView(); // refresh detail view to update heart
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
                cards += renderLyricCard(lyric);
            });
            listDiv.innerHTML = cards;
            attachCardEvents();
            attachTagEvents();
            attachFavEvents();
        }
    };
    updateList();
    document.getElementById("backToCategoriesBtn")?.addEventListener("click", () => {
        currentView = "categories";
        activeCategory = null;
        searchTerm = "";
        activeTag = null;
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
    const favClass = isFavorite(selectedLyric.id) ? 'active' : '';
    const tagsHtml = selectedLyric.tags ? selectedLyric.tags.map(t => `<span class="tag-badge" data-tag="${t}">#${escapeHtml(t)}</span>`).join('') : '';
    const html = `
        <div class="top-bar" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div>
                <button class="back-btn" id="backFromDetailBtn"><i class="fas fa-arrow-right"></i> واپس</button>
                <button class="share-btn" id="shareDetailBtn"><i class="fas fa-share-alt"></i> شیئر کریں</button>
            </div>
            <button class="fav-btn detail-fav ${favClass}" data-id="${selectedLyric.id}"><i class="fas fa-heart"></i></button>
        </div>
        <div class="detail-container">
            <div class="detail-title">${escapeHtml(selectedLyric.title)}</div>
            <div class="detail-sub">${escapeHtml(selectedLyric.sub)}</div>
            ${tagsHtml ? `<div class="tags-container" style="justify-content:center; margin-bottom:1rem;">${tagsHtml}</div>` : ''}
            <div class="detail-content">${escapeHtml(selectedLyric.fullLyrics)}</div>
        </div>
    `;
    container.innerHTML = html;
    document.getElementById("backFromDetailBtn")?.addEventListener("click", () => {
        if (activeTag) {
            currentView = "tagView";
            renderTagView(activeTag);
        } else if (activeCategory) {
            currentView = "lyricsList";
            renderLyricsList();
        } else {
            currentView = "categories";
            renderCategories();
        }
        saveState();
    });
    document.getElementById("shareDetailBtn")?.addEventListener("click", () => shareLyric(selectedLyric));
    const favBtn = document.querySelector(".fav-btn.detail-fav");
    if (favBtn) {
        favBtn.addEventListener("click", (e) => {
            const id = parseInt(favBtn.getAttribute("data-id"));
            const isNowFav = toggleFavorite(id);
            if (isNowFav) favBtn.classList.add("active");
            else favBtn.classList.remove("active");
            showToast(isNowFav ? "پسندیدہ میں شامل کیا" : "پسندیدہ سے ہٹایا");
        });
    }
    attachTagEvents(); // for tags in detail view
}

// Start
loadState();
if (currentView === "categories") renderCategories();
else if (currentView === "lyricsList" && activeCategory) renderLyricsList();
else if (currentView === "detail" && selectedLyric) renderDetailView();
else if (currentView === "tagView" && activeTag) renderTagView(activeTag);
else { currentView = "categories"; renderCategories(); }

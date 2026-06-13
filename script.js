// ---------- اردو ڈیٹا ----------
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

// ---------- Rest of the app ----------
let currentView = "categories";
let activeCategory = null;
let searchTerm = "";
let selectedLyric = null;

const dynamicContainer = document.getElementById("dynamicContent");

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
    const lowerTerm = term.toLowerCase();
    return (
        item.title.toLowerCase().includes(lowerTerm) ||
        item.sub.toLowerCase().includes(lowerTerm) ||
        item.preview.toLowerCase().includes(lowerTerm) ||
        item.fullLyrics.toLowerCase().includes(lowerTerm)
    );
}

function highlightText(text, term) {
    if (!term.trim()) return escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark style="background:#ffe6b3; padding:0 2px; border-radius:4px;">$1</mark>');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Share function (unchanged)
async function shareLyric(lyric) {
    const shareText = `${lyric.title}\n${lyric.sub}\n\n${lyric.fullLyrics.substring(0, 500)}${lyric.fullLyrics.length > 500 ? '...' : ''}`;
    const shareData = { title: lyric.title, text: shareText };
    if (navigator.share) {
        try { await navigator.share(shareData); } catch (err) { if (err.name !== 'AbortError') copyToClipboard(shareText); }
    } else { copyToClipboard(shareText); }
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showToast("📋 کاپی ہو گئی!")).catch(() => showToast("❌ کاپی نہیں ہو سکی۔"));
}
function showToast(msg) {
    let toast = document.querySelector('.toast-msg');
    if (toast) toast.remove();
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// ---------- Views rendering (most viewed) ----------
function renderMostViewed() {
    const mostViewed = getMostViewed(5);
    if (mostViewed.length === 0) return '';
    let html = `
        <div class="trending-section">
            <div class="trending-title"><i class="fas fa-fire"></i> سب سے زیادہ دیکھے گئے</div>
            <div class="trending-scroll">
    `;
    mostViewed.forEach(item => {
        html += `
            <div class="trending-card" data-id="${item.id}">
                <div class="title">${escapeHtml(item.title)}</div>
                <div class="views"><i class="fas fa-eye"></i> ${item.count}</div>
            </div>
        `;
    });
    html += `</div></div>`;
    return html;
}

// Categories view (with most viewed on top)
function renderCategories() {
    let mostViewedHtml = renderMostViewed();
    let categoriesHtml = `<div class="categories-grid">`;
    categories.forEach(cat => {
        categoriesHtml += `
            <div class="category-card" data-cat-key="${cat.key}">
                <div class="category-icon"><i class="${cat.icon}"></i></div>
                <div class="category-name">${cat.name}</div>
            </div>
        `;
    });
    categoriesHtml += `</div>`;
    dynamicContainer.innerHTML = mostViewedHtml + categoriesHtml;
    
    // attach category click
    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            activeCategory = card.getAttribute("data-cat-key");
            currentView = "lyricsList";
            searchTerm = "";
            renderLyricsList();
        });
    });
    // attach trending click
    document.querySelectorAll(".trending-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = parseInt(card.getAttribute("data-id"));
            selectedLyric = lyricsData.find(l => l.id === id);
            if (selectedLyric) {
                currentView = "detail";
                renderDetailView();
            }
        });
    });
}

// Lyrics list (same as before)
function renderLyricsList() {
    const catObj = categories.find(c => c.key === activeCategory);
    const catDisplayName = catObj ? catObj.name : activeCategory;
    let html = `
        <div class="top-bar">
            <button class="back-btn" id="backToCategoriesBtn"><i class="fas fa-arrow-right"></i> تمام زمرہ جات</button>
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="${catDisplayName} میں تلاش کریں..." value="${escapeHtml(searchTerm)}">
            </div>
        </div>
        <div id="lyricsListContainer" class="lyrics-list"></div>
    `;
    dynamicContainer.innerHTML = html;
    
    const updateLyricsList = () => {
        const container = document.getElementById("lyricsListContainer");
        if (!container) return;
        let filtered = lyricsData.filter(l => l.category === activeCategory && matchesSearch(l, searchTerm));
        if (filtered.length === 0) {
            container.innerHTML = `<div class="no-results"><i class="fas fa-quran"></i> کوئی کلام نہیں ملا 😔</div>`;
        } else {
            let cardsHtml = "";
            filtered.forEach(lyric => {
                let previewText = searchTerm.trim() ? highlightText(lyric.preview, searchTerm) : escapeHtml(lyric.preview);
                cardsHtml += `
                    <div class="lyric-card" data-id="${lyric.id}">
                        <div class="card-title"><i class="fas fa-quran"></i><span>${escapeHtml(lyric.title)}</span></div>
                        <div class="card-sub"><span><i class="fas fa-tag"></i> ${escapeHtml(lyric.sub)}</span></div>
                        <div class="preview-text">“${previewText}”</div>
                    </div>
                `;
            });
            container.innerHTML = cardsHtml;
            document.querySelectorAll(".lyric-card").forEach(card => {
                card.addEventListener("click", () => {
                    const id = parseInt(card.getAttribute("data-id"));
                    selectedLyric = lyricsData.find(l => l.id === id);
                    if (selectedLyric) {
                        currentView = "detail";
                        renderDetailView();
                    }
                });
            });
        }
    };
    updateLyricsList();
    document.getElementById("backToCategoriesBtn")?.addEventListener("click", () => {
        currentView = "categories";
        activeCategory = null;
        searchTerm = "";
        renderCategories();
    });
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchTerm = e.target.value;
            updateLyricsList();
        });
    }
}

// Detail view with increment view count
function renderDetailView() {
    if (!selectedLyric) {
        currentView = "categories";
        renderCategories();
        return;
    }
    // Increment view count for this lyric
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
    dynamicContainer.innerHTML = html;
    document.getElementById("backFromDetailBtn")?.addEventListener("click", () => {
        currentView = "lyricsList";
        renderLyricsList();
    });
    document.getElementById("shareDetailBtn")?.addEventListener("click", () => {
        shareLyric(selectedLyric);
    });
}

// Start
renderCategories();

// ---------- اردو ڈیٹا (آپ اپنی لیرکس یہاں لکھیں) ----------
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

// State management
let currentView = "categories";
let activeCategory = null;
let searchTerm = "";
let selectedLyric = null;

const mainContainer = document.getElementById("mainContent");

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ---------- SHARE FUNCTION ----------
async function shareLyric(title, text) {
    const shareData = {
        title: title,
        text: text,
    };
    if (navigator.share) {
        try {
            await navigator.share(shareData);
            console.log("Shared successfully");
        } catch (err) {
            console.log("Share cancelled or error:", err);
        }
    } else {
        // Fallback: copy to clipboard
        const fullText = `${title}\n\n${text}`;
        navigator.clipboard.writeText(fullText).then(() => {
            alert("📋 لیرکس کاپی ہو گئی۔ اب جہاں چاہیں پیسٹ کریں");
        }).catch(() => {
            alert("شیئرنگ سپورٹ نہیں ہے، براہِ کرم دستی طور پر کاپی کریں");
        });
    }
}

// Render categories home
function renderCategories() {
    let html = `<div class="categories-grid">`;
    categories.forEach(cat => {
        html += `
            <div class="category-card" data-cat-key="${cat.key}">
                <div class="category-icon"><i class="${cat.icon}"></i></div>
                <div class="category-name">${cat.name}</div>
            </div>
        `;
    });
    html += `</div>`;
    mainContainer.innerHTML = html;
    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            activeCategory = card.getAttribute("data-cat-key");
            currentView = "lyricsList";
            searchTerm = "";
            renderLyricsList();
        });
    });
}

// Render list of lyrics for a category
function renderLyricsList() {
    const catObj = categories.find(c => c.key === activeCategory);
    const catDisplayName = catObj ? catObj.name : activeCategory;
    let filtered = lyricsData.filter(l => l.category === activeCategory);
    if (searchTerm.trim() !== "") {
        filtered = filtered.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    let html = `
        <div class="top-bar">
            <button class="back-btn" id="backToCategoriesBtn"><i class="fas fa-arrow-right"></i> تمام زمرہ جات</button>
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="${catDisplayName} میں تلاش کریں..." value="${escapeHtml(searchTerm)}">
            </div>
        </div>
        <div id="lyricsListContainer" class="lyrics-list">
    `;

    if (filtered.length === 0) {
        html += `<div class="no-results"><i class="fas fa-quran"></i> کوئی کلام نہیں ملا 😔</div>`;
    } else {
        filtered.forEach(lyric => {
            html += `
                <div class="lyric-card" data-id="${lyric.id}">
                    <div class="card-title">
                        <i class="fas fa-quran"></i>
                        <span>${escapeHtml(lyric.title)}</span>
                    </div>
                    <div class="card-sub">
                        <span><i class="fas fa-tag"></i> ${escapeHtml(lyric.sub)}</span>
                    </div>
                    <div class="preview-text">“${escapeHtml(lyric.preview)}”</div>
                </div>
            `;
        });
    }
    html += `</div>`;
    mainContainer.innerHTML = html;

    document.getElementById("backToCategoriesBtn")?.addEventListener("click", () => {
        currentView = "categories";
        activeCategory = null;
        searchTerm = "";
        renderCategories();
    });

    const searchInputEl = document.getElementById("searchInput");
    if (searchInputEl) {
        searchInputEl.addEventListener("input", (e) => {
            searchTerm = e.target.value;
            renderLyricsList();
        });
    }

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

// Render detail view with SHARE BUTTON
// ---------- SHARE FUNCTION - STRONG FALLBACK ----------
async function shareLyric(title, text) {
    const fullText = `${title}\n\n${text}`;
    // Try native share first
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: fullText,
            });
            return;
        } catch (err) {
            console.log("Share error or cancelled:", err);
            // Fall through to clipboard
        }
    }
    // Fallback: copy to clipboard
    try {
        await navigator.clipboard.writeText(fullText);
        alert("✅ لیرکس کاپی ہو گئی! اب آپ اسے کہیں بھی پیسٹ کریں۔");
    } catch (err) {
        // Old method for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = fullText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("📋 لیرکس کاپی ہو گئی (پرانا طریقہ)");
    }
}

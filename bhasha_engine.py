
LANGUAGES = {
    "en":"English","hi":"हिंदी","bn":"বাংলা","ta":"தமிழ்",
    "te":"తెలుగు","mr":"मराठी","gu":"ગુજરાતી","kn":"ಕನ್ನಡ",
    "ml":"മലയാളം","pa":"ਪੰਜਾਬੀ","or":"ଓଡ଼ିଆ","ur":"اردو",
}

T = {
    "app_title":{
        "en":"Vajra AI — Deepfake Detection","hi":"वज्र AI — डीपफेक पहचान प्रणाली",
    },
    "app_tagline":{
        "en":"India's Most Advanced Deepfake Detection Platform",
        "hi":"भारत की सबसे उन्नत डीपफेक पहचान प्रणाली",
    },
    "verdict_deepfake":{
        "en":"⚠️ DEEPFAKE DETECTED","hi":"⚠️ डीपफेक पाया गया",
    },
    "verdict_suspicious":{
        "en":"🟡 SUSPICIOUS CONTENT","hi":"🟡 संदिग्ध सामग्री",
    },
    "verdict_authentic":{
        "en":"✅ AUTHENTIC CONTENT","hi":"✅ वास्तविक सामग्री",
    },
    "upload_title":{
        "en":"Upload File for Analysis","hi":"जांच के लिए फ़ाइल अपलोड करें",
    },
    "analyze_button":{
        "en":"⚡ Analyze Now","hi":"⚡ अभी जांचें",
    },
    "analyzing":{
        "en":"🔬 Analyzing... Please wait","hi":"🔬 जांच हो रही है... रुकें",
    },
    "download_report":{
        "en":"⬇️ Download Forensic Report (PDF)","hi":"⬇️ फोरेंसिक रिपोर्ट डाउनलोड करें",
    },
    "feedback_title":{
        "en":"Help Vajra AI Learn","hi":"वज्र AI को सीखने में मदद करें",
    },
    "feedback_correct":{
        "en":"✅ Result is Correct","hi":"✅ परिणाम सही है",
    },
    "feedback_wrong":{
        "en":"❌ Result is Wrong","hi":"❌ परिणाम गलत है",
    },
    "whatsapp_tip":{
        "en":"💡 Got a suspicious WhatsApp forward? Upload it here to verify instantly.",
        "hi":"💡 WhatsApp पर संदिग्ध फॉरवर्ड आया? यहां अपलोड करें — तुरंत पता चलेगा।",
    },
    "compliance_text":{
        "en":"MeitY IT Rules 2025 · DPDP Act 2023 · IT Act 2000",
        "hi":"MeitY IT नियम 2025 · DPDP अधिनियम 2023 · IT अधिनियम 2000",
    },
    "score_label":{
        "en":"Manipulation Probability Score","hi":"हेरफेर स्कोर",
    },
    "tab_image":{"en":"🖼️ Image","hi":"🖼️ तस्वीर"},
    "tab_video":{"en":"🎥 Video","hi":"🎥 वीडियो"},
    "tab_audio":{"en":"🎙️ Audio","hi":"🎙️ आवाज़"},
    "tab_batch":{"en":"📦 Batch","hi":"📦 बैच"},
    "tab_ecosystem":{"en":"📊 Ecosystem","hi":"📊 सिस्टम"},
    "login_title":{"en":"Secure Access","hi":"सुरक्षित प्रवेश"},
    "login_button":{"en":"Login →","hi":"लॉगिन करें →"},
}

def t(key, lang="en", **kwargs):
    translations = T.get(key, {})
    text = translations.get(lang) or translations.get("en") or key
    if kwargs:
        try: text = text.format(**kwargs)
        except: pass
    return text

def is_rtl(lang): return lang in ["ur"]
def get_lang_options(): return list(LANGUAGES.keys())
def get_lang_labels(): return list(LANGUAGES.values())

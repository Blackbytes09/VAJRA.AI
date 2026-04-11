
INDIA_THREATS = {
    "election_deepfake":{
        "name_en":"Election Campaign Deepfake","name_hi":"चुनाव प्रचार डीपफेक",
        "category":"political","severity":"CRITICAL",
        "description_en":"Fake politician videos used to influence elections",
        "description_hi":"चुनाव प्रभावित करने के लिए नेताओं के नकली वीडियो",
        "ela_range":(35,65),"freq_range":(45,75),
        "law_reference":"IT Act 2000 S.66D | Representation of People Act 1951",
        "helpline":"1950","agency_url":"eci.gov.in","app":"cVIGIL",
    },
    "upi_deepfake_scam":{
        "name_en":"UPI Financial Scam Deepfake","name_hi":"UPI डीपफेक घोटाला",
        "category":"financial","severity":"CRITICAL",
        "description_en":"Fake videos of RBI/bank officials promoting fake UPI schemes",
        "description_hi":"RBI/बैंक अधिकारियों के नकली वीडियो — नकली UPI योजनाएं",
        "ela_range":(30,60),"freq_range":(40,70),
        "law_reference":"IT Act 2000 S.66C | IPC 420 | RBI Act",
        "helpline":"1930","agency_url":"cybercrime.gov.in","app":"None",
    },
}

class IndiaThreatEngine:
    def identify(self, ela_score, freq_score):
        matches = []
        for key, th in INDIA_THREATS.items():
            e0,e1 = th["ela_range"]; f0,f1 = th["freq_range"]
            if e0<=ela_score<=e1 and f0<=freq_score<=f1:
                ec=(e0+e1)/2; fc=(f0+f1)/2
                er=(e1-e0)/2; fr=(f1-f0)/2
                conf=(1-abs(ela_score-ec)/(er+1e-9))*0.5+(1-abs(freq_score-fc)/(fr+1e-9))*0.5
                matches.append({**th,"key":key,"confidence":round(conf*100,1)})
        return sorted(matches,key=lambda x:-x["confidence"])[0] if matches else None

    def get_reporting_text(self, threat, lang="en"):
        if not threat: return ""
        url = threat.get("agency_url","cybercrime.gov.in")
        helpline = threat.get("helpline","1930")
        texts = {
            "en": f"Report at {url} or call helpline {helpline}",
            "hi": f"{url} पर रिपोर्ट करें या {helpline} पर कॉल करें",
        }
        return texts.get(lang, texts["en"])

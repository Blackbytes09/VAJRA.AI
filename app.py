
import streamlit as st
import time
from PIL import Image
from vajra_core import VajraCore
from bhasha_engine import t
import datetime

st.set_page_config(page_title="Vajra AI v5.1 Production", layout="wide")

# Initialize Managers
if "core" not in st.session_state:
    st.session_state.core = VajraCore()

core = st.session_state.core

# Language Setup
if "lang" not in st.session_state: st.session_state.lang = "hi"
lang = st.session_state.lang

# Sidebar
with st.sidebar:
    st.title("🛡️ Vajra AI")
    st.subheader("Production Audit v5.1")
    st.divider()

st.title("🛡️ Vajra AI: Forensic Deepfake Detection")

# Main UI
uploaded = st.file_uploader("Upload Image for Forensic Audit", type=["jpg", "png", "jpeg"])

if uploaded:
    img = Image.open(uploaded)
    st.image(img, caption="Original Asset", use_container_width=True)
    
    if st.button("⚡ Run Forensic Analysis", type="primary"):
        with st.spinner("🔬 Running AI Analysis..."):
            # Using a dummy userId for now
            result = core.analyze_image(img, uploaded.getvalue(), uploaded.name, "user_123")
            
        st.success(f"Analysis Complete in {result['processing_time']}ms")
        
        # Display Result
        color = "#EF4444" if result['verdict'] == "DEEPFAKE" else "#F59E0B" if result['verdict'] == "SUSPICIOUS" else "#10B981"
        st.markdown(f"<h2 style='color:{color}'>{result['verdict']}</h2>", unsafe_allow_html=True)
        st.progress(result['score'] / 100)
        st.write(f"Confidence Score: {result['score']}/100")

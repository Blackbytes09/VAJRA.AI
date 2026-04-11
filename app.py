
import streamlit as st
import time
import plotly.express as px
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
from database_manager import DatabaseManager
from vajra_core import VajraCore
from bhasha_engine import t

# CTO Note: Global Thread Pool for Asynchronous Simulation (Point 2)
executor = ThreadPoolExecutor(max_workers=4)

st.set_page_config(page_title="Vajra AI v5.1 Production", layout="wide")

# Initialize Managers
if "db" not in st.session_state:
    st.session_state.db = DatabaseManager()
    st.session_state.core = VajraCore(st.session_state.db)

db = st.session_state.db
core = st.session_state.core

# Language Setup
if "lang" not in st.session_state: st.session_state.lang = "hi"
lang = st.session_state.lang

# Sidebar
with st.sidebar:
    st.title("🛡️ Vajra AI")
    st.subheader("Production Audit v5.1")
    st.divider()
    stats = db.get_analytics()
    st.metric("Total Scans (Integrity Verified)", stats[0] if stats else 0)
    st.metric("Avg Processing Time", f"{int(stats[2]) if stats and stats[2] else 0}ms")

st.title("🛡️ Vajra AI: Forensic Deepfake Detection")
st.caption("Point 7: All reports are SHA-256 Hashed for Legal Integrity")

# Main UI
uploaded = st.file_uploader("Upload Image for Forensic Audit", type=["jpg", "png", "jpeg"])

if uploaded:
    img = Image.open(uploaded)
    col1, col2 = st.columns(2)
    
    with col1:
        st.image(img, caption="Original Asset", use_container_width=True)
    
    with col2:
        if st.button("⚡ Run Forensic Analysis", type="primary"):
            # Point 2: Asynchronous Simulation using ThreadPool
            with st.spinner("🔬 Running Multi-Layer Analysis..."):
                future = executor.submit(core.analyze_image, img, uploaded.getvalue(), uploaded.name)
                result = future.result() # In a real async app, we'd poll this
                
            if result.get('cached'):
                st.info("⚡ Result retrieved from Cache (Instant Analysis)")
            else:
                st.success(f"Analysis Complete in {result['processing_time']}ms")
            
            # Display Result
            color = "#EF4444" if result['verdict'] == "DEEPFAKE" else "#F59E0B" if result['verdict'] == "SUSPICIOUS" else "#10B981"
            st.markdown(f"<h2 style='color:{color}'>{result['verdict']}</h2>", unsafe_allow_html=True)
            st.progress(result['score'] / 100)
            st.write(f"Confidence Score: {result['score']}/100")
            
            # Point 7: Display Integrity Hash
            st.code(f"Integrity Hash: {result['integrity_hash']}", language="text")
            st.caption("This hash verifies that the forensic result has not been altered.")

            # Forensic Visuals
            if not result.get('cached'):
                st.divider()
                v1, v2 = st.columns(2)
                
                # Interactive ELA
                fig_ela = px.imshow(result['ela_image'], title="ELA Analysis (Interactive)")
                fig_ela.update_layout(margin=dict(l=0, r=0, t=30, b=0))
                v1.plotly_chart(fig_ela, use_container_width=True)
                
                # Interactive Frequency
                fig_freq = px.imshow(result['freq_image'], title="Frequency Spectrum (Interactive)")
                fig_freq.update_layout(margin=dict(l=0, r=0, t=30, b=0))
                v2.plotly_chart(fig_freq, use_container_width=True)
            else:
                st.caption("Forensic images are not stored in cache to maintain 'Server-Lite' efficiency.")

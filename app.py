
import streamlit as st
import time
import sys
import os
import plotly.express as px
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

# CTO Fix: Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database_manager import DatabaseManager
from vajra_core import VajraCore
import datetime

# --- MILITARY GRADE CONFIGURATION ---
st.set_page_config(page_title="Vajra AI v6.0 - Vault Edition", layout="wide", initial_sidebar_state="expanded")

# Inject Custom CSS for Military Aesthetic
st.markdown("""
    <style>
    .stApp {
        background-color: #0b0f19;
    }
    .css-1d391kg {
        background-color: #111827;
    }
    h1, h2, h3 {
        color: #e2e8f0;
        font-family: 'Courier New', Courier, monospace;
    }
    .stMetric label {
        color: #94a3b8;
    }
    .stMetric value {
        color: #38bdf8;
    }
    .stAlert {
        border-radius: 4px;
        border-left: 4px solid;
    }
    </style>
""", unsafe_allow_html=True)

# --- INITIALIZE CORE SYSTEMS ---
try:
    if "db" not in st.session_state:
        st.session_state.db = DatabaseManager()

    if "core" not in st.session_state:
        st.session_state.core = VajraCore(st.session_state.db)

    db = st.session_state.db
    core = st.session_state.core
    SYSTEM_ONLINE = True
except Exception as e:
    st.error(f"CRITICAL SYSTEM FAILURE: {e}")
    st.stop()

# --- SIDEBAR & DASHBOARD ---
with st.sidebar:
    st.title("🛡️ Vajra Core Command")
    st.caption("Military-Grade AI & Forensic Engine v6.0")
    st.divider()
    
    st.subheader("📊 Live Telemetry")
    try:
        stats = db.get_analytics()
        total_scans = stats[0] if stats and stats[0] else 0
        avg_score = stats[1] if stats and stats[1] else 0
        avg_time = stats[2] if stats and stats[2] else 0
        
        col1, col2 = st.columns(2)
        col1.metric("Verified Scans", total_scans)
        col2.metric("Avg Proc Time", f"{int(avg_time)}ms")
        st.metric("Global Threat Index", f"{avg_score:.1f}%")
        
        st.divider()
        st.success("🟢 Core Systems Online")
        st.info("Fallback Local DB Active. Firebase Sync: STANDBY.")
    except Exception as e:
        st.error(f"Telemetry Offline: {e}")

# --- MAIN UI ---
st.title("🛡️ Vajra AI: Autonomous Digital Forensics")
st.markdown("> **Protocol Alpha-7 Active:** Multi-layered analysis combining Spectral (ELA/FFT) anomalies with LLM Neural Processing.")

uploaded = st.file_uploader("Upload Target Asset (Image Data)", type=["jpg", "png", "jpeg"])

if uploaded:
    try:
        img = Image.open(uploaded)
        img_bytes = uploaded.getvalue()
        filename = uploaded.name
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.image(img, caption=f"Original Asset: {filename}", use_container_width=True)
            
        with col2:
            st.info("Awaiting Execution Command...")
            if st.button("⚡ Execute Deep Inspection", type="primary", use_container_width=True):
                st.toast("Initialization sequence started...")
                
                with st.spinner("🔬 Running Core AI & Spectral Analysis..."):
                    try:
                        result = core.analyze_asset(img, img_bytes, filename, "local_admin_001")
                        
                        if result.get("cached"):
                            st.success(f"⚡ Instant Verification! Found cryptographic match in Vault Hash-Table.")
                        else:
                            st.success(f"✅ Deep Inspection Complete in {result.get('processing_time', 0)}ms")
                        
                        # --- VERDICT DISPLAY ---
                        verdict = result.get('verdict', 'UNKNOWN')
                        score = result.get('score', 0)
                        
                        color = "#EF4444" if verdict == "DEEPFAKE" else "#F59E0B" if verdict == "SUSPICIOUS" else "#10B981"
                        st.markdown(f"### Target Classification: <span style='color:{color}; font-weight:bold;'>{verdict}</span>", unsafe_allow_html=True)
                        
                        st.progress(min(max(int(score), 0), 100) / 100)
                        st.write(f"**Manipulation Probability Score:** {score:.1f}/100")
                        
                        st.code(f"SHA-256 Signature (Integrity Lock): {result.get('integrity_hash', 'N/A')}", language="text")
                        
                        # --- SPECTRAL VISUALIZATION ---
                        if not result.get("cached") and 'ela_image' in result and 'freq_image' in result:
                            st.divider()
                            st.subheader("Spectral & Forensic Layers")
                            v1, v2 = st.columns(2)
                            
                            fig_ela = px.imshow(result['ela_image'], title="Error Level Analysis (ELA)")
                            fig_ela.update_layout(margin=dict(l=0, r=0, t=30, b=0), paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
                            v1.plotly_chart(fig_ela, use_container_width=True)
                            
                            fig_freq = px.imshow(result['freq_image'], title="Fast Fourier Transform (FFT)")
                            fig_freq.update_layout(margin=dict(l=0, r=0, t=30, b=0), paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
                            v2.plotly_chart(fig_freq, use_container_width=True)
                        elif result.get("cached"):
                            st.info("Spectral matrices cleared from cache to preserve memory footprint.")
                            
                    except Exception as e:
                        st.error(f"Analysis Engine Error: {str(e)}")
    except Exception as e:
        st.error(f"Asset loading failed. Target format may be corrupted. Error: {e}")

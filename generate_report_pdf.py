import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas that adds page footer and header lines."""
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_decorations(self, page_count):
        self.saveState()
        w, h = A4
        # Top banner accent bar
        self.setFillColor(colors.HexColor("#0D9488")) # Saathi Teal
        self.rect(0, h - 8, w, 8, fill=1, stroke=0)
        
        # Bottom Footer
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#0F172A"))
        self.drawString(34, 18, "PROJECT SAATHI")
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(108, 18, "|  Attestation Document for Competition Cost Reimbursement  |  Build 2026")
        
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(w - 34, 18, page_str)
        
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(34, 28, w - 34, 28)
        self.restoreState()

def build_pdf(output_path):
    # A4: 595.27 x 841.89 points
    # Margins: 32 pt left/right (~0.44 in), 28 pt top, 36 pt bottom
    margin_x = 32
    margin_top = 22
    margin_bottom = 36
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=margin_x,
        rightMargin=margin_x,
        topMargin=margin_top,
        bottomMargin=margin_bottom
    )

    printable_w = A4[0] - (2 * margin_x) # 531.27 pt

    styles = getSampleStyleSheet()

    # Custom Styles
    style_title = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=17,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=1
    )

    style_subtitle = ParagraphStyle(
        'DocSubTitle',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0D9488"),
        spaceAfter=5
    )

    style_meta_bar = ParagraphStyle(
        'MetaBar',
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#334155"),
    )

    style_section_h = ParagraphStyle(
        'SectionH',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=4,
        spaceAfter=2
    )

    style_body = ParagraphStyle(
        'BodyDark',
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor("#1E293B"),
        alignment=4 # Justified
    )

    style_body_bold = ParagraphStyle(
        'BodyDarkBold',
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor("#0F172A")
    )

    style_bullet = ParagraphStyle(
        'BulletText',
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor("#1E293B"),
        leftIndent=8
    )

    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=6.8,
        leading=8.5,
        textColor=colors.HexColor("#1E293B")
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=8.5,
        textColor=colors.HexColor("#FFFFFF")
    )

    story = []

    # 1. Header Block
    story.append(Paragraph("PROJECT SAATHI: TECHNICAL EVALUATION REPORT", style_title))
    story.append(Paragraph("Offline-First AI Clinical Screening & Autonomous Referral Infrastructure for Rural Healthcare", style_subtitle))
    
    meta_html = (
        "<b>Document Purpose:</b> Official Project Attestation for Competition Cost Reimbursement &nbsp;|&nbsp; "
        "<b>Track:</b> Assistive Healthcare AI & Distributed Cloud &nbsp;|&nbsp; "
        "<b>Event:</b> Build 2026"
    )
    story.append(Paragraph(meta_html, style_meta_bar))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#0D9488"), spaceAfter=5))

    # 2. Executive Overview & Problem Statement
    story.append(Paragraph("1. EXECUTIVE OVERVIEW & RURAL HEALTHCARE BOTTLENECK", style_section_h))
    story.append(Paragraph(
        "In rural India, over 10 lakh Accredited Social Health Activist (ASHA) workers are the foundational point of primary healthcare. "
        "However, frontline operations suffer from three systemic barriers: <b>unreliable 2G or zero network connectivity</b>, <b>regional language illiteracy</b>, "
        "and an absence of localized specialist diagnostic support. Consequently, early symptoms of malignant skin lesions, diabetic retinopathy, "
        "respiratory infections, and hematological abnormalities are missed, leading to critical late-stage presentations at secondary hospitals.<br/>"
        "<b>Project Saathi</b> resolves this paradigm by transforming commodity frontline smartphones into intelligent, edge-computed clinical assistive "
        "screening hubs. Operating 100% offline at the doorstep, it establishes an unbroken continuum from community screening to Community Health Centre (CHC) "
        "clinician validation, while synchronizing aggregated epidemiological insights to the District Medical Officer (DMO) command dashboard.",
        style_body
    ))
    story.append(Spacer(1, 4))

    # 3. System Architecture & Core Technical Innovations
    story.append(Paragraph("2. SYSTEM ARCHITECTURE & TECHNICAL INNOVATIONS", style_section_h))
    
    story.append(Paragraph(
        "• <b>Edge-AI Multi-Pathway Triage (100% Offline Resilience):</b> Employs quantized on-device computer vision models running across 4 clinical pathways: "
        "dermatological skin lesions, optical fundus diabetic retinopathy, digital chest radiographs, and laboratory CBC hematology parameters. "
        "Real-time visual quality gates validate blur and luminance before scoring, instantly triaging risk into non-diagnostic traffic-light states (Green, Amber, Red). "
        "All patient journeys, consent states, and image metadata persist on an ACID-compliant edge SQLite store with zero internet dependence.",
        style_bullet
    ))
    story.append(Spacer(1, 2))
    
    story.append(Paragraph(
        "• <b>22 Constitutional Indian Languages Voice Engine:</b> Implements full audio guidance and conversational voice synthesis across all 22 official scheduled "
        "Indian languages. ASHA workers receive audible spoken task briefings on pending patient visits and audible guidance during camera capture, eliminating literacy friction.",
        style_bullet
    ))
    story.append(Spacer(1, 2))

    story.append(Paragraph(
        "• <b>Cloud Autonomous Agent for Hospital OPD Token Booking:</b> Integrates autonomous web AI browser agents via cloud-orchestrated infrastructure. "
        "When an at-risk (Red/Amber) flag is identified, the agent autonomously navigates public hospital e-Hospital portals to pre-book referral OPD appointments, "
        "generating digital queue tokens that save rural patients hours of physical transit and triage delay.",
        style_bullet
    ))
    story.append(Spacer(1, 2))

    story.append(Paragraph(
        "• <b>Render Workflows Distributed DAG Pipeline (@renderinc/sdk/workflows):</b> Employs Render's distributed orchestration engine to execute durable "
        "multi-step data pipelines upon field synchronization: (1) Ingestion and cryptographic hash validation of offline sync batches, (2) Strict enforcement of "
        "India's <b>Digital Personal Data Protection (DPDP) Act 2023</b> via automated Small-Cell Suppression (&lt; 5 cases masked to prevent patient re-identification), "
        "(3) Dispatch of autonomous CHC referral tokens, and (4) Append-only cryptographic ledger generation for medical-legal accountability.",
        style_bullet
    ))
    story.append(Spacer(1, 5))

    # 4. Expenditure Justification Table
    story.append(Paragraph("3. TECHNICAL JUSTIFICATION OF PROJECT REIMBURSEMENT EXPENSES", style_section_h))
    story.append(Paragraph(
        "The claimed financial expenditure directly reflects infrastructural compute, live cloud orchestration, specialized multi-lingual AI models, "
        "and physical testing accessories required to build and benchmark a genuine, operational full-stack prototype:",
        style_body
    ))
    story.append(Spacer(1, 3))

    table_data = [
        [
            Paragraph("Category & Resource", style_table_header),
            Paragraph("Technical Component & Service", style_table_header),
            Paragraph("Engineering Purpose & Necessity in Project Saathi", style_table_header),
        ],
        [
            Paragraph("<b>Distributed Cloud Compute</b>", style_table_cell),
            Paragraph("Render Workflows & Cloud Web Services", style_table_cell),
            Paragraph("Durable multi-task DAG orchestration for DPDP privacy masking, background sync resolution, and Express REST API.", style_table_cell),
        ],
        [
            Paragraph("<b>Voice AI Synthesis</b>", style_table_cell),
            Paragraph("ElevenLabs Multilingual V2 Speech API", style_table_cell),
            Paragraph("High-fidelity natural clinical speech generation across 22 Indic regional languages with on-device phonetic fallback.", style_table_cell),
        ],
        [
            Paragraph("<b>Autonomous Web Agent</b>", style_table_cell),
            Paragraph("Cloud Browser-Use Execution Engine", style_table_cell),
            Paragraph("Headless virtual browser infrastructure executing automated OPD token pre-booking on public hospital portals.", style_table_cell),
        ],
        [
            Paragraph("<b>Vision & Multimodal AI</b>", style_table_cell),
            Paragraph("Google Gemini Multimodal API", style_table_cell),
            Paragraph("High-resolution lesion texture validation, optical quality scoring, and clinical safety counter-checking.", style_table_cell),
        ],
        [
            Paragraph("<b>Edge Testing Hardware</b>", style_table_cell),
            Paragraph("Camera Rigs, Optical Couplers & Devices", style_table_cell),
            Paragraph("Smartphone test rigs, physical lens attachments for fundus simulation, and offline network throttling apparatus.", style_table_cell),
        ],
    ]

    # Printable width: 531 pt
    col_widths = [115, 130, 286]
    t = Table(table_data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t)
    story.append(Spacer(1, 5))

    # 5. Live Production Deliverables & Verification
    story.append(Paragraph("4. LIVE PRODUCTION DELIVERABLES & VERIFICATION URLS", style_section_h))
    
    links_data = [
        [
            Paragraph("<b>ASHA & Doctor Mobile App:</b>", style_table_cell),
            Paragraph("<u>https://project-saathi-rho.vercel.app/app</u>", style_table_cell),
            Paragraph("<b>District Admin Portal:</b>", style_table_cell),
            Paragraph("<u>https://project-saathi-rho.vercel.app</u>", style_table_cell),
        ],
        [
            Paragraph("<b>Render Workflows Live API:</b>", style_table_cell),
            Paragraph("<u>https://project-saathi-api.onrender.com/health</u>", style_table_cell),
            Paragraph("<b>Open Source Codebase:</b>", style_table_cell),
            Paragraph("<u>https://github.com/VanshikaB16/project_saathi</u>", style_table_cell),
        ],
    ]
    t_links = Table(links_data, colWidths=[120, 145, 115, 151])
    t_links.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0FDFA")), # Pale Mint
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor("#0D9488")),
    ]))
    story.append(t_links)
    story.append(Spacer(1, 4))

    # 6. Attestation Statement
    story.append(Paragraph("5. ATTESTATION & COMPLIANCE STATEMENT", style_section_h))
    story.append(Paragraph(
        "This project was conceptualized, architected, and built from scratch adhering strictly to the highest medical-legal standards: "
        "screening flags are strictly non-diagnostic assistive triage; synthetic demo records are strictly partitioned from real data; "
        "and patient anonymity is safeguarded via non-biometric municipal tokens and automated Small-Cell Suppression. "
        "All claimed expenses correspond directly to functioning technical infrastructure verified through the live endpoints above.",
        style_body
    ))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)

if __name__ == '__main__':
    target_path = sys.argv[1] if len(sys.argv) > 1 else 'Project_Saathi_Technical_Report.pdf'
    build_pdf(target_path)
    print(f"Generated PDF at: {target_path}")

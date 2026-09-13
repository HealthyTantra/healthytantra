import os

OUT_DIR = "/home/claude/specialty-pages"
os.makedirs(OUT_DIR, exist_ok=True)

SPECIALTIES = [
    {
        "slug": "ayurveda",
        "name": "Ayurveda",
        "title": "Online Ayurveda Doctor Consultation | Healthy Tantra",
        "meta_desc": "Consult verified Ayurveda practitioners online on Healthy Tantra via chat, audio, or video. Pay only for the minutes you use, PAN-India.",
        "intro": "Ayurveda looks at your body as a whole system, not a single symptom. Our verified Ayurveda practitioners help with digestion, skin, hormonal balance, chronic conditions, and long-term lifestyle guidance &mdash; all from your phone.",
        "benefits": [
            "Verified Ayurveda practitioners with checked credentials",
            "Chat, audio, or video consultations &mdash; your choice",
            "Pay per minute, no hidden consultation fees",
            "Order Ayurvedic medicines and herbal products after your consult",
        ],
    },
    {
        "slug": "homeopathy",
        "name": "Homeopathy",
        "title": "Online Homeopathy Doctor Consultation | Healthy Tantra",
        "meta_desc": "Consult verified Homeopathy doctors online on Healthy Tantra for allergies, chronic conditions, and general wellness. Chat, audio, or video.",
        "intro": "Homeopathy is a common first choice for allergies, recurring colds, skin conditions, and chronic complaints where people want a gentler, individualized approach. Our verified Homeopathy doctors are available across India.",
        "benefits": [
            "Verified Homeopathy doctors, credential-checked",
            "Consult by chat, audio call, or video call",
            "Transparent per-minute pricing",
            "Order homeopathic medicines directly after consultation",
        ],
    },
    {
        "slug": "unani",
        "name": "Unani",
        "title": "Online Unani Doctor Consultation | Healthy Tantra",
        "meta_desc": "Consult verified Unani practitioners online on Healthy Tantra. Traditional Unani medicine guidance via chat, audio, or video, PAN-India.",
        "intro": "Unani medicine draws on centuries of practice for digestive health, joint pain, respiratory issues, and general wellbeing. Our verified Unani practitioners bring that tradition to an online consultation.",
        "benefits": [
            "Verified Unani practitioners with checked credentials",
            "Chat, audio, or video consultation options",
            "Pay only for the minutes you actually use",
            "PAN-India availability, no travel required",
        ],
    },
    {
        "slug": "allopathy",
        "name": "Allopathy",
        "title": "Online Doctor Consultation (Allopathy) | Healthy Tantra",
        "meta_desc": "Consult verified allopathic doctors online on Healthy Tantra for everyday health concerns, prescriptions, and follow-ups. Chat, audio, or video.",
        "intro": "For everyday illnesses, prescriptions, and quick medical opinions, our verified allopathic doctors are available on demand &mdash; no waiting rooms, no appointments needed for a first consult.",
        "benefits": [
            "Verified MBBS and specialist doctors",
            "Chat, audio, or video consultation",
            "Fast access without needing to book in advance",
            "Order prescribed medicines directly through the app",
        ],
    },
    {
        "slug": "diet-nutrition",
        "name": "Diet & Nutrition",
        "title": "Online Diet & Nutrition Consultation | Healthy Tantra",
        "meta_desc": "Talk to verified nutritionists online on Healthy Tantra for personalized diet plans, weight goals, and lifestyle nutrition guidance.",
        "intro": "Whether it's weight management, a medical condition that needs diet support, or just eating better, our verified nutritionists build guidance around your actual routine, not a generic plan.",
        "benefits": [
            "Verified nutritionists and dietitians",
            "Personalized guidance, not generic diet charts",
            "Chat, audio, or video consultations",
            "Ongoing follow-ups to track progress",
        ],
    },
    {
        "slug": "mental-health",
        "name": "Mental Health",
        "title": "Online Mental Health Consultation | Healthy Tantra",
        "meta_desc": "Speak with verified mental health professionals online on Healthy Tantra, privately and at your own pace, via chat, audio, or video.",
        "intro": "Talking to someone shouldn't be complicated. Our verified mental health professionals are available for private, judgment-free conversations whenever you're ready.",
        "benefits": [
            "Verified mental health professionals",
            "Private consultations by chat, audio, or video",
            "No waiting rooms &mdash; consult from wherever you are",
            "Pay only for the minutes you use",
        ],
    },
]

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{title}</title>
<meta name="description" content="{meta_desc}">
<link rel="canonical" href="https://healthytantra.com/consult/{slug}">

<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{meta_desc}">
<meta property="og:url" content="https://healthytantra.com/consult/{slug}">
<meta property="og:site_name" content="Healthy Tantra">

<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "{title}",
  "url": "https://healthytantra.com/consult/{slug}",
  "about": {{
    "@type": "MedicalSpecialty",
    "name": "{name}"
  }},
  "publisher": {{
    "@type": "Organization",
    "name": "Healthy Tantra",
    "url": "https://healthytantra.com"
  }}
}}
</script>

<style>
  :root {{
    --ht-primary: #0f7a5c;
    --ht-text: #1a1a1a;
    --ht-muted: #5f6b66;
    --ht-bg: #ffffff;
    --ht-border: #e5e5e5;
    --ht-radius: 10px;
  }}
  body {{ font-family: system-ui, -apple-system, sans-serif; color: var(--ht-text); background: var(--ht-bg); margin: 0; }}
  .wrap {{ max-width: 760px; margin: 0 auto; padding: 40px 20px 64px; }}
  h1 {{ font-size: 1.7rem; margin: 0 0 14px; }}
  .intro {{ color: var(--ht-muted); line-height: 1.6; font-size: 1.02rem; }}
  .section {{ padding: 24px 0; border-top: 1px solid var(--ht-border); margin-top: 20px; }}
  .section h2 {{ font-size: 1.1rem; margin: 0 0 12px; }}
  ul.benefits {{ list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }}
  ul.benefits li {{ border: 1px solid var(--ht-border); border-radius: var(--ht-radius); padding: 12px 16px; font-size: 0.95rem; }}
  .cta-row {{ display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }}
  .cta-primary, .cta-secondary {{ padding: 12px 22px; border-radius: var(--ht-radius); text-decoration: none; font-weight: 600; display: inline-block; }}
  .cta-primary {{ background: var(--ht-primary); color: #fff; }}
  .cta-secondary {{ border: 1px solid var(--ht-border); color: var(--ht-text); }}
</style>
</head>
<body>

<!-- SITE HEADER: paste your existing site header/nav here -->

<main class="wrap">
  <h1>Online {name} Doctor Consultation</h1>
  <p class="intro">{intro}</p>

  <div class="section">
    <h2>Why consult {name} on Healthy Tantra</h2>
    <ul class="benefits">
{benefits_html}
    </ul>
  </div>

  <div class="cta-row">
    <a class="cta-primary" href="healthytantra://consult/{slug}">Consult a {name} Doctor Now</a>
    <a class="cta-secondary" href="https://play.google.com/store/apps/details?id=com.healthytantra.app">Get the App</a>
  </div>
</main>

<!-- SITE FOOTER: paste your existing site footer here -->

</body>
</html>
"""

for s in SPECIALTIES:
    benefits_html = "\n".join(f"      <li>{b}</li>" for b in s["benefits"])
    html = TEMPLATE.format(
        title=s["title"],
        meta_desc=s["meta_desc"],
        slug=s["slug"],
        name=s["name"],
        intro=s["intro"],
        benefits_html=benefits_html,
    )
    path = os.path.join(OUT_DIR, f"{s['slug']}.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", path)

import os

# These pages live one folder below the site root (e.g. /consult/ayurveda.html,
# /doctor/dr-harshal-sawarkar.html), so shared assets need a "../" prefix.
REL = ".."
PLAY_URL = "https://play.google.com/store/apps/details?id=com.healthytantra.app"
APPLE_URL = "https://apps.apple.com/in/app/healthy-tantra/id6799877739"

HEADER = f"""<header class="header">
  <div class="container">

    <div class="brand-block">
      <h2 class="logo">Healthy Tantra</h2>
      <span class="brand-tagline">Many Ways to Heal</span>
    </div>

    <nav>
      <a href="{REL}/index.html" aria-label="Healthy Tantra Home Page">Home</a>
      <a href="{REL}/blog.html" aria-label="Healthy Tantra Blog Page">Blogs</a>
      <a href="{REL}/faq.html" aria-label="Healthy Tantra FAQ Page">FAQ</a>
      <a href="{REL}/about.html" aria-label="About Healthy Tantra">About</a>
      <a href="{REL}/contact.html" aria-label="Contact Healthy Tantra">Contact</a>
    </nav>

    <a href="{PLAY_URL}"
       class="header-download-btn app-smart-link"
       data-android-href="{PLAY_URL}"
       data-ios-href="{APPLE_URL}"
       target="_blank" rel="noopener noreferrer">
      Download App
    </a>

    <button class="mobile-menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">
      &#9776;
    </button>

  </div>
</header>"""

STICKY_BAR = f"""<div class="mobile-sticky-bar">
  <div class="bar-text">
    <strong>Healthy Tantra App</strong>
    <span>Consult Doctors & Order Medicines</span>
  </div>
  <a href="{PLAY_URL}"
     class="bar-btn app-smart-link"
     data-android-href="{PLAY_URL}"
     data-ios-href="{APPLE_URL}"
     target="_blank" rel="noopener noreferrer">
    Install App
  </a>
</div>"""

FOOTER = f"""<footer class="footer">
  <div class="footer-inner">
    <strong>Healthy Tantra</strong>
    <p class="footer-email">Email: care@healthytantra.com</p>
    <div class="footer-links">
      <a href="{REL}/privacy-policy.html">Privacy Policy</a>
      <a href="{REL}/terms.html">Terms & Conditions</a>
      <a href="{REL}/faq.html">FAQs</a>
    </div>
    <div class="footer-divider"></div>
    <p class="disclaimer">
      Healthy Tantra connects you with verified doctors and healthcare professionals for online consultation, appointment booking, and medicine ordering. It is not intended for emergency medical situations - please seek immediate medical attention when required.
    </p>
    <p class="footer-copy">© 2026 Healthy Tantra. All rights reserved.</p>
  </div>
</footer>"""

SCRIPTS = f"""<script src="{REL}/js/app.js"></script>

<!-- Routes install/consult links to the correct store based on device -->
<script>
  (function () {{
    function isIOS() {{
      return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }}
    function isAndroid() {{
      return /Android/.test(navigator.userAgent);
    }}
    document.addEventListener('DOMContentLoaded', function () {{
      document.querySelectorAll('.app-smart-link').forEach(function (link) {{
        var iosHref = link.getAttribute('data-ios-href');
        var androidHref = link.getAttribute('data-android-href');
        if (isIOS() && iosHref) {{
          link.setAttribute('href', iosHref);
        }} else if (isAndroid() && androidHref) {{
          link.setAttribute('href', androidHref);
        }}
      }});
    }});
  }})();
</script>

<script>
  document.addEventListener('DOMContentLoaded', function () {{
    const header = document.querySelector('.header');
    const menuButton = document.querySelector('.mobile-menu-toggle');
    if (!header || !menuButton) return;
    menuButton.addEventListener('click', function () {{
      const isOpen = header.classList.toggle('mobile-open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuButton.textContent = isOpen ? '\u2715' : '\u2630';
    }});
    header.querySelectorAll('nav a').forEach(function (link) {{
      link.addEventListener('click', function () {{
        header.classList.remove('mobile-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '\u2630';
      }});
    }});
  }});
</script>"""

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{title}</title>
<meta name="description" content="{meta_desc}">
<link rel="canonical" href="{canonical}">
<link rel="stylesheet" href="{rel}/css/style.css">
<link rel="icon" type="image/png" href="{rel}/assets/favicon.png">

<meta property="og:type" content="{og_type}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{meta_desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:site_name" content="Healthy Tantra">

<meta name="google-play-app" content="app-id=com.healthytantra.app">
<meta name="apple-itunes-app" content="app-id=6799877739">

{schema}
</head>
<body>

{header}

<section class="cta-strip">
  <div class="container">
    <h1>{h1}</h1>
    <p>{intro}</p>
    <div class="cta">
      <a href="{play_url}" class="btn btn-primary app-smart-link"
         data-android-href="{play_url}" data-ios-href="{apple_url}"
         target="_blank" rel="noopener noreferrer">{cta_label}</a>
    </div>
  </div>
</section>

<section class="features container">
  <h2>{benefits_heading}</h2>
  <div class="grid">
{benefit_cards}
  </div>
</section>

<section id="download-app" class="app-banner">
  <div class="app-banner-overlay">
    <div class="container">
      <h2>Get the Healthy Tantra App</h2>
      <p>Live consultations, secure payments, and appointment reminders all work best in the Healthy Tantra app. Available on both iOS and Android.</p>
      <div class="store-buttons">
        <a href="{apple_url}" class="store-btn apple-btn" target="_blank" rel="noopener noreferrer">
          <span class="store-icon"></span>
          <div><small>Available on</small><strong>App Store</strong></div>
        </a>
        <a href="{play_url}" class="store-btn play-btn" target="_blank" rel="noopener noreferrer">
          <span class="store-icon">&#9654;</span>
          <div><small>Available on</small><strong>Google Play</strong></div>
        </a>
      </div>
    </div>
  </div>
</section>

{sticky_bar}

{footer}

{scripts}

</body>
</html>
"""

SPECIALTIES = [
    {"slug": "ayurveda", "name": "Ayurveda",
     "meta_desc": "Consult verified Ayurveda practitioners online on Healthy Tantra via chat, audio, or video. Pay only for the minutes you use, PAN-India.",
     "intro": "Ayurveda looks at your body as a whole system, not a single symptom. Our verified Ayurveda practitioners help with digestion, skin, hormonal balance, chronic conditions, and long-term lifestyle guidance &mdash; all from your phone.",
     "benefits": ["Verified Ayurveda practitioners with checked credentials", "Chat, audio, or video consultations &mdash; your choice", "Pay per minute, no hidden consultation fees", "Order Ayurvedic medicines and herbal products after your consult"]},
    {"slug": "homeopathy", "name": "Homeopathy",
     "meta_desc": "Consult verified Homeopathy doctors online on Healthy Tantra for allergies, chronic conditions, and general wellness. Chat, audio, or video.",
     "intro": "Homeopathy is a common first choice for allergies, recurring colds, skin conditions, and chronic complaints where people want a gentler, individualized approach. Our verified Homeopathy doctors are available across India.",
     "benefits": ["Verified Homeopathy doctors, credential-checked", "Consult by chat, audio call, or video call", "Transparent per-minute pricing", "Order homeopathic medicines directly after consultation"]},
    {"slug": "unani", "name": "Unani",
     "meta_desc": "Consult verified Unani practitioners online on Healthy Tantra. Traditional Unani medicine guidance via chat, audio, or video, PAN-India.",
     "intro": "Unani medicine draws on centuries of practice for digestive health, joint pain, respiratory issues, and general wellbeing. Our verified Unani practitioners bring that tradition to an online consultation.",
     "benefits": ["Verified Unani practitioners with checked credentials", "Chat, audio, or video consultation options", "Pay only for the minutes you actually use", "PAN-India availability, no travel required"]},
    {"slug": "allopathy", "name": "Allopathy",
     "meta_desc": "Consult verified allopathic doctors online on Healthy Tantra for everyday health concerns, prescriptions, and follow-ups. Chat, audio, or video.",
     "intro": "For everyday illnesses, prescriptions, and quick medical opinions, our verified allopathic doctors are available on demand &mdash; no waiting rooms, no appointments needed for a first consult.",
     "benefits": ["Verified MBBS and specialist doctors", "Chat, audio, or video consultation", "Fast access without needing to book in advance", "Order prescribed medicines directly through the app"]},
    {"slug": "diet-nutrition", "name": "Diet & Nutrition",
     "meta_desc": "Talk to verified nutritionists online on Healthy Tantra for personalized diet plans, weight goals, and lifestyle nutrition guidance.",
     "intro": "Whether it's weight management, a medical condition that needs diet support, or just eating better, our verified nutritionists build guidance around your actual routine, not a generic plan.",
     "benefits": ["Verified nutritionists and dietitians", "Personalized guidance, not generic diet charts", "Chat, audio, or video consultations", "Ongoing follow-ups to track progress"]},
    {"slug": "mental-health", "name": "Mental Health",
     "meta_desc": "Speak with verified mental health professionals online on Healthy Tantra, privately and at your own pace, via chat, audio, or video.",
     "intro": "Talking to someone shouldn't be complicated. Our verified mental health professionals are available for private, judgment-free conversations whenever you're ready.",
     "benefits": ["Verified mental health professionals", "Private consultations by chat, audio, or video", "No waiting rooms &mdash; consult from wherever you are", "Pay only for the minutes you use"]},
]

os.makedirs("/home/claude/site/consult", exist_ok=True)

for s in SPECIALTIES:
    slug = s["slug"]
    name = s["name"]
    canonical = f"https://www.healthytantra.com/consult/{slug}.html"
    schema = f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "name": "Online {name} Doctor Consultation",
  "url": "{canonical}",
  "about": {{"@type": "MedicalSpecialty", "name": "{name}"}},
  "publisher": {{"@type": "Organization", "name": "Healthy Tantra", "url": "https://www.healthytantra.com"}}
}}
</script>"""
    benefit_cards = "\n".join(
        f'    <div class="card"><p>{b}</p></div>' for b in s["benefits"]
    )
    article = "an" if name[0].lower() in "aeiou" else "a"
    html = PAGE_TEMPLATE.format(
        title=f"Online {name} Doctor Consultation | Healthy Tantra",
        meta_desc=s["meta_desc"],
        canonical=canonical,
        rel=REL,
        og_type="website",
        schema=schema,
        header=HEADER,
        h1=f"Online {name} Doctor Consultation",
        intro=s["intro"],
        cta_label=f"Consult {article} {name} Doctor Now",
        benefits_heading=f"Why consult {name} on Healthy Tantra",
        benefit_cards=benefit_cards,
        play_url=PLAY_URL,
        apple_url=APPLE_URL,
        sticky_bar=STICKY_BAR,
        footer=FOOTER,
        scripts=SCRIPTS,
    )
    with open(f"/home/claude/site/consult/{slug}.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", slug)

# ---------------------------------------------------------------------------
# Doctor profile pilot page, rebuilt with the same real header/footer/CSS
# ---------------------------------------------------------------------------

os.makedirs("/home/claude/site/doctor", exist_ok=True)

DOCTOR_SLUG = "dr-harshal-sawarkar"
DOCTOR_NAME = "Dr. Harshal Sawarkar"
DOCTOR_SPECIALTY = "Ayurveda"
DOCTOR_RATE = "16.67"
doctor_canonical = f"https://www.healthytantra.com/doctor/{DOCTOR_SLUG}.html"

doctor_schema = f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "{DOCTOR_NAME}",
  "medicalSpecialty": "{DOCTOR_SPECIALTY}",
  "url": "{doctor_canonical}",
  "isAcceptingNewPatients": true,
  "availableService": {{"@type": "MedicalTherapy", "name": "Online {DOCTOR_SPECIALTY} Consultation"}},
  "hostingOrganization": {{"@type": "Organization", "name": "Healthy Tantra", "url": "https://www.healthytantra.com"}}
}}
</script>"""

doctor_benefit_cards = "\n".join(f'    <div class="card"><p>{b}</p></div>' for b in [
    "Verified on Healthy Tantra",
    "Chat, audio, and video consultation available",
    f"&#8377;{DOCTOR_RATE} / min &mdash; pay only for the time you use",
    "[ FILL FROM ADMIN PANEL: qualifications, years of experience, languages, bio ]",
])

doctor_html = PAGE_TEMPLATE.format(
    title=f"{DOCTOR_NAME} - Online {DOCTOR_SPECIALTY} Doctor | Healthy Tantra",
    meta_desc=f"Consult {DOCTOR_NAME}, a verified {DOCTOR_SPECIALTY} practitioner on Healthy Tantra, via chat, audio, or video.",
    canonical=doctor_canonical,
    rel=REL,
    og_type="profile",
    schema=doctor_schema,
    header=HEADER,
    h1=DOCTOR_NAME,
    intro=f"Verified {DOCTOR_SPECIALTY} practitioner on Healthy Tantra, available for chat, audio, and video consultations.",
    cta_label=f"Consult {DOCTOR_NAME.split()[1]} Now",
    benefits_heading="Consultation details",
    benefit_cards=doctor_benefit_cards,
    play_url=PLAY_URL,
    apple_url=APPLE_URL,
    sticky_bar=STICKY_BAR,
    footer=FOOTER,
    scripts=SCRIPTS,
)

with open(f"/home/claude/site/doctor/{DOCTOR_SLUG}.html", "w", encoding="utf-8") as f:
    f.write(doctor_html)
print("wrote doctor profile:", DOCTOR_SLUG)

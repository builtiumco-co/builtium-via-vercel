document.addEventListener('DOMContentLoaded', () => {
    // Prevent running on pages that do not have BGA elements
    if (!document.getElementById('bga-intro')) return;

    // --- QUESTION BANK DATA ---
    const quizData = [
        // Section 1: PROFILE (7 Questions) - Custom Form UI
        {
            section: "PROFILE",
            sectionNum: 1,
            question: "Let's start with your business profile.",
            type: "profile",
            fieldName: "businessName",
            label: "Business Name",
            inputType: "text",
            required: true,
            placeholder: "Enter your business name"
        },
        {
            section: "PROFILE",
            sectionNum: 1,
            question: "What industry does your business operate in?",
            type: "profile",
            fieldName: "industry",
            label: "Industry",
            inputType: "select",
            required: true,
            options: [
                "Technology", "Healthcare", "Education", "Real Estate", 
                "Food & Beverage", "Fashion & Beauty", "Finance", "Retail", 
                "Agriculture", "Media & Entertainment", "Consulting", 
                "Construction", "Transportation", "Other"
            ]
        },
        {
            section: "PROFILE",
            sectionNum: 1,
            question: "Where is your business located?",
            type: "profile",
            fieldName: "location",
            label: "Business Location",
            inputType: "text",
            required: true,
            placeholder: "City, Country (e.g., Lagos, Nigeria)"
        },
        {
            section: "PROFILE",
            sectionNum: 1,
            question: "How long has your business been operating?",
            type: "profile",
            fieldName: "yearsInBusiness",
            label: "Years in Business",
            inputType: "select",
            required: true,
            options: ["Less than 1", "1-2", "3-5", "6-10", "10+"]
        },
        {
            section: "PROFILE",
            sectionNum: 1,
            question: "How many employees are in your team?",
            type: "profile",
            fieldName: "employeesCount",
            label: "Number of Employees",
            inputType: "select",
            required: true,
            options: ["Just me", "2-5", "6-10", "11-25", "26-50", "50+"]
        },
        {
            section: "PROFILE",
            sectionNum: 1,
            question: "Do you have an existing business website URL?",
            type: "profile",
            fieldName: "websiteUrl",
            label: "Business Website (Optional)",
            inputType: "url",
            required: false,
            placeholder: "https://yourwebsite.com"
        },
        {
            section: "PROFILE",
            sectionNum: 1,
            question: "Which social media platforms are your primary presence?",
            type: "profile",
            fieldName: "socialPlatforms",
            label: "Primary Social Media Platforms (Select all that apply)",
            inputType: "checkboxes",
            required: false,
            options: ["Instagram", "Facebook", "Twitter/X", "LinkedIn", "TikTok", "YouTube", "None"]
        },

        // Section 2: DISCOVERABILITY (6 Questions)
        {
            section: "DISCOVERABILITY",
            sectionNum: 2,
            question: "Do you have a Google Business Profile setup?",
            type: "radio",
            options: [
                { text: "Yes, fully optimized and verified", points: 25, isMissing: false, fact: "Google Business Profile configured" },
                { text: "Yes, but not optimized/incomplete", points: 12, isMissing: true, fact: "Google Business Profile is incomplete" },
                { text: "No, or I don't know", points: 0, isMissing: true, fact: "Missing: Google Business Profile" }
            ]
        },
        {
            section: "DISCOVERABILITY",
            sectionNum: 2,
            question: "Does your business show up on Google Maps when searched?",
            type: "radio",
            options: [
                { text: "Yes, easily visible with active navigation details", points: 25, isMissing: false, fact: "Visible on Google Maps" },
                { text: "Sometimes/Only with exact name search", points: 12, isMissing: true, fact: "Google Maps visibility is limited" },
                { text: "No, or I don't know", points: 0, isMissing: true, fact: "Missing: Google Maps presence" }
            ]
        },
        {
            section: "DISCOVERABILITY",
            sectionNum: 2,
            question: "Can local customers easily find your services when searching keywords on Google?",
            type: "radio",
            options: [
                { text: "Yes, we rank on the first page", points: 25, isMissing: false, fact: "First-page Google rankings" },
                { text: "Somewhat, we appear down the page", points: 12, isMissing: true, fact: "Low visibility on keyword searches" },
                { text: "No, we do not appear in searches", points: 0, isMissing: true, fact: "Missing: Search engine visibility" }
            ]
        },
        {
            section: "DISCOVERABILITY",
            sectionNum: 2,
            question: "Are your contact details (phone, email, address) consistent across all online platforms?",
            type: "radio",
            options: [
                { text: "Yes, 100% consistent everywhere", points: 25, isMissing: false, fact: "Consistent online directory details" },
                { text: "Mostly, but there are some discrepancies", points: 12, isMissing: true, fact: "Inconsistent directory details" },
                { text: "No, details are outdated or missing", points: 0, isMissing: true, fact: "Missing: Directory NAP consistency" }
            ]
        },
        {
            section: "DISCOVERABILITY",
            sectionNum: 2,
            question: "Do you actively receive and reply to Google reviews?",
            type: "radio",
            options: [
                { text: "Yes, regularly receive and respond to them", points: 25, isMissing: false, fact: "Active Google reviews collection" },
                { text: "We have a few, but rarely get new ones or reply", points: 12, isMissing: true, fact: "Rarely receive/reply to Google reviews" },
                { text: "No reviews or no profile", points: 0, isMissing: true, fact: "Missing: Google reviews strategy" }
            ]
        },
        {
            section: "DISCOVERABILITY",
            sectionNum: 2,
            question: "Is your business listed in local online directories or industry maps?",
            type: "radio",
            options: [
                { text: "Yes, listed on multiple major directories", points: 25, isMissing: false, fact: "Listed in online directories" },
                { text: "Only listed in 1 or 2 basic directories", points: 12, isMissing: true, fact: "Incomplete business directory presence" },
                { text: "No directory listings", points: 0, isMissing: true, fact: "Missing: Local directory listings" }
            ]
        },

        // Section 3: WEBSITE & FIRST IMPRESSION (7 Questions)
        {
            section: "WEBSITE",
            sectionNum: 3,
            question: "Do you have a dedicated business website?",
            type: "radio",
            options: [
                { text: "Yes, custom-built and modern", points: 25, isMissing: false, fact: "Professional custom website" },
                { text: "Yes, but outdated or DIY-looking", points: 12, isMissing: true, fact: "Website is outdated or DIY style" },
                { text: "No website", points: 0, isMissing: true, fact: "Missing: Business website" }
            ]
        },
        {
            section: "WEBSITE",
            sectionNum: 3,
            question: "Is your website fully responsive and mobile-friendly?",
            type: "radio",
            options: [
                { text: "Yes, looks and works perfectly on mobile", points: 25, isMissing: false, fact: "Mobile-responsive website" },
                { text: "Partially, some pages look broken or hard to use", points: 12, isMissing: true, fact: "Partially mobile-friendly website" },
                { text: "No, or I don't have a website", points: 0, isMissing: true, fact: "Missing: Mobile-responsive website" }
            ]
        },
        {
            section: "WEBSITE",
            sectionNum: 3,
            question: "Does your website load quickly (under 3 seconds)?",
            type: "radio",
            options: [
                { text: "Yes, very fast load times", points: 25, isMissing: false, fact: "Fast website speed" },
                { text: "Okay, but takes 4-7 seconds to fully render", points: 12, isMissing: true, fact: "Slow website load speeds" },
                { text: "Very slow (8+ seconds) or no website", points: 0, isMissing: true, fact: "Missing: Fast loading speed" }
            ]
        },
        {
            section: "WEBSITE",
            sectionNum: 3,
            question: "Are your core services or products clearly explained on the homepage?",
            type: "radio",
            options: [
                { text: "Yes, visitors know exactly what we offer in 5 seconds", points: 25, isMissing: false, fact: "Clear service explanations" },
                { text: "Somewhat, but requires reading down the page", points: 12, isMissing: true, fact: "Unclear primary service messaging" },
                { text: "No, it is confusing or we have no website", points: 0, isMissing: true, fact: "Missing: Clear value communication on home" }
            ]
        },
        {
            section: "WEBSITE",
            sectionNum: 3,
            question: "Is your business contact information easy to find on the website?",
            type: "radio",
            options: [
                { text: "Yes, visible in header, footer, and contact page", points: 25, isMissing: false, fact: "Accessible contact information" },
                { text: "Hidden, takes a few clicks to locate", points: 12, isMissing: true, fact: "Hard-to-find contact details" },
                { text: "No contact info displayed or no website", points: 0, isMissing: true, fact: "Missing: Easy contact accessibility" }
            ]
        },
        {
            section: "WEBSITE",
            sectionNum: 3,
            question: "Do you have a clear primary Call-To-Action (CTA) on your website?",
            type: "radio",
            options: [
                { text: "Yes, high-contrast button like 'Book Now' or 'Get Quote'", points: 25, isMissing: false, fact: "Optimized Call-to-Action buttons" },
                { text: "Yes, but it is small, hidden, or unclear", points: 12, isMissing: true, fact: "Weak website CTAs" },
                { text: "No CTA or no website", points: 0, isMissing: true, fact: "Missing: Clear Call-to-Action setup" }
            ]
        },
        {
            section: "WEBSITE",
            sectionNum: 3,
            question: "Would you describe your website design as clean, professional, and trustworthy?",
            type: "radio",
            options: [
                { text: "Yes, looks premium and modern", points: 25, isMissing: false, fact: "Premium, modern site design" },
                { text: "It is dated or looks standard/generic", points: 12, isMissing: true, fact: "Dated or generic site styling" },
                { text: "Poor design quality or no website", points: 0, isMissing: true, fact: "Missing: Professional design aesthetics" }
            ]
        },

        // Section 4: POSITIONING (5 Questions)
        {
            section: "POSITIONING",
            sectionNum: 4,
            question: "Can you clearly explain what makes your business different from competitors?",
            type: "radio",
            options: [
                { text: "Yes, we have a unique value proposition", points: 25, isMissing: false, fact: "Strong unique value proposition" },
                { text: "Vaguely, we claim to offer 'better service'", points: 12, isMissing: true, fact: "Generic competitor differentiation" },
                { text: "No, we offer the same things at similar prices", points: 0, isMissing: true, fact: "Missing: Clear positioning differentiation" }
            ]
        },
        {
            section: "POSITIONING",
            sectionNum: 4,
            question: "Is your visual branding (logo, colors, typography) consistent across all materials?",
            type: "radio",
            options: [
                { text: "Yes, completely consistent everywhere", points: 25, isMissing: false, fact: "Consistent brand visual identity" },
                { text: "Mostly, but variations exist on some channels", points: 12, isMissing: true, fact: "Inconsistent brand styling" },
                { text: "No, logo and colors vary randomly", points: 0, isMissing: true, fact: "Missing: Visual brand guidelines" }
            ]
        },
        {
            section: "POSITIONING",
            sectionNum: 4,
            question: "Is your pricing structure clearly presented or explained to potential customers?",
            type: "radio",
            options: [
                { text: "Yes, transparent pricing or clear packages", points: 25, isMissing: false, fact: "Transparent pricing details" },
                { text: "Hidden, they must request a custom quote", points: 12, isMissing: true, fact: "Opaque or request-only pricing" },
                { text: "No clear pricing details available", points: 0, isMissing: true, fact: "Missing: Price clarity or package structure" }
            ]
        },
        {
            section: "POSITIONING",
            sectionNum: 4,
            question: "Does your online presence communicate the exact value you deliver?",
            type: "radio",
            options: [
                { text: "Yes, website focus is entirely on client outcomes", points: 25, isMissing: false, fact: "Outcome-focused messaging" },
                { text: "Somewhat, it focuses on our features and history", points: 12, isMissing: true, fact: "Feature-centric business messaging" },
                { text: "No, it is just a basic contact list", points: 0, isMissing: true, fact: "Missing: Value-oriented messaging" }
            ]
        },
        {
            section: "POSITIONING",
            sectionNum: 4,
            question: "Do customers instantly understand exactly what your business does?",
            type: "radio",
            options: [
                { text: "Yes, it is immediately obvious", points: 25, isMissing: false, fact: "Clear business definition" },
                { text: "Sometimes, they occasionally ask for clarification", points: 12, isMissing: true, fact: "Vague service classification" },
                { text: "No, we often have to explain in detail", points: 0, isMissing: true, fact: "Missing: Rapid business comprehension" }
            ]
        },

        // Section 5: SOCIAL PROOF (5 Questions)
        {
            section: "SOCIAL_PROOF",
            sectionNum: 5,
            question: "Do you display client testimonials on your homepage or landing pages?",
            type: "radio",
            options: [
                { text: "Yes, premium text and video testimonials", points: 25, isMissing: false, fact: "Rich customer testimonials" },
                { text: "Yes, but they are generic text without names/photos", points: 12, isMissing: true, fact: "Anonymous/weak testimonials" },
                { text: "No testimonials displayed", points: 0, isMissing: true, fact: "Missing: Client testimonials" }
            ]
        },
        {
            section: "SOCIAL_PROOF",
            sectionNum: 5,
            question: "Do you show real customer reviews from Google, Trustpilot, or Facebook?",
            type: "radio",
            options: [
                { text: "Yes, live review widgets or verified badges", points: 25, isMissing: false, fact: "Verified reviews display" },
                { text: "We have listed a few static quotes", points: 12, isMissing: true, fact: "Static review highlights" },
                { text: "No reviews displayed", points: 0, isMissing: true, fact: "Missing: Verified social proof reviews" }
            ]
        },
        {
            section: "SOCIAL_PROOF",
            sectionNum: 5,
            question: "Do you showcase a portfolio of recent projects or case studies?",
            type: "radio",
            options: [
                { text: "Yes, deep case studies with real results", points: 25, isMissing: false, fact: "Detailed project case studies" },
                { text: "Yes, but just static images without context", points: 12, isMissing: true, fact: "Context-free project gallery" },
                { text: "No portfolio shown", points: 0, isMissing: true, fact: "Missing: Project work showcase" }
            ]
        },
        {
            section: "SOCIAL_PROOF",
            sectionNum: 5,
            question: "Do you display before-and-after work examples if applicable to your industry?",
            type: "radio",
            options: [
                { text: "Yes, clear visual transformations", points: 25, isMissing: false, fact: "Before/after visual proof" },
                { text: "We have generic descriptions of improvements", points: 12, isMissing: true, fact: "Abstract transformation statements" },
                { text: "No before-and-after displays", points: 0, isMissing: true, fact: "Missing: Visual transformation proof" }
            ]
        },
        {
            section: "SOCIAL_PROOF",
            sectionNum: 5,
            question: "Do you feature client logos, badges, or success metrics prominently?",
            type: "radio",
            options: [
                { text: "Yes, prominent logo grids or key stats (e.g., '10k+ users')", points: 25, isMissing: false, fact: "Trust badges & brand logos" },
                { text: "Yes, but they are hidden or hard to see", points: 12, isMissing: true, fact: "Inconspicuous trust markers" },
                { text: "No client logos or stats displayed", points: 0, isMissing: true, fact: "Missing: Trust badges and logos" }
            ]
        },

        // Section 6: SOCIAL MEDIA PRESENCE (5 Questions)
        {
            section: "SOCIAL_MEDIA",
            sectionNum: 6,
            question: "On how many social media platforms is your business active?",
            type: "radio",
            options: [
                { text: "Multiple (3+) platforms with updated content", points: 25, isMissing: false, fact: "Multi-channel social presence" },
                { text: "Only active on 1-2 platforms", points: 12, isMissing: true, fact: "Limited platform footprint" },
                { text: "No active social media platforms", points: 0, isMissing: true, fact: "Missing: Social media footprint" }
            ]
        },
        {
            section: "SOCIAL_MEDIA",
            sectionNum: 6,
            question: "What is your typical posting frequency on social media?",
            type: "radio",
            options: [
                { text: "Regularly (3+ times a week)", points: 25, isMissing: false, fact: "Consistent social posting" },
                { text: "Occasionally (1-4 times a month)", points: 12, isMissing: true, fact: "Sporadic social media updates" },
                { text: "Never or very rarely", points: 0, isMissing: true, fact: "Missing: Social content cadence" }
            ]
        },
        {
            section: "SOCIAL_MEDIA",
            sectionNum: 6,
            question: "How is your typical customer engagement (likes, comments, messages) on social media?",
            type: "radio",
            options: [
                { text: "High engagement, active discussions", points: 25, isMissing: false, fact: "High customer social engagement" },
                { text: "Some engagement, but mostly quiet", points: 12, isMissing: true, fact: "Low social media engagement" },
                { text: "Virtually zero engagement or inactive", points: 0, isMissing: true, fact: "Missing: Social community engagement" }
            ]
        },
        {
            section: "SOCIAL_MEDIA",
            sectionNum: 6,
            question: "Is your social media branding consistent with your website design?",
            type: "radio",
            options: [
                { text: "Yes, perfectly matched banners, logos, and style", points: 25, isMissing: false, fact: "Unified website & social design" },
                { text: "Mostly, but some channels use old designs", points: 12, isMissing: true, fact: "Disconnected channel styling" },
                { text: "No connection or no profiles", points: 0, isMissing: true, fact: "Missing: Brand styling alignment" }
            ]
        },
        {
            section: "SOCIAL_MEDIA",
            sectionNum: 6,
            question: "Do your social media posts actively educate and guide users to convert?",
            type: "radio",
            options: [
                { text: "Yes, balanced mix of educational posts & clear offers", points: 25, isMissing: false, fact: "Value & conversion content mix" },
                { text: "Sometimes, but we mostly post company updates", points: 12, isMissing: true, fact: "Internal-focused social content" },
                { text: "No, we just post random pictures or nothing", points: 0, isMissing: true, fact: "Missing: Conversion-oriented content" }
            ]
        },

        // Section 7: LEAD CAPTURE & CONVERSION (7 Questions)
        {
            section: "LEAD_CAPTURE",
            sectionNum: 7,
            question: "How many clicks does it take for a visitor to contact you or start an inquiry?",
            type: "radio",
            options: [
                { text: "One click directly from the homepage", points: 25, isMissing: false, fact: "One-click contact option" },
                { text: "Takes a few clicks through subpages", points: 12, isMissing: true, fact: "Multi-click inquiry path" },
                { text: "Difficult to find contact routes", points: 0, isMissing: true, fact: "Missing: Clear contact accessibility" }
            ]
        },
        {
            section: "LEAD_CAPTURE",
            sectionNum: 7,
            question: "Do you collect customer email addresses on your website?",
            type: "radio",
            options: [
                { text: "Yes, automated newsletter signups or downloads", points: 25, isMissing: false, fact: "Active email list building" },
                { text: "Only if they fill a contact form", points: 12, isMissing: true, fact: "Passive email collection" },
                { text: "No email list collection", points: 0, isMissing: true, fact: "Missing: Email newsletter capture" }
            ]
        },
        {
            section: "LEAD_CAPTURE",
            sectionNum: 7,
            question: "Is online booking or scheduling directly available for customers?",
            type: "radio",
            options: [
                { text: "Yes, integrated booking calendar (Calendly, etc.)", points: 25, isMissing: false, fact: "Integrated self-service booking" },
                { text: "Only via WhatsApp chat", points: 12, isMissing: true, fact: "Chat-based manual booking" },
                { text: "No online booking/must call", points: 0, isMissing: true, fact: "Missing: Digital booking capabilities" }
            ]
        },
        {
            section: "LEAD_CAPTURE",
            sectionNum: 7,
            question: "Do you utilize a specialized WhatsApp Business profile for support?",
            type: "radio",
            options: [
                { text: "Yes, configured with catalogs, hours, and replies", points: 25, isMissing: false, fact: "Configured WhatsApp Business profile" },
                { text: "We use a regular WhatsApp account", points: 12, isMissing: true, fact: "Standard WhatsApp personal profile" },
                { text: "No WhatsApp contact channel", points: 0, isMissing: true, fact: "Missing: WhatsApp communication channel" }
            ]
        },
        {
            section: "LEAD_CAPTURE",
            sectionNum: 7,
            question: "Do you offer any lead magnets (free guides, checklists, or audits)?",
            type: "radio",
            options: [
                { text: "Yes, highly relevant resources to capture leads", points: 25, isMissing: false, fact: "Lead magnet assets deployed" },
                { text: "Yes, but they are outdated or generic", points: 12, isMissing: true, fact: "Ineffective lead magnets" },
                { text: "No lead magnets offered", points: 0, isMissing: true, fact: "Missing: Value-first lead magnets" }
            ]
        },
        {
            section: "LEAD_CAPTURE",
            sectionNum: 7,
            question: "Do you have automated follow-ups set up for new leads?",
            type: "radio",
            options: [
                { text: "Yes, instant email or SMS autoresponders", points: 25, isMissing: false, fact: "Automated lead follow-up flows" },
                { text: "Only manual follow-up when we check email", points: 12, isMissing: true, fact: "Manual follow-up execution" },
                { text: "No follow-up strategy", points: 0, isMissing: true, fact: "Missing: Structured lead follow-up" }
            ]
        },
        {
            section: "LEAD_CAPTURE",
            sectionNum: 7,
            question: "Is there a clear, step-by-step customer journey defined for buyers?",
            type: "radio",
            options: [
                { text: "Yes, step 1, 2, 3 process is mapped out for them", points: 25, isMissing: false, fact: "Mapped client journey design" },
                { text: "Vaguely, they just click contact and hope for the best", points: 12, isMissing: true, fact: "Vague buyer conversion steps" },
                { text: "No defined customer path", points: 0, isMissing: true, fact: "Missing: Structured conversion journey" }
            ]
        },

        // Section 8: RETENTION & REFERRAL (4 Questions)
        {
            section: "RETENTION",
            sectionNum: 8,
            question: "Do you follow up with customers after a sale is completed?",
            type: "radio",
            options: [
                { text: "Yes, systematic survey or check-in within 30 days", points: 25, isMissing: false, fact: "Systematic post-sale checks" },
                { text: "Sometimes, if it is a major contract", points: 12, isMissing: true, fact: "Inconsistent post-sale check-ins" },
                { text: "No post-sale follow-up", points: 0, isMissing: true, fact: "Missing: Client check-in sequence" }
            ]
        },
        {
            section: "RETENTION",
            sectionNum: 8,
            question: "Do you actively ask satisfied customers for reviews or referrals?",
            type: "radio",
            options: [
                { text: "Yes, automated or standard request template", points: 25, isMissing: false, fact: "Structured referral system" },
                { text: "Rarely, only if they mention being happy", points: 12, isMissing: true, fact: "Occasional review requests" },
                { text: "No referral requests", points: 0, isMissing: true, fact: "Missing: Proactive referral prompts" }
            ]
        },
        {
            section: "RETENTION",
            sectionNum: 8,
            question: "Do you have a reward or loyalty mechanism for repeat business?",
            type: "radio",
            options: [
                { text: "Yes, discount programs, points, or gifts", points: 25, isMissing: false, fact: "Configured loyalty incentives" },
                { text: "Small informal discounts occasionally", points: 12, isMissing: true, fact: "Informal discount practices" },
                { text: "No loyalty benefits", points: 0, isMissing: true, fact: "Missing: Loyalty and repeat rewards" }
            ]
        },
        {
            section: "RETENTION",
            sectionNum: 8,
            question: "How regularly do you communicate value to past clients (newsletter, updates)?",
            type: "radio",
            options: [
                { text: "Monthly or weekly educational updates", points: 25, isMissing: false, fact: "Frequent customer communication" },
                { text: "Occasional holiday wishes or sales announcements", points: 12, isMissing: true, fact: "Promo-only client updates" },
                { text: "No regular communication", points: 0, isMissing: true, fact: "Missing: Customer engagement newsletter" }
            ]
        },

        // Section 9: LEGAL & TRUST SIGNALS (4 Questions)
        {
            section: "LEGAL",
            sectionNum: 9,
            question: "Is your business entity officially registered with corporate authorities?",
            type: "radio",
            options: [
                { text: "Yes, fully registered and compliant", points: 25, isMissing: false, fact: "Officially registered business entity" },
                { text: "In progress / Sole proprietor setup", points: 12, isMissing: true, fact: "Incomplete corporate registration" },
                { text: "No registration", points: 0, isMissing: true, fact: "Missing: Official business registration" }
            ]
        },
        {
            section: "LEGAL",
            sectionNum: 9,
            question: "Is there a Privacy Policy and Terms of Service link on your website footer?",
            type: "radio",
            options: [
                { text: "Yes, fully up-to-date and visible", points: 25, isMissing: false, fact: "Visible Privacy & Terms pages" },
                { text: "No, we don't have these pages or no website", points: 0, isMissing: true, fact: "Missing: Legal privacy policies" }
            ]
        },
        {
            section: "LEGAL",
            sectionNum: 9,
            question: "Does your website use a secure HTTPS connection?",
            type: "radio",
            options: [
                { text: "Yes, secure SSL badge visible", points: 25, isMissing: false, fact: "Secure SSL connection active" },
                { text: "No SSL (HTTP only) or no website", points: 0, isMissing: true, fact: "Missing: HTTPS security configuration" }
            ]
        },
        {
            section: "LEGAL",
            sectionNum: 9,
            question: "Is your physical office address or official support contact displayed clearly?",
            type: "radio",
            options: [
                { text: "Yes, clear address and phone details listed", points: 25, isMissing: false, fact: "Verified support contact info" },
                { text: "Only a contact form, no physical address shown", points: 12, isMissing: true, fact: "No physical address details shown" },
                { text: "No address or contact info visible", points: 0, isMissing: true, fact: "Missing: Clear support address details" }
            ]
        },

        // Section 10: COMPETITIVE AWARENESS (5 Questions)
        {
            section: "COMPETITIVE",
            sectionNum: 10,
            question: "Do you know exactly who your top 3-5 competitors are?",
            type: "radio",
            options: [
                { text: "Yes, we monitor them regularly", points: 25, isMissing: false, fact: "Active competitor intelligence" },
                { text: "Vaguely, we know a couple of names", points: 12, isMissing: true, fact: "Basic competitor awareness" },
                { text: "No, we do not pay attention to them", points: 0, isMissing: true, fact: "Missing: Competitor market research" }
            ]
        },
        {
            section: "COMPETITIVE",
            sectionNum: 10,
            question: "Can you explain what your competitors do better than your business?",
            type: "radio",
            options: [
                { text: "Yes, we have analysed their strengths clearly", points: 25, isMissing: false, fact: "Mapped competitor strengths" },
                { text: "Vaguely, they might have more resources/marketing", points: 12, isMissing: true, fact: "Abstract competitor analysis" },
                { text: "No idea or we assume we do everything better", points: 0, isMissing: true, fact: "Missing: Competitor strength evaluation" }
            ]
        },
        {
            section: "COMPETITIVE",
            sectionNum: 10,
            question: "Can you explain what your business does better than competitors?",
            type: "radio",
            options: [
                { text: "Yes, we have a clear competitive edge", points: 25, isMissing: false, fact: "Clearly defined competitive edge" },
                { text: "Vaguely, we believe we have friendly service", points: 12, isMissing: true, fact: "Weak competitive distinction" },
                { text: "No idea or we offer the exact same thing", points: 0, isMissing: true, fact: "Missing: Clear market advantage" }
            ]
        },
        {
            section: "COMPETITIVE",
            sectionNum: 10,
            question: "Have you reviewed your top competitors' websites in the last 30 days?",
            type: "radio",
            options: [
                { text: "Yes, we audit their visual styles and pricing", points: 25, isMissing: false, fact: "Regular competitor site audits" },
                { text: "Only briefly browsed once or twice long ago", points: 12, isMissing: true, fact: "Outdated competitor site reviews" },
                { text: "No, we never review them", points: 0, isMissing: true, fact: "Missing: Competitor site reviews" }
            ]
        },
        {
            section: "COMPETITIVE",
            sectionNum: 10,
            question: "Do you understand why customers choose your competitors over you?",
            type: "radio",
            options: [
                { text: "Yes, we have surveyed lost opportunities", points: 25, isMissing: false, fact: "Analysed lost client opportunities" },
                { text: "Somewhat, usually comes down to pricing/discounts", points: 12, isMissing: true, fact: "Assumed price-only loss reasons" },
                { text: "No, we have no idea why we lose deals", points: 0, isMissing: true, fact: "Missing: Lost prospect analysis" }
            ]
        }
    ];

    const categoryMaxPoints = {
        PROFILE: 175,
        DISCOVERABILITY: 150,
        WEBSITE: 175,
        POSITIONING: 125,
        SOCIAL_PROOF: 125,
        SOCIAL_MEDIA: 125,
        LEAD_CAPTURE: 175,
        RETENTION: 100,
        LEGAL: 100,
        COMPETITIVE: 125
    };

    // --- Per-category display names (used in copy) ---
    const categoryDisplayNames = {
        PROFILE: 'Profile',
        DISCOVERABILITY: 'Discoverability',
        WEBSITE: 'Website',
        POSITIONING: 'Positioning',
        SOCIAL_PROOF: 'Social Proof',
        SOCIAL_MEDIA: 'Social Media',
        LEAD_CAPTURE: 'Lead Capture',
        RETENTION: 'Retention',
        LEGAL: 'Legal',
        COMPETITIVE: 'Competitive'
    };

    // Section 5: Top Strengths per-category lines
    const categoryStrengthLines = {
        PROFILE: 'Your business identity is clear and consistent.',
        DISCOVERABILITY: 'People can find you when they search.',
        WEBSITE: 'Your website gives visitors a strong first impression.',
        POSITIONING: "It's clear what you offer and who it's for.",
        SOCIAL_PROOF: 'Your reputation is working in your favor.',
        SOCIAL_MEDIA: 'Your presence is active and consistent.',
        LEAD_CAPTURE: "You're set up to capture interest, not lose it.",
        RETENTION: 'Customers have a reason to come back.',
        LEGAL: 'Your business is protected and compliant.',
        COMPETITIVE: 'You understand where you stand against competitors.'
    };

    // Section 6: Growth Opportunities per-category lines
    const categoryGapLines = {
        PROFILE: "Your business identity isn't landing clearly yet.",
        DISCOVERABILITY: "People are searching, but not finding you.",
        WEBSITE: "Your website isn't converting visitors into customers.",
        POSITIONING: "It's unclear what you offer or why it matters.",
        SOCIAL_PROOF: "You don't yet have enough trust signals visible.",
        SOCIAL_MEDIA: 'Your presence is inconsistent or inactive.',
        LEAD_CAPTURE: 'Interested visitors are leaving without a next step.',
        RETENTION: "Customers aren't coming back after their first visit.",
        LEGAL: 'Your business has exposure here that needs attention.',
        COMPETITIVE: "You don't have visibility into where you stand against competitors."
    };

    // Section 7: "What changes if you fix these" bullets per category
    const categoryFixBullets = {
        PROFILE: [
            'People recognize your business instantly',
            'Your identity feels consistent everywhere they find you',
            'First impressions build trust immediately'
        ],
        DISCOVERABILITY: [
            'More people find you through search',
            'You show up where your customers are already looking',
            'Less reliance on word-of-mouth alone'
        ],
        WEBSITE: [
            'Visitors trust you more on first visit',
            'People know exactly what you offer',
            'More visitors take action (call/book/inquire)'
        ],
        POSITIONING: [
            'Customers understand your value instantly',
            'You stand out from competitors offering similar things',
            'Pricing and offers feel justified, not confusing'
        ],
        SOCIAL_PROOF: [
            'New visitors trust you faster',
            'Reviews and testimonials do the selling for you',
            'Skepticism turns into confidence'
        ],
        SOCIAL_MEDIA: [
            'You stay visible between purchases',
            'Engagement turns into repeat interest',
            'Your brand feels active and current'
        ],
        LEAD_CAPTURE: [
            'Interested visitors don\'t slip away',
            'You can follow up instead of losing the lead',
            'More inquiries convert into paying customers'
        ],
        RETENTION: [
            'Customers come back more often',
            'Get more referrals automatically',
            'Increase lifetime customer value'
        ],
        LEGAL: [
            'Build customer trust and credibility',
            'Protect your business legally',
            'Meet industry compliance standards'
        ],
        COMPETITIVE: [
            'You know exactly where you stand',
            'You can act on gaps before competitors close them',
            'Decisions are based on facts, not guesses'
        ]
    };

    // Section 7: Icons per category
    const categoryIcons = {
        PROFILE: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        DISCOVERABILITY: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        WEBSITE: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
        POSITIONING: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>',
        SOCIAL_PROOF: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
        SOCIAL_MEDIA: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
        LEAD_CAPTURE: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
        RETENTION: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        LEGAL: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
        COMPETITIVE: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>'
    };

    // Section 8: Today vs Potential pairs
    const todayVsPotential = {
        PROFILE: { today: 'Inconsistent first impression', potential: 'Instantly recognizable identity' },
        DISCOVERABILITY: { today: 'Invisible in search', potential: 'Found by the right people' },
        WEBSITE: { today: 'Weak first impression', potential: 'Professional presence' },
        POSITIONING: { today: 'Unclear offer', potential: 'Strategic market position' },
        SOCIAL_PROOF: { today: 'Missing trust signals', potential: 'Established credibility' },
        SOCIAL_MEDIA: { today: 'Inactive presence', potential: 'Consistent engagement' },
        LEAD_CAPTURE: { today: 'Manual inquiries', potential: 'Automated leads' },
        RETENTION: { today: 'Low repeat business', potential: 'Loyal customer base' },
        LEGAL: { today: 'Compliance gaps', potential: 'Full legal compliance' },
        COMPETITIVE: { today: 'Unaware of competition', potential: 'Strategic market position' }
    };

    // --- Session ID & Config Loader ---
    let sessionId = localStorage.getItem('bga_session_id');
    if (!sessionId) {
        sessionId = 'BGA_SESS_' + Math.random().toString(36).substring(2, 11).toUpperCase() + '_' + Date.now();
        localStorage.setItem('bga_session_id', sessionId);
    }

    let paystackPublicKey = 'pk_live_37e6be6558a9d9998c9ec0c2a22b72e854fd54c5';
    setTimeout(() => {
        fetch('/api/get-config')
            .then(res => res.json())
            .then(config => {
                if (config.paystackPublicKey) {
                    paystackPublicKey = config.paystackPublicKey;
                }
            })
            .catch(err => console.error("Error loading config:", err));
    }, 1000);

    // --- State Variables ---
    let userData = {
        businessName: "",
        email: "",
        phone: "",
        industry: "",
        location: "",
        yearsInBusiness: "",
        employeesCount: "",
        websiteUrl: "",
        socialPlatforms: []
    };
    let currentQuestionIndex = 0;
    let answers = new Array(quizData.length).fill(null);

    // --- DOM Elements ---
    const screenIntro = document.getElementById('bga-intro');
    const screenQuestions = document.getElementById('bga-questions');
    const screenCalculating = document.getElementById('bga-calculating');
    const screenResults = document.getElementById('bga-results');

    const introForm = document.getElementById('bga-intro-form');
    const resumePrompt = document.getElementById('bga-resume-prompt');
    const resumeBtn = document.getElementById('bga-resume-btn');
    const restartBtn = document.getElementById('bga-restart-btn');

    const progressBar = document.getElementById('bga-progress-bar');
    const progressText = document.getElementById('bga-progress-text');
    const sectionTag = document.getElementById('bga-section-tag');
    const questionText = document.getElementById('bga-question-text');
    const optionsContainer = document.getElementById('bga-options');
    const profileInputContainer = document.getElementById('bga-profile-input');

    const backBtn = document.getElementById('bga-back-btn');
    const nextBtn = document.getElementById('bga-next-btn');

    // --- Start Button Form State Check ---
    const startBtn = document.getElementById('bga-start-btn');
    const bizNameInput = document.getElementById('bga-business-name');
    const emailInput = document.getElementById('bga-email');
    const phoneInput = document.getElementById('bga-phone');

    function checkStartBtnState() {
        if (!bizNameInput || !emailInput || !phoneInput || !startBtn) return;
        const nameVal = bizNameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const phoneVal = phoneInput.value.trim();
        
        const isFilled = (nameVal !== "" && emailVal !== "" && phoneVal !== "");
        startBtn.disabled = !isFilled;
    }

    if (bizNameInput && emailInput && phoneInput) {
        ['input', 'change'].forEach(evt => {
            bizNameInput.addEventListener(evt, checkStartBtnState, { passive: true });
            emailInput.addEventListener(evt, checkStartBtnState, { passive: true });
            phoneInput.addEventListener(evt, checkStartBtnState, { passive: true });
        });
        requestAnimationFrame(checkStartBtnState);
    }

    // --- State Storage Helpers ---
    function saveProgress() {
        const progressData = {
            index: currentQuestionIndex,
            answers: answers,
            userData: userData,
            timestamp: Date.now()
        };
        localStorage.setItem('bga_progress', JSON.stringify(progressData));
    }

    function checkResumeState() {
        const saved = localStorage.getItem('bga_progress');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Check if session is older than 24 hours (86400000 ms)
                if (Date.now() - parsed.timestamp < 86400000) {
                    resumePrompt.style.display = 'block';
                    // Populate initial form fields if they exist
                    if (parsed.userData) {
                        if (bizNameInput) bizNameInput.value = parsed.userData.businessName || "";
                        if (emailInput) emailInput.value = parsed.userData.email || "";
                        if (phoneInput) phoneInput.value = parsed.userData.phone || "";
                        checkStartBtnState();
                    }
                    return parsed;
                } else {
                    localStorage.removeItem('bga_progress');
                }
            } catch (e) {
                console.error("Error reading saved progress", e);
            }
        }
        return null;
    }

    // --- Init Check ---
    const savedSession = checkResumeState();

    // Prefill business name from URL query parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const businessNameParam = urlParams.get('businessName');
    if (businessNameParam && bizNameInput) {
        bizNameInput.value = businessNameParam;
        checkStartBtnState();
    }

    if (introForm) {
        const handleIntroStart = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const nameVal = bizNameInput ? bizNameInput.value.trim() : '';
            const emailVal = emailInput ? emailInput.value.trim() : '';
            const phoneVal = phoneInput ? phoneInput.value.trim() : '';

            if (!nameVal || !emailVal || !phoneVal) {
                checkStartBtnState();
                alert("Please fill in your Business Name, Email Address, and Phone Number.");
                return false;
            }

            userData.businessName = nameVal;
            userData.email = emailVal;
            userData.phone = phoneVal;
            
            // Auto fill profile question 1 answer with business name
            answers[0] = userData.businessName;

            localStorage.setItem('bga_user', JSON.stringify({
                name: userData.businessName,
                email: userData.email,
                phone: userData.phone
            }));

            // Notify Builtium Audit Bot on session start
            try {
                fetch('/api/audit-log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'create',
                        sessionId: sessionId,
                        data: {
                            businessName: userData.businessName,
                            email: userData.email,
                            phone: userData.phone
                        }
                    })
                }).catch(err => console.warn('Audit start log error:', err));
            } catch (err) {
                console.warn('Audit start fetch error:', err);
            }

            showScreen(screenQuestions);
            loadQuestion(1); // Jump to question index 1 (Industry) since index 0 (Business Name) is answered
            return false;
        };

        introForm.addEventListener('submit', handleIntroStart);
        if (startBtn) {
            startBtn.addEventListener('click', handleIntroStart);
        }
    }

    if (resumeBtn && savedSession) {
        resumeBtn.addEventListener('click', () => {
            currentQuestionIndex = savedSession.index;
            answers = savedSession.answers;
            userData = savedSession.userData;
            showScreen(screenQuestions);
            loadQuestion(currentQuestionIndex);
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            localStorage.removeItem('bga_progress');
            resumePrompt.style.display = 'none';
            introForm.reset();
        });
    }

    backBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 1) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        } else if (currentQuestionIndex === 1) {
            // Go back to intro screen
            showScreen(screenIntro);
        }
    });

    nextBtn.addEventListener('click', () => {
        // Collect inputs if profile question
        const q = quizData[currentQuestionIndex];
        if (q.type === 'profile') {
            const isValid = validateAndCollectProfileInput(q);
            if (!isValid) return;
        }



        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            processCompletion();
        }
    });

    // --- Screen Control ---
    function showScreen(screenEl) {
        [screenIntro, screenQuestions, screenCalculating, screenResults].forEach(s => {
            if (s) s.classList.remove('bga-screen--active');
        });
        if (screenEl) {
            screenEl.classList.add('bga-screen--active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    // --- Question Rendering ---
    function loadQuestion(index) {
        currentQuestionIndex = index;
        const q = quizData[index];

        // Section Badges & Labels
        sectionTag.textContent = q.section.replace('_', ' ');
        sectionTag.className = `bga-category-tag bga-category-tag--${q.section.toLowerCase().replace('_', '-')}`;
        questionText.textContent = q.question;

        // Progress Calculations
        const currentProgressPercent = Math.round((index / quizData.length) * 100);
        progressBar.style.width = `${currentProgressPercent}%`;
        progressText.textContent = `Section ${q.sectionNum} of 10 • ${currentProgressPercent}% Complete`;

        // Reassurance Note visibility (first profile question, index 1)
        const reassuranceEl = document.getElementById('bga-reassurance');
        if (reassuranceEl) {
            reassuranceEl.style.display = (index === 1) ? 'block' : 'none';
        }

        // Progress Encouragement subtext
        const encouragementEl = document.getElementById('bga-progress-encouragement');
        if (encouragementEl) {
            if (currentProgressPercent >= 50 && currentProgressPercent < 75) {
                encouragementEl.textContent = "⚡ You're halfway there! Keep going.";
                encouragementEl.style.opacity = '1';
            } else if (currentProgressPercent >= 75 && currentProgressPercent < 95) {
                encouragementEl.textContent = "🚀 Almost finished! Just a few more.";
                encouragementEl.style.opacity = '1';
            } else {
                encouragementEl.style.opacity = '0';
            }
        }

        // Reset display wrappers
        optionsContainer.style.display = 'none';
        profileInputContainer.style.display = 'none';
        optionsContainer.innerHTML = '';
        profileInputContainer.innerHTML = '';

        nextBtn.disabled = true;

        if (q.type === 'profile') {
            questionText.style.display = 'none'; // Hide redundant question text for profile
            profileInputContainer.style.display = 'block';
            renderProfileField(q);
        } else {
            questionText.style.display = 'block'; // Show question text
            optionsContainer.style.display = 'flex';
            renderOptionCards(q);
        }

        saveProgress();
    }

    function renderOptionCards(q) {
        q.options.forEach((opt, i) => {
            const card = document.createElement('div');
            card.className = 'bga-option-card';
            
            // Check if option was previously selected
            const isSelected = answers[currentQuestionIndex] && answers[currentQuestionIndex].text === opt.text;
            if (isSelected) {
                card.classList.add('selected');
                nextBtn.disabled = false;
            }

            card.innerHTML = `
                <div class="bga-option-card__radio"></div>
                <div class="bga-option-card__text">${opt.text}</div>
            `;

            card.addEventListener('click', () => {
                // Clear selections
                optionsContainer.querySelectorAll('.bga-option-card').forEach(c => {
                    c.classList.remove('selected');
                });
                card.classList.add('selected');
                answers[currentQuestionIndex] = opt;
                nextBtn.disabled = false;

                // Auto advance on radio selection (300ms delay for premium touch feel)
                setTimeout(() => {
                    if (currentQuestionIndex === indexToMatch(q)) {
                        nextBtn.click();
                    }
                }, 300);
            });

            optionsContainer.appendChild(card);
        });
    }

    function indexToMatch(q) {
        // Helper to check if user has not changed selection index during the delay
        return currentQuestionIndex;
    }

    function renderProfileField(q) {
        const formGroup = document.createElement('div');
        formGroup.className = 'bga-intro__form-group';

        const label = document.createElement('label');
        label.textContent = q.label;
        formGroup.appendChild(label);

        const savedVal = answers[currentQuestionIndex] || "";

        if (q.inputType === 'text' || q.inputType === 'url') {
            const input = document.createElement('input');
            input.type = q.inputType;
            input.className = 'bga-intro__input';
            input.value = savedVal;
            input.placeholder = q.placeholder || "";
            input.required = q.required;
            input.addEventListener('input', () => {
                nextBtn.disabled = q.required && input.value.trim() === "";
            });
            formGroup.appendChild(input);
            nextBtn.disabled = q.required && input.value.trim() === "";
        } else if (q.inputType === 'select') {
            const select = document.createElement('select');
            select.className = 'bga-intro__input';
            select.required = q.required;

            const defaultOpt = document.createElement('option');
            defaultOpt.value = "";
            defaultOpt.disabled = true;
            defaultOpt.selected = savedVal === "";
            defaultOpt.textContent = "Select an option";
            select.appendChild(defaultOpt);

            q.options.forEach(optVal => {
                const opt = document.createElement('option');
                opt.value = optVal;
                opt.selected = savedVal === optVal;
                opt.textContent = optVal;
                select.appendChild(opt);
            });

            select.addEventListener('change', () => {
                nextBtn.disabled = select.value === "";
            });
            formGroup.appendChild(select);
            nextBtn.disabled = select.value === "";
        } else if (q.inputType === 'checkboxes') {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'bga-checkbox-group';

            const checkedList = Array.isArray(savedVal) ? savedVal : [];

            q.options.forEach(optVal => {
                const labelWrapper = document.createElement('label');
                labelWrapper.className = 'bga-checkbox-label';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = optVal;
                checkbox.checked = checkedList.includes(optVal);

                const span = document.createElement('span');
                span.textContent = optVal;

                labelWrapper.appendChild(checkbox);
                labelWrapper.appendChild(span);
                checkboxContainer.appendChild(labelWrapper);
            });

            // Checkboxes are optional, so enable Next button immediately
            nextBtn.disabled = false;
            formGroup.appendChild(checkboxContainer);
        }

        profileInputContainer.appendChild(formGroup);
    }

    function validateAndCollectProfileInput(q) {
        if (q.inputType === 'checkboxes') {
            const checked = [];
            profileInputContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                checked.push(cb.value);
            });
            answers[currentQuestionIndex] = checked;
            userData[q.fieldName] = checked;
            return true;
        }

        const inputEl = profileInputContainer.querySelector('input, select');
        if (!inputEl) return false;

        if (q.required && inputEl.value.trim() === "") {
            inputEl.classList.add('bga-form-input--error');
            inputEl.classList.add('error');
            return false;
        }

        const collectedVal = inputEl.value.trim();
        answers[currentQuestionIndex] = collectedVal;
        userData[q.fieldName] = collectedVal;
        return true;
    }

    // --- Calculations & Final Screen ---
    function processCompletion() {
        showScreen(screenCalculating);
        
        // Stored Profile Data Scoring Allocations (Minimal profile scoring logic)
        let profilePoints = 0;
        // Business Name provided
        profilePoints += 25; 
        // Industry provided
        profilePoints += answers[1] ? 25 : 0;
        // Location provided
        profilePoints += answers[2] ? 25 : 0;
        // Years in Business
        const yearsVal = answers[3];
        if (yearsVal === "Less than 1" || yearsVal === "1-2") profilePoints += 12;
        else if (yearsVal) profilePoints += 25;
        // Employees Count
        const empVal = answers[4];
        if (empVal === "Just me" || empVal === "2-5") profilePoints += 12;
        else if (empVal) profilePoints += 25;
        // Website URL provided
        profilePoints += (answers[5] && answers[5].trim() !== "") ? 25 : 0;
        // Social platforms active
        const socials = answers[6];
        if (socials && socials.length > 2) profilePoints += 25;
        else if (socials && socials.length > 0 && !socials.includes("None")) profilePoints += 12;

        // Execute calculating screen delay (1.5 seconds)
        setTimeout(() => {
            try {
                renderResultsReport(profilePoints);
            } catch (err) {
                console.error("Error rendering results report:", err);
            }
            showScreen(screenResults);
            localStorage.removeItem('bga_progress'); // Clean up progress
        }, 1500);
    }

    function renderResultsReport(profilePoints) {
        const isAlreadyPaid = localStorage.getItem('bga_paid') === 'true';
        const categories = Object.keys(categoryMaxPoints);

        let scores = {
            PROFILE: profilePoints,
            DISCOVERABILITY: 0,
            WEBSITE: 0,
            POSITIONING: 0,
            SOCIAL_PROOF: 0,
            SOCIAL_MEDIA: 0,
            LEAD_CAPTURE: 0,
            RETENTION: 0,
            LEGAL: 0,
            COMPETITIVE: 0
        };

        // Sum standard question points
        quizData.forEach((q, idx) => {
            if (q.type !== 'profile') {
                const selectedOpt = answers[idx];
                if (selectedOpt && selectedOpt.points) {
                    scores[q.section] += selectedOpt.points;
                }
            }
        });

        // Compute Total Score
        let rawTotal = 0;
        for (const sec in scores) {
            rawTotal += scores[sec];
        }
        const maxScoreTotal = 1375;
        const totalPercentage = Math.min(Math.round((rawTotal / maxScoreTotal) * 100), 100);

        // Report Meta Details
        const reportId = 'BLT-' + Math.floor(100000 + Math.random() * 900000);
        const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        const reportIdEl = document.getElementById('bga-report-id');
        if (reportIdEl) reportIdEl.textContent = reportId;

        const metaBizEl = document.getElementById('bga-meta-biz');
        if (metaBizEl) metaBizEl.textContent = userData.businessName || 'Your Business';

        const metaIndEl = document.getElementById('bga-meta-ind');
        if (metaIndEl) metaIndEl.textContent = userData.industry || 'Professional Services';

        const metaLocEl = document.getElementById('bga-meta-loc');
        if (metaLocEl) metaLocEl.textContent = userData.location || 'Lagos, NG';

        const metaDateEl = document.getElementById('bga-meta-date');
        if (metaDateEl) metaDateEl.textContent = formattedDate;

        // Maturity Stages — 5-stage model per spec
        const stagesInfo = [
            {
                name: "Invisible",
                exp: "You have virtually no digital footprint. Prospects cannot find you when searching for your services online.",
                doingWell: "You have taken the first step by auditing your business setup.",
                preventsNext: "Missing website storefront, absent local search listings, and zero digital touchpoints.",
                goodNews: "Any digital step taken now yields immediate, noticeable visibility gains."
            },
            {
                name: "Present",
                exp: "You exist online, but passively. You are found by exact name, but rarely when customers search for generic service keywords.",
                doingWell: "Basic profile setup and contact routes are established.",
                preventsNext: "Outdated web design, silent social channels, and lack of customer review strategy.",
                goodNews: "A modern visual overhaul and active reviews will rapidly move you to Credible."
            },
            {
                name: "Credible",
                exp: "You get referrals and inbound interest, but conversion is inconsistent. The strong months feel earned, and the flat months feel unexplained.",
                doingWell: "You have a real presence, a professional surface, and enough proof to be taken seriously in a first meeting.",
                preventsNext: "Your systems for discovery, capture, and retention are not yet doing work between conversations. Growth still depends on you being in the room.",
                goodNews: "You're one focused sprint away from the next stage. The gaps are specific, sequenced, and fixable — no rebuild required."
            },
            {
                name: "Growing",
                exp: "Consistent traction from your channels. New conversations start without you being in the room, but retention leaks revenue.",
                doingWell: "High conversion rate on inbound visitors and structured lead capture processes.",
                preventsNext: "Post-sale follow-up loops and customer repeat purchase retention programs are incomplete.",
                goodNews: "Optimizing retention will multiply your return on existing traffic immediately."
            },
            {
                name: "Compounding",
                exp: "Your business dominates local discoverability, web conversion is automated, and repeat customers generate exponential momentum.",
                doingWell: "Multi-channel presence, automated lead follow-ups, and robust social proof engines.",
                preventsNext: "Sustaining market leader dominance requires continuous monthly CRO and competitor tracking.",
                goodNews: "Your foundation is elite — scaling ad budget and strategic partnerships will unlock massive growth."
            }
        ];

        let activeStageIndex;
        if (totalPercentage <= 20) activeStageIndex = 0;
        else if (totalPercentage <= 40) activeStageIndex = 1;
        else if (totalPercentage <= 60) activeStageIndex = 2;
        else if (totalPercentage <= 80) activeStageIndex = 3;
        else activeStageIndex = 4;

        const activeStage = stagesInfo[activeStageIndex];

        // Overall Score Display
        const scoreNumEl = document.getElementById('bga-score-num');
        if (scoreNumEl) scoreNumEl.textContent = totalPercentage;

        const stageNameEl = document.getElementById('bga-stage-name');
        if (stageNameEl) stageNameEl.textContent = activeStage.name;

        // Stage Stepper active state
        const stageStepperItems = document.querySelectorAll('.bga-stage-stepper__item');
        stageStepperItems.forEach((item, idx) => {
            if (idx === activeStageIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Stage Stepper Circles (Section 03)
        const circleNodes = document.querySelectorAll('.bga-circles-stepper__node');
        circleNodes.forEach((node, idx) => {
            if (idx === activeStageIndex) {
                node.classList.add('bga-circles-stepper__node--active');
            } else {
                node.classList.remove('bga-circles-stepper__node--active');
            }
        });

        // Diagnostic copy blocks
        const diagExpEl = document.getElementById('bga-diag-exp');
        if (diagExpEl) diagExpEl.textContent = activeStage.exp;

        const diagWellEl = document.getElementById('bga-diag-well');
        if (diagWellEl) diagWellEl.textContent = activeStage.doingWell;

        const diagPreventsEl = document.getElementById('bga-diag-prevents');
        if (diagPreventsEl) diagPreventsEl.textContent = activeStage.preventsNext;

        const diagGoodNewsEl = document.getElementById('bga-diag-goodnews');
        if (diagGoodNewsEl) diagGoodNewsEl.textContent = activeStage.goodNews;

        // Section 03 Journey Cards
        const journeyHereTitle = document.getElementById('bga-journey-here-title');
        if (journeyHereTitle) journeyHereTitle.textContent = activeStage.name;

        const journeyHereDesc = document.getElementById('bga-journey-here-desc');
        if (journeyHereDesc) journeyHereDesc.textContent = activeStage.exp;

        const nextStageObj = stagesInfo[Math.min(activeStageIndex + 1, stagesInfo.length - 1)];
        const journeyNextTitle = document.getElementById('bga-journey-next-title');
        if (journeyNextTitle) journeyNextTitle.textContent = nextStageObj.name;

        const journeyNextDesc = document.getElementById('bga-journey-next-desc');
        if (journeyNextDesc) journeyNextDesc.textContent = nextStageObj.exp;

        // Compute Category Percentages & Sort
        const catMetadata = {
            PROFILE: {
                displayName: 'Profile',
                icon: categoryIcons.PROFILE,
                healthDesc: 'First-time visitors decide legitimacy in under seven seconds.',
                diagnosticFinding: 'Visual consistency and corporate identity build immediate confidence upon first load.',
                businessImpact: 'Inconsistent branding causes potential buyers to question legitimacy.',
                recommendedFix: 'Standardize your brand guidelines, high-res assets, and copy across all public touchpoints.',
                potentialOutcome: '+20% trust signal within 30 days',
                oppImpact: 'Your core business details and identity are not landing clearly everywhere.',
                expectedOutcome: 'Standardize logo, contact details, and brand message across all channels.'
            },
            DISCOVERABILITY: {
                displayName: 'Discoverability',
                icon: categoryIcons.DISCOVERABILITY,
                healthDesc: 'Search intent is the cheapest, highest-fit demand you can capture.',
                diagnosticFinding: 'Search intent is the cheapest, highest-fit demand you can capture.',
                businessImpact: 'High-intent prospects looking for your services cannot find your business in local search results or Google Maps, directing revenue to competitors.',
                recommendedFix: 'Claim and fully optimize your Google Business Profile, align NAP consistency across directories, and establish a weekly review collection cadence.',
                potentialOutcome: '+40% search visibility within 30 days',
                oppImpact: 'People are searching for your services locally, but finding competitors instead.',
                expectedOutcome: 'Optimize Google Business Profile and local directory citations.'
            },
            WEBSITE: {
                displayName: 'Website',
                icon: categoryIcons.WEBSITE,
                healthDesc: 'Your homepage is the single most-visited page in the business.',
                diagnosticFinding: 'Your homepage structure and performance govern visitor conversion rates.',
                businessImpact: 'Slow load times or cluttered layouts lead to high drop-off rates before visitors see your main call to action.',
                recommendedFix: 'Optimize page load speed under 3 seconds, streamline navigation, and place high-contrast CTAs above the fold.',
                potentialOutcome: '+30% conversion signal within 30 days',
                oppImpact: 'Visitors leave your site before understanding your offer or taking action.',
                expectedOutcome: 'Redesign homepage hero with high-contrast CTAs and under-3-second load speed.'
            },
            POSITIONING: {
                displayName: 'Positioning',
                icon: categoryIcons.POSITIONING,
                healthDesc: 'Positioning is the compounding layer under every other channel.',
                diagnosticFinding: 'Clear value positioning differentiates your offer from standard alternatives.',
                businessImpact: 'Unclear messaging forces prospects to evaluate your business on price rather than value.',
                recommendedFix: 'Sharpen your single-sentence unique value proposition and articulate client-outcome package tiers.',
                potentialOutcome: '+25% pricing clarity within 30 days',
                oppImpact: 'Prospects treat your services as a commodity and compete on price.',
                expectedOutcome: 'Publish a single-sentence outcome-focused value proposition.'
            },
            SOCIAL_PROOF: {
                displayName: 'Social Proof',
                icon: categoryIcons.SOCIAL_PROOF,
                healthDesc: 'Strangers copy the behavior of people who look like them.',
                diagnosticFinding: 'Verified testimonials and review widgets eliminate buying skepticism.',
                businessImpact: 'Lack of visible trust markers causes interested buyers to delay or abandon their decision.',
                recommendedFix: 'Embed live review widgets, collect 3 named customer testimonials with photos, and showcase client logos.',
                potentialOutcome: '+28% signal within 30 days',
                oppImpact: 'Serious buyers stall at the decision moment because proof isn\'t visible.',
                expectedOutcome: 'Collect three named testimonials and place them above the fold.'
            },
            SOCIAL_MEDIA: {
                displayName: 'Social Media',
                icon: categoryIcons.SOCIAL_MEDIA,
                healthDesc: 'Dormant channels signal the business itself is dormant.',
                diagnosticFinding: 'Regular posting rhythms maintain brand relevance and authority.',
                businessImpact: 'Infrequent activity creates the impression of an inactive or unmonitored operation.',
                recommendedFix: 'Establish a 3x/week content publishing calendar combining educational insights with clear conversion offers.',
                potentialOutcome: '+22% brand activity signal within 30 days',
                oppImpact: 'Quiet channels send mixed signals to prospects conducting due diligence.',
                expectedOutcome: 'Maintain a 3x/week cadence of value-driven social posts.'
            },
            LEAD_CAPTURE: {
                displayName: 'Lead Capture',
                icon: categoryIcons.LEAD_CAPTURE,
                healthDesc: 'Most visitors are not ready to buy — they are ready to remember.',
                diagnosticFinding: 'High-value lead magnets convert passive traffic into reachable prospects.',
                businessImpact: 'Without captured contacts, 95% of interested visitors leave without any follow-up route.',
                recommendedFix: 'Deploy a targeted lead magnet (e.g. guide or audit) backed by a 2-field form and automated email sequence.',
                potentialOutcome: '+25% signal within 30 days',
                oppImpact: 'You re-pay for the same attention every month without capturing leads.',
                expectedOutcome: 'Add one specific lead magnet behind a simple two-field form.'
            },
            RETENTION: {
                displayName: 'Retention',
                icon: categoryIcons.RETENTION,
                healthDesc: 'Revenue is a function of return, not just acquisition.',
                diagnosticFinding: 'Post-sale engagement loops multiply customer lifetime value and referrals.',
                businessImpact: 'Acquisition costs repeat constantly when existing clients drop off after one transaction.',
                recommendedFix: 'Implement a 30-day post-sale survey check-in and launch a monthly client newsletter update.',
                potentialOutcome: '+35% signal within 30 days',
                oppImpact: 'You grow only as fast as you can buy new attention.',
                expectedOutcome: 'Start a monthly note to past visitors and current customers.'
            },
            LEGAL: {
                displayName: 'Legal',
                icon: categoryIcons.LEGAL,
                healthDesc: 'Enterprise and cautious buyers audit these before contacting.',
                diagnosticFinding: 'Visible privacy policies and SSL badges resolve compliance concerns.',
                businessImpact: 'Cautious or institutional clients withhold high-value contracts without trust signals.',
                recommendedFix: 'Publish clear Privacy Policy and Terms of Service links in your website footer and enforce HTTPS/SSL everywhere.',
                potentialOutcome: '+18% compliance trust within 30 days',
                oppImpact: 'Enterprise buyers stall when essential legal trust signals are absent.',
                expectedOutcome: 'Add HTTPS SSL, Privacy Policy, and Terms links to footer.'
            },
            COMPETITIVE: {
                displayName: 'Competitive',
                icon: categoryIcons.COMPETITIVE,
                healthDesc: 'Buyers pick the option that feels most specific to them.',
                diagnosticFinding: 'Competitor intelligence allows you to claim clear market differentiation.',
                businessImpact: 'Failing to highlight unique strengths makes your offer appear identical to generic options.',
                recommendedFix: 'Conduct a monthly audit of competitor pricing and positioning to highlight your distinct edge.',
                potentialOutcome: '+24% differentiation signal within 30 days',
                oppImpact: 'Deals are lost because prospects don\'t understand why to pick you.',
                expectedOutcome: 'Document top competitor gaps and publish your specific advantages.'
            }
        };

        const sortedCats = categories.map(cat => {
            const scoreVal = scores[cat] || 0;
            const maxVal = categoryMaxPoints[cat];
            const pct = Math.round((scoreVal / maxVal) * 100);
            return {
                name: cat,
                meta: catMetadata[cat],
                percentage: pct
            };
        }).sort((a, b) => a.percentage - b.percentage);

        const top3Gaps = sortedCats.slice(0, 3);
        const highestCategory = [...sortedCats].sort((a, b) => b.percentage - a.percentage)[0];

        // At a Glance Box Update
        const glanceHealthEl = document.getElementById('bga-glance-health');
        if (glanceHealthEl) glanceHealthEl.textContent = activeStage.name;

        const glanceOppEl = document.getElementById('bga-glance-opportunity');
        if (glanceOppEl) glanceOppEl.textContent = top3Gaps[0].meta.displayName;

        const glanceUrgentEl = document.getElementById('bga-glance-urgent');
        if (glanceUrgentEl) glanceUrgentEl.textContent = top3Gaps[1].meta.displayName;

        const glanceStrongestEl = document.getElementById('bga-glance-strongest');
        if (glanceStrongestEl) glanceStrongestEl.textContent = highestCategory.meta.displayName;

        // Render Section 04: Digital Health Check (10 Cards Grid with Inline Expand/Collapse + Accessible Modal)
        const healthGridEl = document.getElementById('bga-health-grid');
        if (healthGridEl) {
            healthGridEl.innerHTML = '';
            
            categories.forEach((catKey, catIdx) => {
                const meta = catMetadata[catKey];
                const scoreVal = scores[catKey] || 0;
                const maxVal = categoryMaxPoints[catKey];
                const pct = Math.round((scoreVal / maxVal) * 100);

                let badgeText = 'Critical';
                let badgeClass = 'bga-badge--critical';
                let priorityText = 'Priority: High';

                if (pct >= 70) {
                    badgeText = 'Excellent';
                    badgeClass = 'bga-badge--excellent';
                    priorityText = 'Priority: Low';
                } else if (pct >= 45) {
                    badgeText = 'Needs Attention';
                    badgeClass = 'bga-badge--attention';
                    priorityText = 'Priority: Medium';
                }

                const cardId = `bga-health-card-${catIdx}`;
                const drawerId = `bga-drawer-${catIdx}`;

                const card = document.createElement('div');
                card.className = 'bga-health-card';
                card.id = cardId;
                card.innerHTML = `
                    <div class="bga-health-card__top">
                        <div class="bga-health-card__icon-wrap">
                            <span class="bga-health-card__icon" aria-hidden="true">${meta.icon}</span>
                            <div>
                                <h3 class="bga-health-card__name">${meta.displayName}</h3>
                                <span class="bga-health-card__badge ${badgeClass}">${badgeText}</span>
                            </div>
                        </div>
                        <span class="bga-health-card__pct">${pct}%</span>
                    </div>
                    <p class="bga-health-card__desc">${meta.healthDesc}</p>
                    
                    <div class="bga-health-card__bottom">
                        <span class="bga-health-card__priority">${priorityText}</span>
                    </div>

                    <!-- Full Diagnostic Details (Always Visible) -->
                    <div class="bga-health-card__drawer bga-health-card__drawer--full" id="${drawerId}">
                        <div class="bga-health-drawer-block">
                            <span class="bga-health-drawer-block__lbl">DIAGNOSTIC FINDING</span>
                            <p class="bga-health-drawer-block__val">${meta.diagnosticFinding}</p>
                        </div>
                        <div class="bga-health-drawer-block bga-health-drawer-block--impact">
                            <span class="bga-health-drawer-block__lbl">BUSINESS IMPACT</span>
                            <p class="bga-health-drawer-block__val">${meta.businessImpact}</p>
                        </div>
                        <div class="bga-health-drawer-block bga-health-drawer-block--fix">
                            <span class="bga-health-drawer-block__lbl">RECOMMENDED FIX</span>
                            <p class="bga-health-drawer-block__val">${meta.recommendedFix}</p>
                        </div>
                    </div>
                `;

                healthGridEl.appendChild(card);
            });
        }

        // Smooth Scroll Continue Button (Transition Section 10)
        const continueBtn = document.getElementById('bga-transition-continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                const upsellSec = document.getElementById('sec-upsell-blueprint');
                if (upsellSec) {
                    upsellSec.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Setup Paystack Popup Triggers across all unlock buttons (₦100 Live Testing)
        const unlockButtons = document.querySelectorAll('.bga-btn-unlock-trigger, #bga-main-cta-btn, #bga-final-cta-btn, #bga-top-unlock-link');
        unlockButtons.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        const refreshedButtons = document.querySelectorAll('.bga-btn-unlock-trigger, #bga-main-cta-btn, #bga-final-cta-btn, #bga-top-unlock-link');
        refreshedButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (typeof PaystackPop === 'undefined' || !paystackPublicKey) {
                    alert("Paystack payment system is currently initializing. Please try again in a few seconds.");
                    return;
                }

                const originalText = btn.textContent;
                btn.textContent = "Opening Checkout...";
                btn.disabled = true;

                const userEmail = userData.email && userData.email.trim() !== '' ? userData.email.trim() : 'customer@builtiumco.com';

                const handler = PaystackPop.setup({
                    key: paystackPublicKey,
                    email: userEmail,
                    amount: 100 * 100, // ₦100 in kobo (10,000 kobo)
                    currency: 'NGN',
                    ref: 'builtium_' + Math.floor((Math.random() * 1000000000) + 1),
                    callback: function(response) {
                        btn.textContent = "Payment Confirmed!";
                        btn.disabled = false;
                        
                        // Submit payment details to Netlify hidden form
                        submitPaymentToNetlify(response.reference, 'success');
                        
                        // Save paid status & apply UI unlocks
                        localStorage.setItem('bga_paid', 'true');
                        submitHiddenForm(true);
                        
                        btn.textContent = "✓ Paid & Unlocked";
                        btn.style.background = "#10B981";

                        // Show payment confirmation thank you modal with outreach info
                        showPaymentThankYou();
                    },
                    onClose: function() {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        console.log('Payment window closed.');
                    }
                });
                handler.openIframe();
            });
        });

        // Diagnostic Modal Handlers (Accessible Dialog with Focus Lock and ESC key)
        const diagModal = document.getElementById('bga-diagnostic-modal');
        const modalCloseBtn = document.getElementById('bga-modal-close-btn');
        let lastFocusedElement = null;

        function openDiagnosticModal(data, triggerEl = null) {
            if (!diagModal) return;
            
            lastFocusedElement = triggerEl || document.activeElement;

            document.getElementById('bga-modal-icon').innerHTML = data.icon;
            document.getElementById('bga-modal-cat-name').textContent = data.name;
            document.getElementById('bga-modal-pct').textContent = `${data.percentage}%`;
            
            const badgeEl = document.getElementById('bga-modal-badge');
            badgeEl.textContent = data.badgeText;
            badgeEl.className = `bga-modal-score__badge ${data.badgeClass}`;

            document.getElementById('bga-modal-finding').textContent = data.finding;
            document.getElementById('bga-modal-impact').textContent = data.impact;
            document.getElementById('bga-modal-fix').textContent = data.fix;

            diagModal.style.display = 'flex';
            diagModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            if (modalCloseBtn) modalCloseBtn.focus();
        }

        function closeDiagnosticModal() {
            if (!diagModal) return;
            diagModal.style.display = 'none';
            diagModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        }

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeDiagnosticModal);
        }

        if (diagModal) {
            diagModal.addEventListener('click', (e) => {
                if (e.target === diagModal) {
                    closeDiagnosticModal();
                }
            });
        }

        // Global Keyboard Listener for ESC and Modal Focus Trap
        document.addEventListener('keydown', (e) => {
            if (diagModal && diagModal.getAttribute('aria-hidden') === 'false') {
                if (e.key === 'Escape') {
                    closeDiagnosticModal();
                } else if (e.key === 'Tab') {
                    const focusables = diagModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([-tabindex="-1"])');
                    if (focusables.length > 0) {
                        const first = focusables[0];
                        const last = focusables[focusables.length - 1];
                        if (e.shiftKey && document.activeElement === first) {
                            last.focus();
                            e.preventDefault();
                        } else if (!e.shiftKey && document.activeElement === last) {
                            first.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        });

        // Function to submit ALL 55 answers + metadata to Netlify Forms & Function
        function submitHiddenForm(isPaidStatus = false) {
            const hiddenForm = document.getElementById('bga-lead-form');
            if (!hiddenForm) return;

            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.value = val || '';
            };

            setVal('bga-hidden-name', userData.businessName);
            setVal('bga-hidden-email', userData.email);
            setVal('bga-hidden-phone', userData.phone);
            setVal('bga-hidden-industry', userData.industry);
            setVal('bga-hidden-location', userData.location);
            setVal('bga-hidden-years', userData.yearsInBusiness);
            setVal('bga-hidden-employees', userData.employeesCount);
            setVal('bga-hidden-website', userData.websiteUrl);
            setVal('bga-hidden-socials', Array.isArray(userData.socialPlatforms) ? userData.socialPlatforms.join(', ') : (userData.socialPlatforms || ''));
            setVal('bga-hidden-score', `${totalPercentage}%`);
            setVal('bga-hidden-level', activeStage ? activeStage.name : '');
            setVal('bga-hidden-timestamp', new Date().toISOString());

            // Map individual section scores
            const parsedSectionScores = {};
            for (const key in scores) {
                parsedSectionScores[key] = `${scores[key]} / ${categoryMaxPoints[key]}`;
            }
            setVal('bga-hidden-scores', JSON.stringify(parsedSectionScores));

            // Map ALL 55 questions + answers + points
            const parsedAnswers = quizData.map((q, idx) => {
                const userAns = answers[idx];
                let ansText = '';
                let pts = 0;
                if (q.type === 'profile') {
                    ansText = typeof userAns === 'object' ? JSON.stringify(userAns) : (userAns || '');
                    pts = null;
                } else {
                    if (userAns && userAns.text) {
                        ansText = userAns.text;
                        pts = userAns.points || 0;
                    } else if (typeof userAns === 'string') {
                        ansText = userAns;
                    } else {
                        ansText = 'Not answered';
                    }
                }
                return {
                    qNum: idx + 1,
                    section: q.section,
                    question: q.question,
                    answer: ansText,
                    points: pts
                };
            });
            setVal('bga-hidden-answers', JSON.stringify(parsedAnswers));



            // Post completion metrics silently to Builtium Audit Bot via Vercel API
            try {
                fetch("/api/audit-log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: 'update',
                        sessionId: sessionId,
                        data: {
                            type: 'completion',
                            businessName: userData.businessName,
                            email: userData.email,
                            phone: userData.phone,
                            finalResult: activeStage ? activeStage.name : `${totalPercentage}%`,
                            scores: scores,
                            paid: isPaidStatus
                        }
                    })
                })
                .then(() => console.log("Audit completion successfully logged to Vercel API."))
                .catch(err => console.error("Error logging completion to Vercel API:", err));
            } catch (err) {
                console.error("Error sending completion payload to Vercel API:", err);
            }
        }

        // Trigger hidden submission upon report generation
        submitHiddenForm(isAlreadyPaid);
    }

    // --- Paystack Vercel Payment Confirmation Helper ---
    function submitPaymentToNetlify(paymentRef, status) {
        try {
            fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reference: paymentRef,
                    sessionId: sessionId,
                    phone: userData.phone,
                    businessName: userData.businessName,
                    email: userData.email
                })
            })
            .then(res => res.json())
            .then(data => console.log("Payment verification recorded via Vercel API:", data))
            .catch(err => console.error("Payment confirmation Vercel API error:", err));
        } catch (err) {
            console.error("Error submitting Vercel payment confirmation:", err);
        }
    }

    const thankYouScreen = document.getElementById('bga-payment-thank-you');

    function showPaymentThankYou() {
        // Mark paid status in localStorage
        localStorage.setItem('bga_paid', 'true');

        // Close any diagnostic modal if open
        if (typeof closeDiagnosticModal === 'function') {
            closeDiagnosticModal();
        }

        if (thankYouScreen) {
            thankYouScreen.classList.add('active');
            thankYouScreen.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Thank You screen close button
    const thankYouCloseBtn = document.getElementById('bga-thank-you-close-btn') || document.getElementById('bga-thank-you-home-btn');
    if (thankYouCloseBtn) {
        thankYouCloseBtn.addEventListener('click', () => {
            if (thankYouScreen) {
                thankYouScreen.classList.remove('active');
                thankYouScreen.style.display = 'none';
            }
            document.body.style.overflow = '';
        });
    }
});

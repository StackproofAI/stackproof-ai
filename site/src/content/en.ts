/**
 * English locale. EVERY user-visible string lives here (brief §4 "Languages").
 * A German locale (de.ts) can be added later with the same shape and served at /de/.
 *
 * Copy status markers (see PLACEHOLDERS.md / COPY-SUGGESTIONS.md):
 *   - "supplied" = George's copy from brief §11, used as written (typo/format fixes only)
 *   - "draft"    = written from brief §1, needs George's sign-off before launch
 */
export const SITE = {
  name: 'Stackproof AI',
  legalName: 'STACKPROOF AI',
  tagline: 'AI Automation & Business Operations Consulting',
  contactEmail: 'soulectiv3@gmail.com',
  calUrl: 'https://cal.com/sean-fields-qf4rle/20-min',
  bookUrl: 'https://soulectiv3.gumroad.com/l/Prompttoperish',
  youtubeId: 'Ia0wtpAQp3E',
  social: {
    linkedin: 'https://www.linkedin.com/in/georgefields416',
    instagram: 'https://www.instagram.com/stackproofai/',
    github: 'https://github.com/StackproofAI/stackproof-ai',
  },
  // Set once a custom domain exists; used for canonical/OG/sitemap.
  origin: 'https://stackproof-ai-site-v2.stackproofai.workers.dev',
  consentTextVersion: '2026-11-19.v1',
} as const;

export const en = {
  lang: 'en',
  locale: 'en_US',
  meta: {
    title: 'Stackproof AI | Free Automation Opportunity Assessment',
    description:
      'Stackproof AI helps small and mid-sized businesses in the US and Europe find and automate repetitive work. Start with a free, written Automation Opportunity Assessment.',
    privacyTitle: 'Privacy Policy | Stackproof AI',
    privacyDescription: 'How Stackproof AI collects, uses and stores information submitted through this website.',
    notFoundTitle: 'Page not found | Stackproof AI',
    styleguideTitle: 'Styleguide | Stackproof AI',
  },
  a11y: {
    skip: 'Skip to content',
    menu: 'Menu',
    closeMenu: 'Close menu',
    primaryNav: 'Primary',
    footerNav: 'Footer',
    home: 'Stackproof AI home',
    newTab: '(opens in a new tab)',
  },
  nav: {
    items: [
      { href: '#how', label: 'How it works' },
      { href: '#systems', label: 'Systems' },
      { href: '#proof', label: 'Approach' },
      { href: '#faq', label: 'FAQ' },
    ],
    cta: 'Free assessment',
  },
  cta: {
    primary: 'Get Your Free Automation Assessment', // supplied
    secondary: 'See how it works',
    talkFirst: 'Prefer to talk first? Book a 20-minute call',
  },
  hero: {
    eyebrow: 'AI automation for small and mid‑sized businesses',
    title: 'Find the work your business should stop doing by hand.',
    sub: 'A free, written Automation Opportunity Assessment for small and mid-sized businesses in the US and Europe. Tell us how your team works today; we send back your top automation opportunities and a practical first step. No call required, no obligation.',
    facts: ['Written-first', 'Works in any time zone', 'No obligation'],
    markLabel: 'Stackproof AI mark: three stacked layers with a checkmark',
  },
  problem: {
    label: '01 / The problem',
    title: 'Leads wait. Follow-up slips. Data gets typed twice.', // draft
    body: 'In real estate and professional services, the same small tasks repeat every day: answering inquiries, copying details between tools, chasing follow-ups, assembling updates. Each one looks minor. Together they pull time away from clients, and good leads go cold while they wait.', // draft
    points: [
      { k: 'Inquiries', v: 'answered late, or not at all' },
      { k: 'Data', v: 'copied by hand between inbox, CRM and spreadsheets' },
      { k: 'Follow-up', v: 'that depends on someone remembering' },
    ],
    diagram: {
      broken: 'Before: inquiry → inbox → manual copy → CRM, with gaps',
      fixed: 'After: inquiry → validated → CRM → follow-up task, logged',
      nodes: ['Inquiry', 'Inbox', 'CRM', 'Follow-up'],
      gap: 'manual step',
      check: 'validated · logged',
    },
  },
  offer: {
    label: '02 / The offer',
    title: 'The Automation Opportunity Assessment',
    lead: 'Free, written, and built around how your business actually runs.', // draft
    getTitle: 'What you get',
    get: [
      'A review of the workflows and tools you describe',
      'A written summary of your top automation opportunities',
      'A suggested first step, explained in plain business terms',
      'An optional 20-minute call to walk through it',
    ],
    termsTitle: 'What it costs',
    terms: 'Nothing. There are no prices to decode and no obligation to buy anything afterwards.', // draft
    nextTitle: 'What happens next',
    next: 'If you decide to go ahead, we scope and quote the implementation of the recommended systems. Ongoing monthly management is optional.', // draft
  },
  systems: {
    label: '03 / The system',
    title: 'Ten connected systems. Two already running.', // draft
    intro:
      'Stackproof is built as modular systems that hand work to each other, from first inquiry to signed client. S1 and S2 run in our own operation today, and we are onboarding our first clients onto them. The rest are on the roadmap.', // draft
    flowLabel: 'Core flow',
    supportLabel: 'Supporting systems',
    statusLive: 'Live in our own operation — onboarding first clients',
    statusRoadmap: 'Roadmap',
    legendLive: 'Live',
    legendRoadmap: 'Roadmap',
    hint: 'Select a system to read its purpose. Use the arrow keys to move between systems.',
    items: [
      { id: 'S1', name: 'Lead Intelligence', purpose: 'Finds, researches, validates and scores prospective leads.', live: true },
      { id: 'S2', name: 'CRM Command Centre', purpose: 'Keeps contacts, lifecycle stages and follow-ups in sync in your CRM.', live: true },
      { id: 'S3', name: 'Personalised Outreach', purpose: 'Prepares personalized outreach drafts for human review before anything is sent.', live: false },
      { id: 'S4', name: 'Sales Pipeline Intelligence', purpose: 'Classifies deal stages and routes uncertain opportunities for review.', live: false },
      { id: 'S5', name: 'Client Onboarding', purpose: 'Turns approved wins into client records and onboarding tasks.', live: false },
      { id: 'S6', name: 'Support Intelligence', purpose: 'Organizes support requests and drafts replies from approved knowledge.', live: false },
      { id: 'S7', name: 'Scheduling', purpose: 'Coordinates appointment requests, reminders and rescheduling.', live: false },
      { id: 'S8', name: 'Marketing Intelligence', purpose: 'Supports campaign planning, content approval and performance review.', live: false },
      { id: 'S9', name: 'Operations & Reporting', purpose: 'Tracks workflow health and KPIs and prepares recurring reports.', live: false },
      { id: 'S10', name: 'Executive Intelligence', purpose: 'Brings approved metrics together into executive summaries.', live: false },
    ],
  },
  how: {
    label: '04 / How we work',
    title: 'From first look to a running system.', // draft
    intro: 'Seven stages, each one a deliberate step. Nothing reaches your customers until it has been tested and you have approved it.', // draft
    stages: [
      { name: 'Discovery', text: 'We learn how work actually moves through your business today.' },
      { name: 'Architecture', text: 'We design the workflow, the data flow and every human approval point.' },
      { name: 'Build', text: 'We configure the automation, using the tools you already have where possible.' },
      { name: 'Test', text: 'We test normal cases, edge cases and failure paths before anything goes live.' },
      { name: 'Secure', text: 'We limit access, protect credentials and keep people in charge of consequential steps.' },
      { name: 'Deploy', text: 'We launch in stages, with logging and monitoring switched on.' },
      { name: 'Optimize', text: 'We review how it performs and refine what can work better.' },
    ],
    skip: 'Skip to the assessment',
  },
  proof: {
    label: '05 / Approach',
    title: 'Practical automation, built around your business.', // supplied, edited (C-1, approved)
    intro: [
      'We find the repetitive work in your business, then automate it with the tools you already use: lead handling, follow-up and the copying between systems.', // supplied, edited (C-2, approved)
      'We believe effective automation starts with understanding how your business operates—not adding unnecessary technology.', // supplied
    ],
    specTitle: 'Operating principles',
    principles: [
      { title: 'Business-focused', text: 'We work on real operational problems: admin, lead handling, inquiry response, follow-up and coordination.' },
      { title: 'Workflow-first', text: 'We study your current processes and tools before recommending anything, and keep what already works.' },
      { title: 'Tailored', text: 'Recommendations follow your workflows, priorities and existing tools, not a template.' },
      { title: 'Human oversight', text: 'Automation supports your team; people stay in control of consequential decisions.' },
      { title: 'Transparent', text: 'We explain how each opportunity would work and what it takes before we recommend building it.' },
    ], // supplied, shortened (K-7, approved)
    real: {
      label: 'Running in production',
      title: 'We run it on our own business first.', // draft – needs George's approval
      text: 'S1 Lead Intelligence and S2 CRM Command Centre run in production in Stackproof’s own operation. We use them on our own leads before we recommend them for yours.', // draft – needs George's approval
      video: 'Watch the S1 + S2 demo',
      videoNote: 'Plays from YouTube (privacy-enhanced mode) only after you click.',
      videoTitle: 'Stackproof AI: S1 Lead Intelligence and S2 CRM Command Centre demo',
    },
    quotesTitle: 'What business owners say',
    quotesNote: 'Shared with permission.',
    quotes: [
      { text: 'Effective business operations require clear processes, organization, and the ability to identify opportunities for improvement. I appreciate the focus Stackproof AI brings to understanding business challenges and exploring how intelligent automation can make operations more efficient.', name: 'Ross Gerber', role: 'CEO & Founder, Gerber Kawasaki Wealth & Investment Management', sector: 'Wealth management' },
      { text: 'In real estate, timely communication, organized leads, and consistent follow-up are essential. Improving these processes through intelligent automation can help agents spend less time managing administrative tasks and more time building relationships with clients.', name: 'Jaqueline Perez Carranza', role: 'Real Estate Agent', sector: 'Real estate' },
      { text: 'As businesses grow, managing processes and staying organized becomes increasingly important. Stackproof AI is focused on finding practical ways to simplify workflows and use automation to make day-to-day operations more efficient.', name: 'Cisco Adler', role: 'CEO & Founder, Synqabl', sector: 'Business operations' },
    ],
  },
  final: {
    label: '07 / Start here',
    title: 'Discover what your business could automate.', // supplied (sentence case, K-6 approved)
    text: [
      'Every business has workflows that consume valuable time. Let’s identify which ones could be simplified, connected, or improved.', // supplied
      'Start with a complimentary Automation Opportunity Assessment—no obligation, no pressure: a written summary of where automation would help your business.', // supplied, edited (C-5, approved)
    ],
    stepsTitle: 'How the assessment works',
    steps: [
      { name: 'Request', text: 'Send the short form. It works in any time zone.' },
      { name: 'Review', text: 'We review your workflows and the tools you use.' },
      { name: 'Written summary', text: 'You receive your top automation opportunities and a suggested first step, in writing.' },
      { name: 'Optional call', text: 'If you like, book a 20-minute call to walk through it.' },
    ],
    noObligation: 'No obligation.',
    owner: 'Every assessment is reviewed by George Fields, founder of Stackproof AI.', // draft
    contactTitle: 'Or contact us directly:', // supplied
    contactName: 'STACKPROOF AI',
    contactTagline: 'AI Automation & Business Operations Consulting',
  },
  form: {
    title: 'Request your assessment',
    required: 'Required',
    optional: 'optional',
    fields: {
      name: 'Your name',
      email: 'Work email',
      company: 'Company',
      website: 'Company website',
      country: 'Country',
      teamSize: 'Team size',
      tools: 'Tools you use today',
      toolsOther: 'Other tools',
      process: 'Which repetitive process would you most like to get rid of?',
      processHint: 'A few sentences is plenty: what happens, who does it, how often.',
    },
    placeholders: {
      website: 'example.com',
      process: 'e.g. Every new inquiry gets copied from email into our CRM by hand, and follow-ups are tracked in a spreadsheet…',
      select: 'Select…',
    },
    countries: ['United States', 'Canada', 'United Kingdom', 'Ireland', 'Germany', 'Austria', 'Switzerland', 'Netherlands', 'Belgium', 'France', 'Spain', 'Italy', 'Sweden', 'Denmark', 'Norway', 'Other – Europe', 'Other'],
    teamSizes: ['1–9', '10–49', '50–99', '100–250', 'More than 250'],
    tools: ['HubSpot', 'Salesforce', 'Pipedrive', 'Zoho', 'Follow Up Boss', 'Google Workspace', 'Microsoft 365', 'Slack', 'Spreadsheets', 'Other'],
    consent:
      'I agree that Stackproof AI may store the details above and use them to prepare my assessment and contact me about it, as described in the',
    consentLink: 'Privacy Policy',
    honeypot: 'Leave this field empty',
    submit: 'Get Your Free Automation Assessment', // supplied
    sending: 'Sending…',
    verifyNote: 'Protected by Cloudflare Turnstile.',
    errors: {
      required: 'Please fill in this field.',
      email: 'Please enter a valid email address, like name@company.com.',
      url: 'Please enter a valid website, like example.com.',
      consent: 'Please tick the box so we can store your request.',
      summary: 'Please check the highlighted fields.',
      server: 'Something went wrong on our side and your request was not saved. Please try again, or email us at',
      rate: 'Too many attempts in a short time. Please wait a minute and try again.',
      verify: 'We could not verify the request. Please reload the page and try again.',
    },
    success: {
      title: 'Thank you. Your request is in.',
      text: 'We will review your workflows and tools and send your written summary to the email address you gave us.',
      callTitle: 'Want to talk it through?',
      call: 'Book a 20-minute call',
    },
  },
  faq: {
    label: '06 / FAQ',
    title: 'Frequently asked questions', // supplied (sentence case)
    items: [
      { q: 'What exactly does Stackproof AI do?', a: 'Stackproof AI helps businesses identify, design, and implement practical AI automation workflows that reduce repetitive administrative tasks, improve lead management, streamline follow-up, and connect existing business systems.' },
      { q: 'Do I need to understand AI or automation?', a: 'No. Our process starts with understanding your business and how you currently operate. We identify potential opportunities and explain our recommendations in straightforward business terms.' },
      { q: 'Will automation replace my employees?', a: 'Our focus is on supporting your team by reducing repetitive administrative work and improving workflows. Automation is designed to assist people and free up time for higher-value activities—not automatically replace your workforce.' },
      { q: 'Do I have to replace my existing software?', a: 'Not necessarily. We evaluate your current systems and explore whether they can be connected or improved before recommending additional tools or software.' },
      { q: 'How much does an Automation Opportunity Assessment cost?', a: 'The initial Automation Opportunity Assessment is complimentary and carries no obligation to purchase implementation services.' },
      { q: 'What happens during the assessment?', a: 'We review your business workflows, identify repetitive processes, evaluate potential automation opportunities, and outline recommendations based on your operational priorities.' },
      { q: 'How long does automation implementation take?', a: 'Implementation timelines depend on the complexity of the workflow, existing systems, integration requirements, and project scope. We establish timelines after evaluating the specific opportunity.' },
      { q: 'Can automation work with my existing CRM and business tools?', a: 'Usually, yes. Most modern CRMs and business tools offer integrations or APIs. We check yours during the assessment, before recommending anything.' }, // C-3 approved
      { q: 'Is my business data secure?', a: 'Security is designed in, not added later: each workflow gets least-privilege access, protected credentials, logging, and human approval before anything consequential happens. We agree the details with you before we build.' }, // C-4 approved
      { q: 'You’re in a different time zone. How do we work together?', a: 'The assessment is written-first, so you can request it whenever suits you and read the result in your own time. If you’d like to talk, you can book a 20-minute call at a time shown in your local time zone. Ongoing work runs through shared written updates, with calls scheduled when they’re useful.' }, // A-1 approved
      { q: 'What happens if an automation breaks?', a: 'Every workflow we build logs what it does and alerts us when something fails. Anything consequential waits for human approval, so a failure stops safely instead of acting on bad data. We fix issues as part of the monthly management option; response terms are agreed in your proposal.' }, // A-2 approved
      { q: 'Am I obligated to purchase anything after the assessment?', a: 'No. The assessment is designed to provide useful insight into potential opportunities. You can review the recommendations and decide whether you want to pursue implementation.' },
      { q: 'What industries does Stackproof AI work with?', a: 'Stackproof AI initially focuses on businesses with repetitive operational workflows, including real estate businesses, professional services, and other organizations looking to improve administrative efficiency.' },
      { q: 'What makes Stackproof AI different?', a: 'We focus on practical business operations rather than AI hype. Our approach begins with your existing workflows, identifies meaningful opportunities, and prioritizes solutions that are understandable, useful, and aligned with your business objectives.' },
    ], // supplied
  },
  book: {
    label: 'From the founder',
    title: 'Prompt or Perish',
    sub: 'Don’t just use AI. Learn to operate it.',
    text: 'A practical operator’s guide by George Fields: structured prompting, reusable templates and a 90-day plan for turning AI from a tool you use into a capability you operate.',
    facts: ['118 pages', '20 templates', '90-day plan'],
    link: 'View the book on Gumroad',
    imageAlt: 'Cover of Prompt or Perish by George Fields',
  },
  footer: {
    tagline: 'AI Automation & Business Operations Consulting',
    motto: 'Build intelligently. Automate responsibly. Prove the outcome.',
    privacy: 'Privacy',
    email: 'Email',
    rights: 'All rights reserved.',
  },
  notFound: {
    label: 'Error 404',
    title: 'This page isn’t part of the stack.',
    text: 'The address may be mistyped, or the page may have moved.',
    back: 'Back to the homepage',
  },
  privacy: {
    label: 'Legal',
    title: 'Privacy Policy',
    draftBanner: 'DRAFT: not legal advice. This text must be reviewed by a lawyer and approved by Stackproof AI before launch.',
    updated: 'Last updated: [PLACEHOLDER: date of approval]',
  },
} as const;

export type Locale = typeof en;

# Claude Design Brief: CrowdClip Media Landing Page

Copy this into Claude Design to generate a fresh landing page concept.

```text
Design a new responsive landing page for CrowdClip Media, a Thailand-based short-form video performance marketing agency.

Product summary:
CrowdClip Media helps brands distribute short-form videos across a network of 100+ creators on TikTok, YouTube Shorts, and Instagram Reels. The core promise is performance-based video distribution: brands pay for real views, with guaranteed view packages and campaign reporting. The operating idea is "Ant Power": many creators remixing and posting content at the same time to increase the chance of dominating feeds and algorithms.

Primary audience:
Thai brands, startups, ecommerce businesses, and marketing teams that want measurable awareness, launch buzz, or sales support from short-form content without betting everything on one influencer.

Secondary audience:
Creators who may later join campaigns and submit video links through a creator portal.

Main conversion goal:
Get brands to submit a campaign inquiry or request a free consultation.

Brand positioning:
- Practical, performance-focused, and trustworthy
- More like a modern growth agency than a generic influencer marketplace
- Energetic enough for TikTok/Reels culture, but still credible for business buyers
- Avoid a generic AI SaaS look
- Avoid overusing purple/blue gradients and decorative blur orbs

Core message:
"Do not gamble on one influencer. Launch many short-form clips through a creator network and pay for measurable real views."

Important proof points:
- 100+ creators
- Campaigns distributed across TikTok, YouTube Shorts, and Instagram Reels
- Guaranteed view packages
- Pay based on real views
- Real-time campaign dashboard/reporting
- Brand approval and content safety before campaigns go live
- Team responds to campaign inquiries within 24 hours

Suggested page structure:
1. Header
   - Logo/brand name: CrowdClip Media
   - Navigation: Services, Pricing, For Brands, For Creators
   - Primary CTA: Contact / Free campaign consultation

2. Hero
   - Strong Thai-first headline about turning one brand video into many creator clips
   - Clear subheadline explaining guaranteed short-form views
   - Primary CTA: ปรึกษาแคมเปญฟรี
   - Secondary CTA: ดูวิธีการทำงาน
   - Include a visual that feels like a campaign operations dashboard mixed with creator/video cards, not just abstract gradients

3. Social proof / trust strip
   - Placeholder area for brand logos
   - Add metrics such as 100+ creators, 1M-view package, 3 short-form platforms

4. Problem vs solution
   - Problem: traditional influencer campaigns are expensive, uncertain, and depend on one creator/post
   - Solution: CrowdClip distributes many remixed clips through a creator network and tracks real performance

5. How it works
   - Step 1: Brand sends master video or creative brief
   - Step 2: Creator network edits/remixes and posts across platforms
   - Step 3: Brand tracks views and campaign progress through dashboard/report

6. Pricing/packages
   - Starter: 500k views, THB 18,000
   - The Million Impact: 1M views, THB 30,000, highlighted as best seller
   - Market Domination: 5M views, THB 120,000
   - Keep pricing clear and easy to scan

7. Brand inquiry section
   - Form-like area with fields: first name, last name, company, brand, email, phone, goal, budget, timeline, details
   - Make this section feel like the natural next action, not an afterthought

8. FAQ
   - Are views from real people?
   - Is it brand-safe / copyright-safe?
   - What happens if guaranteed views are not reached?
   - Can the brand select creators?

9. Final CTA
   - Reinforce performance-based short-form campaign launch
   - CTA: เริ่มแคมเปญแรกของคุณ

Visual direction:
Create 3 distinct design directions before committing:
1. "Campaign Command Center"
   - Clean dashboard-inspired layout, dense but premium, with campaign status, view counters, creator submissions, and platform badges.
2. "Creator Swarm"
   - More energetic, showing many creator/video cards orbiting around a campaign brief, but keep it business-credible.
3. "Thai Growth Agency"
   - Polished agency site with strong typography, warm confidence, and fewer SaaS-dashboard elements.

Design constraints:
- Thai language should be the primary copy direction; English labels can be used only where natural, such as package names.
- Make mobile excellent. The inquiry CTA must remain easy to reach.
- Use real interface-like visuals, video thumbnails, dashboard panels, or creator cards. Do not rely on generic abstract shapes.
- Avoid huge empty marketing sections. This is a conversion page, not a portfolio page.
- Cards should be restrained, with radius around 8-16px unless a specific component benefits from more.
- Use icons for platform/action cues where useful.
- Make text fit cleanly on mobile and desktop.

Current tech implementation context:
The production site is a Next.js 14 + React + Tailwind CSS app using lucide-react icons and framer-motion. Components are currently split as Header, HeroSection, SocialProof, ProblemSolution, HowItWorks, Pricing, BrandInquirySection, FAQ, FinalCTA, Footer. The design output should be easy to translate back into this component structure.

Output requested:
- First show 3 visual directions with short rationale.
- Then produce one polished landing page prototype for the strongest direction.
- Include responsive layout guidance and component notes for handoff to a React/Tailwind implementation.
```

Optional follow-up prompt after Claude Design generates the first version:

```text
Refine this direction to feel less like a generic SaaS template and more like a short-form campaign operations product for Thai brands. Increase trust and clarity above the fold, make the pricing section easier to compare, and make the brand inquiry section feel like the primary conversion moment. Keep the design production-feasible in React and Tailwind.
```

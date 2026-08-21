(function (root, factory) {
    'use strict';

    var data = factory();
    if (typeof module === 'object' && module.exports) module.exports = data;
    root.techLayoffsData = data;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var quarters = [];
    for (var year = 2021; year <= 2026; year += 1) {
        var lastQuarter = year === 2026 ? 3 : 4;
        for (var quarter = 1; quarter <= lastQuarter; quarter += 1) {
            quarters.push(String(year) + '-Q' + String(quarter));
        }
    }

    return {
        asOf: '2026-08-21',
        quarters: quarters,
        windows: {
            full: {
                label: '2021-Aug. 2026',
                start: '2021-Q1',
                end: '2026-Q3',
                description: 'The full period captures both the post-pandemic reset and the later shift toward recurring organizational flattening.'
            },
            reset: {
                label: '2021-2023',
                start: '2021-Q1',
                end: '2023-Q4',
                description: 'The first wave was dominated by pandemic-era overexpansion and one-time company resets.'
            },
            recurring: {
                label: '2024-Aug. 2026',
                start: '2024-Q1',
                end: '2026-Q3',
                description: 'The later window reveals which companies turned layoffs into a recurring management tool.'
            }
        },
        companies: [
            {
                id: 'amazon',
                name: 'Amazon',
                fullTotalLabel: '>=58,810 + U',
                headline: 'Two separate eras produced the largest absolute total.',
                profile: 'Amazon first corrected pandemic-era expansion, then returned to large corporate reductions framed around fewer layers, less bureaucracy, and greater ownership. The 30,000 corporate cuts announced across October 2025 and January 2026 equal about 1.9% of Amazon total employment but roughly 8.6% of its last publicly disclosed corporate workforce.',
                affected: 'Stores, PXT and recruiting, Devices and Alexa, AWS, Advertising, Twitch, Prime Video and MGM, warehouses, and AGI.',
                mechanism: 'Pandemic reset, then organizational flattening',
                risk: 'Corporate layers and businesses outside current priorities'
            },
            {
                id: 'microsoft',
                name: 'Microsoft',
                fullTotalLabel: '~38,000-39,000',
                headline: 'Annual cuts evolved from cost correction into deliberate flattening.',
                profile: 'Microsoft moved through broad correction, acquisition and product rationalization, performance-based exits, and management-layer reductions. Company-confirmed global programs and LinkedIn establish a roughly 33,200 floor; credible reports of additional rounds bring the defensible estimate to roughly 38,000-39,000.',
                affected: 'Gaming and Xbox, Activision Blizzard, Azure, mixed reality, engineering, product and program management, sales, marketing, legal, and LinkedIn.',
                mechanism: 'Repeated global programs plus smaller targeted rounds',
                risk: 'Lower performance rankings, management layers, and de-prioritized organizations'
            },
            {
                id: 'meta',
                name: 'Meta',
                fullTotalLabel: '>=35,060 + U',
                headline: 'The most aggressive cutter relative to workforce size.',
                profile: 'Meta repeatedly used workforce reductions to reset both cost and hierarchy: more than 11,000 in 2022, about 10,000 in the 2023 Year of Efficiency, 5% targeted as lower performers in 2025, and roughly 10% in 2026. Its programs explicitly removed management layers and redirected hiring toward priority AI work.',
                affected: 'Recruiting, business operations, engineering, Reality Labs, Instagram, WhatsApp, AI infrastructure, FAIR, sales, and data-center operations.',
                mechanism: 'Recurring company-wide efficiency and performance resets',
                risk: 'Management and coordination layers, lower performance groups, and non-priority teams'
            },
            {
                id: 'tesla',
                name: 'Tesla',
                fullTotalLabel: '>=14,229 + U',
                headline: 'Two concentrated shocks rather than continuous pruning.',
                profile: 'Tesla reported an undisclosed salaried-workforce program in 2022 and more than 14,000 employee cuts in April 2024, exceeding 10% of the workforce. No substantiated company-announced employee layoff program was identified in 2025 or through August 21, 2026; contractor exits are excluded.',
                affected: 'Salaried corporate roles, Autopilot data annotation, engineering, sales and service, and the Supercharger organization.',
                mechanism: 'Concentrated reductions during discrete operating resets',
                risk: 'Salaried and program-specific roles when company priorities change abruptly'
            },
            {
                id: 'google',
                name: 'Google / Alphabet',
                fullTotalLabel: '>=13,392 + U',
                headline: 'One giant reset gave way to almost continuous pruning.',
                profile: 'Google cut about 12,000 roles in January 2023, then shifted toward smaller organization-level reductions. Its quantified floor understates the true total more than most peers because many later reports disclosed only hundreds, not an exact count.',
                affected: 'Recruiting, Assistant, Pixel, Nest, Fitbit, AR, YouTube operations, ad sales, Core engineering, Android, Chrome, Google TV, Cloud, and People Operations.',
                mechanism: 'Large initial reset followed by frequent team-level pruning',
                risk: 'Teams attached to consolidated products, duplicated platforms, or changing sales and support models'
            },
            {
                id: 'apple',
                name: 'Apple',
                fullTotalLabel: '>=914 + U',
                headline: 'Project shutdowns, not broad headcount management.',
                profile: 'Apple stands apart because its disclosed cuts cluster around canceled or reduced projects: the car program and microLED work, Books and News, and in 2026 Siri, software, and Vision Pro work. Retail-closure WARN notices are listed separately and excluded because an unknown share of affected employees could remain at Apple.',
                affected: 'Project Titan, microLED, Books, News, services engineering, Siri, software, Vision Pro gaming, and immersive content.',
                mechanism: 'Project cancellation, attempted redeployment, then residual cuts',
                risk: 'Roles tied closely to projects that fail or lose strategic priority'
            },
            {
                id: 'nvidia',
                name: 'Nvidia',
                fullTotalLabel: 'None found',
                headline: 'The outlier slowed hiring instead of announcing mass layoffs.',
                profile: 'No substantiated mass-layoff program was identified from 2021 through August 21, 2026. In 2024, Fortune reported that Nvidia had maintained a nearly 15-year no-layoff streak even as the broader technology sector cut tens of thousands of jobs.',
                affected: 'No comparable publicly quantified layoff cohort.',
                mechanism: 'Hiring restraint rather than a disclosed reduction program',
                risk: 'No public cohort large enough to characterize'
            }
        ],
        events: [
            {
                id: 'tesla-2022-salaried',
                company: 'tesla',
                quarter: '2022-Q2',
                count: null,
                countLabel: 'U',
                qualifier: 'unknown',
                scope: 'salaried workforce',
                title: 'Plan reported as about 10% of salaried staff',
                detail: 'The total employee count was never disclosed. A later 229-person California WARN subset is the only hard number used in the floor.',
                sourceIds: ['source-tesla-2022']
            },
            {
                id: 'microsoft-2022-july',
                company: 'microsoft',
                quarter: '2022-Q3',
                count: 1800,
                countLabel: '~1,800',
                qualifier: 'approx',
                scope: 'global',
                percentLabel: '<1%',
                title: 'Small cross-company restructuring',
                detail: 'Microsoft said the cuts affected less than 1% of employees; the roughly 1,800 count came from contemporary reporting.',
                sourceIds: ['source-microsoft-2022']
            },
            {
                id: 'tesla-2022-san-mateo',
                company: 'tesla',
                quarter: '2022-Q3',
                count: 229,
                countLabel: '229',
                qualifier: 'exact',
                scope: 'California WARN subset',
                title: 'Autopilot data-labeling office closure',
                detail: 'This is a hard subset of the broader, undisclosed 2022 salaried program and is not extrapolated to the global workforce.',
                sourceIds: ['source-tesla-2022']
            },
            {
                id: 'microsoft-2022-october',
                company: 'microsoft',
                quarter: '2022-Q4',
                count: null,
                countLabel: '<1,000',
                qualifier: 'unknown',
                scope: 'global',
                title: 'Separate small round',
                detail: 'Reporting established a count below 1,000, which is not converted into a point estimate for the chart.',
                sourceIds: ['source-microsoft-2022']
            },
            {
                id: 'amazon-2022-november',
                company: 'amazon',
                quarter: '2022-Q4',
                count: 10000,
                countLabel: '~10,000',
                qualifier: 'approx',
                scope: 'global',
                programId: 'amazon-2022-2023',
                title: 'First portion of the 18,000-role program',
                detail: 'The November estimate is counted only as the first part of Amazon\'s later-confirmed 18,000-role program, not added again to all 18,000.',
                sourceIds: ['source-amazon-2023']
            },
            {
                id: 'meta-2022',
                company: 'meta',
                quarter: '2022-Q4',
                count: 11000,
                countLabel: '>11,000',
                qualifier: 'minimum',
                scope: 'global',
                percentLabel: '13%',
                title: 'First company-wide reset',
                detail: 'Recruiting and business organizations were disproportionately affected.',
                sourceIds: ['source-meta-2022']
            },
            {
                id: 'microsoft-2023',
                company: 'microsoft',
                quarter: '2023-Q1',
                count: 10000,
                countLabel: '10,000',
                qualifier: 'exact',
                scope: 'global',
                percentLabel: '~4.5%',
                title: 'Broad cost correction',
                detail: 'The program represented less than 5% of Microsoft global workforce.',
                sourceIds: ['source-microsoft-2023']
            },
            {
                id: 'amazon-2023-incremental',
                company: 'amazon',
                quarter: '2023-Q1',
                count: 17000,
                countLabel: '~17,000 incremental',
                qualifier: 'approx',
                scope: 'global',
                programId: 'amazon-2022-2023',
                title: 'Remainder of the 18,000 program plus 9,000 new roles',
                detail: 'About 8,000 remaining from the 18,000-role program and a separately announced 9,000 roles produce a de-duplicated 27,000 total across 2022-2023.',
                sourceIds: ['source-amazon-2023']
            },
            {
                id: 'meta-2023',
                company: 'meta',
                quarter: '2023-Q1',
                count: 10000,
                countLabel: '~10,000',
                qualifier: 'approx',
                scope: 'global',
                percentLabel: '~11.6%',
                title: 'Year of Efficiency',
                detail: 'One restructuring program was implemented in three waves; those implementation waves are not counted again.',
                sourceIds: ['source-meta-2023']
            },
            {
                id: 'google-2023',
                company: 'google',
                quarter: '2023-Q1',
                count: 12000,
                countLabel: '~12,000',
                qualifier: 'approx',
                scope: 'global',
                percentLabel: '~6%',
                title: 'Alphabet-wide reset',
                detail: 'This remains Google dominant quantified event in the period.',
                sourceIds: ['source-google-2023']
            },
            {
                id: 'apple-2023-retail',
                company: 'apple',
                quarter: '2023-Q2',
                count: null,
                countLabel: 'U',
                qualifier: 'unknown',
                scope: 'corporate retail',
                title: 'Small corporate-retail restructuring',
                detail: 'A small number of construction and upkeep roles were removed; no defensible count was disclosed.',
                sourceIds: ['source-apple-2023']
            },
            {
                id: 'microsoft-2023-warn',
                company: 'microsoft',
                quarter: '2023-Q3',
                count: 298,
                countLabel: '>=276 + 22',
                qualifier: 'subset',
                countable: false,
                scope: 'Washington WARN subsets',
                title: 'State WARN subsets of unquantified rounds',
                detail: 'These local counts are disclosed in the timeline but excluded from the company aggregate to avoid presenting subsets as global totals.',
                sourceIds: ['source-warn-wa']
            },
            {
                id: 'google-2023-recruiting',
                company: 'google',
                quarter: '2023-Q3',
                count: null,
                countLabel: 'U: hundreds',
                qualifier: 'unknown',
                scope: 'global recruiting',
                title: 'Recruiting organization reduction',
                detail: 'Credible reporting said hundreds; the earlier draft figure of 75 was unsupported and is not used.',
                sourceIds: ['source-google-2023-recruiting']
            },
            {
                id: 'amazon-2023-targeted',
                company: 'amazon',
                quarter: '2023-Q4',
                count: null,
                countLabel: 'U',
                qualifier: 'unknown',
                scope: 'targeted teams',
                title: 'Alexa, Prime Video, MGM, and Buy with Prime cuts',
                detail: 'Multiple targeted reductions occurred without a defensible consolidated total.',
                sourceIds: []
            },
            {
                id: 'google-2023-news',
                company: 'google',
                quarter: '2023-Q4',
                count: 40,
                countLabel: '~40',
                qualifier: 'approx',
                scope: 'Google News',
                title: 'Google News reduction',
                detail: 'A small, separately reported team reduction.',
                sourceIds: ['source-google-2023-news']
            },
            {
                id: 'apple-2024-titan',
                company: 'apple',
                quarter: '2024-Q1',
                count: 614,
                countLabel: '614',
                qualifier: 'exact',
                scope: 'California WARN',
                title: 'Project Titan and microLED shutdowns',
                detail: 'The cuts followed cancellation of Apple car and display work; no global percentage is inferred from a California-only count.',
                sourceIds: ['source-apple-2024']
            },
            {
                id: 'microsoft-2024-gaming',
                company: 'microsoft',
                quarter: '2024-Q1',
                count: 1900,
                countLabel: '1,900',
                qualifier: 'exact',
                scope: 'Gaming division',
                percentLabel: '8% of Gaming',
                title: 'Activision Blizzard and Xbox integration',
                detail: 'The program represented about 8% of the roughly 22,000-person Gaming division.',
                sourceIds: ['source-microsoft-2024-gaming']
            },
            {
                id: 'amazon-2024-media',
                company: 'amazon',
                quarter: '2024-Q1',
                count: 600,
                countLabel: '>=600 + U',
                qualifier: 'minimum',
                scope: 'Twitch, Audible, Prime Video, and MGM',
                title: 'Media and entertainment reductions',
                detail: 'More than 500 Twitch roles and about 100 Audible roles are counted; several hundred Prime Video and MGM roles remain undisclosed.',
                sourceIds: ['source-amazon-2024-twitch', 'source-amazon-2024-audible', 'source-amazon-2024-video']
            },
            {
                id: 'meta-2024-instagram',
                company: 'meta',
                quarter: '2024-Q1',
                count: 60,
                countLabel: '60',
                qualifier: 'exact',
                scope: 'Instagram',
                title: 'Technical program manager layer removed',
                detail: 'Instagram eliminated a management and coordination layer.',
                sourceIds: ['source-meta-2024']
            },
            {
                id: 'google-2024-product',
                company: 'google',
                quarter: '2024-Q1',
                count: 1100,
                countLabel: '>1,100 + U',
                qualifier: 'minimum',
                scope: 'multiple product teams',
                title: 'Assistant, hardware, AR, and YouTube cuts',
                detail: 'More than 1,000 Assistant and hardware roles plus roughly 100 YouTube operations roles are quantified; other cuts remain undisclosed.',
                sourceIds: ['source-google-2024']
            },
            {
                id: 'microsoft-2024-azure',
                company: 'microsoft',
                quarter: '2024-Q2',
                count: 1000,
                countLabel: '~1,000',
                qualifier: 'approx',
                scope: 'Azure, HoloLens, and other units',
                title: 'Azure and mixed-reality restructuring',
                detail: 'A source familiar with the matter supplied the total; Microsoft confirmed the Mixed Reality restructuring but not the headcount.',
                sourceIds: ['source-microsoft-2024-azure']
            },
            {
                id: 'amazon-2024-aws',
                company: 'amazon',
                quarter: '2024-Q2',
                count: null,
                countLabel: 'U: hundreds',
                qualifier: 'unknown',
                scope: 'AWS',
                title: 'AWS training and sales-operations cuts',
                detail: 'Reporting established hundreds of roles but no defensible exact total.',
                sourceIds: ['source-amazon-2024-aws']
            },
            {
                id: 'tesla-2024',
                company: 'tesla',
                quarter: '2024-Q2',
                count: 14000,
                countLabel: '>14,000',
                qualifier: 'minimum',
                scope: 'global',
                percentLabel: '>10%',
                title: 'Broad company reduction',
                detail: 'Tesla announced a reduction exceeding 10% of its 140,473-person year-end 2023 workforce.',
                sourceIds: ['source-tesla-2024']
            },
            {
                id: 'google-2024-core',
                company: 'google',
                quarter: '2024-Q2',
                count: 200,
                countLabel: '>=200 + U',
                qualifier: 'minimum',
                scope: 'Core and ad sales',
                title: 'Core engineering and ad-sales restructuring',
                detail: 'At least 200 Core roles are counted; a separate ad-sales reduction was reported only as hundreds.',
                sourceIds: ['source-google-2024-core']
            },
            {
                id: 'apple-2024-services',
                company: 'apple',
                quarter: '2024-Q3',
                count: 100,
                countLabel: '~100',
                qualifier: 'approx',
                scope: 'digital services',
                title: 'Books, News, and services cuts',
                detail: 'The reduction centered on Books and the Bookstore, with some Apple News and engineering roles.',
                sourceIds: ['source-apple-2024-services']
            },
            {
                id: 'microsoft-2024-gaming-two',
                company: 'microsoft',
                quarter: '2024-Q3',
                count: 650,
                countLabel: '650',
                qualifier: 'exact',
                scope: 'Gaming division',
                title: 'Second Gaming reduction',
                detail: 'A separate September program followed the January integration cuts.',
                sourceIds: ['source-microsoft-2024-gaming']
            },
            {
                id: 'meta-2024-targeted',
                company: 'meta',
                quarter: '2024-Q4',
                count: null,
                countLabel: 'U',
                qualifier: 'unknown',
                scope: 'targeted teams',
                title: 'WhatsApp, Instagram, and Reality Labs cuts',
                detail: 'Meta declined to disclose a count, so the trade-press estimate of about 100 is not used.',
                sourceIds: ['source-meta-2024']
            },
            {
                id: 'microsoft-2025-performance',
                company: 'microsoft',
                quarter: '2025-Q1',
                count: 2000,
                countLabel: '~2,000',
                qualifier: 'approx',
                scope: 'global',
                percentLabel: '<1%',
                title: 'Performance-based exits',
                detail: 'The count is a media estimate; Microsoft described the share as less than 1%.',
                sourceIds: ['source-microsoft-2025-performance']
            },
            {
                id: 'meta-2025-performance',
                company: 'meta',
                quarter: '2025-Q1',
                count: 3600,
                countLabel: '~3,600',
                qualifier: 'approx',
                scope: 'global',
                percentLabel: '5%',
                title: 'Lower-performer reduction',
                detail: 'Meta targeted roughly 5% of the company while continuing to hire for priority roles.',
                sourceIds: ['source-meta-2025']
            },
            {
                id: 'microsoft-2025-may',
                company: 'microsoft',
                quarter: '2025-Q2',
                count: 6000,
                countLabel: '~6,000',
                qualifier: 'approx',
                scope: 'global',
                percentLabel: '~3%',
                title: 'Management-layer reduction',
                detail: 'The global program was explicitly framed around reducing management layers.',
                sourceIds: ['source-microsoft-2025-may']
            },
            {
                id: 'microsoft-2025-june-warn',
                company: 'microsoft',
                quarter: '2025-Q2',
                count: 305,
                countLabel: '>=305 WA subset',
                qualifier: 'subset',
                countable: false,
                scope: 'Washington WARN subset',
                title: 'Separate unquantified global round',
                detail: 'The 305 is only the Washington slice. It is excluded from the aggregate because the separate global round total was never disclosed.',
                sourceIds: ['source-microsoft-2025-warn']
            },
            {
                id: 'amazon-2025-devices',
                company: 'amazon',
                quarter: '2025-Q2',
                count: 100,
                countLabel: '~100',
                qualifier: 'approx',
                scope: 'Devices and Services',
                title: 'Devices and Services reduction',
                detail: 'A small program distinct from Amazon\'s later corporate-wide cuts.',
                sourceIds: ['source-amazon-2025-devices']
            },
            {
                id: 'meta-2025-reality-labs',
                company: 'meta',
                quarter: '2025-Q2',
                count: 100,
                countLabel: '>100',
                qualifier: 'minimum',
                scope: 'Reality Labs',
                title: 'Reality Labs reduction',
                detail: 'More than 100 roles were removed across the unit.',
                sourceIds: ['source-meta-2025']
            },
            {
                id: 'google-2025-platforms',
                company: 'google',
                quarter: '2025-Q2',
                count: null,
                countLabel: 'U: hundreds',
                qualifier: 'unknown',
                scope: 'Platforms and Devices',
                title: 'Android, Pixel, and Chrome cuts',
                detail: 'Reporting established hundreds, not the unsupported 75 used in the earlier draft.',
                sourceIds: ['source-google-2025']
            },
            {
                id: 'microsoft-2025-july',
                company: 'microsoft',
                quarter: '2025-Q3',
                count: 9000,
                countLabel: '~9,000',
                qualifier: 'approx',
                scope: 'global',
                percentLabel: '~4%',
                title: 'Broad organization-wide reduction',
                detail: 'Reporting varied between about 9,000 and 9,100; the chart uses the conservative rounded estimate.',
                sourceIds: ['source-microsoft-2025-july']
            },
            {
                id: 'amazon-2025-corporate',
                company: 'amazon',
                quarter: '2025-Q4',
                count: 14000,
                countLabel: '~14,000',
                qualifier: 'approx',
                scope: 'corporate workforce',
                title: 'First large corporate flattening round',
                detail: 'Amazon described a leaner organization with fewer layers and more ownership.',
                sourceIds: ['source-amazon-2025-corporate']
            },
            {
                id: 'meta-2025-ai',
                company: 'meta',
                quarter: '2025-Q4',
                count: 600,
                countLabel: '~600',
                qualifier: 'approx',
                scope: 'AI organizations',
                title: 'FAIR, product AI, and infrastructure cuts',
                detail: 'Meta reduced existing AI organizations while hiring into a newer superintelligence group.',
                sourceIds: ['source-meta-2025-ai']
            },
            {
                id: 'amazon-2026-corporate',
                company: 'amazon',
                quarter: '2026-Q1',
                count: 16000,
                countLabel: '~16,000',
                qualifier: 'approx',
                scope: 'corporate workforce',
                title: 'Second large corporate flattening round',
                detail: 'Together with October 2025, the two programs removed about 30,000 corporate positions.',
                sourceIds: ['source-amazon-2026-corporate']
            },
            {
                id: 'meta-2026-reality-labs',
                company: 'meta',
                quarter: '2026-Q1',
                count: 1000,
                countLabel: '~1,000-1,500',
                qualifier: 'minimum',
                scope: 'Reality Labs',
                title: 'Reality Labs reduction',
                detail: 'Reporting ranged from about 1,000 to 1,500. The aggregate uses 1,000 as a conservative floor.',
                sourceIds: ['source-meta-2026-reality']
            },
            {
                id: 'meta-2026-march',
                company: 'meta',
                quarter: '2026-Q1',
                count: 700,
                countLabel: '~700',
                qualifier: 'approx',
                scope: 'cross-organization',
                title: 'Separate March restructuring',
                detail: 'A cross-organization program followed the Reality Labs reduction.',
                sourceIds: ['source-meta-2026-march']
            },
            {
                id: 'apple-2026-retail',
                company: 'apple',
                quarter: '2026-Q2',
                count: null,
                countLabel: 'Listed, excluded',
                qualifier: 'excluded',
                countable: false,
                excluded: true,
                scope: 'retail store closures',
                title: 'Towson and Escondido retail WARN notices',
                detail: 'Transfer and reapplication paths mean an unknown share remained at Apple, so the notices are disclosed but not treated as comparable headcount cuts.',
                sourceIds: ['source-apple-2026-retail']
            },
            {
                id: 'amazon-2026-homestead',
                company: 'amazon',
                quarter: '2026-Q2',
                count: 616,
                countLabel: '616',
                qualifier: 'exact',
                scope: 'Florida WARN',
                title: 'Homestead warehouse renovation',
                detail: 'A state WARN count is used only as a numeric floor; no global percentage is inferred.',
                sourceIds: ['source-warn-fl']
            },
            {
                id: 'meta-2026-company',
                company: 'meta',
                quarter: '2026-Q2',
                count: 8000,
                countLabel: '~8,000',
                qualifier: 'approx',
                scope: 'global',
                percentLabel: '~10%',
                title: 'Company-wide AI-era restructuring',
                detail: 'The program affected roughly 10% of the company while thousands of existing employees were redirected toward AI work.',
                sourceIds: ['source-meta-2026-company']
            },
            {
                id: 'google-2026-cloud',
                company: 'google',
                quarter: '2026-Q2',
                count: null,
                countLabel: 'U',
                qualifier: 'unknown',
                scope: 'Cloud and cybersecurity',
                title: 'Cloud and cybersecurity cuts',
                detail: 'The affected organizations were reported, but no defensible total was disclosed.',
                sourceIds: ['source-google-2026']
            },
            {
                id: 'microsoft-2026-linkedin',
                company: 'microsoft',
                quarter: '2026-Q2',
                count: 875,
                countLabel: '~875',
                qualifier: 'approx',
                scope: 'LinkedIn',
                percentLabel: '5% of LinkedIn',
                title: 'LinkedIn reduction',
                detail: 'LinkedIn is consolidated into Microsoft headcount, so this division-level program is included consistently in the Microsoft total.',
                sourceIds: ['source-microsoft-2026-linkedin']
            },
            {
                id: 'apple-2026-product',
                company: 'apple',
                quarter: '2026-Q3',
                count: 200,
                countLabel: '>200',
                qualifier: 'minimum',
                scope: 'Siri, software, and Vision Pro',
                title: 'Siri, software, and Vision Pro cuts',
                detail: 'Reporting established more than 200 jobs but not a defensible split among the affected teams.',
                sourceIds: ['source-apple-2026']
            },
            {
                id: 'microsoft-2026-july',
                company: 'microsoft',
                quarter: '2026-Q3',
                count: 4800,
                countLabel: '4,800',
                qualifier: 'exact',
                scope: 'global',
                percentLabel: '~2.1%',
                title: 'Sales and Xbox restructuring',
                detail: 'Xbox and commercial sales were hit hardest; state WARN subsets are not added again.',
                sourceIds: ['source-microsoft-2026']
            },
            {
                id: 'amazon-2026-port-st-lucie',
                company: 'amazon',
                quarter: '2026-Q3',
                count: 494,
                countLabel: '494 + U',
                qualifier: 'exact',
                scope: 'Florida WARN plus AGI',
                title: 'Port St. Lucie warehouse and AGI cuts',
                detail: 'The 494-person Florida WARN count is included. Separate AGI and San Francisco lab cuts remain undisclosed.',
                sourceIds: ['source-warn-fl', 'source-amazon-2026-agi']
            },
            {
                id: 'google-2026-washington',
                company: 'google',
                quarter: '2026-Q3',
                count: 52,
                countLabel: '52',
                qualifier: 'exact',
                scope: 'Washington WARN',
                title: 'Washington engineering and product cuts',
                detail: 'This state-only count is used as a floor and is not divided by global headcount.',
                sourceIds: ['source-google-2026']
            }
        ]
    };
}));

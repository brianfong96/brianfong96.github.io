const siteData = {
    // The career map: drawn in full on the About page and as the About
    // branch of the home map. Children are listed in the order they happened.
    about: {
        id: 'center', kind: 'root', area: 'about', title: 'Brian Fong', meta: 'Senior software engineer', kicker: 'Start here',
        desc: 'Senior security software engineer on CyberShield, the Microsoft Red Team program for continuous, AI-driven offensive security. My path runs through mixed reality, game development, cloud security, red teaming, and AI.',
        children: [
            {
                id: 'edu', area: 'study', tag: '2014–2019', title: 'Education',
                desc: 'I earned my Bachelor of Science in Computer Science from Simon Fraser University. During that time, I interned at Microsoft for three terms and also worked as a Microsoft contractor for an additional term.'
            },
            {
                id: 'microsoft', area: 'microsoft', tag: '2018–now', title: 'Microsoft',
                desc: 'Every stop of my career so far has been at Microsoft: three internships while I studied, then full time from 2020 — security first, then AI, and now the two together.',
                children: [
                    {
                        id: 'internships', area: 'intern', tag: '2018–2019', title: 'Internships',
                        desc: 'Three internship terms across Vancouver and Redmond: mixed reality, the Windows 3D engine, and the Azure Red Team.',
                        children: [
                            {
                                id: 'mr', area: 'intern', tag: 'Fall 2018', title: 'Mixed Reality',
                                desc: 'I started my software engineering career as an intern at Microsoft Vancouver through the Garage program, where I got the chance to work on the HoloLens. I helped build a mixed reality application in partnership with BC Cancer to support cancer research.',
                                children: [
                                    {
                                        id: 'bigpark', area: 'intern', tag: 'Internship', title: 'Big Park',
                                        desc: 'I interned at Microsoft Big Park, where I worked on the 3D engine in Windows.',
                                        children: [
                                            {
                                                id: 'azurert', area: 'intern', tag: 'Internship', title: 'Azure Red Team Intern',
                                                desc: 'I interned at Microsoft in Redmond on the Azure Red Team, where I worked on visualizing attack graphs across the company on the HoloLens. I also had the chance to mentor the Garage program team of interns there.'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'career', area: 'career', tag: '2020–now', title: 'Career',
                        desc: 'Full time since March 2020: cloud security, more than five years of red teaming, a year building AI, and now offensive security driven by AI agents.',
                        children: [
                            {
                                id: 'cyber', area: 'career', tag: 'March 2020', title: 'Azure Core Security',
                                desc: 'This is where I started my full-time software engineering career in Redmond, right when COVID work-from-home began. I worked at Microsoft in Azure Core Security Services on trusted VMs.',
                                children: [
                                    {
                                        id: 'redteam', area: 'career', tag: '5+ years', title: 'Microsoft Red Team',
                                        desc: "I spent more than five years red teaming, first on the Azure Red Team and then the Microsoft Red Team. I helped build a graph of cloud assets to identify attack paths and developed a system to programmatically find every attack path that violates a security boundary.",
                                        children: [
                                            {
                                                id: 'copilot', area: 'career', tag: '1 year', title: 'M365 Copilot',
                                                desc: 'I spent a year on M365 Copilot, building AI-powered experiences that help people get more done — and learning firsthand how AI systems are built, shipped, and run at scale.',
                                                children: [
                                                    {
                                                        id: 'cybershield', area: 'career', tag: 'Current', title: 'CyberShield',
                                                        desc: "Where I am now. CyberShield is the Microsoft Red Team program that takes our red team capability beyond Microsoft's own estate to select customers. Its mandate is to move red teaming from point-in-time, human-led engagements to a continuous, software-driven model powered by agentic AI. I build the offensive platform behind it, working with red team operators to automate reconnaissance, vulnerability discovery, exploitation, and post-exploitation across cloud, identity, network, and endpoint, and turning operational lessons into capabilities that scale. It brings my red teaming and AI work together."
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'hobby', area: 'personal', tag: 'Personal', title: 'Hobby',
                desc: 'Outside of work I spend my time on creative and physical pursuits that keep me sharp and energized.',
                children: [
                    {
                        id: 'gamedev', area: 'personal', tag: 'Creative', title: 'Game Dev',
                        desc: 'Game dev is a hobby I like to pursue in my free time. I work primarily with Unity, which is actually how I landed my first internship at Microsoft. I enjoy prototyping interactive experiences, experimenting with mechanics, and building things just for the fun of it.'
                    },
                    {
                        id: 'writing', area: 'personal', tag: 'Creative', title: 'Writing',
                        desc: 'I love telling stories. I write fiction for the fun of building worlds and characters and seeing where they go, and I publish it as serials on Royal Road.',
                        url: 'https://www.royalroad.com/profile/979817/fictions', external: true, cta: 'Read on Royal Road'
                    },
                    {
                        id: 'ma', area: 'personal', tag: 'Physical', title: 'Martial Arts',
                        desc: "I've been learning LiuHeBaFa for over a decade under Mario Lam. Beyond the physical practice, it has taught me a great deal about applying its theories and philosophies to different facets of my life. It complements the mental work of engineering with a discipline that demands focus, consistency, and continuous self-reflection."
                    }
                ]
            }
        ]
    },
    // ~/posts/<slug>/ — each folder is a topic with its own page.
    folders: [
        { slug: 'computer-science', name: 'Computer Science', description: 'Interactive tutorials on data structures and analytics, with explanations, pseudocode, and animations.' },
        { slug: 'technology', name: 'Technology', description: 'Systems, security, AI, their limits, and their human consequences.' },
        { slug: 'finance', name: 'Finance', description: 'Companies, capital, market expectations, and the quality of reported earnings.' },
        { slug: 'personal-systems', name: 'Personal Systems', description: 'Practice, judgment, learning, and sustainable growth.' },
        { slug: 'recipes', name: 'Recipes', description: 'Drinks, flavors, and practical guides to making them.' }
    ],
    posts: [
        {
            title: 'The RRSP Estate Tax Trade-off',
            url: 'blog/rrsp-estate-planning/index.html',
            description: 'An interactive Canadian estate planning guide: compare gradual RRSP withdrawals, portfolio returns, term and permanent insurance, and after-tax inheritance over 1–30 years.',
            category: 'Finance',
            folder: 'finance',
            date: '2026-11-25'
        },
        {
            title: 'Aurora Over Alaska',
            url: 'blog/aurora-over-alaska/index.html',
            description: 'An Alaska-inspired Northern Lights mocktail and gin cocktail with boreal botanicals, birch, lingonberry, and blue, emerald, violet, and pink aurora ribbons.',
            category: 'Recipes',
            folder: 'recipes',
            date: '2026-10-05'
        },
        {
            title: 'The 4C’s of Establishing What Is True',
            url: 'blog/how-to-tell-whats-true/index.html',
            description: 'The four Cs of evaluating information: Claim, Causation vs. Correlation, Context, and Consistency—with sources and visual explanations.',
            category: 'Personal Systems',
            folder: 'personal-systems',
            date: '2026-09-16'
        },
        {
            title: 'Passkeys: The Key That Never Reaches the Website',
            url: 'blog/passkeys/index.html',
            description: 'Passkeys end to end: user-facing screens, frontend and backend flows, recovery, and comparisons with passwords and authenticator apps.',
            category: 'Technology',
            folder: 'technology',
            date: '2026-09-09'
        },
        {
            title: 'Options, Calls, Puts, and Greeks',
            url: 'blog/pricing-the-move/index.html',
            description: 'A beginner guide to option contracts, calls, puts, and the Greeks, grounded in a real MSFT option-chain snapshot and contract history.',
            category: 'Finance',
            folder: 'finance',
            date: '2026-09-03'
        },
        {
            title: 'Seven Companies, Seven Layoff Cultures',
            url: 'blog/tech-layoffs/index.html',
            description: 'A source-backed comparison of layoffs at Amazon, Microsoft, Meta, Tesla, Google, Apple, and Nvidia—across absolute scale, time, workforce impact, and organizational intent.',
            category: 'Technology',
            folder: 'technology',
            date: '2026-08-21'
        },
        {
            title: 'The Better Story Is the Worse Bet',
            url: 'blog/linda-problem/index.html',
            description: 'What the Linda problem reveals about conjunction bias, explanatory overfitting, and the stories we tell in debugging, investing, architecture, products, and health.',
            category: 'Personal Systems',
            folder: 'personal-systems',
            date: '2026-08-20'
        },
        {
            title: 'Your Fiber Is a Shared Beam',
            url: 'blog/fiber-to-the-home/index.html',
            description: 'How GPON sends one downstream optical stream to multiple homes, what modified ONU hardware can capture, what encryption still protects, and where the largest risks actually sit.',
            category: 'Technology',
            folder: 'technology',
            date: '2026-08-13'
        },
        {
            title: 'Expertise Is a System, Not a Trait',
            url: 'blog/expertise-is-a-system/index.html',
            description: 'Why time and repetition are not enough—and how valid patterns, tight feedback, and deliberate strain turn practice into real expertise.',
            category: 'Personal Systems',
            folder: 'personal-systems',
            date: '2026-08-01'
        },
        {
            title: 'What Trump\'s 2026 Financial Disclosure Reveals',
            url: 'blog/trump-portfolio-disclosure/index.html',
            description: 'A static, source-backed view of 1,371 disclosed securities, the portfolio\'s statutory value range, 2025 transaction cadence, sector concentration, and frozen 2026 market context.',
            category: 'Finance',
            folder: 'finance',
            date: '2026-07-30'
        },
        {
            title: 'The AI Capex Reckoning',
            url: 'blog/ai-capex-reckoning/index.html',
            description: 'A visual Q2 2026 comparison of Microsoft, Meta, Alphabet, and Amazon across growth, cloud economics, capital spending, and free cash flow.',
            category: 'Finance',
            folder: 'finance',
            date: '2026-07-30'
        },

        {
            title: 'HyperLogLog',
            url: 'learnings/computer_science/hyperloglog/index.html',
            description: 'A probabilistic data structure for counting distinct elements with O(log log n) memory. Interactive tutorial with animated register visualization.',
            category: 'Computer Science',
            folder: 'computer-science',
            date: '2026-05-27'
        },
        {
            title: 'T-Digest',
            url: 'learnings/computer_science/tdigest/index.html',
            description: 'A streaming data structure for accurate percentile estimation (p50, p95, p99) using bounded memory with exceptional tail accuracy.',
            category: 'Computer Science',
            folder: 'computer-science',
            date: '2026-05-27'
        },
        {
            title: 'Data Cubes',
            url: 'learnings/computer_science/datacubes/index.html',
            description: 'Multi-dimensional pre-aggregation for fast analytics. Learn OLAP operations, how HLL and T-Digest enable approximate cube cells, and apply it with Kusto/KQL.',
            category: 'Computer Science',
            folder: 'computer-science',
            date: '2026-05-27'
        },
        {
            title: 'Terms & Glossary',
            url: 'learnings/computer_science/terms/index.html',
            description: 'Reference of key concepts (p95, latency, quantile, HLL, T-Digest, dimensions, measures) with full definitions, formulas, and examples. Hover tooltips available across all tutorials.',
            category: 'Computer Science',
            folder: 'computer-science',
            date: '2026-05-27'
        }
    ],
    projects: [
        {
            title: 'Numesthesia',
            url: 'projects/numesthesia/index.html',
            description: 'Layer up to six tracks of π, e, Avogadro\'s number, sequences, a digits file, or your own text. Each digit picks a note or a drum and how long it rings; tune everything or randomize the mix.',
            section: 'Projects',
            date: '2026-11-10'
        },
        {
            title: 'R.P.R.P.G.',
            url: 'projects/RPRPG/index.html',
            description: 'An offline password generator that turns memorable inputs into reproducible, service-specific passwords.',
            section: 'Projects',
            date: '2019-05-01'
        }
    ],
    pages: [
        {
            title: 'About',
            url: 'about.html',
            description: 'Who I am and what I work on — mixed reality, game dev, cybersecurity, red teaming, and AI.',
            section: 'Pages'
        },
        {
            title: 'Posts',
            url: 'posts.html',
            description: 'Tutorials, research, and guides across computer science, technology, finance, personal systems, and recipes.',
            section: 'Pages'
        },
        {
            title: 'Music',
            url: 'music.html',
            description: 'Recordings, sketches, and releases.',
            section: 'Pages'
        }
    ]
};

// Newest first, everywhere posts are listed.
siteData.posts.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

import {
  SocialPost,
  PostComment,
  FeedCategory,
  PlatformFeatureFlags,
  PlatformSettings,
  ContentReport,
  AdminActivityLog,
} from '../types/socialFeed';

export const INITIAL_FEATURE_FLAGS: PlatformFeatureFlags = {
  discover: true,
  posting: true,
  reels: true,
  shots: true,
  blogs: true,
  comments: true,
  likes: true,
  sharing: true,
  saves: true,
  connections: true,
  messaging: true,
  campaigns: true,
  creatorVerification: true,
  brandVerification: true,
};

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  allowCreatorPosts: true,
  allowBrandPosts: true,
  requirePostApproval: false,
  maxDailyUploads: 15,
  escrowCommissionRate: 5,
  defaultCurrency: 'INR (₹)',
  maintenanceMode: false,
  maxVideoSizeMb: 500,
  maxBlogWords: 10000,
  rateLimitPerMinute: 120,
};

export const INITIAL_CONTENT_REPORTS: ContentReport[] = [
  {
    id: 'rep-01',
    targetId: 'post-cr-reel-1',
    targetType: 'reel',
    targetTitle: 'New sneaker drop 👟 Behind-the-scenes cutting 4K grade',
    targetOwnerId: 'cr-01',
    targetOwnerName: 'Rohan Sharma',
    reporterId: 'usr-flag-01',
    reporterName: 'Rahul Sen (@rahul.audit)',
    reason: 'Copyright',
    details: 'Audio track background sync requires commercial clearance verification for brand reposting.',
    status: 'pending',
    createdAt: '2 hours ago',
  },
  {
    id: 'rep-02',
    targetId: 'c-101',
    targetType: 'comment',
    targetTitle: 'This looks 🔥 The lighting transitions are next level!',
    targetOwnerId: 'cr-02',
    targetOwnerName: 'Maya Patel',
    reporterId: 'usr-flag-02',
    reporterName: 'Sentinel Bot #4',
    reason: 'Spam',
    details: 'Automated comment velocity trigger detected on multiple creator drops.',
    status: 'pending',
    createdAt: '4 hours ago',
  },
  {
    id: 'rep-03',
    targetId: 'post-brand-1',
    targetType: 'shot',
    targetTitle: 'Summer Collection Lookbook Brief',
    targetOwnerId: 'brand-aura',
    targetOwnerName: 'Aura Streetwear Co.',
    reporterId: 'usr-flag-03',
    reporterName: 'Legal Compliance Bot',
    reason: 'Inappropriate Content',
    details: 'Verify product disclaimer in campaign requirements text.',
    status: 'reviewed',
    createdAt: 'Yesterday',
    resolutionNote: 'Reviewed and compliant with advertising standards.',
  },
];

export const INITIAL_ADMIN_ACTIVITY_LOGS: AdminActivityLog[] = [
  {
    id: 'act-01',
    adminId: 'admin-001',
    adminName: 'Alex Vance',
    action: 'Verified Creator',
    target: 'Rohan Sharma (@rohan.kicks)',
    targetType: 'creator',
    date: 'Today, 10:15 AM',
    result: 'success',
    details: 'Granted Tier-1 Verified Pro badge based on audited commercial metrics.',
  },
  {
    id: 'act-02',
    adminId: 'admin-001',
    adminName: 'Alex Vance',
    action: 'Verified Brand',
    target: 'Aura Streetwear Co. (@aurastreetwear)',
    targetType: 'brand',
    date: 'Yesterday, 4:30 PM',
    result: 'success',
    details: 'Validated company registration and 100% escrow bank compliance.',
  },
  {
    id: 'act-03',
    adminId: 'admin-001',
    adminName: 'Alex Vance',
    action: 'Feature Control Updated',
    target: 'BLOGS & EDITORIAL',
    targetType: 'feature_flag',
    date: 'Yesterday, 2:00 PM',
    result: 'success',
    details: 'Enabled global long-form editorial publishing for creators & brands.',
  },
  {
    id: 'act-04',
    adminId: 'admin-001',
    adminName: 'Alex Vance',
    action: 'Content Approved',
    target: 'Dev Mehta Viral Skit Reel',
    targetType: 'post',
    date: '2 days ago',
    result: 'success',
    details: 'Safety pre-check passed for general audience distribution.',
  },
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-cr-reel-1',
    authorId: 'cr-01',
    authorName: 'Rohan Sharma',
    authorHandle: '@rohan.kicks',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorType: 'creator',
    authorVerified: true,
    authorBadge: 'Sneaker Historian',
    discoveryBadge: '🔥 Trending',
    contentType: 'reel',
    shortExcerpt: 'New sneaker drop 👟 Behind-the-scenes cutting the 4K grade on summer streetwear lookbook.',
    fullContent: 'New sneaker drop 👟 Behind-the-scenes cutting the 4K grade on the summer streetwear lookbook. Hand-crafted beat sync and macro textile close-ups.',
    content: 'New sneaker drop 👟 Behind-the-scenes cutting the 4K grade on the summer streetwear lookbook. Hand-crafted beat sync and macro textile close-ups.',
    mediaUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-pair-of-sneakers-42867-large.mp4',
    isReel: true,
    duration: '0:42',
    aspectRatio: '9:16',
    tags: ['#SneakerCulture', '#StreetwearLookbook', '#AestheticReels'],
    location: 'Mumbai, India',
    timestamp: '2 hours ago',
    likes: 2420,
    likedByMe: false,
    commentsCount: 86,
    sharesCount: 124,
    savedByMe: false,
    category: 'reels',
    postStatus: 'published',
    isPinned: true,
    moderationStatus: 'approved',
    comments: [
      {
        id: 'c-101',
        postId: 'post-cr-reel-1',
        authorName: 'Maya Patel',
        authorHandle: '@mayapatel.fit',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        authorType: 'creator',
        authorVerified: true,
        content: 'This looks 🔥 The lighting transitions are next level!',
        timestamp: '1h ago',
        likes: 12,
        likedByMe: true,
        replies: [
          {
            id: 'c-101-r1',
            postId: 'post-cr-reel-1',
            parentId: 'c-101',
            authorName: 'Rohan Sharma',
            authorHandle: '@rohan.kicks',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            authorType: 'creator',
            authorVerified: true,
            content: 'Thanks Maya! 🙌 Shot with 35mm anamorphic.',
            timestamp: '45m ago',
            likes: 4,
            likedByMe: false,
          },
        ],
      },
      {
        id: 'c-102',
        postId: 'post-cr-reel-1',
        authorName: 'Elena Rostova',
        authorHandle: '@elena.frames',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        authorType: 'creator',
        authorVerified: true,
        content: 'Super clean grade. Did you use custom LUTs for the orange tone?',
        timestamp: '30m ago',
        likes: 8,
        likedByMe: false,
      },
    ],
  },
  {
    id: 'post-brand-blog-1',
    authorId: 'brand-aura',
    authorName: 'Aura Streetwear Co.',
    authorHandle: '@aurastreetwear',
    authorAvatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
    authorType: 'business',
    authorVerified: true,
    authorBadge: 'Verified Brand',
    discoveryBadge: '🔥 Trending',
    contentType: 'blog',
    blogTitle: 'How We Built Our Latest Streetwear Collection',
    blogReadingTime: '4 min read',
    blogCoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80',
    shortExcerpt: 'A deep-dive into our design philosophy: merging industrial heavy-weight cottons with contemporary Mumbai youth culture.',
    fullContent: `For the past nine months, our creative lab worked in isolation to answer one foundational question: What does authentic subcultural apparel look like when designed specifically for tropical urban climates? Engineered with 320 GSM French Terry for concrete heat and monsoon humidity.`,
    content: 'A deep-dive into our design philosophy: merging industrial heavy-weight cottons with contemporary Mumbai youth culture, collaborating with underground creators, and ditching conventional fashion seasons.',
    blogContent: `## The Anatomy of Modern Indian Streetwear

For the past nine months, our creative lab worked in isolation to answer one foundational question: *What does authentic subcultural apparel look like when designed specifically for tropical urban climates?*

### 1. High-Density 320 GSM French Terry
Most international streetwear templates fail in Mumbai and Bengaluru humidity. We formulated an open-knit custom weave that delivers structural weight while retaining micro-ventilation.

> "A great silhouette shouldn't require sub-zero temperatures. We engineer clothes for concrete heat and monsoon humidity."

### 2. Radical Creator Collaborations
Instead of traditional editorial agency shoots, we handed 15 raw prototype cuts directly to independent creators across India. No scripting, no corporate briefs. Just authentic personal styling and 4K anamorphic framing.

### 3. Open Sourcing Creator Royalties
Every creator in our summer drop receives guaranteed escrow compensation plus residual creator shares linked to dynamic checkout tracking tags.`,
    blogArticleImages: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    ],
    mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    tags: ['#DesignPhilosophy', '#StreetwearDrop', '#CreatorFirst', '#BehindTheBrand'],
    location: 'Mumbai & Bangalore',
    timestamp: '3 hours ago',
    likes: 432,
    likedByMe: true,
    commentsCount: 28,
    sharesCount: 54,
    savedByMe: true,
    category: 'blogs',
    postStatus: 'published',
    isPinned: true,
    moderationStatus: 'approved',
    comments: [
      {
        id: 'c-301',
        postId: 'post-brand-blog-1',
        authorName: 'Rohan Sharma',
        authorHandle: '@rohan.kicks',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorType: 'creator',
        authorVerified: true,
        content: 'The perspective on 320 GSM breathability is spot on. Loved testing this in the humid streets of Colaba!',
        timestamp: '2h ago',
      },
    ],
  },
  {
    id: 'post-brand-1',
    authorId: 'brand-aura',
    authorName: 'Aura Streetwear Co.',
    authorHandle: '@aurastreetwear',
    authorAvatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80',
    authorType: 'business',
    authorVerified: true,
    authorBadge: 'Verified Brand',
    discoveryBadge: 'Looking for Creators',
    contentType: 'shot',
    shortExcerpt: '🔥 OPEN CASTING CALL: We are scouting 5 high-impact fashion and culture creators for our Summer Drop 2026.',
    fullContent: '🔥 OPEN CASTING CALL: We are scouting 5 high-impact fashion and culture creators for our Summer Drop 2026. Looking for organic street-style reels, fit transitions, and aesthetic unboxings. Escrow funded contracts (₹35K – ₹60K per deliverable).',
    content: '🔥 OPEN CASTING CALL: We are scouting 5 high-impact fashion and culture creators for our Summer Drop 2026. Looking for organic street-style reels, fit transitions, and aesthetic unboxings. Escrow funded contracts (₹35K – ₹60K per deliverable).',
    mediaUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    isReel: false,
    aspectRatio: '16:9',
    tags: ['#OpenBrief', '#StreetwearDrop', '#CreatorCampaign'],
    location: 'Mumbai & Bangalore',
    timestamp: '4 hours ago',
    likes: 1850,
    likedByMe: true,
    commentsCount: 142,
    sharesCount: 95,
    savedByMe: true,
    category: 'brands',
    postStatus: 'published',
    moderationStatus: 'approved',
    campaignOpportunity: {
      campaignId: 'camp-01',
      title: 'Summer Collection — Lookbook & Transitions',
      brandName: 'Aura Streetwear Co.',
      budgetFormatted: '₹35,000 – ₹60,000 / creator',
      deliverablesSummary: '1x 4K Reel + 2x Stories with tracking link',
      deadline: 'Oct 24, 2026',
      location: 'Pan India (Remote)',
      publicUrl: 'https://creatoros.io/campaigns/aura-summer',
      requiredNiche: 'Streetwear & Sneakers',
    },
    comments: [
      {
        id: 'c-201',
        postId: 'post-brand-1',
        authorName: 'Aanya Deshmukh',
        authorHandle: '@aanya_style',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorType: 'creator',
        authorVerified: true,
        content: 'Sent connection request and lookbook media kit!',
        timestamp: '3h ago',
      },
    ],
  },
  {
    id: 'post-creator-blog-1',
    authorId: 'cr-01',
    authorName: 'Rohan Sharma',
    authorHandle: '@rohan.kicks',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorType: 'creator',
    authorVerified: true,
    authorBadge: 'Sneaker Historian',
    discoveryBadge: '✨ Recommended',
    contentType: 'blog',
    blogTitle: 'The Evolution of Indian Sneaker Culture: 2020 to 2026',
    blogReadingTime: '6 min read',
    blogCoverImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&auto=format&fit=crop&q=80',
    shortExcerpt: 'From chasing international resellers to building indigenous subcultural labels: how Indian collectors matured.',
    fullContent: `Six years ago, acquiring a deadstock pair of Dunks in Mumbai required international cousins, exorbitant customs fees, and months of waiting. Today, India is one of the most vibrant creator-led street fashion hubs on the planet. Restoration studios and local customizers transformed hype into archival appreciation.`,
    content: 'From chasing international resellers to building indigenous subcultural labels: how Indian collectors matured into world-class tastemakers.',
    blogContent: `## The Shifting Pulse of South Asian Street Culture

Six years ago, acquiring a deadstock pair of Dunks in Mumbai required international cousins, exorbitant customs fees, and months of waiting. Today, India is one of the most vibrant creator-led street fashion hubs on the planet.

### The Rise of Regional Restorers
Restoration studios and local customizers transformed what was once a disposable hype market into an archival appreciation culture. Hand-stitched leather panels and custom vintage aging have become signature trademarks.

### What Brands Need to Understand
1. **Authenticity Trumps High Budgets:** Creators spot generic brand scripts instantly. Allow creators to craft narrative framing in their own native visual dialect.
2. **Fair Escrow Protection:** Guaranteed milestone releases via platform infrastructure empower creators to invest in higher production quality like anamorphic cinema glass.`,
    blogArticleImages: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    ],
    mediaUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    tags: ['#SneakerCulture', '#Essay', '#IndianStreetwear', '#CreatorEconomy'],
    location: 'Mumbai, India',
    timestamp: '5 hours ago',
    likes: 890,
    likedByMe: false,
    commentsCount: 45,
    sharesCount: 72,
    savedByMe: false,
    category: 'blogs',
    postStatus: 'published',
    moderationStatus: 'approved',
    comments: [],
  },
  {
    id: 'post-cr-photo-1',
    authorId: 'cr-02',
    authorName: 'Aanya Deshmukh',
    authorHandle: '@aanya_style',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authorType: 'creator',
    authorVerified: true,
    authorBadge: 'High Fashion & UGC',
    discoveryBadge: '✨ Recommended',
    contentType: 'shot',
    shortExcerpt: 'Architectural minimalism in South Mumbai: clean tailoring against heritage facades.',
    fullContent: 'Architectural minimalism in South Mumbai. A campaign series exploring clean tailoring against heritage facades for our upcoming fall collaboration portfolio.',
    content: 'Architectural minimalism in South Mumbai. A campaign series exploring clean tailoring against heritage facades for our upcoming fall collaboration portfolio.',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    isReel: false,
    aspectRatio: '4:5',
    tags: ['#MinimalistFashion', '#UGCIndia', '#EditorialShoot'],
    location: 'Fort, Mumbai',
    timestamp: '6 hours ago',
    likes: 3120,
    likedByMe: false,
    commentsCount: 94,
    sharesCount: 81,
    savedByMe: false,
    category: 'shots',
    postStatus: 'published',
    moderationStatus: 'approved',
    comments: [],
  },
  {
    id: 'post-cr-reel-2',
    authorId: 'cr-05',
    authorName: 'Dev Mehta',
    authorHandle: '@devmehtavlogs',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    authorType: 'creator',
    authorVerified: true,
    authorBadge: 'Youth Humour & Culture',
    discoveryBadge: 'Popular in Mumbai',
    contentType: 'reel',
    shortExcerpt: 'POV: Explaining why your new sneakers cost more than monthly rent to parents 😂👟',
    fullContent: 'POV: Explaining why your new sneakers cost more than monthly rent to parents 😂👟 Organic skit crossed 1.4M views in 24 hours.',
    content: 'POV: Explaining why your new sneakers cost more than monthly rent to parents 😂👟 Organic skit crossed 1.4M views in 24 hours.',
    mediaUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-walking-down-the-street-smiling-41164-large.mp4',
    isReel: true,
    duration: '0:35',
    aspectRatio: '9:16',
    tags: ['#StreetComedy', '#ViralSkit', '#RelatableCreators'],
    location: 'Bandra, Mumbai',
    timestamp: '12 hours ago',
    likes: 5800,
    likedByMe: true,
    commentsCount: 310,
    sharesCount: 420,
    savedByMe: true,
    category: 'reels',
    postStatus: 'published',
    moderationStatus: 'approved',
    comments: [],
  },
  {
    id: 'post-brand-2',
    authorId: 'brand-cult',
    authorName: 'CultSport Apparel',
    authorHandle: '@cultsport',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    authorType: 'business',
    authorVerified: true,
    authorBadge: 'Athletic Wear',
    discoveryBadge: 'New Campaign',
    contentType: 'shot',
    shortExcerpt: 'Introducing RapidDry Performance: scouting 8 fitness and run-club creators for 30-day wear tests.',
    fullContent: 'Introducing the RapidDry Performance Series. We are commissioning 8 fitness and run-club creators for 30-day wear tests and pacing clips. Immediate sign-offs via CreatorOS Escrow.',
    content: 'Introducing the RapidDry Performance Series. We are commissioning 8 fitness and run-club creators for 30-day wear tests and pacing clips. Immediate sign-offs via CreatorOS Escrow.',
    mediaUrl: 'https://images.unsplash.com/photo-1483721074577-83201416bb5a?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    isReel: false,
    aspectRatio: '16:9',
    tags: ['#AthleisureWear', '#RunClub', '#PerformanceGear'],
    location: 'Bangalore & Mumbai',
    timestamp: '1 day ago',
    likes: 920,
    likedByMe: false,
    commentsCount: 48,
    sharesCount: 62,
    savedByMe: false,
    category: 'shots',
    postStatus: 'published',
    moderationStatus: 'approved',
    comments: [],
  },
  {
    id: 'post-cr-photo-2',
    authorId: 'cr-03',
    authorName: 'Maya Patel',
    authorHandle: '@mayapatel.fit',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    authorType: 'creator',
    authorVerified: true,
    authorBadge: 'Athleisure & Fitness',
    discoveryBadge: 'Great Match',
    contentType: 'shot',
    shortExcerpt: 'Morning 10K pacing session in Bandra with high-compression gear test.',
    fullContent: 'Morning 10K pacing session in Bandra. High-compression seamless gear test delivered 2 days ahead of schedule for brand review.',
    content: 'Morning 10K pacing session in Bandra. High-compression seamless gear test delivered 2 days ahead of schedule for brand review.',
    mediaUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    isReel: false,
    aspectRatio: '4:5',
    tags: ['#FitnessCreator', '#MorningMiles', '#CleanAesthetic'],
    location: 'Carter Road, Mumbai',
    timestamp: '1 day ago',
    likes: 1490,
    likedByMe: false,
    commentsCount: 52,
    sharesCount: 38,
    savedByMe: false,
    category: 'shots',
    postStatus: 'published',
    moderationStatus: 'approved',
    comments: [],
  },
];

export class SocialFeedService {
  private posts: SocialPost[] = [...INITIAL_SOCIAL_POSTS];

  getPosts(category: string = 'for_you'): SocialPost[] {
    if (category === 'for_you' || category === 'all') return this.posts;
    if (category === 'reels') return this.posts.filter((p) => p.contentType === 'reel' || p.isReel);
    if (category === 'shots') return this.posts.filter((p) => p.contentType === 'shot');
    if (category === 'blogs') return this.posts.filter((p) => p.contentType === 'blog');
    if (category === 'creators') return this.posts.filter((p) => p.authorType === 'creator');
    if (category === 'brands') return this.posts.filter((p) => p.authorType === 'business');
    if (category === 'trending') return this.posts.filter((p) => p.likes > 2000 || p.discoveryBadge?.includes('Trending'));
    return this.posts;
  }

  toggleLike(postId: string): SocialPost | undefined {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return undefined;
    post.likedByMe = !post.likedByMe;
    post.likes += post.likedByMe ? 1 : -1;
    return { ...post };
  }

  toggleSave(postId: string): SocialPost | undefined {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return undefined;
    post.savedByMe = !post.savedByMe;
    return { ...post };
  }

  addComment(postId: string, comment: Omit<PostComment, 'id' | 'timestamp'>): PostComment | undefined {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return undefined;
    const newComment: PostComment = {
      ...comment,
      id: `c-${Date.now()}`,
      timestamp: 'Just now',
    };
    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    return newComment;
  }

  createPost(newPostData: Partial<SocialPost>): SocialPost {
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorId: newPostData.authorId || 'current-user',
      authorName: newPostData.authorName || 'Current User',
      authorHandle: newPostData.authorHandle || '@user',
      authorAvatar:
        newPostData.authorAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorType: newPostData.authorType || 'creator',
      authorBadge: newPostData.authorBadge || 'Creator Pro',
      discoveryBadge: newPostData.discoveryBadge || 'New Creator',
      contentType: newPostData.contentType || 'shot',
      content: newPostData.content || '',
      shortExcerpt:
        newPostData.shortExcerpt ||
        (newPostData.content
          ? newPostData.content.length > 120
            ? newPostData.content.slice(0, 117) + '...'
            : newPostData.content
          : ''),
      fullContent: newPostData.fullContent || newPostData.blogContent || newPostData.content || '',
      mediaUrl: newPostData.mediaUrl,
      mediaType: newPostData.mediaType || 'image',
      isReel: newPostData.isReel || newPostData.contentType === 'reel',
      videoUrl: newPostData.videoUrl,
      duration: newPostData.duration,
      aspectRatio: newPostData.aspectRatio || '1:1',
      tags: newPostData.tags || [],
      location: newPostData.location || 'Mumbai, India',
      timestamp: 'Just now',
      likes: 0,
      likedByMe: false,
      commentsCount: 0,
      sharesCount: 0,
      savedByMe: false,
      category: newPostData.category || 'for_you',
      campaignOpportunity: newPostData.campaignOpportunity,
      comments: [],
      blogTitle: newPostData.blogTitle,
      blogCoverImage: newPostData.blogCoverImage,
      blogContent: newPostData.blogContent,
      blogArticleImages: newPostData.blogArticleImages,
      blogReadingTime: newPostData.blogReadingTime,
      postStatus: newPostData.postStatus || 'published',
      isPinned: newPostData.isPinned || false,
      moderationStatus: 'approved',
    };
    this.posts.unshift(newPost);
    return newPost;
  }
}

export const socialFeedService = new SocialFeedService();

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Mastering PUBG Mobile: Pro Tips from Top Players",
    slug: "mastering-pubg-mobile-pro-tips",
    excerpt: "Learn the strategies and techniques used by professional PUBG Mobile players to dominate the battlefield and secure victory royales.",
    content: `
# Mastering PUBG Mobile: Pro Tips from Top Players

PUBG Mobile has become one of the most competitive mobile games in the esports scene. Whether you're a beginner or an experienced player, these pro tips will help you elevate your gameplay.

## 1. Master Your Landing Strategy

The first 60 seconds of any match are crucial. Pro players always:
- Choose landing spots based on flight path
- Prioritize high-tier loot locations
- Have backup landing zones ready

## 2. Optimize Your Settings

Professional players spend hours fine-tuning their settings:
- Sensitivity: Find your perfect balance
- Graphics: Performance over visuals
- Controls: Customize for your playstyle

## 3. Communication is Key

In squad matches, communication can make or break your game:
- Use voice chat effectively
- Call out enemy positions clearly
- Coordinate strategies with your team

## 4. Practice Makes Perfect

Top players dedicate hours to practice:
- Training mode for aim improvement
- Custom rooms for strategy testing
- Analyzing replays to learn from mistakes

Remember, becoming a pro takes time and dedication. Keep practicing, stay focused, and never give up!
    `,
    coverImage: "/blog/pubg-tips.jpg",
    author: {
      name: "Alex Thunder",
      avatar: "/avatars/alex.jpg",
      role: "Pro PUBG Player"
    },
    category: "Gaming Tips",
    tags: ["PUBG Mobile", "Strategy", "Pro Tips"],
    publishedAt: "2024-12-05",
    readTime: 5,
    views: 12500,
    likes: 890
  },
  {
    id: "2",
    title: "The Rise of Mobile Esports in Nigeria",
    slug: "rise-of-mobile-esports-nigeria",
    excerpt: "Explore how mobile gaming and esports are transforming the Nigerian gaming landscape and creating new opportunities for gamers.",
    content: `
# The Rise of Mobile Esports in Nigeria

Mobile esports has exploded in popularity across Nigeria, creating unprecedented opportunities for gamers and entrepreneurs alike.

## The Mobile Gaming Revolution

Nigeria has seen a massive surge in mobile gaming adoption:
- Over 20 million active mobile gamers
- Growing tournament prize pools
- Increasing sponsor interest

## Key Factors Driving Growth

Several factors contribute to this boom:
- Affordable smartphones
- Improved internet connectivity
- Youth demographic engagement

## Major Tournaments

Nigerian mobile esports tournaments are gaining traction:
- Monthly PUBG Mobile championships
- Free Fire leagues
- Call of Duty Mobile competitions

## Future Outlook

The future looks bright for Nigerian mobile esports with:
- International tournament participation
- Professional team formations
- Career opportunities in gaming

Join the revolution and be part of Nigeria's gaming future!
    `,
    coverImage: "/blog/nigeria-esports.jpg",
    author: {
      name: "Sarah Okonkwo",
      avatar: "/avatars/sarah.jpg",
      role: "Esports Analyst"
    },
    category: "Industry News",
    tags: ["Esports", "Nigeria", "Mobile Gaming"],
    publishedAt: "2024-12-03",
    readTime: 7,
    views: 8900,
    likes: 654
  },
  {
    id: "3",
    title: "How to Build a Winning Tournament Team",
    slug: "build-winning-tournament-team",
    excerpt: "Discover the essential elements of creating and managing a successful esports team that can compete at the highest level.",
    content: `
# How to Build a Winning Tournament Team

Building a championship-caliber esports team requires more than just skilled players. Here's your complete guide.

## Player Selection

Finding the right players is crucial:
- Assess individual skill levels
- Evaluate team chemistry
- Consider communication abilities

## Team Roles and Strategy

Define clear roles for each member:
- In-game leader (IGL)
- Entry fraggers
- Support players
- Snipers/AWPers

## Practice and Training

Consistent practice is non-negotiable:
- Daily scrimmages
- Strategy sessions
- Individual skill training
- VOD reviews

## Mental Preparation

The psychological aspect is often overlooked:
- Team bonding activities
- Stress management
- Maintaining positive mindset

## Tournament Preparation

Before major tournaments:
- Study opponent strategies
- Prepare multiple game plans
- Ensure equipment readiness

Success comes from dedication, teamwork, and continuous improvement!
    `,
    coverImage: "/blog/team-building.jpg",
    author: {
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      role: "Team Coach"
    },
    category: "Team Management",
    tags: ["Team Building", "Strategy", "Coaching"],
    publishedAt: "2024-12-01",
    readTime: 6,
    views: 15200,
    likes: 1120
  },
  {
    id: "4",
    title: "Top 10 Gaming Peripherals for Competitive Play",
    slug: "top-gaming-peripherals-competitive-play",
    excerpt: "A comprehensive review of the best gaming gear that can give you the competitive edge in tournaments and ranked matches.",
    content: `
# Top 10 Gaming Peripherals for Competitive Play

The right equipment can significantly impact your performance. Here are the top peripherals every competitive gamer should consider.

## Mobile Gaming Controllers

1. **Razer Kishi V2** - Best overall mobile controller
2. **Backbone One** - Premium iOS option
3. **GameSir X3** - Feature-packed Android choice

## Gaming Headsets

Quality audio is crucial:
- **HyperX Cloud Alpha** - Best value
- **SteelSeries Arctis Pro** - Premium choice
- **Razer BlackShark V2** - Tournament favorite

## Charging Solutions

Never run out of power:
- Fast charging power banks
- Wireless charging pads
- Multi-device charging stations

## Screen Protectors and Cases

Protect your investment:
- Tempered glass screen protectors
- Shock-absorbing cases
- Cooling cases for extended sessions

## Conclusion

Investing in quality peripherals can elevate your game and provide the edge needed for competitive success.
    `,
    coverImage: "/blog/gaming-gear.jpg",
    author: {
      name: "David Martinez",
      avatar: "/avatars/david.jpg",
      role: "Tech Reviewer"
    },
    category: "Gear Reviews",
    tags: ["Gaming Gear", "Reviews", "Peripherals"],
    publishedAt: "2024-11-28",
    readTime: 8,
    views: 18700,
    likes: 1450
  },
  {
    id: "5",
    title: "Understanding Tournament Prize Pool Distribution",
    slug: "tournament-prize-pool-distribution",
    excerpt: "Learn how tournament prize pools are structured and distributed, and what you need to know before competing for cash prizes.",
    content: `
# Understanding Tournament Prize Pool Distribution

Prize pools are a major attraction in esports tournaments. Here's everything you need to know about how they work.

## Prize Pool Structures

Common distribution models:
- **Winner Takes All** - High risk, high reward
- **Top 3 Split** - Rewards podium finishers
- **Graduated Distribution** - Rewards more participants

## Typical Percentages

Standard prize distribution:
- 1st Place: 40-50%
- 2nd Place: 20-25%
- 3rd Place: 10-15%
- 4th-8th: Remaining pool

## Payment Methods

How you receive your winnings:
- Bank transfers
- Mobile money
- Cryptocurrency
- Platform credits

## Tax Considerations

Important financial aspects:
- Prize money is taxable income
- Keep records of winnings
- Consult with tax professionals

## Platform Fees

Be aware of:
- Registration fees
- Platform commissions
- Payment processing fees

Understanding these aspects helps you make informed decisions about tournament participation!
    `,
    coverImage: "/blog/prize-pools.jpg",
    author: {
      name: "Jennifer Adams",
      avatar: "/avatars/jennifer.jpg",
      role: "Tournament Organizer"
    },
    category: "Tournament Info",
    tags: ["Tournaments", "Prize Pools", "Finance"],
    publishedAt: "2024-11-25",
    readTime: 5,
    views: 9800,
    likes: 720
  },
  {
    id: "6",
    title: "Metrix Platform: Complete Beginner's Guide",
    slug: "metrix-platform-beginners-guide",
    excerpt: "New to Metrix? This comprehensive guide will walk you through everything you need to know to start competing and winning.",
    content: `
# Metrix Platform: Complete Beginner's Guide

Welcome to Metrix! This guide will help you get started on your journey to becoming a competitive gamer.

## Getting Started

First steps on Metrix:
1. Create your account
2. Complete your profile
3. Verify your identity
4. Link payment methods

## Finding Tournaments

Navigate our tournament system:
- Browse by game
- Filter by entry fee
- Check prize pools
- Review tournament rules

## Registration Process

How to enter tournaments:
- Select your tournament
- Pay entry fee (if applicable)
- Join tournament lobby
- Wait for match assignments

## During the Tournament

What to expect:
- Match notifications
- Opponent information
- Result submission
- Dispute resolution

## After the Tournament

Post-tournament process:
- View final standings
- Claim your prizes
- Review match history
- Provide feedback

## Tips for Success

Maximize your Metrix experience:
- Start with free tournaments
- Read all tournament rules
- Join the community
- Practice regularly

Welcome to the Metrix family - let's dominate together!
    `,
    coverImage: "/blog/metrix-guide.jpg",
    author: {
      name: "Metrix Team",
      avatar: "/logo.png",
      role: "Platform Admin"
    },
    category: "Platform Guide",
    tags: ["Metrix", "Tutorial", "Beginners"],
    publishedAt: "2024-11-20",
    readTime: 10,
    views: 25400,
    likes: 2100
  }
];

export const categories = [
  "All Posts",
  "Gaming Tips",
  "Industry News",
  "Team Management",
  "Gear Reviews",
  "Tournament Info",
  "Platform Guide"
];

export const featuredPost = blogPosts[0];

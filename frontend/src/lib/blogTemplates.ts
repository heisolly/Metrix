// Blog Post Templates
// Pre-designed templates for different types of blog posts

export interface BlogTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  html_content: string;
  css_styles: string;
  thumbnail: string;
}

export const BLOG_TEMPLATES: BlogTemplate[] = [
  {
    id: 'tournament_announcement',
    name: 'Tournament Announcement',
    description: 'Bold design for announcing new tournaments',
    category: 'Tournaments',
    thumbnail: '🏆',
    preview: 'Large hero image with prize pool highlight',
    html_content: `
<div class="tournament-announcement">
  <div class="prize-banner">
    <div class="prize-amount">₦10,000</div>
    <div class="prize-label">PRIZE POOL</div>
  </div>
  
  <h1 class="tournament-title">COD Mobile Championship 2024</h1>
  
  <div class="tournament-details">
    <div class="detail-card">
      <div class="detail-icon">📅</div>
      <div class="detail-label">Date</div>
      <div class="detail-value">December 25, 2024</div>
    </div>
    <div class="detail-card">
      <div class="detail-icon">👥</div>
      <div class="detail-label">Players</div>
      <div class="detail-value">64 Slots</div>
    </div>
    <div class="detail-card">
      <div class="detail-icon">🎮</div>
      <div class="detail-label">Format</div>
      <div class="detail-value">Single Elimination</div>
    </div>
  </div>
  
  <div class="tournament-description">
    <h2>About the Tournament</h2>
    <p>Join the biggest COD Mobile tournament of the year! Compete against the best players and win amazing prizes.</p>
  </div>
  
  <div class="cta-section">
    <a href="/tournaments" class="cta-button">Register Now</a>
  </div>
</div>`,
    css_styles: `
.tournament-announcement {
  max-width: 800px;
  margin: 0 auto;
}

.prize-banner {
  background: linear-gradient(135deg, #ff0000, #ff7700);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3);
}

.prize-amount {
  font-size: 72px;
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.prize-label {
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 4px;
}

.tournament-title {
  font-size: 48px;
  font-weight: 900;
  text-align: center;
  margin: 30px 0;
  background: linear-gradient(135deg, #ff0000, #ff7700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tournament-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0;
}

.detail-card {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  border: 2px solid #e9ecef;
}

.detail-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.detail-label {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 5px;
}

.detail-value {
  font-size: 20px;
  font-weight: 700;
  color: #212529;
}

.tournament-description {
  background: #f8f9fa;
  padding: 40px;
  border-radius: 15px;
  margin: 40px 0;
}

.tournament-description h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 20px;
  color: #212529;
}

.tournament-description p {
  font-size: 18px;
  line-height: 1.8;
  color: #495057;
}

.cta-section {
  text-align: center;
  margin: 50px 0;
}

.cta-button {
  display: inline-block;
  padding: 20px 60px;
  background: linear-gradient(135deg, #ff0000, #ff7700);
  color: white;
  font-size: 24px;
  font-weight: 700;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3);
  transition: transform 0.3s;
}

.cta-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 0, 0, 0.4);
}
`
  },

  {
    id: 'game_guide',
    name: 'Game Guide',
    description: 'Step-by-step guide layout with numbered sections',
    category: 'Guides',
    thumbnail: '📖',
    preview: 'Clean layout with numbered steps and tips',
    html_content: `
<div class="game-guide">
  <div class="guide-header">
    <span class="guide-badge">BEGINNER GUIDE</span>
    <h1>How to Master COD Mobile</h1>
    <p class="guide-intro">Follow these steps to improve your gameplay</p>
  </div>
  
  <div class="guide-steps">
    <div class="step">
      <div class="step-number">1</div>
      <div class="step-content">
        <h3>Choose Your Loadout</h3>
        <p>Select weapons and perks that match your playstyle. ARs for versatility, SMGs for close combat.</p>
      </div>
    </div>
    
    <div class="step">
      <div class="step-number">2</div>
      <div class="step-content">
        <h3>Master Movement</h3>
        <p>Learn to slide, jump, and dropshot effectively. Movement is key to winning gunfights.</p>
      </div>
    </div>
    
    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <h3>Map Knowledge</h3>
        <p>Study popular maps and learn common camping spots and rotation paths.</p>
      </div>
    </div>
  </div>
  
  <div class="pro-tip">
    <div class="tip-icon">💡</div>
    <div class="tip-content">
      <h4>Pro Tip</h4>
      <p>Practice in training mode for 15 minutes before ranked matches to warm up your aim.</p>
    </div>
  </div>
</div>`,
    css_styles: `
.game-guide {
  max-width: 800px;
  margin: 0 auto;
}

.guide-header {
  text-align: center;
  margin-bottom: 50px;
}

.guide-badge {
  display: inline-block;
  padding: 8px 20px;
  background: #ff0000;
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 20px;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.guide-header h1 {
  font-size: 48px;
  font-weight: 900;
  color: #212529;
  margin: 20px 0;
}

.guide-intro {
  font-size: 20px;
  color: #6c757d;
}

.guide-steps {
  margin: 50px 0;
}

.step {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 15px;
  border-left: 5px solid #ff0000;
}

.step-number {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff0000, #ff7700);
  color: white;
  font-size: 32px;
  font-weight: 900;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-content h3 {
  font-size: 24px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 10px;
}

.step-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #495057;
}

.pro-tip {
  display: flex;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border-radius: 15px;
  border: 2px solid #ffc107;
  margin: 50px 0;
}

.tip-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.tip-content h4 {
  font-size: 20px;
  font-weight: 800;
  color: #856404;
  margin-bottom: 10px;
}

.tip-content p {
  font-size: 16px;
  color: #856404;
  line-height: 1.6;
}
`
  },

  {
    id: 'news_update',
    name: 'News Update',
    description: 'Modern news article layout',
    category: 'News',
    thumbnail: '📰',
    preview: 'Professional news article with highlights',
    html_content: `
<div class="news-update">
  <div class="news-meta">
    <span class="news-category">BREAKING NEWS</span>
    <span class="news-date">December 11, 2024</span>
  </div>
  
  <h1 class="news-headline">New Season Launches with Exclusive Rewards</h1>
  
  <div class="news-highlight">
    <p>The highly anticipated Season 5 is now live with exclusive skins, weapons, and battle pass rewards!</p>
  </div>
  
  <div class="news-content">
    <h2>What's New</h2>
    <ul class="feature-list">
      <li>🎨 10 New Legendary Skins</li>
      <li>🔫 2 New Weapons: AK-47 Mythic & DLQ Legendary</li>
      <li>🗺️ New Map: Shipment 2024</li>
      <li>🏆 Ranked Season Reset</li>
    </ul>
    
    <h2>Battle Pass Rewards</h2>
    <p>Unlock over 50 tiers of rewards including exclusive character skins, weapon blueprints, and calling cards.</p>
  </div>
  
  <div class="news-footer">
    <div class="share-section">
      <span>Share this news:</span>
      <div class="share-buttons">
        <button>Twitter</button>
        <button>Facebook</button>
        <button>Discord</button>
      </div>
    </div>
  </div>
</div>`,
    css_styles: `
.news-update {
  max-width: 800px;
  margin: 0 auto;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.news-category {
  padding: 6px 16px;
  background: #dc3545;
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 20px;
  letter-spacing: 1px;
}

.news-date {
  color: #6c757d;
  font-size: 14px;
}

.news-headline {
  font-size: 48px;
  font-weight: 900;
  color: #212529;
  line-height: 1.2;
  margin: 20px 0;
}

.news-highlight {
  padding: 30px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-left: 5px solid #2196f3;
  border-radius: 10px;
  margin: 30px 0;
}

.news-highlight p {
  font-size: 20px;
  font-weight: 600;
  color: #0d47a1;
  margin: 0;
}

.news-content {
  margin: 40px 0;
}

.news-content h2 {
  font-size: 32px;
  font-weight: 800;
  color: #212529;
  margin: 30px 0 20px 0;
}

.news-content p {
  font-size: 18px;
  line-height: 1.8;
  color: #495057;
  margin: 20px 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.feature-list li {
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #212529;
}

.news-footer {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 2px solid #e9ecef;
}

.share-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.share-section span {
  font-weight: 600;
  color: #6c757d;
}

.share-buttons {
  display: flex;
  gap: 10px;
}

.share-buttons button {
  padding: 10px 20px;
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-weight: 600;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s;
}

.share-buttons button:hover {
  background: #ff0000;
  color: white;
  border-color: #ff0000;
}
`
  },

  {
    id: 'player_spotlight',
    name: 'Player Spotlight',
    description: 'Profile-style layout for featuring players',
    category: 'Community',
    thumbnail: '⭐',
    preview: 'Hero card with stats and achievements',
    html_content: `
<div class="player-spotlight">
  <div class="player-hero">
    <div class="player-avatar">
      <div class="avatar-circle">🎮</div>
      <div class="player-rank">LEGEND</div>
    </div>
    <h1 class="player-name">ProGamer_2024</h1>
    <p class="player-title">Tournament Champion</p>
  </div>
  
  <div class="player-stats">
    <div class="stat-card">
      <div class="stat-value">156</div>
      <div class="stat-label">Wins</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">3.2</div>
      <div class="stat-label">K/D Ratio</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">₦5,000</div>
      <div class="stat-label">Earnings</div>
    </div>
  </div>
  
  <div class="player-bio">
    <h2>About</h2>
    <p>Professional COD Mobile player with 3 years of competitive experience. Specializes in aggressive SMG gameplay and has won multiple regional tournaments.</p>
  </div>
  
  <div class="achievements">
    <h2>Recent Achievements</h2>
    <div class="achievement-list">
      <div class="achievement">
        <span class="achievement-icon">🏆</span>
        <span class="achievement-text">1st Place - Winter Championship 2024</span>
      </div>
      <div class="achievement">
        <span class="achievement-icon">🥇</span>
        <span class="achievement-text">MVP - Regional Finals</span>
      </div>
      <div class="achievement">
        <span class="achievement-icon">⭐</span>
        <span class="achievement-text">Top 10 Global Ranking</span>
      </div>
    </div>
  </div>
</div>`,
    css_styles: `
.player-spotlight {
  max-width: 800px;
  margin: 0 auto;
}

.player-hero {
  text-align: center;
  padding: 50px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin-bottom: 40px;
}

.player-avatar {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.avatar-circle {
  width: 150px;
  height: 150px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  border: 5px solid rgba(255, 255, 255, 0.3);
}

.player-rank {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 8px 16px;
  background: #ffd700;
  color: #000;
  font-size: 12px;
  font-weight: 900;
  border-radius: 20px;
  letter-spacing: 1px;
}

.player-name {
  font-size: 48px;
  font-weight: 900;
  color: white;
  margin: 20px 0 10px 0;
}

.player-title {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.player-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0;
}

.stat-card {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  border: 2px solid #e9ecef;
}

.stat-value {
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  margin-top: 10px;
  font-weight: 600;
}

.player-bio {
  background: #f8f9fa;
  padding: 40px;
  border-radius: 15px;
  margin: 40px 0;
}

.player-bio h2 {
  font-size: 28px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 20px;
}

.player-bio p {
  font-size: 18px;
  line-height: 1.8;
  color: #495057;
}

.achievements h2 {
  font-size: 28px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 20px;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.achievement {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.achievement-icon {
  font-size: 32px;
}

.achievement-text {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
}
`
  },

  {
    id: 'minimal_clean',
    name: 'Minimal & Clean',
    description: 'Simple, elegant typography-focused design',
    category: 'Updates',
    thumbnail: '✨',
    preview: 'Clean white space with elegant typography',
    html_content: `
<div class="minimal-post">
  <div class="post-header">
    <div class="post-date">December 11, 2024</div>
    <h1 class="post-title">Platform Updates & Improvements</h1>
    <div class="post-author">By Admin Team</div>
  </div>
  
  <div class="post-content">
    <p class="lead">We're excited to announce several improvements to enhance your gaming experience.</p>
    
    <h2>Performance Enhancements</h2>
    <p>We've optimized our servers to reduce latency and improve match loading times by 40%.</p>
    
    <h2>New Features</h2>
    <p>Check out the latest additions to the platform including real-time match statistics and improved tournament brackets.</p>
    
    <blockquote>
      "These updates represent our commitment to providing the best competitive gaming experience."
    </blockquote>
    
    <h2>What's Next</h2>
    <p>Stay tuned for more exciting features coming in the next update cycle.</p>
  </div>
</div>`,
    css_styles: `
.minimal-post {
  max-width: 700px;
  margin: 0 auto;
  padding: 60px 20px;
}

.post-header {
  text-align: center;
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e9ecef;
}

.post-date {
  font-size: 14px;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.post-title {
  font-size: 56px;
  font-weight: 300;
  color: #212529;
  line-height: 1.2;
  margin: 20px 0;
  font-family: Georgia, serif;
}

.post-author {
  font-size: 16px;
  color: #6c757d;
  font-style: italic;
}

.post-content {
  font-size: 19px;
  line-height: 1.8;
  color: #212529;
}

.lead {
  font-size: 24px;
  line-height: 1.6;
  color: #495057;
  margin-bottom: 40px;
  font-weight: 300;
}

.post-content h2 {
  font-size: 32px;
  font-weight: 600;
  color: #212529;
  margin: 50px 0 20px 0;
  font-family: Georgia, serif;
}

.post-content p {
  margin: 20px 0;
}

blockquote {
  margin: 40px 0;
  padding: 30px 40px;
  background: #f8f9fa;
  border-left: 4px solid #212529;
  font-size: 22px;
  font-style: italic;
  color: #495057;
  line-height: 1.6;
}
`
  },

  // Continue with 5 more templates...
  {
    id: 'dark_gaming',
    name: 'Dark Gaming',
    description: 'Dark theme with neon accents',
    category: 'Tournaments',
    thumbnail: '🎮',
    preview: 'Dark background with neon highlights',
    html_content: `
<div class="dark-gaming">
  <div class="neon-title">
    <h1>CYBER TOURNAMENT 2024</h1>
    <div class="neon-line"></div>
  </div>
  
  <div class="game-info">
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">GAME</span>
        <span class="info-value">COD Mobile</span>
      </div>
      <div class="info-item">
        <span class="info-label">MODE</span>
        <span class="info-value">Battle Royale</span>
      </div>
      <div class="info-item">
        <span class="info-label">PRIZE</span>
        <span class="info-value">₦15,000</span>
      </div>
    </div>
  </div>
  
  <div class="dark-content">
    <p>Experience the future of competitive gaming. Join us in the most intense tournament of the year.</p>
  </div>
  
  <div class="cta-dark">
    <button class="neon-button">ENTER NOW</button>
  </div>
</div>`,
    css_styles: `
.dark-gaming {
  background: #0a0e27;
  padding: 60px 40px;
  border-radius: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.neon-title h1 {
  font-size: 56px;
  font-weight: 900;
  text-align: center;
  color: #fff;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
  margin-bottom: 20px;
  letter-spacing: 4px;
}

.neon-line {
  height: 3px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  box-shadow: 0 0 10px #00ffff;
  margin: 0 auto 40px;
  width: 200px;
}

.game-info {
  margin: 50px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.info-item {
  background: rgba(0, 255, 255, 0.1);
  border: 2px solid #00ffff;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
}

.info-label {
  display: block;
  font-size: 12px;
  color: #00ffff;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.info-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.dark-content {
  margin: 40px 0;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.dark-content p {
  font-size: 20px;
  line-height: 1.8;
  color: #ccc;
  text-align: center;
}

.cta-dark {
  text-align: center;
  margin-top: 50px;
}

.neon-button {
  padding: 20px 60px;
  background: transparent;
  border: 3px solid #00ffff;
  color: #00ffff;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 3px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.neon-button:hover {
  background: #00ffff;
  color: #0a0e27;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
}
`
  },

  {
    id: 'magazine_style',
    name: 'Magazine Style',
    description: 'Editorial magazine layout',
    category: 'News',
    thumbnail: '📑',
    preview: 'Multi-column magazine design',
    html_content: `
<div class="magazine-post">
  <div class="magazine-header">
    <div class="issue-number">ISSUE #42</div>
    <h1 class="magazine-title">The Rise of Mobile Esports</h1>
    <div class="magazine-subtitle">How mobile gaming is changing the competitive landscape</div>
  </div>
  
  <div class="magazine-columns">
    <div class="column">
      <p class="drop-cap">Mobile esports has experienced unprecedented growth in recent years, with millions of players competing globally.</p>
      <p>The accessibility of mobile devices has democratized competitive gaming, allowing players from all backgrounds to participate.</p>
    </div>
    <div class="column">
      <p>Prize pools have skyrocketed, with major tournaments now offering millions in rewards. This has attracted professional players and organizations.</p>
      <p>The future looks bright for mobile esports, with new games and platforms emerging constantly.</p>
    </div>
  </div>
  
  <div class="pull-quote">
    "Mobile esports is not the future - it's the present"
  </div>
</div>`,
    css_styles: `
.magazine-post {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  background: #fff;
}

.magazine-header {
  border-top: 4px solid #000;
  border-bottom: 1px solid #000;
  padding: 30px 0;
  margin-bottom: 40px;
}

.issue-number {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #000;
  margin-bottom: 10px;
}

.magazine-title {
  font-size: 64px;
  font-weight: 900;
  color: #000;
  line-height: 1.1;
  margin: 10px 0;
  font-family: Georgia, serif;
}

.magazine-subtitle {
  font-size: 20px;
  color: #666;
  font-style: italic;
  margin-top: 15px;
}

.magazine-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: 40px 0;
}

.column p {
  font-size: 17px;
  line-height: 1.7;
  color: #333;
  margin-bottom: 20px;
  text-align: justify;
}

.drop-cap::first-letter {
  font-size: 72px;
  font-weight: 900;
  float: left;
  line-height: 60px;
  margin: 0 10px 0 0;
  color: #000;
}

.pull-quote {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  color: #000;
  padding: 40px;
  margin: 60px 0;
  border-top: 3px solid #000;
  border-bottom: 3px solid #000;
  font-style: italic;
}
`
  },

  {
    id: 'card_grid',
    name: 'Card Grid',
    description: 'Modern card-based layout',
    category: 'Updates',
    thumbnail: '🎴',
    preview: 'Grid of feature cards',
    html_content: `
<div class="card-grid-post">
  <h1 class="grid-title">Season 5 Update Highlights</h1>
  
  <div class="cards-container">
    <div class="feature-card red">
      <div class="card-icon">🔫</div>
      <h3>New Weapons</h3>
      <p>2 legendary weapons added to the arsenal</p>
    </div>
    
    <div class="feature-card blue">
      <div class="card-icon">🗺️</div>
      <h3>New Maps</h3>
      <p>3 competitive maps for ranked play</p>
    </div>
    
    <div class="feature-card green">
      <div class="card-icon">🎨</div>
      <h3>Skins</h3>
      <p>15+ exclusive character and weapon skins</p>
    </div>
    
    <div class="feature-card purple">
      <div class="card-icon">🏆</div>
      <h3>Ranked</h3>
      <p>New ranked season with better rewards</p>
    </div>
    
    <div class="feature-card orange">
      <div class="card-icon">⚡</div>
      <h3>Performance</h3>
      <p>Optimized for smoother gameplay</p>
    </div>
    
    <div class="feature-card pink">
      <div class="card-icon">🎮</div>
      <h3>Events</h3>
      <p>Limited-time events with exclusive prizes</p>
    </div>
  </div>
</div>`,
    css_styles: `
.card-grid-post {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.grid-title {
  font-size: 48px;
  font-weight: 900;
  text-align: center;
  color: #212529;
  margin-bottom: 50px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.feature-card {
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.feature-card.red {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
}

.feature-card.blue {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.feature-card.green {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
  color: white;
}

.feature-card.purple {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #333;
}

.feature-card.orange {
  background: linear-gradient(135deg, #fa709a, #fee140);
  color: white;
}

.feature-card.pink {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.card-icon {
  font-size: 56px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.5;
}
`
  },

  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Chronological timeline layout',
    category: 'Updates',
    thumbnail: '📅',
    preview: 'Vertical timeline with milestones',
    html_content: `
<div class="timeline-post">
  <h1 class="timeline-title">Tournament Schedule</h1>
  
  <div class="timeline">
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-date">Week 1</div>
        <h3>Registration Opens</h3>
        <p>Sign up for the tournament and secure your spot</p>
      </div>
    </div>
    
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-date">Week 2</div>
        <h3>Qualifiers</h3>
        <p>Compete in qualifying rounds to advance</p>
      </div>
    </div>
    
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-date">Week 3</div>
        <h3>Semi-Finals</h3>
        <p>Top 8 teams battle for finals spot</p>
      </div>
    </div>
    
    <div class="timeline-item">
      <div class="timeline-marker active"></div>
      <div class="timeline-content">
        <div class="timeline-date">Week 4</div>
        <h3>Grand Finals</h3>
        <p>Championship match for the ultimate prize</p>
      </div>
    </div>
  </div>
</div>`,
    css_styles: `
.timeline-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.timeline-title {
  font-size: 48px;
  font-weight: 900;
  text-align: center;
  color: #212529;
  margin-bottom: 60px;
}

.timeline {
  position: relative;
  padding-left: 60px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #ff0000, #ff7700);
}

.timeline-item {
  position: relative;
  margin-bottom: 50px;
}

.timeline-marker {
  position: absolute;
  left: -48px;
  top: 0;
  width: 20px;
  height: 20px;
  background: #fff;
  border: 4px solid #ff0000;
  border-radius: 50%;
  z-index: 1;
}

.timeline-marker.active {
  width: 30px;
  height: 30px;
  left: -53px;
  background: #ff0000;
  box-shadow: 0 0 0 8px rgba(255, 0, 0, 0.2);
}

.timeline-content {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  border-left: 4px solid #ff0000;
}

.timeline-date {
  font-size: 14px;
  font-weight: 700;
  color: #ff0000;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.timeline-content h3 {
  font-size: 24px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 10px;
}

.timeline-content p {
  font-size: 16px;
  color: #495057;
  line-height: 1.6;
}
`
  },

  {
    id: 'comparison',
    name: 'Comparison',
    description: 'Side-by-side comparison layout',
    category: 'Guides',
    thumbnail: '⚖️',
    preview: 'Compare features or options',
    html_content: `
<div class="comparison-post">
  <h1 class="comparison-title">Weapon Comparison: AR vs SMG</h1>
  
  <div class="comparison-grid">
    <div class="comparison-card">
      <div class="card-header ar">
        <h2>Assault Rifles</h2>
      </div>
      <div class="card-body">
        <div class="feature">
          <span class="feature-name">Range</span>
          <div class="feature-bar">
            <div class="bar-fill" style="width: 90%"></div>
          </div>
        </div>
        <div class="feature">
          <span class="feature-name">Damage</span>
          <div class="feature-bar">
            <div class="bar-fill" style="width: 80%"></div>
          </div>
        </div>
        <div class="feature">
          <span class="feature-name">Mobility</span>
          <div class="feature-bar">
            <div class="bar-fill" style="width: 60%"></div>
          </div>
        </div>
        <div class="feature">
          <span class="feature-name">Fire Rate</span>
          <div class="feature-bar">
            <div class="bar-fill" style="width: 70%"></div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <p>Best for: Medium to long range combat</p>
      </div>
    </div>
    
    <div class="comparison-card">
      <div class="card-header smg">
        <h2>SMGs</h2>
      </div>
      <div class="card-body">
        <div class="feature">
          <span class="feature-name">Range</span>
          <div class="feature-bar">
            <div class="bar-fill" style="width: 50%"></div>
          </div>
        </div>
        <div class="feature">
          <span class="feature-name">Damage</span>
          <div class="feature-bar">
            <div class="bar-fill" style="width: 70%"></div>
          </div>
        </div>
        <div class="feature">
          <span class="feature-name">Mobility</span>
          <div class="feature-bar">
            <div class="bar-fill" style="width: 95%"></div>
          </div>
        </div>
        <div class="feature">
          <span class="feature-name">Fire Rate</span>
          <div class="feature-bar">
            <div class="bar-fill" style="width: 90%"></div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <p>Best for: Close quarters combat</p>
      </div>
    </div>
  </div>
</div>`,
    css_styles: `
.comparison-post {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.comparison-title {
  font-size: 48px;
  font-weight: 900;
  text-align: center;
  color: #212529;
  margin-bottom: 50px;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.comparison-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 30px;
  text-align: center;
  color: white;
}

.card-header.ar {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.card-header.smg {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.card-header h2 {
  font-size: 32px;
  font-weight: 900;
  margin: 0;
}

.card-body {
  padding: 30px;
}

.feature {
  margin-bottom: 25px;
}

.feature-name {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #495057;
  margin-bottom: 8px;
}

.feature-bar {
  height: 12px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff0000, #ff7700);
  border-radius: 10px;
  transition: width 0.5s;
}

.card-footer {
  padding: 20px 30px 30px;
  text-align: center;
}

.card-footer p {
  font-size: 16px;
  color: #6c757d;
  font-style: italic;
  margin: 0;
}
`
  }
];

export function getTemplateById(id: string): BlogTemplate | undefined {
  return BLOG_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): BlogTemplate[] {
  return BLOG_TEMPLATES.filter(t => t.category === category);
}

export const TEMPLATE_CATEGORIES = [
  'All',
  'Tournaments',
  'Guides',
  'News',
  'Community',
  'Updates'
];

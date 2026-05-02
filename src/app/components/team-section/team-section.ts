import { Component } from '@angular/core';

const TEAM = [
  {
    name: 'Kirankumar Rathod',
    role: 'Founder & CEO',
    sub: 'Chief Experience & Operations Officer',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'The vision and founding force behind RnB. Deep on-ground travel expertise with extensive first-hand research of the competitive landscape. Background in family business brings operational instincts and strong local networks — particularly across Goa and Hampi.',
    focus: ['Property sourcing & inspection', 'On-ground trip execution', 'Group blueprint design', 'Quality standards & vendor partnerships'],
    quote: 'The brand\'s promise of "exactly as photographed" lives in his hands.',
  },
  {
    name: 'Abhishek Sharma',
    role: 'Co-Founder & COO',
    sub: 'Chief Operating Officer',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    bio: '10+ years in corporate operations, recruitment, and team-building with a Bachelor\'s in Tourism. Co-Founder and COO of a fintech startup — proven experience starting and scaling teams from scratch.',
    focus: ['Hiring & people strategy', 'Operations infrastructure', 'Staff training playbooks', 'B2B corporate relationships'],
    quote: 'His corporate HR network accelerates both team-building and corporate client relationships.',
  },
  {
    name: 'Devduth Midya',
    role: 'Co-Founder & CGO',
    sub: 'Chief Growth Officer',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'Strong background in marketing, digital strategy, and finance with experience scaling startups. Co-Founder and CEO of a fintech company. Avid biker and seasoned traveller with prior experience running a travel agency and restaurant.',
    focus: ['Digital & social media strategy', 'Brand partnerships', 'Content & influencer ecosystem', 'Growth vision & B2B partnerships'],
    quote: 'Leads the content and community flywheel that makes RnB aspirational.',
  },
];

@Component({
  selector: 'app-team-section',
  standalone: true,
  template: `
    <section class="team-section" id="team">
      <div class="team-inner">
        <div class="team-header">
          <span class="team-label">The Team</span>
          <h2 class="team-h2">Founded by operators.<br/>Built by travellers.</h2>
          <p class="team-sub">
            Three complementary skill sets spanning experience design, operations, growth, and business development.
            People buy from people — founders are the brand's face.
          </p>
        </div>
        <div class="team-grid">
          @for (member of team; track member.name) {
            <div class="team-card">
              <div class="team-img-wrap">
                <img [src]="member.img" [alt]="member.name" class="team-img" loading="lazy" />
                <div class="team-role-badge">{{ member.role }}</div>
              </div>
              <div class="team-body">
                <h3 class="team-name">{{ member.name }}</h3>
                <p class="team-sub-role">{{ member.sub }}</p>
                <p class="team-bio">{{ member.bio }}</p>
                <ul class="team-focus">
                  @for (f of member.focus; track f) {
                    <li>{{ f }}</li>
                  }
                </ul>
                <blockquote class="team-quote">{{ member.quote }}</blockquote>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .team-section { background: #EDE8E0; padding: 100px 2rem; }
    .team-inner { max-width: 1100px; margin: 0 auto; }
    .team-header { text-align: center; margin-bottom: 64px; }
    .team-label {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8622A;
      margin-bottom: 1rem;
    }
    .team-h2 {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.1;
      color: #1A1A18;
      margin: 0 0 1.25rem;
    }
    .team-sub {
      font-size: 1rem;
      color: #7A7167;
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.75;
    }
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    .team-card {
      background: #F7F4EF;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(26,26,24,0.06);
    }
    .team-img-wrap { position: relative; }
    .team-img { width: 100%; height: 280px; object-fit: cover; object-position: top; display: block; }
    .team-role-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
      background: rgba(26,26,24,0.75);
      backdrop-filter: blur(8px);
      border-radius: 100px;
      padding: 5px 14px;
    }
    .team-body { padding: 1.5rem; }
    .team-name {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1A1A18;
      margin: 0 0 4px;
    }
    .team-sub-role {
      font-size: 0.78rem;
      font-weight: 600;
      color: #C8622A;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 1rem;
    }
    .team-bio {
      font-size: 0.875rem;
      line-height: 1.7;
      color: #7A7167;
      margin: 0 0 1rem;
    }
    .team-focus {
      list-style: none;
      padding: 0;
      margin: 0 0 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .team-focus li {
      font-size: 0.8rem;
      color: #1A1A18;
      padding-left: 1rem;
      position: relative;
    }
    .team-focus li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #2C4A3E;
      font-size: 0.7rem;
    }
    .team-quote {
      font-size: 0.82rem;
      font-style: italic;
      color: #7A7167;
      border-left: 2px solid #C8622A;
      padding-left: 12px;
      margin: 0;
      line-height: 1.6;
    }
  `],
})
export class TeamSectionComponent {
  team = TEAM;
}

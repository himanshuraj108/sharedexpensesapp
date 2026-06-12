import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function SubscriptionsNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Your 7-day free trial has started! Welcome to Splitwise Pro! 🎉');
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="pro-landing-container fade-in">
      
      {/* HERO SECTION */}
      <section className="pro-hero-section">
        <div className="pro-hero-content">
          <div className="pro-hero-left">
            <h1 className="pro-hero-title">Get Splitwise Pro!</h1>
            <p className="pro-hero-subtitle">
              Subscribe to Splitwise Pro for receipt scanning, no ads, currency conversion, charts, search, and more.
            </p>
            <p className="pro-hero-scroll-msg">
              Scroll down for a full list of features, or sign up now!
            </p>
          </div>

          <div className="pro-hero-right">
            <div className="pro-card">
              <h2 className="pro-card-title">Choose a plan for after your 7-day free trial</h2>
              
              <form onSubmit={handleSubscribe}>
                <label className="pro-plan-option">
                  <input 
                    type="radio" 
                    name="pro-plan" 
                    checked={selectedPlan === 'yearly'}
                    onChange={() => setSelectedPlan('yearly')}
                    className="pro-plan-radio"
                  />
                  <div className="pro-plan-info">
                    <span className="pro-plan-name">Individual + Trip Pass</span>
                    <span className="pro-plan-duration">12 mo • $59.99</span>
                  </div>
                  <div className="pro-plan-price-block">
                    <span className="pro-plan-price">$4.99</span>
                    <span className="pro-plan-period">per month</span>
                  </div>
                </label>

                <button type="submit" className="pro-trial-btn" disabled={loading}>
                  {loading ? 'Processing...' : 'Start your free trial'}
                </button>

                <div className="pro-card-options-link">View all options</div>
              </form>

              <p className="pro-card-fineprint">
                Free trial only available to eligible first-time subscribers. Cancel 24 hours before trial ends to avoid being charged. Trial ends upon cancellation. Recurring billing after free trial, cancel anytime.
              </p>
              <div className="pro-card-links">
                <span className="pro-card-link">Terms of Service</span> • <span className="pro-card-link">Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Geometric Triangular Mountains Landscape - Vector SVG */}
        <div className="geometric-footer-mountains">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: 120, display: 'block' }}>
            <polygon points="0,120 120,40 240,120" fill="#343a40" />
            <polygon points="180,120 300,50 420,120" fill="#1cc29f" />
            <polygon points="360,120 480,30 600,120" fill="#e07745" />
            <polygon points="540,120 660,60 780,120" fill="#ace4d6" />
            <polygon points="720,120 840,40 960,120" fill="#3d3d3d" />
            <polygon points="900,120 1020,50 1140,120" fill="#7b6dcc" />
            <polygon points="1080,120 1200,30 1320,120" fill="#e05c40" />
            <polygon points="1260,120 1380,60 1440,120" fill="#149377" />
          </svg>
        </div>
      </section>

      {/* FEATURES HEADER */}
      <section className="pro-features-intro">
        <span className="pro-features-intro-tag">♦ Get Splitwise Pro for a ton of extra features:</span>
      </section>

      {/* FEATURES ROWS */}
      <section className="pro-features-section">
        
        {/* Feature 1: Pro Trip Pass */}
        <div className="pro-feature-row">
          <div className="pro-feature-media">
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="50" width="160" height="100" rx="12" fill="#7B6DCC" fillOpacity="0.1" stroke="#7B6DCC" strokeWidth="4" strokeDasharray="8 4"/>
              <circle cx="20" cy="100" r="16" fill="white" stroke="#7B6DCC" strokeWidth="4"/>
              <circle cx="180" cy="100" r="16" fill="white" stroke="#7B6DCC" strokeWidth="4"/>
              <path d="M70 105C70 93.9543 78.9543 85 90 85C101.046 85 110 93.9543 110 105" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="90" cy="73" r="12" fill="#7B6DCC"/>
              <path d="M100 115C100 106.716 106.716 100 115 100C123.284 100 130 106.716 130 115" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="115" cy="91" r="9" fill="#7B6DCC"/>
            </svg>
          </div>
          <div className="pro-feature-info">
            <h3 className="pro-feature-title">Pro Trip Pass</h3>
            <p className="pro-feature-desc">
              Upgrades any Splitwise group to Pro for 30 days, once a year. Included in yearly plans only.
            </p>
          </div>
        </div>

        {/* Feature 2: Unlimited expenses */}
        <div className="pro-feature-row reverse">
          <div className="pro-feature-media">
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 100C60 116.569 73.4315 130 90 130C101.353 130 111.233 123.684 116.485 114.364L143.515 85.6364C148.767 76.316 158.647 70 170 70C186.569 70 200 83.4315 200 100C200 116.569 186.569 130 170 130C158.647 130 148.767 123.684 143.515 114.364L116.485 85.6364C111.233 76.316 101.353 70 90 70C73.4315 70 60 83.4315 60 100Z" stroke="#7B6DCC" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="100" cy="100" r="18" fill="white" stroke="#7B6DCC" strokeWidth="4"/>
              <path d="M100 92V108M92 100H108" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="pro-feature-info">
            <h3 className="pro-feature-title">Unlimited expenses</h3>
            <p className="pro-feature-desc">
              Add as many expenses as you like each day, with no interruptions. Stay on top of your spending and stay in the moment with your friends.
            </p>
          </div>
        </div>

        {/* Feature 3: Transaction import */}
        <div className="pro-feature-row">
          <div className="pro-feature-media">
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="65" width="100" height="70" rx="8" fill="#7B6DCC" fillOpacity="0.15" stroke="#7B6DCC" strokeWidth="4" transform="rotate(-12 30 65)"/>
              <line x1="32" y1="92" x2="128" y2="72" stroke="#7B6DCC" strokeWidth="10"/>
              <rect x="75" y="45" width="75" height="130" rx="14" fill="white" stroke="#7B6DCC" strokeWidth="5"/>
              <rect x="85" y="60" width="55" height="100" rx="8" fill="#7B6DCC" fillOpacity="0.1"/>
              <rect x="102" y="52" width="20" height="4" rx="2" fill="#7B6DCC"/>
              <circle cx="112" cy="110" r="14" fill="#7B6DCC" fillOpacity="0.2"/>
              <path d="M106 110H118M112 104V116" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="pro-feature-info">
            <h3 className="pro-feature-title">Transaction import</h3>
            <p className="pro-feature-desc">
              Connect a credit or debit card to see your recent purchases — then split with just a tap. (Currently available only in the US.)
            </p>
          </div>
        </div>

        {/* Feature 4: Itemization */}
        <div className="pro-feature-row reverse">
          <div className="pro-feature-media">
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="45" y="30" width="110" height="140" rx="14" fill="#7B6DCC" fillOpacity="0.1" stroke="#7B6DCC" strokeWidth="4"/>
              <line x1="65" y1="50" x2="135" y2="50" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <line x1="65" y1="70" x2="110" y2="70" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>
              
              <circle cx="70" cy="98" r="7" fill="white" stroke="#7B6DCC" strokeWidth="3"/>
              <line x1="87" y1="98" x2="130" y2="98" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>

              <circle cx="70" cy="118" r="7" fill="white" stroke="#7B6DCC" strokeWidth="3"/>
              <line x1="87" y1="118" x2="120" y2="118" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>

              <circle cx="70" cy="138" r="7" fill="white" stroke="#7B6DCC" strokeWidth="3"/>
              <line x1="87" y1="138" x2="135" y2="138" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="pro-feature-info">
            <h3 className="pro-feature-title">Itemization</h3>
            <p className="pro-feature-desc">
              After scanning a receipt, Splitwise will detect the individual items so that you can assign them to your friends. Perfect for splitting restaurant and grocery bills.
            </p>
          </div>
        </div>

        {/* Feature 5: Expense search */}
        <div className="pro-feature-row">
          <div className="pro-feature-media">
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="90" cy="90" r="45" fill="#7B6DCC" fillOpacity="0.1" stroke="#7B6DCC" strokeWidth="6"/>
              <line x1="122" y1="122" x2="162" y2="162" stroke="#7B6DCC" strokeWidth="8" strokeLinecap="round"/>
              <path d="M70 80C70 74.4772 74.4772 70 80 70" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="pro-feature-info">
            <h3 className="pro-feature-title">Expense search</h3>
            <p className="pro-feature-desc">
              Make sure you've entered everything correctly. Our search feature will help you locate old bills so you can double-check and edit them as needed.
            </p>
          </div>
        </div>

        {/* Feature 6: Default split settings */}
        <div className="pro-feature-row reverse">
          <div className="pro-feature-media">
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="60" fill="#7B6DCC" fillOpacity="0.1" stroke="#7B6DCC" strokeWidth="5"/>
              <path d="M100 100 L100 40 A60 60 0 1 1 40 100 Z" fill="#7B6DCC" fillOpacity="0.3" stroke="#7B6DCC" strokeWidth="3"/>
              <path d="M105 95 L105 35 A60 60 0 0 0 45 95 Z" fill="#7B6DCC" fillOpacity="0.75" stroke="#7B6DCC" strokeWidth="3"/>
              <line x1="100" y1="100" x2="100" y2="40" stroke="#7B6DCC" strokeWidth="3"/>
              <line x1="100" y1="100" x2="40" y2="100" stroke="#7B6DCC" strokeWidth="3"/>
              <line x1="105" y1="95" x2="105" y2="35" stroke="#7B6DCC" strokeWidth="2"/>
              <line x1="105" y1="95" x2="45" y2="95" stroke="#7B6DCC" strokeWidth="2"/>
            </svg>
          </div>
          <div className="pro-feature-info">
            <h3 className="pro-feature-title">Default split settings</h3>
            <p className="pro-feature-desc">
              Want to split all expenses with your partner 55%/45%? Travelling with multiple families and want to assign each family a certain number of shares? Create a group default split so you can set it and forget it.
            </p>
          </div>
        </div>

        {/* Feature 7: Currency conversion */}
        <div className="pro-feature-row">
          <div className="pro-feature-media">
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="65" cy="80" r="26" fill="#7B6DCC" fillOpacity="0.15" stroke="#7B6DCC" strokeWidth="3"/>
              <path d="M60 72H72V76C72 80 69 82 65 82C61 82 58 80 58 76" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>
              <path d="M65 66V88" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>

              <circle cx="135" cy="120" r="26" fill="#7B6DCC" fillOpacity="0.15" stroke="#7B6DCC" strokeWidth="3"/>
              <path d="M142 112H130V128H142M130 120H138" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>

              <path d="M105 75C118 85 118 95 105 105" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <path d="M102 71L107 77M102 71L97 76" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>

              <path d="M95 125C82 115 82 105 95 95" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <path d="M98 129L93 123M98 129L103 124" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="pro-feature-info">
            <h3 className="pro-feature-title">Currency conversion</h3>
            <p className="pro-feature-desc">
              Going abroad? Splitwise can convert all your bills to any currency you'd like, using today's foreign exchange rates.
            </p>
          </div>
        </div>

        {/* Feature 8: Charts and graphs */}
        <div className="pro-feature-row reverse">
          <div className="pro-feature-media">
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="40" y="110" width="22" height="50" rx="3" fill="#7B6DCC"/>
              <rect x="74" y="80" width="22" height="80" rx="3" fill="#7B6DCC"/>
              <rect x="108" y="95" width="22" height="65" rx="3" fill="#7B6DCC"/>
              <rect x="142" y="60" width="22" height="100" rx="3" fill="#7B6DCC"/>
              <path d="M40 70L74 50L108 65L142 30" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="40" cy="70" r="5" fill="white" stroke="#7B6DCC" strokeWidth="3"/>
              <circle cx="74" cy="50" r="5" fill="white" stroke="#7B6DCC" strokeWidth="3"/>
              <circle cx="108" cy="65" r="5" fill="white" stroke="#7B6DCC" strokeWidth="3"/>
              <circle cx="142" cy="30" r="5" fill="white" stroke="#7B6DCC" strokeWidth="3"/>
            </svg>
          </div>
          <div className="pro-feature-info">
            <h3 className="pro-feature-title">Charts and graphs</h3>
            <p className="pro-feature-desc">
              Keep your budget on track, at home or on a trip. We break down your spending by category and show you trends over time, so you can identify excessive spending and save money.
            </p>
          </div>
        </div>

        {/* Feature 9: Receipt scanning */}
        <div className="pro-feature-row">
          <div className="pro-feature-media">
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 70V50H70" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <path d="M150 70V50H130" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <path d="M50 130V150H70" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <path d="M150 130V150H130" stroke="#7B6DCC" strokeWidth="4" strokeLinecap="round"/>
              <rect x="65" y="65" width="70" height="70" rx="6" fill="#7B6DCC" fillOpacity="0.1" stroke="#7B6DCC" strokeWidth="3"/>
              <line x1="75" y1="80" x2="125" y2="80" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>
              <line x1="75" y1="95" x2="115" y2="95" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>
              <line x1="75" y1="110" x2="120" y2="110" stroke="#7B6DCC" strokeWidth="3" strokeLinecap="round"/>
              <line x1="45" y1="100" x2="155" y2="100" stroke="#E15C32" strokeWidth="3" strokeDasharray="4 2"/>
            </svg>
          </div>
          <div className="pro-feature-info">
            <h3 className="pro-feature-title">Receipt scanning</h3>
            <p className="pro-feature-desc">
              Add complicated bills to Splitwise with ease! Just take a picture of your receipt, and Splitwise will automatically scan its contents.
            </p>
          </div>
        </div>

      </section>

      {/* PLUS SECTION */}
      <section className="pro-plus-banner">
        <h2 className="pro-plus-title">Plus...</h2>
      </section>

      <section className="pro-plus-features">
        <div className="pro-plus-feature">
          <div className="pro-plus-media">
            <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 30 L160 80 L100 170 L40 80 Z" fill="#7B6DCC" fillOpacity="0.15" stroke="#7B6DCC" strokeWidth="5" strokeLinejoin="round"/>
              <path d="M100 30 L100 170" stroke="#7B6DCC" strokeWidth="2"/>
              <path d="M40 80 L160 80" stroke="#7B6DCC" strokeWidth="2"/>
              <path d="M100 30 L70 80 L100 170 L130 80 Z" stroke="#7B6DCC" strokeWidth="2.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="pro-plus-feature-title">Early access to new features</h3>
          <p className="pro-plus-feature-desc">
            Shape the future of Splitwise by sharing your feedback directly with our product and engineering teams. Get early access to redesigns and major new features.
          </p>
        </div>

        <div className="pro-plus-feature">
          <div className="pro-plus-media">
            <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 80 H80 L130 40 V160 L80 120 H50 V80 Z" fill="#7B6DCC" fillOpacity="0.15" stroke="#7B6DCC" strokeWidth="5" strokeLinejoin="round"/>
              <path d="M70 120 V150 H90 V120" stroke="#7B6DCC" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="100" cy="100" r="70" stroke="#7B6DCC" strokeWidth="6"/>
              <line x1="50" y1="50" x2="150" y2="150" stroke="#7B6DCC" strokeWidth="6"/>
            </svg>
          </div>
          <h3 className="pro-plus-feature-title">A totally ad-free experience</h3>
          <p className="pro-plus-feature-desc">
            Use the Splitwise app without any interruptions, and help support future development of Splitwise!
          </p>
        </div>
      </section>

      {/* SITEMAP FOOTER */}
      <footer className="pro-footer-sitemap">
        <div className="pro-footer-sitemap-grid">
          <div className="pro-footer-sitemap-col">
            <h4>Splitwise</h4>
            <span className="sitemap-link">About</span>
            <span className="sitemap-link">Press</span>
            <span className="sitemap-link">Blog</span>
            <span className="sitemap-link">Jobs</span>
            <span className="sitemap-link">Calculators</span>
            <span className="sitemap-link">API</span>
          </div>

          <div className="pro-footer-sitemap-col">
            <h4>Account</h4>
            <span className="sitemap-link">Log in</span>
            <span className="sitemap-link">Sign up</span>
            <span className="sitemap-link">Reset password</span>
            <span className="sitemap-link">Settings</span>
            <span className="sitemap-link">Splitwise Pro</span>
            <span className="sitemap-link">Splitwise Pay</span>
            <span className="sitemap-link">Splitwise Card</span>
          </div>

          <div className="pro-footer-sitemap-col">
            <h4>More</h4>
            <span className="sitemap-link">Contact us</span>
            <span className="sitemap-link">FAQ</span>
            <span className="sitemap-link">Site status</span>
            <span className="sitemap-link">Terms of Service</span>
            <span className="sitemap-link">Privacy Policy</span>
            <span className="sitemap-link">Coastal Community Bank Privacy Policy</span>
          </div>

          <div className="pro-footer-sitemap-badges">
            <div className="store-badge-buttons">
              {/* Google Play Store Badge SVG replica */}
              <div className="store-badge play-store">
                <svg width="135" height="40" viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="135" height="40" rx="6" fill="black"/>
                  <path d="M15 11L25 17L15 23V11Z" fill="#00E676"/>
                  <path d="M25 17L30 20L25 23V17Z" fill="#FFC107"/>
                  <path d="M25 17L15 11H25V17Z" fill="#00b0ff"/>
                  <path d="M25 17L15 23H25V17Z" fill="#ff3d00"/>
                  <text x="35" y="16" fill="white" fontSize="7" fontFamily="Arial" fontWeight="bold">GET IT ON</text>
                  <text x="35" y="27" fill="white" fontSize="11" fontFamily="Arial" fontWeight="900">Google Play</text>
                </svg>
              </div>
              {/* App Store Badge SVG replica */}
              <div className="store-badge app-store">
                <svg width="135" height="40" viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="135" height="40" rx="6" fill="black" stroke="#A6A6A6" strokeWidth="1"/>
                  <path d="M20 13.5C20 11.5 21.6 10.5 21.7 10.4C20.7 9 19.3 8.8 18.8 8.8C17.6 8.7 16.4 9.5 15.8 9.5C15.2 9.5 14.2 8.8 13.2 8.8C11.9 8.8 10.7 9.5 10.0 10.7C8.6 13.1 9.7 16.6 11.0 18.5C11.7 19.4 12.4 20.4 13.4 20.4C14.4 20.4 14.8 19.8 15.9 19.8C17.0 19.8 17.4 20.4 18.4 20.4C19.4 20.4 20.1 19.5 20.7 18.6C21.4 17.6 21.7 16.6 21.7 16.5C21.6 16.5 20 15.9 20 14.1C20 12.5 21.3 11.7 21.4 11.6C20.6 10.5 19.4 10.4 20 13.5ZM17.2 6.8C17.7 6.2 18.0 5.4 17.9 4.6C17.2 4.6 16.3 5.1 15.8 5.7C15.4 6.2 15.0 7.0 15.1 7.8C15.9 7.9 16.7 7.4 17.2 6.8Z" fill="white"/>
                  <text x="35" y="15" fill="white" fontSize="6.5" fontFamily="Arial">Download on the</text>
                  <text x="35" y="27" fill="white" fontSize="12" fontFamily="Arial" fontWeight="bold">App Store</text>
                </svg>
              </div>
            </div>
            <div className="sitemap-made-in">Made with :) in Providence, RI, USA</div>
          </div>
        </div>

        {/* Geometric Triangular Mountains Landscape at the very bottom of the page */}
        <div className="geometric-footer-mountains-bottom">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: 120, display: 'block' }}>
            <polygon points="0,120 120,40 240,120" fill="#343a40" />
            <polygon points="180,120 300,50 420,120" fill="#1cc29f" />
            <polygon points="360,120 480,30 600,120" fill="#e07745" />
            <polygon points="540,120 660,60 780,120" fill="#ace4d6" />
            <polygon points="720,120 840,40 960,120" fill="#3d3d3d" />
            <polygon points="900,120 1020,50 1140,120" fill="#7b6dcc" />
            <polygon points="1080,120 1200,30 1320,120" fill="#e05c40" />
            <polygon points="1260,120 1380,60 1440,120" fill="#149377" />
          </svg>
        </div>
      </footer>

    </div>
  );
}

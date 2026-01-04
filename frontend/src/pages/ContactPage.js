import React, { useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
// Removed Telegram dependencies - now pure web app
import AnimatedBackground from '../components/AnimatedBackground';

const ContactPage = () => {

  useEffect(() => {
    // Track page view
    analyticsAPI.trackClick({
      page: 'contact',
      action: 'page_view',
      meta_data: {}
    }).catch(console.error);

    // Card appearance animation
    if (window.anime) {
      window.anime({
        targets: '.contact-card',
        translateY: [50, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800,
        delay: window.anime.stagger(150),
        easing: 'easeOutCubic'
      });

      // Floating animation for icons
      window.anime({
        targets: '.floating-icon',
        translateY: [-8, 8],
        duration: 3000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: window.anime.stagger(500)
      });

      // Pulsing animation for buttons
      window.anime({
        targets: '.pulse-button',
        scale: [1, 1.05, 1],
        duration: 2000,
        loop: true,
        easing: 'easeInOutSine',
        delay: window.anime.stagger(300)
      });
    }
  }, []);

  const handleContactClick = async (contactType, contactValue) => {
    // Track contact click
    await analyticsAPI.trackClick({
      page: 'contact',
      action: 'contact_click',
      meta_data: { contact_type: contactType, contact_value: contactValue }
    }).catch(console.error);

    if (contactType === 'telegram') {
      window.open(contactValue, '_blank');
    } else if (contactType === 'email') {
      window.location.href = `mailto:${contactValue}`;
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      <AnimatedBackground variant="neural" />
      <div className="max-w-md mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 contact-card">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-slate-600 to-slate-700 rounded-full mx-auto flex items-center justify-center floating-icon shadow-2xl shadow-blue-500/60 border-2 border-blue-400/40 relative">
              <span className="text-3xl text-white drop-shadow-2xl relative z-10">📞</span>
              {/* Пульсирующее свечение только вокруг иконки, не влияющее на текст */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-slate-600/30 to-slate-700/30 rounded-full animate-pulse"></div>
            </div>
            {/* Внешнее пульсирующее кольцо */}
            <div className="absolute inset-0 w-28 h-28 bg-gradient-to-r from-blue-500/20 via-slate-600/20 to-slate-700/20 rounded-full mx-auto animate-pulse"></div>
          </div>
          
          <div className="relative mb-4">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/40 shadow-2xl shadow-cyan-500/30 mb-4 relative">
              <h1 className="text-4xl font-black mb-3 drop-shadow-2xl tracking-wider text-center relative z-10">
                <span className="text-white drop-shadow-lg">
                  CONTACT ME
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-slate-500 to-slate-600 mx-auto rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
              {/* Пульсирующая рамка вокруг блока */}
              <div className="absolute inset-0 border border-cyan-400/20 rounded-2xl animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 max-w-sm mx-auto">
            <p className="text-cyan-100 text-base font-semibold drop-shadow-lg leading-relaxed">
              <span className="text-yellow-300 text-lg">🚀</span> Have questions about training or need a custom product? 
              <br />
              <span className="text-blue-300 font-bold">Ready to help!</span> 
              <span className="text-cyan-300 text-lg ml-1">⚡</span>
            </p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="space-y-4 mb-8">
          {/* Telegram */}
          <div
            className="relative bg-gray-900/95 rounded-2xl shadow-2xl shadow-cyan-500/30 p-8 cursor-pointer hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-500 contact-card pulse-button border-2 border-cyan-500/40 hover:border-cyan-400/70 overflow-hidden group"
            onClick={() => handleContactClick('telegram', 'https://t.me/yaroslav_english')}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-slate-600/10 to-slate-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center relative z-10">
              <div className="relative mr-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 rounded-2xl flex items-center justify-center floating-icon shadow-2xl shadow-cyan-500/60 border-2 border-cyan-300/60 relative">
                  <span className="text-2xl text-white drop-shadow-2xl relative z-10">📱</span>
                  {/* Пульсирующий слой только для свечения */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-blue-700/20 rounded-2xl animate-pulse"></div>
                </div>
                {/* Внешнее пульсирующее свечение */}
                <div className="absolute inset-0 w-20 h-20 bg-cyan-400/10 rounded-2xl animate-pulse"></div>
              </div>
              
              <div className="flex-1">
                <div className="mb-2">
                  <h3 className="font-black text-2xl bg-gradient-to-r from-cyan-300 via-blue-300 to-blue-500 bg-clip-text text-transparent tracking-wider drop-shadow-lg">
                    TELEGRAM
                  </h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mt-1"></div>
                </div>
                
                <p className="text-cyan-100 text-sm font-semibold mb-2 flex items-center">
                  <span className="text-yellow-300 mr-1">⚡</span> 
                  Quick response within an hour
                </p>
                
                <div className="bg-gray-800/60 rounded-lg px-3 py-2 border border-blue-500/30 shadow-lg">
                  <p className="text-blue-300 text-base font-black tracking-wide">
                    @yaroslav_english
                  </p>
                </div>
              </div>
              
              <div className="ml-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full flex items-center justify-center border border-cyan-400/40 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-cyan-300 text-2xl animate-pulse group-hover:animate-bounce">→</span>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-gray-900/95 rounded-xl shadow-2xl shadow-blue-500/20 p-6 mb-8 contact-card border border-blue-500/30">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-slate-600 to-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center floating-icon shadow-2xl shadow-blue-500/50 border-2 border-blue-400/50">
              <span className="text-2xl text-white drop-shadow-lg">💻</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-slate-400 to-slate-500 bg-clip-text text-transparent mb-2">
              CUSTOM PRODUCT DEVELOPMENT
            </h2>
            <p className="text-blue-100/80 text-sm font-medium">
              🔥 In addition to training, I develop digital products 🚀
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/90 rounded-lg p-4 text-center hover:scale-105 hover:shadow-cyan-500/30 transition-all duration-300 contact-card shadow-lg border border-cyan-500/20 hover:border-cyan-400/50">
              <div className="text-2xl mb-2 floating-icon drop-shadow-lg">🛍️</div>
              <h3 className="font-bold text-cyan-300 text-sm mb-1">ONLINE STORES</h3>
              <p className="text-cyan-100/70 text-xs">Full-featured stores with payment</p>
            </div>
            
            <div className="bg-gray-800/90 rounded-lg p-4 text-center hover:scale-105 hover:shadow-blue-500/30 transition-all duration-300 contact-card shadow-lg border border-blue-500/20 hover:border-blue-400/50">
              <div className="text-2xl mb-2 floating-icon drop-shadow-lg">📱</div>
              <h3 className="font-bold text-blue-300 text-sm mb-1">MINI APPS</h3>
              <p className="text-blue-100/70 text-xs">Telegram Mini Apps for business</p>
            </div>
            
            <div className="bg-gray-800/90 rounded-lg p-4 text-center hover:scale-105 hover:shadow-green-500/30 transition-all duration-300 contact-card shadow-lg border border-green-500/20 hover:border-green-400/50">
              <div className="text-2xl mb-2 floating-icon drop-shadow-lg">🤖</div>
              <h3 className="font-bold text-green-300 text-sm mb-1">TELEGRAM BOTS</h3>
              <p className="text-green-100/70 text-xs">Automation and integrations</p>
            </div>
            
            <div className="bg-gray-800/90 rounded-lg p-4 text-center hover:scale-105 hover:shadow-slate-500/30 transition-all duration-300 contact-card shadow-lg border border-slate-500/20 hover:border-slate-400/50">
              <div className="text-2xl mb-2 floating-icon drop-shadow-lg">⚙️</div>
              <h3 className="font-bold text-slate-300 text-sm mb-1">CUSTOM SOLUTIONS</h3>
              <p className="text-slate-100/70 text-xs">Any ideas for your tasks</p>
            </div>
          </div>

          <div className="bg-gray-800/90 rounded-lg p-4 shadow-lg border border-yellow-500/30 hover:border-yellow-400/50 transition-colors duration-300">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2 floating-icon drop-shadow-lg">💡</span>
              <h3 className="font-bold text-yellow-300">WHAT I CAN DO:</h3>
            </div>
            <ul className="text-yellow-100/80 text-sm space-y-1 font-medium">
              <li>⚡ Create exactly the same store/application as this</li>
              <li>🤖 Integrate AI into your business process</li>
              <li>🔄 Automate routine tasks</li>
              <li>🚀 Develop a unique solution for your needs</li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-900/95 rounded-xl shadow-2xl shadow-blue-500/20 p-6 mb-6 contact-card border border-blue-500/30">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-blue-300 mb-2">
                📚 How to choose the right course?
              </h3>
              <p className="text-blue-100/80 text-sm">
                Write to me about your experience and goals. I'll help you choose the optimal learning option.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-cyan-300 mb-2">
                💻 Can you make a similar product?
              </h3>
              <p className="text-cyan-100/80 text-sm">
                Yes! I can create exactly the same application, bot or store. Let's discuss your requirements and deadlines.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-green-300 mb-2">
                💳 What payment methods are available?
              </h3>
              <p className="text-green-100/80 text-sm">
                I accept card payments via YooKassa. For development, phased payment is possible.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-blue-300 mb-2">
                ⏰ How long will development take?
              </h3>
              <p className="text-blue-100/80 text-sm">
                Depends on project complexity. Simple bot - 1-2 weeks, mini app - 2-4 weeks.
              </p>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-gray-900/95 rounded-xl p-6 mb-6 contact-card shadow-2xl shadow-yellow-500/20 border border-yellow-500/30">
          <div className="text-center">
            <div className="text-3xl mb-2 floating-icon drop-shadow-lg">⚡</div>
            <h3 className="font-bold text-yellow-300 mb-2 text-lg">
              QUICK RESPONSE GUARANTEED
            </h3>
            <div className="text-sm">
              <div className="font-bold text-yellow-200">TELEGRAM</div>
              <div className="text-yellow-100/80">within an hour</div>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-gray-900/95 rounded-xl shadow-2xl shadow-green-500/20 p-6 mb-6 contact-card border border-green-500/30">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mx-auto mb-3 flex items-center justify-center floating-icon shadow-lg shadow-blue-500/50 border border-blue-300/50">
              <span className="text-white text-xl drop-shadow-lg">🕒</span>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              WORKING HOURS
            </h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center bg-gray-800/60 rounded-lg p-3 border border-green-500/20">
              <span className="text-green-200 font-medium">Monday - Friday</span>
              <span className="font-bold text-green-300">9:00 - 21:00</span>
            </div>
            <div className="flex justify-between items-center bg-gray-800/60 rounded-lg p-3 border border-green-500/20">
              <span className="text-green-200 font-medium">Saturday</span>
              <span className="font-bold text-green-300">10:00 - 18:00</span>
            </div>
            <div className="flex justify-between items-center bg-gray-800/60 rounded-lg p-3 border border-green-500/20">
              <span className="text-green-200 font-medium">Sunday</span>
              <span className="font-bold text-green-300">12:00 - 16:00</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-slate-600/20 rounded-lg shadow-lg border border-blue-500/30">
            <p className="text-blue-200 text-xs font-medium">
              <span className="floating-icon inline-block mr-1 drop-shadow-lg">💡</span> Outside working hours I respond the next day
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-gray-900/95 rounded-xl shadow-2xl shadow-slate-500/20 p-6 contact-card border border-slate-500/30">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center floating-icon shadow-lg shadow-slate-500/50 border border-slate-300/50">
              <span className="text-white text-xl drop-shadow-lg">⭐</span>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">
              CLIENT REVIEWS
            </h2>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800/60 rounded-lg p-4 border-l-4 border-blue-500 shadow-lg border border-blue-500/20">
              <p className="text-blue-100 text-sm italic mb-2 font-medium">
                "Responds very quickly and is always ready to help. Explains complex things in simple language."
              </p>
              <div className="text-xs text-blue-300 font-bold">— Michael, AI course student</div>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-4 border-l-4 border-green-500 shadow-lg border border-green-500/20">
              <p className="text-green-100 text-sm italic mb-2 font-medium">
                "Made a Telegram bot for us to automate orders. Works perfectly!"
              </p>
              <div className="text-xs text-green-300 font-bold">— Jessica, online store owner</div>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-4 border-l-4 border-blue-500 shadow-lg border border-blue-500/20">
              <p className="text-blue-100 text-sm italic mb-2 font-medium">
                "Created exactly the same mini-app as competitors, but even better. Recommend!"
              </p>
              <div className="text-xs text-blue-300 font-bold">— David, entrepreneur</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

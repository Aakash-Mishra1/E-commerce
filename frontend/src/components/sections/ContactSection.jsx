import React from 'react';
import SectionTitle from '../common/SectionTitle';
import GlassCard from '../common/GlassCard';
import InputField from '../common/InputField';
import Button from '../common/Button';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-4 md:px-20 max-w-4xl mx-auto">
      <SectionTitle label="05. What's Next?" title="Get In Touch" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="text-left">
             <h3 className="text-2xl font-bold text-white mb-4 font-poppins">Let's Talk</h3>
             <p className="text-gray-300 text-lg mb-8 font-inter leading-relaxed">
                Although I'm not currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
             </p>
             <div className="space-y-4 font-mono text-sm text-gray-400">
                <p>📧 email@example.com</p>
                <p>📍 City, Country</p>
             </div>
        </div>

        <GlassCard className="p-8">
            <form className="space-y-6">
                <div>
                     <InputField placeholder="Name" />
                </div>
                <div>
                     <InputField placeholder="Email" type="email" />
                </div>
                <div>
                     <textarea 
                        className="w-full bg-transparent border-b-2 border-white/20 p-3 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyber-neon focus:shadow-[0_4px_10px_-4px_#00BFFF] transition-all duration-300 min-h-[120px] resize-none"
                        placeholder="Message"
                    ></textarea>
                </div>
                
                <Button size="lg" className="w-full">Send Message</Button>
            </form>
        </GlassCard>
      </div>
    </section>
  );
};

export default ContactSection;
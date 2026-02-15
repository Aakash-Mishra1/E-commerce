import React from 'react';
import AppWrapper from '../components/layout/AppWrapper';
import ContactSection from '../components/sections/ContactSection';

const Contact = () => {
    return (
        <AppWrapper>
             <div className="pt-20">
                <ContactSection />
             </div>
        </AppWrapper>
    );
};

export default Contact;
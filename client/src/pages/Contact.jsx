import React, { useState } from 'react';
import { submitContact } from '../services/api';
import { useToast } from '../context/ToastContext';
import { validateName, validateEmail } from '../validations/rules';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Validation States
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client validations
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    let subjectErr = '';
    let msgErr = '';

    if (!subject.trim()) subjectErr = 'Subject is required';
    if (!message.trim() || message.trim().length < 10) msgErr = 'Message must be at least 10 characters';

    if (nameErr || emailErr || subjectErr || msgErr) {
      setErrors({
        name: nameErr || '',
        email: emailErr || '',
        subject: subjectErr || '',
        message: msgErr || ''
      });
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const { data } = await submitContact({ name, email, subject, message });
      if (data.success) {
        addToast('Your inquiry has been submitted. Our team will contact you shortly!', 'success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-asphalt min-h-screen pt-20 pb-20 text-chalk">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 space-y-12">
        
        {/* Header Title */}
        <header className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[9px] font-bold text-neon-accent tracking-widest uppercase block">01 / CHANNELS</span>
          <h1 className="text-3xl sm:text-5xl font-display uppercase tracking-widest text-chalk">CONTACT OPERATIONS</h1>
          <p className="text-silver text-xs leading-relaxed uppercase tracking-wider">
            Have questions about bookings, rentals, corporate rates, or our fleet telemetry? Get in touch with our operations team.
          </p>
        </header>

        {/* Content grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Support credentials info panel */}
          <div className="md:col-span-5 bg-graphite/40 border border-white/5 p-6 sm:p-8 space-y-8">
            <h2 className="text-xs font-bold text-chalk uppercase tracking-widest">Inquiry Channels</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-asphalt text-neon-accent border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-chalk text-xs uppercase tracking-widest">Email Address</h3>
                  <a href="mailto:support@torque.com" className="text-xs text-silver hover:text-neon-accent font-bold block mt-1 uppercase tracking-wider">
                    support@torque.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-asphalt text-neon-accent border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-chalk text-xs uppercase tracking-widest">Phone Line</h3>
                  <a href="tel:+912942400000" className="text-xs text-silver hover:text-neon-accent font-bold block mt-1 uppercase tracking-wider">
                    +91 (294) 240-0000
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-asphalt text-neon-accent border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-chalk text-xs uppercase tracking-widest">Operations HQ</h3>
                  <span className="text-xs text-silver block mt-1 font-bold uppercase leading-relaxed tracking-wider">
                    100 Premium Road, City Centre<br />
                    Udaipur, Rajasthan 313001
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form inputs panel */}
          <div className="md:col-span-7 bg-graphite/40 border border-white/5 p-6 sm:p-8">
            <h2 className="text-xs font-bold text-chalk uppercase tracking-widest mb-6">Send an Online Inquiry</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  name="name"
                  required
                  value={name}
                  error={errors.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="ENTER FULL NAME"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  error={errors.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="ENTER EMAIL ADDRESS"
                />
              </div>

              <Input
                label="Subject Topic"
                name="subject"
                required
                value={subject}
                error={errors.subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (errors.subject) setErrors(prev => ({ ...prev, subject: '' }));
                }}
                placeholder="TOPIC HEADING"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-silver uppercase tracking-widest select-none">Message Body</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                  }}
                  placeholder="Describe your inquiry details here... (min 10 chars)"
                  className={`block w-full px-3.5 py-3 bg-graphite border text-xs resize-none placeholder-silver/45 text-chalk focus:outline-none focus:border-neon-accent rounded-none ${
                    errors.message ? 'border-rose-900 bg-rose-955/20 focus:border-rose-500' : 'border-white/10'
                  }`}
                />
                {errors.message && (
                  <span role="alert" className="text-rose-455 text-[9px] font-bold tracking-widest uppercase mt-0.5">
                    {errors.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                loading={loading}
                className="px-6 py-3.5 text-xs"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            </form>
          </div>

        </section>

      </div>
    </main>
  );
};

export default Contact;

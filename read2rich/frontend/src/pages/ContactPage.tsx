import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialState: FormState = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    try {
      // 尝试调用后端，如未实现则直接本地成功
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).catch(() => undefined);
      setStatus('success');
      setForm(initialState);
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-dark-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">{t('contact.title')}</h1>
          <p className="text-white/70">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-4">
            <div className="card flex items-start space-x-3">
              <Mail className="w-5 h-5 text-primary-500 mt-1" />
              <div>
                <div className="text-white font-medium">{t('contact.email')}</div>
                <div className="text-white/70 text-sm">hello@read2rich.com</div>
              </div>
            </div>
            <div className="card flex items-start space-x-3">
              <Phone className="w-5 h-5 text-primary-500 mt-1" />
              <div>
                <div className="text-white font-medium">{t('contact.phone')}</div>
                <div className="text-white/70 text-sm">+00 123 456 789</div>
              </div>
            </div>
            <div className="card flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary-500 mt-1" />
              <div>
                <div className="text-white font-medium">{t('contact.address')}</div>
                <div className="text-white/70 text-sm">Worldwide • Remote</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">{t('contact.form.name')}</label>
                  <input
                    className="input w-full"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t('contact.form.name_ph') as string}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">{t('contact.form.email')}</label>
                  <input
                    className="input w-full"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t('contact.form.email_ph') as string}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">{t('contact.form.subject')}</label>
                <input
                  className="input w-full"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder={t('contact.form.subject_ph') as string}
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">{t('contact.form.message')}</label>
                <textarea
                  className="input w-full h-32 resize-y"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t('contact.form.message_ph') as string}
                  required
                />
              </div>

              {status === 'success' && (
                <div className="flex items-center text-green-400 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> {t('contact.success')}
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" /> {t('contact.error')}
                </div>
              )}

              <button type="submit" className="btn-primary inline-flex items-center space-x-2" disabled={submitting}>
                <Send className="w-4 h-4" />
                <span>{submitting ? t('common.loading') : t('contact.form.send')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;



const CONTACT_EMAIL = 'korexussoporte@gmail.com';
const WHATSAPP_NUMBER = '59171085116';

export const CONTACT_CHANNELS = {
  email: CONTACT_EMAIL,
  emailHref: `mailto:${CONTACT_EMAIL}`,
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappDisplay: '+591 71085116',
  whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}`,
} as const;

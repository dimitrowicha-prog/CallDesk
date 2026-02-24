import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: [
      { label: 'Начало', href: '/' },
      { label: 'Цени', href: '/pricing' },
      { label: 'Въпроси', href: '/faq' },
      { label: 'Контакти', href: '/contact' },
    ],
    legal: [
      { label: 'Поверителност', href: '/privacy' },
      { label: 'Условия за ползване', href: '/terms' },
    ],
  };

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-black">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-black">CallDesk</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md text-lg">
              AI рецепционист за фризьорски и козметични салони.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5 text-black" />
                <span>contact@calldesk.bg</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-5 w-5 text-black" />
                <span>+359 2 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-5 w-5 text-black" />
                <span>София, България</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4 text-sm uppercase tracking-wider">Страници</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-black mb-4 text-sm uppercase tracking-wider">Правна информация</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CallDesk. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
}

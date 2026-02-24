'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Условия за ползване
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Последна актуализация: {new Date().toLocaleDateString('bg-BG')}
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Общи условия</h2>
              <p className="text-gray-700 leading-relaxed">
                Добре дошли в CallDesk. Използвайки нашата услуга, вие се съгласявате с тези условия за ползване. Моля, прочетете ги внимателно преди да започнете да използвате платформата.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Описание на услугата</h2>
              <p className="text-gray-700 leading-relaxed">
                CallDesk предоставя AI базирана рецепционистка услуга за фризьорски и козметични салони. Услугата включва автоматично приемане на обаждания, записване на часове, изпращане на потвърждения и управление на календари.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Регистрация и акаунт</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                За да използвате услугата, трябва:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Да сте навършили 18 години или да имате родителско съгласие</li>
                <li>Да предоставите точна и актуална информация при регистрация</li>
                <li>Да поддържате сигурността на вашия акаунт</li>
                <li>Да уведомите CallDesk незабавно при неоторизиран достъп</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Цени и плащания</h2>
              <p className="text-gray-700 leading-relaxed">
                Цените на услугата са посочени на страницата за ценообразуване. Ние си запазваме правото да променяме цените с предварително уведомление от 30 дни. Плащанията се извършват месечно или годишно, в зависимост от избрания план.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Прекратяване</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Вие можете да прекратите услугата по всяко време от панела за управление. CallDesk си запазва правото да прекрати достъпа ви при нарушение на тези условия.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Отговорност</h2>
              <p className="text-gray-700 leading-relaxed">
                CallDesk се предоставя "както е". Ние полагаме максимални усилия за непрекъснатост на услугата, но не гарантираме 100% време на достъпност или перфектно разпознаване на всички разговори.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Контакти</h2>
              <p className="text-gray-700 leading-relaxed">
                За въпроси относно тези условия, моля свържете се с нас:
              </p>
              <p className="text-gray-700 mt-4">
                Имейл: legal@calldesk.bg<br />
                Телефон: +359 2 123 4567<br />
                Адрес: София, България
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Политика за поверителност
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Последна актуализация: {new Date().toLocaleDateString('bg-BG')}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Въведение</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                CallDesk („ние", „нашият") зачита поверителността на вашите лични данни и се ангажира да ги защитава. Тази политика за поверителност обяснява как събираме, използваме, съхраняваме и защитаваме вашата информация.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Какви данни събираме</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ние събираме следните видове информация:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Идентификационна информация: име, имейл адрес, телефонен номер</li>
                <li>Бизнес информация: име на салон, град, брой обекти</li>
                <li>Комуникационни данни: съдържание на съобщения и обаждания</li>
                <li>Технически данни: IP адрес, тип на браузъра, време на достъп</li>
                <li>Данни за резервации: време, услуга, специалист</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">3. Как използваме данните</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Вашите данни се използват за:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Предоставяне на услугата CallDesk</li>
                <li>Обработка и потвърждаване на резервации</li>
                <li>Комуникация с вас относно услугата</li>
                <li>Подобряване на качеството на услугата</li>
                <li>Изпращане на известия и напомняния</li>
                <li>Анализ и статистика (анонимизирани данни)</li>
                <li>Спазване на законови изисквания</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Споделяне на данни</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ние НЕ продаваме вашите лични данни. Споделяме информация само когато:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Е необходимо за предоставяне на услугата (напр. SMS доставчици)</li>
                <li>Имаме ваше изрично съгласие</li>
                <li>Е изискано от закона</li>
                <li>С доверени партньори, обвързани с конфиденциалност</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">5. Съхранение и сигурност</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Вашите данни се съхраняват в защитени сървъри в Европа. Използваме:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>SSL/TLS криптиране за прехвърляне на данни</li>
                <li>Криптиране на базата данни</li>
                <li>Редовни резервни копия</li>
                <li>Ограничен достъп само за оторизиран персонал</li>
                <li>Регулярни одити на сигурността</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Данните се съхраняват толкова дълго, колкото е необходимо за предоставяне на услугата или както изисква законът. След прекратяване на услугата, данните се изтриват в рамките на 30 дни, освен ако законът не изисква по-дълго съхранение.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Вашите права (GDPR)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Съгласно GDPR, вие имате право да:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Получите достъп до вашите данни</li>
                <li>Коригирате неточни данни</li>
                <li>Изтриете вашите данни („право да бъдете забравени")</li>
                <li>Ограничите обработката на вашите данни</li>
                <li>Прехвърлите данните си (преносимост)</li>
                <li>Оттеглите съгласие по всяко време</li>
                <li>Подадете жалба до надзорен орган</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                За да упражните тези права, свържете се с нас на: privacy@calldesk.bg
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Бисквитки (Cookies)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Нашият уебсайт използва бисквитки за:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Основна функционалност на сайта</li>
                <li>Запазване на предпочитания</li>
                <li>Анализ на трафика (Google Analytics)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Можете да контролирате бисквитките от настройките на вашия браузър.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Трети страни</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Използваме следните външни услуги:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Google Calendar (за календарна интеграция)</li>
                <li>SMS доставчик (за SMS известия)</li>
                <li>Имейл доставчик (за имейл комуникация)</li>
                <li>Платежни системи (за обработка на плащания)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Тези доставчици имат собствени политики за поверителност и ги избираме внимателно.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Деца</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Нашата услуга не е предназначена за лица под 16 години. Не събираме съзнателно данни от деца.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Промени в политиката</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Можем да актуализираме тази политика периодично. Ще ви уведомим за съществени промени чрез имейл или известие в платформата. Промените влизат в сила след публикуване.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Контакти</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                За въпроси относно тази политика или вашите данни:
              </p>
              <p className="text-gray-700">
                Имейл: privacy@calldesk.bg<br />
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

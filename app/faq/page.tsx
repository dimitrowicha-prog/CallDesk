'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: 'Колко време отнема настройката на CallDesk?',
      answer:
        'Настройката е много бърза и лесна. След регистрация, добавяте информация за вашите услуги, работно време и предпочитания. Целият процес отнема около 15-20 минути. Нашият екип е на разположение да ви помогне на всяка стъпка.',
    },
    {
      question: 'Нужен ли е нов телефонен номер?',
      answer:
        'Не, можете да използвате съществуващия си номер. CallDesk работи чрез преадресация на обажданията - когато получите обаждане, то може автоматично да се прехвърля към системата. Ако предпочитате, можем да предоставим и нов номер специално за автоматизираните резервации.',
    },
    {
      question: 'Може ли клиентите да говорят с човек, ако поискат?',
      answer:
        'Да, абсолютно! CallDesk може да прехвърля обаждането към член на вашия екип по всяко време - автоматично при определени ситуации или по желание на клиента. Системата разпознава кога е необходима човешка намеса.',
    },
    {
      question: 'Какво се случва, ако системата не разбере клиента?',
      answer:
        'AI технологията е много напреднала и разбира естествен български език, но в редки случаи, когато има неясноти, системата ще постави уточняващи въпроси или ще предложи прехвърляне към член на екипа. Също така, можете да прегледате всички разговори и да коригирате настройките.',
    },
    {
      question: 'Как се записват часовете в календара?',
      answer:
        'CallDesk се интегрира с вашия Google Calendar или използва собствен календар в платформата. Когато клиент запише час, той автоматично се появява в календара с всички детайли - име, телефон, услуга, час. Вие и клиентът получавате потвърждения и напомняния.',
    },
    {
      question: 'Работи ли системата 24/7?',
      answer:
        'Да, CallDesk работи денонощно, всеки ден от седмицата. Дори когато салонът е затворен или персоналът е зает, клиентите могат да запишат час. Можете да настроите работното време, в което искате да се приемат резервации.',
    },
    {
      question: 'Какви салони са подходящи за CallDesk?',
      answer:
        'CallDesk е създаден специално за фризьорски салони, барбершопове, студиа за маникюр и педикюр, козметични салони, SPA центрове и подобни бизнеси с резервационна система. Работи отлично както за малки салони с 1-2 специалиста, така и за по-големи вериги.',
    },
    {
      question: 'Какво включва поддръжката?',
      answer:
        'Всички планове включват имейл поддръжка. Pro и Enterprise плановете включват и телефонна поддръжка. Имаме екип на български език, който е на разположение да помогне с настройка, отговаряне на въпроси или решаване на технически проблеми.',
    },
    {
      question: 'Сигурни ли са данните на клиентите?',
      answer:
        'Да, информацията е напълно защитена. Използваме криптиране и спазваме всички изисквания на GDPR. Данните на клиентите се съхраняват сигурно и не се споделят с трети страни. Вие имате пълен контрол над информацията.',
    },
    {
      question: 'Мога ли да тествам системата преди да се ангажирам?',
      answer:
        'Разбира се! Предлагаме 14-дневен безплатен пробен период на всички планове. По време на пробния период имате достъп до всички функции и можете да тествате системата в реални условия. Няма нужда от кредитна карта за регистрация.',
    },
  ];

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Често задавани въпроси
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Отговори на най-често срещаните въпроси за CallDesk
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-black pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center bg-black text-white rounded-3xl p-12 md:p-16"
        >
          <MessageCircle className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Не намерихте отговор?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Нашият екип е тук, за да отговори на всички ваши въпроси
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black px-8 py-6 text-lg">
              <Link href="/contact">Свържете се с нас</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg">
              <Link href="/demo">Запази демо</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Service } from '../PartnerWizard';
import { generateSlug } from '@/lib/slug-utils';

interface ServicesStepProps {
  services: Service[];
  onChange: (services: Service[]) => void;
}

const CATEGORIES = [
  {
    id: 'hair',
    label: 'Фризьорство',
    templates: [
      { name: 'Подстригване', duration: 30 },
      { name: 'Боядисване', duration: 120 },
      { name: 'Кичури', duration: 90 },
      { name: 'Сешоар', duration: 45 },
    ],
  },
  {
    id: 'nails',
    label: 'Маникюр',
    templates: [
      { name: 'Маникюр', duration: 60 },
      { name: 'Педикюр', duration: 60 },
      { name: 'Гел лак', duration: 75 },
      { name: 'Изграждане', duration: 120 },
    ],
  },
  {
    id: 'laser',
    label: 'Лазерна епилация',
    templates: [
      { name: 'Подмишници', duration: 15 },
      { name: 'Крака', duration: 45 },
      { name: 'Бикини зона', duration: 30 },
      { name: 'Цяло тяло', duration: 120 },
    ],
  },
];

// Generate duration options from 15 to 240 in 15-minute increments
const DURATION_OPTIONS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15);

export function ServicesStep({ services, onChange }: ServicesStepProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    if (!category) return;

    if (selectedCategories.includes(categoryId)) {
      // Remove category and its services
      setSelectedCategories(selectedCategories.filter((c) => c !== categoryId));
      const categoryServiceIds = category.templates.map((t) =>
        generateSlug(t.name)
      );
      onChange(services.filter((s) => !categoryServiceIds.includes(s.serviceId)));
    } else {
      // Add category and template services
      setSelectedCategories([...selectedCategories, categoryId]);
      const newServices = category.templates.map((template) => ({
        serviceId: generateSlug(template.name),
        serviceName: template.name,
        durationMin: template.duration,
      }));
      onChange([...services, ...newServices]);
    }
  };

  const addService = () => {
    onChange([
      ...services,
      {
        serviceId: '',
        serviceName: '',
        durationMin: 60,
      },
    ]);
  };

  const removeService = (index: number) => {
    onChange(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof Service, value: string | number) => {
    const newServices = [...services];
    if (field === 'serviceName' && typeof value === 'string') {
      newServices[index] = {
        ...newServices[index],
        serviceName: value,
        serviceId: generateSlug(value),
      };
    } else {
      newServices[index] = {
        ...newServices[index],
        [field]: value,
      };
    }
    onChange(newServices);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Услуги на салона</h3>
        <p className="text-gray-600">
          Изберете категории или добавете собствени услуги
        </p>
      </div>

      {/* Category selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Категории услуги</Label>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                className="border-2 border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Services list */}
      {services.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Вашите услуги</Label>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-end gap-3 p-4 border-2 border-gray-200 rounded-lg"
              >
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`service-name-${index}`} className="text-sm">
                    Име на услугата
                  </Label>
                  <Input
                    id={`service-name-${index}`}
                    type="text"
                    value={service.serviceName}
                    onChange={(e) =>
                      updateService(index, 'serviceName', e.target.value)
                    }
                    placeholder="Подстригване"
                    className="border-2 border-gray-200 focus:border-black"
                  />
                </div>

                <div className="w-[140px] space-y-2">
                  <Label htmlFor={`service-duration-${index}`} className="text-sm">
                    Минути
                  </Label>
                  <Select
                    value={service.durationMin.toString()}
                    onValueChange={(value) =>
                      updateService(index, 'durationMin', parseInt(value))
                    }
                  >
                    <SelectTrigger className="border-2 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((duration) => (
                        <SelectItem key={duration} value={duration.toString()}>
                          {duration} мин
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeService(index)}
                  className="border-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add service button */}
      <Button
        type="button"
        variant="outline"
        onClick={addService}
        className="w-full border-2 border-gray-300 hover:bg-gray-50"
      >
        <Plus className="mr-2 h-4 w-4" />
        Добави услуга
      </Button>
    </div>
  );
}

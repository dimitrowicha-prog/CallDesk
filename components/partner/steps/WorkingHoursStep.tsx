'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkingHoursData } from '../PartnerWizard';

interface WorkingHoursStepProps {
  data: WorkingHoursData;
  onChange: (data: WorkingHoursData) => void;
}

const DAYS = [
  { key: 'mon', label: 'Понеделник' },
  { key: 'tue', label: 'Вторник' },
  { key: 'wed', label: 'Сряда' },
  { key: 'thu', label: 'Четвъртък' },
  { key: 'fri', label: 'Петък' },
  { key: 'sat', label: 'Събота' },
  { key: 'sun', label: 'Неделя' },
];

// Generate time options in 15-minute increments
const generateTimeOptions = () => {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export function WorkingHoursStep({ data, onChange }: WorkingHoursStepProps) {
  const toggleDay = (dayKey: string) => {
    const newData = { ...data };
    if (newData[dayKey]) {
      newData[dayKey] = null;
    } else {
      newData[dayKey] = { start: '10:00', end: '19:00' };
    }
    onChange(newData);
  };

  const updateTime = (dayKey: string, type: 'start' | 'end', value: string) => {
    const newData = { ...data };
    if (newData[dayKey]) {
      newData[dayKey] = {
        ...newData[dayKey]!,
        [type]: value,
      };
      onChange(newData);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Работно време</h3>
        <p className="text-gray-600">
          Определете кога салонът приема клиенти
        </p>
      </div>

      <div className="space-y-4">
        {DAYS.map((day) => {
          const isEnabled = data[day.key] !== null;
          const hours = data[day.key];

          return (
            <div
              key={day.key}
              className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3 min-w-[180px]">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => toggleDay(day.key)}
                  className="data-[state=checked]:bg-black"
                />
                <Label className="font-medium">{day.label}</Label>
              </div>

              {isEnabled && hours && (
                <div className="flex items-center gap-3 flex-1">
                  <Select
                    value={hours.start}
                    onValueChange={(value) => updateTime(day.key, 'start', value)}
                  >
                    <SelectTrigger className="w-[120px] border-2 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-gray-500">до</span>

                  <Select
                    value={hours.end}
                    onValueChange={(value) => updateTime(day.key, 'end', value)}
                  >
                    <SelectTrigger className="w-[120px] border-2 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!isEnabled && (
                <span className="text-gray-400 italic">Почивен ден</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

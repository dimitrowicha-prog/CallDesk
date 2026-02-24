'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface FinishStepProps {
  tenantSlug: string;
  error?: string | null;
}

export function FinishStep({ tenantSlug, error }: FinishStepProps) {

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="text-8xl">🎉</div>

      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold">Готово</h3>

        <p className="text-xl text-gray-700 max-w-md">
          Вашият AI рецепционист ще започне да приема обаждания до 8 часа.
        </p>

        <p className="text-base text-gray-500 max-w-md">
          Нашата система конфигурира услугата автоматично. Ще получите имейл когато е активна.
        </p>
      </div>
    </div>
  );
}

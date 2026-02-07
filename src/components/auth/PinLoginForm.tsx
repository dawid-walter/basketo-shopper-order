import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/auth';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const pinSchema = z.object({
  pin: z.string().length(6, 'PIN must be 6 digits').regex(/^\d+$/, 'PIN must contain only numbers'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type PinFormData = z.infer<typeof pinSchema>;

interface PinLoginFormProps {
  onSuccess: () => void;
}

export const PinLoginForm = ({ onSuccess }: PinLoginFormProps) => {
  const [step, setStep] = useState<'email' | 'pin'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pinResendCooldown, setPinResendCooldown] = useState(0);
  const pinInputRef = useRef<HTMLInputElement>(null);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const pinForm = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: { pin: '' },
  });

  // Auto-focus PIN input when step changes
  useEffect(() => {
    if (step === 'pin' && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [step]);

  // Cooldown timer for resend
  useEffect(() => {
    if (pinResendCooldown > 0) {
      const timer = setTimeout(() => {
        setPinResendCooldown(pinResendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pinResendCooldown]);

  const handleEmailSubmit = async (data: EmailFormData) => {
    setLoading(true);
    setError(null);

    try {
      await authService.requestPin(data.email);
      setEmail(data.email);
      setStep('pin');
      setPinResendCooldown(60); // 60 seconds cooldown
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (data: PinFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.verifyPin(email, data.pin);

      if (response.success) {
        onSuccess();
      } else {
        setError('Invalid PIN. Please try again.');
        pinForm.reset();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid PIN. Please try again.');
      pinForm.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleResendPin = async () => {
    if (pinResendCooldown > 0) return;

    setLoading(true);
    setError(null);

    try {
      await authService.requestPin(email);
      setPinResendCooldown(60);
      pinForm.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setError(null);
    pinForm.reset();
  };

  if (step === 'email') {
    return (
      <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center">
            Enter your email to receive a login PIN
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Input
          {...emailForm.register('email')}
          type="email"
          label="Email Address"
          placeholder="your.email@example.com"
          error={emailForm.formState.errors.email?.message}
          fullWidth
          autoComplete="email"
          autoFocus
        />

        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
        >
          Send PIN
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={pinForm.handleSubmit(handlePinSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Enter PIN
        </h2>
        <p className="text-gray-600 text-center">
          We sent a 6-digit PIN to<br />
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        {...pinForm.register('pin')}
        ref={pinInputRef}
        type="text"
        label="6-Digit PIN"
        placeholder="000000"
        error={pinForm.formState.errors.pin?.message}
        fullWidth
        maxLength={6}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        className="text-center text-2xl tracking-widest"
      />

      <Button
        type="submit"
        loading={loading}
        fullWidth
        size="lg"
      >
        Verify PIN
      </Button>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleResendPin}
          disabled={loading || pinResendCooldown > 0}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {pinResendCooldown > 0
            ? `Resend PIN in ${pinResendCooldown}s`
            : 'Resend PIN'}
        </button>

        <button
          type="button"
          onClick={handleBackToEmail}
          disabled={loading}
          className="text-sm text-gray-600 hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Use different email
        </button>
      </div>
    </form>
  );
};

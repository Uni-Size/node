'use client';

import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  /** 입력 안내 문구. `error`가 있으면 그 자리를 에러 메시지가 대신한다. */
  helperText?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md';
}

export const Input = ({
  label,
  error,
  helperText,
  fullWidth = false,
  size = 'md',
  className = '',
  id,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const message = error || helperText;
  const messageId = `${inputId}-message`;

  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="text-15 font-normal text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`flex items-center ${fullWidth ? 'w-full' : 'w-86'} ${size === 'sm' ? 'h-9 px-2.5 text-13' : 'h-12.5 px-4 text-15'} border border-gray-200 rounded-lg font-normal leading-none text-gray-700 bg-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:border-gray-400 placeholder:text-gray-400 ${error ? 'border-error focus:border-error' : ''} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...props}
      />
      {message && (
        <span id={messageId} className={`text-12 ${error ? 'text-error' : 'text-gray-500'}`}>
          {message}
        </span>
      )}
    </div>
  );
};

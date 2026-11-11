import type { ButtonHTMLAttributes, ReactNode } from 'react';

// unisize-front atoms/Button 이식본.
// 차이: 기본 클래스의 `border-none`을 뺐다(outline 테두리가 지워지던 버그). 아이콘+텍스트용 `gap-2` 추가.

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-900 text-gray-050 hover:not-disabled:bg-primary-700',
  secondary: 'bg-gray-500 text-white hover:not-disabled:bg-gray-600',
  outline: 'bg-transparent border border-primary-500 text-primary-900 hover:not-disabled:bg-primary-500/10',
};

const sizeStyles: Record<ButtonSize, string> = {
  small: 'w-auto h-auto px-3 py-1.5 text-12',
  medium: 'w-86 h-13.5 p-3 text-17',
  large: 'w-full h-13.5 px-7 py-3.5 text-17',
};

/**
 * `<Link>`처럼 button이 아닌 요소를 버튼 모양으로 만들 때 쓴다.
 * className으로 크기 클래스(w-/h-/p-/text-)를 덮어쓸 때는 `w-auto!`처럼 `!`를 붙인다 — 붙이지 않으면 CSS 순서에 따라 이기고 지는 게 바뀐다.
 */
export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'medium', className = '') =>
  `flex items-center justify-center gap-2 rounded-lg cursor-pointer font-normal leading-none transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

export const Button = ({ variant = 'primary', size = 'medium', children, className = '', ...props }: ButtonProps) => (
  <button className={buttonClass(variant, size, className)} {...props}>
    {children}
  </button>
);

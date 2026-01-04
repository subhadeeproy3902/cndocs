import type React from 'react';
import type { CSSProperties } from 'react';
import './book.css';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

const defaultIllustration = (
  <svg
    fill="none"
    height="56"
    viewBox="0 0 36 56"
    width="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M3.03113 28.0005C6.26017 23.1765 11.7592 20.0005 18 20.0005C24.2409 20.0005 29.7399 23.1765 32.9689 28.0005C29.7399 32.8244 24.2409 36.0005 18 36.0005C11.7592 36.0005 6.26017 32.8244 3.03113 28.0005Z"
      fill="#0070F3"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M32.9691 28.0012C34.8835 25.1411 36 21.7017 36 18.0015C36 8.06034 27.9411 0.00146484 18 0.00146484C8.05887 0.00146484 0 8.06034 0 18.0015C0 21.7017 1.11648 25.1411 3.03094 28.0012C6.25996 23.1771 11.7591 20.001 18 20.001C24.2409 20.001 29.74 23.1771 32.9691 28.0012Z"
      fill="#45DEC4"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M32.9692 28.0005C29.7402 32.8247 24.241 36.001 18 36.001C11.759 36.001 6.25977 32.8247 3.03077 28.0005C1.11642 30.8606 0 34.2999 0 38C0 47.9411 8.05887 56 18 56C27.9411 56 36 47.9411 36 38C36 34.2999 34.8836 30.8606 32.9692 28.0005Z"
      fill="#E5484D"
      fillRule="evenodd"
    />
  </svg>
);

export default function Book({
  title,
  titleClassName,
  enableTexture,
  width = 196,
  variant = 'stripe',
  color = '#e79d13',
  textColor = '#ffffff',
  illustration,
}: {
  title: string;
  titleClassName: string;
  enableTexture?: boolean;
  variant?: 'stripe' | 'simple';
  width?: number;
  color?: string;
  textColor?: string;
  illustration?: React.ReactNode;
}) {
  return (
    <div
      className="book-perspective relative"
      style={{ '--book-width': width } as React.CSSProperties}
    >
      <div
        className={cn('book-rotate-wrapper book-color', {
          'book-stripe': variant === 'stripe',
          'book-simple': variant === 'simple',
        })}
        style={
          {
            '--book-color': color,
            '--book-text-color': textColor,
          } as React.CSSProperties
        }
      >
        <div
          className="stack-stack stack book-book"
          data-version="v1"
          style={
            {
              '--stack-flex': 'initial',
              '--stack-direction': 'column',
              '--stack-align': 'stretch',
              '--stack-justify': 'flex-start',
              '--stack-padding': '0px',
              '--stack-gap': '0px',
            } as React.CSSProperties
          }
        >
          <div
            className="stack-stack stack book-stripe"
            data-version="v1"
            aria-hidden="true"
            style={
              {
                '--stack-flex': 'initial',
                '--stack-direction': 'row',
                '--stack-align': 'stretch',
                '--stack-justify': 'flex-start',
                '--stack-padding': '0px',
                '--stack-gap': '8px',
              } as React.CSSProperties
            }
          >
            {variant === 'stripe' && illustration && (
              <div className="book-illustration">{illustration}</div>
            )}
            <div className="book-bind" />
          </div>
          <div
            className="stack-stack stack book-body"
            data-version="v1"
            style={
              {
                '--stack-flex': 'initial',
                '--stack-direction': 'row',
                '--stack-align': 'stretch',
                '--stack-justify': 'flex-start',
                '--stack-padding': '0px',
                '--stack-gap': '0px',
              } as React.CSSProperties
            }
          >
            <div aria-hidden="true" className="book-bind" />
            <div
              className={`stack-stack stack book-content ${titleClassName}`}
              data-version="v1"
              style={
                {
                  '--stack-flex': 'initial',
                  '--stack-direction': 'column',
                  '--stack-align': 'stretch',
                  '--stack-justify':
                    variant === 'stripe' ? 'space-between' : 'flex-start',
                  '--stack-padding': '0px',
                  '--stack-gap': '0px',
                } as React.CSSProperties
              }
            >
              <span className="book-title" data-version="v1">
                {title}
              </span>
              <Badge variant="secondary" className='w-fit text-xs'>Coming Soon</Badge>
              {variant === 'simple' && (
                <div className="book-illustration">
                  {illustration ? illustration : defaultIllustration}
                </div>
              )}
            </div>
          </div>
          {enableTexture && (
            <div
              aria-hidden="true"
              className="book-texture"
              style={
                {
                  transform: 'rotate(0deg)',
                } as CSSProperties
              }
            />
          )}
        </div>
        <div aria-hidden="true" className="book-pages" />
        <div aria-hidden="true" className="book-back" />
      </div>
    </div>
  );
};


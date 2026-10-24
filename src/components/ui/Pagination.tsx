import React from 'react';
import { IconChevronLeft, IconChevronRight } from '../icons';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  direction?: 'rtl' | 'ltr';
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  direction = 'rtl',
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination Navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        marginBlock: 'var(--space-8)',
      }}
      className={className}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-bg-surface)',
          color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        {direction === 'rtl' ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
      </button>

      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '2.5rem',
              height: '2.5rem',
              paddingInline: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: isActive ? '1px solid var(--color-brand-primary)' : '1px solid var(--color-border-subtle)',
              backgroundColor: isActive ? 'var(--color-brand-primary)' : 'var(--color-bg-surface)',
              color: isActive ? '#ffffff' : 'var(--color-text-primary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-bg-surface)',
          color: currentPage === totalPages ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        {direction === 'rtl' ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
      </button>
    </nav>
  );
}

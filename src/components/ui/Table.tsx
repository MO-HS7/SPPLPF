import React from 'react';

export function Table({ children, className = '', style }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        backgroundColor: 'var(--color-bg-surface)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'inherit',
          fontSize: 'var(--text-sm)',
          ...style,
        }}
        className={className}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '' }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderBlockEnd: '2px solid var(--color-border-strong)',
        color: 'var(--color-brand-primary)',
        fontWeight: 700,
      }}
      className={className}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children, className = '', style }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      style={{
        borderBlockEnd: '1px solid var(--color-border-subtle)',
        transition: 'background-color var(--transition-fast)',
        ...style,
      }}
      className={`table-row ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = '', style }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      style={{
        padding: '0.875rem 1rem',
        textAlign: 'inherit',
        whiteSpace: 'nowrap',
        ...style,
      }}
      className={className}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', style }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      style={{
        padding: '0.875rem 1rem',
        verticalAlign: 'middle',
        color: 'var(--color-text-secondary)',
        ...style,
      }}
      className={className}
    >
      {children}
    </td>
  );
}

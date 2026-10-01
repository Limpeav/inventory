'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize = 25,
  onPageChange,
  itemLabel = 'items',
}: PaginationProps) {
  // If items <= pageSize, no pagination needed
  if (totalItems <= pageSize) {
    return null;
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const startItem = (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate page numbers to show (e.g. 1, 2, 3 ... or with ellipses)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (safeCurrentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (safeCurrentPage < totalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePageSelect = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== safeCurrentPage) {
      onPageChange(page);
    }
  };

  return (
    <div
      className="pagination-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '14px 20px',
        marginTop: '16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        fontSize: '13px',
        color: 'var(--text-secondary)',
      }}
    >
      {/* Information text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Showing</span>
        <strong style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
          {startItem}–{endItem}
        </strong>
        <span>of</span>
        <strong style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
          {totalItems}
        </strong>
        <span>{itemLabel}</span>
      </div>

      {/* Page controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* First page button */}
        {totalPages > 4 && (
          <button
            onClick={() => handlePageSelect(1)}
            disabled={safeCurrentPage === 1}
            title="First Page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-subtle)',
              color: safeCurrentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: safeCurrentPage === 1 ? 0.4 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronsLeft size={15} />
          </button>
        )}

        {/* Previous button */}
        <button
          onClick={() => handlePageSelect(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          title="Previous Page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 10px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-subtle)',
            color: safeCurrentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: safeCurrentPage === 1 ? 0.4 : 1,
            fontWeight: '600',
            fontSize: '12px',
            transition: 'all 0.15s ease',
          }}
        >
          <ChevronLeft size={14} />
          <span>Prev</span>
        </button>

        {/* Number buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {pages.map((p, idx) => {
            if (typeof p === 'string') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{
                    padding: '0 4px',
                    color: 'var(--text-muted)',
                    userSelect: 'none',
                  }}
                >
                  …
                </span>
              );
            }

            const isActive = p === safeCurrentPage;

            return (
              <button
                key={`page-${p}`}
                onClick={() => handlePageSelect(p)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 8px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: isActive ? '700' : '600',
                  border: isActive
                    ? '1px solid var(--primary)'
                    : '1px solid var(--border-subtle)',
                  background: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  boxShadow: isActive ? '0 2px 8px rgba(99, 102, 241, 0.35)' : 'none',
                  cursor: isActive ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageSelect(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          title="Next Page"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '0 10px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-subtle)',
            color: safeCurrentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: safeCurrentPage === totalPages ? 0.4 : 1,
            fontWeight: '600',
            fontSize: '12px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>

        {/* Last page button */}
        {totalPages > 4 && (
          <button
            onClick={() => handlePageSelect(totalPages)}
            disabled={safeCurrentPage === totalPages}
            title="Last Page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-subtle)',
              color: safeCurrentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
              cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: safeCurrentPage === totalPages ? 0.4 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronsRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

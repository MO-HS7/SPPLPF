'use client';

import React, { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  FormField,
  Input,
  Modal,
  Select,
} from '../../../components/ui';
import { IconCheck, IconFileText, IconPlus, IconSearch, IconTrash } from '../../../components/icons';

interface MediaItemDemo {
  id: string;
  name: string;
  type: 'image' | 'document';
  size: string;
  uploadedAt: string;
  altAr: string;
  altEn: string;
}

const INITIAL_MEDIA: MediaItemDemo[] = [
  {
    id: 'med-001',
    name: 'spplpf-provisional-mark.svg',
    type: 'image',
    size: '142 KB',
    uploadedAt: '2026-10-22',
    altAr: 'العلامة التعريفية المؤقتة — مؤسسة حماية القانون وتعزيز السلم الاجتماعي',
    altEn: 'SPPLPF Provisional Brand Mark (Pending formal approval)',
  },
  {
    id: 'med-002',
    name: 'local-mediation-committee-marib.jpg',
    type: 'image',
    size: '1.8 MB',
    uploadedAt: '2026-10-20',
    altAr: 'اجتماع لجنة المصالحة المجتمعية في مأرب',
    altEn: 'Marib Community Reconciliation Meeting',
  },
  {
    id: 'med-003',
    name: 'legal-safeguards-handbook-2026.pdf',
    type: 'document',
    size: '4.8 MB',
    uploadedAt: '2026-10-15',
    altAr: 'دليل الضمانات القانونية وإجراءات المحاكمة العادلة',
    altEn: 'Legal Procedural Safeguards Handbook',
  },
  {
    id: 'med-004',
    name: 'taiz-human-rights-workshop.jpg',
    type: 'image',
    size: '2.4 MB',
    uploadedAt: '2026-10-10',
    altAr: 'ورشة عمل تعزيز الرقابة القانونية في تعز',
    altEn: 'Taiz Legal Oversight Workshop',
  },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItemDemo[]>(INITIAL_MEDIA);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItemDemo | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const filtered = mediaList.filter((m) => {
    const matchesType = filterType === 'all' || m.type === filterType;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.altAr.includes(q);
    return matchesType && matchesSearch;
  });

  const handleSimulatedUpload = () => {
    const newMedia: MediaItemDemo = {
      id: `med-${String(mediaList.length + 1).padStart(3, '0')}`,
      name: `field-report-photo-${Date.now().toString().slice(-4)}.webp`,
      type: 'image',
      size: '640 KB',
      uploadedAt: new Date().toISOString().split('T')[0],
      altAr: 'صورة توثيقية من النزول الميداني لفريق المؤسسة',
      altEn: 'Field documentation photo of SPPLPF staff',
    };
    setMediaList([newMedia, ...mediaList]);
    setFeedbackMsg('تمت محاكاة رفع صورة جديدة بصيغة WebP المحسنة');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            مكتبة الوسائط والملفات (Media Library)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            إدارة الصور والمستندات، نصوص البدائل الوصفية (Alt Text)، ومعالجة الوسائط.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleSimulatedUpload}>
          <IconPlus size={16} />
          <span>محاكاة رفع ملف جديد</span>
        </Button>
      </div>

      {feedbackMsg && (
        <Alert variant="success" onClose={() => setFeedbackMsg('')}>
          {feedbackMsg}
        </Alert>
      )}

      {/* Filter and View Toggle Toolbar */}
      <Card style={{ marginBlockEnd: 'var(--space-6)', padding: 'var(--space-4) var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: '1 1 auto' }}>
            <div style={{ width: '260px' }}>
              <Input
                placeholder="بحث في أسماء الملفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ width: '160px' }}>
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">كافة الوسائط</option>
                <option value="image">صور فقط (Images)</option>
                <option value="document">مستندات PDF</option>
              </Select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
                backgroundColor: viewMode === 'grid' ? 'var(--color-brand-primary)' : 'var(--color-bg-surface)',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--color-text-primary)',
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
              }}
            >
              شبكة (Grid)
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
                backgroundColor: viewMode === 'list' ? 'var(--color-brand-primary)' : 'var(--color-bg-surface)',
                color: viewMode === 'list' ? '#ffffff' : 'var(--color-text-primary)',
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
              }}
            >
              قائمة (List)
            </button>
          </div>
        </div>
      </Card>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
          {filtered.map((item) => (
            <Card
              key={item.id}
              hoverEffect
              onClick={() => setSelectedItem(item)}
              style={{ cursor: 'pointer', padding: 'var(--space-4)' }}
            >
              <div
                style={{
                  height: '130px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: item.type === 'document' ? 'var(--color-navy-900)' : 'var(--color-bg-elevated)',
                  color: item.type === 'document' ? 'var(--color-brand-secondary)' : 'var(--color-brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBlockEnd: 'var(--space-3)',
                }}
              >
                <IconFileText size={40} />
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                <span>{item.size}</span>
                <span>{item.uploadedAt}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List Mode */
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4) var(--space-6)',
                  borderBlockEnd: '1px solid var(--color-border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <IconFileText size={20} style={{ color: 'var(--color-brand-primary)' }} />
                  <div>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)' }}>{item.name}</strong>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.altAr}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  <span>{item.size}</span>
                  <span>{item.uploadedAt}</span>
                  <Badge variant="neutral" size="sm">{item.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Selected Item Modal */}
      {selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={`تفاصيل الوسيط: ${selectedItem.name}`}
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedItem(null)}>
              حفظ وإغلاق
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
              <div><strong>اسم الملف:</strong> {selectedItem.name}</div>
              <div><strong>الحجم:</strong> {selectedItem.size}</div>
              <div><strong>تاريخ الرفع:</strong> {selectedItem.uploadedAt}</div>
            </div>

            <FormField label="النص البديل الوصفي (عربي - لمطابقة إمكانية الوصول A11y)">
              <Input
                value={selectedItem.altAr}
                onChange={(e) => {
                  setSelectedItem({ ...selectedItem, altAr: e.target.value });
                }}
              />
            </FormField>

            <FormField label="Alternative Text (English - WCAG 2.2 AA)">
              <Input
                value={selectedItem.altEn}
                onChange={(e) => {
                  setSelectedItem({ ...selectedItem, altEn: e.target.value });
                }}
              />
            </FormField>
          </div>
        </Modal>
      )}
    </div>
  );
}

'use client';

import { useWindowInnerWidth } from '@/hooks/useWindowInnerWidth';
import { useTranslations } from 'next-intl';
import PageStatusBar from '../navbar/PageStatusBar';

export default function ContactHeader() {
  const t = useTranslations('contact_page');
  const width = useWindowInnerWidth();

  if (width === null) return null;

  const isMobile = width < 1280;
  if (!isMobile) return null;

  return <PageStatusBar title={t('contact_us')} className="lg:hidden" />;
}

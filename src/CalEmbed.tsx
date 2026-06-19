import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

const NAMESPACE = 'book-your-free-lead-leak-audit';
const CAL_LINK = 'americanautomation/book-your-free-lead-leak-audit';

/** Live Cal.com scheduler for the free lead-leak audit. */
export default function CalEmbed({ height = 680 }: { height?: number }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: NAMESPACE });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);

  return (
    <Cal
      namespace={NAMESPACE}
      calLink={CAL_LINK}
      style={{ width: '100%', height: `${height}px`, overflow: 'scroll' }}
      config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
    />
  );
}

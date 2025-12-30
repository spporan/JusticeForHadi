'use client';

import { getAssetPath } from '@/lib/utils';

export function FontLoader() {
    return (
        <style jsx global>{`
      @font-face {
        font-family: 'Osman Hadi Sotota';
        src: url('${getAssetPath('/fonts/Osman Hadi Sotota.ttf')}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Sohid Osman Hadi';
        src: url('${getAssetPath('/fonts/Sohid Osman Hadi.ttf')}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `}</style>
    );
}

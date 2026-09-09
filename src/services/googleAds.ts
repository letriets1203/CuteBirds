/**
 * Google AdSense & Google H5 Games Ads SDK Service
 * Provides integration with Google AdSense, Ad Placement API (adBreak / adConfig),
 * and fallback rendering for sandbox / preview environments.
 */

declare global {
  interface Window {
    adsbygoogle?: any[];
    adBreak?: (options: any) => void;
    adConfig?: (options: any) => void;
  }
}

export const GOOGLE_ADS_CLIENT_ID =
  (import.meta as any)?.env?.VITE_GOOGLE_ADSENSE_CLIENT_ID || 'ca-pub-1234567890123456';

let isScriptInjected = false;

/**
 * Initializes the Google AdSense / Ad Placement script
 */
export function initGoogleAds(): void {
  if (typeof window === 'undefined') return;

  // Initialize global queues
  window.adsbygoogle = window.adsbygoogle || [];
  window.adBreak =
    window.adBreak ||
    function (o: any) {
      window.adsbygoogle?.push(o);
    };
  window.adConfig =
    window.adConfig ||
    function (o: any) {
      window.adsbygoogle?.push(o);
    };

  if (isScriptInjected) return;

  // Check if script already exists in document
  const existing = document.querySelector('script[src*="adsbygoogle.js"]');
  if (existing) {
    isScriptInjected = true;
    return;
  }

  try {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADS_CLIENT_ID}`;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-ad-client', GOOGLE_ADS_CLIENT_ID);
    script.onload = () => {
      // Configure sound/game state for Google H5 Game Ads
      try {
        if (typeof window.adConfig === 'function') {
          window.adConfig({
            preloadAdBreaks: 'on',
            sound: 'on',
          });
        }
      } catch (e) {
        console.warn('Google AdConfig notification error', e);
      }
    };
    script.onerror = () => {
      // In sandbox/iframe or with ad-blockers, Google script may be blocked.
      // This is expected and handled gracefully by the fallback UI.
      console.info('Google AdSense script blocked or loading restricted in preview sandbox.');
    };
    document.head.appendChild(script);
    isScriptInjected = true;
  } catch (err) {
    console.warn('Failed to inject Google Ads script:', err);
  }
}

export interface RewardedAdCallbacks {
  onBeforeAd?: () => void;
  onAfterAd?: () => void;
  onReward: () => void;
  onDismiss?: () => void;
}

/**
 * Trigger a Rewarded Ad using Google H5 Games Ads API (adBreak)
 * Falls back to callback if adBreak is unavailable or fails.
 */
export function requestGoogleRewardedAd(
  name: string,
  callbacks: RewardedAdCallbacks
): boolean {
  if (typeof window !== 'undefined' && typeof window.adBreak === 'function') {
    try {
      let isRewarded = false;

      window.adBreak({
        type: 'reward',
        name,
        beforeAd: () => {
          callbacks.onBeforeAd?.();
        },
        afterAd: () => {
          callbacks.onAfterAd?.();
          if (isRewarded) {
            callbacks.onReward();
          } else {
            callbacks.onDismiss?.();
          }
        },
        beforeReward: (showAdFn: () => void) => {
          if (typeof showAdFn === 'function') {
            showAdFn();
          }
        },
        adViewed: () => {
          isRewarded = true;
        },
        adDismissed: () => {
          isRewarded = false;
          callbacks.onDismiss?.();
        },
        adBreakDone: (placementInfo: any) => {
          if (placementInfo?.breakStatus === 'viewed') {
            callbacks.onReward();
          }
        },
      });
      return true;
    } catch (e) {
      console.warn('Google adBreak reward error, using fallback modal:', e);
      return false;
    }
  }
  return false;
}

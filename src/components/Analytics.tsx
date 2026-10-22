import Script from 'next/script';

// The single place for tracking. Set NEXT_PUBLIC_GA_ID and/or
// NEXT_PUBLIC_META_PIXEL_ID to switch them on; both stay off when empty.
// A successful enquiry dispatches the browser event "karin:lead", which is
// forwarded to both tools as a conversion.
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!ga && !pixel) return null;

  return (
    <>
      {ga ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      ) : null}
      {pixel ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      ) : null}
      <Script id="lead-events" strategy="afterInteractive">
        {`window.addEventListener('karin:lead',function(e){var d=(e&&e.detail)||{};if(window.gtag)gtag('event','generate_lead',{lead_type:d.kind,tour:d.tourSlug});if(window.fbq)fbq('track','Lead');});`}
      </Script>
    </>
  );
}

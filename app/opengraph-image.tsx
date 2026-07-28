import { ImageResponse } from 'next/og';

export const alt = 'Griit — Your next goal. Your athlete story.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background:
          'radial-gradient(circle at 12% 18%, #dff5b4 0, transparent 32%), radial-gradient(circle at 88% 20%, #cfe4ff 0, transparent 34%), #f7f6f1',
        color: '#151515',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        padding: '64px',
        width: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'flex-start',
          border: '2px solid rgba(21,21,21,.12)',
          borderRadius: '44px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: '52px 58px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 900 }}>
          GRIIT<span style={{ color: '#3157ff' }}>.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 76,
              fontWeight: 900,
              letterSpacing: '-4px',
              lineHeight: 0.92,
              maxWidth: '900px',
            }}
          >
            Your next goal.
            <br />
            Your athlete story.
          </div>
          <div
            style={{
              color: '#3157ff',
              display: 'flex',
              fontSize: 25,
              fontWeight: 700,
              marginTop: '28px',
            }}
          >
            The link in bio built for athletes.
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}

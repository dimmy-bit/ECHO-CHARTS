import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const transactions = searchParams.get('transactions') || '0';
  const days = searchParams.get('days') || '0';
  const dapps = searchParams.get('dapps') || '0';
  const rewards = searchParams.get('rewards') || '$0';
  const handle = searchParams.get('handle') || 'ECHO CHARTS';
  const avatar = searchParams.get('avatar');
  const avatarSafe = avatar && avatar.includes('.svg') ? null : avatar;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0A0A0A',
          backgroundColor: '#1A73FF',
          backgroundImage: 'linear-gradient(135deg, #1A73FF 0%, #2E7BFF 45%, #0B4BD6 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: 36,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 220 }}>
            {avatarSafe ? (
              <img
                src={avatarSafe}
                width="56"
                height="56"
                style={{ borderRadius: 9999, border: '2px solid rgba(255,255,255,0.2)' }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  width: 56,
                  height: 56,
                  borderRadius: 9999,
                  backgroundColor: '#1A73FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 30,
                  fontWeight: 800,
                }}
              >
                E
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, color: 'white' }}>
                {handle}
              </div>
              <div style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.98)', fontWeight: 700 }}>
                Your Base Journey
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 900,
              color: 'white',
            }}
          >
            YOUR BASE JOURNEY
          </div>
          <div style={{ width: 220 }} />
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingLeft: 80,
            paddingRight: 80,
          }}
        >
          {[
            { label: 'Transactions', value: transactions },
            { label: 'Days Active', value: days },
            { label: 'DApps Used', value: dapps },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, color: 'white' }}>{item.value}</div>
              <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.98)', fontWeight: 700 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
            Powered by Base
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

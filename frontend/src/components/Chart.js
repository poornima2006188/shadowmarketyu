import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceArea, ReferenceLine 
} from 'recharts';

// --- Custom Glassmorphism Tooltip --- //
const GlassTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(15, 15, 20, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '16px 20px',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
      }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
          {label}
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '20px', color: '#00d2d3', fontWeight: 'bold' }}>
          ${Number(payload[0].value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

function Chart() {
  const [data, setData] = useState([]);
  const [trapZone, setTrapZone] = useState(null);
  const [spoofLevel, setSpoofLevel] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [priceRes, statusRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/price'),
          axios.get('http://127.0.0.1:8000/status')
        ]);
        
        const currentPrice = priceRes.data.price;
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        setData(prev => {
          const newData = [...prev, { time: timeString, price: currentPrice }];
          return newData.slice(-40); 
        });

        // Parse trap detection bounds
        const trap = statusRes.data.trap;
        if (trap && trap.detected && trap.zone) {
          setTrapZone({ y1: Math.min(...trap.zone), y2: Math.max(...trap.zone) });
        } else {
          setTrapZone(null);
        }

        // Parse spoof detection level
        const spoof = statusRes.data.spoof;
        if (spoof && spoof.detected && spoof.level) {
          setSpoofLevel(spoof.level);
        } else {
          setSpoofLevel(null);
        }

      } catch (err) {
        console.error('Error fetching chart analytics:', err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeInGraphic {
            0% { opacity: 0; filter: blur(6px) brightness(1.5); }
            100% { opacity: 1; filter: blur(0) brightness(1); }
          }
          .zone-anim {
            animation: fadeInGraphic 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>
      <div style={{
        background: 'linear-gradient(180deg, rgba(30,30,35,1) 0%, rgba(15,15,18,1) 100%)',
        borderRadius: '16px',
        padding: '24px 32px',
        marginBottom: '28px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        height: '400px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '24px', 
          fontSize: '18px', 
          color: '#e0e0e0', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ 
            width: '8px', height: '8px', 
            borderRadius: '50%', backgroundColor: '#00d2d3', 
            display: 'inline-block', boxShadow: '0 0 10px #00d2d3' 
          }}></span>
          Live Market Feed & Flow Analytics
        </h2>
        
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data}>
            <defs>
              <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowYellow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="time" stroke="#666" tick={{fontSize: 11, fill: '#888'}} tickMargin={10} axisLine={false} tickLine={false} />
            <YAxis domain={['auto', 'auto']} stroke="#666" tick={{fontSize: 11, fill: '#888'}} axisLine={false} tickLine={false} width={60} />
            
            <Tooltip content={<GlassTooltip />} isAnimationActive={false} cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            {/* ----- Trap Zone Marking (Red Glow) ----- */}
            {trapZone && (
              <ReferenceArea 
                className="zone-anim"
                y1={trapZone.y1} 
                y2={trapZone.y2} 
                fill="#ff4757" 
                fillOpacity={0.15} 
                stroke="#ff4757" 
                strokeOpacity={0.8}
                strokeWidth={1}
                filter="url(#glowRed)"
              />
            )}

            {/* ----- Spoof Level Marking (Yellow Dashed Glow) ----- */}
            {spoofLevel && (
              <ReferenceLine 
                className="zone-anim"
                y={spoofLevel} 
                stroke="#feca57" 
                strokeWidth={2} 
                strokeDasharray="6 6" 
                filter="url(#glowYellow)"
                label={{ 
                  position: 'insideTopLeft', 
                  value: 'SPOOF LEVEL', 
                  fill: '#feca57', 
                  fontSize: 11, 
                  fontWeight: 'bold',
                  offset: 12
                }} 
              />
            )}

            {/* ----- Live Price Line (Cyan Glow) ----- */}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#00d2d3" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#121212', stroke: '#00d2d3', strokeWidth: 3 }}
              isAnimationActive={false} 
              filter="url(#glowCyan)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default Chart;

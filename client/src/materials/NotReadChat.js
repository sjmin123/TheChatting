import * as React from 'react';
import Icon from "./icon1.png"; // 이미지 파일 경로

export default function NotReadChat({ num }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <img
          className="image"
          src={Icon}
          alt="icon"
          style={{
            width: '25px',
            height: 'auto',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            fontSize: '13px',
            color: '#f1f1f1',
          }}
        >
          {num}
        </div>
      </div>
    </div>
  )
}
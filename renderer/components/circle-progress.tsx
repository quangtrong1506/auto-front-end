'use client'

import React from 'react'

interface CircleProgressInterface {
   percentage: number // từ 0 đến 100
   size?: number // đường kính, mặc định 100
   strokeWidth?: number // độ dày nét
   color?: string // màu vòng tiến độ
   bgColor?: string // màu nền vòng
}

export function CircleProgress({
   percentage,
   size = 100,
   strokeWidth = 10,
   color = '#00cc88',
   bgColor = '#e6e6e6',
}: CircleProgressInterface) {
   const radius = (size - strokeWidth) / 2
   const circumference = 2 * Math.PI * radius
   const offset = circumference - (percentage / 100) * circumference

   return (
      <svg width={size} height={size}>
         {/* Nền vòng tròn */}
         <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={bgColor}
            strokeWidth={strokeWidth}
            fill="none"
         />
         {/* Vòng tiến độ */}
         <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
         />
         {/* Text % ở giữa */}
         <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={size * 0.4}
            fill="#333"
            fontWeight="bold"
         >
            {Math.round(percentage)}%
         </text>
      </svg>
   )
}

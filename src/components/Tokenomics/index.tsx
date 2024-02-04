import React, { useEffect, useRef, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';

function Tokenomics() {
  const [data, setData] = useState([
    { id: '0', value: 10, label: 'Team' },
    { id: '1', value: 15, label: 'Rewards' },
    { id: '2', value: 30, label: 'Ecosystem Development' },
    { id: '3', value: 40, label: 'Treasury' },
    { id: '4', value: 10, label: 'Private Round' },
    { id: '5', value: 5, label: 'Public Sale' },
    { id: '6', value: 34, label: 'Marketing' },
  ]);

  const colors = [
    '#05B1AF',
    '#2D96FE',
    '#B800D7',
    '#5F019B',
    '#2731C8',
    '#02008D',
    '#05B1AF',
    '#2D96FE',
    '#B800D7',
    '#5F019B',
    '#2731C8',
    '#02008D',
  ];

  const findPercentage = (perVal: number) => {
    let tot = 0;

    for (var i = 0; i < data.length; i++) {
      tot += data[i].value;
    }

    return ((perVal / tot) * 100).toFixed(0);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        py: '30px',
        px: { xs: '10px', md: '30px' },
        display: 'flex',
        justifyContent: { xs: 'center', sm: 'space-evenly' },
        flexDirection: { xs: 'column', lg: 'row' },
        background: 'rgb(9,8,8)',
        mt: '20px',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', lg: '50%' },
          height: '100%',
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {window?.innerWidth && window?.innerWidth <= 500 ? (
          <PieChart
            series={[
              {
                data: data,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 4,
                cornerRadius: 10,
                startAngle: 0,
                endAngle: 360,
                cx: 149,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: 'gray',
                },
              },
            ]}
            sx={{
              '*': {
                border: 'none',
                width: '300px',
              },
              '& .css-1mhcdve-MuiPieArc-root': {
                stroke: 'transparent',
              },
              '& tspan': {
                fill: 'white',
              },
            }}
            slotProps={{
              legend: { hidden: true },
            }}
            width={300}
            height={300}
          />
        ) : (
          <PieChart
            series={[
              {
                data: data,
                innerRadius: 60,
                outerRadius: 200,
                paddingAngle: 4,
                cornerRadius: 10,
                startAngle: 0,
                endAngle: 360,
                cx: 250,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: 'gray',
                },
              },
            ]}
            sx={{
              '*': {
                border: 'none',
              },
              '& .css-1mhcdve-MuiPieArc-root': {
                stroke: 'transparent',
              },
              '& tspan': {
                fill: 'white',
              },
              '& .MuiChartsLegend-root': {
                display: { xs: 'none', lg: 'block' },
              },
            }}
            slotProps={{
              legend: { hidden: true },
            }}
            width={500}
            height={500}
          />
        )}
      </Box>
      <Box
        sx={{
          width: { xs: '100%', lg: '50%' },
          display: 'flex',
          justifyItems: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {data.map((d, i) => (
          <Box
            key={i}
            sx={{
              backgroundColor: 'rgba(80,80,80,.4)',
              backdropFilter: 'blur(32px)',
              width: { xs: '100%', sm: '400px' },
              px: '20px',
              py: '10px',
              mt: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '10px',
              borderLeft: `1px solid ${colors[i]}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: colors[i],
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {findPercentage(d.value)}%
                </Typography>
                <Typography
                  sx={{
                    color: '#fff',
                    ml: '7px',
                    fontSize: '16px',
                  }}
                >
                  {data[i].label}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: '#777',
                  fontSize: '13px',
                }}
              >
                12 diff .. ......
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                flexDirection: 'column',
              }}
            >
              <Typography
                sx={{
                  color: '#888',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                Amount
              </Typography>
              <Typography
                sx={{
                  color: '#fff',
                  ml: '7px',
                  fontSize: '14px',
                }}
              >
                {d.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
export default Tokenomics;

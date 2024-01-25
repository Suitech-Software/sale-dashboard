import { Box, Typography } from '@mui/material';
import { ReactNode, useEffect } from 'react';
import defaultStages from '@/lib/defaultStages.json';
import Header from '@/components/Header';
import { detectMetamask } from '@/lib/general';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralValueType, setCurrentStage } from '@/store/slices/generalSlice';
import Models from '../Models';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    detectMetamask(generalValues.walletAddress, dispatch);
    getCurrentStageDate();
  }, []);

  function getCurrentStageDate() {
    const currentDate = new Date();

    const cs = defaultStages.find((stage) => {
      const startDate = new Date(stage.Date.split(' - ')[0] + ', 2024');
      const endDate = new Date(stage.Date.split(' - ')[1] + ', 2024');
      return currentDate >= startDate && currentDate <= endDate;
    });
    dispatch(setCurrentStage(cs ?? { Stage: '' }));
  }

  useEffect(() => {}, [generalValues.currentNetwork]);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #3F234C, black);',
        paddingBottom: '30px',
        height: '100%',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          right: '-300px',
          top: '-400px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.2"
          viewBox="0 0 1700 1642"
          width="1200"
          height="1200"
        >
          <title>bg-figure-svg</title>
          <defs>
            <linearGradient
              id="g0"
              x1="518.1"
              y1="1302.7"
              x2="341"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#ffd16b" />
            </linearGradient>
            <linearGradient
              id="g1"
              x1="518.1"
              y1="1302.7"
              x2="341"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#ffd16b" />
              <stop offset=".5" stopColor="#e87e83" />
              <stop offset="1" stopColor="#ff93ff" />
            </linearGradient>
            <linearGradient
              id="g2"
              x1="1576.6"
              y1="821.7"
              x2="597"
              y2="1035.3"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#3458fd" />
              <stop offset=".5" stopColor="#806cfd" />
              <stop offset="1" stopColor="#b982ff" />
            </linearGradient>
            <linearGradient
              id="g3"
              x1="531.4"
              y1="1131.6"
              x2="699.5"
              y2="628.3"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#b982ff" />
              <stop offset="1" stopColor="#ff94ff" />
            </linearGradient>
          </defs>

          <path
            id="Layer"
            fillRule="evenodd"
            style={{ fill: 'url(#g0)' }}
            d="m1537.7 701.8c-14.9-23.8-49.3-49.4-98.5-62l-0.3-0.1c-96.6-25.2-242.1 3.7-345.5 147.1l-291.3 416.7q-0.1 0-0.1 0.1c-61 87.8-148.1 143.2-240.8 170.7l-19.6 5.9q-2.9 0.8-5.9 1.5c-99.9 21.2-206.8 10.1-304.6-42.8-37.2-20.1-51-66.6-30.8-103.8 20.1-37.2 66.6-51.1 103.8-30.9 62.3 33.8 130.6 41.7 197 28.2l16.5-4.9c64-19 120.1-55.9 158.6-111.4l0.2-0.2 291.8-417.4q0.3-0.4 0.6-0.8c140.5-195.3 351-247.4 508.7-206.2 75.8 19.5 149 63.2 190.2 129.3 44.9 72.1 45 160.8-12.9 242.5-24.5 34.5-72.3 42.7-106.8 18.2-34.5-24.4-42.7-72.2-18.2-106.8 23.4-33.1 19-55 7.9-72.9z"
          />
          <path
            id="Layer"
            fillRule="evenodd"
            style={{ fill: 'url(#g1)' }}
            d="m593.8 1290.9c8.8 41.3-17.7 82-59.1 90.8-99.9 21.2-206.8 10.2-304.5-42.8-195.5-105.8-281.1-344.6-198.7-551.6v-0.2l264.2-659.7c15.7-39.3 60.3-58.4 99.6-42.7 39.2 15.7 58.3 60.3 42.6 99.6l-264.1 659.6v0.1c-53.9 135.5 2.8 291.7 129.3 360.2 63.3 34.3 132.6 41.9 199.8 27.6 41.4-8.7 82.1 17.7 90.9 59.1z"
          />
          <g id="Layer">
            <path
              id="Layer"
              fillRule="evenodd"
              style={{ fill: 'url(#g2)' }}
              d="m1636.3 757.3c35.3 23.2 45.2 70.7 22 106.1-49.8 75.8-151 223-239.2 350.5l-164.4 236.6q0 0.1-0.1 0.2c-126.7 183.2-372.7 244.3-569.1 140.4-98.3-52-166.8-134.8-204.5-229.8q-1.2-2.8-2.1-5.7l-6-19.6c-28.4-92.4-30.6-195.6 8.7-295.1 15.5-39.4 60-58.7 99.3-43.2 39.4 15.6 58.7 60.1 43.2 99.4-24.8 62.9-24.5 129.9-4.8 193.8l5.1 16.5c25.6 62.7 70 115.1 132.7 148.3 127.2 67.3 288.7 27.8 371.6-92.2l0.2-0.3 164.2-236.5c30.1-43.1-44.1 63.8 0 0 88.5-127.9 188.6-273.5 237.1-347.4 23.2-35.4 70.7-45.2 106.1-22z"
            />
          </g>
          <path
            id="Layer"
            fillRule="evenodd"
            style={{ fill: 'url(#g3)' }}
            d="m573.5 1406.2c-40.4 12.4-83.3-10.3-95.7-50.7l-6-19.5c-28.5-92.4-30.7-195.6 8.6-295.1q0-0.1 0-0.1l185.2-473.6c62-165.5 5.4-302.6-69.2-369l-0.5-0.4c-35.5-32.2-74.8-45.8-103.5-44.5-23.3 1-44.9 11.2-59.7 46.3-16.4 39-61.3 57.4-100.3 41-39-16.4-57.3-61.3-40.9-100.3 37.7-89.8 111.7-136.6 194.4-140.1 77.3-3.3 154.2 31 212.6 83.8 121.7 108.4 195 312.4 110.4 537.6q-0.2 0.5-0.4 1l-185.5 474.2-0.1 0.2c-24.8 62.9-24.4 130-4.7 193.9l6 19.5c12.4 40.4-10.2 83.3-50.7 95.8z"
          />
        </svg>
      </Box>
      <Header />
      {generalValues.currentStage['Stage'] ? (
        <>{children}</>
      ) : (
        <Box
          sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '10',
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            You are not in Stage Time. Please try again later.
          </Typography>
        </Box>
      )}

      <Models />
    </Box>
  );
}

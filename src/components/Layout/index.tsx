import { Box, Typography } from '@mui/material';
import { ReactNode, useEffect } from 'react';
import defaultStages from '@/lib/defaultStages.json';
import Header from '@/components/Header';
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
    getCurrentStageDate();
  }, []);

  function getCurrentStageDate() {
    const currentDate = new Date();

    const cs = defaultStages.find((stage) => {
      const startDate = new Date(stage.Date.split(' - ')[0] + ', 2024');
      const endDate = new Date(stage.Date.split(' - ')[1] + ', 2024');
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      return (
        currentDate >= startDate &&
        currentDate <= endDate &&
        currentDate.getMonth() === startDate.getMonth()
      );
    });

    dispatch(setCurrentStage(cs ?? { Stage: '' }));
  }

  useEffect(() => {}, [generalValues.currentNetwork]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingBottom: '30px',
        height: '100%',
      }}
    >
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

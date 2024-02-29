import ConnectUsPage from '@/components/ConnectUsPage';
import Layout from '@/components/Layout';
import { RootState } from '@/store';
import { GeneralValueType } from '@/store/slices/generalSlice';
import React from 'react';
import { useSelector } from 'react-redux';

function ConnectUs() {
  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  return (
    <Layout>
      {generalValues.currentStage.Stage !== '' ? <ConnectUsPage /> : null}
    </Layout>
  );
}

export default ConnectUs;

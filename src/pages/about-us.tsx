import AboutUsPage from '@/components/AboutUsPage';
import Layout from '@/components/Layout';
import { RootState } from '@/store';
import { GeneralValueType } from '@/store/slices/generalSlice';
import React from 'react';
import { useSelector } from 'react-redux';

function AboutUs() {
  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  return (
    <Layout>
      {generalValues.currentStage.Stage !== '' ? <AboutUsPage /> : null}
    </Layout>
  );
}

export default AboutUs;

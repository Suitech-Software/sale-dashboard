import StakePage from '@/components/StakePage';
import { GeneralValueType } from '@/store/slices/generalSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Layout from '@/components/Layout';

function Stake() {
  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  return (
    <Layout>
      {generalValues.currentStage.Stage !== '' ? <StakePage /> : null}
    </Layout>
  );
}

export default Stake;

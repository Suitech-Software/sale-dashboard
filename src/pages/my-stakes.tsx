import { GeneralValueType } from '../store/slices/generalSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';
import Layout from '../components/Layout/index';
import MyStakePage from '@/components/MyStakePage';

function MyStakes() {
  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  return (
    <Layout>
      {generalValues.currentStage.Stage !== '' ? <MyStakePage /> : null}
    </Layout>
  );
}

export default MyStakes;

import { GeneralValueType } from '../store/slices/generalSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';
import Layout from '../components/Layout/index';
import StakeHistoryPage from '@/components/StakeHistoryPage';

function MyStakes() {
  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  return (
    <Layout>
      {generalValues.currentStage.Stage !== '' ? <StakeHistoryPage /> : null}
    </Layout>
  );
}

export default MyStakes;

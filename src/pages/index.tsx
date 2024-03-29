import HomePage from '@/components/HomePage';
import { GeneralValueType } from '../store/slices/generalSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';
import Layout from '../components/Layout/index';

function Home() {
  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  return (
    <Layout>
      {generalValues.currentStage.Stage !== '' ? <HomePage /> : null}
    </Layout>
  );
}

export default Home;

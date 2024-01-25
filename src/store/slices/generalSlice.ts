import { createSlice } from '@reduxjs/toolkit';

export type CurrentStageType = {
  Stage: string;
  Date: string;
  'Token Amount': string;
  'Token Price': string;
};

export interface GeneralValueType {
  walletAddress: string;
  currentNetwork: string;
  currentToken: string;
  currentBalance: number;
  amountOfPay: string;
  amountOfReceive: string;
  currentStage: CurrentStageType;
  openModal1: boolean;
  openModal2: boolean;
}

export interface GeneralState {
  value: GeneralValueType;
}

const initialState: GeneralState = {
  value: {
    walletAddress: '',
    currentNetwork: 'bsc',
    currentToken: 'binancecoin',
    currentBalance: 0,
    amountOfPay: '0',
    amountOfReceive: '0',
    currentStage: {
      Stage: '',
      Date: '',
      'Token Amount': '',
      'Token Price': '',
    },
    openModal1: false,
    openModal2: false,
  },
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setCurrentNetwork: (state, action) => {
      state.value.currentNetwork = action.payload;
    },
    setWalletAddress: (state, action) => {
      state.value.walletAddress = action.payload;
    },
    setCurrentToken: (state, action) => {
      state.value.currentToken = action.payload;
    },
    setCurrentBalance: (state, action) => {
      state.value.currentBalance = action.payload;
    },
    setAmountOfPay: (state, action) => {
      state.value.amountOfPay = action.payload;
    },
    setAmountOfReceive: (state, action) => {
      state.value.amountOfReceive = action.payload;
    },
    setCurrentStage: (state, action) => {
      state.value.currentStage = action.payload;
    },
    setOpenModal1: (state, action) => {
      state.value.openModal1 = action.payload;
    },
    setOpenModal2: (state, action) => {
      state.value.openModal2 = action.payload;
    },
  },
});

export const {
  setCurrentBalance,
  setCurrentNetwork,
  setCurrentToken,
  setWalletAddress,
  setAmountOfPay,
  setAmountOfReceive,
  setCurrentStage,
  setOpenModal1,
  setOpenModal2,
} = generalSlice.actions;
export default generalSlice.reducer;

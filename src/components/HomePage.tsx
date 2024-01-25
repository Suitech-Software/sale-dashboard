import React, { useEffect, useRef } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';
import { sendToken } from '@/lib/sendToken';
import { toast } from 'react-toastify';
import { CreateType } from '@/types/Transfer';
import defaultStages from '@/lib/defaultStages.json';
import {
  TransferTokenType,
  TransferTokenWithReferralType,
} from '@/types/Token';
import { useRouter } from 'next/router';
import { changeNetwork, getAmountOfReceiveToken } from '../lib/general';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';
import {
  GeneralValueType,
  setAmountOfPay,
  setAmountOfReceive,
  setCurrentNetwork,
  setCurrentToken,
} from '../store/slices/generalSlice';
import { connectWallet } from '@/lib/general';

interface Props {}

const HomePage: React.FC<Props> = ({}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nextStage, setNextStage] = useState<any>({});

  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const payRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    returnNextStagePrice();
  }, []);

  useEffect(() => {
    if (generalValues.amountOfPay !== '0')
      getAmountOfReceiveToken(
        payRef,
        generalValues.currentToken,
        generalValues.currentStage,
        dispatch
      );
  }, [generalValues.currentToken, generalValues.amountOfPay]);

  const saveTransfer = async () => {
    const transferData: CreateType = {
      amountOfPay: generalValues.amountOfPay,
      amountOfReceive: generalValues.amountOfReceive.toString(),
      currentNetwork: generalValues.currentNetwork,
      currentToken: generalValues.currentToken,
      stage: generalValues.currentStage?.Stage,
      tokenPrice: generalValues.currentStage?.['Token Price'],
      userWallet: generalValues.walletAddress,
    };
    const res = await fetch('/api/transfer/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transferData),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      dispatch(setAmountOfPay('0'));
      dispatch(setAmountOfReceive('0'));

      const transferTokenD: TransferTokenType = {
        transferId: data.transferId,
        userWallet: generalValues.walletAddress,
      };

      const isBonusActive = process.env.NEXT_PUBLIC_IS_BONUS_ACTIVE;

      if (router.query.hash) {
        const transferTokenDForReferral: TransferTokenWithReferralType = {
          transferId: data.transferId,
          hash: (router.query.hash as string) ?? '',
          userWallet: generalValues.walletAddress,
        };

        const resOfToken = await fetch(
          '/api/web3/token/transfer-token-with-referral',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transferTokenDForReferral),
          }
        );
        const transferTokenData = await resOfToken.json();

        if (resOfToken.ok) {
          toast.success(transferTokenData.message);
        } else {
          if (transferTokenData?.message)
            toast.error(transferTokenData.message);
          else if (transferTokenData?.error)
            toast.error(transferTokenData.error.message);
          else if (transferTokenData[0])
            toast.error(transferTokenData[0].message);
        }
      } else {
        if (isBonusActive?.toLowerCase() === 'true') {
          const resOfToken = await fetch(
            '/api/web3/token/transfer-token-with-bonus',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(transferTokenD),
            }
          );
          const transferTokenData = await resOfToken.json();

          if (resOfToken.ok) {
            toast.success(transferTokenData.message);
          } else {
            if (transferTokenData?.message)
              toast.error(transferTokenData.message);
            else if (transferTokenData?.error)
              toast.error(transferTokenData.error.message);
            else if (transferTokenData[0])
              toast.error(transferTokenData[0].message);
          }
        } else {
          const resOfToken = await fetch('/api/web3/token/transfer-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transferTokenD),
          });
          const transferTokenData = await resOfToken.json();

          if (resOfToken.ok) {
            toast.success(transferTokenData.message);
          } else {
            if (transferTokenData?.message)
              toast.error(transferTokenData.message);
            else if (transferTokenData?.error)
              toast.error(transferTokenData.error.message);
            else if (transferTokenData[0])
              toast.error(transferTokenData[0].message);
          }
        }
      }
    } else {
      if (data?.message) toast.error(data.message);
      else if (data?.error) toast.error(data.error.message);
      else if (data[0]) toast.error(data[0].message);
    }
  };

  const returnNextStagePrice = async () => {
    const cur_stage = generalValues.currentStage['Stage'].match(/\d+/);

    const ns = defaultStages.filter((defaultStage) =>
      defaultStage.Stage.includes((Number(cur_stage) + 1).toString())
    );

    setNextStage(ns[0]);
  };

  function calculateRemainingTime() {
    const now = new Date();
    const end = new Date(
      new Date(generalValues.currentStage?.Date?.split(' - ')[1] + ', 2024')
    );

    // @ts-ignore
    const timeDifference = end - now;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    const formattedDays = days > 0 ? `${days} DAY${days > 1 ? 'S' : ''}` : '';
    const formattedHours =
      hours > 0 ? `${hours} HOUR${hours > 1 ? 'S' : ''}` : '';
    const formattedMinutes =
      minutes > 0 ? `${minutes} MINUTE${minutes > 1 ? 'S' : ''}` : '';
    const formattedSeconds =
      seconds > 0 ? `${seconds} SECOND${seconds > 1 ? 'S' : ''}` : '';

    const formattedTime = [
      formattedDays,
      formattedHours,
      formattedMinutes,
      formattedSeconds,
    ]
      .filter(Boolean)
      .join(' ');

    return formattedTime || 'EXPIRED';
  }

  function calculateTotalTimeInSeconds() {
    const start = new Date(
      new Date(generalValues.currentStage?.Date?.split(' - ')[0] + ', 2024')
    );

    const now = new Date();
    const end = new Date(
      new Date(generalValues.currentStage?.Date?.split(' - ')[1] + ', 2024')
    );

    //@ts-ignore
    const totalTimeInSeconds = end - now;

    //@ts-ignore
    const resBetweenDate = end - start;

    const res = resBetweenDate - totalTimeInSeconds;
    var rate = (res / resBetweenDate) * 100;

    return rate;
  }

  return (
    <Box
      sx={{
        px: '100px',
        py: '30px',
        mt: '100px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(80,80,80,.4)',
          backdropFilter: 'blur(32px)',
          width: '500px',
          height: 'auto',
          borderRadius: '20px',
          boxShadow: '0px 3px 20px 0px #0000001A',
          display: 'flex',
          alignItems: 'center',
          p: '20px',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
            }}
          >
            TXP Pre-Sale
          </Typography>
          <Typography
            sx={{
              mt: '10px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
            }}
          >
            {calculateRemainingTime()}
          </Typography>
          <Box
            sx={{
              mt: '10px',
              height: '30px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderRadius: '20px',
              background: '#e4e4e7',
              py: '20px',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                height: '30px',
                width: `${calculateTotalTimeInSeconds()}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                background: '#0ea5e9',
                p: '20px',
              }}
            ></Box>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                position: 'absolute',
                left: '20%',
              }}
            >
              Until end of Pre-Sale. Next phase = $
              {nextStage['Stage']
                ? nextStage['Token Price'].replace('$', '')
                : '0'}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '15px',
              mt: '10px',
              fontWeight: '600',
              color: 'white',
            }}
          >
            {generalValues.currentStage['Stage']}
          </Typography>
          <Typography
            sx={{
              fontSize: '12px',
              mt: '10px',
              color: '#d4d4d8',
              fontWeight: '600',
            }}
          >
            {generalValues.currentStage['Token Amount']}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '600',
              mt: '10px',
              color: 'white',
            }}
          >
            1 TXP = $
            {generalValues.currentStage['Token Price']?.replace('$', '')}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            mt: '10px',
            height: '40px',
            borderRadius: '10px',
            py: '10px',
            border: '#f3f3f3 1px solid',
            '&:hover': {
              border: 'white 2px solid',
            },
          }}
          onClick={() => {
            if (generalValues.walletAddress) {
              if (generalValues.currentNetwork === 'eth') {
                changeNetwork(
                  process.env.NODE_ENV === 'development' ? '0x61' : '0x38',
                  generalValues.walletAddress,
                  generalValues.currentNetwork,
                  dispatch
                );
                dispatch(setCurrentNetwork('bsc'));
              } else {
                changeNetwork(
                  process.env.NODE_ENV === 'development' ? '0xaa36a7' : '0x1',
                  generalValues.walletAddress,
                  generalValues.currentNetwork,
                  dispatch
                );
                dispatch(setCurrentNetwork('eth'));
              }
            } else {
              if (generalValues.currentNetwork === 'eth') {
                dispatch(setCurrentNetwork('bsc'));
              } else {
                dispatch(setCurrentNetwork('eth'));
              }
            }
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
            }}
          >
            {generalValues.currentNetwork === 'bsc'
              ? 'Switch to ETH'
              : 'Switch to BSC'}
          </Typography>
          {generalValues.currentNetwork === 'eth' ? (
            <Image
              style={{
                marginLeft: '10px',
                objectFit: 'contain',
              }}
              src="/bnb-logo.png"
              alt="BNB Logo"
              width={27}
              height={27}
            />
          ) : (
            <Image
              style={{
                marginLeft: '10px',
                objectFit: 'contain',
              }}
              src="/ethereum.png"
              alt="ETH Logo"
              width={27}
              height={27}
            />
          )}
        </Button>

        <Grid
          container
          spacing={2}
          sx={{
            mt: '10px',
          }}
        >
          {generalValues.currentNetwork === 'bsc' ? (
            <>
              <Grid item xs={6}>
                <Button
                  variant={
                    generalValues.currentToken === 'binancecoin'
                      ? 'contained'
                      : 'outlined'
                  }
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: 'none',
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border:
                      generalValues.currentToken === 'binancecoin'
                        ? '#7c3aed 1px solid'
                        : '#f3f3f3 1px solid',
                    backgroundColor:
                      generalValues.currentToken === 'binancecoin'
                        ? '#7c3aed'
                        : '',
                    '&:hover': {
                      border:
                        generalValues.currentToken === 'binancecoin'
                          ? '#7c3aed 1px solid'
                          : 'white 2px solid',
                      backgroundColor:
                        generalValues.currentToken === 'binancecoin'
                          ? '#7c3aed'
                          : '',
                      '*': {
                        color:
                          generalValues.currentToken === 'binancecoin'
                            ? 'white'
                            : 'white',
                      },
                    },
                  }}
                  onClick={() => {
                    dispatch(setCurrentToken('binancecoin'));
                  }}
                >
                  <Image
                    style={{
                      marginRight: '10px',
                      objectFit: 'contain',
                    }}
                    src="/bnb-logo.png"
                    alt="BNB Logo"
                    width={22}
                    height={22}
                  />
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color:
                        generalValues.currentToken === 'binancecoin'
                          ? 'white'
                          : 'white',
                    }}
                  >
                    BNB
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={
                    generalValues.currentToken === 'ethereum'
                      ? 'contained'
                      : 'outlined'
                  }
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: 'none',
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border:
                      generalValues.currentToken === 'ethereum'
                        ? '#7c3aed 1px solid'
                        : '#f3f3f3 1px solid',
                    backgroundColor:
                      generalValues.currentToken === 'ethereum'
                        ? '#7c3aed'
                        : '',
                    '&:hover': {
                      border:
                        generalValues.currentToken === 'ethereum'
                          ? '#7c3aed 1px solid'
                          : 'white 2px solid',
                      backgroundColor:
                        generalValues.currentToken === 'ethereum'
                          ? '#7c3aed'
                          : '',
                      '*': {
                        color:
                          generalValues.currentToken === 'ethereum'
                            ? 'white'
                            : 'white',
                      },
                    },
                  }}
                  onClick={() => {
                    dispatch(setCurrentToken('ethereum'));
                  }}
                >
                  <Image
                    style={{
                      marginRight: '10px',
                      objectFit: 'contain',
                    }}
                    src="/ethereum.png"
                    alt="Ethereum Logo"
                    width={22}
                    height={22}
                  />
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color:
                        generalValues.currentToken === 'ethereum'
                          ? 'white'
                          : 'white',
                    }}
                  >
                    ETH
                  </Typography>
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <Button
                variant={
                  generalValues.currentToken === 'ethereum' ||
                  generalValues.currentToken === 'binancecoin'
                    ? 'contained'
                    : 'outlined'
                }
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: 'none',
                  width: '100%',
                  height: '40px',
                  borderRadius: '10px',
                  border:
                    generalValues.currentToken === 'ethereum' ||
                    generalValues.currentToken === 'binancecoin'
                      ? '#7c3aed 1px solid'
                      : '#f3f3f3 1px solid',
                  backgroundColor:
                    generalValues.currentToken === 'ethereum' ||
                    generalValues.currentToken === 'binancecoin'
                      ? '#7c3aed'
                      : '',
                  '&:hover': {
                    border:
                      generalValues.currentToken === 'ethereum' ||
                      generalValues.currentToken === 'binancecoin'
                        ? '#7c3aed 1px solid'
                        : 'white 2px solid',
                    backgroundColor:
                      generalValues.currentToken === 'ethereum' ||
                      generalValues.currentToken === 'binancecoin'
                        ? '#7c3aed'
                        : '',
                    '*': {
                      color:
                        generalValues.currentToken === 'ethereum' ||
                        generalValues.currentToken === 'binancecoin'
                          ? 'white'
                          : 'white',
                    },
                  },
                }}
                onClick={() => {
                  if (generalValues.currentNetwork === 'bsc') {
                    dispatch(setCurrentToken('binancecoin'));
                  } else if (generalValues.currentNetwork === 'eth') {
                    dispatch(setCurrentToken('ethereum'));
                  }
                }}
              >
                {generalValues.currentNetwork === 'bsc' ? (
                  <>
                    <Image
                      style={{
                        marginRight: '10px',
                        objectFit: 'contain',
                      }}
                      src="/bnb-logo.png"
                      alt="BNB Logo"
                      width={22}
                      height={22}
                    />
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color:
                          generalValues.currentToken === 'ethereum' ||
                          generalValues.currentToken === 'binancecoin'
                            ? 'white'
                            : 'white',
                      }}
                    >
                      BNB
                    </Typography>
                  </>
                ) : (
                  <>
                    <Image
                      style={{
                        marginRight: '10px',
                        objectFit: 'contain',
                      }}
                      src="/ethereum.png"
                      alt="Ethereum Logo"
                      width={22}
                      height={22}
                    />
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color:
                          generalValues.currentToken === 'ethereum' ||
                          generalValues.currentToken === 'binancecoin'
                            ? 'white'
                            : 'white',
                      }}
                    >
                      ETH
                    </Typography>
                  </>
                )}
              </Button>
            </Grid>
          )}
          <Grid item xs={6}>
            <Button
              variant={
                generalValues.currentToken === 'tether'
                  ? 'contained'
                  : 'outlined'
              }
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'none',
                width: '100%',
                height: '40px',
                borderRadius: '10px',
                border:
                  generalValues.currentToken === 'tether'
                    ? '#7c3aed 1px solid'
                    : '#f3f3f3 1px solid',
                backgroundColor:
                  generalValues.currentToken === 'tether' ? '#7c3aed' : '',
                '&:hover': {
                  border:
                    generalValues.currentToken === 'tether'
                      ? '#7c3aed 1px solid'
                      : 'white 2px solid',
                  backgroundColor:
                    generalValues.currentToken === 'tether' ? '#7c3aed' : '',
                  '*': {
                    color:
                      generalValues.currentToken === 'tether'
                        ? 'white'
                        : 'white',
                  },
                },
              }}
              onClick={() => {
                dispatch(setCurrentToken('tether'));
              }}
            >
              <Image
                style={{
                  marginRight: '10px',
                  objectFit: 'contain',
                }}
                src="/usdt-logo.png"
                alt="USDT Logo"
                width={30}
                height={22}
              />
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color:
                    generalValues.currentToken === 'tether' ? 'white' : 'white',
                }}
              >
                USDT
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant={
                generalValues.currentToken === 'usd-coin'
                  ? 'contained'
                  : 'outlined'
              }
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'none',
                width: '100%',
                height: '40px',
                borderRadius: '10px',
                border:
                  generalValues.currentToken === 'usd-coin'
                    ? '#7c3aed 1px solid'
                    : '#f3f3f3 1px solid',
                backgroundColor:
                  generalValues.currentToken === 'usd-coin' ? '#7c3aed' : '',
                '&:hover': {
                  border:
                    generalValues.currentToken === 'usd-coin'
                      ? '#7c3aed 1px solid'
                      : 'white 2px solid',
                  backgroundColor:
                    generalValues.currentToken === 'usd-coin' ? '#7c3aed' : '',
                  '*': {
                    color:
                      generalValues.currentToken === 'usd-coin'
                        ? 'white'
                        : 'white',
                  },
                },
              }}
              onClick={() => {
                dispatch(setCurrentToken('usd-coin'));
              }}
            >
              <Image
                style={{
                  marginRight: '10px',
                  objectFit: 'contain',
                }}
                src="/usdc-logo.png"
                alt="USDC Logo"
                width={42}
                height={42}
              />
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color:
                    generalValues.currentToken === 'usd-coin'
                      ? 'white'
                      : 'white',
                }}
              >
                USDC
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: '100%',
          }}
        >
          <Box
            sx={{
              borderRadius: '20px',
              border: 'none',
              mt: '20px',
              width: '100%',
              height: '50px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box
              component="input"
              ref={payRef}
              type="number"
              value={generalValues.amountOfPay}
              onChange={(e) => {
                dispatch(setAmountOfPay(e.target.value));
              }}
              sx={{
                width: '85%',
                height: '47px',
                border: 'none',
                bgcolor: '#F8F9F8',
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
                color: '#666666',
                px: '13px',
                '&:focus': {
                  outline: 'none',
                },
              }}
            />
            <Box
              sx={{
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
                borderLeft: '1px solid #d4d4d8',
                background: '#f3f3f3',
                width: '15%',
                height: '47px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {generalValues.currentNetwork === 'bsc' ? (
                <Box>
                  <Image
                    src="/bnb-logo.png"
                    alt="BNB Logo"
                    width={22}
                    height={22}
                    style={{
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              ) : (
                <Box>
                  <Image
                    src="/ethereum.png"
                    alt="Ethereum Logo"
                    width={22}
                    height={22}
                    style={{
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              borderRadius: '20px',
              mt: '20px',
              width: '100%',
              border: 'none',
              height: '50px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box
              component="input"
              type="number"
              value={generalValues.amountOfReceive}
              onChange={(e) => {
                dispatch(setAmountOfReceive(e.target.value));
              }}
              disabled
              sx={{
                width: '85%',
                height: '47px',
                border: 'none',
                bgcolor: '#F8F9F8',
                borderBottomLeftRadius: '20px',
                borderTopLeftRadius: '20px',
                color: '#666666',
                px: '13px',
                '&:focus': {
                  outline: 'none',
                },
              }}
            />
            <Box
              sx={{
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
                borderLeft: '1px solid #d4d4d8',
                background: '#f3f3f3',
                width: '15%',
                height: '47px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box>
                <Image
                  src="/main.png"
                  alt="BNB Logo"
                  width={25}
                  height={25}
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '50px',
            mt: '20px',
            boxShadow: 'none',
            borderRadius: '10px',
            background: '#fbbf24',
            color: 'black',
            '&:hover': {
              background: '#f59e0b',
              boxShadow: 'none',
            },
          }}
          onClick={async () => {
            setIsLoading(true);
            if (generalValues.walletAddress) {
              if (generalValues.amountOfPay !== '0') {
                const result = await sendToken(
                  Number(generalValues.amountOfPay),
                  generalValues.currentNetwork,
                  generalValues.currentToken
                );
                if (result) await saveTransfer();
              } else {
                toast.info('You have to enter amount of pay');
              }
            } else {
              connectWallet(
                generalValues.walletAddress,
                generalValues.currentNetwork,
                dispatch
              );
            }
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <CircularProgress size={25} sx={{ color: '#f3f3f3' }} />
          ) : (
            <> {generalValues.walletAddress ? 'Buy now' : 'Connect Wallet'}</>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;

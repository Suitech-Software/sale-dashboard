import React, { useEffect, useRef } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';
import { sendToken } from '@/lib/sendToken';
import { toast } from 'react-toastify';
import { CreateType } from '@/types/Transfer';
import defaultStages from '@/lib/defaultStages.json';

interface Props {
  walletAddress: string;
  setWalletAddress: Function;
  currentNetwork: string;
  setCurrentNetwork: Function;
  changeNetwork: Function;
  disconnectMetamask: Function;
  amountOfPay: string;
  setAmountOfPay: Function;
  amountOfReceive: string;
  setAmountOfReceive: Function;
  currentToken: string;
  setCurrentToken: Function;
  currentStage: any;
  currentTokenRef: any;
}

const HomePage: React.FC<Props> = ({
  setWalletAddress,
  walletAddress,
  currentNetwork,
  setCurrentNetwork,
  changeNetwork,
  disconnectMetamask,
  amountOfPay,
  setAmountOfPay,
  amountOfReceive,
  setAmountOfReceive,
  currentToken,
  setCurrentToken,
  currentStage,
  currentTokenRef,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nextStage, setNextStage] = useState<any>({});

  const payRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    returnNextStagePrice();
  }, []);

  const connectWallet = async () => {
    try {
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      });

      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setWalletAddress(accounts[0]);
      if (currentNetwork === 'eth') {
        changeNetwork(
          process.env.NODE_ENV === 'development' ? '0xaa36a7' : '0x1'
        );
      } else {
        changeNetwork(process.env.NODE_ENV === 'development' ? '0x61' : '0x38');
      }
    } catch (error) {
      console.log('Error connecting...');
    }
  };

  // tether
  // usd-coin
  // binancecoin
  // ethereum
  const getAmountOfReceiveToken = async () => {
    if (payRef.current && currentTokenRef.current) {
      if (payRef.current.value !== '' && payRef.current.value !== '0') {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids='.concat(
            currentTokenRef.current,
            '&vs_currencies=usd'
          )
        );
        const data = await res.json();
        // let a = '';
        // if (currentTokenRef.current == 'tether') {
        //   a = '2';
        // } else if (currentTokenRef.current == 'ethereum') {
        //   a = '2570.72';
        // } else if (currentTokenRef.current == 'usd-coin') {
        //   a = '1';
        // } else if (currentTokenRef.current == 'binancecoin') {
        //   a = '302.42';
        // }
        const aOfReceive =
          (Number(payRef.current.value) * data[currentTokenRef.current]?.usd) /
          Number(currentStage?.['Token Price'].replace('$', ''));

        setAmountOfReceive(aOfReceive);
      } else {
        setAmountOfReceive('0');
      }
    }
  };

  const saveTransfer = async () => {
    const transferData: CreateType = {
      amountOfPay,
      amountOfReceive: amountOfReceive.toString(),
      currentNetwork,
      currentToken,
      stage: currentStage?.Stage,
      tokenPrice: currentStage?.['Token Price'],
      userWallet: walletAddress,
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
      setAmountOfPay('0');
      setAmountOfReceive('0');
    } else {
      if (data?.message) toast.error(data.message);
      else if (data?.error) toast.error(data.error.message);
      else if (data[0]) toast.error(data[0].message);
    }
  };

  const returnNextStagePrice = async () => {
    const cur_stage = currentStage['Stage'].match(/\d+/);

    const ns = defaultStages.filter((defaultStage) =>
      defaultStage.Stage.includes((Number(cur_stage) + 1).toString())
    );

    setNextStage(ns[0]);
  };

  function calculateRemainingTime() {
    const now = new Date();
    const end = new Date(
      new Date(currentStage.Date.split(' - ')[1] + ', 2024')
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
      new Date(currentStage.Date.split(' - ')[0] + ', 2024')
    );

    const now = new Date();
    const end = new Date(
      new Date(currentStage.Date.split(' - ')[1] + ', 2024')
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
            {currentStage['Stage']}
          </Typography>
          <Typography
            sx={{
              fontSize: '12px',
              mt: '10px',
              color: '#d4d4d8',
              fontWeight: '600',
            }}
          >
            {currentStage['Token Amount']}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '600',
              mt: '10px',
              color: 'white',
            }}
          >
            1 TXP = ${currentStage['Token Price'].replace('$', '')}
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
            if (walletAddress) {
              if (currentNetwork === 'eth') {
                changeNetwork(
                  process.env.NODE_ENV === 'development' ? '0x61' : '0x38'
                );
                setCurrentNetwork('bsc');
              } else {
                changeNetwork(
                  process.env.NODE_ENV === 'development' ? '0xaa36a7' : '0x1'
                );
                setCurrentNetwork('eth');
              }
            } else {
              if (currentNetwork === 'eth') {
                setCurrentNetwork('bsc');
              } else {
                setCurrentNetwork('eth');
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
            {currentNetwork === 'bsc' ? 'Switch to ETH' : 'Switch to BSC'}
          </Typography>
          {currentNetwork === 'eth' ? (
            <Image
              style={{
                marginLeft: '10px',
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
          {currentNetwork === 'bsc' ? (
            <>
              <Grid item xs={6}>
                <Button
                  variant={
                    currentToken === 'binancecoin' ? 'contained' : 'outlined'
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
                      currentToken === 'binancecoin'
                        ? '#7c3aed 1px solid'
                        : '#f3f3f3 1px solid',
                    backgroundColor:
                      currentToken === 'binancecoin' ? '#7c3aed' : '',
                    '&:hover': {
                      border:
                        currentToken === 'binancecoin'
                          ? '#7c3aed 1px solid'
                          : 'white 2px solid',
                      backgroundColor:
                        currentToken === 'binancecoin' ? '#7c3aed' : '',
                      '*': {
                        color:
                          currentToken === 'binancecoin' ? 'white' : 'white',
                      },
                    },
                  }}
                  onClick={() => {
                    setCurrentToken('binancecoin');
                    currentTokenRef.current = 'binancecoin';
                    if (amountOfPay !== '0') getAmountOfReceiveToken();
                  }}
                >
                  <Image
                    style={{
                      marginRight: '10px',
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
                      color: currentToken === 'binancecoin' ? 'white' : 'white',
                    }}
                  >
                    BNB
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={
                    currentToken === 'ethereum' ? 'contained' : 'outlined'
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
                      currentToken === 'ethereum'
                        ? '#7c3aed 1px solid'
                        : '#f3f3f3 1px solid',
                    backgroundColor:
                      currentToken === 'ethereum' ? '#7c3aed' : '',
                    '&:hover': {
                      border:
                        currentToken === 'ethereum'
                          ? '#7c3aed 1px solid'
                          : 'white 2px solid',
                      backgroundColor:
                        currentToken === 'ethereum' ? '#7c3aed' : '',
                      '*': {
                        color: currentToken === 'ethereum' ? 'white' : 'white',
                      },
                    },
                  }}
                  onClick={() => {
                    setCurrentToken('ethereum');
                    currentTokenRef.current = 'ethereum';
                    if (amountOfPay !== '0') getAmountOfReceiveToken();
                  }}
                >
                  <Image
                    style={{
                      marginRight: '10px',
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
                      color: currentToken === 'ethereum' ? 'white' : 'white',
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
                  currentToken === 'ethereum' || currentToken === 'binancecoin'
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
                    currentToken === 'ethereum' ||
                    currentToken === 'binancecoin'
                      ? '#7c3aed 1px solid'
                      : '#f3f3f3 1px solid',
                  backgroundColor:
                    currentToken === 'ethereum' ||
                    currentToken === 'binancecoin'
                      ? '#7c3aed'
                      : '',
                  '&:hover': {
                    border:
                      currentToken === 'ethereum' ||
                      currentToken === 'binancecoin'
                        ? '#7c3aed 1px solid'
                        : 'white 2px solid',
                    backgroundColor:
                      currentToken === 'ethereum' ||
                      currentToken === 'binancecoin'
                        ? '#7c3aed'
                        : '',
                    '*': {
                      color:
                        currentToken === 'ethereum' ||
                        currentToken === 'binancecoin'
                          ? 'white'
                          : 'white',
                    },
                  },
                }}
                onClick={() => {
                  if (currentNetwork === 'bsc') {
                    setCurrentToken('binancecoin');
                    currentTokenRef.current = 'binancecoin';
                  } else if (currentNetwork === 'eth') {
                    setCurrentToken('ethereum');
                    currentTokenRef.current = 'ethereum';
                  }
                  if (amountOfPay !== '0') getAmountOfReceiveToken();
                }}
              >
                {currentNetwork === 'bsc' ? (
                  <>
                    <Image
                      style={{
                        marginRight: '10px',
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
                          currentToken === 'ethereum' ||
                          currentToken === 'binancecoin'
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
                          currentToken === 'ethereum' ||
                          currentToken === 'binancecoin'
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
              variant={currentToken === 'tether' ? 'contained' : 'outlined'}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'none',
                width: '100%',
                height: '40px',
                borderRadius: '10px',
                border:
                  currentToken === 'tether'
                    ? '#7c3aed 1px solid'
                    : '#f3f3f3 1px solid',
                backgroundColor: currentToken === 'tether' ? '#7c3aed' : '',
                '&:hover': {
                  border:
                    currentToken === 'tether'
                      ? '#7c3aed 1px solid'
                      : 'white 2px solid',
                  backgroundColor: currentToken === 'tether' ? '#7c3aed' : '',
                  '*': {
                    color: currentToken === 'tether' ? 'white' : 'white',
                  },
                },
              }}
              onClick={() => {
                setCurrentToken('tether');
                currentTokenRef.current = 'tether';

                if (amountOfPay !== '0') getAmountOfReceiveToken();
              }}
            >
              <Image
                style={{
                  marginRight: '10px',
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
                  color: currentToken === 'tether' ? 'white' : 'white',
                }}
              >
                USDT
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant={currentToken === 'usd-coin' ? 'contained' : 'outlined'}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'none',
                width: '100%',
                height: '40px',
                borderRadius: '10px',
                border:
                  currentToken === 'usd-coin'
                    ? '#7c3aed 1px solid'
                    : '#f3f3f3 1px solid',
                backgroundColor: currentToken === 'usd-coin' ? '#7c3aed' : '',
                '&:hover': {
                  border:
                    currentToken === 'usd-coin'
                      ? '#7c3aed 1px solid'
                      : 'white 2px solid',
                  backgroundColor: currentToken === 'usd-coin' ? '#7c3aed' : '',
                  '*': {
                    color: currentToken === 'usd-coin' ? 'white' : 'white',
                  },
                },
              }}
              onClick={() => {
                setCurrentToken('usd-coin');
                currentTokenRef.current = 'usd-coin';

                if (amountOfPay !== '0') getAmountOfReceiveToken();
              }}
            >
              <Image
                style={{
                  marginRight: '10px',
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
                  color: currentToken === 'usd-coin' ? 'white' : 'white',
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
              value={amountOfPay}
              onChange={(e) => {
                setAmountOfPay(e.target.value);
                getAmountOfReceiveToken();
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
              {currentNetwork === 'bsc' ? (
                <Box>
                  <Image
                    src="/bnb-logo.png"
                    alt="BNB Logo"
                    width={22}
                    height={22}
                  />
                </Box>
              ) : (
                <Box>
                  <Image
                    src="/ethereum.png"
                    alt="Ethereum Logo"
                    width={22}
                    height={22}
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
              value={amountOfReceive}
              onChange={(e) => setAmountOfReceive(e.target.value)}
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
                <Image src="/next.svg" alt="BNB Logo" width={22} height={22} />
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
            if (walletAddress) {
              if (amountOfPay !== '0') {
                await sendToken(
                  Number(amountOfPay),
                  currentNetwork,
                  currentTokenRef.current
                );
                // if (currentNetwork === 'bsc') {
                //   if (currentToken === 'tether') {
                //     await sendToken(
                //       Number(amountOfPay),
                //       '0x55d398326f99059ff775485246999027b3197955',
                //       'bsc'
                //     );
                //   } else if (currentToken === 'usd-coin') {
                //     await sendToken(
                //       Number(amountOfPay),
                //       '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
                //       'bsc'
                //     );
                //   } else if (currentToken === 'binancecoin') {
                //     await sendToken(
                //       Number(amountOfPay),
                //       '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
                //       'bsc'
                //     );
                //   } else if (currentToken === 'ethereum') {
                //     await sendToken(
                //       Number(amountOfPay),
                //       '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
                //       'bsc'
                //     );
                //   }
                // } else if (currentNetwork === 'eth') {
                //   if (currentToken === 'tether') {
                //     await sendToken(
                //       Number(amountOfPay),
                //       '0xdac17f958d2ee523a2206206994597c13d831ec7',
                //       'eth'
                //     );
                //   } else if (currentToken === 'usd-coin') {
                //     await sendToken(
                //       Number(amountOfPay),
                //       '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                //       'eth'
                //     );
                //   } else if (currentToken === 'binancecoin') {
                //     await sendToken(
                //       Number(amountOfPay),
                //       '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
                //       'eth'
                //     );
                //   } else if (currentToken === 'ethereum') {
                //     await sendToken(
                //       Number(amountOfPay),
                //       '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
                //       'eth'
                //     );
                //   }
                // }

                await saveTransfer();
                await setIsLoading(true);
              } else {
                toast.info('You have to enter amount of pay');
              }
            } else {
              connectWallet();
            }
          }}
        >
          {isLoading ? (
            <CircularProgress size={25} sx={{ color: '#f3f3f3' }} />
          ) : (
            <> {walletAddress ? 'Buy now' : 'Connect Wallet'}</>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;

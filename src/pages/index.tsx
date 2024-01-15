import HomePage from '@/components/HomePage';
import { Box, Button, Modal, Typography } from '@mui/material';
import { get } from 'lodash';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import Web3 from 'web3';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import copy from 'clipboard-copy';
import defaultStages from '@/lib/defaultStages.json';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(
    '0x1b054273Fe97696254443E0B1adEB51243d751CE'
  );
  const [currentNetwork, setCurrentNetwork] = useState('bsc');
  const [currentToken, setCurrentToken] = useState('binancecoin');

  const [openModal1, setOpenModal1] = useState<boolean>(false);
  const [openModal2, setOpenModal2] = useState<boolean>(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [amountOfPay, setAmountOfPay] = useState('0');
  const [amountOfReceive, setAmountOfReceive] = useState('0');
  const [currentStage, setCurrentStage] = useState({
    Stage: '',
  });

  const detectMetamask = async () => {
    if (get(window, 'ethereum')) {
      if (walletAddress) {
        // @ts-ignore
        const web3 = new Web3(window.ethereum);
        const b = await web3.eth.getBalance(walletAddress);
        setCurrentBalance(Number((Number(b) / Math.pow(10, 18)).toFixed(4)));
      }
    } else {
      toast.info('You have to install Metamask');
    }
  };

  useEffect(() => {
    detectMetamask();
    getCurrentStageDate();
  }, []);

  function getCurrentStageDate() {
    const currentDate = new Date();

    const cs = defaultStages.find((stage) => {
      const startDate = new Date(stage.Date.split(' - ')[0] + ', 2024');
      const endDate = new Date(stage.Date.split(' - ')[1] + ', 2024');
      return currentDate >= startDate && currentDate <= endDate;
    });

    setCurrentStage(cs ?? { Stage: '' });
  }

  const changeNetwork = async (chainId: string) => {
    try {
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: chainId,
          },
        ],
      });
      detectMetamask();
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const disconnectMetamask = async () => {};

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component="header"
        sx={{
          height: '70px',
          backgroundColor: '#343537',
          opacity: '0.7',
          position: 'fixed',
          top: '0px',
          left: '0px',
          right: '0px',
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {walletAddress ? (
          <>
            <Button
              variant="contained"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                borderRadius: '10px',
              }}
              onClick={() => setOpenModal1(true)}
            >
              {currentNetwork === 'bsc' ? (
                <Image
                  style={{
                    marginLeft: '10px',
                  }}
                  src="/bnb-logo.png"
                  alt="BNB Logo"
                  width={22}
                  height={22}
                />
              ) : (
                <Image
                  style={{
                    marginLeft: '10px',
                  }}
                  src="/ethereum.png"
                  alt="ETH Logo"
                  width={30}
                  height={30}
                />
              )}
              <ArrowDropDownIcon />
            </Button>
            <Button
              variant="contained"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100',
                height: '40px',
                borderRadius: '10px',
                boxShadow: 'none',
                background: 'rgb(65,65,65)',
                '&:hover': {
                  background: '#000',
                },
              }}
              onClick={() => setOpenModal2(true)}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                }}
              >
                {walletAddress.slice(0, 5)}
                ...
                {walletAddress.slice(
                  walletAddress.length - 4,
                  walletAddress.length
                )}
              </Typography>
            </Button>
          </>
        ) : null}
      </Box>
      {currentStage['Stage'] ? (
        <HomePage
          {...{
            walletAddress,
            setWalletAddress,
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
          }}
        />
      ) : (
        <Box
          sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            You are not in Stage Time
          </Typography>
        </Box>
      )}
      <Modal open={openModal1} onClose={() => setOpenModal1(false)}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 320,
            bgcolor: '#333',
            p: 2,
            borderRadius: '15px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Switch Networks
            </Typography>
            <Box
              sx={{
                background: '#444',
                borderRadius: '100%',
                p: '3px',
                width: '22px',
                height: '22px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setOpenModal1(false);
              }}
            >
              <CloseIcon
                sx={{
                  color: '#888',
                  width: '16px',
                  height: '16px',
                }}
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mt: '10px',
              height: '40px',
              borderRadius: '10px',
              boxShadow: 'none',
              background: currentNetwork === 'bsc' ? '#1664c0' : '#333',
            }}
            onClick={() => {
              if (currentNetwork !== 'bsc') {
                changeNetwork(
                  process.env.NODE_ENV === 'development' ? '0x61' : '0x38'
                );
                setCurrentNetwork('bsc');
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Image
                style={{
                  marginRight: '10px',
                }}
                src="/bsc-logo.png"
                alt="BNB Logo"
                width={22}
                height={22}
              />
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: '600',
                }}
              >
                BSC
              </Typography>
            </Box>
            {currentNetwork === 'bsc' ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                  }}
                >
                  Connected
                </Typography>
                <Box
                  sx={{
                    width: '10px',
                    height: '10px',
                    background: '#30e300',
                    borderRadius: '100%',
                    ml: '10px',
                  }}
                ></Box>
              </Box>
            ) : null}
          </Button>
          <Button
            variant="contained"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mt: '10px',
              height: '40px',
              borderRadius: '10px',
              boxShadow: 'none',
              background: currentNetwork === 'eth' ? '#1664c0' : '#333',
            }}
            onClick={() => {
              if (currentNetwork !== 'eth') {
                changeNetwork(
                  process.env.NODE_ENV === 'development' ? '0xaa36a7' : '0x1'
                );
                setCurrentNetwork('eth');
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Image
                style={{
                  marginRight: '10px',
                }}
                src="/ethereum-logo.png"
                alt="BNB Logo"
                width={22}
                height={22}
              />
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: '600',
                }}
              >
                Ethereum
              </Typography>
            </Box>
            {currentNetwork === 'eth' ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                  }}
                >
                  Connected
                </Typography>
                <Box
                  sx={{
                    width: '10px',
                    height: '10px',
                    background: '#30e300',
                    borderRadius: '100%',
                    ml: '10px',
                  }}
                ></Box>
              </Box>
            ) : null}
          </Button>
        </Box>
      </Modal>
      <Modal open={openModal2} onClose={() => setOpenModal2(false)}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 320,
            bgcolor: '#333',
            p: 2,
            borderRadius: '15px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                background: '#444',
                borderRadius: '100%',
                p: '3px',
                width: '22px',
                height: '22px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setOpenModal2(false);
              }}
            >
              <CloseIcon
                sx={{
                  color: '#888',
                  width: '16px',
                  height: '16px',
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              src="https://www.gravatar.com/avatar/asdasdasd?d=identicon"
              alt=""
              style={{
                borderRadius: '100%',
              }}
              width={70}
              height={70}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              my: '10px',
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#fff',
              }}
            >
              {walletAddress.slice(0, 5)}
              ...
              {walletAddress.slice(
                walletAddress.length - 4,
                walletAddress.length
              )}
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#999',
              }}
            >
              {currentBalance} {currentNetwork === 'bsc' ? 'BNB' : 'ETH'}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                mt: '10px',
                mr: '10px',
                height: '60px',
                borderRadius: '10px',
                boxShadow: 'none',
                background: '#444',
                '&:hover': {
                  background: '#555',
                },
              }}
              onClick={() => {
                copy(walletAddress);
                toast.success('Address successfully copied');
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <ContentCopyIcon
                  sx={{
                    width: '15px',
                    height: '15px',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: '600',
                    mt: '5px',
                  }}
                >
                  Copy Address
                </Typography>
              </Box>
            </Button>
            <Button
              variant="contained"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                mt: '10px',
                ml: '10px',
                height: '60px',
                borderRadius: '10px',
                boxShadow: 'none',
                background: '#444',
                '&:hover': {
                  background: '#555',
                },
              }}
              onClick={disconnectMetamask}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <LogoutIcon
                  sx={{
                    width: '15px',
                    height: '15px',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: '600',
                    mt: '5px',
                  }}
                >
                  Disconnect
                </Typography>
              </Box>
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  GeneralValueType,
  setCurrentNetwork,
  setOpenModal1,
  setOpenModal2,
} from '@/store/slices/generalSlice';
import {
  changeNetwork,
  createReferralURL,
  disconnectMetamask,
} from '@/lib/general';
import { toast } from 'react-toastify';
import copy from 'clipboard-copy';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface Props {}

const Models: React.FC<Props> = () => {
  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  return (
    <>
      <Modal
        open={generalValues.openModal1}
        onClose={() => dispatch(setOpenModal1(false))}
      >
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
                dispatch(setOpenModal1(false));
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
              background:
                generalValues.currentNetwork === 'bsc' ? '#1664c0' : '#333',
            }}
            onClick={() => {
              if (generalValues.currentNetwork !== 'bsc') {
                changeNetwork(
                  process.env.NODE_ENV === 'development' ? '0x61' : '0x38',
                  generalValues.walletAddress,
                  generalValues.currentNetwork,
                  dispatch
                );
                dispatch(setCurrentNetwork('bsc'));
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
                  objectFit: 'contain',
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
            {generalValues.currentNetwork === 'bsc' ? (
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
              background:
                generalValues.currentNetwork === 'eth' ? '#1664c0' : '#333',
            }}
            onClick={() => {
              if (generalValues.currentNetwork !== 'eth') {
                changeNetwork(
                  process.env.NODE_ENV === 'development' ? '0xaa36a7' : '0x1',
                  generalValues.walletAddress,
                  generalValues.currentNetwork,
                  dispatch
                );
                dispatch(setCurrentNetwork('eth'));
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
                  objectFit: 'contain',
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
            {generalValues.currentNetwork === 'eth' ? (
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
      <Modal
        open={generalValues.openModal2}
        onClose={() => dispatch(setOpenModal2(false))}
      >
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
                dispatch(setOpenModal2(false));
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
                objectFit: 'contain',
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
              {generalValues.walletAddress.slice(0, 5)}
              ...
              {generalValues.walletAddress.slice(
                generalValues.walletAddress.length - 4,
                generalValues.walletAddress.length
              )}
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#999',
              }}
            >
              {generalValues.currentBalance}{' '}
              {generalValues.currentNetwork === 'bsc' ? 'BNB' : 'ETH'}
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
                copy(generalValues.walletAddress);
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
              onClick={() => disconnectMetamask(router)}
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
              createReferralURL(
                generalValues.currentNetwork,
                generalValues.walletAddress
              );
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
                Copy Your Referral URL
              </Typography>
            </Box>
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Models;

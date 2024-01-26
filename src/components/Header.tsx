import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Link from 'next/link';
import {
  GeneralValueType,
  setOpenModal1,
  setOpenModal2,
} from '@/store/slices/generalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';

interface Props {}

const Header: React.FC<Props> = () => {
  const headList = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Stake',
      link: '/stake',
    },
    {
      name: 'My Stakes',
      link: '/my-stakes',
    },
    {
      name: 'Win $500k',
      link: '/win500k',
    },
    {
      name: 'Refer to Earn',
      link: '/referToEarn',
    },
    {
      name: 'How to buy',
      link: '/how-to-buy',
    },
  ];

  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  const dispatch = useDispatch<AppDispatch>();

  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        height: '70px',
        backgroundColor: 'rgba(80,80,80,.4)',
        backdropFilter: 'blur(32px)',
        border: 'none',
        position: 'fixed',
        top: '0px',
        left: '0px',
        right: '0px',
        boxShadow: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: '100',
        px: '40px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: 'none',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              src="/main.png"
              alt="Main Logo"
              width={40}
              height={40}
              priority={true}
              style={{
                objectFit: 'contain',
              }}
            />
            <Typography
              sx={{
                ml: '10px',
                color: '#D59F4E',
              }}
            >
              Golden Cobra
            </Typography>
          </Box>
        </Link>
        <Box
          sx={{
            ml: '10px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {headList.map((hl, i) => (
            <Box
              sx={{
                ml: '20px',
                '*': {
                  textDecoration: 'none',
                },
              }}
              key={i}
            >
              <Link href={hl.link} passHref>
                <Typography
                  sx={{
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {hl.name}
                </Typography>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {generalValues.walletAddress ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant="outlined"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                '&:hover': {
                  border: 'none',
                },
                '& svg': {
                  fill: 'white',
                },
              }}
              onClick={() => dispatch(setOpenModal1(true))}
            >
              {generalValues.currentNetwork === 'bsc' ? (
                <Image
                  style={{
                    marginLeft: '10px',
                    objectFit: 'contain',
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
                    objectFit: 'contain',
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
                px: '20px',
                '&:hover': {
                  background: '#000',
                },
              }}
              onClick={() => dispatch(setOpenModal2(true))}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                }}
              >
                {generalValues.walletAddress.slice(0, 5)}
                ...
                {generalValues.walletAddress.slice(
                  generalValues.walletAddress.length - 4,
                  generalValues.walletAddress.length
                )}
              </Typography>
            </Button>
          </Box>
        ) : null}
        <Button
          variant="contained"
          sx={{
            ml: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '40px',
            boxShadow: 'none',
            px: '30px',
            borderRadius: '15px',
            background: '#fbbf24',
            color: 'black',
            '&:hover': {
              background: '#f59e0b',
              boxShadow: 'none',
            },
          }}
          onClick={async () => {}}
        >
          Launch
        </Button>
      </Box>
    </Box>
  );
};

export default Header;

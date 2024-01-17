import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Link from 'next/link';

interface Props {
  walletAddress: string;
  setOpenModal2: Function;
  currentNetwork: string;
  setOpenModal1: Function;
}

const Header: React.FC<Props> = ({
  walletAddress,
  setOpenModal2,
  currentNetwork,
  setOpenModal1,
}: Props) => {
  const headList = [
    {
      name: 'Home',
      link: '#home',
    },
    {
      name: 'Buy $TXP',
      link: '#buyTXP',
    },
    {
      name: 'Whitepaper',
      link: '#whitepaper',
    },
    {
      name: 'Win $500k',
      link: '#win500k',
    },
    {
      name: 'Refer to Earn',
      link: '#referToEarn',
    },
    {
      name: 'How to buy',
      link: '#how-to-buy',
    },
  ];
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
        <Image
          src="/main.png"
          alt="Main Logo"
          width={180}
          height={50}
          priority={true}
          style={{
            objectFit: 'contain',
          }}
        />
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
        {walletAddress ? (
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
                px: '20px',
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

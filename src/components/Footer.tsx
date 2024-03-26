import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <Box
      sx={{
        py: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "auto",
        background: "rgb(9,8,8)",
        px: { xs: "50px", lg: "150px" },
        mt: "30px",
        "*": {
          textDecoration: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "space-evenly", md: "space-between" },
            alignItems: "center",
            width: { xs: "100%", sm: "70%", md: "30%", lg: "25%" },
          }}
        >
          <Link href="/" passHref>
            <Typography
              sx={{
                color: "rgb(130,130,129)",
                fontSize: { xs: "11px", sm: "13px" },
                letterSpacing: { xs: "1px", sm: "3px" },
              }}
            >
              Home
            </Typography>
          </Link>
          <Link href="/stake" passHref>
            <Typography
              sx={{
                color: "rgb(130,130,129)",
                fontSize: { xs: "11px", sm: "13px" },
                letterSpacing: { xs: "1px", sm: "3px" },
              }}
            >
              Staking
            </Typography>
          </Link>
          <Link href="/about-us" passHref>
            <Typography
              sx={{
                color: "rgb(130,130,129)",
                fontSize: { xs: "11px", sm: "13px" },
                letterSpacing: { xs: "1px", sm: "3px" },
              }}
            >
              About Us
            </Typography>
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-evenly" },
            alignItems: "center",
            width: { xs: "100%", sm: "70%", md: "30%", lg: "25%" },
            mt: { xs: "30px", md: "0px" },
          }}
        >
          <Image
            src="/main.png"
            alt="Main Logo"
            width={60}
            height={60}
            priority={true}
            style={{
              objectFit: "contain",
            }}
          />
          <Typography
            sx={{
              color: "#D59F4E",
              fontSize: { xs: "16px", sm: "20px" },
              ml: { xs: "20px", md: "0px" },
            }}
          >
            Golden Cobra
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "space-evenly", md: "space-between" },
            alignItems: "center",
            width: { xs: "100%", sm: "70%", md: "30%", lg: "25%" },
            mt: { xs: "30px", md: "0px" },
          }}
        >
          <Typography
            sx={{
              color: "rgb(130,130,129)",
              fontSize: { xs: "11px", sm: "13px" },
              letterSpacing: { xs: "1px", sm: "3px" },
            }}
          >
            Connect Wallet
          </Typography>
          <Link href="/connect-us" passHref>
            <Typography
              sx={{
                color: "rgb(130,130,129)",
                fontSize: { xs: "11px", sm: "13px" },
                letterSpacing: { xs: "1px", sm: "3px" },
              }}
            >
              Connect Us
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;

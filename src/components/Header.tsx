import { Box, Button, Drawer, Menu, MenuItem, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GeneralValueType,
  setCurrentNetwork,
  setOpenModal2,
  setWalletAddress,
} from "@/store/slices/generalSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { detectMetamask } from "@/lib/general";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/router";
import WalletIcon from "@mui/icons-material/Wallet";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import InfoIcon from "@mui/icons-material/Info";
import ForumIcon from "@mui/icons-material/Forum";
import AddIcon from "@mui/icons-material/Add";
import ChecklistIcon from "@mui/icons-material/Checklist";
import HistoryIcon from "@mui/icons-material/History";
import ArticleIcon from "@mui/icons-material/Article";

interface Props {}

const Header: React.FC<Props> = () => {
  const headList = [
    {
      name: "Home",
      link: "/#Home",
      target: "",
    },
    {
      name: "Staking",
      link: "/features",
      target: "",
    },
    {
      name: "Invest Benefits",
      link: "/#Invest-Benefits",
      target: "",
    },
    {
      name: "Tokenomics",
      link: "/#Tokenomics",
      target: "",
    },
    {
      name: "Whitepaper",
      link: "https://docs.goldencobra.io/",
      target: "_blank",
    },
  ];

  const featureList = [
    { name: "Stake", link: "/stake" },
    {
      name: "My Stakes",
      link: "/my-stakes",
    },
    {
      name: "Stake History",
      link: "/stake-history",
    },
  ];

  const { open } = useWeb3Modal();
  const { address, chainId } = useWeb3ModalAccount();
  const [clickedItem, setClickedItem] = useState("home");

  const generalValues: GeneralValueType = useSelector(
    (state: RootState) => state.general.value
  ) as GeneralValueType;

  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  useEffect(() => {
    dispatch(setWalletAddress(address ?? ""));
    detectMetamask(
      address?.toString() ?? generalValues.walletAddress,
      dispatch
    );
  }, [address, generalValues.walletAddress]);

  useEffect(() => {
    if (chainId === 1 || chainId === 11155111 || chainId === 5) {
      dispatch(setCurrentNetwork("eth"));
    } else if (chainId === 56 || chainId === 97) {
      dispatch(setCurrentNetwork("bsc"));
    }
  }, [chainId]);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openFeaturePopup = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        height: "70px",
        backgroundColor: "#000",
        backdropFilter: "blur(32px)",
        border: "none",
        position: "fixed",
        top: "0px",
        left: "0px",
        right: "0px",
        boxShadow: "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: "100",
        px: { xs: "10px", md: "20px", lg: "40px" },
      }}
    >
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box
          sx={{
            width: "250px",
            background: "#333",
            height: "100%",
            p: "20px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: "30px",
            }}
          >
            <Image
              src="/main.png"
              alt="Main Logo"
              width={40}
              height={40}
              priority={true}
              style={{
                objectFit: "contain",
              }}
            />
            <Typography
              sx={{
                ml: "10px",
                color: "#D59F4E",
              }}
            >
              Golden Cobra
            </Typography>
          </Box>

          {headList.map((hl, i) => (
            <Box
              sx={{
                ml: "20px",
                "*": {
                  textDecoration: "none",
                },
              }}
              key={i}
            >
              {hl.name === "Staking" ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: "10px",
                    }}
                  >
                    <StarIcon
                      sx={{
                        fill: "white",
                        mr: "10px",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    <Typography
                      sx={{
                        background:
                          router.asPath === hl.link
                            ? "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)"
                            : "rgb(130,130,129)",
                        color: "#f3f3f3",
                        display: "inline-flex",
                        WebkitBackgroundClip: "text",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      {hl.name}
                    </Typography>
                  </Box>
                  {featureList.map((feature, i) => (
                    <Box
                      key={i}
                      sx={{
                        ml: "25px",
                        mt: "10px",
                      }}
                    >
                      <Link href={feature.link} passHref>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {feature.name === "Stake" ? (
                            <AddIcon
                              sx={{
                                fill: "white",
                                mr: "10px",
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          ) : null}
                          {feature.name === "My Stakes" ? (
                            <ChecklistIcon
                              sx={{
                                fill: "white",
                                mr: "10px",
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          ) : null}
                          {feature.name === "Stake History" ? (
                            <HistoryIcon
                              sx={{
                                fill: "white",
                                mr: "10px",
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          ) : null}
                          <Typography
                            sx={{
                              background: "rgb(130,130,129)",
                              color: "#f3f3f3",
                              WebkitBackgroundClip: "text",
                              fontSize: "15px",
                            }}
                          >
                            {feature.name}
                          </Typography>
                        </Box>
                      </Link>
                    </Box>
                  ))}{" "}
                </>
              ) : (
                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={(e: any) => {
                    e.preventDefault();
                    if (hl.name === "Whitepaper") {
                      window.open(hl.link, "_blank");
                    } else if (router.asPath === "/") {
                      const itemName = hl.name.split(" ").join("-");

                      const item: any = document.getElementById(itemName);
                      item.scrollIntoView({
                        behavior: "smooth",
                      });
                      setClickedItem(hl.name);
                    } else {
                      router.push("/");
                      setTimeout(() => {
                        const itemName = hl.name.split(" ").join("-");

                        const item: any = document.getElementById(itemName);
                        item.scrollIntoView({
                          behavior: "smooth",
                        });
                        setClickedItem(hl.name);
                      }, 1000);
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mt: "10px",
                    }}
                  >
                    {hl.name === "Home" ? (
                      <HomeIcon
                        sx={{
                          fill: "white",
                          mr: "10px",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    ) : null}
                    {hl.name === "About Us" ? (
                      <InfoIcon
                        sx={{
                          fill: "white",
                          mr: "10px",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    ) : null}
                    {hl.name === "Connect Us" ? (
                      <ForumIcon
                        sx={{
                          fill: "white",
                          mr: "10px",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    ) : null}
                    {hl.name === "Whitepaper" ? (
                      <ArticleIcon
                        sx={{
                          fill: "white",
                          mr: "10px",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    ) : null}
                    <Typography
                      sx={{
                        background:
                          router.asPath === hl.link
                            ? "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)"
                            : "rgb(255,255,255)",
                        color: "#f3f3f3",

                        WebkitBackgroundClip: "text",
                        fontSize: "15px",
                      }}
                    >
                      {hl.name}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Drawer>
      <Button
        variant="text"
        sx={{
          ml: { xs: "0px", md: "20px" },
          display: { xs: "flex", md: "none" },
          justifyContent: "center",
          alignItems: "center",
          height: "40px",
          px: "30px",
          borderRadius: "5px",
          background: "black",
          color: "black",
        }}
        onClick={() => {
          setIsDrawerOpen(true);
        }}
      >
        <MenuIcon sx={{ fill: "#fff" }} />
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/main.png"
              alt="Main Logo"
              width={40}
              height={40}
              priority={true}
              style={{
                objectFit: "contain",
              }}
            />
            <Typography
              sx={{
                ml: "10px",
                color: "#D59F4E",
                display: { xs: "none", sm: "block" },
              }}
            >
              Golden Cobra
            </Typography>
          </Box>
        </Link>
      </Box>
      <Box
        sx={{
          ml: "10px",
          display: { xs: "none", md: "flex" },
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {headList.map((hl, i) => (
          <Box
            sx={{
              ml: "20px",
              "*": {
                textDecoration: "none",
              },
            }}
            key={i}
          >
            {hl.name === "Staking" ? (
              <>
                <Typography
                  sx={{
                    background:
                      router.asPath === hl.link
                        ? "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)"
                        : "rgb(255,255,255)",
                    color: "transparent",
                    WebkitBackgroundClip: "text",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                  onClick={handleClick}
                >
                  {hl.name}
                </Typography>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openFeaturePopup}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: "10px",
                      mt: "5px",
                      ml: "-25px",
                    },
                    "& ul": {
                      backgroundColor: "#030712",
                      border: "#666 1px solid",
                      borderRadius: "10px",
                    },
                    "& li:hover": {
                      backgroundColor: "#111827",
                      transitionProperty: "all",
                      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                      transitionDuration: "150ms",
                    },
                    "& a": {
                      textDecoration: "none !important",
                    },
                  }}
                >
                  {featureList.map((feature, i) => (
                    <Link href={feature.link} passHref key={i}>
                      <MenuItem onClick={handleClose}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              background: "rgb(255,255,255)",
                              color: "transparent",
                              WebkitBackgroundClip: "text",
                              fontSize: "15px",
                            }}
                          >
                            {feature.name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    </Link>
                  ))}
                </Menu>
              </>
            ) : (
              <Box
                sx={{
                  cursor: "pointer",
                }}
                onClick={(e: any) => {
                  e.preventDefault();
                  if (hl.name === "Whitepaper") {
                    window.open(hl.link, "_blank");
                  } else if (router.asPath === "/") {
                    const itemName = hl.name.split(" ").join("-");

                    const item: any = document.getElementById(itemName);
                    item.scrollIntoView({
                      behavior: "smooth",
                    });
                    setClickedItem(hl.name);
                  } else {
                    router.push("/");
                    setTimeout(() => {
                      const itemName = hl.name.split(" ").join("-");

                      const item: any = document.getElementById(itemName);
                      item.scrollIntoView({
                        behavior: "smooth",
                      });
                      setClickedItem(hl.name);
                    }, 1000);
                  }
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {clickedItem === hl.name ? (
                    <Box
                      sx={{
                        width: "5px",
                        height: "5px",
                        background:
                          "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
                        borderRadius: "100%",
                        mr: "5px",
                      }}
                    ></Box>
                  ) : null}
                  <Typography
                    sx={{
                      background:
                        clickedItem === hl.name
                          ? "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)"
                          : "rgb(255,255,255)",
                      color: "transparent",
                      WebkitBackgroundClip: "text",
                      fontSize: "15px",
                    }}
                  >
                    {hl.name}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {generalValues?.walletAddress ? (
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40px",
                borderRadius: "10px",
                border: "none !important",
                "&:hover": {
                  border: "none",
                },
                "& svg": {
                  fill: "white",
                },
              }}
              disabled
            >
              {generalValues.currentNetwork === "bsc" ? (
                <Image
                  style={{
                    marginLeft: "10px",
                    objectFit: "contain",
                  }}
                  src="/bnb-logo.png"
                  alt="BNB Logo"
                  width={22}
                  height={22}
                />
              ) : (
                <Image
                  style={{
                    marginLeft: "10px",
                    objectFit: "contain",
                  }}
                  src="/ethereum.png"
                  alt="ETH Logo"
                  width={30}
                  height={30}
                />
              )}
            </Button>
            <Button
              variant="contained"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100",
                height: "40px",
                borderRadius: "10px",
                boxShadow: "none",
                background: "rgb(65,65,65)",
                px: "20px",
                "&:hover": {
                  background: "#000",
                },
              }}
              onClick={() => dispatch(setOpenModal2(true))}
            >
              <Typography
                sx={{
                  fontSize: "14px",
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
            ml: { xs: "0px", md: "20px" },
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            height: "40px",
            px: "30px",
            borderRadius: "5px",
            background:
              "linear-gradient(90deg, rgb(203,238,85) 0%, rgb(222,228,83) 100%)",
            color: "black",
          }}
          onClick={() => {
            open();
          }}
        >
          <Typography
            sx={{
              textTransform: "capitalize",
            }}
          >
            {generalValues.walletAddress ? " Your Wallet" : "Connect Wallet"}
          </Typography>
        </Button>
        <Button
          variant="text"
          sx={{
            ml: { xs: "0px", md: "20px" },
            display: { xs: "flex", md: "none" },
            justifyContent: "center",
            alignItems: "center",
            height: "40px",
            px: "30px",
            borderRadius: "5px",
            background: "black",
            color: "black",
          }}
          onClick={() => {
            open();
          }}
        >
          <WalletIcon
            sx={{
              fill: "#fff",
            }}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default Header;

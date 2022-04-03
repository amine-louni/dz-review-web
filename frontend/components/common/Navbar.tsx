import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useTranslation from "next-translate/useTranslation";
import LanguageMenu from "./LanguageMenu";
import Link from "../../src/Link";
import theme from "../../src/theme";
import { refreshUserToken } from "../../utils/authed";
import { setUser } from "../../redux/slices/userSlice";
import { useAuth } from "../../hooks/useAuth";
import { ListItemIcon, ListItemText, MenuList } from "@mui/material";

import { IoAdd, IoLogOut, IoPerson } from "react-icons/io5";
import { useRouter } from "next/router";

interface INavbar {
  color?: "transparent" | "primary";
  position?: "relative" | "absolute";
}

const Navbar = ({ color = "transparent", position = "absolute" }: INavbar) => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state);
  const { t: tAuth } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const router = useRouter();
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { logoutHandler } = useAuth();
  return (
    <AppBar position={position} color={color} elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              color: "white",
              fontWeight: "600",
            }}
          >
            Algerian review
          </Typography>

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              color: theme.palette.common.white,
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {!user?.accessToken && (
                <MenuList>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link href="/login">
                      <Button
                        sx={{ marginRight: 1 }}
                        variant="contained"
                        color="secondary"
                      >
                        {tAuth("sign-in")}
                      </Button>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link href="/register">
                      <Button
                        sx={{ marginRight: 1 }}
                        variant="contained"
                        color="primary"
                      >
                        {tAuth("sign-up")}
                      </Button>
                    </Link>
                  </MenuItem>
                </MenuList>
              )}
              {user?.accessToken && (
                <MenuList>
                  <MenuItem>
                    <ListItemIcon>
                      <IoPerson />
                    </ListItemIcon>
                    <ListItemText>{tCommon("my-profile")}</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <Link href={"/business-form"}>
                      <ListItemIcon>
                        <IoAdd />
                      </ListItemIcon>
                      <ListItemText>{tCommon("create-business")}</ListItemText>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={logoutHandler}>
                    <ListItemIcon>
                      <IoLogOut />
                    </ListItemIcon>
                    <ListItemText>{tCommon("logout")}</ListItemText>
                  </MenuItem>
                </MenuList>
              )}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: {
                xs: "flex",
                md: "none",
                color: theme.palette.common.white,
              },
            }}
          >
            Algerian review
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            {!user.accessToken && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Link
                  sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
                  href="/login"
                >
                  <Button
                    sx={{ marginRight: 1 }}
                    variant="contained"
                    color="inherit"
                  >
                    {tAuth("sign-in")}
                  </Button>
                </Link>
                <Link
                  sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
                  href="/register"
                >
                  <Button
                    sx={{ marginRight: 1 }}
                    variant="contained"
                    color="primary"
                  >
                    {tAuth("sign-up")}
                  </Button>
                </Link>
                <LanguageMenu />
              </Box>
            )}
            {user.accessToken && (
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.common.white }}
                >{`${user?.userData?.firstName} ${user?.userData?.lastName}`}</Typography>
                <Tooltip title="Open settings">
                  <Typography
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, cursor: "pointer", marginLeft: "1rem" }}
                  >
                    <Avatar
                      alt={`${user?.userData?.firstName} ${user?.userData?.lastName}`}
                      src={user?.userData?.profilePictureUrl}
                    />
                  </Typography>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <IoPerson />
                    </ListItemIcon>
                    <ListItemText>{tCommon("my-profile")}</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => router.push("/business-form")}>
                    <ListItemIcon>
                      <IoAdd />
                    </ListItemIcon>
                    <ListItemText>{tCommon("create-business")}</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={logoutHandler}>
                    <ListItemIcon>
                      <IoLogOut />
                    </ListItemIcon>
                    <ListItemText>{tCommon("logout")}</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
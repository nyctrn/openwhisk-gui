import {
  UserMenu,
  MenuItemLink,
  Logout,
  useUserMenu,
  useLogout,
  UserMenuProps,
  useNotify,
} from "react-admin";
import SettingsIcon from "@mui/icons-material/Settings";
import { axiosClient } from "@/api/axiosClient";
import { Alert } from "@mui/material";

const UserSettings = () => {
  const { onClose } = useUserMenu();

  return (
    <MenuItemLink
      to="/settings"
      primaryText="Settings"
      leftIcon={<SettingsIcon />}
      onClick={onClose}
    />
  );
};

const CustomUserMenu = (props: UserMenuProps) => {
  const logout = useLogout();

  const notify = useNotify();

  const handleLogout = async () => {
    try {
      const { status } = await axiosClient.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`
      );

      if (status === 200) {
        logout();
      } else {
        throw new Error("There was an error while trying to log out.");
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(<Alert severity="error">{error.message}</Alert>);
    }
  };

  return (
    <UserMenu {...props}>
      <UserSettings />
      <Logout onClick={handleLogout} />
    </UserMenu>
  );
};
export default CustomUserMenu;

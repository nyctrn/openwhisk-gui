import { Paper, styled } from "@mui/material";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type DashboardMenuItemProps = {
  name: ReactNode;
  path: string;
  icon: ReactNode;
};

const DashboardMenuItemWrapper = styled(Paper)`
  display: flex;
  height: 150px;
  width: 80%;
  min-width: 300px;
  background-color: #fff;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
  gap: 1rem;

  svg {
    align-self: center;
    font-size: 2rem;
  }

  &:hover {
    box-shadow: 0px 0px 5px 0px rgb(97 129 255 / 31%);
  }
`;

const DashboardMenuItem = ({ name, path, icon }: DashboardMenuItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <DashboardMenuItemWrapper onClick={handleClick}>
      <span>{name}</span>
      {icon}
    </DashboardMenuItemWrapper>
  );
};

export default DashboardMenuItem;

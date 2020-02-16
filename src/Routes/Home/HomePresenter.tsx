import Menu from '../../Components/Menu';
import styled from '../../typed-components';
import React from 'react';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';

const Container = styled.div``;

const MenuButton = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

interface IProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  loading: boolean;
}

const HomePresenter: React.SFC<IProps> = ({
  isMenuOpen,
  toggleMenu,
  loading
}) => (
  <Container>
    <Helmet>
      <title>Home | Number</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu />}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{
        sidebar: {
          width: "80%",
          background: "white",
          zIndex: "10"
        }
      }}
    >
      {!loading && <MenuButton onClick={() => toggleMenu()}>|||</MenuButton>}
    </Sidebar>
  </Container>
);

export default HomePresenter;

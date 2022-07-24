import { Image, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { ConnectButton } from "web3uikit";
const NavBar = function () {
  return (
    <Menu mode="horizontal" defaultSelectedKeys={["/"]}>
      <Menu.Item>
        {" "}
        <Image width={200} src="/assets/logo.png" className="ml-1" />
      </Menu.Item>
      <Menu.Item key="/">
        <Link href="/"> My Warranty Cards </Link>
      </Menu.Item>
      <Menu.Item>
        <Link href="/Gifts"> Gift Cards</Link>
      </Menu.Item>
      <Menu.Item>
        <div className="mt-2">
          <ConnectButton chainId={80001} />
        </div>
      </Menu.Item>
    </Menu>
  );
};
export default NavBar;

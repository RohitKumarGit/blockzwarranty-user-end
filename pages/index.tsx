import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Result,
  Space,
} from "antd";
import { useWeb3Contract } from "react-moralis";
import Meta from "antd/lib/card/Meta";
import { components } from "moralis/types/generated/web3Api";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useMoralis,
  useMoralisWeb3Api,
  useWeb3ExecuteFunction,
} from "react-moralis";
import axios from "axios";
import { convertToPaddedToken, NFTMetaData, Token } from "../utils";
import { constants } from "../constants";
import moment from "moment";
import abi from "../abi.json";
import { ethers } from "ethers";
import Link from "next/link";
const calculateDaysLeft = (expiryDate: string) => {
  const expiryDateMoment = moment(expiryDate);
  const now = moment();
  const daysLeft = expiryDateMoment.diff(now, "days");
  return daysLeft;
};
const Home: NextPage = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [fetchingNFT, setFetchingNFT] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const [transerTokenId, setTransferTokenId] = useState("");
  const Web3Api = useMoralisWeb3Api();
  const { data, error, fetch, isFetching, isLoading } =
    useWeb3ExecuteFunction();
  const { Moralis } = useMoralis();
  const [warrantyTokens, setWarrantyTokens] = useState<
    components["schemas"]["nftOwner"][]
  >([]);
  const router = useRouter();

  const [sbts, setSbts] = useState<components["schemas"]["nftOwner"][]>([]);
  const transferToken = async ({ to }) => {
    if (transerTokenId.length === 0) return;
    setConfirmLoading(true);
    const token_id = parseInt(transerTokenId);
    const opt = {
      contractAddress: "eth",
      functionName: "transfer",
      abi: abi,
      params: {
        from: user.get("ethAddress"),
        to,
        amount: 1,
        id: token_id,
      },
      // params: [user.get("ethAddress"), to, 1, token_id],
    };
    // fetch({ params: opt });
    const web3 = await Moralis.enableWeb3();

    //const signer = (Moralis.provider as any).getSigner();
    console.log(ethers);
    console.log(process.env.CONTRACT_ADDRESS, user.get("ethAddress"));
    const signer = new ethers.providers.Web3Provider(web3.provider).getSigner();
    console.log(signer);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      abi["Deewarr"],
      signer
    );
    console.log(user.get("ethAddress").toString(), to.toString(), token_id);
    try {
      const result = await contract.transfer(
        user.get("ethAddress").toString(),
        to.toString(),
        token_id,
        1
      );
      message.success("Token transferred successfully , hash:" + result.hash);
    } catch (error) {
      message.error("Some thing went wrong");
    }

    setConfirmLoading(false);
    setVisible(false);
    //  function transfer( address from,address to,uint256 id,uint256 amount) public{
  };
  function handleTransfer(tokenId) {
    setTransferTokenId(tokenId);
    setVisible(true);
  }

  const { authenticate, isAuthenticated, user } = useMoralis();
  const fetchNFTS = async () => {
    console.log(user);

    if (!isAuthenticated) return;
    setFetchingNFT(true);
    console.log(user.get("ethAddress"));

    const { result } = await Web3Api.Web3API.account.getNFTs({
      chain: "mumbai",
      address: user.get("ethAddress"),
    });
    for (let i = 0; i < result.length; i++) {
      let { data } = await axios.get(
        constants.NFT_SERVER +
          convertToPaddedToken(result[i].token_id) +
          ".json"
      );
      if (
        result[i].token_address !==
        process.env.SOULBOUND_CONTRACT_ADDRESS.toLowerCase()
      ) {
        const resp = await axios.get(constants.BASE_URL + "/product", {
          params: { serial_no: (data as NFTMetaData).serial_No },
        });
        data = { ...data, ...resp.data };
      }

      result[i].metadata = data;
      setFetchingNFT(false);
    }
    setWarrantyTokens(
      result.filter(
        (nft) =>
          nft.token_address === process.env.CONTRACT_ADDRESS.toLowerCase()
      )
    );
    setSbts(
      result.filter(
        (nft) =>
          nft.token_address ===
          process.env.SOULBOUND_CONTRACT_ADDRESS.toLowerCase()
      )
    );

    console.log(warrantyTokens);
  };
  useEffect(() => {
    fetchNFTS();
  }, [isAuthenticated]);
  const handleCancel = function () {
    setVisible(false);
  };
  return isAuthenticated ? (
    fetchingNFT ? (
      <h1 className="mt-5">
        <Card loading></Card>
      </h1>
    ) : (
      <div>
        <Modal
          title="Tranfer token/warranty to another user"
          visible={visible}
          onOk={() => {
            form.validateFields().then((val) => {
              transferToken(val);
            });
          }}
          okText="Transfer"
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical" name="form_in_modal">
            <Form.Item
              label="Enter address to whome you want to transfer"
              name="to"
              rules={[
                {
                  required: true,
                  message: "This is required",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item></Form.Item>
          </Form>
        </Modal>
        {warrantyTokens.length === 0 ? (
          <Result title="You don't have any warranty token" />
        ) : (
          <>
            <PageHeader
              className="site-page-header"
              onBack={() => null}
              backIcon={false}
              title="Warranty Cards"
              subTitle="This page contains warranty cards in the form of NFT tokens "
            />
            <Space size={4}>
              {warrantyTokens.map((nft) => (
                <Card
                  actions={[
                    <Popconfirm
                      placement="top"
                      title="Do you really want to transfer the warranty card?"
                      okText="Yes"
                      onConfirm={() => handleTransfer(nft.token_id)}
                      cancelText="No"
                    >
                      <Button>Transfer</Button>
                    </Popconfirm>,
                    <Link href={"/tokens/" + nft.token_id}>
                      <Button>More info</Button>
                    </Link>,
                  ]}
                  hoverable
                  style={{ width: 300 }}
                  cover={
                    <img
                      alt="example"
                      src={
                        (nft.metadata as any).image
                          ? (nft.metadata as any).image
                          : "/assets/default.jpeg"
                      }
                    />
                  }
                >
                  <Meta
                    title={(nft.metadata as any).name}
                    description={(nft.metadata as any).description}
                  />
                  <span className=" text-green-400">
                    {calculateDaysLeft(
                      (nft.metadata as any as NFTMetaData).warranty_valid_uptill
                    )}{" "}
                    days left
                  </span>
                  <p className=" text-gray-600 font-medium">
                    Purchased on :{" "}
                    {moment(
                      (nft.metadata as any as NFTMetaData).purchase_date
                    ).format("DD-MM-YYYY")}
                  </p>
                  <p className=" text-blue-600 underline  font-medium">
                    view invoice{" "}
                  </p>
                </Card>
              ))}
            </Space>{" "}
          </>
        )}
      </div>
    )
  ) : (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page. Please connect your wallet to continue"
    />
  );
};

export default Home;

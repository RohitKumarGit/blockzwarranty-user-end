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
    console.log(result);
    setSbts(
      result.filter(
        (nft) =>
          nft.token_address ===
          process.env.SOULBOUND_CONTRACT_ADDRESS.toLowerCase()
      )
    );

    console.log(sbts);
  };
  useEffect(() => {
    fetchNFTS();
  }, [isAuthenticated]);

  return isAuthenticated ? (
    fetchingNFT ? (
      <h1 className="mt-5">
        <Card loading></Card>
      </h1>
    ) : (
      <div>
        {sbts.length === 0 ? (
          <Result title="You don't have any gift cards" />
        ) : (
          <>
            <PageHeader
              className="site-page-header"
              onBack={() => null}
              backIcon={false}
              title="Gift Cards"
              subTitle="This page contains gift cards in the form of NFT tokens "
            />
            <Space size={4}>
              {sbts.map((nft) => (
                <article className="gift-card">
                  <div className="gift-card__image"></div>
                  <section className="gift-card__content">
                    <div className="gift-card__amount">
                      ${(nft.metadata as any).value}
                    </div>
                    <div className="gift-card__amount-remaining">
                      ${(nft.metadata as any).value} Remaining
                    </div>
                    <div className="gift-card__code">345D 4353 FF77 DFG5</div>
                    <div className="gift-card__msg">
                      Use this code at checkout to redeem your gift card
                    </div>
                  </section>
                </article>
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

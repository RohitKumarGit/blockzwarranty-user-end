import {
  Button,
  Col,
  Divider,
  message,
  PageHeader,
  Row,
  Space,
  Table,
} from "antd";
import Column from "antd/lib/table/Column";
import axios from "axios";
import moment from "moment";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralisQuery } from "react-moralis";
import { constants } from "../../constants";
import { convertToPaddedToken, NFTMetaData } from "../../utils";
class Transaction {
  from: string;
  to: string;
  token: string;
  createdAt: string;
  transaction_hash: string;
}
const TokenDetails: NextPage = () => {
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);
  const [tokenMetaData, setTokenMetaData] = useState<NFTMetaData>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const allMintedTokenQuery = useMoralisQuery(
    constants.TRANSFER_TABLE_NAME,
    (query) => query.equalTo("amount", "1"),
    [],
    { autoFetch: false }
  );
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    allMintedTokenQuery
      .fetch()
      .then((data) => {
        if (!data) return;
        const filteredData = data
          .filter((item) => {
            return (
              item.get("token") == window.location.href.split("/").slice(-1)
            );
          })
          .map((item) => {
            return {
              from: item.get("from"),
              to: item.get("to"),
              token: item.get("token"),
              createdAt: item.get("createdAt"),
              transaction_hash: item.get("transaction_hash"),
            };
          });
        console.log(filteredData);
        axios
          .get(
            constants.NFT_SERVER +
              convertToPaddedToken(window.location.href.split("/").slice(-1)) +
              ".json"
          )
          .then(({ data }) => {
            console.log(data);
            setTokenMetaData(data);
            setLoading(false);
          });
        setTransactions(filteredData);
      })
      .catch((err) => {
        console.log(err);
        message.error("Some thing went wrong");
      });
  }, []);
  const column = [
    {
      title: "From",
      dataIndex: "from",
      render: (_, record) => (
        <Space size="middle">
          <a
            href={constants.POLYGON_URL_ADDRESS + record.from}
            target="_blank˝"
          >
            {record.from}
          </a>
        </Space>
      ),
    },
    {
      title: "To",
      dataIndex: "to",
      render: (_, record) => (
        <Space size="middle">
          <a href={constants.POLYGON_URL_ADDRESS + record.to} target="_blank˝">
            {record.to}
          </a>
        </Space>
      ),
    },
    {
      title: "Transfer Date",
      dataIndex: "createdAt",
      render: (_, record) => (
        <span>
          {moment(record.createdAt as string)
            .toDate()
            .toString()
            .slice(0, 24) + " (IST)"}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "",
      render: (_, record) => (
        <Space size="middle">
          <a
            href={constants.POLYGON_URL_TX + record.transaction_hash}
            target="_blank˝"
          >
            <Button type="primary">Pologon Scan</Button>
          </a>
        </Space>
      ),
    },
  ];
  return loading ? (
    <h1>Loading..</h1>
  ) : (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="Ownership chain"
      />
      <h3>
        This page contains details of the warranty card along with the chain of
        ownership details collected from blockchain
      </h3>
      <div className="card  p-5">
        <Row>
          <Col span={12}>
            <Space direction="vertical">
              <div>
                <span className=" font-bold text-purple-500">
                  {" "}
                  Purchase Date :{" "}
                </span>
                {tokenMetaData.purchase_date}
              </div>
              <div>
                {" "}
                <span className=" font-bold text-purple-500">
                  {" "}
                  Serial Number :{" "}
                </span>{" "}
                {tokenMetaData.serial_No}
              </div>
              <div>
                {" "}
                <span className=" font-bold text-purple-500">
                  {" "}
                  Original owner :{" "}
                </span>{" "}
                {tokenMetaData.sold_to}
              </div>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical">
              <div>
                <span className=" font-bold text-purple-500">
                  {" "}
                  Contract Address :{" "}
                </span>{" "}
                {process.env.CONTRACT_ADDRESS}
              </div>
              <div>
                <span className=" font-bold text-purple-500">
                  {" "}
                  Warranty Valid uptill :{" "}
                </span>{" "}
                {moment(tokenMetaData.warranty_valid_uptill).diff(
                  moment(),
                  "days"
                )}{" "}
                days
              </div>
            </Space>
          </Col>
        </Row>
        <Divider type="vertical"></Divider>
      </div>
      <Table dataSource={transactions} columns={column} />
    </div>
  );
};
export default TokenDetails;

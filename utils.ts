export class Product {
  serial_no?: string; // key
  name: string;
  description: string;
  isSold: boolean;
  token_id: number;
  brand_id: string;
  image: any;
  metaData?: NFTMetaData;
}
export class User {
  products: (string | Product)[]; // list of serial nos
  name: string;
  phone: string; // key
  blockChainAddress: string;
}
export class Token {
  token_id: number;
  serial_no: string;
}
export class NFTMetaData {
  serial_No: string; // mentioned on product
  sold_to: string; // hex address of buying user
  purchase_date: string; // UNIX format time
  warranty_valid_uptill: string; // UNIX format time
  brand_id: string; // refers to brand
  constructor(data) {
    this.serial_No = data.serial_no;
    this.sold_to = data.blockChainAddress;
    this.purchase_date = data.purchase_date;
    this.warranty_valid_uptill = data.warranty_valid_uptill;
    this.brand_id = data.brand_id;
  }
}
export const convertToPaddedToken = function (tokenId: any) {
  tokenId = parseInt(tokenId);
  return (
    "00000000000000000000000000000000000000000000000000000000" +
    tokenId.toString(16)
  ).slice(-64);
};

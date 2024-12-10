/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
const mongoose = require("mongoose");
const { getMetadataLink, consoleHeader } = require("../concordium/helpers");
const LimitModel = require("../models/limitModel");
const Token = require("../models/tokenModel");

const findTokenData = async (contract) => {
  const { index, subindex, tokenId } = contract;
  const result = await Token.findOne({
    contractIndex: index,
    contractSubindex: subindex,
    tokenId: tokenId,
  }).exec();
  return result;
};

const createJson = (token) => {
  const {
    _id,
    contractIndex,
    contractSubindex,
    tokenId,
    contractName,
    metadata: { symbol, thumbnail, display, artifact, decimals },
  } = token;

  return {
    id: _id,
    symbol: symbol || "",
    images: {
      thumbnail: thumbnail
        ? {
            url: thumbnail.url.replace(
              "concordium-servernode.dev-site.space",
              "api.ars.io"
            ),
          }
        : "",
      display: display
        ? {
            url: display.url.replace(
              "concordium-servernode.dev-site.space",
              "api.ars.io"
            ),
          }
        : "",
      artifact: artifact
        ? {
            url: artifact.url.replace(
              "concordium-servernode.dev-site.space",
              "api.ars.io"
            ),
          }
        : "",
    },
    address: {
      index: contractIndex,
      subindex: contractSubindex,
    },
    tokenId: tokenId || "",
    contractName: contractName || "",
    decimals: +decimals || "",
  };
};

const isHEX = (string) => /^[0-9A-F]+$/i.test(string);

const validateContract = (contract) => {
  const { index, tokenId } = contract;

  switch (true) {
    case !index:
      return {
        isValid: false,
        message: "Contract Index is required",
      };
    case tokenId === undefined:
      return {
        isValid: false,
        message: "Token Id is required",
      };
    case tokenId !== "" && !isHEX(tokenId):
      return {
        isValid: false,
        message: "Token Id must be in HEX",
      };
    default:
      return {
        isValid: true,
        message: "",
      };
  }
};

const isContractExistsInDB = async (contract) => {
  const result = await findTokenData(contract);

  if (result) {
    return true;
  }

  return false;
};

const updateToken = async (contract, from = "") => {
  const metadataResult = await getMetadataLink(contract);

  if (!metadataResult.isValid) {
    return null;
  }

  const { link, contractName } = metadataResult;

  try {
    const data = await fetch(link);
    const metadata = await data.json();

    if (metadata.unique) {
      return null;
    }

    const isTokenExists = await isContractExistsInDB(contract);

    if (!isTokenExists) {
      consoleHeader(`Add contract!!! From: ${from}:`);
      console.dir(contract, { depth: null });
      await Token.create({
        contractIndex: contract.index,
        contractSubindex: contract.subindex,
        tokenId: contract.tokenId.toUpperCase(),
        contractName,
        metadata,
      });
    } else {
      consoleHeader(`Update contract!!! From: ${from}:`);
      console.dir(contract, { depth: null });
      await Token.replaceOne(
        {
          contractIndex: contract.index,
          contractSubindex: contract.subindex,
          tokenId: contract.tokenId.toUpperCase(),
        },
        {
          contractIndex: contract.index,
          contractSubindex: contract.subindex,
          tokenId: contract.tokenId.toUpperCase(),
          contractName,
          metadata,
        }
      );
    }
  } catch (error) {
    console.log(error.message)
  }
};

const getAllTokensFromDB = async () => {
  const tokenData = await Token.find();

  return tokenData;
};

const getTokens = async (req, res) => {
  try {
    const tokensData = await Token.find();
    const response = tokensData.map((token) => createJson(token));
    res.status(200).json({
      response,
    });
  } catch (error) {
    return res.status(400).json({
      message: `Error happened on server: "${error}" `,
    });
  }
};

const postToken = async (req, res) => {
  const { tokenId, tokenIndex, tokenSubindex } = req.body;
  const contract = {
    index: tokenIndex,
    subindex: tokenSubindex || 0,
    tokenId,
  };

  const contractValidation = validateContract(contract);

  if (!contractValidation.isValid) {
    return res.status(400).json({
      message: contractValidation.message,
    });
  }

  const metadataResult = await getMetadataLink(contract);
  console.log(metadataResult);
  if (!metadataResult.isValid) {
    return res.status(400).json({
      message: metadataResult.message,
    });
  }

  const { link, contractName } = metadataResult;

  try {
    const data = await fetch(link);
    const metadata = await data.json();

    if (metadata.unique) {
      return res.status(400).json({
        message: "This is nft",
      });
    }

    const isTokenExists = await isContractExistsInDB(contract);

    if (!isTokenExists) {
      console.dir(contract, { depth: null });
      await Token.create({
        contractIndex: contract.index,
        contractSubindex: contract.subindex,
        tokenId: contract.tokenId.toUpperCase(),
        contractName,
        metadata,
      });
    } else {
      console.dir(contract, { depth: null });
      await Token.replaceOne(
        {
          contractIndex: contract.index,
          contractSubindex: contract.subindex,
          tokenId: contract.tokenId.toUpperCase(),
        },
        {
          contractIndex: contract.index,
          contractSubindex: contract.subindex,
          tokenId: contract.tokenId.toUpperCase(),
          contractName,
          metadata,
        }
      );
      return res.status(400).json({
        message: "Contract is already exists in list",
      });
    }

    const token = await findTokenData(contract);
    const response = createJson(token);
    console.log(token, "token is");
    return res.status(200).json({
      response,
    });
  } catch (error) {
    return res.status(400).json({
      message: `The link in metadata is not valid ${error}`,
    });
  }
};

const limit = async (req, res) => {
  const {
    tokenfromvalue,
    tokentovalue,
    tokenfromName,
    tokentoName,
    tokenToindex,
    tokenFromindex,
    tokenFromid,
    tokenToid,
    address,
    expiry,
  } = req.body;
  const price = tokentovalue / tokenfromvalue;

  try {
    const limitData = await LimitModel.create({
      tokenfromvalue,
      tokentovalue,
      tokenfromName,
      tokentoName,
      price,
      tokenToindex,
      tokenFromindex,
      tokenFromid,
      tokenToid,
      address,
      paid: false,
      expiry,
      refund: false,
    });
    res.json(limitData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLimitOrders = async (req, res) => {
  try {
    const limitOrders = await LimitModel.find({});

    return limitOrders;
  } catch (error) {
    console.error("Error fetching LimitOrders:", error);
    res.status(500).json({ error: "Unable to fetch LimitOrders" });
  }
};

const getLimitOrdersbywallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    const limitOrders = await LimitModel.find({ address: walletAddress });
    res.json(limitOrders);
  } catch (error) {
    console.error("Error fetching Limit Orders:", error);
    res.status(500).json({ error: "Unable to fetch Limit Orders" });
  }
};

const compeleteLimitOrders = async (req, res) => {
  const { tokenfromindex, tokentoindex } = req.body;
  try {
    const limitOrders = await getLimitOrders();
    const filteredOrders = limitOrders.filter(
      (order) =>
        order.tokenToindex === tokentoindex &&
        order.tokenFromindex === tokenfromindex
    );

    res.json({ requestBody: req.body, filteredOrders });
  } catch (error) {
    console.error("Error fetching LimitOrders:", error);
    res.status(500).json({ error: "Unable to fetch LimitOrders" });
  }
};
const hello = async (req, res) => {
  try {
    res.send("Hello");
    // eslint-disable-next-line no-unreachable
  } catch (error) {
    console.error(error);
  }
};
const refundLimitOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = new mongoose.Types.ObjectId(id);

    console.log(objectId, "refund");

    const updatedDocument = await LimitModel.findByIdAndUpdate(
      objectId,
      { $set: { refund: true } },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json(updatedDocument);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  updateToken,
  getAllTokensFromDB,
  postToken,
  getTokens,
  findTokenData,
  limit,
  getLimitOrders,
  compeleteLimitOrders,
  hello,
  getLimitOrdersbywallet,
  refundLimitOrder,
};

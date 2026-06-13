// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract WeekoPublication is ERC721URIStorage, Ownable {
    struct Publication {
        address creator;
        string title;
        string contentURI;
        bytes32 workflowHash;
        uint64 createdAt;
        uint256 totalMinted;
    }

    uint256 public mintPrice;
    uint256 public nextPublicationId = 1;
    uint256 public nextTokenId = 1;

    mapping(uint256 publicationId => Publication) public publications;
    mapping(uint256 tokenId => uint256 publicationId) public tokenPublication;

    event PublicationPublished(
        uint256 indexed publicationId,
        address indexed creator,
        string title,
        string contentURI,
        bytes32 workflowHash
    );
    event PublicationMinted(
        uint256 indexed publicationId,
        uint256 indexed tokenId,
        address indexed collector,
        string tokenURI
    );
    event MintPriceUpdated(uint256 mintPrice);

    constructor(address initialOwner, uint256 initialMintPrice)
        ERC721("Weeko Publication Collectible", "WEEKO")
        Ownable(initialOwner)
    {
        mintPrice = initialMintPrice;
    }

    function publish(
        string calldata title,
        string calldata contentURI,
        bytes32 workflowHash
    ) external returns (uint256 publicationId) {
        require(bytes(title).length > 0, "Title required");
        require(bytes(contentURI).length > 0, "Content URI required");
        require(workflowHash != bytes32(0), "Workflow hash required");

        publicationId = nextPublicationId++;
        publications[publicationId] = Publication({
            creator: msg.sender,
            title: title,
            contentURI: contentURI,
            workflowHash: workflowHash,
            createdAt: uint64(block.timestamp),
            totalMinted: 0
        });

        emit PublicationPublished(publicationId, msg.sender, title, contentURI, workflowHash);
    }

    function mint(uint256 publicationId) external payable returns (uint256 tokenId) {
        Publication storage publication = publications[publicationId];
        require(publication.creator != address(0), "Publication not found");
        require(msg.value >= mintPrice, "Insufficient mint price");

        tokenId = nextTokenId++;
        publication.totalMinted += 1;
        tokenPublication[tokenId] = publicationId;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, publication.contentURI);

        emit PublicationMinted(publicationId, tokenId, msg.sender, publication.contentURI);
    }

    function setMintPrice(uint256 newMintPrice) external onlyOwner {
        mintPrice = newMintPrice;
        emit MintPriceUpdated(newMintPrice);
    }

    function withdraw() external onlyOwner {
        (bool success,) = owner().call{ value: address(this).balance }("");
        require(success, "Withdraw failed");
    }
}

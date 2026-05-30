const { ScrapResDTO } = require('../dtos/scrap.dto');

const toScrapResDTO = (scrapEntity) => {
    return new ScrapResDTO({
        userId: scrapEntity.userId,
        postId: scrapEntity.postId,
        createdAt: scrapEntity.createdAt,
    });
};

module.exports = {
    toScrapResDTO,
};
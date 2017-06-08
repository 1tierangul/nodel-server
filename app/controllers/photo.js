const { Router } = require('express');
const multer  = require('multer');
const uuid = require('uuid/v4');
const path = require('path');
const ensureAuth = require('../middlewares/ensure-auth');
const Photo = require('../models/photo');
const PhotoTag = require('../models/photo-tag');
const Tag = require('../models/tag');
const User = require('../models/user');
const config = require('../config');

const router = new Router();
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, next) {
            next(null, config.paths.static);
        },

        filename(req, file, next) {
            const extension = path.extname(file.originalname);

            next(null, `${file.fieldname}_${uuid()}${extension}`);
        },
    }),
});

router.get('/', ensureAuth, async (req, res) => {
    const startIndex = req.query.startIndex || 0;
    const limit = req.query.limit || 20;
    const hashTag = req.query.hashTag;

    const photos = await Photo.findAll({
        offset: startIndex,
        include: [
            {
                model: PhotoTag,
                as: 'tags',
            },
        ],
        order: ['timestamp'],
        limit,
    });

    let pPhotos = photos.map(photo => photo.getPublicData());

    for (let i = 0; i < pPhotos.length; i ++) {
        const photo = pPhotos[i];
        const photoTags = photos[i].tags;

        photo.hashTags = [];
        const owner = await User.findById(photos[i].ownerId);
        photo.owner = owner.getPublicData();

        for (let j = 0; j < photoTags.length; j++) {
            const tag = await Tag.findById(photoTags[j].tagId);
            photo.hashTags.push(tag.name);
        }
    }

    pPhotos = pPhotos.filter((tPhoto) => {
        if (!hashTag) {
            return true;
        }

        return tPhoto.hashTags.includes(hashTag);
    });

    res.status(200);
    res.send(pPhotos);
});

router.post('/', ensureAuth, upload.single('img'), async (req, res) => {
    const context = req.body.context;
    const rHashTags = JSON.parse(req.body.hashTags);

    const photo = await Photo.create({
        ownerId: req.user.id,
        imgSrc: req.file.filename,
        context,
    });

    for (let i = 0; i < rHashTags.length; i ++) {
        let tag = await Tag.findOne({
            where: { name: rHashTags[i] },
        });

        if (!tag) {
            tag = await Tag.create({
                name: rHashTags[i],
            });
        }

        await PhotoTag.create({
            photoId: photo.id,
            tagId: tag.id,
        });
    }

    const owner = await User.findById(req.user.id);
    const hashTags = await photo.getHashTags();

    res.status(200);
    res.send({
        id: photo.id,
        owner: owner.getPublicData(),
        timestamp: photo.timestamp,
        imgSrc: photo.imgSrc,
        context: photo.context,
        hashTags,
    });
});

module.exports = router;

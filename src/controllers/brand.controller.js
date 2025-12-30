import CustomError from "../middlewares/error_handler.middleware.js";
import Brand from "../models/brand.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { deleteFile, uploadToCloud } from "../utils/cloudinary.utils.js";

const dir = '/brands'

// get all
export const getAll = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});

  res.status(200).json({
    message: "Brands fetched",
    status: "success",
    data: brands,
  });
});

// get by id
export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findOne({ _id: id });

  if (!brand) {
    throw new CustomError("Brand not found", 404);
  }

  res.status(200).json({
    message: "Brand fetched",
    status: "success",
    data: brand,
  });
});

// create
export const create = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;

    if (!file) {
        throw new CustomError('image is required', 400)
    }

    const brand = new Brand({ name, description })

    const { path, public_id } = await uploadToCloud(file.path,dir);
    
    brand.image = {
        path,
        public_id
    }

    await brand.save();

    res.status(201).json({
        message: 'Brand created.',
        status: 'success',
        data:brand
    })

})

// update
export const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body
    const file = req.file

    const brand = await Brand.findOne({ _id: id })
    
    if (!brand) {
        throw new CustomError('Brand not found',404)
    }

    if (name) brand.name = name;
    if (description) brand.description = description;

    if (file) {
        const { path, public_id } = await uploadToCloud(file.path, dir);
        if (brand.image) {
            await deleteFile(brand.image?.public_id)
        }
        brand.image = {
            path,
            public_id
        }
    }

    await brand.save()

    res.status(201).json({
        message: 'Brand updated',
        status: 'success',
        data:brand
    })

})

//! delete
export const remove = asyncHandler(async(req,res)=> {
    const { id } = req.params
    
    const brand = await Brand.findOne({ _id: id })
    
    if (!brand) {
        throw new CustomError('Brand not found',404)
    }

    if (brand.image) {
        await deleteFile(brand.image?.public_id)
    }

    await brand.deleteOne()

    res.status(200).json({
        message: 'Brand deleted',
        status: 'success',
        data:null
    })

})

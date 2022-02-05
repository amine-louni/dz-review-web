import { Router } from "express";
import express from 'express'
import { createBusiness, readOneBusiness, updateBusiness } from "../controllers/businessController";
import { createBusinesssValidator, updateBusinesssValidator } from "../middlewares/validators/businessValidator";
import { protect } from "../controllers/authController";




const router: Router = express.Router();


router.post('/', protect, createBusinesssValidator, createBusiness)
router.get('/:uuid', readOneBusiness)
router.patch('/:uuid', protect, updateBusinesssValidator, updateBusiness)



export default router;